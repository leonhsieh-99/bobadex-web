import Link from "next/link";
import PublicShell from "@/shared/layout/PublicShell";

export default function AuthComingSoon() {
  return (
    <PublicShell>
      <div className="flex max-w-xl flex-col items-start gap-5 rounded-[2rem] border border-[#2b241f]/10 bg-white/50 p-8 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          Preview
        </p>
        <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          Accounts aren&apos;t open yet
        </h1>
        <p className="text-sm leading-6 opacity-70 sm:text-base sm:leading-7">
          This web build is a catalogue preview. You can browse brands freely.
          Sign in, sign up, and personal dexes will land later.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-full border border-[#2b241f]/10 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Back to the catalogue
        </Link>
      </div>
    </PublicShell>
  );
}
