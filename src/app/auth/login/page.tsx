import AuthCard from "@/features/auth/components/AuthCard";
import AuthComingSoon from "@/features/auth/AuthComingSoon";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";

export default function LoginPage() {
  if (!AUTH_ENABLED) return <AuthComingSoon />;
  return <AuthCard mode="login" />;
}