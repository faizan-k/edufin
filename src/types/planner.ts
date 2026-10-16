export type Destination = 'UAE' | 'US' | 'UK' | 'Canada' | 'India' | 'Custom';

export type InvestmentStrategy = 'Conservative' | 'Aggressive' | 'Custom';

export type SipType = 'simple' | 'stepup';

export interface DestinationConfig {
  name: string;
  defaultInflation: number; // e.g. 0.05 for 5%
  defaultMultiplier: number; // 1.0 or 1.3
  recommendedGradYears: number; // UK: 3, US: 4, etc.
  description: string;
}

export const DESTINATION_PRESETS: Record<Destination, DestinationConfig> = {
  UAE: {
    name: 'UAE (Local)',
    defaultInflation: 0.05,
    defaultMultiplier: 1.0,
    recommendedGradYears: 4,
    description: 'Local universities (Dubai, Abu Dhabi, Sharjah). Baseline living expenses.',
  },
  US: {
    name: 'United States',
    defaultInflation: 0.08,
    defaultMultiplier: 1.3,
    recommendedGradYears: 4,
    description: 'US Ivy League & state universities. Includes 30% overseas living & flights premium.',
  },
  UK: {
    name: 'United Kingdom',
    defaultInflation: 0.06,
    defaultMultiplier: 1.3,
    recommendedGradYears: 3,
    description: 'UK 3-year bachelor degree structure with 30% overseas living allowance.',
  },
  Canada: {
    name: 'Canada',
    defaultInflation: 0.06,
    defaultMultiplier: 1.3,
    recommendedGradYears: 4,
    description: 'Canadian public institutions with 30% living expense and travel multiplier.',
  },
  India: {
    name: 'India',
    defaultInflation: 0.09,
    defaultMultiplier: 1.0,
    recommendedGradYears: 4,
    description: 'Premier Indian institutes (IITs, IIMs, BITS, private universities).',
  },
  Custom: {
    name: 'Custom Destination',
    defaultInflation: 0.06,
    defaultMultiplier: 1.15,
    recommendedGradYears: 4,
    description: 'Custom inflation, living multiplier, and degree duration.',
  },
};

export interface ChildInput {
  id: string;
  name: string;
  currentAge: number;
  collegeStartAge: number;
  gradYears: number;
  postGradYears: number;
  gradAnnualCostToday: number;
  postGradAnnualCostToday: number;
  destination: Destination;
  inflationOverride?: number;
  multiplierOverride?: number;
  scholarshipPercent: number; // e.g. 15 for 15%
}

export interface PlannerConfig {
  currency: string;
  children: ChildInput[];
  existingCorpus: number;
  monthlySIP: number;
  sipType: SipType;
  sipStepUpPercent: number; // e.g. 3 for 3%
  strategy: InvestmentStrategy;
  accumulationReturnPercent: number; // e.g. 12 or 8
  glidePathReturnPercent: number; // e.g. 7
  drawdownReturnPercent: number; // e.g. 5
  glidePathYears: number; // e.g. 3
}

export interface EducationYearCashFlow {
  yearIndex: number; // Year from today (e.g. 10)
  calendarYear: number;
  childAge: number;
  stage: 'Graduation' | 'Post-Graduation';
  stageYear: number; // Year 1, 2, 3...
  grossCost: number;
  scholarshipAmount: number;
  netWithdrawal: number;
  discountedTo18: number;
}

export interface ChildPlanSummary {
  child: ChildInput;
  yearsToCollege: number;
  inflationRate: number;
  destinationMultiplier: number;
  totalGrossCost: number;
  totalScholarshipAid: number;
  totalNetOutflow: number;
  targetCorpusAt18: number;
  crudeSumAt18: number;
  staggeredDrawdownSavings: number;
  yearlyCashFlows: EducationYearCashFlow[];
}

export interface YearlyPortfolioPoint {
  yearFromToday: number;
  calendarYear: number;
  childrenAges: { name: string; age: number; status: 'school' | 'glide_path' | 'college' | 'graduated' }[];
  portfolioStartingBalance: number;
  annualSIPContributed: number;
  annualNetGrowth: number;
  annualWithdrawal: number;
  portfolioEndingBalance: number;
  targetDrawdownBalanceNeeded?: number;
  applicableReturnRate: number;
}

export interface MilestoneItem {
  yearFromToday: number;
  calendarYear: number;
  title: string;
  childName?: string;
  type: 'contribution' | 'glide_path' | 'college_start' | 'graduation' | 'postgrad_finish';
  description: string;
  projectedPortfolio: number;
  isCompleted?: boolean;
}

export interface CalculationResult {
  childSummaries: ChildPlanSummary[];
  totalTargetCorpusAtCollege: number;
  crudeSumAllChildren: number;
  staggeredSavingsTotal: number;
  
  // Future Value of Existing Corpus
  existingCorpusCompounded: number;
  
  // Gap analysis
  netCorpusGap: number;
  
  // Required lumpsum today with zero SIP
  requiredLumpsumTodayWithoutSIP: number;
  
  // Required initial monthly SIP (given existing corpus)
  requiredMonthlySIPWithExistingCorpus: number;
  
  // Required additional lump sum today alongside current SIP
  requiredAdditionalLumpsumWithCurrentSIP: number;
  
  // Projected total portfolio at end of college years or horizon
  projectedPeakCorpus: number;
  projectedFinalResidualCorpus: number;
  isFullyFunded: boolean;
  fundingPercentage: number;
  
  // Projected yearly trajectory
  yearlyTimeline: YearlyPortfolioPoint[];
  milestones: MilestoneItem[];
}
