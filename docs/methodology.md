# Textile Pilling Simulator — Methodology Document

**Version:** v1.0
**Date:** April 2026
**Author:** Sheldon K. Salmon — AionSystem
**License:** GPL-3.0

---

## Overview

This document describes the methodology for a data-driven, explainable simulator that quantifies the relative influence of parameters on pilling in woven fabrics.

**Core innovation:** The simulator applies certainty engineering principles (from the AION Constitutional Stack) to textile manufacturing — the same methodology deployed in crisis data certification (VERITAS), industrial AI reliability (AXIOM), and AI companion governance (ANIMA).

**Key outputs:**
- Predicted pilling class (1–5, target ≥3 per ISO 12945-2:2000)
- Relative influence scoring per parameter group
- Scenario simulation across all processing stages
- Trade-off analysis (durability vs. hand-feel vs. cost)

**Material scope:** Woven fabrics from polyester, viscose, wool, and elastane blends (polyester dominant), spun yarns from staple fibres.

**Exclusion criteria (addressed):**
- ✅ Covers spinning → weaving → dyeing → finishing (all phases)
- ✅ Supports multiple fabric types via parameter sliders
- ✅ Adaptable to industrial diversity via configurable weightings

---

## The Pilling Problem

### Definition

Pilling is the formation of small fiber balls on fabric surface caused by friction during use or handling. It degrades visual appearance and perceived quality.

### Mechanism (4 Stages)

| Stage | Description | Source |
|-------|-------------|--------|
| **1. Fiber protrusion** | Loose fibers migrate to fabric surface | Wang Lu et al., 1994 |
| **2. Fiber entanglement** | Protruding fibers twist together forming fuzz | Same |
| **3. Pill formation** | Balls form anchored to fabric by stronger fibers | Same |
| **4. Pill retention or detachment** | Strong anchor fibers hold pills; weak fibers shed them | Same |

### Critical Abrasion Cycles

| Cycle Range | Phenomenon | Source |
|-------------|------------|--------|
| 10–20 cycles | Fuzz → initial pill formation | Wang Lu et al., 1994 |
| 20–200 cycles | Rapid pill formation stage | Same |
| 200–1000 cycles | Pilling rate decreases | Same |
| 1000+ cycles | Pills begin to break off | Same |

**Key insight from source:** *"The shape of pilling curve is same after different treatments, but the absolute value of pilling is decreased by various degrees."* — This means our scoring engine can apply consistent modifiers across parameter groups.

---

## Parameter Framework

### Phase 1: Fibre Parameters

| Parameter | Impact Direction | Rule | Citation |
|-----------|-----------------|------|----------|
| Fibre length (staple) | Longer → less pilling | "Shorter fibers are easier to become protruding fiber bundle" | Yang, Zhang, Shen, 2017 |
| Fibre denier (fineness) | Coarser → less pilling | "Finer fiber means more pilling" | Same |
| Fibre crimp | Higher → less pilling | "Fiber crimp is higher, cohesion is better" | Same |
| Fibre scale (wool) | Longer scales → better | "Long scale length is longer, the ant-pilling is better" | Same |
| Scale thickness | Thicker → worse | "Scale thickness is larger, the ant-pilling is worse" | Same |

**Fibre Type Rules (Polyester-dominant blends):**

| Fibre | Role in Pilling | Rule Source |
|-------|-----------------|-------------|
| Polyester | Anchor fibre | "Weaker fibers that detach become entangled with stronger synthetic fibers such as polyester, which act as anchors and hold pills in place over a longer period" | Published textile research |
| Viscose | Weak when wet | Known fibre property (inference, labeled as assumption) |
| Wool | Variable | Soft fuzzy wools pill more; worsted wools pill less | Yang et al., 2017 |
| Elastane | Heat sensitive | Known fibre property (inference, labeled as assumption) |

### Phase 2: Yarn Parameters

| Parameter | Impact Direction | Rule | Citation |
|-----------|-----------------|------|----------|
| Twist | Higher → less pilling | "Yarns with low twist and high hairiness are more prone to pilling" | *12—Pilling of Fabrics*, 1956 |
| Hairiness | Lower → less pilling | "High hairiness responsible for roughness and pill formation" | Same |
| Spinning method | Ring-spun → more pilling | "Spinning system also affects pilling. Silk/worsted gave less pilling than cotton, while cotton gave less pilling than woollen" | Same |
| Linear density (yarn count) | Coarser → less hairiness | "Hairiness decreases with increase in linear density" | Ghosh et al., 1987 |
| Twist multiplier | Higher → less hairiness | "Hairiness decreases with increase in twist multiplier" | Same |

**Twist optimal range:** 700–900 tpm (textile engineering standard, used as assumption)

### Phase 3: Fabric Construction

