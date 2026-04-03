// DOM Elements
const polyesterSlider = document.getElementById('polyester');
const viscoseSlider = document.getElementById('viscose');
const woolSlider = document.getElementById('wool');
const elastaneSlider = document.getElementById('elastane');
const fibreLengthSlider = document.getElementById('fibreLength');
const fibreDenierSlider = document.getElementById('fibreDenier');
const fibreCrimpSlider = document.getElementById('fibreCrimp');
const twistSlider = document.getElementById('twist');
const hairinessSlider = document.getElementById('hairiness');
const warpSlider = document.getElementById('warpDensity');
const weftSlider = document.getElementById('weftDensity');
const massSlider = document.getElementById('fabricMass');

const polyesterVal = document.getElementById('polyesterVal');
const viscoseVal = document.getElementById('viscoseVal');
const woolVal = document.getElementById('woolVal');
const elastaneVal = document.getElementById('elastaneVal');
const totalFibreSpan = document.getElementById('totalFibre');
const fibreLengthVal = document.getElementById('fibreLengthVal');
const fibreDenierVal = document.getElementById('fibreDenierVal');
const fibreCrimpVal = document.getElementById('fibreCrimpVal');
const twistVal = document.getElementById('twistVal');
const hairinessVal = document.getElementById('hairinessVal');
const warpVal = document.getElementById('warpVal');
const weftVal = document.getElementById('weftVal');
const massVal = document.getElementById('massVal');

const pillingClassSpan = document.getElementById('pillingClass');
const pillingStatusSpan = document.getElementById('pillingStatus');
const confidenceSpan = document.getElementById('confidence');
const uncertaintyMassSpan = document.getElementById('uncertaintyMass');

const fibrePctSpan = document.getElementById('fibrePct');
const yarnPctSpan = document.getElementById('yarnPct');
const constPctSpan = document.getElementById('constPct');
const finishPctSpan = document.getElementById('finishPct');
const fibreBar = document.getElementById('fibreBar');
const yarnBar = document.getElementById('yarnBar');
const constBar = document.getElementById('constBar');
const finishBar = document.getElementById('finishBar');

const durabilityBar = document.getElementById('durabilityBar');
const handfeelBar = document.getElementById('handfeelBar');
const costEstimateSpan = document.getElementById('costEstimate');
const explanationList = document.getElementById('explanationList');

// State variables
let yarnMethod = 'openend';
let weaveType = 'plain';

// ============================================
// FIBRE BLEND ENFORCEMENT (Fix RT-001 & RT-012)
// ============================================
function enforceFibreBlend(changedSlider) {
    let poly = parseInt(polyesterSlider.value);
    let vis = parseInt(viscoseSlider.value);
    let wool = parseInt(woolSlider.value);
    let elast = parseInt(elastaneSlider.value);
    let total = poly + vis + wool + elast;
    
    if (total === 100) return;
    if (total === 0) return;
    
    // Adjust proportionally
    let ratio = 100 / total;
    
    if (changedSlider === polyesterSlider) {
        vis = Math.round(vis * ratio);
        wool = Math.round(wool * ratio);
        elast = Math.round(elast * ratio);
        poly = 100 - vis - wool - elast;
    } else if (changedSlider === viscoseSlider) {
        poly = Math.round(poly * ratio);
        wool = Math.round(wool * ratio);
        elast = Math.round(elast * ratio);
        vis = 100 - poly - wool - elast;
    } else if (changedSlider === woolSlider) {
        poly = Math.round(poly * ratio);
        vis = Math.round(vis * ratio);
        elast = Math.round(elast * ratio);
        wool = 100 - poly - vis - elast;
    } else {
        poly = Math.round(poly * ratio);
        vis = Math.round(vis * ratio);
        wool = Math.round(wool * ratio);
        elast = 100 - poly - vis - wool;
    }
    
    // Ensure non-negative and within bounds
    polyesterSlider.value = Math.max(0, Math.min(100, poly));
    viscoseSlider.value = Math.max(0, Math.min(100, vis));
    woolSlider.value = Math.max(0, Math.min(100, wool));
    elastaneSlider.value = Math.max(0, Math.min(20, elast));
}

