![1000008548](https://github.com/user-attachments/assets/7df2469d-f489-488e-91e5-16d45b31b0ec)

# Textile Pilling Simulator — InoCrowd Challenge 2026

<!-- STATUS · VERSION · CHALLENGE -->
[![Status](https://img.shields.io/badge/STATUS-Building-4ade80?style=flat-square)](https://github.com/AionSystem/PILLING-SIMULATOR)
[![Version](https://img.shields.io/badge/version-v0.1.0-orange)](#)
[![InoCrowd](https://img.shields.io/badge/InoCrowd-Pilling%20Challenge-0052CC?style=flat-square)](https://inocrowd.com)
[![Due](https://img.shields.io/badge/Due-April%206%2C%202026-red?style=flat-square)](#)
[![DOI](https://zenodo.org/badge/1200586477.svg)](https://doi.org/10.5281/zenodo.19409957)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![ORCID — Sheldon K. Salmon](https://img.shields.io/badge/ORCID-0009--0005--8057--5115-a6ce39?style=flat&logo=orcid&logoColor=white)](https://orcid.org/0009-0005-8057-5115)

> **Quantifying the Relative Influence of Parameters on Pilling Results in Woven Fabrics.**
> A data-driven, explainable simulator for textile pilling prediction across all four processing stages.

---

## Table of Contents

1. [Overview](#overview)
2. [The Challenge](#the-challenge)
3. [Parameter Framework](#parameter-framework)
   - [Phase 1 — Fibre](#phase-1--fibre-parameters)
   - [Phase 2 — Yarn](#phase-2--yarn-parameters)
   - [Phase 3 — Construction](#phase-3--fabric-construction)
   - [Phase 4 — Finishing](#phase-4--finishing-treatments)
4. [Scoring Engine](#scoring-engine)
   - [Pilling Susceptibility Score](#pilling-susceptibility-score-pss)
   - [Relative Influence Calculation](#relative-influence-calculation)
   - [Pilling Class Prediction](#pilling-class-prediction-15)
   - [Confidence Score](#confidence-score)
5. [Simulator Interface](#simulator-interface)
6. [Installation](#installation)
7. [Usage](#usage)
8. [Validation](#validation)
9. [Repository Structure](#repository-structure)
10. [Methodology Documentation](#methodology-documentation)
11. [License](#license)
12. [Acknowledgments](#acknowledgments)
13. [Contact](#contact)

---

## Overview

This simulator predicts pilling behavior in woven fashion fabrics based on parameters across all four stages of textile processing. It is the first integrated tool to relate fibre composition, yarn construction, fabric structure, and finishing treatments into a single, explainable confidence-scored prediction.

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

**Live Simulator:** [aionsystem.github.io/PILLING-SIMULATOR](https://aionsystem.github.io/PILLING-SIMULATOR)

---

## The Challenge

**Problem:** Textile manufacturers need to reduce pilling without compromising comfort or appearance. No integrated tool exists that relates all parameters across spinning, weaving, dyeing, and finishing into a single actionable prediction.

**Target:** Achieve pilling class ≥3 under ISO 12945-2:2000 (Martindale method).

**Material scope:** Woven fabrics from polyester, viscose, wool, and elastane blends (polyester dominant); spun yarns from staple fibres.

**What this solution explicitly avoids:**

| Exclusion | Rationale |
|---|---|
| Addressing only one processing phase | Pilling is a multi-stage phenomenon — single-phase tools miss systemic interactions |
| Targeting only one fabric type | Industrial reality demands adaptability across blend compositions |
| Lacking explainability | Manufacturers need to know *why* a change improves class, not just that it does |

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

---

## Scoring Engine

### Pilling Susceptibility Score (PSS)

```
PSS_base = 0.50  (neutral starting point)

PSS_final = PSS_base
           × w_fibre        × (fibre_contribution)
           × w_yarn         × (yarn_contribution)
           × w_construction × (construction_contribution)
           × w_finishing    × (finishing_contribution)
```

### Relative Influence Calculation

Each parameter group contributes a weighted percentage to the final prediction. Weights are adjustable within validated ranges:

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
  Class 5 — PSS_final ≤ 0.20   No pilling
  Class 4 — PSS_final 0.21–0.40  Slight pilling
  Class 3 — PSS_final 0.41–0.60  Moderate pilling  ← TARGET (ISO 12945-2:2000)
  Class 2 — PSS_final 0.61–0.80  Severe pilling
  Class 1 — PSS_final ≥ 0.81   Very severe pilling
```

### Confidence Score

```
Confidence = 1 − Uncertainty_Mass (UM)

Uncertainty penalties applied when inputs deviate from validated ranges:
  Fibre blend outside typical industrial ratios   +0.10 UM
  Twist outside 700–900 tpm                       +0.10 UM
  Density outside typical range                   +0.05 UM
  Untested finishing treatment combination        +0.05 UM
```

A confidence score below 70% triggers a flagged output — the prediction is reported as uncertain and the deviation is named explicitly.

---

## Simulator Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  TEXTILE PILLING SIMULATOR — InoCrowd Challenge 2026           │
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
│  Weave type:     ● Plain   ○ Twill   ○ Satin                   │
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
│  │  PREDICTED PILLING CLASS:  3.4  ✅  (≥3 = PASS)        │   │
│  │  CONFIDENCE:               82%  (UM: 0.18)             │   │
│  │                                                         │   │
│  │  RELATIVE INFLUENCE:                                   │   │
│  │    Fibre composition:      32%                         │   │
│  │    Yarn construction:      28%                         │   │
│  │    Woven construction:     25%                         │   │
│  │    Finishing treatments:   15%                         │   │
│  │                                                         │   │
│  │  EXPLANATION:                                          │   │
│  │  → Polyester 60% anchors pills — moderate retention    │   │
│  │  → Twist 750 tpm is optimal for this blend             │   │
│  │  → Plain weave + anti-pilling pushes class to 3.4      │   │
│  │  → Adding resin finish would reach class 4.0           │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  TRADE-OFFS                                                     │
│  Durability:    ████████████░░░░░░  Good                        │
│  Hand-feel:     ██████████░░░░░░░░  Acceptable                  │
│  Cost estimate: +8% vs. baseline                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/AionSystem/PILLING-SIMULATOR.git
cd PILLING-SIMULATOR
```

No dependencies — pure HTML, CSS, and JavaScript. Open `index.html` in any modern browser.

**GitHub Pages deployment:**

1. Push to `main` branch
2. Enable GitHub Pages in repository Settings → Pages
3. Live at: `https://aionsystem.github.io/PILLING-SIMULATOR/`

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

---

## Validation

The scoring engine is calibrated against published textile engineering research. No proprietary data was used.

| Source | Finding | Implementation |
|---|---|---|
| ISO 12945-2:2000 | Martindale method — pilling classification standard | Classification scale 1–5; target ≥3 enforced |
| AATCC Test Method 61-2013 | Accelerated pilling assessment standards | Weighting calibration for finishing treatments |
| Moghassem & Najar (2012) | Bending rigidity + weft count predict pilling class | Included in Phase 3 construction scoring |
| *Textile Research Journal* | Fibre length, denier, and crimp correlations | Phase 1 parameter weightings |

**Edge cases tested:**

| Scenario | Expected Result | Simulator Output |
|---|---|---|
| 100% polyester, no finishing | Pill retention high — moderate class | Class 2.8–3.1 |
| 100% viscose, no finishing | Weak when wet — lower class | Class 1.9–2.3 |
| Low twist + high hairiness | Class failure | Class < 3.0 flagged |
| All anti-pilling treatments active | Class target exceeded | Class 4.0+ achieved |

---

## Repository Structure

```
PILLING-SIMULATOR/
│
├── index.html              ← Main simulator interface
├── style.css               ← Styling (AION system design language)
├── script.js               ← Scoring engine + UI logic
│
├── docs/
│   ├── methodology.md      ← Full parameter framework + scoring formulas
│   ├── validation.md       ← Test cases + ISO compliance notes
│   └── tradeoffs.md        ← Durability / hand-feel / cost analysis
│
├── assets/
│   └── images/             ← Screenshots, interface previews
│
├── README.md               ← This file
└── LICENSE                 ← GPL-3.0
```

---

## Methodology Documentation

Full methodology is documented in [`docs/methodology.md`](docs/methodology.md). Key sections:

1. **Data collection** — Published textile research with full citations
2. **Parameter correlation** — Pairwise interaction matrix across all four phases
3. **Scoring architecture** — PSS formula derivation, weight calibration, uncertainty quantification
4. **ISO 12945-2:2000 compliance** — Martindale method mapping and class boundary rationale

The simulator is a parametric engineering model built entirely from published research. All formulas and weights are traceable to cited sources.

---

## License

**GNU General Public License v3.0**

See [`LICENSE`](LICENSE) for full terms. Open for research, academic, and non-commercial use. Commercial licensing available — contact [aionsystem@outlook.com](mailto:aionsystem@outlook.com).

---

## Acknowledgments

| Source | Role |
|---|---|
| InoCrowd Challenge | Problem statement — quantifying pilling parameter influence |
| ISO 12945-2:2000 | Martindale method standard — pilling classification reference |
| *Textile Research Journal* | Fibre parameter correlations and weighting calibration |
| AATCC Test Method 61-2013 | Pilling assessment standards |
| [AION Constitutional Stack](https://github.com/AionSystem) | Epistemic scoring and uncertainty quantification architecture |

---

## Contact

**Sheldon K. Salmon** — AI Reliability Architect, AION Systems

| Channel | Link |
|---|---|
| GitHub | [github.com/AionSystem](https://github.com/AionSystem) |
| Portfolio | [aionsystem.github.io](https://aionsystem.github.io) |
| Email | [aionsystem@outlook.com](mailto:aionsystem@outlook.com) |
| ORCID | [0009-0005-8057-5115](https://orcid.org/0009-0005-8057-5115) |

---

<div align="center">

**Textile Pilling Simulator v0.1.0** · **InoCrowd Challenge 2026**

*Four-stage parameter framework · ISO 12945-2:2000 · Confidence-scored predictions*

</div>
