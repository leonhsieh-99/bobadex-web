import { MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import PublicSidebar from "@/shared/layout/PublicSidebar";
import { publicAssetURL, thumbPath } from "@/utils/media";

const featuredBrands = [
  {
    name: "Sunright Tea Studio",
    eyebrow: "Bright & refreshing",
    description:
      "A modern tea house known for fruit-forward drinks, fresh milk teas, and sunny West Coast energy.",
    region: "California",
    iconPath: "brand-icons/sunright-tea-studio-eada95-1751199270618.png",
    accent: "from-[#fff3c7] to-[#ffe4a8]",
    mascotBackdrop: "bg-[#ffc84a]",
    tags: ["Fresh fruit", "Milk tea", "Fan favorite"],
  },
  {
    name: "Gong Cha",
    eyebrow: "A global classic",
    description:
      "One of the most recognizable names in boba, with a deep menu of brewed teas and signature milk foam.",
    region: "Worldwide",
    iconPath: "brand-icons/gongcha-17742a-1751192743010.png",
    accent: "from-[#ffe8e2] to-[#ffd0c5]",
    mascotBackdrop: "bg-[#ef5b46]",
    tags: ["Milk foam", "Tea classics", "Global"],
  },
  {
    name: "Boba Guys",
    eyebrow: "Tea, thoughtfully made",
    description:
      "Small-batch tea, house-made ingredients, and a playful bear have made this Bay Area brand a staple.",
    region: "San Francisco Bay Area",
    iconPath: "brand-icons/bobaguys-243cad-1751190896090.png",
    accent: "from-[#e8f4ed] to-[#cde8d8]",
    mascotBackdrop: "bg-[#78b88d]",
    tags: ["Small batch", "House-made", "Bay Area"],
  },
] as const;

export default function Home() {
  return (
    <main
      id="top"
      className="min-h-screen overflow-hidden bg-[#fbf8f0] text-[#2b241f]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_18%_10%,rgba(255,196,93,0.20),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(239,91,70,0.12),transparent_27%)]" />

      <PublicSidebar />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16 md:ml-52 md:max-w-[calc(100%-13rem)] lg:px-10">
        <header className="mb-12 flex flex-col items-center border-b border-[#2b241f]/10 pb-12 text-center">
          <Image
            src="/bobadex.svg"
            alt="Bobadex"
            width={620}
            height={166}
            className="h-auto w-full max-w-[38rem]"
            priority
          />
          <p className="mt-2 max-w-2xl text-pretty text-base leading-7 opacity-70 sm:text-lg">
            A catalogue of boba brands, shops, drinks, and the people keeping
            track of them.
          </p>
          <a
            href="/auth/signup"
            className="mt-6 flex items-center gap-3 rounded-full border border-[#2b241f]/10 bg-white/70 px-5 py-3 text-sm font-semibold shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Sign up to track your favorites and build your own Bobadex
          </a>
        </header>

        <section id="featured" aria-labelledby="featured-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
                Today&apos;s catalogue picks
              </p>
              <h2
                id="featured-heading"
                className="text-3xl font-black tracking-[-0.035em] sm:text-4xl"
              >
                Featured brands
              </h2>
            </div>
            <span className="hidden text-sm opacity-60 sm:block">
              A daily rotation from the dex
            </span>
          </div>

          <div className="space-y-4">
            {featuredBrands.map((brand, index) => {
              const iconUrl = publicAssetURL(
                "shop-media",
                thumbPath(brand.iconPath, 512),
              );

              return (
                <article
                  key={brand.name}
                  className={`group relative grid overflow-hidden rounded-[2rem] border border-[#2b241f]/10 bg-gradient-to-br ${brand.accent} shadow-[0_12px_40px_rgba(74,51,32,0.06)] transition-transform duration-300 hover:-translate-y-0.5 md:grid-cols-[17rem_1fr]`}
                >
                  <div className="relative flex min-h-56 items-center justify-center overflow-hidden p-7 md:min-h-64">
                    <div
                      className={`absolute h-44 w-44 rounded-full ${brand.mascotBackdrop} opacity-25 blur-2xl transition-transform duration-500 group-hover:scale-125`}
                    />
                    <div className="relative flex size-40 items-center justify-center rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_14px_35px_rgba(73,49,31,0.14)] backdrop-blur sm:size-44">
                      <Image
                        src={iconUrl}
                        alt={`${brand.name} logo`}
                        width={176}
                        height={176}
                        className="h-full w-full object-contain"
                        priority={index === 0}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center border-t border-[#2b241f]/10 bg-white/30 p-7 backdrop-blur-[2px] md:border-l md:border-t-0 md:p-10">
                    <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] opacity-65">
                      {brand.eyebrow}
                    </p>
                    <h3 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">
                      {brand.name}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 opacity-70 sm:text-base sm:leading-7">
                      {brand.description}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      <span className="mr-2 inline-flex items-center gap-1.5 text-sm font-semibold">
                        <MapPin className="size-4" aria-hidden="true" />
                        {brand.region}
                      </span>
                      {brand.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#2b241f]/10 bg-white/65 px-3 py-1.5 text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