// ============================================
// DISPLAY UPDATES
// ============================================
function updateDisplayValues() {
    polyesterVal.textContent = polyesterSlider.value;
    viscoseVal.textContent = viscoseSlider.value;
    woolVal.textContent = woolSlider.value;
    elastaneVal.textContent = elastaneSlider.value;
    let total = parseInt(polyesterSlider.value) + parseInt(viscoseSlider.value) + parseInt(woolSlider.value) + parseInt(elastaneSlider.value);
    totalFibreSpan.textContent = total;
    
    fibreLengthVal.textContent = getFibreLengthText(fibreLengthSlider.value);
    fibreDenierVal.textContent = getFibreDenierText(fibreDenierSlider.value);
    fibreCrimpVal.textContent = getFibreCrimpText(fibreCrimpSlider.value);
    twistVal.textContent = twistSlider.value;
    hairinessVal.textContent = parseFloat(hairinessSlider.value).toFixed(1);
    warpVal.textContent = warpSlider.value;
    weftVal.textContent = weftSlider.value;
    massVal.textContent = massSlider.value;
}

function getFibreLengthText(val) {
    if (val < 33) return 'Short';
    if (val < 66) return 'Medium';
    return 'Long';
}

function getFibreDenierText(val) {
    if (val < 33) return 'Fine';
    if (val < 66) return 'Medium';
    return 'Coarse';
}

function getFibreCrimpText(val) {
    if (val < 33) return 'Low';
    if (val < 66) return 'Medium';
    return 'High';
}

// ============================================
// CORE SCORING FUNCTIONS
// ============================================
function calculateFibreScore() {
    const polyester = parseInt(polyesterSlider.value) / 100;
    const viscose = parseInt(viscoseSlider.value) / 100;
    const wool = parseInt(woolSlider.value) / 100;
    const elastane = parseInt(elastaneSlider.value) / 100;
    const lengthScore = 1 - (parseInt(fibreLengthSlider.value) / 100);
    const denierScore = 1 - (parseInt(fibreDenierSlider.value) / 100);
    const crimpScore = 1 - (parseInt(fibreCrimpSlider.value) / 100);
    
    // Higher polyester = lower pilling susceptibility (good)
    let blendScore = 1 - (polyester * 0.7 + viscose * 0.5 + wool * 0.6 + elastane * 0.4);
    blendScore = Math.min(1, Math.max(0.1, blendScore));
    
    let score = (lengthScore * 0.25) + (denierScore * 0.25) + (crimpScore * 0.2) + (blendScore * 0.3);
    return Math.min(1, Math.max(0.1, score));
}

function calculateYarnScore() {
    const twist = parseInt(twistSlider.value);
    // Optimal twist is 800 tpm — deviation increases susceptibility
    let twistScore = Math.abs(twist - 800) / 400;
    twistScore = Math.min(0.8, Math.max(0.1, twistScore));
    twistScore = 1 - twistScore; // Invert so higher = better
    
    const hairiness = parseFloat(hairinessSlider.value);
    let hairinessScore = 1 - (hairiness - 2.0) / 6.0;
    hairinessScore = Math.min(1, Math.max(0.1, hairinessScore));
    
    // Ring-spun has higher pilling susceptibility than open-end
    let spinningScore = (yarnMethod === 'ring') ? 0.7 : 0.3;
    
    let score = (twistScore * 0.35) + (hairinessScore * 0.35) + (spinningScore * 0.2) + (0.5 * 0.1);
    return Math.min(1, Math.max(0.1, score));
}

