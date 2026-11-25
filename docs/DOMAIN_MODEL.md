# Domain model

Generated from the Zod schemas in `src/shared/domain`. The schemas are the source of
truth — if a diagram here and a schema there disagree, the schema is right and this
file is stale.

Diagrams are Mermaid, so they render in GitHub and in the VS Code markdown preview,
and they diff as text when the model changes.

Nullable fields are shown without a marker. These are the nullable ones:
`Assignment.dueAt`, `Submission.submittedAt`, `Submission.score`, `Attempt.submittedAt`,
`Attempt.score`, `Feedback.awardedPoints`, `Session.level`. Optional ones are
`Material.description` and `Activity.instructions`.

## 1. Entities and relationships

A filled diamond is composition: the child is embedded in the parent's record, not
referenced by id. A plain arrow is a reference by id, labelled with the field that
holds it.

```mermaid
classDiagram
    direction TB

    class User {
        <<userSchema>>
        +string id
        +string name
        +string email
        +Role role
    }
    class Teacher {
        <<teacherSchema>>
        +Role role = teacher
    }
    class Student {
        <<studentSchema>>
        +Role role = student
        +CefrLevel level
        +string teacherId
        +datetime joinedAt
    }
    class Session {
        <<sessionSchema>>
        +User user
        +CefrLevel level
    }

    class Lesson {
        <<lessonSchema>>
        +string id
        +string title
        +string summary
        +CefrLevel level
        +LessonStatus status
        +string authorId
        +datetime createdAt
        +datetime updatedAt
    }
    class Material {
        <<materialSchema>>
        +string id
        +string title
        +MaterialKind kind
        +string url
        +string description
    }
    class Activity {
        <<activitySchema>>
        +string id
        +string title
        +string instructions
        +number points
        +ActivityType type
    }

    class Assignment {
        <<assignmentSchema>>
        +string id
        +string lessonId
        +string studentId
        +string assignedById
        +datetime assignedAt
        +datetime dueAt
        +AssignmentStatus status
    }
    class Submission {
        <<submissionSchema>>
        +string id
        +string assignmentId
        +string studentId
        +datetime startedAt
        +datetime submittedAt
        +Score score
    }
    class Attempt {
        <<attemptSchema>>
        +string id
        +string activityId
        +ActivityType activityType
        +datetime startedAt
        +datetime submittedAt
        +Score score
    }
    class Answer {
        <<answerSchema>>
        +string questionId
        +ActivityType type
    }
    class Score {
        <<scoreSchema>>
        +number correct
        +number total
        +number percentage
    }
    class Feedback {
        <<feedbackSchema>>
        +string id
        +string submissionId
        +string teacherId
        +string comment
        +number awardedPoints
        +datetime createdAt
    }

    User <|-- Teacher
    User <|-- Student
    Session --> User

    Teacher "1" --> "*" Student : teacherId
    Teacher "1" --> "*" Lesson : authorId
    Lesson "1" *-- "*" Material : embedded
    Lesson "1" *-- "*" Activity : embedded

    Assignment --> Lesson : lessonId
    Assignment --> Student : studentId
    Assignment --> Teacher : assignedById

    Assignment "1" --> "0..1" Submission
    Submission "1" *-- "*" Attempt
    Attempt "1" *-- "*" Answer
    Attempt --> Activity : activityId
    Submission ..> Score
    Attempt ..> Score

    Feedback --> Submission : submissionId
    Feedback --> Teacher : teacherId
```

Two shapes worth noticing, because they are decisions rather than consequences:

`Lesson` embeds its materials and activities instead of referencing them. Page 05
always renders a lesson together with its activities, so a join would buy nothing.
Revisit if a lesson is ever shared across teachers.

`Submission` exists at most once per `Assignment` and is created lazily — it appears
the first time the student saves an attempt, not when the assignment is handed out.
That is why the multiplicity is `0..1` and not `1`.

## 2. The two discriminated unions

`Activity` and `Answer` are unions on a `type` field, not base classes with optional
extras. Adding a fourth activity type makes `ActivityRenderer` (S3.2) fail to compile
until its branch exists — which is the point.

