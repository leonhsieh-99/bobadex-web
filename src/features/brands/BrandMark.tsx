"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useBrandVisuals } from "@/features/settings/BrandVisualsProvider";
import { publicAssetURL, thumbPath } from "@/utils/media";
import { BrandLettering } from "./BrandLettering";

export function BrandMark({
  iconPath,
  name,
  slug,
  size,
  displaySize,
  priority = false,
  eager = false,
}: {
  iconPath?: string | null;
  name: string;
  slug?: string | null;
  size: 256 | 512;
  displaySize?: number;
  priority?: boolean;
  eager?: boolean;
}) {
  const { showMascots } = useBrandVisuals();
  const loadNow = priority || eager;
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(loadNow);
  const [failed, setFailed] = useState(false);
  const rendered = displaySize ?? (size === 512 ? 176 : 64);
  const preferLettering = !showMascots || !iconPath || failed;

  useEffect(() => {
    if (preferLettering || loadNow || inView) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, loadNow, preferLettering]);

  if (preferLettering) {
    return <BrandLettering name={name} slug={slug} size={rendered} />;
  }

  if (!inView) {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        className="block h-full w-full rounded-[inherit] bg-[#2b241f]/6"
      />
    );
  }

  return (
    <Image
      src={publicAssetURL("shop-media", thumbPath(iconPath, size))}
      alt=""
      width={size}
      height={size}
      sizes={`${rendered}px`}
      className="h-full w-full object-contain"
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}
