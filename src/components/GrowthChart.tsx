import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { YearlyPortfolioPoint } from '../types/planner.ts';

Chart.register(...registerables);

interface GrowthChartProps {
  timeline: YearlyPortfolioPoint[];
  currency: string;
  isDarkMode: boolean;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  timeline,
  currency,
  isDarkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = timeline.map((pt) => `${pt.calendarYear} (Yr ${pt.yearFromToday})`);
    const portfolioData = timeline.map((pt) => Math.round(pt.portfolioEndingBalance));
    const outflowData = timeline.map((pt) => Math.round(pt.annualWithdrawal));

    // Calculate cumulative contributions (starting corpus + cumulative SIPs)
    let cumulativeInvested = 0;
    const investedData = timeline.map((pt, idx) => {
      if (idx === 0) {
        cumulativeInvested = pt.portfolioStartingBalance;
      }
      cumulativeInvested += pt.annualSIPContributed;
      return Math.round(cumulativeInvested);
    });

    const textColor = isDarkMode ? '#94A3B8' : '#64748B';
    const gridColor = isDarkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
    const tooltipBg = isDarkMode ? '#1E293B' : '#0F172A';

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Gradients
    const portfolioGradient = ctx.createLinearGradient(0, 0, 0, 350);
    if (isDarkMode) {
      portfolioGradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
      portfolioGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    } else {
      portfolioGradient.addColorStop(0, 'rgba(5, 150, 105, 0.25)');
      portfolioGradient.addColorStop(1, 'rgba(5, 150, 105, 0.0)');
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Projected Portfolio Balance',
            data: portfolioData,
            borderColor: isDarkMode ? '#34D399' : '#059669',
            backgroundColor: portfolioGradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: isDarkMode ? '#34D399' : '#059669',
            yAxisID: 'y',
          },
          {
            label: 'Cumulative Capital Invested',
            data: investedData,
            borderColor: isDarkMode ? '#60A5FA' : '#2563EB',
            borderWidth: 2,
            borderDash: [5, 4],
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 4,
            yAxisID: 'y',
          },
          {
            label: 'Annual College Outflow',
            data: outflowData,
            type: 'bar',
            backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.65)' : 'rgba(220, 38, 38, 0.6)',
            borderColor: isDarkMode ? '#F87171' : '#DC2626',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 12,
                weight: 500,
              },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 18,
            },
          },
          tooltip: {
            backgroundColor: tooltipBg,
            titleColor: '#F8FAFC',
            bodyColor: '#E2E8F0',
            borderColor: isDarkMode ? '#334155' : '#CBD5E1',
            borderWidth: 1,
            padding: 12,
            bodySpacing: 6,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                const val = context.parsed.y ?? 0;
                return ` ${context.dataset.label}: ${currency} ${val.toLocaleString()}`;
              },
              afterBody: function (contexts) {
                if (!contexts || contexts.length === 0) return [];
                const dataIndex = contexts[0].dataIndex;
                const point = timeline[dataIndex];
                if (!point) return [];
                
                const returnPercent = (point.applicableReturnRate * 100).toFixed(1);
                const childrenStatus = point.childrenAges
                  .map((c) => `${c.name} (${c.age}y - ${c.status.replace('_', ' ')})`)
                  .join(', ');

                return [
                  ` Return Phase: ${returnPercent}% return`,
                  ` Children: ${childrenStatus}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              font: {
                family: "'JetBrains Mono', monospace",
                size: 11,
              },
              maxRotation: 45,
            },
          },
          y: {
            type: 'linear',
            position: 'left',
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              font: {
                family: "'JetBrains Mono', monospace",
                size: 11,
              },
              callback: function (val) {
                const num = Number(val);
                if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
                if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
                return `${num}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [timeline, currency, isDarkMode]);

  return (
    <div className="w-full h-80 sm:h-96 relative">
      <canvas ref={canvasRef} />
    </div>
  );
};
