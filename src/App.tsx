import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  PiggyBank,
  Download,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { BottomLineSummary } from './components/BottomLineSummary.tsx';
import { ChildInputsCard } from './components/ChildInputsCard.tsx';
import { InvestmentInputsCard } from './components/InvestmentInputsCard.tsx';
import { GrowthChart } from './components/GrowthChart.tsx';
import { ChildBreakdownTable } from './components/ChildBreakdownTable.tsx';
import { MilestonesTimeline } from './components/MilestonesTimeline.tsx';
import { MethodologyExplainer } from './components/MethodologyExplainer.tsx';
import type { PlannerConfig, ChildInput } from './types/planner.ts';
import { DESTINATION_PRESETS } from './types/planner.ts';
import { calculateFullEducationPlan } from './utils/calculator.ts';
import { generateStandaloneHtml } from './utils/generateStandaloneHtml.ts';

const INITIAL_CHILDREN: ChildInput[] = [
  {
    id: 'child-1',
    name: 'Ayaan',
    currentAge: 8,
    collegeStartAge: 18,
    gradYears: 4,
    postGradYears: 2,
    gradAnnualCostToday: 80000,
    postGradAnnualCostToday: 100000,
    destination: 'UAE',
    scholarshipPercent: 15,
  },
  {
    id: 'child-2',
    name: 'Zara',
    currentAge: 5,
    collegeStartAge: 18,
    gradYears: 4,
    postGradYears: 2,
    gradAnnualCostToday: 110000,
    postGradAnnualCostToday: 130000,
    destination: 'US',
    scholarshipPercent: 20,
  },
];

const INITIAL_CONFIG: PlannerConfig = {
  currency: 'AED',
  children: INITIAL_CHILDREN,
  existingCorpus: 150000,
  monthlySIP: 4500,
  sipType: 'simple',
  sipStepUpPercent: 3,
  strategy: 'Aggressive',
  accumulationReturnPercent: 12,
  glidePathReturnPercent: 7,
  drawdownReturnPercent: 5,
  glidePathYears: 3,
};

