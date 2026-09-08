---
title: Building real onboarding personalization and locking down security
description: >-
  Building real onboarding personalization and locking down security

  A personalization feature built step by step with real verification at each stage, paired with a security and access-control audit that closed real gaps and made an honest call to leave one open.
date: 2026-09-08
order: 8
projects:
  - ai-travel-planner
experiences: []
tags:
  - Product Development
  - Security Review
  - Authentication
  - Accessibility
  - Full-Stack Development
  - Database Design
  - Build in Public
draft: false
---
This stretch of work paired a full personalization feature with a security review, and both benefited from the same habit: checking the real system before trusting a plan, a status report, or an assumption about how something already worked.

Onboarding personalization was designed first, through several rounds of research-informed mockups, then built in small, reviewable steps rather than as one large change. The data model came first, a new profile table mirroring the shape of an existing credentials table, verified by actually applying the migration against a simulated database rather than just reading it. Next came the profile endpoints, where a review caught duplicated encoding logic across two functions and collapsed it into one shared definition before moving on. The profile data was then wired into itinerary generation using the same pattern an existing feature already used for its own context, and a regression in an existing test was caught and fixed rather than loosened to make it pass.

The onboarding form itself surfaced a useful correction. A status report claimed a details form had already been built and confirmed working. Checking it directly against the actual component and the actual database columns showed that wasn't true, and the record got corrected before any further work was planned on top of it. Once that was settled, the new fields were built with their purpose decided first (reminders, age-appropriate suggestions) rather than collected speculatively. A full pass followed to close every remaining gap: real validation on both the client and the server, clear consent copy on sensitive fields, a first ambient notification system for the app, a working profile page for editing details after onboarding, and a frontend test framework stood up from nothing, with a dozen new tests covering the new logic.

A real bug came from a user's own screenshot rather than a code review: every dropdown in the onboarding form was rendering nearly invisible text in dark mode. The cause was subtle. A form field can inherit the page's dark-mode text color, but its native dropdown popup still renders against a light background by default, since that setting isn't inherited the way ordinary styles are. One shared fix closed it everywhere at once, confirmed by checking the actual compiled output rather than just the source, plus a regression test to keep it fixed.

The security pass that followed covered four separate questions, each investigated against the real source before any code changed. A frontend secrets audit came back clean: no public environment variables held anything sensitive, no hardcoded keys, and every third-party call routed through the app's own backend rather than being made directly from the browser. A full git history search across every branch confirmed no real credentials had ever been committed, though it did turn up one real gap: the ignore rule for environment files only matched one exact filename, leaving several real variants uncovered. That gap was closed immediately, before it could ever be used. A database-key question turned out not to apply at all, since the app has no client-side database access of any kind. And a request to enable row-level security got investigated seriously rather than built reflexively: the real architecture has a single database role for the whole backend with no per-request identity, so turning it on naively would either do nothing or break every request. The tradeoffs were laid out plainly, and the decision was left open rather than forced.

A smaller but satisfying fix rounded out the stretch: a signed-in user who landed on the login page directly, through a stale bookmark or a typed URL, saw the sign-in form and stayed there instead of being sent back into the app. The page had never actually checked whether a session already existed. Adding that check, mirroring a pattern already used elsewhere in the app, fixed it, and it was verified against a real, already-signed-in browser session rather than the sandboxed preview alone.

What ties all of this together is a preference for verifying the real thing over trusting the plausible one, whether that's a status report, a migration, a security assumption, or a dropdown that looks fine until you actually switch your system to dark mode.
