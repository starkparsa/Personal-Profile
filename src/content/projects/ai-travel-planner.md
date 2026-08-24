---
title: "AI Travel Planner"
description: "Chat-driven itinerary generator built on an agent loop where the model decides whether to call weather and currency tools, folding results into generation rather than hardcoding the calls."
tags: ["FastAPI", "Agent Loop", "Ollama", "MySQL", "Docker", "GitHub Actions"]
githubUrl: "https://github.com/starkparsa"
status: "current"
featured: true
date: "2026-01"
---

Chat-driven itinerary generator built on an agent loop where the model decides whether to call weather and currency tools, folding results into generation rather than hardcoding the calls.

- Added an intent-classification step ahead of generation, routing each message to new trip, edit, question, or off topic. It removed nonsensical outputs, cut latency on turns needing no generation, and doubles as the prompt-injection guardrail.
- Chunked long itineraries into bounded LLM calls with capped conversation context, keeping local-model output reliable at any trip length; shipped with CI, Docker, and mocked-LLM tests.
