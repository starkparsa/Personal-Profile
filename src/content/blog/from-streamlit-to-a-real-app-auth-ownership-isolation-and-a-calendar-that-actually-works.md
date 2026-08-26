---
title: "From Streamlit to a real app: auth, ownership isolation, and a calendar
  that actually works"
description: Today was less about one feature and more about the app crossing a
  threshold, from a single-user prototype into something with real accounts,
  real isolation between users, and a calendar integration that survives contact
  with Google's actual consent screen. It started, fittingly, with one more
  round of a bug that's shown up before.
date: 2026-08-26
order: 3
projects:
  - ai-travel-planner
experiences: []
tags:
  - Next.js
  - Auth.js
  - Google Calendar API
  - Multi-tenant Isolation
  - Alembic
  - Full-Stack Development
  - Build in Public
draft: false
---
## Round three of the date bug

Two earlier fixes had already taught the date resolver to handle "in N days" and "N days from now." Today's version was subtler: a question that carried its own date phrase — "what should I pack this weekend" — still came back with "I don't have weather data," because the question-answering branch never called the date resolver on the question's own text at all. It only ever looked at the trip's stored dates. The fix resolves the date directly from the question and persists it onto the trip, which means it's not a one-off patch — any later turn in the same conversation now benefits from that resolved date too, for weather or export alike. Three strikes on the same class of bug is a pattern worth noticing: date handling in natural language is a much longer tail than it looks, and every fix so far has come from a phrasing nobody thought to test until it failed live.

Currency conversion got paused again through the kill switch that's been sitting in the codebase since it was first built — not because anything broke, but because it's a product call that it isn't needed right now. The verification that it worked correctly still stands from before; it's just switched off, cheap to bring back.

## Shipping .ics export

Calendar export shipped as a clean, self-contained piece: a `calendar_export.py` module, a new endpoint, and two UI buttons — all gated on the trip actually having a resolved start date, so it can't silently generate a calendar file with no real dates in it.

## The bigger move: Next.js, real auth, real isolation

The rest of the day was a four-phase migration off Streamlit and into a real multi-user app.

Phase A was pure UI parity — rebuilding the interface in Next.js against the same unmodified backend, no auth yet, just proving the new frontend could do everything the old one did.

Phase B added actual identity: Google login via Auth.js, a JWT bridge into the backend, and a new `User.google_sub` column — which also marked the first time Alembic entered the project, after a full session log of "just wipe the local DB" being the migration strategy. Real accounts meant real migrations were no longer optional.

Phase C was the one that mattered most for correctness: five endpoints that had been open to any request now got retrofitted with ownership checks, and a new test suite proves cross-user isolation directly — by swapping the auth dependency mid-test rather than trusting the code by inspection. That's the difference between "we added a user column" and "we verified strangers can't see each other's trips."

Phase D pushed itineraries to Google Calendar. A go/no-go check on using Google's Calendar MCP server came back "no" for now, so it's built directly on `googleapiclient` instead — a decision that also surfaced and fixed an Alembic import bug along the way, the kind of thing that only shows up once real migrations are actually running.

## Where it stands

Real credentials went in, and the first live login reached Google's actual consent screen — not a mock, not a sandbox, the real flow. The export feature and the calendar push were merged into one button, with Calendar scope folded into the base login instead of a separate ask. A timezone bug was found and fixed live in the process. That bug is the one open item going into tomorrow — the fix is in, but it's waiting on confirmation that a real calendar event actually lands on the right day and hour before calling this phase done.

The throughline across all four phases: every one of them was validated against something real — a real login screen, a real cross-user test, a real calendar push — rather than assumed correct because the code looked right. That habit is what's carried this project through three rounds of the same class of bug and a full architecture migration without losing track of what's actually verified versus what's merely written.
