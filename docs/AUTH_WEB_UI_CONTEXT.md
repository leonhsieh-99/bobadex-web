# Authenticated web UI context

Read-only handoff for a later visual pass on the signed-in web UI. Inspected `bobadex-web` and `bobadex-app` as they stand. This file records screens, tokens, and behavior. It does not propose a redesign.

Product boundary already written in [mobile-ui-handoff.md](mobile-ui-handoff.md): the site is a public catalogue; an account is only for a personal dex. Do not port the phone tab bar, Collect, or Friends. Flutter theme source of truth is `bobadex-app/lib/ui/theme/`. `bobadex-app/docs/design/redesign-plan.md` is stale where it disagrees with `boba_themes.dart`.

## 1. Scope

Auth is off unless `NEXT_PUBLIC_AUTH_ENABLED=true` (`src/features/auth/authEnabled.ts`). While it is off, guests hitting a non-public path are redirected to `/`, and login/signup render “Accounts aren’t open yet.” While it is on, guests are redirected to `/auth/login?next=…`, and a signed-in user on `/auth/login`, `/auth/signup`, `/login`, or `/auth` is sent to `/dashboard`. Gate: `utils/supabase/middleware.ts`. The dashboard layout also calls `getUser()` and redirects to `/auth/login` if there is no session (`src/app/(authed)/dashboard/layout.tsx`).

Public paths (no session required): `/`, `/about`, `/settings`, `/brands` and `/brands/[slug]`, `/achievements`, `/rankings`, `/login`, `/auth` (including `/auth/login`, `/auth/signup`, `/auth/confirm`), `/api/auth/otp`, `/error`, favicon, and Open Graph / Twitter images.

The only screens inside the `(authed)` route group are `/dashboard` and `/dashboard/[shopId]`. Settings, achievements, rankings, brands, and the auth forms stay in the public shell. Signed-in behavior on those public pages is listed in section 7.

There is no `/dashboard/profile` page. Sidebar and Settings link to it. The URL matches `[shopId]` with `shopId="profile"`, so the side panel looks up a shop that is not in the cache and shows “Select a shop.”

The dashboard layout reads `searchParams.userId`, but App Router layouts are not passed `searchParams`. `ownerId` is always the current user. `isOwner` is passed into the shell and unused.

There is no sign-out control. `signOut` exists only as cleanup after a failed login (`src/features/auth/otpAuthClient.ts`).

## 2. Layouts and navigation

Two shells. They do not nest.

**Root** (`src/app/layout.tsx`). Geist variable on `<body>`, `BrandVisualsProvider` around every page (mascots vs minimal, from a cookie). `AppProviders` (React Query) wraps children only when auth is on. Nothing sets `class="dark"`.

**Public shell** (`src/shared/layout/PublicShell.tsx`), used by home, brands, achievements, rankings, about, settings, and auth.

- Page: `bg-[#fbf8f0] text-[#2b241f]`.
- Decorative wash, 34rem tall: gold `rgba(255,196,93,0.20)` at 18%/10%, coral `rgba(239,91,70,0.12)` at 85%/18%.
- Column: `max-w-6xl`, `px-5 pt-10`, `sm:px-8 sm:pt-16`, `lg:px-10`. From `md`: `md:ml-52 md:max-w-[calc(100%-13rem)]`.
- Auth-off banner: pill, `rounded-full border border-[#2b241f]/10 bg-white/70 text-xs font-semibold`. Copy: “Catalogue preview — browse freely. Accounts aren’t open on the web yet.”

**Public sidebar** (`src/shared/layout/PublicSidebar.tsx`). Below `md`, a horizontal scrolling bar (`border-b`, `bg-[#fbf8f0]/90 backdrop-blur`). From `md`, `fixed inset-y-0 left-0 w-52 border-r`. No drawer and no bottom tab bar.

- Avatar (`UserMark`, 48px) links to `/dashboard/profile` when signed in, otherwise `/`.
- Catalogue links: Home, Brands, Achievements, Rankings, About, Settings.
- Member links: “My Bobadex” → `/dashboard`, “Profile” → `/dashboard/profile`. Guests see them disabled (lock, `opacity-45`, `cursor-not-allowed`). Guest “Sign in” → `/auth/login?next=/dashboard`.
- Item: `rounded-xl px-3 py-2.5 text-sm font-semibold`. Active `bg-[#2b241f]/8`. Hover `hover:bg-[#2b241f]/5`. Lucide icons at 18px.

