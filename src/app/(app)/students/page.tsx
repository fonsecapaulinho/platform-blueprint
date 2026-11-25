import { requireRole } from "@/features/session/demo-session";
import { PagePlaceholder } from "@/features/placeholder/page-placeholder";

export default async function StudentsPage() {
  await requireRole("teacher");
  return <PagePlaceholder title="Students" page="09" card="S6.2" />;
}
