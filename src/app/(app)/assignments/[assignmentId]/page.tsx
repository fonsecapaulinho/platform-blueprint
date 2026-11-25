import { requireSession } from "@/features/session/demo-session";
import { PagePlaceholder } from "@/features/placeholder/page-placeholder";

export default async function LessonAndActivityPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  await requireSession();
  return (
    <PagePlaceholder title="Lesson and activity" page="05" card="S4.3">
      <p>Assignment {assignmentId}</p>
    </PagePlaceholder>
  );
}
