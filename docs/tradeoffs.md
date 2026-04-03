# Trade-offs Analysis — Textile Pilling Simulator

## InoCrowd Challenge 2026 | NICE Challenge 2026 (Secondary Submission)

**Version:** v1.0
**Date:** April 2026
**Author:** Sheldon K. Salmon — AionSystem

---

## Overview

Pilling resistance does not exist in isolation. Every parameter change that improves pilling behavior affects other fabric properties: durability, hand-feel (softness/stiffness), cost, energy consumption, and environmental impact. This document maps those trade-offs explicitly.

---

## Trade-off 1: Durability vs. Hand-feel

| Parameter Change | Effect on Pilling | Effect on Hand-feel | Net Trade-off |
|-----------------|-------------------|---------------------|---------------|
| Increase twist | ✅ Reduces pilling | ❌ Stiffer, harsher | Acceptable for workwear; problematic for fashion |
| Increase warp/weft density | ✅ Reduces pilling | ❌ Heavier, less drape | Acceptable for outerwear; poor for shirting |
| Resin finishing | ✅ Strongly reduces | ❌ Stiff, plastic-like | Major trade-off — often unacceptable for premium apparel |
| Softening agent | ❌ Increases pilling | ✅ Softer, smoother | Only use if pilling is already acceptable |
| Singeing | ✅ Reduces (minor) | ✅ Smoother surface | No significant negative trade-off — recommended |

**Key insight from literature:** *"Resin finishing agent is the most effective for reducing pilling, but at the cost of fabric stiffness"* — Wang Lu et al., 1994

**Recommendation:** For applications requiring both durability and softness (e.g., fashion apparel), prioritize fibre and yarn parameters over finishing treatments.

---

## Trade-off 2: Polyester Content vs. Comfort

| Polyester % | Pilling Resistance | Breathability | Moisture Wicking | Hand-feel |
|-------------|--------------------|---------------|------------------|-----------|
| 0-30% | ❌ Poor | ✅ Excellent | ✅ Excellent | ✅ Soft |
| 30-60% | ⚠️ Moderate | ⚠️ Moderate | ⚠️ Moderate | ⚠️ Moderate |
| 60-80% | ✅ Good | ❌ Reduced | ❌ Reduced | ❌ Synthetic feel |
| 80-100% | ✅ Excellent | ❌ Poor | ❌ Poor | ❌ Plastic-like |

**Challenge requirement:** Material scope is polyester-dominant blends (polyester represents the predominant proportion). The optimal balance for most fashion applications is 60-80% polyester.

**Citation:** Polyester as anchor fibre — *"Weaker fibers that detach become entangled with stronger synthetic fibers such as polyester, which act as anchors and hold pills in place over a longer period"* (Textile Research Journal, multiple studies).

---

## Trade-off 3: Finishing Cost vs. Performance

| Treatment | Pilling Reduction | Cost Increase | Energy Increase | Chemical Use | Durability of Effect |
|-----------|-------------------|---------------|-----------------|--------------|---------------------|
| Singeing | 10-15% | +3% | Low | None (mechanical) | Permanent |
| Shearing | 10-15% | +3% | Low | None (mechanical) | Permanent |
| Mercerization | 10-15% | +4% | Medium | Sodium hydroxide | Permanent |
| Anti-pilling chemical | 15-20% | +5% | Low | Chemical | Wash-sensitive |
| Resin finishing | 25-35% | +12% | Medium | Formaldehyde-based | Durable |

**Data source:** Estimated from industry standard finishing costs. Exact figures vary by mill and scale.

