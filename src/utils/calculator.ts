import type {
  ChildInput,
  ChildPlanSummary,
  CalculationResult,
  EducationYearCashFlow,
  PlannerConfig,
  YearlyPortfolioPoint,
  MilestoneItem,
} from '../types/planner.ts';
import { DESTINATION_PRESETS } from '../types/planner.ts';

/**
 * Calculates inflation-adjusted education costs and staggered drawdown target corpus for a single child.
 */
export function calculateChildPlan(
  child: ChildInput,
  config: PlannerConfig
): ChildPlanSummary {
  const currentCalendarYear = new Date().getFullYear();
  const destPreset = DESTINATION_PRESETS[child.destination] || DESTINATION_PRESETS.UAE;
  const inflationRate =
    child.inflationOverride !== undefined
      ? child.inflationOverride / 100
      : destPreset.defaultInflation;
  const destinationMultiplier =
    child.multiplierOverride !== undefined
      ? child.multiplierOverride
      : destPreset.defaultMultiplier;

  const yearsToCollege = Math.max(0, child.collegeStartAge - child.currentAge);
  const totalYears = child.gradYears + child.postGradYears;
  const drawdownRate = config.drawdownReturnPercent / 100;

  const yearlyCashFlows: EducationYearCashFlow[] = [];
  let totalGrossCost = 0;
  let totalScholarshipAid = 0;
  let totalNetOutflow = 0;
  let targetCorpusAt18 = 0;
  let crudeSumAt18 = 0;

  for (let k = 0; k < totalYears; k++) {
    const isGrad = k < child.gradYears;
    const stage: 'Graduation' | 'Post-Graduation' = isGrad ? 'Graduation' : 'Post-Graduation';
    const stageYear = isGrad ? k + 1 : k - child.gradYears + 1;
    const yearIndex = yearsToCollege + k;
    const calendarYear = currentCalendarYear + yearIndex;
    const childAge = child.currentAge + yearIndex;

    const baseCostToday = isGrad ? child.gradAnnualCostToday : child.postGradAnnualCostToday;
    
    // Inflated cost at the time of withdrawal
    const inflatedAnnualCost = baseCostToday * Math.pow(1 + inflationRate, yearIndex);
    const grossCost = inflatedAnnualCost * destinationMultiplier;
    
    // Scholarship & family cash flow discount
    const scholarshipAmount = grossCost * (child.scholarshipPercent / 100);
    const netWithdrawal = Math.max(0, grossCost - scholarshipAmount);

    // Staggered Drawdown: discount each withdrawal back to age 18 (k=0 is first day of college)
    // k is the number of compounding years between age 18 and this withdrawal year
    const discountFactor = Math.pow(1 + drawdownRate, k);
    const discountedTo18 = netWithdrawal / discountFactor;

    yearlyCashFlows.push({
      yearIndex,
      calendarYear,
      childAge,
      stage,
      stageYear,
      grossCost,
      scholarshipAmount,
      netWithdrawal,
      discountedTo18,
    });

    totalGrossCost += grossCost;
    totalScholarshipAid += scholarshipAmount;
    totalNetOutflow += netWithdrawal;
    targetCorpusAt18 += discountedTo18;
    crudeSumAt18 += netWithdrawal;
  }

  const staggeredDrawdownSavings = Math.max(0, crudeSumAt18 - targetCorpusAt18);

  return {
    child,
    yearsToCollege,
    inflationRate,
    destinationMultiplier,
    totalGrossCost,
    totalScholarshipAid,
    totalNetOutflow,
    targetCorpusAt18,
    crudeSumAt18,
    staggeredDrawdownSavings,
    yearlyCashFlows,
  };
}

/**
 * Calculates compounding factor from today (year 0) to year Y for a child
 * accounting for Accumulation rate and 3-year Glide Path rate (7%).
 */
export function getCompoundingFactorToYear(
  years: number,
  accumulationRate: number,
  glideRate: number,
  glideYears: number = 3
): number {
  if (years <= 0) return 1.0;
  if (years <= glideYears) {
    return Math.pow(1 + glideRate, years);
  }
  const accumYears = years - glideYears;
  return Math.pow(1 + accumulationRate, accumYears) * Math.pow(1 + glideRate, glideYears);
}

