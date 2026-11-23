# Reuse inventory · S1.1

Baseline: `develop` @ `91b863f`. This record gates the estimate for stages 2–6, per the delivery scope.

## 1. What already exists

### `src/shared/ui` — six primitives

| Component | Covers today | Carries into stage 2+ |
| --- | --- | --- |
| `Button` | `primary` / `secondary`, `pending` (disables + `aria-busy`), `type="button"` by default, full width | Yes, but needs a non-full-width mode and a size scale for toolbars and card actions |
| `TextField` | Label, input, hint, error, composed `aria-describedby`, `aria-invalid` | Yes, unchanged |
| `PasswordField` | `TextField` plus a show/hide control with an accessible name | Auth only, no further reuse |
| `SelectField` | Native `select`, placeholder option, error wiring | Yes, drives the single-value filters in `FilterBar` |
| `Feedback` | `info` / `error` / `success`, `role="status"` or `role="alert"` | Yes, `AsyncState` wraps it instead of reimplementing it |
| `Icon` | Seven inline SVGs: arrow, back, eye, eye-off, check, book, spark | Yes, needs roughly ten more (search, filter, plus, edit, trash, clock, chevron, download, user, calendar) |

### `src/shared/layout`

- `AuthShell` — header, main, footer, hardcoded to the auth composition. **Not** reusable as `AppShell`: no sidebar and no navigation. What is reused is the pattern — the landmark structure, `#main-content`, `tabIndex={-1}` on main.
- `AuthCard` — the non-flip branch is a generic surface (`styles.card`). Extract it as a plain `Card`; `AssignmentCard`, `LessonCard`, `StudentSummary` and `FeedbackPanel` all sit on it.
- `FormHeader` — single `h1` plus description. `PageHeader` (S1.4) supersedes it; keep one of the two, not both.
- `SkipLink` — reusable as is, moves into `AppShell`.
- `LocaleProvider` / `useLocale` — en-US only. Every new component with copy follows the established `*.translations.ts` convention (eight such files exist).

### `src/shared/brand`

- `Brand` — inline SVG wordmark, reusable as is inside `Topbar`.
- `GoogleIcon` — auth only.

### `src/features/auth`

- `auth-service.ts` + `mock-auth-service.ts` — the interface-plus-mock split is the pattern S1.3 should copy for the mock data layer.
- `validation.ts` — `emailError` only; S1.2 replaces it with Zod schemas.
- `password-policy.ts` — auth only.

### Styles

- `src/shared/styles/tokens.css` — 32 tokens (colour, spacing, radius, one shadow, one duration).
- `src/app/globals.css` — reset, global `:focus-visible`, skip link, `prefers-reduced-motion`.

## 2. The 30 scoped components

| # | Component | Card | Reuses |
| --- | --- | --- | --- |
| 1 | `AppShell` | S1.4 | Landmark pattern from `AuthShell`, `SkipLink` |
| 2 | `Sidebar` | S1.4 | New |
| 3 | `Topbar` | S1.4 | `Brand`, `Icon` |
| 4 | `PageHeader` | S1.4 | Replaces `FormHeader` |
| 5 | `AsyncState` | S2.1 | `Feedback` |
| 6 | `StatusBadge` | S2.1 | New — blocked on status tokens, see §3 |
| 7 | `FilterBar` | S2.2 | `SelectField`, `TextField`, `Button` |
| 8 | `ResourceList` | S2.2 | New — the base for five later lists |
| 9 | `DashboardSummary` | S2.3 | `Card` |
| 10 | `PendingWorkList` | S2.3 | `ResourceList`, `StatusBadge` |
| 11 | `AssignmentCard` | S3.1 | `Card`, `StatusBadge` |
| 12 | `ActivityRenderer` | S3.2 | New — dispatcher by activity type |
| 13 | `QuestionFrame` | S3.2 | New |
| 14 | `MultipleChoiceActivity` | S3.3 | Native radios on the `.field` styles |
| 15 | `GapFillActivity` | S3.4 | `TextField` in an inline mode |
| 16 | `WritingActivity` | S4.1 | **Needs `TextArea`, which does not exist** |
| 17 | `SubmissionBar` | S4.2 | `Button` (`pending`), `Feedback` |
| 18 | `ScoreSummary` | S4.4 | `Card` |
| 19 | `AnswerReview` | S4.5 | `Feedback` tones, `StatusBadge` |
| 20 | `FeedbackPanel` | S4.6 | `Card`, `Feedback` |
| 21 | `LessonCard` | S5.1 | `Card` |
| 22 | `LessonContent` | S5.2 | New |
| 23 | `MaterialList` | S5.2 | `ResourceList` |
| 24 | `LessonForm` | S5.3 | `TextField`, `SelectField`, `TextArea`, `Button` |
| 25 | `AssignLessonDialog` | S5.4 | New — first dialog in the codebase |
| 26 | `StudentForm` | S5.5 | `TextField`, `SelectField`, `Button` |
| 27 | `StudentList` | S6.1 | `ResourceList` |
| 28 | `StudentSummary` | S6.1 | `Card` |
| 29 | `TeacherReviewForm` | S6.3 | `TextArea`, `Button`, `Feedback` |
| 30 | `AttemptHistory` | S6.4 | `ResourceList`, `StatusBadge` |

