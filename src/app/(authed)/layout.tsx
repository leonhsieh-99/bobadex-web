// app/(authed)/layout.tsx (RSC)
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");
  return <>{children}</>;
}