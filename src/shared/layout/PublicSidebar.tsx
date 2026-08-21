"use client";

import {
  CircleUserRound,
  HomeIcon,
  Info,
  LibraryBig,
  Lock,
  LogIn,
  Medal,
  Settings,
  Trophy,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserMark from "@/shared/layout/UserMark";
import { userInitials } from "@/shared/layout/userInitials";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { name: "Home", icon: HomeIcon, href: "/" },
  { name: "Brands", icon: LibraryBig, href: "/brands" },
  { name: "Achievements", icon: Medal, href: "/achievements" },
  { name: "Rankings", icon: Trophy, href: "/rankings" },
  { name: "About", icon: Info, href: "/about" },
] as const;

const memberItems = [
  { name: "My Bobadex", icon: UserRound, href: "/dashboard" },
  { name: "Profile", icon: CircleUserRound, href: "/dashboard/profile" },
] as const;

const itemClassName =
  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[#2b241f]/5 md:w-full";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PublicSidebar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewer, setViewer] = useState<{
    imagePath: string | null;
    initials: string;
  }>({ imagePath: null, initials: "G" });

  useEffect(() => {
    const supabase = createClient();

    async function loadViewer() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setIsAuthenticated(Boolean(user));

      if (!user) {
        setViewer({ imagePath: null, initials: "G" });
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("username, display_name, profile_image_path")
        .eq("id", user.id)
        .maybeSingle();

      setViewer({
        imagePath: profile?.profile_image_path ?? null,
        initials: userInitials(
          profile?.display_name,
          profile?.username,
          user.email,
        ),
      });
    }

    loadViewer();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
      if (!session?.user) {
        setViewer({ imagePath: null, initials: "G" });
        return;
      }
      loadViewer();
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <aside className="relative z-20 border-b border-[#2b241f]/10 bg-[#fbf8f0]/90 backdrop-blur md:fixed md:inset-y-0 md:left-0 md:w-52 md:border-b-0 md:border-r">
      <nav className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-3 md:h-full md:flex-col md:items-stretch md:overflow-visible md:px-4 md:py-7">
        <Link
          href={isAuthenticated ? "/dashboard/profile" : "/"}
          className="mr-3 flex items-center rounded-full p-1 md:mb-10 md:mr-0 md:justify-center"
          aria-label={isAuthenticated ? "Your profile" : "Bobadex home"}
        >
          <UserMark
            key={viewer.imagePath ?? "guest"}
            imagePath={viewer.imagePath}
            initials={viewer.initials}
            size={48}
          />
        </Link>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${itemClassName} ${active ? "bg-[#2b241f]/8" : ""}`}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}

        {memberItems.map((item) => {
          const Icon = item.icon;

          return isAuthenticated ? (
            <Link key={item.name} href={item.href} className={itemClassName}>
              <Icon className="size-[18px]" aria-hidden="true" />
              {item.name}
            </Link>
          ) : (
            <span
              key={item.name}
              className={`${itemClassName} cursor-not-allowed opacity-45 hover:bg-transparent`}
              aria-disabled="true"
              title={`Sign in to open ${item.name}`}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {item.name}
              <Lock className="ml-auto size-3.5" aria-hidden="true" />
            </span>
          );
        })}

        <button type="button" className={itemClassName}>
          <Settings className="size-[18px]" aria-hidden="true" />
          Settings
        </button>

        {!isAuthenticated && (
          <Link
            href="/auth/login?next=/dashboard"
            className={`${itemClassName} ml-auto md:mt-auto md:ml-0`}
          >
            <LogIn className="size-[18px]" aria-hidden="true" />
            Sign in
          </Link>
        )}
      </nav>
    </aside>
  );
}