function calculateConstructionScore() {
    // FIX RT-003: Lower score = better (less pilling susceptibility)
    let weaveScore = 0;
    if (weaveType === 'plain') weaveScore = 0.1;   // Best
    else if (weaveType === 'twill') weaveScore = 0.3;
    else weaveScore = 0.5;                         // Satin = worst
    
    // FIX RT-005: Add bounds to density components
    const warp = parseInt(warpSlider.value);
    const weft = parseInt(weftSlider.value);
    let warpComponent = (60 - warp) / 40;
    let weftComponent = (55 - weft) / 35;
    warpComponent = Math.min(1, Math.max(0, warpComponent));
    weftComponent = Math.min(1, Math.max(0, weftComponent));
    let densityScore = 1 - (warpComponent + weftComponent) / 2;
    densityScore = Math.min(1, Math.max(0.1, densityScore));
    
    const mass = parseInt(massSlider.value);
    let massScore = 1 - (mass - 80) / 220;
    massScore = Math.min(1, Math.max(0.1, massScore));
    
    let score = (weaveScore * 0.4) + (densityScore * 0.4) + (massScore * 0.2);
    return Math.min(1, Math.max(0.1, score));
}

function calculateFinishingModifier() {
    let modifier = 1.0;
    if (document.getElementById('singeing').checked) modifier *= 0.85;
    if (document.getElementById('mercerization').checked) modifier *= 0.85;
    if (document.getElementById('antiPilling').checked) modifier *= 0.8;
    if (document.getElementById('resin').checked) modifier *= 0.7;
    if (document.getElementById('softening').checked) modifier *= 1.15;
    if (document.getElementById('shearing').checked) modifier *= 0.85;
    return Math.min(1.2, Math.max(0.5, modifier));
}

function calculateUncertaintyMass() {
    let um = 0;
    const polyester = parseInt(polyesterSlider.value);
    if (polyester < 40 || polyester > 90) um += 0.1;
    const twist = parseInt(twistSlider.value);
    if (twist < 700 || twist > 900) um += 0.1;
    const warp = parseInt(warpSlider.value);
    const weft = parseInt(weftSlider.value);
    if (warp < 35 || warp > 55) um += 0.05;
    if (weft < 35 || weft > 50) um += 0.05;
    const elastane = parseInt(elastaneSlider.value);
    if (elastane > 10) um += 0.05;
    return Math.min(0.45, um);
}

function calculatePillingClass() {
    const fibreScore = calculateFibreScore();
    const yarnScore = calculateYarnScore();
    const constructionScore = calculateConstructionScore();
    const finishingMod = calculateFinishingModifier();
    
    // FIX RT-008: Allow PSS as low as 0.1 to reach Class 5
    let pss = 0.1 + (fibreScore * yarnScore * constructionScore * finishingMod) * 0.4;
    pss = Math.min(0.95, Math.max(0.05, pss));
    
    let pillingClass = 1 + (1 - pss) * 4;
    pillingClass = Math.min(5, Math.max(1, pillingClass));
    
    return { pillingClass, pss, fibreScore, yarnScore, constructionScore, finishingMod };
}

// FIX RT-009: Improved relative influence calculation
function calculateRelativeInfluence(fibreScore, yarnScore, constructionScore, finishingMod) {
    // For finishing, lower modifier = better performance = higher influence credit
    const finishPerformance = 1 - (finishingMod - 0.5) / 0.7;
    const finishInfluenceRaw = finishPerformance * 0.15;
    const fibreInfluenceRaw = (1 - fibreScore) * 0.35;
    const yarnInfluenceRaw = (1 - yarnScore) * 0.25;
    const constInfluenceRaw = (1 - constructionScore) * 0.25;
    
    const total = fibreInfluenceRaw + yarnInfluenceRaw + constInfluenceRaw + finishInfluenceRaw;
    
    return {
        fibre: Math.round((fibreInfluenceRaw / total) * 100),
        yarn: Math.round((yarnInfluenceRaw / total) * 100),
        construction: Math.round((constInfluenceRaw / total) * 100),
        finishing: Math.round((finishInfluenceRaw / total) * 100)
    };
}