```mermaid
classDiagram
    direction LR

    class Activity {
        <<discriminated union on type>>
    }
    class MultipleChoiceActivity {
        +type = multiple-choice
        +MultipleChoiceQuestion[] questions
    }
    class GapFillActivity {
        +type = gap-fill
        +GapFillQuestion[] questions
    }
    class WritingActivity {
        +type = writing
        +string prompt
        +number minWords
        +number maxWords
    }
    class MultipleChoiceQuestion {
        +string id
        +string prompt
        +Option[] options
        +string correctOptionId
    }
    class GapFillQuestion {
        +string id
        +string template
        +Gap[] gaps
    }
    class Option {
        +string id
        +string text
    }
    class Gap {
        +string id
        +string answer
        +string[] alternatives
    }

    Activity <|-- MultipleChoiceActivity
    Activity <|-- GapFillActivity
    Activity <|-- WritingActivity
    MultipleChoiceActivity "1" *-- "1..*" MultipleChoiceQuestion
    GapFillActivity "1" *-- "1..*" GapFillQuestion
    MultipleChoiceQuestion "1" *-- "2..*" Option
    GapFillQuestion "1" *-- "1..*" Gap

    class Answer {
        <<discriminated union on type>>
        +string questionId
    }
    class MultipleChoiceAnswer {
        +type = multiple-choice
        +string selectedOptionId
    }
    class GapFillAnswer {
        +type = gap-fill
        +Record~string,string~ gaps
    }
    class WritingAnswer {
        +type = writing
        +string text
    }

    Answer <|-- MultipleChoiceAnswer
    Answer <|-- GapFillAnswer
    Answer <|-- WritingAnswer

    MultipleChoiceAnswer ..> MultipleChoiceQuestion : graded against
    GapFillAnswer ..> GapFillQuestion : graded against
    WritingAnswer ..> WritingActivity : teacher scores
```

Three constraints live in the schema rather than in the forms, so invalid content
cannot be constructed at all: a `correctOptionId` must name one of its own options,
every `Gap.id` must appear as a `{{placeholder}}` in its question's `template`, and
`maxWords` must be at least `minWords`.

`GapFillAnswer.gaps` is keyed by gap id. A missing key is an unfilled gap, which is
not the same as a wrong one — grading counts it against the total either way, but the
review screen can tell them apart.

## 3. Assignment lifecycle

The five states are exactly what `StatusBadge` (S2.1) renders, so the badge needs no
mapping table of its own.

```mermaid
stateDiagram-v2
    direction LR

    [*] --> not_started : assign()
    not_started --> in_progress : saveAttempt()
    in_progress --> in_progress : saveAttempt() replaces the attempt
    in_progress --> submitted : submit()
    submitted --> reviewed : saveFeedback()
    reviewed --> [*]

    not_started --> overdue : derived when dueAt has passed
    in_progress --> overdue : derived when dueAt has passed
    overdue --> in_progress : saveAttempt()
    overdue --> submitted : submit()

    note right of overdue
        Derived at read time from dueAt.
        Never stored, never reached by
        submitted or reviewed.
    end note

    note right of submitted
        submit() and saveAttempt() both
        reject with ServiceError conflict
        from here on.
    end note
```

`overdue` is the odd one: it is never written to a record. `resolveStatus()` in
`mock-assignment-service.ts` derives it from `dueAt` on every read, and refuses to
apply it to work that is already submitted or reviewed. A late submission therefore
reads as `submitted`, not as `overdue`, which is what the teacher's queue needs.

The transition out of `submitted` is one-way for the student: both `submit()` and
`saveAttempt()` raise `ServiceError("conflict")` from there on. That is the duplicate
submission prevention scoped in S4.2, enforced in the service rather than in
`SubmissionBar`.

## Known gap

`Feedback` here models only teacher-written, synchronous review. The S1.2 acceptance
criteria ask for a `source` (AI or teacher) and a processing state, which are not in
the schema and so are not in this diagram. Adding them makes feedback asynchronous,
which changes `FeedbackPanel` (S4.6) and `AnswerReview` (S4.5) — pending a product
decision.
