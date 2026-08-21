"use client";

import Image from "next/image";
import { useState } from "react";
import { publicAssetURL, thumbPath } from "@/utils/media";
import type { BrandGalleryPhoto } from "./types";

export default function BrandPhotoStrip({
  photos,
}: {
  photos: BrandGalleryPhoto[];
}) {
  return (
    <section aria-labelledby="brand-photos-heading">
      <h2
        id="brand-photos-heading"
        className="mb-4 text-xl font-black tracking-[-0.03em] sm:text-2xl"
      >
        Community photos
      </h2>
      {photos.length === 0 ? (
        <p className="rounded-[1.6rem] border border-[#2b241f]/10 bg-white/50 p-6 text-sm opacity-70">
          No public photos yet.
        </p>
      ) : (
        <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {photos.map((photo) => (
            <li key={photo.id} className="shrink-0">
              <GalleryStill photo={photo} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function GalleryStill({ photo }: { photo: BrandGalleryPhoto }) {
  const [kind, setKind] = useState<"thumb" | "original" | "none">("thumb");
  const src =
    kind === "thumb"
      ? publicAssetURL("media-uploads", thumbPath(photo.image_path, 256))
      : publicAssetURL("media-uploads", photo.image_path);

  return (
    <figure className="w-36 overflow-hidden rounded-[1.4rem] border border-[#2b241f]/10 bg-white/70 sm:w-44">
      <div className="relative h-44 w-full bg-[#2b241f]/5 sm:h-52">
        {kind !== "none" ? (
          <Image
            src={src}
            alt={photo.comment?.trim() || "Public community photo"}
            fill
            sizes="176px"
            className="object-cover"
            onError={() =>
              setKind((current) => (current === "thumb" ? "original" : "none"))
            }
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs opacity-50">
            Photo unavailable
          </div>
        )}
      </div>
    </figure>
  );
}
