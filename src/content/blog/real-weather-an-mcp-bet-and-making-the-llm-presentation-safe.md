---
title: Real weather, an MCP bet, and making the LLM presentation-safe
description: "One dev session, four threads that turned out to be connected:
  re-enabling a paused agent step, adopting a policy for future tool
  integrations, building real per-day weather from scratch, and hardening the
  app against a live demo. Along the way: two fabrication/coverage bugs shipped
  and caught, a model that silently burns its token budget on invisible
  reasoning (twice, on two different providers), and a reminder that free-tier
  quotas lie more than you'd think."
date: "2026-08-25"
tags: []
draft: false
projects:
  - ai-travel-planner
---
## What shipped

The agent tool-calling step came back online — currency conversion only, since weather was deliberately pulled out weeks ago rather than kept on life support. Live testing confirmed it: a real API call, a correctly grounded summary, and a clean skip when no budget was mentioned at all.

Weather itself got rebuilt the right way. Rather than let the model guess at forecasts, dates are extracted with plain Python (no LLM involved), and the actual forecast comes from Open-Meteo — deliberately *not* wired up as something the model can invoke, because it's never a judgment call the model needs to make. Temperatures are converted to Fahrenheit with real arithmetic, never left for the model to do in its head. The forecast is cached per trip for three hours and now shows up per day in the UI.

On the architecture side, MCP became the default answer for any future tool integration, now that Google ships official managed MCP servers for Calendar and Maps and the Gemini SDK has experimental native support. That reversed an earlier decision to hand-roll a Maps integration on OpenStreetMap — a real tradeoff, since it re-accepts a Google Cloud billing requirement, but one judged worth it for landing on the path Google is clearly investing in.

Reliability got the most attention. The default model moved to a lighter Gemini variant sitting on its own, unexhausted free-tier quota, and a fallback to Groq now kicks in automatically — but only on Gemini's specific quota error, and only inside the core LLM path, not the currency tool-calling step (which already degrades gracefully on failure).

## Bugs that shipped, then got caught

The most interesting bug wasn't a crash — it was a confident, wrong answer. Asked for outfit suggestions against a real 104–108°F Austin forecast, the app replied with "high 70s to low 80s." The forecast had been fetched correctly; it just never reached the question-answering prompt. Only the currency data had been wired into that path, so weather sat right there, unused, while the model filled the gap with a plausible guess. The fix was mechanical — thread the real forecast into the same grounding context — but the lesson wasn't: a fabrication bug can hide behind an otherwise-working honesty guardrail. The rule "don't guess when you have real data" only holds if the real data actually arrives at the prompt for every consumer that needs it, not just the first one it was built for.

A second bug was quieter: asking for weather "3 days from now" silently returned nothing, because the date parser only recognized "in N days," not that more natural phrasing. This wasn't a fabrication — the model correctly said it had no data — but a real coverage gap in how dates get recognized.

Two more surfaced while evaluating alternatives. Gemma 4, tested as a possible replacement, returned valid JSON with a trailing markdown fence character tacked on, which was enough to make the SDK's structured-output parser silently return nothing at all — a reminder that "supports structured output" doesn't guarantee `response.parsed` will actually populate once the schema gets realistic. And a model that had been sitting in `CLAUDE.md` for weeks, `llama-3.3-70b-versatile`, turned out to no longer exist on Groq at all — a 404 that only became visible once a real key was in hand to test with.

## The recurring failure mode: invisible reasoning tokens

Twice this session, on two unrelated providers, a small prompt with a tight token budget came back completely empty. Both times the cause was the same: a reasoning model spending its entire output budget on invisible "thinking" tokens before producing anything visible. The fix is provider-specific — `thinking_level=MINIMAL` for Gemini, `reasoning_effort="low"` for Groq's GPT-OSS — but the signature is identical enough to recognize on sight now: an empty or truncated response with no error at all, or a batch request that silently returns fewer items than asked for.

## What this session actually taught

Free-tier quotas are metered per model, not per account, and the daily caps vary by an order of magnitude between models from the same provider — the only reliable way to know a real number is to watch the account's own behavior, since blog posts on the subject contradict each other by 10–50x. Model and endpoint churn isn't a Gemini-specific annoyance either; it hit every provider touched this session, which argues for always verifying a model string is live before hardcoding it anywhere. And structured output claims deserve the same skepticism — test against the actual nested schema the app uses, not a toy example, because a small schema working is no guarantee a realistic one will.

A few smaller, sharper lessons rounded out the session: `Base.metadata.create_all()` only creates missing tables and never alters existing ones, so new columns on a local dev database need a full volume wipe until real migrations exist; `python-dotenv`'s default loader searches from the calling file's location rather than the working directory, which silently breaks env loading for any script living outside the repo; and Docker Desktop dropping between idle periods in this sandbox is an environment quirk to expect, not a sign the compose setup is broken.

## Still open

Google's pricing, free-tier limits, and auth mechanism for the Maps MCP server are still undisclosed and need confirming before any code gets written against it. Whether weather itself should ever move to an MCP server remains an open question, but a moot one for now — since weather was never something the model invokes as a tool, MCP's reason for existing doesn't currently apply. Destination geocoding still has no fuzzy-match fallback for typos, though Gemini's own extraction step already normalizes most of them before it matters. And Alembic migrations are still not set up, which is fine for solo development but won't survive a shared database once schema changes need to happen without wiping data.
