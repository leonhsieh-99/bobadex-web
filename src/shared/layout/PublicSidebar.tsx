"use client";

import {
  HomeIcon,
  LibraryBig,
  Lock,
  LogIn,
  Settings,
  Trophy,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { name: "Home", icon: HomeIcon, href: "#top" },
  { name: "Brands", icon: LibraryBig, href: "#featured" },
  { name: "Rankings", icon: Trophy, href: "#rankings" },
] as const;

const itemClassName =
  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[#2b241f]/5 md:w-full";

export default function PublicSidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(Boolean(data.user));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <aside className="relative z-20 border-b border-[#2b241f]/10 bg-[#fbf8f0]/90 backdrop-blur md:fixed md:inset-y-0 md:left-0 md:w-52 md:border-b-0 md:border-r">
      <nav className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-3 md:h-full md:flex-col md:items-stretch md:overflow-visible md:px-4 md:py-7">
        <a
          href="#top"
          className="mr-3 hidden rounded-2xl p-2 md:mb-10 md:mr-0 md:block"
          aria-label="Bobadex home"
        >
          <Image src="/logo.svg" alt="Bobadex" width={156} height={42} />
        </a>

        {navItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <a
              key={item.name}
              href={item.href}
              className={`${itemClassName} ${index === 0 ? "bg-[#2b241f]/8" : ""}`}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {item.name}
            </a>
          );
        })}

        {isAuthenticated ? (
          <a href="/dashboard" className={itemClassName}>
            <UserRound className="size-[18px]" aria-hidden="true" />
            My Bobadex
          </a>
        ) : (
          <span
            className={`${itemClassName} cursor-not-allowed opacity-45 hover:bg-transparent`}
            aria-disabled="true"
            title="Sign in to open My Bobadex"
          >
            <UserRound className="size-[18px]" aria-hidden="true" />
            My Bobadex
            <Lock className="ml-auto size-3.5" aria-hidden="true" />
          </span>
        )}

        <button type="button" className={itemClassName}>
          <Settings className="size-[18px]" aria-hidden="true" />
          Settings
        </button>

        {!isAuthenticated && (
          <a
            href="/auth/login?next=/dashboard"
            className={`${itemClassName} ml-auto md:mt-auto md:ml-0`}
          >
            <LogIn className="size-[18px]" aria-hidden="true" />
            Sign in
          </a>
        )}
      </nav>
    </aside>
  );
}
