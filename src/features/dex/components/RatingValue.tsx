import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RatingValue({
  rating,
  compact = false,
}: {
  rating: number | null;
  compact?: boolean;
}) {
  if (rating == null) {
    return (
      <span
        className={cn("text-boba-ink-muted", compact ? "text-xs" : "text-sm")}
      >
        Unrated
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-display font-semibold tabular-nums text-boba-ink",
        compact ? "text-sm" : "text-lg",
      )}
    >
      <Star
        className={cn(
          "fill-boba-star text-boba-star",
          compact ? "size-3.5" : "size-4",
        )}
        aria-hidden="true"
      />
      {rating.toFixed(1)}
    </span>
  );
}
