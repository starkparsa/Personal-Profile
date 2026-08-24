---
title: "Diabetes Progression Function Predictor (DPFP)"
description: "A regression model estimating genetic diabetes risk from clinical data, deployed behind a Flask web app."
tags: ["XGBoost", "scikit-learn", "Flask", "HTML/CSS"]
githubUrl: "https://github.com/starkparsa/Diabetes-Progression-Function-Predicter-DPFP-"
status: "past"
featured: false
date: "2024-09"
---

Predicts the Diabetes Pedigree Function score — a measure of genetic diabetes risk based on family history — from the Pima Indians Diabetes Database (768 records, 8 features).

- Preprocessing replaced invalid zero-values with NaNs, then applied median imputation.
- Compared Random Forest and XGBoost regressors; **XGBoost won** (MAE ≈ 0.242 vs. 0.254 for Random Forest).
- Shipped the trained model behind a Flask API with a simple HTML/CSS front end for entering health metrics and getting predictions.
