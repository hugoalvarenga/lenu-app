import { redirect } from "next/navigation";
import { Sidebar } from "@/shared/components/sidebar";
import { getUser, getProfile } from "@/features/auth/services";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userName={profile?.full_name || user.email} />
      <main className="pt-14 md:pt-0 md:pl-64">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
