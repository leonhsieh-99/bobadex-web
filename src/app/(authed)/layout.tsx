// app/(authed)/layout.tsx

import TopNav from "@/shared/layout/TopNav";

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur" />
      <main className="flex-1">{children}</main>
    </div>
  )
}
