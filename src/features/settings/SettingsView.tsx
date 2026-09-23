"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { BrandLettering } from "@/features/brands/BrandLettering";
import { AI_DATA_DISCLOSURE, AI_DATA_HEADING } from "./aiDisclosure";
import { useBrandVisuals } from "./BrandVisualsProvider";
import type { BrandVisuals } from "./brandVisuals";

const PREVIEW = [
  { name: "Gong Cha", slug: "gong-cha" },
  { name: "Tiger Sugar", slug: "tiger-sugar" },
  { name: "Chagee", slug: "chagee" },
] as const;

const OPTIONS: { value: BrandVisuals; label: string; blurb: string }[] = [
  {
    value: "mascots",
    label: "Mascots",
    blurb: "Illustrated brand marks across the catalogue. Default.",
  },
  {
    value: "minimal",
    label: "Minimal",
    blurb:
      "Lettering tiles from each brand’s initials. Same layout, quieter look.",
  },
];

export default function SettingsView({
  signedIn,
  authEnabled,
}: {
  signedIn: boolean;
  authEnabled: boolean;
}) {
  const { visuals, setVisuals } = useBrandVisuals();

  return (
    <>
      <header className="mb-8 max-w-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          Settings
        </p>
        <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Settings
        </h1>
        <p className="mt-4 text-base leading-7 opacity-70 sm:text-lg">
          Display choices stay on this device. Account options need a signed-in
          profile.
        </p>
      </header>

      <div className="max-w-2xl space-y-6">
        <section
          id="brand-visuals"
          className="scroll-mt-24 rounded-[1.8rem] border border-[#2b241f]/10 bg-white/50 p-6"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] opacity-55">
            On this device
          </p>
          <h2 className="text-lg font-black tracking-[-0.03em]">
            Brand visuals
          </h2>
          <p className="mt-2 text-sm leading-6 opacity-70">
            Mascots are Bobadex’s illustrated take on each brand. Minimal uses
            the same frames with deterministic lettering instead. This choice is
            not tied to an account.
          </p>

          <fieldset className="mt-5 m-0 grid min-w-0 grid-cols-1 gap-3 border-0 p-0 sm:grid-cols-2">
            <legend className="sr-only">Brand visuals</legend>
            {OPTIONS.map((option) => {
              const selected = visuals === option.value;
              return (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-[1.4rem] border p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    selected
                      ? "border-[#2b241f]/25 bg-white shadow-sm"
                      : "border-[#2b241f]/10 bg-white/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="brand-visuals"
                    value={option.value}
                    checked={selected}
                    onChange={() => setVisuals(option.value)}
                    className="sr-only"
                  />
                  <span className="pointer-events-none block text-sm font-black tracking-[-0.02em]">
                    {option.label}
                  </span>
                  <span className="pointer-events-none mt-1 block text-sm leading-5 opacity-65">
                    {option.blurb}
                  </span>
                </label>
              );
            })}
          </fieldset>

          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] opacity-55">
              Minimal lettering
            </p>
            <div className="flex gap-3">
              {PREVIEW.map((brand) => (
                <span
                  key={brand.slug}
                  className="flex size-20 items-center justify-center overflow-hidden rounded-[1.2rem] border border-[#2b241f]/10 bg-white shadow-sm"
                >
                  <BrandLettering
                    name={brand.name}
                    slug={brand.slug}
                    size={80}
                  />
                </span>
              ))}
            </div>
          </div>
        </section>

        <AccountSettings signedIn={signedIn} authEnabled={authEnabled} />

        <section
          id="ai-data"
          className="scroll-mt-24 rounded-[1.8rem] border border-[#2b241f]/10 bg-white/50 p-6"
        >
          <h2 className="text-lg font-black tracking-[-0.03em]">
            {AI_DATA_HEADING}
          </h2>
          <p className="mt-3 text-sm leading-6 opacity-75">
            {AI_DATA_DISCLOSURE}
          </p>
          <p className="mt-4 text-sm opacity-65">
            The same note lives on{" "}
            <Link href="/about#ai-data" className="font-semibold underline">
              About
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}

function AccountSettings({
  signedIn,
  authEnabled,
}: {
  signedIn: boolean;
  authEnabled: boolean;
}) {
  return (
    <section
      id="account"
      className="scroll-mt-24 rounded-[1.8rem] border border-[#2b241f]/10 bg-white/50 p-6"
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] opacity-55">
        Account
      </p>
      <h2 className="text-lg font-black tracking-[-0.03em]">Profile</h2>

      {signedIn ? (
        <>
          <p className="mt-2 text-sm leading-6 opacity-70">
            Username, photo, and other account details are saved to your
            profile.
          </p>
          <Link
            href="/dashboard/profile"
            className="mt-4 inline-flex rounded-full border border-[#2b241f]/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Open profile
          </Link>
        </>
      ) : (
        <div className="mt-4 rounded-[1.2rem] border border-[#2b241f]/10 bg-[#2b241f]/[0.03] px-4 py-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Lock className="size-3.5 opacity-60" aria-hidden="true" />
            Saved to your account
          </p>
          <p className="mt-2 text-sm leading-6 opacity-65">
            {authEnabled
              ? "Sign in to change username, photo, and other profile settings."
              : "Accounts aren’t open on the web yet. Display choices above still work on this device."}
          </p>
          {authEnabled ? (
            <Link
              href="/auth/login?next=/settings#account"
              className="mt-4 inline-flex rounded-full border border-[#2b241f]/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Sign in
            </Link>
          ) : null}
        </div>
      )}
    </section>
  );
}
