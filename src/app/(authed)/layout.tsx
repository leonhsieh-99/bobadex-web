import { Fraunces, Inter } from "next/font/google";
import { DEFAULT_DEX_THEME } from "@/features/dex/theme";
import PublicSidebar from "@/shared/layout/PublicSidebar";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fbf8f0] text-[#2b241f]">
      <PublicSidebar />
      <div
        data-boba-theme={DEFAULT_DEX_THEME}
        className={`${fraunces.variable} ${inter.variable} min-h-screen bg-boba-bg font-body text-boba-ink md:ml-52`}
      >
        {children}
      </div>
    </div>
  );
}
