import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { AuthCard } from "@/components/auth/auth-shell";
import { DashboardView } from "@/features/auth/dashboard-view";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return <AuthCard>
    <DashboardView name={session.user.name ?? ""} email={session.user.email ?? ""} role={role === "teacher" ? "teacher" : role === "student" ? "student" : undefined}/>
  </AuthCard>;
}
