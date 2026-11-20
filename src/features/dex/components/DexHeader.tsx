export default function DexHeader({ count }: { count: number | null }) {
  const countLabel =
    count == null ? null : count === 1 ? "1 brand" : `${count} brands`;

  return (
    <header className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-boba-ink-muted">
        Your Bobadex
      </p>
      <h1 className="mt-1 font-display text-[32px] font-semibold leading-[38px] text-boba-ink lg:text-[40px] lg:leading-[46px]">
        Your brands
      </h1>
      {countLabel ? (
        <p className="mt-1 text-sm text-boba-ink-muted">{countLabel}</p>
      ) : null}
    </header>
  );
}