| Parameter | Impact Direction | Rule | Citation |
|-----------|-----------------|------|----------|
| Weave type | Plain < Twill < Satin | "The plain weave pilled less than the twill" | *12—Pilling of Fabrics*, 1956 |
| Warp density (picks/cm) | Higher → less pilling | "Increasing ends and picks per inch reduces pilling" | Same |
| Weft density | Higher → less pilling | Same | Same |
| Fabric mass (gsm) | Higher → less pilling | Logical inference (assumption) | — |

**Weave tightness order (validated):**

| Weave | Relative Pilling Resistance |
|-------|----------------------------|
| Plain (tightest) | Highest |
| Twill (moderate) | Moderate |
| Satin (loosest) | Lowest |

Source: *12—Pilling of Fabrics*, 1956

### Phase 4: Finishing Treatments

| Treatment | Effect on Pilling | Mechanism | Citation |
|-----------|-------------------|-----------|----------|
| Singeing/Cropping | ✅ REDUCES | Removes protruding fibers | *12—Pilling of Fabrics*, 1956 |
| Shearing | ✅ REDUCES | Cuts protruding fibers | Wang Lu et al., 1994 |
| Resin finishing | ✅ MOST EFFECTIVE | Binds fibers together | Same |
| Anti-pilling chemical | ✅ REDUCES | Increases fiber friction | *12—Pilling of Fabrics*, 1956 |
| Softening agent | ⚠️ INCREASES | Reduces fiber friction, allows migration | Wang Lu et al., 1994 |
| Heat-setting | ➖ NO EFFECT | "Effect of heat-setting on pilling was not significant" | Same |
| Dyeing (without soap) | ➖ NO EFFECT | "Dyeing had no effect unless soap solution was used" | *12—Pilling of Fabrics*, 1956 |

---

## Scoring Architecture

### Pilling Susceptibility Score (PSS)

The PSS is a composite score from 0.0 (no pilling susceptibility) to 1.0 (severe pilling susceptibility).

```

PSS_base = 0.50 (neutral starting point)

```

**Stage 1 — Fibre Contribution:**

```

fibre_score = (fibre_length_score × 0.25) 
+ (fibre_denier_score × 0.25)
+ (fibre_crimp_score × 0.20)
+ (blend_score × 0.30)

Where:

· fibre_length_score = (actual_length - min_length) / (max_length - min_length)
· fibre_denier_score = 1 - (denier - min_denier) / (max_denier - min_denier)
· fibre_crimp_score = crimp / max_crimp (capped at 1.0)
· blend_score = 1 - (polyester_pct / 100)  (lower polyester = higher susceptibility)

```

**Stage 2 — Yarn Contribution:**

```

yarn_score = (twist_score × 0.35)
+ (hairiness_score × 0.35)
+ (spinning_score × 0.20)
+ (count_score × 0.10)

Where:

· twist_score = 1 - (twist - min_twist) / (max_twist - min_twist) [optimal at 800 tpm]
· hairiness_score = hairiness / max_hairiness (capped at 1.0)
· spinning_score = 0.3 if ring-spun, 0.2 if open-end
· count_score = 1 - (count - min_count) / (max_count - min_count)

```

**Stage 3 — Construction Contribution:**

```

construction_score = (weave_score × 0.40)
+ (density_score × 0.40)
+ (mass_score × 0.20)

Where:

· weave_score = 0.2 (plain), 0.4 (twill), 0.6 (satin)
· density_score = 1 - (1 - (warp_density / target_density)) × (1 - (weft_density / target_density))
· mass_score = 1 - (mass / max_mass) (higher mass = lower score)

```

**Stage 4 — Finishing Contribution:**

```

finishing_modifier = 1.0
× (0.85 if singeing else 1.0)
× (0.85 if mercerization else 1.0)
× (0.70 if resin else 1.0)
× (0.80 if anti_pilling else 1.0)
× (1.15 if softening else 1.0)

```

**Final PSS:**

```

PSS_final = 0.1 + (fibre_score × yarn_score × construction_score × finishing_modifier) × 0.4

```

### Pilling Class Prediction

```

Pilling_Class = 1 + (1 - PSS_final) × 4

Result mapping:
Class 5: PSS_final ≤ 0.20 (No pilling)
Class 4: PSS_final 0.21–0.40 (Slight pilling)
Class 3: PSS_final 0.41–0.60 (Moderate pilling — TARGET)
Class 2: PSS_final 0.61–0.80 (Severe pilling)
Class 1: PSS_final ≥ 0.81 (Very severe pilling)

```

**Pass/Fail:** Class ≥ 3 = PASS per ISO 12945-2:2000 requirement.

### Confidence Score

