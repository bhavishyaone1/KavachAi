# Agentic Development Guidelines — Kavach AI

This document establishes the guidelines, constraints, and operational patterns for any agentic AI systems working on this codebase.

---

## 1. Core Codebase Principles

1. **Schema Compliance**: Under no circumstances should the root keys of the response dictionary returned by `RiskFusionLayer.fuse_results` be renamed or deleted. The frontend dashboard and downstream forensic log packages rely on all 29 fields matching exactly.
2. **DSP Alignment**: When editing the acoustic analyzer in `audio_detector.py`, ensure that Zero Crossing Rate, Spectral Centroids, Spectral Roll-offs, and autocorrelation Pitch Variances continue to be calculated using standard Fourier and signal correlation formulas.
3. **Data-Centric NLP**: Any additions to scam vocabulary or message parsing must be accompanied by new template mappings inside `scam_dataset.py` to prevent TF-IDF prior weight skewing. Set Logistic Regression parameters with balanced sample distributions.
4. **Environment Fallbacks**: All external tools (like `ffmpeg` subprocesses in `lipsync_detector.py`) must fail gracefully. If a binary is missing from the environment PATH, models should fall back to heuristic name checks instead of throwing unhandled exceptions.

---

## 2. Configured Customizations
- **Workspace Skill**: Refer to the local skill instructions at [SKILL.md](file:///c:/Users/bhavishya/Downloads/web-pages/BigB/.agents/skills/kavach_forensics/SKILL.md) for quick setup, retraining, and automated verification commands.
