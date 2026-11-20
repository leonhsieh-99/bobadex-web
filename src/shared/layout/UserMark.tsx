"use client";

import { useState } from "react";
import { publicAssetURL, thumbPath } from "@/utils/media";

function mediaSrc(path: string, kind: "thumb" | "original") {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return publicAssetURL(
    "media-uploads",
    kind === "thumb" ? thumbPath(path, 256) : path,
  );
}

export default function UserMark({
  imagePath,
  initials,
  size = 48,
}: {
  imagePath?: string | null;
  initials: string;
  size?: number;
}) {
  const [kind, setKind] = useState<"thumb" | "original" | "none">("thumb");
  const path = imagePath?.trim() || "";
  const showImage = path.length > 0 && kind !== "none";

  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2b241f]/10 font-black tracking-[-0.04em] text-[#2b241f]/75"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {showImage ? (
        <img
          src={mediaSrc(path, kind === "original" ? "original" : "thumb")}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() =>
            setKind((current) => (current === "thumb" ? "original" : "none"))
          }
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
}