**Authenticated shell**, dashboard only.

- `src/app/(authed)/layout.tsx`: column, sticky `TopNav` (`h-14`, `z-50`, `border-b bg-white/80 backdrop-blur`), then `<main>`.
- `src/shared/layout/TopNav.tsx` renders the text “TOP NAV PLACEHOLDER”. No links, user menu, or logout.
- `DashboardShell` (`src/features/dashboard/components/DashboardShell.tsx`) replaces the page body with a second `<main>`: `[grid-template-columns:calc(65%-1%)_calc(35%-1%)] gap-x-[2%] px-10 py-3`. Left section and right aside are `border rounded-xl` and scroll. The public cream sidebar is not on these screens. The page inherits root `bg-background` (white), not `#fbf8f0`.

The 65/35 split and `px-10` do not change with viewport. Shop tiles do: 1 column, 2 from `sm`, 3 from `lg`. Tile height `h-40` / `sm:h-44` / `lg:h-48`.

| Route | Shell | What it renders |
|---|---|---|
| `/dashboard` | Authed + DashboardShell | Shop grid. Right panel: “Select a shop.” |
| `/dashboard/[shopId]` | Same | Right panel is `ShopDetails` for that id. |
| `/settings` | Public | Device brand visuals, AI disclosure, account block. Not auth-only. |
| `/auth/login`, `/auth/signup` | Public | Email OTP, or `AuthComingSoon` when auth is off. |

## 3. Components the authenticated UI actually uses

`src/shared/ui/*` is a shadcn New York set (button, card, tabs, dialog, badge, input, textarea, select, skeleton) on Radix. Nothing in `src/` imports it. `components.json` aliases `ui` to `@/components/ui`; the files live in `src/shared/ui`. Live dashboard and auth UI use raw elements.

| Component | Role | Visual notes |
|---|---|---|
| `ShopsView` | Shop tiles | `grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3`. Tile: `rounded-xl border p-3`. Active: `bg-muted ring-1 ring-muted-foreground/20`. Idle: `bg-background hover:bg-muted/50`. Name `font-medium`. Rating `text-sm opacity-70` or an em dash. Mark frame `size-[90px] rounded-2xl`, centered. Click → `/dashboard/{id}`. |
| `ShopDetails` | Side panel | `p-4 space-y-4`. Title `text-xl font-semibold`. Each drink: `border rounded-lg p-2`, name and “Rating: {n or —}”. |
| `BrandMark` | Mascot or letter tile | Image, or `BrandLettering` when visuals are Minimal, the icon is missing, or the image errors. Placeholder `bg-[#2b241f]/6`. |
| `BrandLettering` | Initials tile | Gradient from `brandAccent.ts`, `font-black tracking-[-0.06em] text-[#2b241f]`. |
| `UserMark` | Avatar | `rounded-full bg-[#2b241f]/10 font-black text-[#2b241f]/75`. Photo or initials. |
| `EmailOtpForm` | Login / signup | Fields `rounded-2xl border border-[#2b241f]/10 bg-white px-4 py-3`. Primary `rounded-full bg-[#2b241f] text-[#fbf8f0]`. Error `text-[#9a3412]`. Title `text-4xl font-black tracking-[-0.04em]`. |
| `SettingsView` | Public settings | Sections `rounded-[1.8rem] border border-[#2b241f]/10 bg-white/50 p-6`. Selected option `border-[#2b241f]/25 bg-white shadow-sm`. |
| `VisitCard` | Signed-in / locked brand slice | `rounded-[2rem] border bg-white/50 p-8 sm:p-10`. Icon well `size-16 rounded-[1.4rem] bg-[#fff3c7]`. |

Public pills and cards use `hover:-translate-y-0.5`. Dashboard tiles do not.

## 4. Current web styling

Tailwind v4, CSS-first. No `tailwind.config`. PostCSS is `@tailwindcss/postcss`. `src/app/globals.css` imports `tailwindcss` and `tw-animate-css`.

**Type.** `Geist` from `next/font/google`, variable `--font-geist-sans`, subset `latin`. Theme maps `--font-sans` to that variable. Mono is `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`. Body gets the variable class and `antialiased`. No Fraunces or Inter.

