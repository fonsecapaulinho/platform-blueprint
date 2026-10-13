import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { AuthCard } from "@/components/auth/auth-shell";
import { DashboardView } from "@/features/auth/dashboard-view";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return <AuthCard>
    <DashboardView name={session.user.name ?? ""} email={session.user.email ?? ""}/>
  </AuthCard>;
}
