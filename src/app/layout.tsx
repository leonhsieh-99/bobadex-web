import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";
import { BrandVisualsProvider } from "@/features/settings/BrandVisualsProvider";
import {
  BRAND_VISUALS_COOKIE,
  parseBrandVisuals,
} from "@/features/settings/brandVisuals";
import { SITE_URL } from "@/shared/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const title = "Bobadex — Discover your next favorite boba spot";
const description =
  "A public catalogue of boba brands. Browse freely — accounts aren't open on the web yet.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Bobadex",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const brandVisuals = parseBrandVisuals(
    cookieStore.get(BRAND_VISUALS_COOKIE)?.value,
  );
  const inner = AUTH_ENABLED ? await wrapWithProviders(children) : children;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen flex flex-col ${geistSans.variable} antialiased`}
      >
        <BrandVisualsProvider initial={brandVisuals}>
          {inner}
        </BrandVisualsProvider>
      </body>
    </html>
  );
}

async function wrapWithProviders(children: React.ReactNode) {
  const { default: AppProviders } = await import("./providers");
  return <AppProviders>{children}</AppProviders>;
}
