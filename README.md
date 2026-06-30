![1000008548](https://github.com/user-attachments/assets/7df2469d-f489-488e-91e5-16d45b31b0ec)

# Textile Pilling Simulator (PILLING-SIM)

<!-- STATUS · VERSION · AUDIT -->
[![Status](https://img.shields.io/badge/STATUS-Open_Source-4ade80?style=flat-square)](https://github.com/AionSystem/TEXTILE-PILLING)
[![Version](https://img.shields.io/badge/version-v1.1-orange)](#)
[![FORGE Audited](https://img.shields.io/badge/FORGE_v1.0-Audited_·_EV_0.73-D4AF37?style=flat-square)](#forge-v10-audit)
[![DOI](https://zenodo.org/badge/1200586477.svg)](https://doi.org/10.5281/zenodo.19409957)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![ORCID — Sheldon K. Salmon](https://img.shields.io/badge/ORCID-0009--0005--8057--5115-a6ce39?style=flat&logo=orcid&logoColor=white)](https://orcid.org/0009-0005-8057-5115)

> **Quantifying the Relative Influence of Parameters on Pilling Results in Woven Fabrics.**
> A data-driven, explainable simulator for textile pilling prediction across all four processing stages.

**Live Simulator:** [aionsystem.github.io/TEXTILE-PILLING](https://aionsystem.github.io/TEXTILE-PILLING/)

---

## Table of Contents

1. [Overview](#overview)
2. [Project History](#project-history)
3. [The Problem](#the-problem)
4. [FORGE v1.0 Audit](#forge-v10-audit)
5. [Parameter Framework](#parameter-framework)
   - [Phase 1 — Fibre](#phase-1--fibre-parameters)
   - [Phase 2 — Yarn](#phase-2--yarn-parameters)
   - [Phase 3 — Construction](#phase-3--fabric-construction)
   - [Phase 4 — Finishing](#phase-4--finishing-treatments)
6. [Scoring Engine](#scoring-engine)
   - [Pilling Susceptibility Score](#pilling-susceptibility-score-pss)
   - [Relative Influence Calculation](#relative-influence-calculation)
   - [Pilling Class Prediction](#pilling-class-prediction-15)
   - [Confidence Score](#confidence-score)
7. [Simulator Interface](#simulator-interface)
8. [Installation](#installation)
9. [Usage](#usage)
10. [Validation](#validation)
11. [Calibration Status — Honest Ceiling](#calibration-status--honest-ceiling)
12. [Repository Structure](#repository-structure)
13. [Methodology Documentation](#methodology-documentation)
14. [License](#license)
15. [Acknowledgments](#acknowledgments)
16. [Contact](#contact)

---

## Overview

This simulator predicts pilling behavior in woven fabrics based on parameters across all four stages of textile processing — fibre, yarn, construction, and finishing. It is an integrated tool relating fibre composition, yarn construction, fabric structure, and finishing treatments into a single, explainable, confidence-scored prediction.

| Stage | Parameters Covered |
|---|---|
| **Fibre** | Type, blend ratio, fibre length, denier, crimp |
| **Yarn** | Twist, hairiness, spinning method, count |
| **Construction** | Weave type, warp/weft density, fabric mass |
| **Finishing** | Singeing, mercerization, anti-pilling treatment, resin |

**What this solution delivers:**

- Relative influence scoring — which parameters matter most and by how much
- Scenario simulation — test any parameter change at any processing stage
- Pilling class prediction (1–5) targeting ≥3 per ISO 12945-2:2000
- Explainability — plain-language reasons for every prediction change
- Trade-off analysis — durability vs. hand-feel vs. cost impact

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Project History

This project did not originate as a single submission — it has gone through several stages, and this README reflects the current state, not the earliest one.

| Stage | Context |
|---|---|
| **v0.1.0** | Originally built for the InoCrowd Pilling Challenge |
| **FORGE v1.0 Audit** | Adversarial five-lens review applied — EV 0.73, certified | 
| **v1.1** | Current version — audited, methodology fully documented, parameter framework finalized |
| **NICE Challenge 2026** | Submitted as one of three proposals to NICE's Yangtze Delta Innovation Grant. Selected as the strongest of the three for industrial readiness — falsifiable against an objective third-party standard (ISO 12945-2:2000) rather than a self-defined scoring framework |
| **Current** | Released open source. Not pursuing the NICE roadshow/relocation track; the tool and methodology remain freely available for any manufacturer, researcher, or NICE industrial partner who wants to use or build on it |

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## The Problem

**Problem:** Textile manufacturers need to reduce pilling without compromising comfort or appearance. No single integrated tool relates parameters across spinning, weaving, dyeing, and finishing into one actionable, explainable prediction.

**Target:** Achieve pilling class ≥3 under ISO 12945-2:2000 (Martindale method).

**Material scope:** Woven fabrics from polyester, viscose, wool, and elastane blends (polyester dominant); spun yarns from staple fibres.

**What this solution explicitly avoids:**

| Exclusion | Rationale |
|---|---|
| Addressing only one processing phase | Pilling is a multi-stage phenomenon — single-phase tools miss systemic interactions |
| Targeting only one fabric type | Industrial reality demands adaptability across blend compositions |
| Lacking explainability | Manufacturers need to know *why* a change improves class, not just that it does |

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## FORGE v1.0 Audit

This project was run through FORGE v1.0 — a five-lens adversarial review combining structured certainty scoring, a red-team pass, and a multi-role evaluation council — before being finalized as v1.1.

| Metric | Result |
|---|---|
| FORGE EV (Expected Validity) | 0.73 |
| Status | Certified |

The scoring engine and all parameter weightings in this repository are presented with their honest epistemic status declared — see [Calibration Status](#calibration-status--honest-ceiling) below. FORGE certification reflects rigor of the audit process applied to the specification and reasoning; it does not assert that the model's literature-derived weights have been validated against real production data. That distinction is treated as load-bearing, not a footnote.

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Parameter Framework

### Phase 1 — Fibre Parameters

| Parameter | Impact on Pilling | Optimal Direction |
|---|---|---|
| Fibre length | Short fibres pill more | Longer → better |
| Fibre denier | Fine denier pills more | Coarser → better |
| Fibre tenacity | High tenacity = pills persist | Moderate → better |
| Fibre crimp | High crimp = less pilling | Higher → better |
| Polyester % | Anchor fibre — holds pills on surface | Higher = more retention |
| Viscose % | Weak when wet — increases pill formation | Lower → better |

### Phase 2 — Yarn Parameters

| Parameter | Impact on Pilling | Optimal Target |
|---|---|---|
| Yarn twist | Higher twist = less pilling | 700–900 tpm |
| Yarn hairiness | Lower hairiness = better | H < 4.0 |
| Spinning method | Ring-spun produces more hairiness than open-end | Open-end preferred |
| Yarn count | Finer count = more pilling | Coarser → better |

### Phase 3 — Fabric Construction

| Parameter | Impact on Pilling | Optimal Target |
|---|---|---|
| Weave type | Plain < Twill < Satin (tightness) | Plain = tightest → best |
| Warp density | Higher density = less pilling | ≥ 45 picks/cm |
| Weft density | Higher density = less pilling | ≥ 40 picks/cm |
| Fabric mass | Heavier = better pill resistance | ≥ 150 gsm |

### Phase 4 — Finishing Treatments

| Treatment | Effect on Pilling |
|---|---|
| Singeing | ✅ Reduces pilling — burns off surface fibres |
| Mercerization | ✅ Reduces pilling — increases fibre coherence |
| Anti-pilling chemical | ✅ Reduces pilling |
| Resin finishing | ✅ Most effective — binds surface fibres |
| Shearing | ✅ Reduces pilling |
| Softening agent | ⚠️ Increases pilling — lubricates fibre migration |
| Heat-setting | ➖ No significant effect on pilling class |

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Scoring Engine

### Pilling Susceptibility Score (PSS)

```
PSS_base = 0.50  (neutral starting point)

PSS_final = 0.1 + (fibre_score × yarn_score × construction_score × finishing_modifier) × 0.4
```

### Relative Influence Calculation

Each parameter group contributes a weighted percentage to the final prediction. Weights are derived from parameter count and published correlation strength, and are adjustable within validated ranges:

| Group | Default Weight | Adjustable Range |
|---|---|---|
| Fibre composition | 35% | 25–45% |
| Yarn construction | 25% | 20–30% |
| Woven construction | 25% | 20–30% |
| Finishing treatments | 15% | 10–20% |

### Pilling Class Prediction (1–5)

```
Pilling_Class = 1 + (1 − PSS_final) × 4

Classification:
  Class 5 — PSS_final ≤ 0.20    No pilling
  Class 4 — PSS_final 0.21–0.40  Slight pilling
  Class 3 — PSS_final 0.41–0.60  Moderate pilling  ← TARGET (ISO 12945-2:2000)
  Class 2 — PSS_final 0.61–0.80  Severe pilling
  Class 1 — PSS_final ≥ 0.81    Very severe pilling
```

**Pass/Fail:** Class ≥ 3 = PASS per ISO 12945-2:2000.

### Confidence Score

```
Confidence = 1 − Uncertainty_Mass (UM)

Uncertainty penalties applied when inputs deviate from validated ranges:
  Fibre blend outside typical industrial ratios (polyester < 40% or > 90%)   +0.10 UM
  Twist outside 700–900 tpm                                                  +0.10 UM
  Density outside 35–55 picks/cm                                             +0.05 UM
  Untested finishing treatment combination (>3 treatments)                   +0.05 UM
  Blend includes >10% elastane                                               +0.05 UM
```

Confidence is capped at 0.95 — no claim of 100% certainty in textile prediction. A confidence score below 70% triggers a flagged output: the prediction is reported as uncertain and the deviation is named explicitly.

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Simulator Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  PILLING-SIM v1.1 — TEXTILE PILLING SIMULATOR                   │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 1: FIBRE                                                 │
│  Polyester %:    ████████████░░░░░░  60%                        │
│  Viscose %:      ██████░░░░░░░░░░░░  30%                        │
│  Wool %:         ██░░░░░░░░░░░░░░░░  10%                        │
│  Elastane %:     ░░░░░░░░░░░░░░░░░░   0%                        │
│  Fibre length:   ████████░░░░░░░░░░  Medium (>30mm)             │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 2: YARN                                                  │
│  Twist (tpm):    ████████░░░░░░░░░░  750                        │
│  Hairiness (H):  ██████░░░░░░░░░░░░  3.2                        │
│  Spinning:       ○ Ring-spun    ● Open-end                      │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 3: CONSTRUCTION                                          │
│  Weave type:     ● Plain   ○ Twill   ○ Satin                    │
│  Warp density:   ██████████░░░░░░░░  48 picks/cm                │
│  Weft density:   ████████░░░░░░░░░░  42 picks/cm                │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 4: FINISHING                                             │
│  Singeing:       ● Yes   ○ No                                   │
│  Mercerization:  ● Yes   ○ No                                   │
│  Anti-pilling:   ● Yes   ○ No                                   │
│  Resin finish:   ○ Yes   ● No                                   │
├─────────────────────────────────────────────────────────────────┤
│  RESULTS                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PREDICTED PILLING CLASS:  3.4  ✅  (≥3 = PASS)         │   │
│  │  CONFIDENCE:               82%  (UM: 0.18)              │   │
│  │                                                          │   │
│  │  RELATIVE INFLUENCE:                                    │   │
│  │    Fibre composition:      32%                          │   │
│  │    Yarn construction:      28%                          │   │
│  │    Woven construction:     25%                          │   │
│  │    Finishing treatments:   15%                           │   │
│  │                                                          │   │
│  │  EXPLANATION:                                            │   │
│  │  → Polyester 60% anchors pills — moderate retention      │   │
│  │  → Twist 750 tpm is optimal for this blend               │   │
│  │  → Plain weave + anti-pilling pushes class to 3.4        │   │
│  │  → Adding resin finish would reach class 4.0             │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  TRADE-OFFS                                                     │
│  Durability:    ████████████░░░░░░  Good                        │
│  Hand-feel:     ██████████░░░░░░░░  Acceptable                  │
│  Cost estimate: +8% vs. baseline                                │
└─────────────────────────────────────────────────────────────────┘
```

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/AionSystem/TEXTILE-PILLING.git
cd TEXTILE-PILLING
```

No dependencies — pure HTML, CSS, and JavaScript. Open `index.html` in any modern browser.

**GitHub Pages deployment:**

1. Push to `main` branch
2. Enable GitHub Pages in repository Settings → Pages
3. Live at: `https://aionsystem.github.io/TEXTILE-PILLING/`

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Usage

| Action | Method |
|---|---|
| Adjust fibre blend | Move sliders — total must equal 100% |
| Modify yarn twist | Drag twist slider (optimal: 700–900 tpm) |
| Change weave type | Click radio button |
| Toggle finishing treatments | Activate/deactivate switches |
| Read real-time prediction | Updates instantly on any input change |
| Export results | Click **Generate Report** button |

**Interpreting the output:**

- **Class ≥ 3** — Acceptable for market under ISO 12945-2:2000
- **Confidence > 70%** — Prediction is reliable; inputs are within validated ranges
- **Influence %** — The parameter group where improvement has the highest leverage
- **Uncertainty Mass > 0.30** — At least one input is outside validated industrial ranges; result is flagged

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Validation

The scoring engine is calibrated against published textile engineering research. No proprietary data was used.

| Source | Finding | Implementation |
|---|---|---|
| ISO 12945-2:2000 | Martindale method — pilling classification standard | Classification scale 1–5; target ≥3 enforced |
| AATCC Test Method 61-2013 | Accelerated pilling assessment standards | Weighting calibration for finishing treatments |
| Wang Lu et al. (1994) | Pilling mechanism — 4-stage formation, critical abrasion cycle ranges | Core mechanism model |
| Yang, Zhang & Shen (2017) | Fibre length, denier, crimp, and scale correlations | Phase 1 parameter weightings |
| Ghosh, Das & Saha (1987) | Hairiness vs. linear density and twist multiplier | Phase 2 yarn parameter weightings |
| *Pilling of Fabrics* (1956) | Weave tightness, density, and twist effects | Phase 2–3 parameter weightings |

**Edge cases tested:**

| Scenario | Expected Result | Simulator Output |
|---|---|---|
| 100% polyester, no finishing | Pill retention high — moderate class | Class 2.8–3.1 |
| 100% viscose, no finishing | Weak when wet — lower class | Class 1.9–2.3 |
| Low twist + high hairiness | Class failure | Class < 3.0 flagged |
| All anti-pilling treatments active | Class target exceeded | Class 4.0+ achieved |

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Calibration Status — Honest Ceiling

This section exists because overclaiming model accuracy in an engineering tool is worse than disclosing its limits.

**What's validated:** The mechanism model (4-stage pilling formation), the directional relationships between each parameter and pilling outcome, and the ISO 12945-2:2000 classification mapping are all grounded in published, cited textile research.

**What's not yet validated:** The specific numeric weights (the 35/25/25/15 group split, the exact coefficients within each phase, the optimal twist range of 700–900 tpm) are derived from literature synthesis, not fitted against real Martindale-tested production samples. They are explicitly tagged as assumptions in the full methodology document.

**Path to full calibration:** Real-sample testing across the parameter space — realistically several dozen Martindale-tested fabric samples spanning different fibre blends, twist levels, weave types, and finishing combinations — would allow the literature-derived weights to be replaced with regression-fitted ones. This is the single highest-leverage next step for anyone adopting this tool industrially.

| Assumption | Label |
|---|---|
| Polyester acts as anchor fibre similar to nylon | `[ASSUMPTION]` |
| Viscose reduces pilling resistance when wet | `[ASSUMPTION]` |
| Elastane heat sensitivity affects finishing | `[ASSUMPTION]` |
| Optimal twist range 700–900 tpm | `[ASSUMPTION]` |
| Relative influence weights (35/25/25/15) | `[ASSUMPTION]` |
| Higher fabric mass reduces pilling | `[ASSUMPTION]` |

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Repository Structure

```
TEXTILE-PILLING/
│
├── index.html              ← Main simulator interface
├── style.css                ← Styling (AION system design language)
├── script.js                ← Scoring engine + UI logic
│
├── docs/
│   ├── methodology.md       ← Full parameter framework + scoring formulas
│   ├── validation.md        ← Test cases + ISO compliance notes
│   └── tradeoffs.md         ← Durability / hand-feel / cost analysis
│
├── assets/
│   └── images/               ← Screenshots, interface previews
│
├── README.md                ← This file
└── LICENSE                  ← GPL-3.0
```

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Methodology Documentation

Full methodology is documented in [`docs/methodology.md`](docs/methodology.md). Key sections:

1. **Data collection** — Published textile research with full citations
2. **Parameter correlation** — Pairwise interaction matrix across all four phases
3. **Scoring architecture** — PSS formula derivation, weight calibration, uncertainty quantification
4. **ISO 12945-2:2000 compliance** — Martindale method mapping and class boundary rationale

The simulator is a parametric engineering model built entirely from published research. All formulas and weights are traceable to cited sources, with assumptions explicitly labeled.

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## License

**GNU General Public License v3.0**

See [`LICENSE`](LICENSE) for full terms. Open for research, academic, and non-commercial use.

**Commercial licensing:** If you need to integrate this into a closed or proprietary product — for example, an industrial QC pipeline that can't be open-sourced under GPL copyleft — a separate commercial licensing path is available. Contact [aionsystem@outlook.com](mailto:aionsystem@outlook.com).

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Acknowledgments

| Source | Role |
|---|---|
| InoCrowd Pilling Challenge | Original problem statement — quantifying pilling parameter influence |
| ISO 12945-2:2000 | Martindale method standard — pilling classification reference |
| Wang Lu et al. (1994) | Pilling mechanism research — 4-stage formation model |
| Yang, Zhang & Shen (2017) | Fibre parameter correlations and weighting calibration |
| Ghosh, Das & Saha (1987) | Yarn hairiness research |
| AATCC Test Method 61-2013 | Pilling assessment standards |
| [AION Constitutional Stack](https://github.com/AionSystem) | Epistemic scoring, FORGE audit methodology, and uncertainty quantification architecture |

[![↑ Back to Table of Contents](https://img.shields.io/badge/↑_Back_to-Table_of_Contents-374151?style=flat-square)](#table-of-contents)

---

## Contact

**Sheldon K. Salmon** — AI Reliability Architect · Red-Team Framework Designer · AionSystem

| Channel | Link |
|---|---|
| GitHub | [github.com/AionSystem](https://github.com/AionSystem) |
| Portfolio | [aionsystem.github.io](https://aionsystem.github.io) |
| LinkedIn | [linkedin.com/in/sheldon-k-salmon-b0901b378](https://www.linkedin.com/in/sheldon-k-salmon-b0901b378/) |
| Email | [aionsystem@outlook.com](mailto:aionsystem@outlook.com) |
| ORCID | [0009-0005-8057-5115](https://orcid.org/0009-0005-8057-5115) |

---

<div align="center">

**PILLING-SIM v1.1** · **FORGE v1.0 Audited · EV 0.73**

*Four-stage parameter framework · ISO 12945-2:2000 · Confidence-scored predictions · Open Source*

</div>
