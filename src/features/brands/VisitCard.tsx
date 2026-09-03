import type { ReactNode } from "react";

export function VisitCard({
  icon,
  title,
  body,
  action,
  children,
}: {
  icon: ReactNode;
  title: string;
  body: string | null;
  action: ReactNode | null;
  children?: ReactNode;
}) {
  return (
    <section
      aria-labelledby="your-drinks-heading"
      className="flex flex-col items-start gap-5 rounded-[2rem] border border-[#2b241f]/10 bg-white/50 p-8 sm:flex-row sm:items-center sm:p-10"
    >
      <div className="flex size-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-[#fff3c7]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h2
          id="your-drinks-heading"
          className="text-xl font-black tracking-[-0.03em]"
        >
          {title}
        </h2>
        {body ? (
          <p className="mt-2 max-w-xl text-sm leading-6 opacity-70 sm:text-base">
            {body}
          </p>
        ) : (
          <div className="mt-2">{children}</div>
        )}
      </div>
      {action}
    </section>
  );
}
