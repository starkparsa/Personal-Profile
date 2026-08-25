---
title: "Building an AI Travel Planner: 5 Hard-Won Lessons from LLM Wrangling"
description: I spent the last few weeks deep in the weeds of an AI travel
  planner—a chat-driven itinerary generator backed by a local language model.
  It's the kind of project where every solved bug teaches you something new
  about LLMs, APIs, and the gap between documentation and reality. Here are five
  lessons I learned the hard way.
date: 2026-08-25
order: ""
projects:
  - ai-travel-planner
tags:
  - AI
  - LLM
  - Machine Learning
  - Software Engineering
  - API Integration
draft: false
---
## 1. Grounding Beats Guessing—Make "Don't Fabricate" Unconditional

I asked my assistant: "What's the weather like there?"

The response came back confident and detailed: a five-day forecast in Fahrenheit with specific conditions like "Partly cloudy" and "Light rain."

One problem: my weather tool only returns Celsius values. No condition descriptions. No Fahrenheit conversion. The model wasn't *wrong* about how to respond—it was inventing an entire answer because my instructions were conditional. I'd essentially told it, "Don't guess *if* you don't have the data," which the model interpreted as, "Go ahead and guess if it seems reasonable."

The fix was subtle but critical: make the instruction unconditional. "Don't fabricate data" became "If you don't have the data, fetch it first. If that fails, say so explicitly—never invent."

This taught me something deeper about prompt design: vague guardrails get rationalized away. LLMs are optimizers—they'll find the path of least resistance through ambiguous instructions. The only reliable safeguard is to remove the wiggle room entirely, and to make the "I don't know" path as direct as the "I do know" path.

## 2. Sometimes the Right Call Is to Cut Scope, Not Keep Patching

After fixing the grounding issue, the weather API kept being unreliable anyway. Timeouts. Occasional malformed responses. The kind of brittleness that eats hours in debugging.

I had a choice: keep debugging the weather integration, or cut it temporarily.

I cut it. Disabled the tool-calling step, left the code in place, shipped without it.

This sounds like defeat, but it was actually pragmatism. The travel planner doesn't *require* real-time weather to be useful—it can suggest activities, timing, and logistics without it. And keeping code around (even disabled) is cheap; thrashing on a single integrations problem until you've sunk three days into it is expensive.

The deeper lesson: scope is a lever, and sometimes pulling it is the faster path to shipping something real than doubling down on a single component. You don't get credit for perfect features that never reach users.

## 3. Live Testing Against the Real API Reveals What Reading Never Will

Partway through the project, I migrated from local Ollama (Mistral) to a hosted LLM API (Gemini) for native structured output and function calling.

I read the docs. I read the examples. I felt ready.

Live testing found three things that no amount of reading caught:

**The version number was already dead.** The model in my notes (`gemini-2.5-flash`) returned a clean 404 for new API keys. Google's error message eventually pointed me to the replacement—but the docs and examples hadn't been updated. I only knew because I actually tried it.

**Thinking tokens were silent budget-killers.** The replacement is a reasoning model that invisibly burns your entire output-token budget on hidden "thinking" blocks unless you explicitly dial it down. My first call came back completely empty with zero error message—just dead silence. I had to dig into the response metadata to realize what was happening.

**The API spec and reality were off by one field.** Every example showed sending tool results back with `role: "tool"`. The real API flatly rejected it. It wanted `role: "user"`. Same shape, different label, no warning in the docs.

The lesson is blunt: **test live, early, against the actual service.** Reference docs get you to 90%. The last 10%—the edge cases, the silent failures, the spec divergences—only show up when you're actually running real requests against the real API.

## 4. "It's Not Working" Is Sometimes Just a Stale Build

After the API migration, I got a 502 error. Then another. Then I realized the container was still running the old code entirely.

I'd rebuilt the image locally but never rebuilt it in the compose setup. `docker compose up` without `--build` doesn't check for new images. The old container kept running the old code while I stared at my new code wondering why it wasn't live.

It's a silly mistake, but it's a reminder: development environments have layers, and each layer can get out of sync. When something breaks unexpectedly after a deploy, the first diagnostic is always: *did the new code actually deploy?* Check your container hashes, check your logs, verify the binary is actually newer.

## 5. Rate Limits Aren't Just About Waiting—They're Structural

I burned through a daily free-tier API quota during heavy testing. Cue the midnight waiting game.

But here's what I learned: most APIs track limits per *model string*, not per project. When I hit the quota on `gemini-2.5-flash`, switching to a lighter model (`gemini-1.5-flash`) would've immediately unblocked me instead of forcing a midnight reset.

This is a small thing, but it matters for testing strategy. Rate limits are often more granular than they appear—read them carefully. And if you're burning through quota during development, fallback strategies aren't just nice to have; they're part of your testing architecture.

## The Through-Line

If there's one theme across all five lessons, it's this: **the gap between theory and practice is where real learning lives.**

Documentation is a map, not the territory. Examples get you started, not finished. Your assumptions about how systems work survive until you actually run them—which is exactly why shipping early and testing live isn't optional. It's the only way to find the invisible bugs, the contradictions, and the silent failures that only exist when electrons are actually flowing.

Shipped, broke, fixed, shipped again.

That's the pattern. And it's way faster than trying to read your way to perfection.

*Currently shipping: an AI travel planner with FastAPI + Streamlit + local LLM, containerized with Docker Compose and CI/CD via GitHub Actions. Code lives in the open. Lessons live in production. 🚀*