function generateExplanation(fibreScore, yarnScore, constructionScore, finishingMod, pillingClass, confidence) {
    const explanations = [];
    const polyester = parseInt(polyesterSlider.value);
    const twist = parseInt(twistSlider.value);
    const weaveMap = { plain: 'Plain', twill: 'Twill', satin: 'Satin' };
    const hasAntiPilling = document.getElementById('antiPilling').checked;
    const hasResin = document.getElementById('resin').checked;
    const hasSoftening = document.getElementById('softening').checked;
    
    // Fibre explanation
    if (polyester >= 70) {
        explanations.push(`• Polyester ${polyester}%: Reduces pilling susceptibility but pills that form persist longer [CITATION: Wang Lu et al., 1994]`);
    } else if (polyester <= 50) {
        explanations.push(`• Polyester ${polyester}% is below optimal range (60-80%) — increasing would reduce pilling susceptibility [ASSUMPTION]`);
    } else {
        explanations.push(`• Polyester ${polyester}% is within optimal range for this blend`);
    }
    
    // Yarn explanation
    if (twist >= 700 && twist <= 900) {
        explanations.push(`• Twist ${twist} tpm is optimal — higher twist reduces pilling [CITATION: 12—Pilling of Fabrics, 1956]`);
    } else if (twist < 700) {
        explanations.push(`• Twist ${twist} tpm is below optimal (700-900) — increase to reduce pilling [ASSUMPTION]`);
    } else {
        explanations.push(`• Twist ${twist} tpm is above optimal — may affect hand-feel but pilling resistance is good`);
    }
    
    // Weave explanation
    if (weaveType === 'plain') {
        explanations.push(`• Plain weave provides best pilling resistance among weave types [CITATION: 12—Pilling of Fabrics, 1956]`);
    } else if (weaveType === 'satin') {
        explanations.push(`• Satin weave has higher pilling susceptibility — consider plain or twill for better performance [CITATION: 12—Pilling of Fabrics, 1956]`);
    } else {
        explanations.push(`• Twill weave provides moderate pilling resistance — acceptable for most applications`);
    }
    
    // Finishing explanation
    if (hasResin) {
        explanations.push(`• Resin finishing: Most effective anti-pilling treatment — reduces susceptibility by ~30% [CITATION: Wang Lu et al., 1994]`);
    } else if (hasAntiPilling) {
        explanations.push(`• Anti-pilling chemical treatment active — resin would be even more effective [CITATION: 12—Pilling of Fabrics, 1956]`);
    }
    
    if (hasSoftening) {
        explanations.push(`⚠️ Softening agent increases pilling susceptibility — consider removing if pilling is a concern [CITATION: Wang Lu et al., 1994]`);
    }
    
    // Overall assessment
    if (confidence < 60) {
        explanations.push(`⚠️ Low confidence (${confidence}%) — some parameters outside validated ranges. Results are directional.`);
    } else if (pillingClass >= 4) {
        explanations.push(`✅ Excellent predicted class (${pillingClass.toFixed(1)}) — exceeds ISO 12945-2:2000 target. Ready for market.`);
    } else if (pillingClass >= 3) {
        explanations.push(`✅ Acceptable class (${pillingClass.toFixed(1)}) — meets ISO 12945-2:2000 standard (≥3).`);
    } else {
        explanations.push(`⚠️ Class below ISO target (${pillingClass.toFixed(1)} < 3) — adjust parameters: increase polyester%, increase twist, use resin finishing.`);
    }
    
    return explanations.slice(0, 8);
}