**Radius tokens** (`globals.css`). `--radius: 0.625rem` (10px). sm 6px, md 8px, lg 10px, xl 14px. Public UI mostly ignores these and uses `rounded-[1.2rem]` through `rounded-[2rem]` and `rounded-full`.

**Light semantic tokens** (`:root`). All oklch, neutral. Dashboard classes (`bg-background`, `bg-muted`, `border`) resolve to these. Public pages hardcode hex instead.

| Token | Value |
|---|---|
| `--background`, `--card`, `--popover` | `oklch(1 0 0)` |
| `--foreground`, `--card-foreground`, `--popover-foreground`, `--sidebar-foreground` | `oklch(0.145 0 0)` |
| `--primary`, `--secondary-foreground`, `--accent-foreground`, `--sidebar-primary` | `oklch(0.205 0 0)` |
| `--primary-foreground`, `--sidebar`, `--sidebar-primary-foreground` | `oklch(0.985 0 0)` |
| `--secondary`, `--muted`, `--accent`, `--sidebar-accent` | `oklch(0.97 0 0)` |
| `--muted-foreground` | `oklch(0.556 0 0)` |
| `--destructive` | `oklch(0.577 0.245 27.325)` |
| `--border`, `--input`, `--sidebar-border` | `oklch(0.922 0 0)` |
| `--ring`, `--sidebar-ring` | `oklch(0.708 0 0)` |

Chart tokens exist (`--chart-1` … `--chart-5`) and are unused by the dashboard. `.dark` (lines 86–118) is defined and never applied. `TopNav` uses `bg-white/80`, which would not follow a `.dark` flip even if one were added. Public hex would stay cream anyway.

**Base.** `* { border-border outline-ring/50 }`. `html { scroll-behavior: smooth }`, `auto` under `prefers-reduced-motion`. `body { bg-background text-foreground }`.

**Public palette** (settings, auth, brand pages, sidebar). Paper `#fbf8f0`, ink `#2b241f`. Hairline `border-[#2b241f]/10`, selected `border-[#2b241f]/25`. Surfaces `bg-white/40`–`bg-white/75`. Gold well `#fff3c7`. Alert `#9a3412`. Filled pill `bg-[#2b241f] text-[#fbf8f0]`.

**Public type rhythm.** Eyebrow `text-xs font-bold uppercase tracking-[0.2em] opacity-60` (settings sections use `0.18em` / `opacity-55`). Page title `text-4xl sm:text-5xl font-black tracking-[-0.04em]`. Section title `text-lg font-black tracking-[-0.03em]`. Body `text-base leading-7 opacity-70 sm:text-lg`.

**Breakpoints.** Tailwind defaults, not overridden: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.

**Brand accent gradients** (`src/features/brands/brandAccent.ts`), hashed from slug. These are catalogue lettering fills, not the Flutter lettering palettes.

| Accent gradient | Backdrop |
|---|---|
| `#fff3c7` → `#ffe4a8` | `#ffc84a` |
| `#ffe8e2` → `#ffd0c5` | `#ef5b46` |
| `#e8f4ed` → `#cde8d8` | `#78b88d` |
| `#eef3dc` → `#d7e4b5` | `#7a9a3a` |
| `#fde8e8` → `#f5c8c8` | `#c43b3b` |

Motion utilities (`marquee`, `float`, milk-tea idle/pearl/straw) belong to the public home and about cup, not the dashboard.

## 5. Flutter design language

Collector’s ledger: warm paper (or a deep drink-colored dark ground), one accent, flat outlined cards, serif headlines. Applied in `bobadex-app/lib/bobadex.dart` as a single `theme:` from `BobaThemeBuilder.build(BobaThemes.resolve(slug))`. No `darkTheme` and no system light/dark pairing. The user picks one complete theme. Default slug: `classic_milk_tea`.

Files:

| Role | Path |
|---|---|
| Catalog | `bobadex-app/lib/ui/theme/boba_themes.dart` |
| Tokens, radius, space | `bobadex-app/lib/ui/theme/boba_tokens.dart` |
| `ThemeData` mapping | `bobadex-app/lib/ui/theme/boba_theme_builder.dart` |
| Type | `bobadex-app/lib/ui/theme/boba_typography.dart` |
| Access | `bobadex-app/lib/ui/theme/boba_context.dart` (`context.boba`) |
| Picker | `bobadex-app/lib/pages/setting_pages/settings_theme_page.dart` |
| Preview card | `bobadex-app/lib/ui/components/theme_preview_card.dart` |
| Contrast test | `bobadex-app/test/theme_contrast_test.dart` |

