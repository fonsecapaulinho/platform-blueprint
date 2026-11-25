import { requireRole } from "@/features/session/demo-session";
import { PagePlaceholder } from "@/features/placeholder/page-placeholder";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  await requireRole("teacher");
  return (
    <PagePlaceholder title="Student details" page="10" card="S6.2">
      <p>Student {studentId}</p>
    </PagePlaceholder>
  );
}
