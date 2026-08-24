---
title: "Cart Abandonment Prediction"
description: "Binary classification system predicting which shoppers will abandon their cart during new product launches, built to production ML standards with strict target-leakage controls."
tags: ["scikit-learn", "LightGBM", "Optuna", "MLflow", "Pandas"]
githubUrl: "https://github.com/starkparsa/Abandon-Rate-based-on-Customer-Behavior"
status: "past"
featured: true
date: "2026-02"
---

Classification pipeline on 100K e-commerce records: 60+ raw signals engineered into 30 interpretable behavioral features across nine categories (engagement intensity, purchase intent, discount sensitivity, stress indicators, and more), with target-leakage variables explicitly identified and removed.

- Modular, production-style codebase (~800 lines) split across dedicated modules for data loading, feature engineering, categorical encoding, model training, and configuration.
- Hyperparameters tuned with Optuna; every run tracked in an MLflow model registry.
- The optimized MLP hit an **F1-score of 0.975** (precision ~0.97, recall ~0.98, accuracy ~0.97) against a 0.75–0.85 target.
- Deployment roadmap includes a FastAPI REST endpoint, a Gradio interface, and Docker packaging.
