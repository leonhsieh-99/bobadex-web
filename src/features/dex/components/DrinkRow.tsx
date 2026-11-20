"use client";

import { Bookmark, Heart, Lock, Star } from "lucide-react";
import { useState } from "react";
import type { Drink } from "@/features/drinks/types";
import { cn } from "@/lib/utils";

export default function DrinkRow({
  drink,
  pinned = false,
}: {
  drink: Drink;
  pinned?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const notes = drink.notes?.trim() ?? "";
  const expandable = notes.length > 0;
  const privateDrink = drink.visibility === "private";

  const body = (
    <>
      <span className="flex w-[52px] shrink-0 flex-col items-center pt-0.5">
        {drink.rating == null ? (
          <span className="font-display text-sm text-boba-ink-faint">—</span>
        ) : (
          <>
            <span className="font-display text-sm font-semibold tabular-nums text-boba-ink">
              {drink.rating.toFixed(1)}
            </span>
            <Star
              className="size-3 fill-boba-star text-boba-star"
              aria-hidden="true"
            />
          </>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[13px] leading-4 font-semibold text-boba-ink">
          <span className="truncate">{drink.name}</span>
          {drink.is_favorite ? (
            <Heart
              className="size-4 shrink-0 fill-boba-heart text-boba-heart"
              aria-label="Favorite"
            />
          ) : null}
          {pinned ? (
            <Bookmark
              className="size-3.5 shrink-0 fill-boba-heart text-boba-heart"
              aria-label="Pinned"
            />
          ) : null}
          {privateDrink ? (
            <Lock
              className="size-3.5 shrink-0 text-boba-ink-muted"
              aria-label="Private"
            />
          ) : null}
        </span>
        {notes ? (
          <span
            className={cn(
              "mt-0.5 block text-sm leading-5 text-boba-ink-muted",
              !open && "line-clamp-2",
            )}
          >
            {notes}
          </span>
        ) : null}
      </span>
    </>
  );

  const className =
    "flex w-full items-start gap-3 border-b-[0.5px] border-boba-outline py-3 text-left last:border-b-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-boba-accent";

  if (!expandable) {
    return <div className={cn(className, "min-h-11")}>{body}</div>;
  }

  return (
    <button
      type="button"
      className={cn(className, "min-h-11")}
      aria-expanded={open}
      onClick={() => setOpen((current) => !current)}
    >
      {body}
    </button>
  );
}
