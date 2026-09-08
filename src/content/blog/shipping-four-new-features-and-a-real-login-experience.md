---
title: Shipping four new features and a real login experience
description: >-
  Shipping four new features and a real login experience

  Four features shipped in a day, a full login redesign built mockup-first, and real password authentication added alongside an honest experiment with a second login provider that got built, tested, and then cleanly removed.
date: 2026-09-08
order: 9
projects:
  - ai-travel-planner
experiences: []
tags:
  - Authentication
  - OAuth
  - UI/UX Design
  - API Design
  - CI/CD
  - Software Engineering
  - Security
  - Build in Public
draft: false
---
This stretch covered a lot of ground: four follow-on features built and merged in a single day, a full login page redesign, and real email and password authentication added alongside an honest experiment with a second login provider.

The four features closed gaps flagged after an earlier personalization push. A new toggle-chip component replaced a handful of plain dropdowns and checkboxes in onboarding, verified by actually clicking through single-select and multi-select behavior rather than trusting the styling alone. A trip events card brought an existing conversational feature into the actual interface for the first time, built with the same caching pattern already used for weather rather than inventing a new one. A review of automated auth testing found that the real gap wasn't in the test suite at all, since authentication was already fully mocked there, but in the lack of a genuine browser click-through, which got documented as a manual runbook instead of chased with disproportionate new tooling. And a full gamification system, passport stamps and tiered badges, went from nothing to fully working, catching two real issues along the way: a trip-editing flow that would have inflated badge counts if left unchecked, and a set of new UI tiles that turned out to render identically regardless of dark mode, traced to a mismatch between how the app actually detects dark mode and how the styling framework expected it to. Alongside all four, a broken continuous integration pipeline on the main branch was found and fixed, a dependency version conflict and an import-ordering issue that predated any of the day's work and had been silently failing every check in under twenty seconds.

The login page redesign went through three rounds, each one checked against the real authentication code before any redesign work began, since the app only supports one sign-in method and no separate password system existed yet. The first round added a single clarifying line of copy. The second was a full visual redesign, mocked up first and approved before being wired into the real page, with every new interaction, a second login provider, a password option, a forgot-password link, honestly showing a "coming soon" message rather than faking success or an error that wasn't real. The third added a custom gradient and skyline illustration, deliberately fixed regardless of light or dark mode as a consistent brand moment. A request to swap that illustration for live photos was weighed honestly against the tradeoff of adding a new public backend endpoint and a third-party dependency to the one page that should never break, and the simpler option was kept. Two real bugs surfaced only through actual testing: content on short screens was completely unreachable because a global scroll rule meant for the main chat interface didn't know the login page was a different kind of page, and a form's submit button wasn't actually triggering form submission at all, traced to how the app's button component wraps its underlying primitive and fixed to match a convention already used elsewhere in the app.

The most substantial work added real email and password authentication alongside the existing single-provider login, plus an honest experiment with a second provider. Three clarifying questions were asked and answered before any code was written, since a detailed brief still left real architectural choices open. The password flow shipped with rate limiting, a single generic error message that never reveals whether an account exists, and a real password hashing library rather than anything homegrown. Two genuine bugs were caught in testing: the same submit-button issue found in the login redesign, and a subtle accessibility problem where a helper hint nested inside a form label was polluting how screen readers announced it. A second login provider was then built in full, verified with a real successful redirect to that provider's own authorization screen, only to be set aside once built, since the decision was made not to pursue it further. Removing it cleanly, rather than leaving dead code behind, was treated as seriously as building it had been.

A second, more skeptical pass followed, explicitly auditing the existing implementation against a full security checklist before writing anything new. Most of the checklist already held true. What didn't were closed: proper logging of authentication events with an explicit test proving passwords never appear in a log line, and a small list of common weak passwords blocked outright, since character-class rules alone don't stop someone from using a password that's still a first guess in any real attack.

The last catch of the stretch came while writing up the work itself rather than during any test run. A database migration tied to the discarded second login provider had been applied to the real development database while that work was still in progress. Closing the unmerged branch left the database pointing at a migration file that no longer existed anywhere in the project, a state that would have quietly broken every future migration command from that point on. It was found only by reconstructing the migration history by hand, fixed by rolling the database back to its real prior state, and verified with a fresh test run afterward. The lesson worth keeping: closing a branch that already touched a live database is two separate actions, not one, and skipping the second one leaves a trap for later.