```

Confidence = 1 - Uncertainty_Mass

Where UM increases when inputs are outside validated ranges:

Condition UM Penalty
Fibre blend outside typical ratios (polyester < 40% or > 90%) +0.10
Twist outside 700–900 tpm +0.10
Density outside 35–55 picks/cm +0.05
Untested finishing combination (>3 treatments) +0.05
Blend includes >10% elastane +0.05

Confidence is capped at 0.95 (no 100% certainty in textile prediction).

```

---

## Relative Influence Calculation

### Group Weights (Derived from Parameter Count + Published Correlation Strengths)

| Parameter Group | Weight | Rationale |
|----------------|--------|-----------|
| Fibre composition | 35% | 5+ parameters; strongest correlation in Yang et al., 2017 |
| Yarn construction | 25% | 4 parameters; moderate correlation in Ghosh et al., 1987 |
| Woven construction | 25% | 4 parameters; moderate correlation in *12—Pilling of Fabrics*, 1956 |
| Finishing treatments | 15% | 6+ treatments; effect size varies, but resin finishing is powerful |

### Per-Group Influence Calculation

```

influence_fibre = (1 - fibre_score) × 0.35 / total
influence_yarn = (1 - yarn_score) × 0.25 / total
influence_construction = (1 - construction_score) × 0.25 / total
influence_finishing = (1 - finishing_modifier_normalized) × 0.15 / total

```

**Output format:** Percentages summing to 100%, displayed with explanation.

---

## ISO 12945-2:2000 Compliance

### Standard Overview

| Aspect | Specification |
|--------|--------------|
| **Title** | Textiles — Determination of fabric propensity to surface fuzzing and pilling — Part 2: Modified Martindale method |
| **Method** | Specimens rubbed against standard abrasive in Lissajous (figure-eight) motion |
| **Inspection cycles** | 125, 500, 1000, 2000, 5000 (varies by fabric type) |
| **Classification** | 1–5 visual rating scale |
| **Target** | Class ≥ 3 for commercial acceptability |

### Implementation

The simulator predicts outcomes based on parameter inputs, calibrated to ISO classification thresholds:

| Predicted Class | ISO Interpretation | Commercial Acceptability |
|----------------|-------------------|--------------------------|
| 5 | No change | Excellent |
| 4 | Slight surface fuzzing and/or partial pills | Good |
| 3 | Moderate surface fuzzing and/or pills | **Acceptable (Target)** |
| 2 | Distinct surface fuzzing and/or pills | Unacceptable |
| 1 | Dense surface fuzzing and/or pills | Unacceptable |

---

## Parameter Range Table

| Parameter | Min | Max | Optimal |
|-----------|-----|-----|---------|
| Polyester % | 0 | 100 | 60–80 |
| Viscose % | 0 | 100 | 10–30 |
| Wool % | 0 | 100 | 5–20 |
| Elastane % | 0 | 20 | <5 |
| Twist (tpm) | 400 | 1200 | 700–900 |
| Hairiness (H) | 2.0 | 8.0 | <4.0 |
| Warp density (picks/cm) | 20 | 60 | >45 |
| Weft density (picks/cm) | 20 | 55 | >40 |
| Fabric mass (gsm) | 80 | 300 | >150 |

---

## Assumption Register

| Assumption | Justification | Label |
|------------|---------------|-------|
| Polyester acts as anchor fibre similar to nylon | Nylon rules from *12—Pilling of Fabrics*, 1956 extended to polyester | `[ASSUMPTION]` |
| Viscose reduces pilling resistance when wet | Known fibre property from textile engineering | `[ASSUMPTION]` |
| Elastane heat sensitivity affects finishing | Known fibre property | `[ASSUMPTION]` |
| Optimal twist range 700–900 tpm | Textile engineering standard | `[ASSUMPTION]` |
| Relative influence weights (35/25/25/15) | Derived from parameter count + correlation strength | `[ASSUMPTION]` |
| Hand-feel correlates with twist and finishing | Logical inference from known relationships | `[ASSUMPTION]` |
| Higher fabric mass reduces pilling | Logical inference | `[ASSUMPTION]` |

---

## Citations

1. **Wang Lu, S.S. Wang, S.J. Du, Y.Y. Liu, S.D. Li.** *A STUDY OF PILLING CHARACTERS AND ITS AFFECTING FACTORS OF RABBIT HAIR-WOOL WOVEN FABRIC.* Journal of Textile Research, 1994.

2. **Yang, Zhang, Shen.** *Reducing pilling of knitted woolen fabric based on micro-scale.* 2017.

3. **Anonymous.** *12—Pilling of Fabrics.* Journal of the Textile Institute Transactions, 1956.

4. **Ghosh, Das, Saha.** *Hairiness of Jute Yarn.* 1987.

5. **ISO 12945-2:2000.** *Textiles — Determination of fabric propensity to surface fuzzing and to pilling — Part 2: Modified Martindale method.*

---

*Methodology maintained as part of AION Constitutional Stack — Textile Pilling Simulator v1.0*
