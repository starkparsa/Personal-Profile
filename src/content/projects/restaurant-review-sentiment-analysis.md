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

- Led a team of 3, testing every pairing across encoders (Word2Vec, BERT, BART, T5) and decoders (Logistic Regression, SVM, MLP, CNN, Random Forest, Gradient Boosting).
- Extracted and processed data from the full Yelp dataset, restructuring data storage to cut retrieval time by 25%.
- Compared outcomes across every encoder–decoder combination on accuracy, precision, recall, and F1; findings written up in a full technical report alongside the code.
