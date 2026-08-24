---
title: "Loan Payback Prediction (Kaggle)"
description: "Gradient-boosted classifier forecasting loan repayment probability from historical lending data, built for a Kaggle competition."
tags: ["CatBoost", "scikit-learn", "Pandas", "Isolation Forest"]
githubUrl: "https://github.com/starkparsa/Predicting-Loan-Payback---Kaggle"
status: "past"
featured: false
date: "2025-11"
---

A CatBoost-based risk model scoring loan applicants' repayment probability for a Kaggle competition.

- Preprocessing: categorical encoding, Isolation Forest outlier detection (10% contamination), MinMaxScaler normalization post-outlier-removal, and a stratified 80/20 train/validation split.
- CatBoost configured with 3,500 iterations, learning rate 0.02, depth 8, Bernoulli bootstrap sampling, AUC as the eval metric, and early stopping after 200 non-improving rounds.
- Improved ROC-AUC from **0.793 → 0.923** through the preprocessing pipeline and tuning.