Legacy Material names remap in `legacyThemeMap`: Brown and grey → Classic Milk Tea; Blue Grey and Cyan → Oolong; Orange → Thai Tea; Yellow → Mango; Pink and Red → Strawberry; Purple, Deep Purple, and Indigo → Taro; Green and Teal → Matcha.

`ColorScheme`: `primary` / `secondary` = accent, `onPrimary` / `onSecondary` = onAccent, containers = accentSoft, on-containers = accentInk, `error` = danger, `surface` = surface, `onSurface` = ink, outline = outline. Scaffold and canvas = `bg`. Material 3 is on. Contrast test requires ink on bg and on surface ≥ 7:1, and inkMuted on surface, onAccent on accent, and accentInk on bg ≥ 4.5:1.

Always-on: `onImage` `#FFFFFF`, `imageScrim` `#000000`.

**Shared semantics.** Light themes except where noted: star `#E8B84A`, star outline `#6B4E1A` at 60% (`0x996B4E1A`), heart `#E07A7A`, success `#4E8A5B`, danger `#C4453F`, shadow `#2B1F17` at about 12% (`0x1F2B1F17`), onAccent `#FFFFFF`. Mango uses star `#D0931F` and onAccent `#2A2008`. Dark themes: star `#F0C25A`, star outline `#FFFFFF`, heart `#EA8B8B`, success `#6FB07C`, danger `#E06B66`, shadow `#000000` at 50% (`0x80000000`), onAccent = that theme’s `bg`.

### Light themes

| slug | name | bg | surface | surfaceAlt | outline | ink | inkMuted | inkFaint | accent | onAccent | accentSoft | accentInk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `classic_milk_tea` | Classic Milk Tea | `#F5EEE3` | `#FFFCF7` | `#EFE5D6` | `#E3D6C5` | `#2B1F17` | `#6F6157` | `#B8AB9E` | `#8A5A3C` | `#FFFFFF` | `#EBD9C7` | `#6E4429` |
| `matcha` | Matcha | `#EFF3E9` | `#FBFDF8` | `#E4EBDC` | `#D6DFCC` | `#1E271C` | `#5F6B5A` | `#A9B3A3` | `#5C7F4C` | `#FFFFFF` | `#DAE7CF` | `#46633A` |
| `taro` | Taro | `#F2EEF7` | `#FCFAFE` | `#E8E1F0` | `#DCD3E6` | `#27203A` | `#695F7A` | `#B0A7BF` | `#7B5AA6` | `#FFFFFF` | `#E5DAF1` | `#5E4384` |
| `strawberry` | Strawberry | `#FAEFF0` | `#FFFAFA` | `#F3E1E3` | `#EBD5D7` | `#33201F` | `#7A625F` | `#BFA9A7` | `#B84A60` | `#FFFFFF` | `#F6D6DC` | `#9E3F52` |
| `thai_tea` | Thai Tea | `#FAF0E6` | `#FFFAF5` | `#F2E2D3` | `#EAD8C6` | `#33241A` | `#7A6656` | `#BFAB9B` | `#B85A2A` | `#FFFFFF` | `#F5DBC8` | `#A6512A` |
| `mango` | Mango | `#FBF4E2` | `#FFFCF4` | `#F3E8CF` | `#EADDBE` | `#33290F` | `#77693F` | `#BBAE86` | `#D9A23A` | `#2A2008` | `#F7E6B8` | `#73520F` |
| `oolong` | Oolong | `#F1F1EE` | `#FBFBF9` | `#E6E7E2` | `#D8DAD4` | `#22252A` | `#646A72` | `#A6ABB2` | `#4E6F6C` | `#FFFFFF` | `#D8E5E3` | `#3B5654` |

### Dark themes

