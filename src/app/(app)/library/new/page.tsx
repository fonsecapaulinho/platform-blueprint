import { requireRole } from "@/features/session/demo-session";
import { PagePlaceholder } from "@/features/placeholder/page-placeholder";

export default async function CreateLessonPage() {
  await requireRole("teacher");
  return <PagePlaceholder title="Create lesson" page="08" card="S5.3" />;
}