/**
 * Evaluates the multi-year portfolio progression and solves for required lump sum & SIP.
 */
export function calculateFullEducationPlan(config: PlannerConfig): CalculationResult {
  const currentCalendarYear = new Date().getFullYear();
  const accumRate = config.accumulationReturnPercent / 100;
  const glideRate = config.glidePathReturnPercent / 100;
  const drawdownRate = config.drawdownReturnPercent / 100;
  const glideYears = config.glidePathYears;

  // 1. Calculate individual child plans
  const childSummaries = config.children.map((child) => calculateChildPlan(child, config));

  const crudeSumAllChildren = childSummaries.reduce((sum, c) => sum + c.crudeSumAt18, 0);
  const staggeredSavingsTotal = childSummaries.reduce((sum, c) => sum + c.staggeredDrawdownSavings, 0);

  // Find max horizon across all children
  let maxHorizon = 0;
  for (const cs of childSummaries) {
    const horizon = cs.yearsToCollege + cs.child.gradYears + cs.child.postGradYears;
    if (horizon > maxHorizon) maxHorizon = horizon;
  }
  // At least 5 years timeline
  maxHorizon = Math.max(maxHorizon, 5);

  // Present value of all net education withdrawals discounted back to Year 0 (today)
  // For each withdrawal at year t, discount using the path-dependent rate from 0 to t
  let totalPVOfOutflows = 0;
  for (const cs of childSummaries) {
    for (const flow of cs.yearlyCashFlows) {
      // Flow occurs at yearIndex t.
      // Compounding discount factor from 0 to t:
      // If t <= yearsToCollege: uses accum + glide
      // If t > yearsToCollege: uses accum + glide to yearsToCollege, then drawdown rate for remainder
      let discountFactor = 1.0;
      if (flow.yearIndex <= cs.yearsToCollege) {
        discountFactor = getCompoundingFactorToYear(flow.yearIndex, accumRate, glideRate, glideYears);
      } else {
        const factorToCollege = getCompoundingFactorToYear(cs.yearsToCollege, accumRate, glideRate, glideYears);
        const drawdownFactor = Math.pow(1 + drawdownRate, flow.yearIndex - cs.yearsToCollege);
        discountFactor = factorToCollege * drawdownFactor;
      }
      totalPVOfOutflows += flow.netWithdrawal / discountFactor;
    }
  }

  // Required Lumpsum Today (if SIP = 0) is simply the PV of all net outflows today!
  const requiredLumpsumTodayWithoutSIP = Math.max(0, totalPVOfOutflows);

  // Existing Corpus compounded value to first college entrance (or average)
  const minYearsToCollege = childSummaries.length > 0
    ? Math.min(...childSummaries.map((c) => c.yearsToCollege))
    : 10;
  const factorToFirstCollege = getCompoundingFactorToYear(minYearsToCollege, accumRate, glideRate, glideYears);
  const existingCorpusCompounded = config.existingCorpus * factorToFirstCollege;

  const totalTargetCorpusAtCollege = childSummaries.reduce((sum, c) => sum + c.targetCorpusAt18, 0);
  const netCorpusGap = Math.max(0, totalTargetCorpusAtCollege - existingCorpusCompounded);

  // 2. Year-by-year timeline simulation with user's selected Monthly SIP and Existing Corpus
  const yearlyTimeline: YearlyPortfolioPoint[] = [];
  let currentBalance = config.existingCorpus;
  let currentMonthlySIP = config.monthlySIP;
  let peakCorpus = config.existingCorpus;

  // Track milestones
  const milestones: MilestoneItem[] = [];

  // Initial milestone
  milestones.push({
    yearFromToday: 0,
    calendarYear: currentCalendarYear,
    title: 'Plan Initiated',
    type: 'contribution',
    description: `Starting with ${config.currency} ${config.existingCorpus.toLocaleString()} existing corpus and ${config.currency} ${config.monthlySIP.toLocaleString()}/mo SIP.`,
    projectedPortfolio: currentBalance,
    isCompleted: true,
  });

  for (let year = 0; year <= maxHorizon; year++) {
    const calendarYear = currentCalendarYear + year;

    // Determine status of each child at this year
    const childrenAges = config.children.map((c) => {
      const ageAtYear = c.currentAge + year;
      const yearsTill18 = c.collegeStartAge - ageAtYear;
      const totalEduDuration = c.gradYears + c.postGradYears;
      let status: 'school' | 'glide_path' | 'college' | 'graduated' = 'school';

      if (ageAtYear >= c.collegeStartAge + totalEduDuration) {
        status = 'graduated';
      } else if (ageAtYear >= c.collegeStartAge) {
        status = 'college';
      } else if (yearsTill18 <= glideYears) {
        status = 'glide_path';
      } else {
        status = 'school';
      }
      return {
        name: c.name,
        age: ageAtYear,
        status,
      };
    });

    // Sum outflows for this year
    let annualWithdrawal = 0;
    for (const cs of childSummaries) {
      const matchFlow = cs.yearlyCashFlows.find((f) => f.yearIndex === year);
      if (matchFlow) {
        annualWithdrawal += matchFlow.netWithdrawal;
      }
    }

    // Determine portfolio return rate for this year (blended based on child statuses)
    // If college ongoing for any child: high liquidity need, drawdown rate
    // If glide path active and no college: 7%
    // If all children in school (>3 yrs to 18): accumulation rate (12% or 8%)
    let activeReturnRate = accumRate;
    const hasCollege = childrenAges.some((ca) => ca.status === 'college');
    const hasGlide = childrenAges.some((ca) => ca.status === 'glide_path');
    const allGraduated = childrenAges.every((ca) => ca.status === 'graduated');

    if (allGraduated) {
      activeReturnRate = drawdownRate;
    } else if (hasCollege) {
      // Blended: drawdown rate on college portion, glide/accum on the rest
      activeReturnRate = drawdownRate;
    } else if (hasGlide) {
      activeReturnRate = glideRate;
    } else {
      activeReturnRate = accumRate;
    }

    // Annual SIP contribution (stops once all children have graduated)
    let annualSIP = 0;
    if (!allGraduated && year < maxHorizon) {
      annualSIP = currentMonthlySIP * 12;
    }

    // Simulation math:
    // Starting balance + monthly contributions compound through year - withdrawals at start/during year
    const startingBalance = currentBalance;
    // Mid-year contribution compounding approximation:
    // SIP adds cash throughout year; withdrawal happens as tuition is billed
    const netInvestment = Math.max(0, startingBalance - annualWithdrawal);
    const growth = (netInvestment + annualSIP * 0.5) * activeReturnRate;
    let endingBalance = netInvestment + annualSIP + growth;
    if (startingBalance < annualWithdrawal) {
      // Underfunded deficit scenario
      endingBalance = Math.max(0, startingBalance + annualSIP - annualWithdrawal);
    }

    yearlyTimeline.push({
      yearFromToday: year,
      calendarYear,
      childrenAges,
      portfolioStartingBalance: startingBalance,
      annualSIPContributed: annualSIP,
      annualNetGrowth: growth,
      annualWithdrawal,
      portfolioEndingBalance: endingBalance,
      applicableReturnRate: activeReturnRate,
    });

    if (endingBalance > peakCorpus) {
      peakCorpus = endingBalance;
    }

    // Check milestone events
    config.children.forEach((c) => {
      const childAge = c.currentAge + year;
      if (childAge === c.collegeStartAge - glideYears && year > 0) {
        milestones.push({
          yearFromToday: year,
          calendarYear,
          title: `${c.name}: 3-Yr Glide Path Shift`,
          childName: c.name,
          type: 'glide_path',
          description: `Portfolio de-risks to 7% blended rate to protect college capital from market swings.`,
          projectedPortfolio: endingBalance,
        });
      }
      if (childAge === c.collegeStartAge && year > 0) {
        milestones.push({
          yearFromToday: year,
          calendarYear,
          title: `${c.name} Starts College in ${c.destination}`,
          childName: c.name,
          type: 'college_start',
          description: `Staggered drawdown begins. Safe 5% fixed-income compounding protects unwithdrawn tuition.`,
          projectedPortfolio: endingBalance,
        });
      }
      if (childAge === c.collegeStartAge + c.gradYears && year > 0) {
        milestones.push({
          yearFromToday: year,
          calendarYear,
          title: `${c.name} Completes Graduation`,
          childName: c.name,
          type: 'graduation',
          description: `Graduation degree funded successfully.${c.postGradYears > 0 ? ' Transitioning to Post-Graduation.' : ''}`,
          projectedPortfolio: endingBalance,
        });
      }
      if (childAge === c.collegeStartAge + c.gradYears + c.postGradYears && c.postGradYears > 0 && year > 0) {
        milestones.push({
          yearFromToday: year,
          calendarYear,
          title: `${c.name} Completes Post-Graduation`,
          childName: c.name,
          type: 'postgrad_finish',
          description: `All higher education goals fulfilled. Education debt-free milestone achieved!`,
          projectedPortfolio: endingBalance,
        });
      }
    });

    // Advance balance and apply step-up SIP for next year
    currentBalance = endingBalance;
    if (config.sipType === 'stepup') {
      currentMonthlySIP *= 1 + config.sipStepUpPercent / 100;
    }
  }

  // Sort milestones chronologically
  milestones.sort((a, b) => a.yearFromToday - b.yearFromToday);

  // 3. Solve for required monthly SIP (assuming existing corpus is preserved)
  // We can solve this with a binary search on initial monthly SIP
  const requiredMonthlySIPWithExistingCorpus = solveRequiredSIP(
    config,
    childSummaries,
    maxHorizon,
    accumRate,
    glideRate,
    drawdownRate,
    glideYears
  );

  // 4. Solve for additional lumpsum required today given user's current SIP
  // If user continues current SIP, how much initial corpus was needed today?
  const requiredInitialLumpSumWithCurrentSIP = solveRequiredInitialLumpsum(
    config,
    childSummaries,
    maxHorizon,
    accumRate,
    glideRate,
    drawdownRate,
    glideYears
  );
  const requiredAdditionalLumpsumWithCurrentSIP = Math.max(
    0,
    requiredInitialLumpSumWithCurrentSIP - config.existingCorpus
  );

  // Funding status
  const finalEndingBalance = yearlyTimeline[yearlyTimeline.length - 1]?.portfolioEndingBalance || 0;
  // Check if portfolio never drops below zero during college withdrawals
  let minBalanceDuringDrawdown = Infinity;
  for (const pt of yearlyTimeline) {
    if (pt.annualWithdrawal > 0 && pt.portfolioEndingBalance < minBalanceDuringDrawdown) {
      minBalanceDuringDrawdown = pt.portfolioEndingBalance;
    }
  }

  // Calculate overall funding percentage based on PV
  // PV of resources = Existing Corpus + PV of current SIP streams
  let pvOfCurrentSIP = 0;
  let simSIP = config.monthlySIP;
  for (let y = 0; y < maxHorizon; y++) {
    // Discount factor to year y + 0.5
    const df = getCompoundingFactorToYear(y, accumRate, glideRate, glideYears);
    pvOfCurrentSIP += (simSIP * 12) / df;
    if (config.sipType === 'stepup') {
      simSIP *= 1 + config.sipStepUpPercent / 100;
    }
  }
  const totalPVResources = config.existingCorpus + pvOfCurrentSIP;
  const fundingPercentage = totalPVOfOutflows > 0
    ? Math.min(100, Math.round((totalPVResources / totalPVOfOutflows) * 100))
    : 100;
  const isFullyFunded = fundingPercentage >= 100 || minBalanceDuringDrawdown >= 0;

  return {
    childSummaries,
    totalTargetCorpusAtCollege,
    crudeSumAllChildren,
    staggeredSavingsTotal,
    existingCorpusCompounded,
    netCorpusGap,
    requiredLumpsumTodayWithoutSIP,
    requiredMonthlySIPWithExistingCorpus,
    requiredAdditionalLumpsumWithCurrentSIP,
    projectedPeakCorpus: peakCorpus,
    projectedFinalResidualCorpus: finalEndingBalance,
    isFullyFunded,
    fundingPercentage,
    yearlyTimeline,
    milestones,
  };
}