| slug | name | bg | surface | surfaceAlt | outline | ink | inkMuted | inkFaint | accent | onAccent | accentSoft | accentInk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `brown_sugar` | Brown Sugar | `#1B1411` | `#251C18` | `#2F2520` | `#3A2E28` | `#F4EADF` | `#B5A493` | `#6E6055` | `#DDA46A` | `#1B1411` | `#3B2C22` | `#E8B981` |
| `black_sesame` | Black Sesame | `#121212` | `#1B1B1B` | `#262626` | `#3B3B3B` | `#ECECEC` | `#A3A3A3` | `#666666` | `#CFC7BA` | `#121212` | `#2C2A26` | `#D9D2C6` |
| `midnight_taro` | Midnight Taro | `#15121D` | `#1E1A29` | `#2A2438` | `#403753` | `#EFEAF7` | `#ADA4C0` | `#6A6280` | `#B08BE0` | `#15121D` | `#2F2542` | `#C4A6EC` |

### Type

Google Fonts (`google_fonts`), not a bundled text theme. Unspecified Material slots stay Inter.

| Slot | Font | Size / line | Weight | Color |
|---|---|---|---|---|
| `displaySmall` | Fraunces | 32 / 38 | 600 | ink |
| `headlineSmall` | Fraunces | 24 / 30 | 600 | ink |
| `titleMedium` | Fraunces | 18 / 24 | 600 | ink |
| `bodyLarge` | Inter | 16 / 22 | 400 | ink |
| `bodyMedium` | Inter | 14 / 20 | 400 | ink |
| `labelLarge` | Inter | 13 / 16 | 600 | ink |
| `labelSmall` | Inter | 12 / 16 | 500 | inkMuted |

`BobaTypography.numeral` is Fraunces 600 with tabular figures. `boba_context.dart` adds `empty` (16 italic inkMuted) and `badge` (10 / 600 / onAccent). `pubspec.yaml` still bundles Noto Serif SemiBold; live ratings use Fraunces via `RatingText`.

### Space, shape, motion

| Token | Values |
|---|---|
| Radius xs / sm / md / lg / xl / pill | 6 / 10 / 14 / 20 / 28 / 999 |
| Space x1–x8 | 4, 8, 12, 16, 20, 24, 32, 40 |
| Stroke hairline / card / focus | 0.5 / 1 / 2 |
| Motion press / fast / normal / slow / stamp | 120 / 180 / 260 / 420 / 500 ms |
| Tap target | 44 |
| Marks | 32, 44, 64, 96 |
| Avatars | 24, 40, 56, 88 |
| Floating shadow | token shadow, blur 24, offset (0, 8) |

### Chrome

**Buttons** (`boba_button.dart`, theme in `boba_theme_builder.dart`). Pill. Filled: accent / onAccent, min height 48, horizontal padding 20, elevation 0, `labelLarge`. Disabled: surfaceAlt / inkFaint. Outlined: ink on outline. Text: accentInk. Small height 36. Danger uses the danger fill.

**Inputs.** Filled `surfaceAlt`, radius 14, no border until focus (accent, 2px) or error (danger). Padding 16×12. Hint inkFaint.

**Cards** (`boba_card.dart`). Default padding 16, radius 20. Flat: surface, 1px outline, no shadow. Floating: same plus `BobaShadow.floating`. Inset: surfaceAlt, no border. Press scale 0.98 over 120ms, no ripple. Optional left accent spine is 3px.

**Entry tiles** (`entry_tile.dart`). Square grid, gap 8, page padding 8. Mark style: radius 20, padding 12, spine `accentInk` on light and `accent` on dark. Name Fraunces ~13 scaled, 2 lines. Footer: gold rating, cup SVG 13 in inkMuted, count. Brand mark bottom-right, about 58% of tile width (clamp 52–160). Favorite heart 16 in `heart`, top-right. Photo style: full-bleed image, radius 20, bottom scrim, white name and rating.

**Drink rows** (`drink_row.dart`). Flat, no card. Rating column 52. Name `labelLarge`. Notes inkMuted, 2 lines until expanded. Heart 16. Pin bookmark 14 in `heart`.

**Chips.** Pill, padding 12×8. Off: surfaceAlt + inkMuted. On: accentSoft + accentInk.

**Empty state.** Centered, max width 360, padding 24. Default icon 52 in inkFaint. Title `titleMedium`, body `bodyMedium` inkMuted.

**Progress.** Height 8, pill track surfaceAlt, fill accent.

**Sheets.** Surface, top radius 28, optional 36×4 grabber. Shop sheet overrides the top radius to 20. Drink dialog uses radius 16.

