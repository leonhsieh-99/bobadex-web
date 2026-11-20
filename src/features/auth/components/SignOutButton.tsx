"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export default function SignOutButton({
  className,
  children = "Sign out",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      className={cn(className)}
      disabled={pending}
      onClick={async () => {
        if (pending) return;
        setPending(true);
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
          queryClient.clear();
          router.replace("/");
          router.refresh();
        } catch {
          setPending(false);
        }
      }}
    >
      {children}
    </button>
  );
}
