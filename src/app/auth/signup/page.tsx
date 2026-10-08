import { Suspense } from "react";
import AuthComingSoon from "@/features/auth/AuthComingSoon";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";
import EmailOtpForm from "@/features/auth/components/EmailOtpForm";
import PublicShell from "@/shared/layout/PublicShell";

export default function SignupPage() {
  if (!AUTH_ENABLED) return <AuthComingSoon />;

  return (
    <PublicShell>
      <Suspense>
        <EmailOtpForm mode="signup" />
      </Suspense>
    </PublicShell>
  );
}
