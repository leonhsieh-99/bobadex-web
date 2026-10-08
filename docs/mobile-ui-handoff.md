# Mobile UI handoff for bobadex-web

Written against bobadex-web `dev` (`ab1487d`, even with `origin/dev`) and the current Flutter app. The Flutter redesign plan in `bobadex-app/docs/design/redesign-plan.md` is stale. This file describes the app as it works now.

Web and mobile are not the same product with two skins. The site is a public catalogue. Anyone can browse brands, dossiers, public photos, the badge case, and brand rankings. An account is only for a personal dex. The app is the opposite: every screen assumes you are signed in, and the home object is your collection.

Keep that split. Bring over the collector’s visual language and the brand-page patterns that are about the catalogue. Leave the signed-in social app on the phone.

## What web already has

Public, no login: `/`, `/brands`, `/brands/[slug]`, `/achievements`, `/rankings` (brand boards), `/about`, `/settings`.

Signed-in, and easy to miss while auth is gated: `/dashboard` (shop grid plus a side panel) and a locked “your drinks” block on a brand page.

The shell is a cream and ink sidebar, not a phone tab bar. Brand marks, lettering, and a mascot-versus-minimal setting already exist. Brand pages already show a dossier, community rating, market and tag chips, and a public photo strip.

## Bring over on public pages

These should look and read like the app, because a guest and a signed-in drinker are looking at the same brand.

**Brand mark.** Mascot when one exists, otherwise the letter tile. Silhouettes are not a public state. On mobile, gray means “you have not logged this brand.” On the web catalogue every brand is present. Use a silhouette only inside a signed-in dex, for a brand the viewer has not logged.

**Ratings.** Warm gold stars. If there are no ratings, say Unrated. Do not invent a score.

**Brand rankings.** Match the app’s names and default. The public board opens on **Most locations** (catalog storefronts). The other chips are **Community score** (Bayesian, prior weight 8, at least one rating), **Highest rated** (average, at least 3 ratings), and **Most collected** (distinct people who logged the brand). The web board already has the same three ideas under Rating, On dexes, and Stores. Rename them and make Most locations the default. A row is a brand mark, a name, and the metric. No demo filler.

**Brand page, public half.** Keep the dossier. That is a web strength the phone does not lead with. Under it, the public photo strip stays. Add the same ranking language as a small fact on the hero when the numbers exist: community score, rating count, and known locations. Empty copy stays honest.

**Catalogue search.** `/brands` stays the directory: search plus A–Z. Home stays a front door (constellation, featured brands, a rankings peek, a badge teaser). Do not replace either with the phone’s personal grid. Search should keep matching name, slug, and aliases. If place data is already on the index, also match a city the way the app’s brand search does.

**Badge case.** `/achievements` stays a public medal case. Guests see the badges. They do not see someone else’s unlocks or pins.

**Mascots versus lettering.** This is the one layout setting that belongs on public pages, because brand marks are the catalogue. Guests keep the current device cookie. See Layout settings below for how a signed-in account should win.

**Report a public photo.** The app can report a photo that is not yours (Spam, Abuse, or Other, optional note, signed in). If a web gallery shows someone else’s public photo, the same control belongs on that photo. Guests get a sign-in prompt. There is no review queue in this repo. That stays in admin.

## Bring over only after sign-in

These are the personal-collection patterns. They appear on the dashboard and on the signed-in slice of a brand page. They never appear for a guest.

**Your dex, not a shop admin table.** The dashboard should feel like the Dex tab: a grid of brands you have logged. Default two columns. A compact three-column option can exist, but two is the comfortable default. Each tile is a brand mark, with the banner-photo tile as an optional layout, same as the app. Counts say brands, drinks, and badges. Avoid calling that grid “shops.”

**Collector card.** On the signed-in profile, use one card: name, username, bio, avatar, the three counts, and up to three pinned badges. Editing the profile is a pencil on the avatar. Under the card, a short leaderboard preview: top three on **Most brands**, plus your own rank if you are outside the top three. Tapping it opens the user board. The app calls this surface You. On the web it can stay under Profile.

