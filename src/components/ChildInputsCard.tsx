import React from 'react';
import {
  Users,
  Plus,
  Trash2,
  MapPin,
  GraduationCap,
  Percent,
  Calendar,
  Sparkles,
} from 'lucide-react';
import type { ChildInput, Destination } from '../types/planner.ts';
import { DESTINATION_PRESETS } from '../types/planner.ts';

interface ChildInputsCardProps {
  children: ChildInput[];
  selectedChildId: string;
  onSelectChild: (id: string) => void;
  onUpdateChild: (childId: string, updates: Partial<ChildInput>) => void;
  onAddChild: () => void;
  onRemoveChild: (childId: string) => void;
  currency: string;
}

export const ChildInputsCard: React.FC<ChildInputsCardProps> = ({
  children,
  selectedChildId,
  onSelectChild,
  onUpdateChild,
  onAddChild,
  onRemoveChild,
  currency,
}) => {
  const activeChild = children.find((c) => c.id === selectedChildId) || children[0];
  const destPreset = DESTINATION_PRESETS[activeChild.destination] || DESTINATION_PRESETS.UAE;

  const handleDestinationChange = (dest: Destination) => {
    const preset = DESTINATION_PRESETS[dest];
    onUpdateChild(activeChild.id, {
      destination: dest,
      gradYears: preset.recommendedGradYears,
      // Clear manual overrides when user switches preset unless they specifically re-override
      inflationOverride: undefined,
      multiplierOverride: undefined,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs transition-colors">
      {/* Header with Child Tabs & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Family Portfolio Profile</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Children Higher Education Goals
          </h2>
        </div>

        {/* Child Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {children.map((c, index) => {
            const isSelected = c.id === activeChild.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectChild(c.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c.name || `Child ${index + 1}`} ({c.currentAge}y)
              </button>
            );
          })}

          {children.length < 3 && (
            <button
              type="button"
              onClick={onAddChild}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-white/60 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
              title="Add another child (up to 3)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Child Settings */}
      <div className="mt-6 space-y-6">
        {/* Child Name & Destination Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor={`child-name-${activeChild.id}`}
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Child's Name
            </label>
            <input
              id={`child-name-${activeChild.id}`}
              type="text"
              value={activeChild.name}
              onChange={(e) => onUpdateChild(activeChild.id, { name: e.target.value })}
              placeholder="e.g. Ayaan"
              className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`child-destination-${activeChild.id}`}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Target Study Destination</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Inflation: {(destPreset.defaultInflation * 100).toFixed(0)}%
                {destPreset.defaultMultiplier > 1.0 ? ' · +30% overseas living' : ''}
              </span>
            </div>
            <select
              id={`child-destination-${activeChild.id}`}
              value={activeChild.destination}
              onChange={(e) => handleDestinationChange(e.target.value as Destination)}
              className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
            >
              {Object.entries(DESTINATION_PRESETS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name} ({key === 'US' ? '8% infl, 1.3x' : key === 'UAE' ? '5% infl, 1.0x' : `${(item.defaultInflation * 100).toFixed(0)}% infl`})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Age Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor={`child-age-${activeChild.id}`}
              className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Current Age (Years)</span>
            </label>
            <span className="font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums">
              {activeChild.currentAge} years old{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({18 - activeChild.currentAge} years to college)
              </span>
            </span>
          </div>
          <input
            id={`child-age-${activeChild.id}`}
            type="range"
            min={0}
            max={17}
            step={1}
            value={activeChild.currentAge}
            onChange={(e) => onUpdateChild(activeChild.id, { currentAge: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500">
            <span>Newborn (0)</span>
            <span>Middle School (10)</span>
            <span>Glide Path (15)</span>
            <span>Matriculation (18)</span>
          </div>
        </div>

        {/* Annual Costs: Graduation & Post-Graduation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Graduation Cost Today */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`grad-cost-${activeChild.id}`}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Graduation Cost Today (Annual)
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {activeChild.gradYears} yrs degree
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500">{currency}</span>
              <input
                id={`grad-cost-${activeChild.id}`}
                type="number"
                min={10000}
                max={500000}
                step={5000}
                value={activeChild.gradAnnualCostToday}
                onChange={(e) =>
                  onUpdateChild(activeChild.id, { gradAnnualCostToday: Math.max(0, Number(e.target.value)) })
                }
                className="w-full text-sm font-mono font-bold tabular-nums py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <input
              type="range"
              min={20000}
              max={300000}
              step={5000}
              value={activeChild.gradAnnualCostToday}
              onChange={(e) =>
                onUpdateChild(activeChild.id, { gradAnnualCostToday: Number(e.target.value) })
              }
              aria-label="Graduation annual cost slider"
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Post-Graduation Cost Today */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`postgrad-cost-${activeChild.id}`}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Post-Grad Cost Today (Annual)
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {activeChild.postGradYears} yrs master's
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500">{currency}</span>
              <input
                id={`postgrad-cost-${activeChild.id}`}
                type="number"
                min={0}
                max={500000}
                step={5000}
                value={activeChild.postGradAnnualCostToday}
                onChange={(e) =>
                  onUpdateChild(activeChild.id, { postGradAnnualCostToday: Math.max(0, Number(e.target.value)) })
                }
                className="w-full text-sm font-mono font-bold tabular-nums py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <input
              type="range"
              min={0}
              max={350000}
              step={5000}
              value={activeChild.postGradAnnualCostToday}
              onChange={(e) =>
                onUpdateChild(activeChild.id, { postGradAnnualCostToday: Number(e.target.value) })
              }
              aria-label="Post-graduation annual cost slider"
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Scholarship & Cash Flow Offset */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor={`scholarship-percent-${activeChild.id}`}
              className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Percent className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Scholarship & Ongoing Family Cash Flow Aid</span>
            </label>
            <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400 tabular-nums">
              {activeChild.scholarshipPercent}% reduction
            </span>
          </div>
          <input
            id={`scholarship-percent-${activeChild.id}`}
            type="range"
            min={0}
            max={60}
            step={5}
            value={activeChild.scholarshipPercent}
            onChange={(e) =>
              onUpdateChild(activeChild.id, { scholarshipPercent: Number(e.target.value) })
            }
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>0% (Fully self-funded)</span>
            <span>15% (Typical Merit/Salary)</span>
            <span>30% (Partial Scholarship)</span>
            <span>50% (High Aid)</span>
          </div>
        </div>

        {/* Remove Child Button (if > 1 child) */}
        {children.length > 1 && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => onRemoveChild(activeChild.id)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove {activeChild.name || 'Child'} from Planner</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
