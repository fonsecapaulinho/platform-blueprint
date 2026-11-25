import { requireRole } from "@/features/session/demo-session";
import { PagePlaceholder } from "@/features/placeholder/page-placeholder";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  await requireRole("teacher");
  return (
    <PagePlaceholder title="Edit lesson" page="08" card="S5.3">
      <p>Lesson {lessonId}</p>
    </PagePlaceholder>
  );
}