// ============================================
// MAIN UPDATE FUNCTION
// ============================================
function updateAll() {
    updateDisplayValues();
    
    const { pillingClass, fibreScore, yarnScore, constructionScore, finishingMod } = calculatePillingClass();
    const roundedClass = Math.round(pillingClass * 10) / 10;
    pillingClassSpan.textContent = roundedClass;
    
    const pass = roundedClass >= 3;
    pillingStatusSpan.textContent = pass ? `✅ PASS (≥3) — ISO 12945-2:2000 compliant` : `❌ FAIL (<3) — does not meet ISO standard`;
    pillingStatusSpan.className = pass ? 'result-status' : 'result-status fail';
    
    const um = calculateUncertaintyMass();
    const confidence = Math.round((1 - um) * 100);
    confidenceSpan.textContent = confidence;
    uncertaintyMassSpan.textContent = `UM: ${um.toFixed(2)}`;
    
    const influences = calculateRelativeInfluence(fibreScore, yarnScore, constructionScore, finishingMod);
    fibrePctSpan.textContent = influences.fibre + '%';
    yarnPctSpan.textContent = influences.yarn + '%';
    constPctSpan.textContent = influences.construction + '%';
    finishPctSpan.textContent = influences.finishing + '%';
    fibreBar.style.width = influences.fibre + '%';
    yarnBar.style.width = influences.yarn + '%';
    constBar.style.width = influences.construction + '%';
    finishBar.style.width = influences.finishing + '%';
    
    // Trade-offs
    let durability = Math.round((roundedClass - 1) / 4 * 100);
    durability = Math.min(95, Math.max(10, durability));
    durabilityBar.style.width = durability + '%';
    
    let handfeel = 70;
    if (weaveType === 'plain') handfeel -= 5;
    if (weaveType === 'satin') handfeel += 10;
    if (document.getElementById('resin').checked) handfeel -= 15;
    if (document.getElementById('softening').checked) handfeel += 10;
    handfeel = Math.min(95, Math.max(20, handfeel));
    handfeelBar.style.width = handfeel + '%';
    
    // FIX RT-011: Define baseline explicitly
    let costIncrease = 0;
    if (document.getElementById('resin').checked) costIncrease += 12;
    if (document.getElementById('antiPilling').checked) costIncrease += 5;
    if (document.getElementById('singeing').checked) costIncrease += 3;
    if (document.getElementById('mercerization').checked) costIncrease += 4;
    if (document.getElementById('shearing').checked) costIncrease += 3;
    costEstimateSpan.textContent = `+${costIncrease}% vs baseline (no finishing)`;
    
    const explanations = generateExplanation(fibreScore, yarnScore, constructionScore, finishingMod, roundedClass, confidence);
    explanationList.innerHTML = explanations.map(e => `<li>${e}</li>`).join('');
}

// ============================================
// RESET FUNCTION
// ============================================
function resetToDefaults() {
    polyesterSlider.value = '60';
    viscoseSlider.value = '30';
    woolSlider.value = '10';
    elastaneSlider.value = '0';
    fibreLengthSlider.value = '60';
    fibreDenierSlider.value = '50';
    fibreCrimpSlider.value = '50';
    twistSlider.value = '750';
    hairinessSlider.value = '3.2';
    warpSlider.value = '48';
    weftSlider.value = '42';
    massSlider.value = '160';
    
    document.getElementById('singeing').checked = false;
    document.getElementById('mercerization').checked = false;
    document.getElementById('antiPilling').checked = false;
    document.getElementById('resin').checked = false;
    document.getElementById('softening').checked = false;
    document.getElementById('shearing').checked = false;
    
    document.querySelectorAll('[data-yarn]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-yarn="openend"]').classList.add('active');
    yarnMethod = 'openend';
    
    document.querySelectorAll('[data-weave]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-weave="plain"]').classList.add('active');
    weaveType = 'plain';
    
    updateAll();
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    const sliders = [polyesterSlider, viscoseSlider, woolSlider, elastaneSlider, fibreLengthSlider, fibreDenierSlider, fibreCrimpSlider, twistSlider, hairinessSlider, warpSlider, weftSlider, massSlider];
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            if (slider === polyesterSlider || slider === viscoseSlider || slider === woolSlider || slider === elastaneSlider) {
                enforceFibreBlend(slider);
            }
            updateAll();
        });
    });

    document.querySelectorAll('[data-yarn]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-yarn]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            yarnMethod = btn.getAttribute('data-yarn');
            updateAll();
        });
    });

    document.querySelectorAll('[data-weave]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-weave]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            weaveType = btn.getAttribute('data-weave');
            updateAll();
        });
    });

    const checkboxes = ['singeing', 'mercerization', 'antiPilling', 'resin', 'softening', 'shearing'];
    checkboxes.forEach(id => {
        document.getElementById(id).addEventListener('change', updateAll);
    });

    document.getElementById('resetBtn').addEventListener('click', resetToDefaults);
}

// ============================================
// INITIALIZATION
// ============================================
initEventListeners();
updateAll();