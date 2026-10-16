import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateChildPlan,
  getCompoundingFactorToYear,
  calculateFullEducationPlan,
} from './calculator.ts';
import type { PlannerConfig, ChildInput } from '../types/planner.ts';

test('getCompoundingFactorToYear handles accumulation and 3-year glide path', () => {
  // Case 1: 0 years
  assert.equal(getCompoundingFactorToYear(0, 0.12, 0.07, 3), 1.0);

  // Case 2: 2 years (within glide path <= 3)
  const factor2 = getCompoundingFactorToYear(2, 0.12, 0.07, 3);
  assert.ok(Math.abs(factor2 - Math.pow(1.07, 2)) < 1e-6);

  // Case 3: 5 years (2 years at 12% accumulation, 3 years at 7% glide path)
  const factor5 = getCompoundingFactorToYear(5, 0.12, 0.07, 3);
  const expected5 = Math.pow(1.12, 2) * Math.pow(1.07, 3);
  assert.ok(Math.abs(factor5 - expected5) < 1e-6);
});

test('calculateChildPlan correctly applies destination inflation and multiplier', () => {
  const child: ChildInput = {
    id: 'c1',
    name: 'Ayaan',
    currentAge: 14,
    collegeStartAge: 18,
    gradYears: 4,
    postGradYears: 2,
    gradAnnualCostToday: 100000,
    postGradAnnualCostToday: 120000,
    destination: 'US', // 8% inflation, 1.3 multiplier
    scholarshipPercent: 20, // 20% scholarship
  };

  const config: PlannerConfig = {
    currency: 'AED',
    children: [child],
    existingCorpus: 50000,
    monthlySIP: 2000,
    sipType: 'simple',
    sipStepUpPercent: 3,
    strategy: 'Aggressive',
    accumulationReturnPercent: 12,
    glidePathReturnPercent: 7,
    drawdownReturnPercent: 5,
    glidePathYears: 3,
  };

  const plan = calculateChildPlan(child, config);

  // Years to college = 18 - 14 = 4 years
  assert.equal(plan.yearsToCollege, 4);
  assert.equal(plan.inflationRate, 0.08);
  assert.equal(plan.destinationMultiplier, 1.3);

  // Year 1 of college is 4 years from today:
  // Gross cost = 100,000 * (1.08)^4 * 1.3
  const expectedGrossYear1 = 100000 * Math.pow(1.08, 4) * 1.3;
  const expectedNetYear1 = expectedGrossYear1 * 0.8; // 20% scholarship
  assert.ok(Math.abs(plan.yearlyCashFlows[0].grossCost - expectedGrossYear1) < 1.0);
  assert.ok(Math.abs(plan.yearlyCashFlows[0].netWithdrawal - expectedNetYear1) < 1.0);

  // Staggered drawdown should require LESS corpus at age 18 than crude sum of all withdrawals
  assert.ok(plan.targetCorpusAt18 < plan.crudeSumAt18);
  assert.ok(plan.staggeredDrawdownSavings > 0);
});

test('UK degree defaults to 3-year graduation and 6% inflation', () => {
  const child: ChildInput = {
    id: 'uk-child',
    name: 'Liam',
    currentAge: 10,
    collegeStartAge: 18,
    gradYears: 3,
    postGradYears: 1,
    gradAnnualCostToday: 90000,
    postGradAnnualCostToday: 110000,
    destination: 'UK',
    scholarshipPercent: 0,
  };

  const config: PlannerConfig = {
    currency: 'GBP',
    children: [child],
    existingCorpus: 40000,
    monthlySIP: 1500,
    sipType: 'simple',
    sipStepUpPercent: 3,
    strategy: 'Conservative',
    accumulationReturnPercent: 8,
    glidePathReturnPercent: 7,
    drawdownReturnPercent: 5,
    glidePathYears: 3,
  };

  const plan = calculateChildPlan(child, config);
  assert.equal(plan.inflationRate, 0.06);
  assert.equal(plan.destinationMultiplier, 1.3);
  assert.equal(plan.yearlyCashFlows.length, 4); // 3 grad + 1 postgrad
  assert.equal(plan.yearlyCashFlows.filter((f) => f.stage === 'Graduation').length, 3);
  assert.equal(plan.yearlyCashFlows.filter((f) => f.stage === 'Post-Graduation').length, 1);
});

test('multi-child family scenario calculates combined goals and step-up SIP', () => {
  const children: ChildInput[] = [
    {
      id: 'c1',
      name: 'Rohan',
      currentAge: 8,
      collegeStartAge: 18,
      gradYears: 4,
      postGradYears: 2,
      gradAnnualCostToday: 70000,
      postGradAnnualCostToday: 90000,
      destination: 'UAE',
      scholarshipPercent: 10,
    },
    {
      id: 'c2',
      name: 'Maya',
      currentAge: 5,
      collegeStartAge: 18,
      gradYears: 4,
      postGradYears: 2,
      gradAnnualCostToday: 100000,
      postGradAnnualCostToday: 120000,
      destination: 'Canada',
      scholarshipPercent: 15,
    },
  ];

  const config: PlannerConfig = {
    currency: 'AED',
    children,
    existingCorpus: 150000,
    monthlySIP: 5000,
    sipType: 'stepup',
    sipStepUpPercent: 3,
    strategy: 'Aggressive',
    accumulationReturnPercent: 12,
    glidePathReturnPercent: 7,
    drawdownReturnPercent: 5,
    glidePathYears: 3,
  };

  const result = calculateFullEducationPlan(config);

  assert.equal(result.childSummaries.length, 2);
  assert.ok(result.totalTargetCorpusAtCollege > 0);
  assert.ok(result.staggeredSavingsTotal > 0);
  assert.ok(result.yearlyTimeline.length >= 15);
  // Verify milestones contains entries for both children
  const namesInMilestones = new Set(result.milestones.map((m) => m.childName).filter(Boolean));
  assert.ok(namesInMilestones.has('Rohan'));
  assert.ok(namesInMilestones.has('Maya'));
});
