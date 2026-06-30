# Validation Protocol — Textile Pilling Simulator

**Version:** v1.1
**Date:** June 2026
**Author:** Sheldon K. Salmon — AionSystem
**License:** GPL-3.0
**Audit Status:** FORGE v1.0 Audited — EV 0.73, Certified
**Repository:** [github.com/AionSystem/TEXTILE-PILLING](https://github.com/AionSystem/TEXTILE-PILLING)

---

## Revision History

| Version | Date | Change |
|---|---|---|
| v1.0 | April 2026 | Initial validation protocol — FSVE-axis assessment, 7 edge test cases, ISO compliance check, sensitivity analysis |
| v1.1 | June 2026 | FORGE v1.0 audit completed (EV 0.73). No changes to test cases, FSVE scores, or methodology — the v1.0 validation held up under audit. Note: the FSVE overall confidence score below (0.73) and the FORGE EV reported elsewhere in this repository (0.73) are the same figure — FSVE is the certainty-scoring component FORGE's audit builds on, not two independent assessments arriving at the same number by coincidence. |

---

## Overview

This document describes the validation methodology for the Textile Pilling Simulator. Validation is conducted through:

1. **Literature calibration** — Parameter weightings derived from published research
2. **Edge case testing** — Extreme inputs produce expected outcomes
3. **ISO threshold alignment** — Class ≥3 achievable with reasonable inputs
4. **Expert heuristic review** — Assumptions labeled and justified

This document should be read alongside `methodology.md` (full parameter framework and scoring formulas) and the repository README's "Calibration Status — Honest Ceiling" section, which states plainly what is and is not yet validated against real production data.

---

## Validation Framework (Adapted from FSVE v3.8)

The simulator's scoring engine was validated using principles from the AION Constitutional Stack's certainty engineering methodology. The following axes were assessed:

| FSVE Axis | Assessment | Score (0-1) |
|-----------|-----------|-------------|
| E — Evidence Strength | Parameter weightings from published literature | 0.65 |
| A — Assumption Explicitness | All assumptions labeled `[ASSUMPTION]` in code/docs | 0.85 |
| C — Constraint Stability | Parameter ranges bounded; fallbacks defined | 0.80 |
| M — Model Coherence | Internal consistency across scoring functions | 0.75 |
| D — Domain Fit | Matches woven fabric scope (polyester-dominant blends) | 0.85 |
| G — Causal Grounding | Directional relationships from literature | 0.70 |
| H — Hostility Resistance | Edge case testing below | 0.70 |

**Overall confidence:** 0.73 (VALID per FSVE standards, with assumption labels)

---

## Test Case Matrix

### Test Case 1: Optimal Configuration (Should achieve Class 4+)

| Parameter | Value |
|-----------|-------|
| Polyester | 80% |
| Viscose | 10% |
| Wool | 10% |
| Elastane | 0% |
| Fibre length | Long |
| Fibre denier | Coarse |
| Fibre crimp | High |
| Twist | 850 tpm |
| Hairiness | 2.5 H |
| Spinning | Open-end |
| Weave | Plain |
| Warp density | 52 picks/cm |
| Weft density | 48 picks/cm |
| Fabric mass | 200 gsm |
| Singeing | Yes |
| Mercerization | Yes |
| Anti-pilling | Yes |
| Resin | Yes |

**Expected outcome:** Class ≥ 4.0, Confidence ≥ 80%

**Simulator result:** ✅ Class 4.6, Confidence 85%

---

### Test Case 2: Worst Configuration (Should achieve Class < 2)

| Parameter | Value |
|-----------|-------|
| Polyester | 30% |
| Viscose | 50% |
| Wool | 20% |
| Elastane | 0% |
| Fibre length | Short |
| Fibre denier | Fine |
| Fibre crimp | Low |
| Twist | 500 tpm |
| Hairiness | 7.0 H |
| Spinning | Ring-spun |
| Weave | Satin |
| Warp density | 25 picks/cm |
| Weft density | 25 picks/cm |
| Fabric mass | 100 gsm |
| All finishing | No |

**Expected outcome:** Class ≤ 2.0, Confidence lower

**Simulator result:** ✅ Class 1.8, Confidence 62%

---

### Test Case 3: ISO Threshold Boundary (Should achieve Class 3.0)

| Parameter | Value |
|-----------|-------|
| Polyester | 60% |
| Viscose | 30% |
| Wool | 10% |
| Elastane | 0% |
| Fibre length | Medium |
| Fibre denier | Medium |
| Fibre crimp | Medium |
| Twist | 750 tpm |
| Hairiness | 3.5 H |
| Spinning | Open-end |
| Weave | Twill |
| Warp density | 45 picks/cm |
| Weft density | 40 picks/cm |
| Fabric mass | 160 gsm |
| Singeing | Yes |
| Anti-pilling | Yes |

**Expected outcome:** Class ≈ 3.0 (PASS)

**Simulator result:** ✅ Class 3.2, Confidence 78%

---

### Test Case 4: Polyester-Dominant Boundary (Minimum required)

| Parameter | Value |
|-----------|-------|
| Polyester | 51% |
| Viscose | 49% |
| Wool | 0% |
| Elastane | 0% |
| All other parameters | Optimal (as Test Case 1) |

**Expected outcome:** Should still achieve Class 3.0 (meets polyester-dominant requirement)

**Simulator result:** ✅ Class 3.4, Confidence 82%

---

### Test Case 5: High Elastane (Degradation expected)

| Parameter | Value |
|-----------|-------|
| Elastane | 15% |
| Polyester | 50% |
| Viscose | 35% |
| Wool | 0% |
| All other parameters | Optimal (as Test Case 1) |

**Expected outcome:** Class lower than optimal, Confidence penalty applied

**Simulator result:** ✅ Class 3.1, Confidence 72% (elastane penalty applied)

---

### Test Case 6: Softening Agent Effect

| Parameter | Value |
|-----------|-------|
| Same as Test Case 3 (Class 3.2 baseline) |
| Softening agent | Yes |

**Expected outcome:** Class decreases by approximately 0.3-0.5

**Simulator result:** ✅ Class 2.9 (FAIL), Confidence 75% — softening agent pushed below threshold

---

### Test Case 7: Outside Validated Ranges (Confidence penalty)

| Parameter | Value | Why outside range |
|-----------|-------|-------------------|
| Twist | 450 tpm | Below 700-900 optimal range |
| Polyester | 25% | Below 40-90% validated range |
| Warp density | 22 picks/cm | Below 35-55 typical range |

**Expected outcome:** Confidence < 60%, UM penalties applied

**Simulator result:** ✅ Confidence 55%, UM: 0.45

---

## ISO 12945-2:2000 Compliance Check

| Requirement | Simulator Implementation | Status |
|-------------|-------------------------|--------|
| Classification scale 1-5 | Direct mapping | ✅ Compliant |
| Target ≥3 for acceptance | Pass/fail indicator at Class 3 | ✅ Compliant |
| Martindale method (abrasion cycles) | Not simulated — parameter-based prediction | ⚠️ Not applicable |
| Visual rating vs. instrumental | Not applicable to simulation | ⚠️ Not applicable |

**Note:** The simulator predicts pilling class based on input parameters, not by simulating the Martindale apparatus. This is consistent with the goal of estimating pilling class from process parameters.

---

## Sensitivity Analysis

### Most Influential Parameters (per literature)

| Parameter | Influence Weight (simulator) | Literature Support |
|-----------|----------------------------|---------------------|
| Polyester % | 15% (within fibre group) | Multiple studies |
| Twist | 12% (within yarn group) | *12—Pilling of Fabrics*, 1956 |
| Weave type | 10% (within construction) | Same |
| Resin finishing | 10% (within finishing) | Wang Lu et al., 1994 |

**Parameter interaction effects:** The simulator uses multiplicative scoring, which captures interaction effects (e.g., poor fibre + poor yarn + poor finishing = worse than sum of parts).

---

## Known Limitations and Mitigations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| No access to real pilling test data | Parameter weightings are estimated, not empirically calibrated | All weights derived from published literature; labeled `[ASSUMPTION]` |
| Polyester-specific data limited | Rules for polyester dominance based on nylon/wool studies | Explicitly labeled `[ASSUMPTION]` in code and docs |
| Viscose/elastane blend rules inferred | May not match real behavior | Labeled `[ASSUMPTION]`; confidence penalty applied when elastane >10% |
| Hand-feel prediction simplified | Only weave + finishing considered | Labeled `[ASSUMPTION]`; directional only |
| Cost estimates relative | Not absolute cost figures | Labeled "vs baseline" |

---

## Validation Statement

The Textile Pilling Simulator v1.1 has been validated against:

- ✅ 7 edge test cases covering optimal, worst, boundary, and degradation scenarios
- ✅ ISO 12945-2:2000 classification threshold (Class ≥3)
- ✅ Published literature on pilling mechanisms, fibre parameters, yarn parameters, weave effects, and finishing treatments
- ✅ All assumptions explicitly labeled for evaluator transparency
- ✅ FORGE v1.0 adversarial audit (EV 0.73, Certified) — confirms the specification and reasoning hold under structured review

**Validation status:** PROVISIONAL — pending real-world ground truth data. The simulator's predictions are directional and intended for comparative scenario analysis, not absolute certification. FORGE certification reflects the rigor of the specification and audit process; it does not assert that the literature-derived weights have been validated against real production samples. That distinction matters and is stated here deliberately, not as a hedge.

**Path to full validation:**
1. Collect ground truth pilling test results from real Martindale-tested fabric samples — realistically several dozen samples spanning the parameter space (fibre blends, twist levels, weave types, finishing combinations)
2. Calibrate parameter weightings against observed outcomes, replacing literature-derived weights with regression-fitted ones
3. Update scoring engine to M-MODERATE or M-STRONG per FSVE framework

This is the same calibration path described in the README and methodology document — repeated here for anyone reading this file in isolation.

---

## Citations

1. **Wang Lu, S.S. Wang, S.J. Du, Y.Y. Liu, S.D. Li.** *A STUDY OF PILLING CHARACTERS AND ITS AFFECTING FACTORS OF RABBIT HAIR-WOOL WOVEN FABRIC.* Journal of Textile Research, 1994.

2. **Yang, Zhang, Shen.** *Reducing pilling of knitted woolen fabric based on micro-scale.* 2017.

3. **Anonymous.** *12—Pilling of Fabrics.* Journal of the Textile Institute Transactions, 1956.

4. **Ghosh, Das, Saha.** *Hairiness of Jute Yarn.* 1987.

5. **ISO 12945-2:2000.** *Textiles — Determination of fabric propensity to surface fuzzing and to pilling — Part 2: Modified Martindale method.*

6. **AION Constitutional Stack — FSVE v3.8.** Certainty engineering framework for validation assessment.

---

*Document maintained as part of AION Constitutional Stack — Textile Pilling Simulator v1.1 — FORGE v1.0 Audited*
