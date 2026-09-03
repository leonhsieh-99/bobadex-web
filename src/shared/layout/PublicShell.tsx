import type { ReactNode } from "react";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";
import PublicFooter from "@/shared/layout/PublicFooter";
import PublicSidebar from "@/shared/layout/PublicSidebar";

export default function PublicShell({ children }: { children: ReactNode }) {
  return (
    <main
      id="top"
      className="min-h-screen overflow-x-hidden bg-[#fbf8f0] text-[#2b241f]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_18%_10%,rgba(255,196,93,0.20),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(239,91,70,0.12),transparent_27%)]" />
      <PublicSidebar />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-10 pt-10 sm:px-8 sm:pt-16 md:ml-52 md:max-w-[calc(100%-13rem)] lg:px-10">
        {!AUTH_ENABLED ? (
          <p className="mb-8 rounded-full border border-[#2b241f]/10 bg-white/70 px-4 py-2 text-center text-xs font-semibold tracking-wide opacity-70 sm:text-left">
            Catalogue preview — browse freely. Accounts aren&apos;t open on the
            web yet.
          </p>
        ) : null}
        <div className="flex-1">{children}</div>
        <PublicFooter />
      </div>
    </main>
  );
}