**Nav** (`boba_nav_bar.dart`, shell `lib/pages/app_shell.dart`, router `lib/helpers/go_router.dart`). Floating pill, max width 560, side margin 16, bottom offset 8 + safe area. Bar height 64 inside a 72 stack. Surface at 94% alpha, pill radius 999, hairline outline at 70%, floating shadow. Selected tab is an accentSoft bubble. Destinations: Dex, Collect, Friends, You, plus a raised 52px accent add button. This is phone chrome. [mobile-ui-handoff.md](mobile-ui-handoff.md) says the web shell stays a sidebar and does not gain Collect or Friends.

App bar: bg = page bg, elevation 0, title left-aligned Fraunces 18. The signed-in Dex has no app bar. `DexHeader` uses Fraunces 32 and “N brands · N drinks” in Inter 14 inkMuted.

### Screens that define the personal collection

Routes: `/dex` collection grid (`lib/pages/home_page.dart`), `/collect` counties, `/friends`, `/you` profile (`lib/pages/account_view_page.dart`). Pushed, not tabs: shop detail, brand details, drink dialog, achievements, settings, rankings (“Leaderboard”).

**Dex.** Header, then a pinned filter row (search plus Fav, Rating, Name, Added). Square mark tiles as above. Empty: “Your dex is empty.” Loading is a skeleton grid.

**Shop.** Banner about 30% of height. Photo, or accentSoft with a 96 `BrandMark`. Draggable surface sheet, top radius 20. Brand link, pinned drink, notes, “Drinks” in Fraunces, then `DrinkRow`s. Empty: “No drinks logged yet.”

**You.** `CollectorCard` radius 28: 72px accentSoft band reading `BOBADEX`, avatar 88 with a 3px surface ring, name Fraunces 24, `@username` inkMuted. `StatTrio`: Brands / Drinks / Badges on surfaceAlt, radius 14. Up to three badge slots. Then a leaderboard preview and list rows (activity, achievements, settings, about).

**Achievements.** Group headers Fraunces 18. Rows are list tiles with 40px badge art. Locked hidden achievements show a question mark.

**Settings.** Uppercase section labels (tracking 0.8, inkMuted), then list tiles. Appearance: Theme, Layout. Account, privacy, sign out in `danger`. Theme page is a 2-column swatch grid, gap 8, live-apply on tap.

### Brand marks

`bobadex-app/lib/widgets/brand_mark.dart`. Mascot when `useMascots` and an icon exists; otherwise a 1–2 letter monogram, weight 700, radius 12 when not circular. Silhouette (missing from the viewer’s dex): grayscale at 45% opacity, or inkFaint letters on surfaceAlt. Accent ring hues, hashed: `#9B6847`, `#5F8067`, `#9B6173`, `#6276A0`, `#B08045`, `#6D6A65`, `#4F817D`, `#A35C55`.

Light lettering pairs (bg / fg): `#E9D8C8`/`#4A3428`, `#D7E5CC`/`#3A4A32`, `#E6D6EF`/`#4A3A58`, `#F0D6DA`/`#5A3438`, `#F0DCC8`/`#5A3E28`, `#F2E4C0`/`#5A4820`, `#DCE2E0`/`#3A4444`, `#EBD4CC`/`#5A3834`.

Dark lettering pairs: `#3A281E`/`#F3E6D8`, `#243832`/`#E4EFEA`, `#3A2430`/`#F6E8EE`, `#243044`/`#E8EEF7`, `#3E2C18`/`#F7E7C6`, `#2E2E2E`/`#EDE8E0`, `#1E3836`/`#DCEDEA`, `#3E2222`/`#F6E4E0`.

Splash ground is `#F5EEE3` (`pubspec.yaml`). Wordmark SVG: `lib/assets/logo.svg`. Cup glyph: `lib/assets/icons/boba1.svg`. Stars and hearts are SVG assets tinted at use (`star` / `heart` tokens), not the web’s raw number or em dash.

## 6. Visual inconsistencies

