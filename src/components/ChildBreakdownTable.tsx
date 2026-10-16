import React, { useState } from 'react';
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingDown,
  Sparkles,
  Info,
} from 'lucide-react';
import type { CalculationResult, PlannerConfig } from '../types/planner.ts';

interface ChildBreakdownTableProps {
  result: CalculationResult;
  config: PlannerConfig;
}

export const ChildBreakdownTable: React.FC<ChildBreakdownTableProps> = ({
  result,
  config,
}) => {
  const [expandedChildId, setExpandedChildId] = useState<string | null>(
    result.childSummaries[0]?.child.id || null
  );

  const fmt = (num: number) => Math.round(num).toLocaleString('en-US');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs transition-colors space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Mathematical Breakdown</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Child-by-Child Staggered Drawdown Plan
          </h2>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing {result.childSummaries.length} education goal{result.childSummaries.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* High-Level Comparison Table Across All Children */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <th className="py-2.5 px-3 font-semibold">Child</th>
              <th className="py-2.5 px-3 font-semibold">Destination</th>
              <th className="py-2.5 px-3 font-semibold">Age / Years to 18</th>
              <th className="py-2.5 px-3 font-semibold text-right">Gross Inflated Outflow</th>
              <th className="py-2.5 px-3 font-semibold text-right">Scholarship Aid</th>
              <th className="py-2.5 px-3 font-semibold text-right">Crude Lump Sum</th>
              <th className="py-2.5 px-3 font-semibold text-right text-emerald-700 dark:text-emerald-400">
                Staggered Target Corpus (Age 18)
              </th>
              <th className="py-2.5 px-3 font-semibold text-right text-blue-600 dark:text-blue-400">
                Savings via Compounding
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {result.childSummaries.map((summary) => {
              const isExpanded = expandedChildId === summary.child.id;
              return (
                <tr
                  key={summary.child.id}
                  onClick={() =>
                    setExpandedChildId(isExpanded ? null : summary.child.id)
                  }
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 text-slate-900 dark:text-white font-bold flex items-center gap-2">
                    {summary.child.name || 'Unnamed Child'}
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {summary.child.destination}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                    {summary.child.currentAge}y ({summary.yearsToCollege}y to college)
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {config.currency} {fmt(summary.totalGrossCost)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    -{config.currency} {fmt(summary.totalScholarshipAid)} ({summary.child.scholarshipPercent}%)
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500 line-through">
                    {config.currency} {fmt(summary.crudeSumAt18)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {config.currency} {fmt(summary.targetCorpusAt18)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                    +{config.currency} {fmt(summary.staggeredDrawdownSavings)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold bg-slate-50/70 dark:bg-slate-800/40">
              <td className="py-3 px-3 text-slate-900 dark:text-white" colSpan={3}>
                Total Combined Higher Education Requirement
              </td>
              <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">
                {config.currency}{' '}
                {fmt(result.childSummaries.reduce((acc, c) => acc + c.totalGrossCost, 0))}
              </td>
              <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                -{config.currency}{' '}
                {fmt(result.childSummaries.reduce((acc, c) => acc + c.totalScholarshipAid, 0))}
              </td>
              <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500 line-through">
                {config.currency} {fmt(result.crudeSumAllChildren)}
              </td>
              <td className="py-3 px-3 text-right font-mono font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">
                {config.currency} {fmt(result.totalTargetCorpusAtCollege)}
              </td>
              <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-blue-600 dark:text-blue-400">
                +{config.currency} {fmt(result.staggeredSavingsTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Expanded Year-by-Year Cash Flow Schedule for Selected Child */}
      {result.childSummaries.map((summary) => {
        if (expandedChildId !== summary.child.id) return null;

        return (
          <div
            key={`detail-${summary.child.id}`}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Annual Withdrawal Schedule: {summary.child.name}</span>
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    ({summary.child.destination} · {(summary.inflationRate * 100).toFixed(0)}% annual inflation)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Each college year withdrawal is discounted to age 18 at {config.drawdownReturnPercent}% safe drawdown return.
                </p>
              </div>
              <div className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg self-start">
                Target Needed at 18: {config.currency} {fmt(summary.targetCorpusAt18)}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <th className="py-2 px-2 font-semibold">Calendar Year</th>
                    <th className="py-2 px-2 font-semibold">Age</th>
                    <th className="py-2 px-2 font-semibold">Academic Stage</th>
                    <th className="py-2 px-2 font-semibold text-right">Gross Cost</th>
                    <th className="py-2 px-2 font-semibold text-right">Scholarship Credit</th>
                    <th className="py-2 px-2 font-semibold text-right">Net Withdrawal</th>
                    <th className="py-2 px-2 font-semibold text-right text-emerald-700 dark:text-emerald-400">
                      Discounted to Age 18 (at {config.drawdownReturnPercent}%)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {summary.yearlyCashFlows.map((flow) => (
                    <tr key={flow.yearIndex} className="hover:bg-white/60 dark:hover:bg-slate-900/40">
                      <td className="py-2 px-2 font-mono tabular-nums text-slate-900 dark:text-white">
                        {flow.calendarYear} (in {flow.yearIndex} yrs)
                      </td>
                      <td className="py-2 px-2 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        {flow.childAge} yrs
                      </td>
                      <td className="py-2 px-2 font-medium text-slate-700 dark:text-slate-300">
                        {flow.stage} Year {flow.stageYear}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        {config.currency} {fmt(flow.grossCost)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-500">
                        -{config.currency} {fmt(flow.scholarshipAmount)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                        {config.currency} {fmt(flow.netWithdrawal)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                        {config.currency} {fmt(flow.discountedTo18)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