/**
 * Simulates portfolio trajectory for a given initial corpus and initial monthly SIP.
 * Returns the minimum balance reached across all years.
 */
function simulateTrajectory(
  initialCorpus: number,
  initialSIP: number,
  config: PlannerConfig,
  childSummaries: ChildPlanSummary[],
  maxHorizon: number,
  accumRate: number,
  glideRate: number,
  drawdownRate: number,
  glideYears: number
): { minBalance: number; endingBalance: number } {
  let balance = initialCorpus;
  let currentSIP = initialSIP;
  let minBalance = balance;

  for (let year = 0; year <= maxHorizon; year++) {
    const childrenAges = config.children.map((c) => {
      const ageAtYear = c.currentAge + year;
      const yearsTill18 = c.collegeStartAge - ageAtYear;
      const totalEdu = c.gradYears + c.postGradYears;
      let status: 'school' | 'glide_path' | 'college' | 'graduated' = 'school';
      if (ageAtYear >= c.collegeStartAge + totalEdu) status = 'graduated';
      else if (ageAtYear >= c.collegeStartAge) status = 'college';
      else if (yearsTill18 <= glideYears) status = 'glide_path';
      return { status };
    });

    let annualWithdrawal = 0;
    for (const cs of childSummaries) {
      const matchFlow = cs.yearlyCashFlows.find((f) => f.yearIndex === year);
      if (matchFlow) annualWithdrawal += matchFlow.netWithdrawal;
    }

    const hasCollege = childrenAges.some((ca) => ca.status === 'college');
    const hasGlide = childrenAges.some((ca) => ca.status === 'glide_path');
    const allGraduated = childrenAges.every((ca) => ca.status === 'graduated');

    let activeRate = accumRate;
    if (allGraduated || hasCollege) {
      activeRate = drawdownRate;
    } else if (hasGlide) {
      activeRate = glideRate;
    }

    let annualSIP = 0;
    if (!allGraduated && year < maxHorizon) {
      annualSIP = currentSIP * 12;
    }

    const netInvestment = Math.max(0, balance - annualWithdrawal);
    const growth = (netInvestment + annualSIP * 0.5) * activeRate;
    let endBalance = netInvestment + annualSIP + growth;
    if (balance < annualWithdrawal) {
      endBalance = balance + annualSIP - annualWithdrawal;
    }

    if (endBalance < minBalance) {
      minBalance = endBalance;
    }

    balance = endBalance;
    if (config.sipType === 'stepup') {
      currentSIP *= 1 + config.sipStepUpPercent / 100;
    }
  }

  return { minBalance, endingBalance: balance };
}

