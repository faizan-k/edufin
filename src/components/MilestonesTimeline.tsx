import React from 'react';
import {
  Calendar,
  ShieldCheck,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { MilestoneItem } from '../types/planner.ts';

interface MilestonesTimelineProps {
  milestones: MilestoneItem[];
  currency: string;
}

export const MilestonesTimeline: React.FC<MilestonesTimelineProps> = ({
  milestones,
  currency,
}) => {
  const fmt = (num: number) => Math.round(num).toLocaleString('en-US');

  const getMilestoneIcon = (type: MilestoneItem['type']) => {
    switch (type) {
      case 'glide_path':
        return <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'college_start':
        return <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'graduation':
        return <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'postgrad_finish':
        return <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getBadgeClass = (type: MilestoneItem['type']) => {
    switch (type) {
      case 'glide_path':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'college_start':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'graduation':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'postgrad_finish':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs transition-colors space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Progress Roadmap</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Personalized Education Milestones
          </h2>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Chronological guide to key risk shifts and graduation milestones
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {milestones.map((milestone, idx) => {
          return (
            <div key={`${milestone.title}-${idx}`} className="relative group">
              {/* Timeline marker dot */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center transition-colors group-hover:border-emerald-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>

              {/* Milestone Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getBadgeClass(
                        milestone.type
                      )}`}
                    >
                      {getMilestoneIcon(milestone.type)}
                      <span>
                        {milestone.yearFromToday === 0
                          ? 'Today'
                          : `Year +${milestone.yearFromToday}`}
                      </span>
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                      {milestone.calendarYear}
                    </span>
                  </div>

                  <div className="text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    Projected Portfolio:{' '}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {currency} {fmt(milestone.projectedPortfolio)}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                  {milestone.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
