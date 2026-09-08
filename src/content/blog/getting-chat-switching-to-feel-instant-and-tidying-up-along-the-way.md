---
title: Getting chat switching to feel instant, and tidying up along the way
description: >-
  Getting chat switching to feel instant, and tidying up along the way

  A debugging journey through several plausible-but-wrong fixes before finding the real cause of a chat reload bug, followed by a disciplined codebase cleanup and two structural refactors.
date: 2026-09-08
order: 7
projects:
  - ai-travel-planner
experiences: []
tags:
  - React
  - Next.js
  - Performance Optimization
  - Debugging
  - Code Review
  - Software Architecture
  - Frontend Development
  - Build in Public
draft: false
---
A user reported that switching chats in the sidebar looked like a full page reload every time, a skeleton flash, scroll position resetting. Finding the real cause took several honest wrong turns, each one plausible, each one actually tested rather than assumed.

The first attempt used sessionStorage to remember scroll position. It didn't work, and a check ruled out a bug in the restore logic itself, pointing instead at the browser's own storage settings. The second attempt swapped in an in-memory cache. Still reported as broken, until inspecting the actual render sequence showed the real issue: the chat component always started with empty state, filled in by an effect that only fires after the first paint, guaranteeing one blank frame on every switch no matter how fast the cache lookup ran. Fixing that meant seeding state lazily from the cache instead of waiting for an effect.

A screenshot of the browser's network tab pointed at React Strict Mode's double-invoked effects as the culprit, which looked like the answer but wasn't the whole one. Two exploration passes found the bigger issue: the plain chat page and the trip hub page shared no layout at all, so switching between them fully remounted the entire UI, sidebar included, and re-ran authentication and uncached backend fetches from scratch every time. The fix was a shared Next.js layout so the framework stops remounting anything that doesn't actually need to change, plus splitting the old all-in-one chat component into a persistent shell and a small per-page bridge.

Even after that fix, a rebuilt production server (needed because a plain dev server can mask real timing issues) still showed two loading round trips per switch. That turned out to be an entirely separate, pre-existing issue: the page's own trip data and its conversation data were being fetched in two separate steps instead of one. Fetching both together and handing the result straight to the page closed that gap for good. Along the way, a genuine CI failure caught a lint rule violation missed locally, fixed by switching to a hook designed for exactly this kind of external data read rather than the manual state-and-effect pattern it replaced.

With chat switching solid, the next stretch of work was a full maintainability pass across the codebase: three parallel reviews of the backend, frontend, and project configuration, with every finding checked against the real files before acting on it. The overall verdict was reassuring: the codebase was already unusually disciplined, so the list of real issues was short. What shipped: a dead proxy route left over from an earlier UI redesign, an accidentally-committed lockfile removed from tracking, stale comments updated to reflect the database migration completed the week before, three API keys that had never been forwarded into the Docker Compose files, and a couple of small duplicated helper functions consolidated into one place each. A companion change added a simple way for a friend to run the whole app from published container images with nothing but Docker and one free API key.

The final piece split two large files that had been flagged during the cleanup pass but deliberately left for their own round, since bundling a structural refactor with routine cleanup felt too risky. Both were planned properly this time: a review pass gathering exact dependencies for each file, followed by a plan that got double-checked against the real code before any line was written. One backend function that had grown to roughly 350 lines with three different reply paths tangled together was split into three clearly named helpers, verified branch by branch against the test suite before moving to the next. On the frontend, a 578-line component was split into three focused hooks, ordered from least to most coupled, with every behavior that mattered for correctness (a Strict Mode safety guard, module-level caches, scroll timing) carried over exactly rather than reimplemented from memory. The public interface other files relied on stayed unchanged, so nothing downstream needed to be touched.

The throughline across all of it: every fix landed only once it was actually observed working, not once it looked like it should. A production build, a real network trace, and a user testing against their own signed-in session did more to find the truth than any amount of reading the code in isolation would have.
