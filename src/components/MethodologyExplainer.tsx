import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Globe2,
  PieChart,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const MethodologyExplainer: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs transition-colors space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Financial Governance</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
          How Your Money Works For You
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Mathematically sound, empathetic financial modeling built on three pillars of portfolio management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>01. Staggered Drawdown</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Tuition Compounding In College
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Parents often worry they need all 4–6 years of university tuition sitting as idle cash on day one of freshman year. In our planner, money slated for later semesters remains in safe debt/fixed income earning 5% XIRR. This staggering typically saves parents 12% to 20% compared to a crude lump-sum requirement.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>02. 3-Year Glide Path</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Volatility Insulation at Age 15
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Market corrections right before high school graduation can derail college dreams. Exactly 3 years before your child turns 18, our model shifts returns from aggressive accumulation (12%) to a balanced preservation rate (7%). Your gains are locked in, ensuring predictability without sacrificing inflation resilience.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Globe2 className="w-4 h-4" />
            <span>03. Macro Destination Economics</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Living Premiums & Country Inflation
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Higher education inflation outpaces consumer CPI. The US compounds at 8% with an overseas 1.3x multiplier for housing and transatlantic flights; local UAE institutions operate at 5% inflation; the UK reflects a standard 3-year bachelor model with 6% inflation.
          </p>
        </div>
      </div>
    </div>
  );
};