- **Type.** Web is Geist, often `font-black` with tracking `-0.04em`. The app is Fraunces 600 for titles and numbers, Inter for body and controls.
- **Ground.** The dashboard is neutral white (`oklch(1 0 0)`) with gray borders. The app’s default ground is Classic Milk Tea `#F5EEE3`, cards `#FFFCF7`, outline `#E3D6C5`, accent `#8A5A3C`, ink `#2B1F17`.
- **Public paper is the same family, not the same hex.** Catalogue pages use `#fbf8f0` / `#2b241f`. Classic Milk Tea is `#F5EEE3` / `#2B1F17`. The existing handoff keeps public pages on the site paper and limits account themes to the personal dex.
- **No account theme on the web.** The phone saves one of the ten slugs. The web has a device mascot/minimal cookie only. `.dark` in `globals.css` is unused and is not one of the drink themes.
- **Tiles.** Web shop tiles are a name, a raw rating, and a centered 90px mark in a rounded square. Dex tiles are square, with a 3px spine, gold star, cup count, mark bottom-right, and an optional heart.
- **Drinks.** Web rows are bordered boxes with “Rating: N”. App rows are flat ledger lines with a Fraunces numeral, gold star, clipped notes, heart, and pin.
- **Empty and loading.** Web says “Loading shops…”, “Failed to load shops” in `text-red-500`, or “Select a shop.” An empty shop list is a blank grid. An empty drink list is a blank `<ul>`. Drink fetch errors are ignored (`error` is unused in `ShopDetails`). The app uses skeleton grids, `EmptyState`, and inkFaint icons.
- **Chrome.** Signed-in web is a placeholder 56px white bar plus a 65/35 split that never stacks. Public web is a cream sidebar. The phone is a floating pill. Those are three different shells.
- **Profile.** “Profile” and “Open profile” point at `/dashboard/profile`, which is not a profile. There is no collector card, stat trio, or theme picker on the web.
- **Lettering.** Web lettering is a hashed gradient from `brandAccent.ts` with ink `#2b241f` and `font-black`. App lettering is a solid hashed pair from `brand_mark.dart`, weight 700, and switches to the dark catalog on dark themes.
- **Ratings.** Web prints a number or an em dash. The app uses gold stars and “Unrated” when there is no score (public catalogue already says Unrated on brand pages).

## 7. Behavior to preserve

This is what the signed-in UI does today. Fields the UI ignores are data, not features to invent.

**Shop grid.** Loads the signed-in user’s shops (`fetchShopsByOwnerId`). Shows `name`, `rating` or an em dash, and a `BrandMark` resolved through `brand_slug` against the brands cache. Mark follows the device setting: mascot, or initials if Minimal, missing icon, or image error. Clicking a tile goes to `/dashboard/{id}`. The open tile gets the muted ring. Copy: “Loading shops…”, “Failed to load shops”. `Shop` also has `is_favorite`, `notes`, `pinned_drink_id`, and `created_at`. None of those are shown. `isOwner` is unused. There is no add, edit, delete, search, or filter.

**Drink panel.** If the shop is not in the React Query cache: “Select a shop.” Otherwise the shop name, “Rating: {n or —}”, and a “Drinks” list of name plus rating. Drinks also have `notes`, `is_favorite`, `visibility` (`private` | `public`), and `created_at`. None of those are shown. No add, expand, search, or sort. Fetch errors are not rendered.

**Brand visuals.** `/settings` radios: Mascots (default) vs Minimal, with lettering previews for Gong Cha, Tiger Sugar, and Chagee. Saved on this device (cookie + localStorage), not the account. Applies everywhere `BrandMark` is used, including the dashboard.

**Settings account block** (still the public page). Signed out and auth on: “Sign in to change username, photo, and other profile settings,” link `/auth/login?next=/settings#account`. Auth off: “Accounts aren’t open on the web yet.” Signed in: short copy plus “Open profile” → `/dashboard/profile` (the broken route above). AI & Data stays, with a link to `/about#ai-data`.

**Auth forms** (public shell, only when auth is on). Login: email, “Send code”, 6-digit code, “Verify code”, 60s resend. Signup adds Name (2–20) and Username (3–15, letters, numbers, underscores). Success goes to `next`, default `/dashboard`. Specific error sentences stay (unknown email, taken username, bad or expired code, rate limit).

**Signed-in slices of public pages.**

