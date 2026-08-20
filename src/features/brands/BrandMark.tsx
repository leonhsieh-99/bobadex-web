"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { publicAssetURL, thumbPath } from "@/utils/media";
import { brandInitials } from "./brandInitials";

export function BrandMark({
  iconPath,
  name,
  size,
  displaySize,
  priority = false,
  eager = false,
}: {
  iconPath?: string | null;
  name: string;
  size: 256 | 512;
  displaySize?: number;
  priority?: boolean;
  eager?: boolean;
}) {
  const loadNow = priority || eager;
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(loadNow);
  const [failed, setFailed] = useState(false);
  const rendered = displaySize ?? (size === 512 ? 176 : 64);

  useEffect(() => {
    if (loadNow || inView) return;
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
  }, [inView, loadNow]);

  if (!inView) {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        className="flex h-full w-full items-center justify-center rounded-[inherit] bg-[#2b241f]/8 text-[0.65em] font-black tracking-[-0.04em] text-[#2b241f]/70"
      >
        {brandInitials(name)}
      </span>
    );
  }

  if (!iconPath || failed) {
    return (
      <span
        aria-hidden="true"
        className="flex h-full w-full items-center justify-center rounded-[inherit] bg-[#2b241f]/8 text-[0.65em] font-black tracking-[-0.04em] text-[#2b241f]/70"
      >
        {brandInitials(name)}
      </span>
    );
  }

  return (
    <Image
      src={publicAssetURL("shop-media", thumbPath(iconPath, size))}
      alt={`${name} logo`}
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
