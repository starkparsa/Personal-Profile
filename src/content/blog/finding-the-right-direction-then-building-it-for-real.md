---
title: Finding the right direction, then building it for real
description: "One long session: a UI direction rejected outright after being
  fully built, a palette chosen and wired through, and three real backend
  features (trips list, saved places, event discovery) landing almost for free
  because earlier plumbing had already built the road they needed. Threaded
  through all of it: bugs caught by looking at real data and real rendered
  output, not by trusting that the code or the docs were right."
date: 2026-09-03
order: 6
projects:
  - ai-travel-planner
experiences: []
tags:
  - UI/UX Design
  - Product Design
  - API Integration
  - Debugging
  - Build in Public
draft: false
---
## Building "City Passport," then throwing it away

The palette question got settled first. Direction C, "Dusk City" (an indigo primary with a copper tour-guide accent), was chosen from four candidates and recorded with exact color values for both light and dark mode. Recoloring the existing UX-directions canvas to preview it turned into a small lesson of its own: the whole canvas leaned on just three color tokens for its old teal brand color, so a global find-and-replace was enough to reskin it entirely. The canvas's tour-guide toggle chips, though, turned out to be plain text inside the canvas's own JS-encoded export, not safely hand-editable, so that one stayed on the to-do list rather than risking a broken patch.

Then came the direction that didn't survive contact with the person it was built for. "City Passport" reframed the whole app as a travel document: a boarding-pass photo strip, perforated tear lines, rotated ink-stamp result cards, a "Passport" tab of past trips as stamped pages. It was researched properly, with real dark-mode practice pulled in to avoid a cold, near-black feel, a genuine free-tier photo API confirmed and wired in, and real credited Wikimedia photos standing in for a live source the mockup sandbox couldn't reach directly. It was built out to a full website shell and two app screens. It was rejected outright the moment it was seen, not for the execution, but because the boarding-pass-and-stamp metaphor itself wasn't wanted.

The direction that replaced it, "Trip Hub v2," came from the opposite instinct: instead of inventing a new metaphor, it took the user's own PDF export of an earlier UX canvas and rebuilt it faithfully as clean, standard product UI, same palette and photo treatment, with every travel-document affectation stripped out. It went through two more rounds of real iteration: a hamburger toggle to collapse the trip sidebar (an early `width: 0` approach silently broke at the responsive breakpoint by leaving collapsed content still claiming a full row of height, fixed by switching to `display: none`), a second independent collapse control for the tools column, and finally both panels set to start collapsed by default rather than open, the strongest version of "don't show data before it's fetched," applied to the chrome itself.

## The plumbing pays off

Taking Trip Hub v2 from mockup to real app started with a finding that landed before a line of implementation code was written. Two exploratory passes found that a trips-list endpoint didn't exist at all (every trip lived embedded inside chat messages, never as its own listable record), and that two of the mockup's three cards, Flight and Saved Places, had no backend data behind them. Scope got cut explicitly to everything except those two, reported back rather than quietly built anyway.

What shipped: the Dusk City palette wired into the real stylesheet, the tour-guide assistant-bubble fix that had been sitting as a known gap since the palette research surfaced it, a hand-rolled collapsible sidebar (skipped a new UI library primitive in favor of plain conditional rendering, judged more reliable given this project's component base), a real `GET /trips` endpoint deriving draft/upcoming/completed status in plain Python rather than leaving that judgment to the model, and new list and detail pages that reused the existing chat renderer instead of building a second one.

Two real bugs surfaced only once a real user clicked through the real result. "Only 3 trips but I see 7" turned out to be correct behavior from the wrong query: every edit to a trip created a new row rather than updating one in place, so one Miami conversation refined four times showed as four trips. The first fix attempt introduced its own bug: a single grouped query that assumed trip IDs and conversation IDs came from independent, non-colliding sequences, which a written test for the edge case proved false. It was replaced with two separate, unioned queries that are structurally collision-proof rather than just unlikely to collide. The second bug, "I cleared the cache and still don't see the night skyline photo," wasn't a caching bug at all. The photo had already been fetched and permanently cached before a later query change took effect, exactly as designed (a destination's photo is fetched once, ever). It was diagnosed by reading the live database directly and comparing timestamps against when the code actually changed, not by guessing, and fixed by clearing the three affected cached rows.

A third bug never even reached the user. Applying new database migrations to the live dev database, an existing safety net had already silently created a table with a too-narrow column from before it was corrected in the code, caught only by inspecting the live schema after the migration instead of trusting its exit code.

The round after that added Saved Places and Pexels photos on request, confirmed up front that places auto-save with no manual save button, since a real save button would need structured place cards in the chat UI first and was out of scope for this pass. The implementation mirrored an existing client/service pattern rather than inventing a new one, and the tool-calling loop that already returned data to the chat got extended to also expose it to the new trips API, rather than duplicating the fetch.

The most interesting new feature was Ticketmaster event discovery, which started from an offhand mention rather than a spec, and got the same discipline already applied to earlier integrations: confirm the API is actually usable for free before treating it as real scope, and confirm a supplied API key against a real live call before planning around it. One open design question, how to tell "any jazz shows nearby?" apart from "build the trip around that" when both call the same tool, got resolved deliberately rather than left to the model's judgment: a structured commit marker the model only emits on genuine, explicit commitment. The sharpest bug of the whole session showed up here too. A live test for "jazz" events returned a Miami Heat versus Utah Jazz basketball game, because the search parameter used was literal name matching, not genre matching. Switching to a genre classification parameter fixed it, verified against a second city after the first test's zero results briefly looked like a broken fix and turned out to just be a real content gap, not a bug.

Three smaller layout fixes rounded things out. The chat column on the trip page was capped at a fixed width meant for the plain chat page, leaving an ugly dead gap next to the trip panel, fixed by making that cap conditional on whether a side panel is present at all. A collapsing day-card in the trip view wasn't animating, because the CSS classes referenced in the component pointed at animation keyframes that were never actually defined anywhere in the project, invisible without dev tools but functionally significant, since the underlying collapse library reads real CSS to decide how to animate and silently no-ops without it. And the chat page's header and composer needed pinning in place with only the message list scrolling, fixed with a three-region flex layout, where a single `min-height: 0` on the scrolling region turned out to be load-bearing rather than decorative, since a flex child's default minimum height silently blocks it from ever scrolling in a column layout without it.

## The pattern across the session

Nothing here shipped on faith. A rejected design direction got rejected fast because it was shown, not described. Every backend bug that reached the user got root-caused against real data (real timestamps, real row counts, real API responses) rather than assumed from reading the code. The one feature that looked like it would need real new backend work, Ticketmaster events, needed almost none, because earlier plumbing had already built the exact channel it needed. That's usually a sign a system's shape is starting to hold up under real use, not just look right on a diagram.
