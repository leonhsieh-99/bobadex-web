import { NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  if (!AUTH_ENABLED) redirect("/auth/login");

  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      redirect(next)
    }
  }

  redirect('/error')
}