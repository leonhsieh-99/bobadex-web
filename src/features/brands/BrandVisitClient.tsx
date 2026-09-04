"use client";

import { useQuery } from "@tanstack/react-query";
import { Lock, LogIn, NotebookPen } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { VisitCard } from "./VisitCard";

type VisitState =
  | { status: "guest" }
  | { status: "empty" }
  | {
      status: "logged";
      shopId: string;
      rating: number | null;
      drinks: Array<{ id: string; name: string }>;
    };

export default function BrandVisitClient({
  slug,
  display,
}: {
  slug: string;
  display: string;
}) {
  const loginHref = `/auth/login?next=${encodeURIComponent(`/brands/${slug}`)}`;
  const { data, isPending } = useQuery({
    queryKey: ["brand-visit", slug],
    queryFn: () => loadVisit(slug),
  });

  if (isPending) {
    return (
      <section
        aria-labelledby="your-drinks-heading"
        className="rounded-[2rem] border border-[#2b241f]/10 bg-white/50 p-8 sm:p-10"
      >
        <p className="text-sm opacity-55">Checking your dex…</p>
      </section>
    );
  }

  const visit = data ?? { status: "guest" as const };

  if (visit.status === "guest") {
    return (
      <VisitCard
        icon={<Lock className="size-7" aria-hidden="true" />}
        title="Your drinks are locked"
        body={`Sign in to log ${display} and keep ratings in your own dex.`}
        action={
          <Link
            href={loginHref}
            className="inline-flex items-center gap-2 rounded-full border border-[#2b241f]/10 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Sign in to log this brand
          </Link>
        }
      />
    );
  }

  if (visit.status === "empty") {
    return (
      <VisitCard
        icon={<NotebookPen className="size-7" aria-hidden="true" />}
        title="Add this to your dex"
        body={`${display} isn't in your shops yet. Logging drinks still happens in the dashboard.`}
        action={
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[#2b241f]/10 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Open your dex
          </Link>
        }
      />
    );
  }

  const drinkNames = visit.drinks.filter((drink) => drink.name);
  const extra = Math.max(0, drinkNames.length - 6);
  const preview = drinkNames.slice(0, 6);

  return (
    <VisitCard
      icon={<NotebookPen className="size-7" aria-hidden="true" />}
      title="Your drinks"
      body={null}
      action={
        <Link
          href={`/dashboard/${visit.shopId}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#2b241f]/10 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Edit in your dex
        </Link>
      }
    >
      <p className="text-sm font-semibold">
        Your rating:{" "}
        <span className="opacity-70">
          {visit.rating == null ? "—" : visit.rating.toFixed(1)}
        </span>
      </p>
      {preview.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {preview.map((drink) => (
            <li
              key={drink.id}
              className="rounded-full border border-[#2b241f]/10 bg-white/70 px-3 py-1.5 text-xs font-semibold"
            >
              {drink.name}
            </li>
          ))}
          {extra > 0 ? (
            <li className="rounded-full border border-[#2b241f]/10 bg-white/70 px-3 py-1.5 text-xs font-semibold opacity-60">
              +{extra} more
            </li>
          ) : null}
        </ul>
      ) : (
        <p className="mt-3 text-sm opacity-65">No drinks logged yet.</p>
      )}
    </VisitCard>
  );
}

async function loadVisit(slug: string): Promise<VisitState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { status: "guest" };

  const { data: shop } = await supabase
    .from("shops")
    .select("id, rating")
    .eq("brand_slug", slug)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!shop?.id) return { status: "empty" };

  const { data: drinks } = await supabase
    .from("drinks")
    .select("id, name")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false });

  return {
    status: "logged",
    shopId: shop.id,
    rating: typeof shop.rating === "number" ? shop.rating : null,
    drinks: (drinks ?? []).flatMap((drink) => {
      const name = typeof drink.name === "string" ? drink.name.trim() : "";
      if (!name || typeof drink.id !== "string") return [];
      return [{ id: drink.id, name }];
    }),
  };
}