- Sidebar shows the real avatar or initials, unlocks My Bobadex and Profile, and hides Sign in. Viewer row reads `users.username`, `display_name`, `profile_image_path`.
- Brand page (`BrandVisitClient`): guest sees “Your drinks are locked” and a sign-in link back to that brand. Signed in with no shop: “Add this to your dex” and “Open your dex” → `/dashboard`. Signed in with a shop: “Your drinks”, rating to one decimal or an em dash, up to 6 name chips, “+N more”, and “Edit in your dex” → `/dashboard/{shopId}`. That link still cannot edit.
- Rankings Brands tab stays public. Users tab stays gated: auth off, “User rankings need accounts”; guest, “Sign in to see drinkers”; signed in, display name, @username, avatar, and shop count.
- Achievements stay a public grid. Auth on adds a signup prompt. Home, when auth is on, adds a signup line.

Auth-off copy (“Accounts aren’t open yet”, the catalogue-preview banner) stays until the flag is on.

## 8. Constraints and file map

| Piece | Fact |
|---|---|
| Next.js | 15.5.9, App Router, Turbopack (`next dev --turbopack`) |
| React | 19.1.0 |
| Tailwind | 4, `@tailwindcss/postcss`, no JS config |
| Variants | `class-variance-authority`, `clsx`, `tailwind-merge` (`cn` in `src/lib/utils.ts`) |
| Icons | `lucide-react` 0.545.0 |
| Motion | `motion` on public home, not the dashboard |
| Data | `@tanstack/react-query` 5.90.9. Stale 2 min, gc 30 min, no refetch on focus, retry 1. Provider only if auth is on. |
| Forms | `react-hook-form` and `zod` are dependencies. Auth UI is `useState`, not those libraries. |
| Auth | `@supabase/ssr` and `@supabase/supabase-js`. Email OTP. Flag `NEXT_PUBLIC_AUTH_ENABLED`. |
| Lint | Biome |
| Routing | Route group `(authed)` does not affect the URL. Pages stay thin. UI lives in `src/features/*`. |

A later visual pass should not change middleware, Supabase queries, auth contracts, or schemas. React Query keys in use today: `["shops", ownerId]`, `["drinks", shopId]`, `["brand-visit", slug]`, plus the brands cache warmed by `useBrands()`.

| Path | Note |
|---|---|
| `src/middleware.ts` | Delegates to the Supabase session helper. |
| `utils/supabase/middleware.ts` | Public-path list and login redirects. |
| `src/app/layout.tsx` | Geist, brand-visuals cookie, conditional React Query. |
| `src/app/globals.css` | Neutral tokens and unused `.dark`. |
| `src/app/(authed)/layout.tsx` | Sticky TopNav + `<main>`. |
| `src/app/(authed)/dashboard/layout.tsx` | Session redirect, then `DashboardShell`. |
| `src/app/(authed)/dashboard/page.tsx` | “Select a shop.” |
| `src/app/(authed)/dashboard/[shopId]/page.tsx` | `ShopDetails`. |
| `src/features/dashboard/components/DashboardShell.tsx` | 65/35 grid. |
| `src/shared/layout/TopNav.tsx` | Placeholder bar. |
| `src/shared/layout/PublicShell.tsx` | Cream page frame. |
| `src/shared/layout/PublicSidebar.tsx` | Public nav and locked member links. |
| `src/features/shops/components/ShopsView.tsx` | Shop tiles. |
| `src/features/shops/components/ShopDetails.tsx` | Drink list. |
| `src/features/shops/types.ts` | Shop fields, including ones the UI ignores. |
| `src/features/drinks/types.ts` | Drink fields. |
| `src/features/brands/BrandMark.tsx` | Mascot or lettering. |
| `src/features/brands/brandAccent.ts` | Web lettering gradients. |
| `src/features/brands/BrandVisitClient.tsx` | Signed-in slice on a public brand page. |
| `src/features/settings/SettingsView.tsx` | Visuals and account gate. |
| `src/features/auth/components/EmailOtpForm.tsx` | Login and signup UI. |
| `src/shared/ui/*.tsx` | Unused shadcn set. |
| `docs/mobile-ui-handoff.md` | Catalogue vs personal dex. |
| `bobadex-app/lib/ui/theme/boba_themes.dart` | Ten theme palettes. |
| `bobadex-app/lib/ui/theme/boba_tokens.dart` | Radius, space, stroke, shadow. |
| `bobadex-app/lib/ui/theme/boba_typography.dart` | Fraunces and Inter. |
| `bobadex-app/lib/ui/components/` | Cards, tiles, chips, nav, collector card. |
| `bobadex-app/lib/widgets/brand_mark.dart` | Mascot, lettering palettes, accent ring. |
