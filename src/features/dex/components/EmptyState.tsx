import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  tone = "muted",
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
  tone?: "muted" | "danger";
}) {
  return (
    <div className="mx-auto flex max-w-[360px] flex-col items-center px-6 py-10 text-center">
      <Icon
        className={cn(
          "size-[52px]",
          tone === "danger" ? "text-boba-danger" : "text-boba-ink-faint",
        )}
        aria-hidden="true"
      />
      <h2
        className={cn(
          "mt-4 font-display text-lg font-semibold leading-6",
          tone === "danger" ? "text-boba-danger" : "text-boba-ink",
        )}
      >
        {title}
      </h2>
      <p className="mt-2 text-sm leading-5 text-boba-ink-muted">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
