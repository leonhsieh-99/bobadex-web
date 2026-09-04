"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BrandMark } from "@/features/brands/BrandMark";
import type { BrandSearchItem } from "./constellation";

const MAX_RESULTS = 8;

function matchesQuery(brand: BrandSearchItem, query: string) {
  if (brand.display.toLowerCase().includes(query)) return true;
  if (brand.slug.toLowerCase().includes(query)) return true;
  return brand.aliases.some((alias) => alias.toLowerCase().includes(query));
}

export default function BrandTypeahead({
  brands,
  onQuery,
}: {
  brands: BrandSearchItem[];
  onQuery?: (query: string) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const normalized = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalized) return [];
    return brands
      .filter((brand) => matchesQuery(brand, normalized))
      .slice(0, MAX_RESULTS);
  }, [brands, normalized]);

  const showList = open && normalized.length > 0;

  function goTo(slug: string) {
    setOpen(false);
    router.push(`/brands/${slug}`);
  }

  return (
    <form
      className="relative mt-6 w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        const brand = results[active] ?? results[0];
        if (brand) goTo(brand.slug);
      }}
    >
      <Search
        className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 opacity-45"
        aria-hidden="true"
      />
      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          onQuery?.(event.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 120);
        }}
        onKeyDown={(event) => {
          if (!showList || results.length === 0) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((index) => (index + 1) % results.length);
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((index) => (index - 1 + results.length) % results.length);
          }
          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="Find a brand…"
        className="w-full rounded-full border border-[#2b241f]/10 bg-white/75 py-3 pr-4 pl-11 text-sm shadow-sm outline-none backdrop-blur placeholder:opacity-50 focus:border-[#2b241f]/25"
        aria-label="Search the catalogue"
      />

      {showList ? (
        <div
          id="brand-typeahead"
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-[#2b241f]/10 bg-[#fbf8f0] text-left shadow-[0_16px_40px_rgba(43,36,31,0.12)]"
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm opacity-60">No brands match.</p>
          ) : (
            results.map((brand, index) => {
              const selected = index === active;
              return (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm ${
                    selected ? "bg-[#2b241f]/8" : "hover:bg-[#2b241f]/5"
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => setOpen(false)}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                    <BrandMark
                      iconPath={brand.icon_path}
                      name={brand.display}
                      size={256}
                      displaySize={36}
                      eager
                    />
                  </span>
                  <span className="min-w-0 truncate font-semibold">
                    {brand.display}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      ) : null}
    </form>
  );
}
