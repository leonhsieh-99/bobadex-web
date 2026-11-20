"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleUserRound, Info, LogOut, Palette, Trophy } from "lucide-react";
import Link from "next/link";
import SignOutButton from "@/features/auth/components/SignOutButton";
import { useDexData } from "@/features/dashboard/components/DashboardShell";
import EmptyState from "@/features/dex/components/EmptyState";
import CollectorCard from "@/features/profile/CollectorCard";
import { userInitials } from "@/shared/layout/userInitials";
import { createClient } from "@/utils/supabase/client";

type Viewer = {
  email: string | null;
  username: string | null;
  displayName: string | null;
  imagePath: string | null;
};

const LINKS = [
  { href: "/settings", label: "Brand visuals", icon: Palette },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/about", label: "About", icon: Info },
] as const;

function earliestLabel(dates: Array<Date | string | null>) {
  let earliest: number | null = null;
  for (const value of dates) {
    if (!value) continue;
    const time = new Date(value).getTime();
    if (Number.isNaN(time)) continue;
    if (earliest == null || time < earliest) earliest = time;
  }
  if (earliest == null) return "—";
  return new Date(earliest).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function ProfileView() {
  const { shops, isLoading: shopsLoading } = useDexData();
  const viewer = useQuery({
    queryKey: ["viewer"],
    queryFn: async (): Promise<Viewer | null> => {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      const user = data.user;
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from("users")
        .select("username, display_name, profile_image_path")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;

      return {
        email: user.email ?? null,
        username: profile?.username ?? null,
        displayName: profile?.display_name ?? null,
        imagePath: profile?.profile_image_path ?? null,
      };
    },
  });

  if (viewer.isLoading) {
    return (
      <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-boba-xl bg-boba-surface-alt lg:mx-0" />
    );
  }

  if (viewer.isError || !viewer.data) {
    return (
      <EmptyState
        icon={CircleUserRound}
        tone="danger"
        title="Couldn't load your profile."
        body="Your account is still signed in. Try refreshing this page."
      />
    );
  }

  const profile = viewer.data;
  const name =
    profile.displayName?.trim() || profile.username?.trim() || "Collector";

  return (
    <div className="mx-auto grid max-w-2xl gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
      <CollectorCard
        name={name}
        username={profile.username}
        imagePath={profile.imagePath}
        initials={userInitials(
          profile.displayName,
          profile.username,
          profile.email,
        )}
        brands={shopsLoading ? null : shops.length}
        favorites={
          shopsLoading ? null : shops.filter((shop) => shop.is_favorite).length
        }
        since={
          shopsLoading
            ? null
            : earliestLabel(shops.map((shop) => shop.created_at))
        }
      />
      <nav
        aria-label="Profile"
        className="overflow-hidden rounded-boba-xl border border-boba-outline bg-boba-surface"
      >
        <ul>
          {LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.href}
                className="border-b-[0.5px] border-boba-outline"
              >
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center gap-3 px-4 text-sm font-semibold text-boba-ink hover:bg-boba-surface-alt focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-boba-accent"
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <SignOutButton className="flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm font-semibold text-boba-danger hover:bg-boba-surface-alt focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-boba-accent disabled:opacity-60">
              <LogOut className="size-[18px]" aria-hidden="true" />
              Sign out
            </SignOutButton>
          </li>
        </ul>
      </nav>
    </div>
  );
}
