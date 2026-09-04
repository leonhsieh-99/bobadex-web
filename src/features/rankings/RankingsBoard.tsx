import { Lock, LogIn } from "lucide-react";
import Link from "next/link";
import UserMark from "@/shared/layout/UserMark";
import { userInitials } from "@/shared/layout/userInitials";
import { BrandRankList } from "./BrandRankList";
import type { BrandRankBy, BrandRanking, UserBoard } from "./types";

const TABS = [
  { id: "brands", label: "Brands" },
  { id: "users", label: "Users" },
] as const;

const SORTS: Array<{
  id: BrandRankBy;
  label: string;
  hint: string;
}> = [
  {
    id: "rating",
    label: "Rating",
    hint: "Highest average, at least 3 rated shops — same bar as the app.",
  },
  {
    id: "shops",
    label: "On dexes",
    hint: "Most user shops logged for this brand.",
  },
  {
    id: "stores",
    label: "Stores",
    hint: "Most mapped locations attached to the brand.",
  },
];

const pillClass = (active: boolean) =>
  `rounded-full px-3.5 py-1.5 text-sm font-bold ${
    active
      ? "bg-[#2b241f] text-[#fbf8f0]"
      : "bg-white/60 text-[#2b241f]/70 hover:bg-white"
  }`;

export default function RankingsBoard({
  ranked,
  by,
  tab,
  userBoard,
}: {
  ranked: BrandRanking[];
  by: BrandRankBy;
  tab: "brands" | "users";
  userBoard: UserBoard;
}) {
  const sortHint = SORTS.find((sort) => sort.id === by)?.hint;
  const usersLocked = userBoard.status !== "ready";

  return (
    <div>
      <div
        role="tablist"
        aria-label="Rankings"
        className="mb-6 flex flex-wrap gap-1.5"
      >
        {TABS.map((item) => {
          const selected = tab === item.id;
          const href =
            item.id === "users" ? "/rankings?tab=users" : `/rankings?by=${by}`;
          return (
            <Link
              key={item.id}
              href={href}
              scroll={false}
              replace
              role="tab"
              aria-selected={selected}
              className={pillClass(selected)}
            >
              <span className="inline-flex items-center gap-1.5">
                {item.label}
                {item.id === "users" && usersLocked ? (
                  <Lock className="size-3.5" aria-hidden="true" />
                ) : null}
              </span>
            </Link>
          );
        })}
      </div>

      {tab === "brands" ? (
        <div role="tabpanel">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {SORTS.map((sort) => (
              <Link
                key={sort.id}
                href={`/rankings?by=${sort.id}`}
                scroll={false}
                replace
                className={pillClass(by === sort.id)}
              >
                {sort.label}
              </Link>
            ))}
          </div>
          <p className="mb-5 max-w-xl text-sm leading-6 opacity-55">
            {sortHint}
          </p>
          <BrandRankList brands={ranked} by={by} />
        </div>
      ) : (
        <div role="tabpanel">
          <UserBoardPanel board={userBoard} />
        </div>
      )}
    </div>
  );
}

function UserBoardPanel({ board }: { board: UserBoard }) {
  if (board.status === "coming-soon") {
    return (
      <GateCard
        title="User rankings need accounts"
        body="This board ranks drinkers by shops logged on their Bobadex. Accounts aren't open on the web yet, so it stays locked for now."
      />
    );
  }

  if (board.status === "sign-in") {
    return (
      <GateCard
        title="Sign in to see drinkers"
        body="User rankings are for signed-in drinkers. Brands stay public."
        action
      />
    );
  }

  if (board.users.length === 0) {
    return (
      <p className="rounded-[1.6rem] border border-[#2b241f]/10 bg-white/50 p-8 text-sm opacity-70">
        No drinkers on the board yet.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-[#2b241f]/10 overflow-hidden rounded-[1.8rem] border border-[#2b241f]/10 bg-white/55">
      {board.users.map((user, index) => (
        <li
          key={user.id}
          className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
        >
          <span className="w-7 shrink-0 text-center text-sm font-black tabular-nums opacity-55">
            {index + 1}
          </span>
          <UserMark
            imagePath={user.profileImagePath}
            initials={userInitials(user.displayName, user.username)}
            size={48}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold tracking-[-0.02em]">
              {user.displayName}
            </span>
            {user.username ? (
              <span className="mt-0.5 block truncate text-sm opacity-55">
                @{user.username}
              </span>
            ) : null}
          </span>
          <span className="shrink-0 text-right">
            <span className="block text-sm font-bold tabular-nums">
              {user.shopCount}
            </span>
            <span className="text-xs opacity-50">
              {user.shopCount === 1 ? "shop" : "shops"}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function GateCard({
  title,
  body,
  action = false,
}: {
  title: string;
  body: string;
  action?: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-5 rounded-[2rem] border border-[#2b241f]/10 bg-white/50 p-8 sm:flex-row sm:items-center sm:p-10">
      <div className="flex size-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-[#fff3c7]">
        <Lock className="size-7" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-black tracking-[-0.03em]">{title}</p>
        <p className="mt-2 max-w-xl text-sm leading-6 opacity-70 sm:text-base">
          {body}
        </p>
      </div>
      {action ? (
        <Link
          href="/auth/login?next=/rankings"
          className="inline-flex items-center gap-2 rounded-full border border-[#2b241f]/10 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <LogIn className="size-4" aria-hidden="true" />
          Sign in
        </Link>
      ) : null}
    </div>
  );
}
