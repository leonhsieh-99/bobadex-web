import type { Metadata } from "next";
import Image from "next/image";
import MilkTeaCup from "@/features/about/MilkTeaCup";
import PublicShell from "@/shared/layout/PublicShell";

export const metadata: Metadata = {
  title: "About — Bobadex",
  description:
    "Bobadex is your personal boba shop and drink tracker, plus a public catalogue of brands.",
};

const PRIVACY_URL = "https://leonhsieh-99.github.io/bobadex-legal/privacy.html";
const TERMS_URL = "https://leonhsieh-99.github.io/bobadex-legal/terms.html";
const SUPPORT_EMAIL = "leonchsieh@gmail.com";
const OSM_URL = "https://www.openstreetmap.org/copyright";

export default function AboutPage() {
  return (
    <PublicShell>
      <header className="mb-10 flex max-w-2xl items-center gap-4">
        <Image
          src="/logo.svg"
          alt="Bobadex"
          width={72}
          height={72}
          className="size-[72px] shrink-0 rounded-2xl"
        />
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
            About
          </p>
          <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Bobadex
          </h1>
        </div>
      </header>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,1fr)]">
        <div className="max-w-2xl space-y-4">
          <section className="rounded-[1.8rem] border border-[#2b241f]/10 bg-white/50 p-6">
            <p className="text-sm leading-7 opacity-80 sm:text-base">
              Bobadex is your personal boba shop and drink tracker. I made this
              mostly for fun and because I drink an unhealthy amount of milk
              tea. If anyone has any suggestions or feedback you can get my
              email in the contacts below. Anyways I don&apos;t have much to
              say. Hope everyone has a lovely time using this.
            </p>
          </section>

          <section className="rounded-[1.8rem] border border-[#2b241f]/10 bg-white/50 p-6">
            <h2 className="text-lg font-black tracking-[-0.03em]">
              Limitations &amp; beta notice
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 opacity-75">
              <li>Reporting is manual for now.</li>
              <li>
                Shop coverage started in California and is still expanding.
              </li>
              <li>Data may be wiped or reshaped between updates.</li>
              <li>Mascots and brand art are still experimental.</li>
              <li>Please report bugs or feedback.</li>
            </ul>
          </section>

          <section className="rounded-[1.8rem] border border-[#2b241f]/10 bg-white/50 p-6">
            <h2 className="text-lg font-black tracking-[-0.03em]">
              Credits &amp; artwork
            </h2>
            <p className="mt-3 text-sm leading-6 opacity-75">
              Brand mascots and icons on Bobadex are unofficial. Some artwork is
              AI-generated or AI-assisted, and none of it is endorsed by the
              brands themselves. If a shop or brand asks us not to use a mascot,
              we replace it with initials. Location data includes OpenStreetMap.
            </p>
          </section>

          <section className="rounded-[1.8rem] border border-[#2b241f]/10 bg-white/50 p-6">
            <h2 className="text-lg font-black tracking-[-0.03em]">Contact</h2>
            <p className="mt-3 text-sm leading-6 opacity-75">
              Questions, bugs, or suggestions? Email me.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Bobadex feedback")}`}
              className="mt-4 inline-flex rounded-full border border-[#2b241f]/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
            >
              {SUPPORT_EMAIL}
            </a>
          </section>

          <section className="rounded-[1.8rem] border border-[#2b241f]/10 bg-white/50 p-6">
            <h2 className="text-lg font-black tracking-[-0.03em]">Legal</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={PRIVACY_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#2b241f]/10 bg-white px-4 py-2 text-sm font-semibold"
              >
                Privacy Policy
              </a>
              <a
                href={TERMS_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#2b241f]/10 bg-white px-4 py-2 text-sm font-semibold"
              >
                Terms of Service
              </a>
            </div>
            <p className="mt-4 text-xs opacity-60">
              <a
                href={OSM_URL}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                © OpenStreetMap contributors (ODbL)
              </a>
            </p>
          </section>
        </div>

        <aside className="relative hidden lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-6rem)] lg:items-start lg:justify-center lg:pt-8">
          <MilkTeaCup />
        </aside>
      </div>
    </PublicShell>
  );
}
