---
title: Rebuilding the docs, tightening the gitignore, and three designs waiting
  on a decision
description: Some sessions ship a feature. This one shipped the scaffolding a
  feature-shipping project actually needs to stay legible to itself — a
  documentation rebuild, three real gitignore bugs closed out, and three design
  artifacts that are now sitting in front of a decision rather than in front of
  a blank page.
date: 2026-09-02
order: 5
projects:
  - ai-travel-planner
experiences: []
tags:
  - Technical Documentation
  - Software Architecture
  - UX Design
  - Git
  - Build in Public
draft: false
---
## Replacing a sprawling decision log with four files

The old documentation setup had grown the way these things do: a `CLAUDE.md` decision table that kept accumulating rows, and a `docs/sessions/` diary that had reached 21 files. Both were replaced with a tighter four-file structure — README, STATUS, decisions, and progress — with `CLAUDE.md` kept, deliberately, as a slim pointer rather than deleted outright, since it's the file Claude Code auto-loads as project instructions and needs to keep existing in some form.

Getting it merged took an extra step nobody planned for. It shipped as PR #11 (a small design-references doc) and then PR #13 (the actual four-file rebuild) — but the first attempt, PR #12, was accidentally auto-closed by GitHub when its base branch got deleted on #11's merge, and couldn't be reopened. No content was lost; it just meant re-creating the PR directly against `main` instead of trying to resurrect the closed one.

## Three gitignore bugs, two of them mirror images of each other

A gitignore audit turned up three real gaps, all fixed in one PR. The most interesting was a pattern bug: `graphify-out/*` had a slash in the middle, and git anchors any pattern with an internal slash to the directory the `.gitignore` file lives in. That meant it only matched a top-level `graphify-out/` and silently missed a nested `frontend/graphify-out/` that had been sitting untracked on disk the whole time. It's the same bug shape as an earlier, already-documented `lib/` shadowing incident — just inverted: that one was too broad and swallowed things it shouldn't have, this one was too narrow and missed things it should have caught. Alongside it: no root-level coverage for OS junk files (`.DS_Store` was only ignored inside `frontend/`, and `Thumbs.db`/`desktop.ini` weren't covered anywhere), and no rule yet for Claude Code's own per-user `.claude/settings.local.json`. A stale `Learnings.txt` — already deleted from disk outside this session — got its removal committed too, on explicit confirmation it should stay gone.

## Three designs, still waiting on a decision

The rest of the session went into design work that's deliberately not implementation yet. An architecture diagram corrected a hand-drawn sketch that had quietly collapsed the classifier's four branches, and the LLM/direct-call distinction, into fewer boxes than the system actually has — useful mostly as a reminder that a sketch drawn from memory drifts from the real thing faster than expected.

A UX directions canvas explored a "Trip Hub" concept for both web and app: the itinerary becomes a persistent structured record instead of living only inside chat scroll, with a mocked-up flight-tracking screen for a feature that got scoped in the same pass.

The palette research page compared four travel-evocative directions — the current teal/amber refined into "Ocean & Golden Hour," alongside Terracotta & Sage, Dusk City, and Trail & Canyon — each rendered as a live chat-bubble mockup in both light and dark themes. Building it surfaced a real, previously undocumented gap: the assistant's chat bubble is always plain `bg-card`, no matter what mode is active — tour-guide mode today only ever recolors the *user's* bubble, never its own. Every mockup on the palette page fixes this with a soft, accent-tinted assistant bubble, but the fix hasn't been applied to the actual component yet — it exists only as a mockup, waiting alongside the palette decision itself.

## Where it stands

Nothing shipped today needed a feature decision — it needed a documentation structure that won't rot, a gitignore that actually matches what's on disk, and a set of design directions concrete enough to choose between rather than argue about in the abstract. Maps/routing and flight price-tracking haven't started. No palette direction has been picked yet either. Both are explicitly next.
