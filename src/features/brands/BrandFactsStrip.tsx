import { originEyebrow } from "@/features/home/chips";
import { formatFactDate } from "./parseProfileFacts";
import type { BrandDetail, BrandFact } from "./types";

export default function BrandFactsStrip({ brand }: { brand: BrandDetail }) {
  const items = factItems(brand);
  const observed = formatFactDate(brand.facts.observed_at);
  if (items.length === 0 && !observed) return null;

  return (
    <section aria-labelledby="brand-facts-heading">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2
          id="brand-facts-heading"
          className="text-xl font-black tracking-[-0.03em] sm:text-2xl"
        >
          Facts
        </h2>
        {observed ? (
          <p className="shrink-0 text-[0.7rem] font-medium tracking-wide opacity-50">
            Observed {observed}
          </p>
        ) : null}
      </div>
      {items.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={`${item.label}-${item.value}`}
              className="rounded-[1.6rem] border border-[#2b241f]/10 bg-white/50 p-5"
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] opacity-55">
                {item.label}
              </p>
              <p className="mt-2 text-sm leading-6 font-semibold sm:text-base">
                {item.value}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function factItems(brand: BrandDetail): BrandFact[] {
  const items: BrandFact[] = [];
  const founded = originEyebrow(brand.facts);
  if (founded) {
    items.push({ label: "Founded", value: founded.replace(/^Founded\s+/, "") });
  }

  if (brand.facts.aliases.length) {
    const aliases = brand.facts.aliases.filter(
      (alias) => alias.toLowerCase() !== brand.display.toLowerCase(),
    );
    if (aliases.length) {
      items.push({
        label: "Also known as",
        value: aliases.slice(0, 4).join(", "),
      });
    }
  }

  for (const extra of brand.facts.extras) {
    items.push(extra);
  }

  return items;
}
