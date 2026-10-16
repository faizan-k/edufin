import React, { useState } from 'react';
import {
  PiggyBank,
  TrendingUp,
  Sliders,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Info,
} from 'lucide-react';
import type { PlannerConfig, InvestmentStrategy, SipType } from '../types/planner.ts';

interface InvestmentInputsCardProps {
  config: PlannerConfig;
  onUpdateConfig: (updates: Partial<PlannerConfig>) => void;
}

export const InvestmentInputsCard: React.FC<InvestmentInputsCardProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleStrategyChange = (strategy: InvestmentStrategy) => {
    if (strategy === 'Aggressive') {
      onUpdateConfig({
        strategy: 'Aggressive',
        accumulationReturnPercent: 12,
        glidePathReturnPercent: 7,
        drawdownReturnPercent: 5,
      });
    } else if (strategy === 'Conservative') {
      onUpdateConfig({
        strategy: 'Conservative',
        accumulationReturnPercent: 8,
        glidePathReturnPercent: 7,
        drawdownReturnPercent: 5,
      });
    } else {
      onUpdateConfig({ strategy: 'Custom' });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs transition-colors space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <PiggyBank className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Savings & Portfolio Capital</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
          Investment Strategy & Contributions
        </h2>
      </div>

      {/* Existing Corpus & Monthly SIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Existing Corpus */}
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label
              htmlFor="existing-corpus-input"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Existing Corpus Saved
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Earmarked funds
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500">{config.currency}</span>
            <input
              id="existing-corpus-input"
              type="number"
              min={0}
              max={5000000}
              step={10000}
              value={config.existingCorpus}
              onChange={(e) =>
                onUpdateConfig({ existingCorpus: Math.max(0, Number(e.target.value)) })
              }
              className="w-full text-sm font-mono font-bold tabular-nums py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <input
            type="range"
            min={0}
            max={1000000}
            step={10000}
            value={config.existingCorpus}
            onChange={(e) => onUpdateConfig({ existingCorpus: Number(e.target.value) })}
            aria-label="Existing corpus slider"
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>0</span>
            <span>250k</span>
            <span>500k</span>
            <span>1M+</span>
          </div>
        </div>

        {/* Current Monthly SIP */}
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label
              htmlFor="monthly-sip-input"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Monthly Investment (SIP)
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Systematic plan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500">{config.currency}</span>
            <input
              id="monthly-sip-input"
              type="number"
              min={0}
              max={100000}
              step={500}
              value={config.monthlySIP}
              onChange={(e) =>
                onUpdateConfig({ monthlySIP: Math.max(0, Number(e.target.value)) })
              }
              className="w-full text-sm font-mono font-bold tabular-nums py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <input
            type="range"
            min={0}
            max={25000}
            step={500}
            value={config.monthlySIP}
            onChange={(e) => onUpdateConfig({ monthlySIP: Number(e.target.value) })}
            aria-label="Monthly SIP slider"
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>0</span>
            <span>5,000</span>
            <span>15,000</span>
            <span>25,000+</span>
          </div>
        </div>
      </div>

      {/* SIP Type Selection: Simple SIP vs Yearly Step-up SIP */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          SIP Cadence Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onUpdateConfig({ sipType: 'simple' })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              config.sipType === 'simple'
                ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-white ring-1 ring-emerald-600'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Simple SIP (Default)</span>
              <span className="text-[11px] font-mono font-medium text-slate-500">Flat Monthly</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Maintains a constant monthly contribution throughout the accumulation horizon.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onUpdateConfig({ sipType: 'stepup' })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              config.sipType === 'stepup'
                ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-white ring-1 ring-emerald-600'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Yearly Step-up SIP</span>
              <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                +{config.sipStepUpPercent}% / yr
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Increases monthly contribution with annual salary raises to accelerate corpus growth.
            </p>
          </button>
        </div>

        {/* Step-up percentage slider (if stepup selected) */}
        {config.sipType === 'stepup' && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                Annual SIP Step-up Rate
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {config.sipStepUpPercent}% per year
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={config.sipStepUpPercent}
              onChange={(e) => onUpdateConfig({ sipStepUpPercent: Number(e.target.value) })}
              aria-label="Annual SIP step-up percentage slider"
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        )}
      </div>

      {/* Investment Strategy: Conservative vs Aggressive */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Investment Strategy (XIRR Returns)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Aggressive */}
          <button
            type="button"
            onClick={() => handleStrategyChange('Aggressive')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              config.strategy === 'Aggressive'
                ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-white ring-1 ring-emerald-600'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Aggressive</span>
              </div>
              <span className="text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                12% XIRR
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              High equity allocation during accumulation. Automatically de-risks to 7% in the 3-year Glide Path window.
            </p>
          </button>

          {/* Conservative */}
          <button
            type="button"
            onClick={() => handleStrategyChange('Conservative')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              config.strategy === 'Conservative'
                ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-white ring-1 ring-emerald-600'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Conservative</span>
              </div>
              <span className="text-xs font-mono font-extrabold text-blue-600 dark:text-blue-400">
                8% XIRR
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Balanced debt & large-cap allocation. Automatically de-risks to 7% Glide Path and 5% Safe Drawdown in college.
            </p>
          </button>
        </div>
      </div>

      {/* Advanced Mode Collapsible Toggle */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Advanced Mode: Manual Rates & Override Capabilities</span>
          </div>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>You can manually override macroeconomic and portfolio phase parameters:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="accum-rate-input"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Accumulation Return (%)
                </label>
                <input
                  id="accum-rate-input"
                  type="number"
                  min={4}
                  max={20}
                  step={0.5}
                  value={config.accumulationReturnPercent}
                  onChange={(e) =>
                    onUpdateConfig({
                      strategy: 'Custom',
                      accumulationReturnPercent: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs font-mono font-bold py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="glide-rate-input"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Glide Path Return (%)
                </label>
                <input
                  id="glide-rate-input"
                  type="number"
                  min={3}
                  max={12}
                  step={0.5}
                  value={config.glidePathReturnPercent}
                  onChange={(e) =>
                    onUpdateConfig({
                      strategy: 'Custom',
                      glidePathReturnPercent: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs font-mono font-bold py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="drawdown-rate-input"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Safe Drawdown Return (%)
                </label>
                <input
                  id="drawdown-rate-input"
                  type="number"
                  min={2}
                  max={10}
                  step={0.5}
                  value={config.drawdownReturnPercent}
                  onChange={(e) =>
                    onUpdateConfig({
                      strategy: 'Custom',
                      drawdownReturnPercent: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs font-mono font-bold py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label
                  htmlFor="glide-years-input"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Glide Path Trigger Window (Years before 18)
                </label>
                <input
                  id="glide-years-input"
                  type="number"
                  min={1}
                  max={6}
                  step={1}
                  value={config.glidePathYears}
                  onChange={(e) =>
                    onUpdateConfig({
                      glidePathYears: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs font-mono font-bold py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateConfig({
                      strategy: 'Aggressive',
                      accumulationReturnPercent: 12,
                      glidePathReturnPercent: 7,
                      drawdownReturnPercent: 5,
                      glidePathYears: 3,
                    })
                  }
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 underline cursor-pointer py-2"
                >
                  Reset to Standard Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
