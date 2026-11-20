export default function StatTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-boba-md bg-boba-surface-alt px-2 py-3 text-center">
      <p className="font-display text-xl font-semibold tabular-nums text-boba-ink">
        {value}
      </p>
      <p className="mt-1 text-[11px] leading-4 font-medium text-boba-ink-muted">
        {label}
      </p>
    </div>
  );
}
