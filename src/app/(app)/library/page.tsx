import { requireRole } from "@/features/session/demo-session";
import { PagePlaceholder } from "@/features/placeholder/page-placeholder";

export default async function LessonLibraryPage() {
  await requireRole("teacher");
  return <PagePlaceholder title="Lesson library" page="07" card="S5.1" />;
}
