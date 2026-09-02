---
title: Itinrera
description: Conversational trip planner where users describe travel needs in
  natural language and get day-by-day itineraries from a local LLM, with an
  agent loop that decides when to pull in live weather and currency data.
tags:
  - FastAPI
  - Streamlit
  - Ollama
  - MySQL
  - SQLAlchemy
  - Docker
  - GitHub Actions
githubUrl: https://github.com/starkparsa/Travel-Planner
status: current
featured: true
date: 2026-08
---

A chat-driven itinerary generator: Streamlit handles the conversational UI, FastAPI + SQLAlchemy/Alembic manage backend state in MySQL, and Ollama runs the model locally (with swappable cloud-provider support).

- **Intent classification** routes each message to new trip / edit / question / off-topic before generation runs, cutting latency on turns that don't need a full itinerary and doubling as a prompt-injection guardrail.
- **Agentic tool calls**: the model decides on its own whether to pull live weather (OpenWeather) or currency conversion (Frankfurter) data into a plan, rather than hardcoding those calls.
- **Concurrent tool-calling + destination inference** removes a full extra model round-trip from generation time.
- **Chunked generation**: multi-day trips are generated in 5-day segments, since local models struggle to produce long, unbroken JSON in one pass.
- **Conversation memory** lets follow-ups like "make it vegetarian-friendly" reference earlier planning decisions in the same session.
- Shipped with CI, Docker, and automated image deploys via GitHub Actions.
