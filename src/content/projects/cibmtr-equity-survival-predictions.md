---
title: "CIBMTR — Equity in Post-HCT Survival Predictions"
description: "Predictive modeling for allogeneic hematopoietic cell transplant (HCT) survival outcomes, built to be accurate and fair across socioeconomic, racial, and geographic lines."
tags: ["Python", "Pandas", "Survival Analysis", "Jupyter"]
githubUrl: "https://github.com/starkparsa/CIBMTR---Equity-in-post-HCT-Survival-Predictions"
status: "past"
featured: true
date: "2025-01"
---

A healthcare-equity focused project on predicting event-free survival (EFS) after allogeneic HCT, using synthetic data that mirrors real-world clinical scenarios while protecting patient privacy.

- Goal: improve both the precision *and* fairness of survival predictions, reducing bias tied to socioeconomic status, race, and geography — not just optimizing for raw accuracy.
- Modeled two key variables: `efs` (event vs. censoring, binary) and `efs_time` (months to event-free survival).
- Exploratory analysis used distribution plots to surface relationships between survival time and categorical patient variables ahead of model development.
