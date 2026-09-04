import { Lock } from "lucide-react";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";
import { VisitCard } from "./VisitCard";

export default async function BrandVisitCta({
  slug,
  display,
}: {
  slug: string;
  display: string;
}) {
  if (!AUTH_ENABLED) {
    return (
      <VisitCard
        icon={<Lock className="size-7" aria-hidden="true" />}
        title="Your drinks are locked"
        body={`Accounts aren't open on the web yet. You can still read the ${display} dossier.`}
        action={null}
      />
    );
  }

  const { default: BrandVisitClient } = await import("./BrandVisitClient");
  return <BrandVisitClient slug={slug} display={display} />;
}
