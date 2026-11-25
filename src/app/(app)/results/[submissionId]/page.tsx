import { requireSession } from "@/features/session/demo-session";
import { PagePlaceholder } from "@/features/placeholder/page-placeholder";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  await requireSession();
  return (
    <PagePlaceholder title="Results and review" page="06" card="S6.4">
      <p>Submission {submissionId}</p>
    </PagePlaceholder>
  );
}
