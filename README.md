Textile Pilling Simulator — InoCrowd Challenge 2026

https://img.shields.io/badge/STATUS-Building-4ade80?style=flat-square
https://img.shields.io/badge/version-v0.1.0-orange
https://img.shields.io/badge/InoCrowd-Pilling%20Challenge-0052CC?style=flat-square
https://img.shields.io/badge/Due-April%206%2C%202026-red?style=flat-square
[![DOI](https://zenodo.org/badge/1200586477.svg)](https://doi.org/10.5281/zenodo.19409957)

Quantifying the Relative Influence of Parameters on Pilling Results in Woven Fabrics
A data-driven, explainable simulator for textile pilling prediction.

---

Table of Contents

· Overview
· The Challenge
· Parameter Framework
· Scoring Engine
· Simulator Interface
· Installation
· Usage
· Validation
· Repository Structure
· License
· Acknowledgments

---

Overview

This simulator predicts pilling behavior in woven fashion fabrics based on parameters across four stages of textile processing:

Stage Parameters
Fibre Type, blend ratio, fibre length, denier, crimp
Yarn Twist, hairiness, spinning method, count
Construction Weave type, warp/weft density, fabric mass
Finishing Singeing, mercerization, anti-pilling treatment, resin

The solution provides:

· ✅ Relative influence scoring — which parameters matter most
· ✅ Scenario simulation — test changes at any stage
· ✅ Pilling class prediction (1–5, target ≥3 per ISO 12945-2:2000)
· ✅ Explainability — why the prediction changed
· ✅ Trade-off analysis — durability vs. hand-feel vs. cost

---

The Challenge

Problem: Textile manufacturers need to reduce pilling without compromising comfort or appearance. No integrated tool exists that relates all parameters across spinning, weaving, dyeing, and finishing.

Target: Achieve pilling class ≥3 under ISO 12945-2:2000.

Material scope: Woven fabrics from polyester, viscose, wool, and elastane blends (polyester dominant), spun yarns from staple fibres.

Exclusion criteria (this solution avoids):

· ❌ Addressing only one processing phase
· ❌ Targeting only one fabric type
· ❌ Lacking adaptability to industrial diversity

---

Parameter Framework

Phase 1 — Fibre Parameters

Parameter Impact on Pilling Rule
Fibre length Short fibres pill more Longer = better
Fibre denier Fine denier pills more Coarser = better
Fibre tenacity High tenacity = pills persist Moderate = better
Fibre crimp High crimp = less pilling Higher = better
Polyester % Anchor fibre Higher = more pill retention
Viscose % Weak when wet Lower = better

Phase 2 — Yarn Parameters

Parameter Impact on Pilling Rule
Yarn twist Higher twist = less pilling Target: 700–900 tpm
Yarn hairiness Lower hairiness = better Target: H < 4.0
Spinning method Ring-spun = more pilling Open-end better
Yarn count Finer = more pilling Coarser = better

Phase 3 — Fabric Construction

Parameter Impact on Pilling Rule
Weave type Plain < Twill < Satin Plain tightest → best
Warp density Higher = less pilling 45 picks/cm
Weft density Higher = less pilling 40 picks/cm
Fabric mass Heavier = better 150 gsm

Phase 4 — Finishing Treatments

Treatment Effect
Singeing ✅ REDUCES pilling
Mercerization ✅ REDUCES pilling
Anti-pilling chemical ✅ REDUCES pilling
Resin finishing ✅ MOST EFFECTIVE
Shearing ✅ REDUCES pilling
Softening agent ⚠️ INCREASES pilling
Heat-setting ➖ No significant effect

---

Scoring Engine

Pilling Susceptibility Score (PSS)

```
PSS_base = 0.50 (neutral starting point)

PSS_final = PSS_base 
           × w_fibre × (fibre_contribution)
           × w_yarn × (yarn_contribution)
           × w_construction × (construction_contribution)
           × w_finishing × (finishing_contribution)
```

Relative Influence Calculation

Each parameter group contributes a percentage to the final prediction:

Group Default Weight Range
Fibre composition 35% 25–45%
Yarn construction 25% 20–30%
Woven construction 25% 20–30%
Finishing treatments 15% 10–20%

Pilling Class Prediction (1–5)

```
Pilling_Class = 1 + (1 - PSS_final) × 4

Where:
  Class 5: PSS_final ≤ 0.20 (No pilling)
  Class 4: PSS_final 0.21–0.40 (Slight pilling)
  Class 3: PSS_final 0.41–0.60 (Moderate pilling — TARGET)
  Class 2: PSS_final 0.61–0.80 (Severe pilling)
  Class 1: PSS_final ≥ 0.81 (Very severe pilling)
```

Confidence Score

```
Confidence = 1 - Uncertainty_Mass

Where UM increases when inputs are far from validated ranges:
  - Fibre blend outside typical ratios: +0.10
  - Twist outside 700–900 tpm: +0.10
  - Density outside typical range: +0.05
  - Untested finishing combination: +0.05
```

---

Simulator Interface

The simulator provides:

```
┌─────────────────────────────────────────────────────────────┐
│  TEXTILE PILLING SIMULATOR — InoCrowd Challenge 2026       │
├─────────────────────────────────────────────────────────────┤
│  PHASE 1: FIBRE                                             │
│  Polyester %:    ████████████░░░░░░  60%                    │
│  Viscose %:      ██████░░░░░░░░░░░░  30%                    │
│  Wool %:         ██░░░░░░░░░░░░░░░░  10%                    │
│  Elastane %:     ░░░░░░░░░░░░░░░░░░   0%                    │
│  Fibre length:   ████████░░░░░░░░░░  Medium (>30mm)         │
├─────────────────────────────────────────────────────────────┤
│  PHASE 2: YARN                                               │
│  Twist (tpm):    ████████░░░░░░░░░░  750                    │
│  Hairiness (H):  ██████░░░░░░░░░░░░  3.2                    │
│  Spinning:       ○ Ring-spun    ● Open-end                  │
├─────────────────────────────────────────────────────────────┤
│  PHASE 3: CONSTRUCTION                                       │
│  Weave type:     ● Plain   ○ Twill   ○ Satin                │
│  Warp density:   ██████████░░░░░░░░  48 picks/cm            │
│  Weft density:   ████████░░░░░░░░░░  42 picks/cm            │
├─────────────────────────────────────────────────────────────┤
│  PHASE 4: FINISHING                                          │
│  Singeing:       ● Yes   ○ No                               │
│  Mercerization:  ● Yes   ○ No                               │
│  Anti-pilling:   ● Yes   ○ No                               │
│  Resin finish:   ○ Yes   ● No                               │
├─────────────────────────────────────────────────────────────┤
│  RESULTS                                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PREDICTED PILLING CLASS:  3.4  ✅ (≥3 = PASS)       │  │
│  │  CONFIDENCE:               82%  (UM: 0.18)           │  │
│  │                                                       │  │
│  │  RELATIVE INFLUENCE:                                 │  │
│  │    Fibre composition:      32%                       │  │
│  │    Yarn construction:      28%                       │  │
│  │    Woven construction:     25%                       │  │
│  │    Finishing:              15%                       │  │
│  │                                                       │  │
│  │  EXPLANATION:                                        │  │
│  │  → Polyester 60% provides good anchor but holds pills│  │
│  │  → Twist 750 tpm is optimal for this blend           │  │
│  │  → Plain weave + anti-pilling pushes class to 3.4    │  │
│  │  → Adding resin finish would reach class 4.0         │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  TRADE-OFFS                                                 │
│  Durability:    ████████████░░░░░░  Good                    │
│  Hand-feel:     ██████████░░░░░░░░  Acceptable              │
│  Cost estimate: +8% vs. baseline                           │
└─────────────────────────────────────────────────────────────┘
```

---

Installation

```bash
# Clone the repository
git clone https://github.com/AionSystem/PILLING-SIMULATOR.git
cd PILLING-SIMULATOR

# No dependencies — pure HTML/CSS/JS
# Open index.html in any browser
```

For GitHub Pages:

1. Push to main branch
2. Enable GitHub Pages in repository settings
3. Access at https://aionsystem.github.io/PILLING-SIMULATOR/

---

Usage

Action Method
Adjust fibre blend Move sliders (sum must = 100%)
Modify yarn twist Drag twist slider
Change weave type Click radio button
Add finishing treatments Toggle switches
See real-time prediction Updates instantly
Export results Click "Generate Report" button

Interpretation:

· Class ≥3 — Acceptable for market
· Confidence >70% — Prediction reliable
· Influence % — Which parameter group to prioritize for improvement

---

Validation

The simulator is validated against published textile research:

Source Finding Implementation
AATCC Test Method 61-2013 Pilling assessment standards Classification scale 1–5
ISO 12945-2:2000 Martindale method Target ≥3 enforced
Moghassem & Najar (2012) Bending rigidity + weft count predicts pilling Included in construction scoring
Textile Research Journal Fibre length, denier, crimp correlations Parameter weightings calibrated

Edge Cases Tested:

· 100% polyester → pill retention high, class moderate
· 100% viscose → weak when wet, class lower
· Low twist + high hairiness → class <3 (failure)
· All anti-pilling treatments → class 4+ achievable

---

Repository Structure

```
PILLING-SIMULATOR/
│
├── index.html              ← Main simulator interface
├── style.css               ← Styling (matching AION system design)
├── script.js               ← Scoring engine + UI logic
│
├── docs/
│   ├── methodology.md      ← Full parameter framework + scoring formulas
│   ├── validation.md       ← Test cases + ISO compliance
│   └── tradeoffs.md        ← Durability/hand-feel/cost analysis
│
├── assets/
│   └── images/             ← Screenshots, icons
│
├── README.md               ← This file
└── LICENSE                 ← GPL-3.0
```

---

Methodology Documentation (Summary)

Full methodology is in docs/methodology.md. Key sections:

1. Data collection — Published textile research (citations provided)
2. Parameter correlation — Pairwise interaction matrix
3. Scoring architecture — PSS formula, weight derivation, confidence calculation
4. ISO 12945-2:2000 compliance — Martindale method simulation

No proprietary data used. The simulator is a parametric model built from published engineering rules.

---

License

GNU General Public License v3.0

See LICENSE for full terms.

---

Acknowledgments

· InoCrowd Challenge: Quantifying the Relative Influence of Parameters on Pilling Results
· ISO 12945-2:2000 — Martindale method standard
· Textile Research Journal — Fibre parameter correlations
· AATCC — Pilling assessment standards

---

Contact

Sheldon K. Salmon — AI Reliability Architect

· GitHub: github.com/AionSystem
· Portfolio: aionsystem.github.io
