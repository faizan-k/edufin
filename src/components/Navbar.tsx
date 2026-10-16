import React from 'react';
import { Sun, Moon, Download } from 'lucide-react';

interface NavbarProps {
  currency: string;
  onCurrencyChange: (curr: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onExportStandaloneHtml: () => void;
}

const CURRENCIES = ['AED', 'USD', 'EUR', 'GBP', 'INR', 'CAD'];

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  isDarkMode,
  onToggleDarkMode,
  onExportStandaloneHtml,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 transition-colors"
        >
          EduFund
        </a>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#planner-inputs"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Planning Inputs
          </a>
          <a
            href="#growth-projection"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Portfolio Growth
          </a>
          <a
            href="#child-breakdown"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Child-by-Child Breakdown
          </a>
          <a
            href="#milestones"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Milestones
          </a>
          <a
            href="#methodology"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            System Logic
          </a>
        </nav>

        {/* Zone 3: Primary Actions (Currency, Theme, Export) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Currency selector */}
          <div className="flex items-center">
            <label htmlFor="currency-select" className="sr-only">
              Select Currency
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-colors"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Export Single Standalone HTML */}
          <button
            type="button"
            onClick={onExportStandaloneHtml}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Download fully self-contained index.html with single-file deployment"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Single HTML</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
