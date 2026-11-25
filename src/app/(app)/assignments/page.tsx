import { requireSession } from "@/features/session/demo-session";
import { PagePlaceholder } from "@/features/placeholder/page-placeholder";

export default async function AssignmentsPage() {
  await requireSession();
  return <PagePlaceholder title="My assignments" page="04" card="S2.5" />;
}
