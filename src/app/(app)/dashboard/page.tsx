import { requireSession } from "@/features/session/demo-session";
import { PagePlaceholder } from "@/features/placeholder/page-placeholder";
import { DashboardView } from "@/features/auth/dashboard-view";
import { Feedback } from "@/shared/ui/feedback";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const { denied } = await searchParams;
  const session = await requireSession();

  return (
    <PagePlaceholder title="Dashboard" page="03" card="S2.4">
      {denied !== undefined && (
        <Feedback tone="error">
          That page is for {denied === "teacher" ? "teachers" : "students"}, and you are signed in
          as a {session.user.role}.
        </Feedback>
      )}
      <DashboardView
        name={session.user.name}
        email={session.user.email}
        role={session.user.role}
      />
    </PagePlaceholder>
  );
}