export default function App() {
  const [config, setConfig] = useState<PlannerConfig>(INITIAL_CONFIG);
  const [selectedChildId, setSelectedChildId] = useState<string>(INITIAL_CHILDREN[0].id);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  // Sync dark class on <html> document element for smooth theme transitions
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle updates to config
  const handleUpdateConfig = (updates: Partial<PlannerConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Handle child operations
  const handleUpdateChild = (childId: string, updates: Partial<ChildInput>) => {
    setConfig((prev) => ({
      ...prev,
      children: prev.children.map((c) => (c.id === childId ? { ...c, ...updates } : c)),
    }));
  };

  const handleAddChild = () => {
    if (config.children.length >= 3) return;
    const newId = `child-${Date.now()}`;
    const newChild: ChildInput = {
      id: newId,
      name: `Child ${config.children.length + 1}`,
      currentAge: 3,
      collegeStartAge: 18,
      gradYears: 4,
      postGradYears: 2,
      gradAnnualCostToday: 85000,
      postGradAnnualCostToday: 105000,
      destination: 'UK',
      scholarshipPercent: 10,
    };
    setConfig((prev) => ({
      ...prev,
      children: [...prev.children, newChild],
    }));
    setSelectedChildId(newId);
  };

  const handleRemoveChild = (childId: string) => {
    if (config.children.length <= 1) return;
    const updated = config.children.filter((c) => c.id !== childId);
    setConfig((prev) => ({ ...prev, children: updated }));
    if (selectedChildId === childId) {
      setSelectedChildId(updated[0].id);
    }
  };

  // Pure calculations
  const calculationResult = useMemo(() => {
    return calculateFullEducationPlan(config);
  }, [config]);

  // Export standalone single index.html
  const handleExportStandaloneHtml = () => {
    const htmlContent = generateStandaloneHtml(config);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'edufund-planner-index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Bar Navigation */}
      <Navbar
        currency={config.currency}
        onCurrencyChange={(curr) => handleUpdateConfig({ currency: curr })}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onExportStandaloneHtml={handleExportStandaloneHtml}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Editorial Hero Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
            <span>Children's Higher Education Planner</span>
            <span aria-hidden="true">·</span>
            <span>Glide Path Allocation</span>
            <span aria-hidden="true">·</span>
            <span>Staggered Drawdown Math</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance leading-tight">
            Plan, Protect, and Compound Your Children's University Fund
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Take guesswork out of graduation and post-graduation planning. Model multi-destination inflation, factor in overseas living premiums, and leverage staggered drawdown compounding with automatic 3-year volatility protection.
          </p>

          {/* Key Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Children Planned</span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {config.children.length} {config.children.length > 1 ? 'Children' : 'Child'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Target Corpus at Age 18</span>
              <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
                {config.currency} {Math.round(calculationResult.totalTargetCorpusAtCollege).toLocaleString('en-US')}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Drawdown Compounding Savings</span>
              <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5 tabular-nums">
                +{config.currency} {Math.round(calculationResult.staggeredSavingsTotal).toLocaleString('en-US')}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Active Strategy</span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {config.strategy} ({config.accumulationReturnPercent}%)
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Bottom Line Executive Summary */}
        <section aria-labelledby="bottom-line-heading">
          <h2 id="bottom-line-heading" className="sr-only">Bottom Line Plan</h2>
          <BottomLineSummary result={calculationResult} config={config} />
        </section>

        {/* Section 2: Interactive Input Cards (2-Column Grid) */}
        <section id="planner-inputs" aria-labelledby="planner-inputs-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="planner-inputs-heading" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Interactive Planning Parameters
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Sliders dynamically recalculate all mathematical projections
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Child Details */}
            <ChildInputsCard
              children={config.children}
              selectedChildId={selectedChildId}
              onSelectChild={setSelectedChildId}
              onUpdateChild={handleUpdateChild}
              onAddChild={handleAddChild}
              onRemoveChild={handleRemoveChild}
              currency={config.currency}
            />

            {/* Right: Investment Strategy & Contributions */}
            <InvestmentInputsCard
              config={config}
              onUpdateConfig={handleUpdateConfig}
            />
          </div>
        </section>

        {/* Section 3: Visual Portfolio Growth Chart */}
        <section
          id="growth-projection"
          aria-labelledby="growth-projection-heading"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs transition-colors space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Chart.js Visualization</span>
              </div>
              <h2 id="growth-projection-heading" className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Projected Portfolio Growth vs. College Outflows
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Portfolio Balance
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Invested Capital
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Annual Outflows
              </span>
            </div>
          </div>

          {/* Chart Component */}
          <GrowthChart
            timeline={calculationResult.yearlyTimeline}
            currency={config.currency}
            isDarkMode={isDarkMode}
          />
        </section>

        {/* Section 4: Child-by-Child Breakdown & Cash Flow Schedule */}
        <section id="child-breakdown" aria-labelledby="child-breakdown-heading">
          <h2 id="child-breakdown-heading" className="sr-only">Child Breakdown Table</h2>
          <ChildBreakdownTable result={calculationResult} config={config} />
        </section>

        {/* Section 5: Personalized Milestones */}
        <section id="milestones" aria-labelledby="milestones-heading">
          <h2 id="milestones-heading" className="sr-only">Milestones</h2>
          <MilestonesTimeline
            milestones={calculationResult.milestones}
            currency={config.currency}
          />
        </section>

        {/* Section 6: Methodology & Mathematical Rationale */}
        <section id="methodology" aria-labelledby="methodology-heading">
          <h2 id="methodology-heading" className="sr-only">System Logic</h2>
          <MethodologyExplainer />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">EduFund Planner</span>
            <span aria-hidden="true">·</span>
            <span>Empathetic, financially prudent higher education planning</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleExportStandaloneHtml}
              className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Standalone Single index.html</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Currency: {config.currency}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
