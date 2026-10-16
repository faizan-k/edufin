/**
 * Comprehensive Unit & Scenario Test Suite for EduFund (index.html)
 * 
 * Usage:
 *   node test-planner.js
 * 
 * Tests 11 comprehensive scenarios:
 *  1. Baseline Multi-Child Default Setup & Solvers
 *  2. Fully Funded Plan via Increased Initial Funding (Lump Sum)
 *  3. Fully Funded Plan via Increased Monthly SIP
 *  4. 100% Upfront Lump Sum (Zero Monthly SIP)
 *  5. Step-Up SIP (+3%/year annual increment)
 *  6. Single Child Plan Validation
 *  7. Multi-Destination Inflation & Duration Presets (UAE, US, UK, Canada, India)
 *  8. Conservative Strategy (8% return) vs Aggressive (12% return)
 *  9. Currency Formatting Across All Supported Currencies
 * 10. Edge Cases (Zero Corpus, Zero SIP, Newborn, Age 17, 0-yr Postgrad, 60% Aid)
 * 11. Headless Google Chrome Real DOM & UI Execution
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI Color Codes for clean console reporting
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${colors.green}✓ PASS:${colors.reset} ${message}`);
  } else {
    failedTests++;
    console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${message}`);
    if (details) console.error(`    ${colors.yellow}Details: ${details}${colors.reset}`);
  }
}

function assertApprox(actual, expected, tolerance = 1.0, message) {
  const diff = Math.abs(actual - expected);
  const pass = diff <= tolerance;
  assert(pass, `${message} (Expected ~${expected}, Got ${actual})`, `Difference: ${diff}`);
}

// 1. Load index.html and extract the core script
const htmlPath = path.resolve(__dirname, 'index.html');
if (!fs.existsSync(htmlPath)) {
  console.error(`Error: index.html not found at ${htmlPath}`);
  process.exit(1);
}

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const scriptMatches = htmlContent.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi);
if (!scriptMatches || scriptMatches.length < 2) {
  console.error('Error: Could not find main script tag in index.html');
  process.exit(1);
}

// Extract JS engine from index.html (the second script block containing state and calculate)
const mainScriptCode = scriptMatches[1].replace(/<script[^>]*>|<\/script>/gi, '');

// Create an isolated sandbox execution context
function createEngineContext(customState = {}) {
  const domElements = {};
  const mockDocument = {
    getElementById: (id) => {
      if (!domElements[id]) {
        domElements[id] = {
          id,
          value: '',
          textContent: '',
          innerHTML: '',
          className: '',
          classList: { add: () => {}, remove: () => {} },
          setAttribute: () => {},
          getContext: () => ({})
        };
      }
      return domElements[id];
    },
    documentElement: { classList: { add: () => {}, remove: () => {} } }
  };

  const mockWindow = {
    matchMedia: () => ({ matches: false }),
    print: () => {},
    lucide: { createIcons: () => {} }
  };

  const mockChart = function() {
    return { destroy: () => {} };
  };

  // Build sandboxed runner
  const runner = new Function(
    'document',
    'window',
    'Chart',
    'customOverrides',
    'domElements',
    `
    ${mainScriptCode}
    if (customOverrides) {
      if (customOverrides.currency) state.currency = customOverrides.currency;
      if (customOverrides.children) state.children = JSON.parse(JSON.stringify(customOverrides.children));
      if (customOverrides.existingCorpus !== undefined) state.existingCorpus = customOverrides.existingCorpus;
      if (customOverrides.monthlySIP !== undefined) state.monthlySIP = customOverrides.monthlySIP;
      if (customOverrides.sipType) state.sipType = customOverrides.sipType;
      if (customOverrides.strategy) {
        state.strategy = customOverrides.strategy;
        state.accumulationReturnPercent = customOverrides.strategy === 'Conservative' ? 8 : 12;
      }
      if (customOverrides.accumulationReturnPercent !== undefined) {
        state.accumulationReturnPercent = customOverrides.accumulationReturnPercent;
      }
    }
    const calcResult = calculate();
    return { state, PRESETS, CURRENCY_SYMBOLS, calculate, formatMoney, calcResult, domElements };
    `
  );

  return runner(mockDocument, mockWindow, mockChart, customState, domElements);
}

console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}  EduFund: Comprehensive Test Suite for index.html   ${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

// ----------------------------------------------------
// Scenario 1: Baseline Multi-Child Default Setup & Solvers
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 1: Baseline Multi-Child Default Setup & Solvers${colors.reset}`);
{
  const ctx = createEngineContext();
  const res = ctx.calcResult;

  assert(res.childSummaries.length === 2, 'Two default children initialized (Ayaan & Zara)');
  assert(res.allFlows.length === 12, '12 total annual withdrawals (6 years Ayaan + 6 years Zara)');
  
  // Ayaan target at age 18 in UAE:
  // 4 yrs grad @ 80k + 2 yrs postgrad @ 100k, 5% infl, 15% scholarship, 5% drawdown discount
  const ayaanSummary = res.childSummaries.find(c => c.child.name === 'Ayaan');
  assertApprox(ayaanSummary.childTarget, 719971, 2, 'Ayaan target corpus at age 18 matches ~719,971');
  
  // Zara target at age 18 in US:
  // 4 yrs grad @ 110k + 2 yrs postgrad @ 130k, 8% infl, 1.3x living, 20% scholarship, 5% drawdown
  const zaraSummary = res.childSummaries.find(c => c.child.name === 'Zara');
  assertApprox(zaraSummary.childTarget, 2133719, 2, 'Zara target corpus at age 18 matches ~2,133,719');

  // Combined totals
  assertApprox(res.totalCorpusNeededAt18, 2853690, 3, 'Total target corpus needed at matriculation is AED 2,853,690');
  assertApprox(res.totalCrudeSum, 3264882, 3, 'Total future costs (crude sum) is AED 3,264,882');
  assertApprox(res.staggeredSavingsTotal, 411191, 3, 'Staggered drawdown compounding saves AED 411,191');

  // Solvers
  assertApprox(res.reqInitialLumpsumWithCurrentSIP, 473282, 5, 'Required initial lump sum at current SIP (AED 4,500/mo) is ~AED 473,282');
  assertApprox(res.initialLumpSumGap, 323282, 5, 'Initial lump sum gap today is ~AED 323,282 (473,282 - 150,000)');
  assertApprox(res.reqMonthlySIPWithExistingCorpus, 7575, 5, 'Required monthly SIP at current corpus (AED 150k) is ~AED 7,575/mo');
  assertApprox(res.monthlySIPGap, 3075, 5, 'Monthly SIP gap is ~AED 3,075/mo (7,575 - 4,500)');
  assertApprox(res.reqLumpSumWithZeroSIP, 946450, 10, '100% upfront lump sum today (zero SIP) is ~AED 946,450');

  // Current plan deficit detection
  assert(res.isFullyFunded === false, 'Current plan correctly flagged as NOT fully funded (gap identified)');
  assert(res.minBalanceInTimeline < 0, 'Simulation records negative balance during college withdrawals (-AED 1.23M)');
}
console.log('');

// ----------------------------------------------------
// Scenario 2: Fully Funded Plan via Increased Initial Funding
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 2: Fully Funded Plan via Increased Initial Funding (Lump Sum)${colors.reset}`);
{
  const ctx = createEngineContext({ existingCorpus: 500000, monthlySIP: 4500 });
  const res = ctx.calcResult;

  assert(res.isFullyFunded === true, 'Plan is fully funded when initial corpus is raised to AED 500,000');
  assert(res.minBalanceInTimeline >= 0, 'Portfolio balance never drops below zero throughout entire education timeline');
  assert(res.finalBalance > 0, 'Portfolio ends with a positive residual surplus at graduation');
  assert(res.initialLumpSumGap === 0, 'Initial lump sum gap is 0 (fully covered)');
}
console.log('');

// ----------------------------------------------------
// Scenario 3: Fully Funded Plan via Increased Monthly SIP
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 3: Fully Funded Plan via Increased Monthly SIP${colors.reset}`);
{
  const ctx = createEngineContext({ existingCorpus: 150000, monthlySIP: 8000 });
  const res = ctx.calcResult;

  assert(res.isFullyFunded === true, 'Plan is fully funded when monthly SIP is raised to AED 8,000/mo');
  assert(res.minBalanceInTimeline >= 0, 'Minimum balance across all years remains positive');
  assert(res.monthlySIPGap === 0, 'Monthly SIP gap is 0 (fully covered)');
  assert(res.finalBalance > 0, `Residual surplus of ~AED ${Math.round(res.finalBalance).toLocaleString()} at degree completion`);
}
console.log('');

// ----------------------------------------------------
// Scenario 4: 100% Upfront Lump Sum (Zero Ongoing SIP)
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 4: 100% Upfront Lump Sum (Zero Ongoing Monthly SIP)${colors.reset}`);
{
  const ctx = createEngineContext({ existingCorpus: 950000, monthlySIP: 0 });
  const res = ctx.calcResult;

  assert(res.isFullyFunded === true, 'Lump sum of AED 950,000 fully funds entire education with zero ongoing SIP');
  assert(res.minBalanceInTimeline >= 0, 'Portfolio stays solvent every single year without monthly cash injection');
}
console.log('');

// ----------------------------------------------------
// Scenario 5: Step-Up SIP (+3%/year Annual Increment)
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 5: Step-Up SIP (+3%/year Increment)${colors.reset}`);
{
  const simpleCtx = createEngineContext({ sipType: 'simple', existingCorpus: 150000, monthlySIP: 4500 });
  const stepupCtx = createEngineContext({ sipType: 'stepup', existingCorpus: 150000, monthlySIP: 4500 });

  assert(
    stepupCtx.calcResult.reqMonthlySIPWithExistingCorpus < simpleCtx.calcResult.reqMonthlySIPWithExistingCorpus,
    'Step-up SIP lowers the initial monthly contribution required due to 3%/yr compounding increments'
  );
  assert(
    stepupCtx.calcResult.minBalanceInTimeline > simpleCtx.calcResult.minBalanceInTimeline,
    'Step-up SIP yields superior portfolio health compared to flat SIP'
  );
}
console.log('');

// ----------------------------------------------------
// Scenario 6: Single Child Plan Validation
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 6: Single Child Plan Validation${colors.reset}`);
{
  const singleChild = [
    {
      id: 'c1',
      name: 'Ayaan',
      currentAge: 8,
      collegeStartAge: 18,
      gradYears: 4,
      postGradYears: 2,
      gradAnnualCostToday: 80000,
      postGradAnnualCostToday: 100000,
      destination: 'UAE',
      scholarshipPercent: 15
    }
  ];

  const ctx = createEngineContext({ children: singleChild, existingCorpus: 150000, monthlySIP: 4500 });
  const res = ctx.calcResult;

  assert(res.childSummaries.length === 1, 'Only 1 child in summary');
  assertApprox(res.totalCorpusNeededAt18, 719971, 2, 'Total target required for single child is AED 719,971');
  assertApprox(res.totalCrudeSum, 822413, 2, 'Total crude gross sum is ~AED 822,413');
  assert(res.isFullyFunded === true, 'Existing AED 150k + AED 4.5k/mo fully funds a single child with large surplus');
  assert(res.finalBalance > 1000000, 'Projected graduation surplus exceeds AED 1,000,000');
}
console.log('');

// ----------------------------------------------------
// Scenario 7: Multi-Destination Inflation & Duration Presets
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 7: Multi-Destination Inflation & Duration Presets${colors.reset}`);
{
  const testDest = (dest, expectedInfl, expectedMult, expectedYears) => {
    const child = [{
      id: 'cd',
      name: 'Test',
      currentAge: 10,
      collegeStartAge: 18,
      gradYears: expectedYears,
      postGradYears: 0,
      gradAnnualCostToday: 100000,
      postGradAnnualCostToday: 0,
      destination: dest,
      scholarshipPercent: 0
    }];
    const ctx = createEngineContext({ children: child });
    const cs = ctx.calcResult.childSummaries[0];
    assert(cs.preset.infl === expectedInfl, `${dest} inflation preset is ${(expectedInfl * 100)}%`);
    assert(cs.preset.mult === expectedMult, `${dest} living expense multiplier is ${expectedMult}x`);
    assert(ctx.calcResult.allFlows.length === expectedYears, `${dest} degree length models ${expectedYears} annual cash flows`);
  };

  testDest('UAE', 0.05, 1.0, 4);
  testDest('US', 0.08, 1.3, 4);
  testDest('UK', 0.06, 1.3, 3);
  testDest('Canada', 0.06, 1.3, 4);
  testDest('India', 0.09, 1.0, 4);
}
console.log('');

// ----------------------------------------------------
// Scenario 8: Conservative Strategy (8%) vs Aggressive (12%)
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 8: Conservative Strategy (8%) vs Aggressive (12%)${colors.reset}`);
{
  const aggCtx = createEngineContext({ strategy: 'Aggressive' });
  const consCtx = createEngineContext({ strategy: 'Conservative' });

  assert(
    consCtx.calcResult.reqInitialLumpsumWithCurrentSIP > aggCtx.calcResult.reqInitialLumpsumWithCurrentSIP,
    'Conservative strategy (8%) requires more initial funding than Aggressive (12%) due to lower compound growth'
  );
  assert(
    consCtx.calcResult.reqMonthlySIPWithExistingCorpus > aggCtx.calcResult.reqMonthlySIPWithExistingCorpus,
    'Conservative strategy (8%) requires higher monthly SIP contributions'
  );
}
console.log('');

// ----------------------------------------------------
// Scenario 9: Currency Formatting
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 9: Currency Formatting Across All Supported Currencies${colors.reset}`);
{
  const currencies = ['AED', 'USD', 'EUR', 'GBP', 'INR', 'CAD'];
  currencies.forEach(curr => {
    const ctx = createEngineContext({ currency: curr });
    const formatted = ctx.formatMoney(123456);
    const symbol = ctx.CURRENCY_SYMBOLS[curr];
    assert(
      formatted.startsWith(symbol) && formatted.includes('123,456'),
      `Currency ${curr} formats correctly with symbol "${symbol} 123,456"`
    );
  });
}
console.log('');

// ----------------------------------------------------
// Scenario 10: Edge Cases & Boundary Conditions
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 10: Edge Cases & Boundary Conditions${colors.reset}`);
{
  // Edge Case A: Zero existing corpus
  const zeroCorpusCtx = createEngineContext({ existingCorpus: 0, monthlySIP: 4500 });
  assert(zeroCorpusCtx.calcResult.totalCorpusNeededAt18 > 0, 'Handles zero initial corpus without crashing');
  assert(zeroCorpusCtx.calcResult.reqMonthlySIPWithExistingCorpus > 0, 'Solves required monthly SIP starting from zero corpus');

  // Edge Case B: Newborn child (Age 0, 18 years to matriculation)
  const newbornChild = [{
    id: 'nb',
    name: 'Newborn',
    currentAge: 0,
    collegeStartAge: 18,
    gradYears: 4,
    postGradYears: 0,
    gradAnnualCostToday: 50000,
    postGradAnnualCostToday: 0,
    destination: 'UAE',
    scholarshipPercent: 0
  }];
  const nbCtx = createEngineContext({ children: newbornChild });
  assert(nbCtx.calcResult.childSummaries[0].yearsTo18 === 18, 'Correctly handles newborn child with 18 years horizon');

  // Edge Case C: Child age 17 (1 year to matriculation, already in glide path)
  const teenChild = [{
    id: 'teen',
    name: 'Teen',
    currentAge: 17,
    collegeStartAge: 18,
    gradYears: 4,
    postGradYears: 0,
    gradAnnualCostToday: 50000,
    postGradAnnualCostToday: 0,
    destination: 'UAE',
    scholarshipPercent: 0
  }];
  const teenCtx = createEngineContext({ children: teenChild });
  assert(teenCtx.calcResult.childSummaries[0].yearsTo18 === 1, 'Correctly handles age 17 child with 1 year to matriculation');

  // Edge Case D: High scholarship (60%)
  const aidChild = [{
    id: 'aid',
    name: 'Scholar',
    currentAge: 10,
    collegeStartAge: 18,
    gradYears: 4,
    postGradYears: 0,
    gradAnnualCostToday: 100000,
    postGradAnnualCostToday: 0,
    destination: 'UAE',
    scholarshipPercent: 60
  }];
  const aidCtx = createEngineContext({ children: aidChild });
  const flow0 = aidCtx.calcResult.allFlows[0];
  assertApprox(flow0.net, flow0.grossCost * 0.4, 0.5, 'Applies 60% scholarship discount correctly (net = 40% of gross)');

  // Edge Case E: 0-year post-graduation
  const noPostgradChild = [{
    id: 'nopost',
    name: 'UndergradOnly',
    currentAge: 10,
    collegeStartAge: 18,
    gradYears: 4,
    postGradYears: 0,
    gradAnnualCostToday: 80000,
    postGradAnnualCostToday: 0,
    destination: 'UAE',
    scholarshipPercent: 10
  }];
  const noPostCtx = createEngineContext({ children: noPostgradChild });
  assert(noPostCtx.calcResult.allFlows.length === 4, 'Models exactly 4 undergraduate withdrawals when postgrad duration is 0');
}
console.log('');

// ----------------------------------------------------
// Scenario 11: Headless Google Chrome Real DOM Verification
// ----------------------------------------------------
console.log(`${colors.bold}Scenario 11: Real Google Chrome Headless Execution${colors.reset}`);
{
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.CHROME_PATH
  ].filter(Boolean);

  let chromeExe = chromePaths.find(p => fs.existsSync(p));

  if (!chromeExe) {
    console.log(`  ${colors.yellow}⚠ Chrome executable not found in default paths, skipping Chrome headless run.${colors.reset}`);
  } else {
    try {
      const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
      const cmd = `"${chromeExe}" --headless --disable-gpu --run-all-compositor-stages-before-draw --dump-dom "${fileUrl}"`;
      const domHtml = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });

      assert(domHtml.includes('EduFund'), 'Chrome loads brand header "EduFund"');
      assert(domHtml.includes('Ayaan (8y)'), 'Chrome renders Child 1 tab');
      assert(domHtml.includes('Zara (5y)'), 'Chrome renders Child 2 tab');
      assert(domHtml.includes('AED 2,853,690'), 'Chrome calculates and displays Target Corpus "AED 2,853,690"');
      assert(domHtml.includes('AED 473,282'), 'Chrome calculates and displays Initial Funding Needed "AED 473,282"');
      assert(domHtml.includes('AED 7,575/mo'), 'Chrome calculates and displays Required Monthly SIP "AED 7,575/mo"');
      assert(domHtml.includes('AED 946,450'), 'Chrome displays 100% Upfront Lump Sum "AED 946,450"');
      assert(domHtml.includes('Funding Gap: AED 1,237,505 Shortfall'), 'Chrome renders Funding Gap Pill with exact deficit');
      assert(domHtml.includes('Option A: Increase Initial Funding'), 'Chrome renders actionable Option A solution');
      assert(domHtml.includes('Option B: Increase Monthly SIP'), 'Chrome renders actionable Option B solution');
      assert(domHtml.includes('Graduation Yr 1'), 'Chrome populates withdrawal breakdown table rows');
      assert(domHtml.includes('growthChart'), 'Chrome initializes interactive growth chart canvas');
      assert(!domHtml.includes('SCRIPT ERROR'), 'Zero JavaScript or runtime errors detected in Chrome');
    } catch (err) {
      assert(false, 'Chrome headless execution completed without fatal errors', err.message);
    }
  }
}
console.log('');

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);
console.log(`${colors.bold}Test Summary:${colors.reset}`);
console.log(`  Total Tests Run : ${totalTests}`);
console.log(`  ${colors.green}Passed          : ${passedTests}${colors.reset}`);
console.log(`  ${failedTests === 0 ? colors.green : colors.red}Failed          : ${failedTests}${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log(`${colors.bold}${colors.green}ALL UNIT AND INTEGRATION SCENARIOS PASSED!${colors.reset}\n`);
  process.exit(0);
}
