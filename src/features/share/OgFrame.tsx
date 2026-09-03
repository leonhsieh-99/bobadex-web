import type { ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

export function OgFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#fbf8f0",
        color: "#2b241f",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: 999,
          background: "rgba(255, 196, 93, 0.28)",
          top: -90,
          left: -70,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 340,
          height: 340,
          borderRadius: 999,
          background: "rgba(239, 91, 70, 0.12)",
          bottom: -80,
          right: -40,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
