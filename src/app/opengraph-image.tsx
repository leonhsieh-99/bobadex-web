import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE } from "@/features/share/OgFrame";

export const alt = "Bobadex — a public catalogue of boba brands";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgFrame>
      <div style={{ display: "flex", flexDirection: "column" }}>
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
            marginTop: 28,
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            maxWidth: 920,
          }}
        >
          Open the catalogue.
        </div>
      </div>
      <div style={{ fontSize: 32, opacity: 0.62, maxWidth: 820 }}>
        Browse boba brands. Accounts aren't open on the web yet.
      </div>
    </OgFrame>,
    { ...OG_SIZE },
  );
}
