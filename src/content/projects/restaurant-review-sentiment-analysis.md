---
title: "Sentiment Analysis: Optimal Encoder–Decoder Pairs"
description: "Comparing embedding models (BERT, BART, Word2Vec) paired with classical classifiers to find the best combination for restaurant-review sentiment analysis."
tags: ["BERT", "BART", "Word2Vec", "SVM", "spaCy"]
githubUrl: "https://github.com/starkparsa/Optimal-Encoder-Decoder-Pairs-for-Enhanced-Sentiment-Analysis-in-Restaurant-Reviews"
status: "past"
featured: false
date: "2023-12"
---

Applies sentiment analysis to the Yelp Academic Dataset to predict dining recommendations from review text.

- Compared three embedding approaches (BERT, BART, Word2Vec) feeding into three classifiers (SVM, Logistic Regression, CNN) — nine encoder–decoder combinations in total.
- Pipeline: extract reviews → balance classes across ratings → generate embeddings → train classifiers → evaluate on accuracy, precision, recall, and F1.
- Team project with two collaborators; findings written up in a full technical report alongside the code.