Twenty of the thirty reuse something that exists or that an earlier stage builds. Ten are genuinely new.

### Three primitives no card owns

1. **`TextArea`** — required by `WritingActivity` (S4.1), `LessonForm` (S5.3) and `TeacherReviewForm` (S6.3). Nothing scopes it. Build it next to `TextField` in S1.4 or S2.1; discovering it in stage 4 means three cards stall.
2. **`Card`** — extract from `AuthCard` before S2.3, otherwise six components each grow their own surface CSS.
3. **Dialog base** — `AssignLessonDialog` (S5.4) is the only dialog. `DESIGN_SYSTEM.md` already says to evaluate a dedicated accessible primitive before reimplementing keyboard behaviour; that decision falls due at S5.4, not before.

## 3. CSS token gaps

**Status colours.** Only `--color-danger`, `--color-success` and `--color-primary` exist, each with a soft variant. `StatusBadge` needs five states (not started, in progress, submitted, reviewed, overdue). There is no warning or neutral pair, and `Feedback`'s `info` tone currently borrows `--color-surface-soft` and `--color-muted` with no token of its own. Add `--color-warning` / `-soft`, `--color-neutral` / `-soft`, and promote the info pairing to real tokens.

**Spacing is defined but not used.** `--space-1` through `--space-12` exist; `--space-10` and `--space-12` are referenced nowhere, and `--space-1` only in `auth.module.css`. Every component stylesheet hardcodes pixels instead (`8px`, `12px`, `13px 15px`, `18px`, `50px`). Lists and tables in stage 2 multiply that inconsistency. Convert `ui.module.css` and `auth.module.css` to the tokens **before** the first list component lands, and add a row-density token for `ResourceList`.

**Focus has two conflicting treatments.** `globals.css` sets `outline: 3px solid var(--color-primary)` with a 4px offset; `.input` overrides it with `outline: none` plus a 2px green border and compensating padding. There is no `--focus-ring` token, and the ring colour equals the primary button's background, so a focused primary button shows no ring contrast. Add `--color-focus` and `--focus-ring`, and bring the input back onto the shared rule.

**Smaller gaps.** `--radius-pill` is declared and never used (badges will want it). `--shadow-card` is the only elevation — the dialog in S5.4 needs a second. There is no z-index scale, which the dialog and the sidebar overlay both need. `color-scheme: light` is hardcoded with no dark counterpart; out of scope here, recorded so it is a decision rather than an oversight.

## 4. Effect on the estimate

Two thirds of the scoped components stand on existing or early-stage primitives, so the stage 2–6 totals on the board hold — with one correction: `TextArea` must be added to an infrastructure card, and extracting `Card` is a prerequisite for S2.3 rather than optional cleanup. The token work in §3 is roughly two hours and belongs in stage 1; done later it becomes a retrofit across every component already shipped.
