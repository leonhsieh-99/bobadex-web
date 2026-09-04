import { ImageResponse } from "next/og";
import { brandInitials } from "@/features/brands/brandInitials";
import { getCachedBrandDetail } from "@/features/brands/loadBrandDetail";
import { OgFrame, OG_SIZE } from "@/features/share/OgFrame";
import { publicAssetURL, thumbPath } from "@/utils/media";

export const alt = "A brand in the Bobadex catalogue";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getCachedBrandDetail(slug);
  const name = brand?.display ?? "Bobadex";
  const summary = brand?.public_summary
    ? brand.public_summary.length > 160
      ? `${brand.public_summary.slice(0, 157).trim()}…`
      : brand.public_summary
    : "A brand in the Bobadex catalogue.";
  const iconSrc = brand?.icon_path
    ? publicAssetURL("shop-media", thumbPath(brand.icon_path, 256))
    : null;

  return new ImageResponse(
    <OgFrame>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 200,
            height: 200,
            borderRadius: 40,
            background: "white",
            boxShadow: "0 18px 40px rgba(73, 49, 31, 0.12)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {iconSrc ? (
            <img
              src={iconSrc}
              width={180}
              height={180}
              alt=""
              style={{ objectFit: "contain" }}
            />
          ) : (
            <div style={{ fontSize: 64, fontWeight: 800 }}>
              {brandInitials(name)}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              opacity: 0.55,
            }}
          >
            Bobadex
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 28, opacity: 0.62, maxWidth: 980 }}>{summary}</div>
    </OgFrame>,
    { ...OG_SIZE },
  );
}