/**
 * Solves for the initial monthly SIP needed so that minBalance >= 0.
 */
function solveRequiredSIP(
  config: PlannerConfig,
  childSummaries: ChildPlanSummary[],
  maxHorizon: number,
  accumRate: number,
  glideRate: number,
  drawdownRate: number,
  glideYears: number
): number {
  let low = 0;
  let high = 500000;
  let ans = 0;

  for (let iter = 0; iter < 35; iter++) {
    const mid = (low + high) / 2;
    const { minBalance } = simulateTrajectory(
      config.existingCorpus,
      mid,
      config,
      childSummaries,
      maxHorizon,
      accumRate,
      glideRate,
      drawdownRate,
      glideYears
    );

    if (minBalance >= 0) {
      ans = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.round(ans);
}

/**
 * Solves for the initial lumpsum needed alongside the current monthly SIP.
 */
function solveRequiredInitialLumpsum(
  config: PlannerConfig,
  childSummaries: ChildPlanSummary[],
  maxHorizon: number,
  accumRate: number,
  glideRate: number,
  drawdownRate: number,
  glideYears: number
): number {
  let low = 0;
  let high = 15000000;
  let ans = 0;

  for (let iter = 0; iter < 35; iter++) {
    const mid = (low + high) / 2;
    const { minBalance } = simulateTrajectory(
      mid,
      config.monthlySIP,
      config,
      childSummaries,
      maxHorizon,
      accumRate,
      glideRate,
      drawdownRate,
      glideYears
    );

    if (minBalance >= 0) {
      ans = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.round(ans);
}