**Your drinks, as a ledger.** On a brand you have logged, the drink list is a ledger: rating, name, notes clipped to two lines, tap to expand. Search and sort appear only when there are more than five drinks. This replaces the current locked preview once auth is on. Guests keep a short lock that points at sign-in. Do not show other people’s drink logs. The app does not put those on the public brand page either.

**Add a brand you have visited.** Adding to your dex reuses catalogue search, then creates your entry. **Add a brand** (a brand the catalogue does not have yet) belongs only on that personal search. It does not belong on `/brands` or the home typeahead. A missing catalogue brand is a separate request and needs a real slug before it can be logged.

**User rankings.** Brands stay public. Drinkers do not. The web gate is already right: guests do not see the user board. Once signed in, the chips are **Most brands** (default), **Most drinks**, and **Most badges**. Public drinks only. Do not rank people by average rating.

**In your dex.** On a brand page, a signed-in viewer gets a quiet chip if they have logged that brand. Guests do not.

**Color theme, on the personal dex only.** The phone saves one of ten themes on the account (`theme_slug`). Seven are light: Classic Milk Tea (default), Matcha, Taro, Strawberry, Thai Tea, Mango, Oolong. Three are dark: Brown Sugar, Black Sesame, Midnight Taro. Do not add more. Do not paint the public catalogue, home, rankings, or a shared brand URL with that theme. Guests, and any signed-in viewer on those pages, stay on the site’s paper and ink, which is the same family as Classic Milk Tea. Inside the dashboard and the signed-in profile, use the account theme so the dex matches the phone.

**Dex layout, from the same account row.** Two more settings live on `user_settings` and only affect your grid:

- Compact layout is `grid_columns`. Off means two columns, which is the default. On means three. The phone’s county grid ignores this and stays at two. The web dex should follow the account. A public brand directory does not.
- Banner photos is `use_icons` set to false. Your tiles show the banner you chose instead of the brand mark. That is a personal-dex choice. Catalogue pages keep marks.

**Mascots versus lettering, account wins when signed in.** On the phone this is `use_mascots`, saved to the account. On the web it is already a device cookie and applies to every page, which is correct for guests. When someone is signed in, the account value should replace the cookie, and changing it on the web should write back to the account. Otherwise the phone and the site show different marks for the same person.

## Leave on mobile

**The tab bar.** Dex, Collect, Friends, You, and the raised plus are a phone shell. The sidebar is the right web shell. Do not add a fifth public item for Collect or Friends.

**Collect.** County collections are an opt-in personal tracker. Guests do not track counties, and the phone does not celebrate “region complete.” A public county browser would be a new catalogue feature, not a port of that tab. Do not build it as part of matching the app.

**Friends.** Feed, In common, People, friend requests, and push stay on the phone. The web preview already skipped the activity feed. Keep skipping it.

**A login wall.** The app sends every route through auth. The site must not.

**Splash and onboarding.** First-run setup stays on the phone. The theme catalog itself is not abandoned. It is limited to the signed-in dex, as above.

**Moderation console.** Reporting a person is on the app, on someone else’s profile. The web does not have public user profiles in the same way. Do not add a report inbox here.

## Copy to align

| Idea | Say this | Avoid |
|---|---|---|
| Catalogue geography | Most locations, known locations | Stores, shops, as if a storefront were a user’s entry |
| People who logged a brand | Most collected | On dexes, as the public chip name |
| Quality with few ratings | Community score | A raw average with one or two ratings |
| Quality with enough ratings | Highest rated | Rating, unlabeled |
| The viewer’s list | Your brands, your drinks | Shops, for the personal grid |

## Suggested order

1. Rename the public brand ranking chips and default them to Most locations. Update the home rankings peek to that same default.
2. On the brand page, show community score, rating count, and known locations next to the dossier. Leave the drink ledger locked for guests.
3. When auth is on, restyle the dashboard as a two-column dex and put the viewer’s drinks on the brand page as a ledger.
4. Add the collector card and the Most brands preview on the signed-in profile, and open the user board only then.
5. Add report on public photos for signed-in viewers.

Friends, Collect, push, and the phone tab bar are not in this sequence.
