import type { Metadata } from "next";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";
import SettingsView from "@/features/settings/SettingsView";
import PublicShell from "@/shared/layout/PublicShell";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Settings — Bobadex",
  description: "Choose brand visuals and read how Bobadex uses AI.",
};

export default async function SettingsPage() {
  let signedIn = false;

  if (AUTH_ENABLED) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    signedIn = Boolean(user);
  }

  return (
    <PublicShell>
      <SettingsView signedIn={signedIn} authEnabled={AUTH_ENABLED} />
    </PublicShell>
  );
}
