"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BrandMark } from "./BrandMark";
import type { BrandIndexItem } from "./loadBrandIndex";

const LETTERS = [
  "All",
  "#",
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
] as const;

function letterOf(name: string) {
  const match = name.trim().match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : "#";
}

function matchesQuery(brand: BrandIndexItem, query: string) {
  if (!query) return true;
  if (brand.display.toLowerCase().includes(query)) return true;
  if (brand.slug.toLowerCase().includes(query)) return true;
  return brand.aliases.some((alias) => alias.toLowerCase().includes(query));
}

export default function BrandsExplorer({
  brands,
}: {
  brands: BrandIndexItem[];
}) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<(typeof LETTERS)[number]>("All");

  const normalizedQuery = query.trim().toLowerCase();

  const visible = useMemo(() => {
    return brands.filter((brand) => {
      if (!matchesQuery(brand, normalizedQuery)) return false;
      if (letter === "All") return true;
      return letterOf(brand.display) === letter;
    });
  }, [brands, letter, normalizedQuery]);

  return (
    <div>
      <form
        className="relative mb-4 max-w-md"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 opacity-45"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search brands or aliases…"
          className="w-full rounded-full border border-[#2b241f]/10 bg-white/75 py-3 pr-4 pl-11 text-sm shadow-sm outline-none backdrop-blur placeholder:opacity-50 focus:border-[#2b241f]/25"
          aria-label="Search brands"
        />
      </form>

      <div className="mb-6 flex flex-wrap gap-1.5">
        {LETTERS.map((item) => {
          const active = letter === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setLetter(item)}
              className={`min-w-8 rounded-full px-2.5 py-1 text-xs font-bold ${
                active
                  ? "bg-[#2b241f] text-[#fbf8f0]"
                  : "bg-white/60 text-[#2b241f]/70 hover:bg-white"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-sm opacity-60">
        {visible.length} {visible.length === 1 ? "brand" : "brands"}
      </p>

      {visible.length === 0 ? (
        <p className="rounded-[1.6rem] border border-[#2b241f]/10 bg-white/50 p-8 text-sm opacity-70">
          No brands match that search.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visible.map((brand) => (
            <li key={brand.slug}>
              <Link
                href={`/brands/${brand.slug}`}
                className="flex h-full flex-col items-center rounded-[1.4rem] border border-[#2b241f]/10 bg-white/55 p-4 text-center transition-transform hover:-translate-y-0.5"
              >
                <span className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5">
                  <BrandMark
                    iconPath={brand.icon_path}
                    name={brand.display}
                    size={256}
                    displaySize={64}
                  />
                </span>
                <h2 className="mt-3 text-sm font-bold tracking-[-0.02em]">
                  {brand.display}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