**Sustainability note:** Resin finishing typically uses formaldehyde-based cross-linking agents. For companies pursuing carbon neutrality (the Seeker's stated goal), mechanical treatments (singeing, shearing) are preferable to chemical treatments despite lower efficacy.

---

## Trade-off 4: Weave Tightness vs. Drape

| Weave Type | Pilling Resistance | Drape | Breathability | Fabric Weight |
|------------|--------------------|-------|---------------|---------------|
| Plain (tight) | ✅ Best | ❌ Stiff | ❌ Reduced | Heavier |
| Twill (moderate) | ⚠️ Moderate | ⚠️ Moderate | ⚠️ Moderate | Moderate |
| Satin (loose) | ❌ Worst | ✅ Excellent | ✅ Excellent | Lighter |

**Citation:** *"The plain weave pilled less than the twill"* — *12—Pilling of Fabrics*, Journal of the Textile Institute Transactions, 1956

**Application guidance:**
- **Plain weave:** Workwear, uniforms, outerwear — durability priority
- **Twill weave:** Trousers, jackets, casual wear — balanced
- **Satin weave:** Blouses, lingerie, linings — appearance priority

---

## Trade-off 5: Yarn Twist vs. Production Speed

| Twist Level | Pilling Resistance | Yarn Strength | Production Speed | Cost |
|-------------|--------------------|---------------|------------------|------|
| Low (400-600 tpm) | ❌ Poor | ✅ Lower | ✅ Faster | ✅ Lower |
| Optimal (700-900 tpm) | ✅ Good | ✅ Higher | ⚠️ Moderate | ⚠️ Moderate |
| High (900-1200 tpm) | ✅ Very good | ✅ Highest | ❌ Slower | ❌ Higher |

**Citation:** *"Yarns with low twist and high hairiness are more prone to pilling"* — *12—Pilling of Fabrics*, 1956

**Economic trade-off:** Higher twist increases manufacturing time and energy consumption. For the Seeker's carbon neutrality goal, optimal twist (not maximum) is recommended.

---

## Trade-off 6: Mechanical vs. Chemical Finishing (Sustainability)

| Treatment Type | Pilling Reduction | CO2 Impact | Water Use | Chemical Discharge |
|----------------|-------------------|------------|-----------|---------------------|
| Mechanical (singeing, shearing) | 10-15% | Low | None | None |
| Chemical (resin, anti-pilling) | 20-35% | Medium | High | Formaldehyde, VOCs |

**Seeker context:** The company aims to be *"the first European textile industry to achieve operational carbon neutrality by 2027."*

**Recommendation:** Prioritize mechanical finishing (singeing, shearing) despite lower pilling reduction. Chemical treatments should be used only when mechanical methods cannot achieve Class 3.

---

## Trade-off Summary Table (Quick Reference)

| Priority | Recommended Parameter Settings | Trade-offs Accepted |
|----------|------------------------------|---------------------|
| **Maximum durability** | Polyester 80%+, twist 900 tpm, plain weave, resin finish | Stiff hand-feel, higher cost, reduced breathability |
| **Balanced (recommended)** | Polyester 60-70%, twist 750-800 tpm, twill weave, singeing + anti-pilling | Moderate trade-offs across all dimensions |
| **Maximum comfort** | Polyester 40-50%, twist 700 tpm, satin weave, no chemical finishes | Lower pilling resistance, may not reach Class 3 |

---

## Implementation in Simulator

The simulator displays these trade-offs in real-time as the user adjusts parameters:

- **Durability bar:** Derived directly from predicted pilling class
- **Hand-feel bar:** Calculated from weave type + finishing treatments
- **Cost estimate:** Sum of finishing treatment costs vs. baseline (no finishing)

**Formula sources:**
- Durability: Linear mapping from pilling class (1→10%, 5→95%)
- Hand-feel: Baseline 70, adjusted by weave (±5-10) and finishing (±10-15)
- Cost: Finishing treatment costs summed, baseline defined as "no finishing"

---

## Limitations and Assumptions

| Assumption | Justification | Label |
|------------|---------------|-------|
| Cost estimates are relative, not absolute | Actual costs vary by mill, scale, location | `[ASSUMPTION]` |
| Hand-feel is approximated from weave + finishing | Actual hand-feel depends on many factors not in model | `[ASSUMPTION]` |
| Durability = pilling resistance | Durability has multiple dimensions (tear strength, abrasion, etc.) | `[ASSUMPTION]` |
| Mechanical finishing has zero CO2 impact | Significant reduction, but not zero | `[ASSUMPTION]` |

---

## Citations

1. **Wang Lu, S.S. Wang, S.J. Du, Y.Y. Liu, S.D. Li.** *A STUDY OF PILLING CHARACTERS AND ITS AFFECTING FACTORS OF RABBIT HAIR-WOOL WOVEN FABRIC.* Journal of Textile Research, 1994.

2. **Anonymous.** *12—Pilling of Fabrics.* Journal of the Textile Institute Transactions, 1956.

3. **ISO 12945-2:2000.** *Textiles — Determination of fabric propensity to surface fuzzing and to pilling — Part 2: Modified Martindale method.*

---

*Document maintained as part of AION Constitutional Stack — Textile Pilling Simulator v1.0*
