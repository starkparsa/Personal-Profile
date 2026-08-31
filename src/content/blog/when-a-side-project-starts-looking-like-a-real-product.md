---
title: When a side project starts looking like a real product
description: There's a moment in every side project where the work stops being
  "make the demo work" and starts being "make this survive contact with actual
  users, actual security review, actual production infrastructure." This session
  was that moment, end to end — a UI that finally looks intentional, a database
  that's no longer a local mess, real security findings found and fixed, and a
  documentation pass that reads like something you'd hand to a teammate rather
  than to future-you.
date: 2026-08-31
order: 4
projects:
  - ai-travel-planner
experiences: []
tags:
  - Software Architecture
  - PostgreSQL
  - Security Review
  - Code Review
  - Build in Public
  - Full-Stack Development
draft: false
---
## Starting with the map, not the territory
 
Before touching any of that, I ran a full knowledge-graph build of the repo and went looking at what it flagged as a "surprising connection" — a suggested link between the frontend's npm dependencies and the backend's auth code, bridged through a node just labeled `jose`. It looked interesting right up until it turned out to be nothing: a node-ID collision, not a real relationship. The npm package `jose` (used in a JWT-minting helper) and Python's `python-jose` (used in the auth module) had both produced the literal label `jose`, because the extractor failed to path-prefix the Python one the way it correctly did for the JS one. A JS manifest entry doesn't "import" a Python package — the edge was an artifact of two unrelated ecosystems sharing a short name.
 
Fixing it meant renaming the bare node to a properly prefixed ID, relabeling both nodes unambiguously, repointing the real edges, and dropping the fake one — then recomputing community detection and centrality from the patched graph rather than hand-editing the report, since removing a bridge edge like that genuinely shifts the numbers. I caught a second, self-inflicted bug in the process: after reclustering, I briefly reused the old community-label mapping against newly reassigned community IDs, which silently scrambled about half the labels. The fix was the same discipline both times — derive labels fresh rather than trust a stale mapping — and I re-applied it later when refreshing the graph again, this time checking it by hand rather than assuming it was fine. It's a small story, but it set the tone for the rest of the session: verify the output, don't just trust that the tool did the sensible thing.
 
## Making it look like a product
 
The frontend redesign replaced roughly 350 lines of hand-written CSS with Tailwind v4 and shadcn/ui components across all six components, and swapped a leftover Streamlit-red accent for a deliberate teal palette. Along the way, two real bugs surfaced that a purely visual pass would have missed: a loaded font that was never actually wired into the CSS, and a sidebar that broke the entire layout under 768px. Neither would show up in a desktop screenshot — only in actually resizing the window.
 
A "tour guide" conversation mode went through two rounds of hardening after first landing. Round one made the activation message deterministic — generated in Python rather than left to the model to phrase consistently — reverted an earlier "always answer in detail" design back to brief-by-default, and added a real UI accent-color change while the mode is active, all verified against live model calls rather than assumed from the prompt. Round two caught a subtler bug: saying "be my tour guide" with no destination named triggered a full itinerary recap instead of a short welcome message, because that exact phrase had accidentally been left in the list of "give more detail" triggers from the earlier design.
 
## Making it survive being deployed
 
The database work turned out to be less "migrate to Postgres" and more "first figure out what's actually true." Local dev had drifted: the `.env` file pointed at a native Windows MySQL service with the wrong credentials, while two separate real datasets existed in parallel — a Docker MySQL instance with the larger, older data, and a SQLite file that had been accidentally committed to git. After confirming Docker MySQL was the dataset to keep, it got migrated fully to a new Neon Postgres instance — schema created, every row copied and verified, configs updated — with the Docker instance left running untouched as a live backup rather than torn down.
 
That was followed by a proper documentation pass: a deployment-readiness checklist (which included a real correction — an initial recommendation of Fly.io as a free option turned out to be wrong once checked), a step-by-step Cloud Run + Vercel deployment guide, an architecture doc with system diagrams, and a manual security review that surfaced four real issues — a CORS wildcard, exception details leaking to clients, no rate limiting, and no cap on prompt length.
 
An automated review pass over the session's own changes turned up two more real, fixed bugs: a Q&A-first conversation could permanently disable Wikipedia place-context grounding for the rest of that conversation, because an empty cached value was being treated as "already gathered" rather than "not yet gathered" — fixed on both the read and write side, with regression tests added. And `docker-compose.yml` was silently never forwarding the Groq API key, which meant the documented Gemini-to-Groq fallback quietly did nothing under Docker despite looking correctly wired in code. The same pass also caught process gaps, not just code ones — several new files, including all four docs and a migration script, existed on disk but had never actually been staged in git.
 
## What "side project becoming a product" actually looks like
 
None of this was one big feature. It was a UI that stopped looking borrowed, a database that stopped being a local accident, a security review that found things worth fixing before anyone else could find them first, and a habit — repeated at least three separate times this session, from the graph relabeling to the Q&A grounding bug to the Docker env var — of catching a wrong assumption by checking the actual output rather than trusting that the code did what it looked like it should do. That habit is the real signal that a side project is turning into something durable: not that it has more features, but that its failure modes are starting to get found before users find them.
 
The one thing still sitting unresolved going into the next session: everything above is staged in git, verified, and tested — 225 passing, clean linting — but none of it is committed yet. Sometimes the last step in "making it real" is just deciding to hit commit.
