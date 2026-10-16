import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { CalculationResult, PlannerConfig } from '../types/planner.ts';

interface BottomLineSummaryProps {
  result: CalculationResult;
  config: PlannerConfig;
}

export const BottomLineSummary: React.FC<BottomLineSummaryProps> = ({
  result,
  config,
}) => {
  // Aggregate primary study destinations
  const uniqueDests = Array.from(new Set(config.children.map((c) => c.destination)));
  const destinationText =
    uniqueDests.length === 1
      ? uniqueDests[0]
      : uniqueDests.join(' & ');

  const isFunded = result.isFullyFunded;
  const fundingPct = result.fundingPercentage;

  // Formatting helper with guaranteed commas
  const fmt = (num: number) => Math.round(num).toLocaleString('en-US');

  return (
    <div className="space-y-6">
      {/* Primary Bottom Line Executive Banner */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border transition-all ${
          isFunded
            ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800/60'
            : 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-200 dark:border-amber-800/60'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  isFunded ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>Bottom Line Assessment</span>
              <span aria-hidden="true">·</span>
              <span>Financial Security Blueprint</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-balance leading-snug">
              To fund your {config.children.length > 1 ? `${config.children.length} children's` : "child's"} education in{' '}
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{destinationText}</span>, you need an initial lump sum of{' '}
              <span className="font-mono tabular-nums text-slate-900 dark:text-white">
                {config.currency} {fmt(result.requiredAdditionalLumpsumWithCurrentSIP)}
              </span>{' '}
              along with your monthly SIP of{' '}
              <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                {config.currency} {fmt(config.monthlySIP)}
              </span>
              {config.sipType === 'stepup' ? ` (stepping up ${config.sipStepUpPercent}% annually)` : ''}.
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isFunded ? (
                <>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Reassuring progress:
                  </span>{' '}
                  Your current disciplined strategy projects a fully funded education milestone with a residual surplus of{' '}
                  <span className="font-mono font-semibold tabular-nums">
                    {config.currency} {fmt(result.projectedFinalResidualCorpus)}
                  </span>
                  . Your existing corpus is working effectively alongside compounding returns.
                </>
              ) : (
                <>
                  <span className="font-semibold text-amber-700 dark:text-amber-300">
                    Target gap identified:
                  </span>{' '}
                  To comfortably cover all tuition and overseas living expenses without taking on debt, consider either introducing an initial lump sum of{' '}
                  <span className="font-mono font-semibold tabular-nums">
                    {config.currency} {fmt(result.requiredAdditionalLumpsumWithCurrentSIP)}
                  </span>{' '}
                  today, or adjusting your initial monthly SIP to{' '}
                  <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {config.currency} {fmt(result.requiredMonthlySIPWithExistingCorpus)}/month
                  </span>
                  .
                </>
              )}
            </p>
          </div>

          {/* Funding Health Score Gauge */}
          <div className="shrink-0 flex flex-col items-center justify-center p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs min-w-44 text-center">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {isFunded ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              )}
              <span>Goal Readiness</span>
            </div>
            <div className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white my-1">
              {fundingPct}%
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-500 ${
                  isFunded ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, fundingPct)}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {isFunded ? 'Fully on track' : 'Actionable adjustments'}
            </span>
          </div>
        </div>
      </div>

      {/* Explanatory Educational Callouts: Staggered Drawdown & Glide Path */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Staggered Drawdown Math */}
        <div className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Staggered Drawdown Advantage
                </h3>
                <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  Save {config.currency} {fmt(result.staggeredSavingsTotal)}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Traditional planners mistakenly calculate all 6 years of college costs as a single upfront lump sum at age 18. Instead, your money remains safely invested at{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {config.drawdownReturnPercent}% fixed return
                </span>{' '}
                during university, withdrawing only what is needed per semester. This staggered model reduces your required Day 1 target corpus by{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                  {config.currency} {fmt(result.staggeredSavingsTotal)}
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: 3-Year Glide Path Protection */}
        <div className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  3-Year Glide Path Protection
                </h3>
                <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                  De-risks at Age 15
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                To prevent sudden market downturns right before matriculation, the algorithm automatically transitions your asset allocation from{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {config.accumulationReturnPercent}% growth
                </span>{' '}
                to a balanced{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {config.glidePathReturnPercent}% capital preservation rate
                </span>{' '}
                exactly {config.glidePathYears} years before your child turns 18. This safeguards accrued gains while keeping pace with inflation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
