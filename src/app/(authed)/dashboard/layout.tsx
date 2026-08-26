import { redirect } from "next/navigation";
import DashboardShell from "@/features/dashboard/components/DashboardShell";
import { fetchShopsByOwnerId } from "@/features/shops/client/queries";
import ShopsView from "@/features/shops/components/ShopsView";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams?: { userId?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  if (!currentUser) redirect("/auth/login");

  const ownerId = searchParams?.userId ?? currentUser.id;
  const isOwner = ownerId === currentUser.id;

  return (
    <DashboardShell ownerId={ownerId} isOwner={isOwner}>
      {children}
    </DashboardShell>
  );
}
