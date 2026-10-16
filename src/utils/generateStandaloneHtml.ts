import type { PlannerConfig } from '../types/planner.ts';

/**
 * Generates a completely self-contained, single-file HTML document
 * containing Tailwind CSS (via CDN), Chart.js (via CDN), Google Fonts,
 * all slider logic, staggered drawdown compounding math, glide path logic,
 * dark mode toggling, and responsive dashboard layout for zero-dependency single-file deployment.
 */
export function generateStandaloneHtml(config: PlannerConfig): string {
  const initialConfigJson = JSON.stringify(config);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduFund: Children's Higher Education Financial Planner</title>
  <meta name="description" content="Single-file standalone financial education planning dashboard with glide path asset allocation, staggered drawdown modeling, multi-destination inflation, and Chart.js portfolio growth visualization.">
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          }
        }
      }
    }
  </script>

  <!-- Chart.js via CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-200">

  <!-- Header -->
  <header class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
      <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">EduFund</span>
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <a href="#inputs" class="hover:text-emerald-600 dark:hover:text-emerald-400">Inputs</a>
        <a href="#chart-section" class="hover:text-emerald-600 dark:hover:text-emerald-400">Growth Chart</a>
        <a href="#breakdown" class="hover:text-emerald-600 dark:hover:text-emerald-400">Child Breakdown</a>
        <a href="#milestones" class="hover:text-emerald-600 dark:hover:text-emerald-400">Milestones</a>
      </nav>
      <div class="flex items-center gap-3">
        <select id="currency-select" class="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
          <option value="AED">AED</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="INR">INR</option>
          <option value="CAD">CAD</option>
        </select>
        <button id="theme-toggle" class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <span id="theme-icon">🌙</span>
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Bottom Line Banner -->
    <div id="bottom-line-card" class="rounded-2xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/25">
      <div class="space-y-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bottom Line Plan</span>
        <h1 id="bottom-line-title" class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Calculating...</h1>
        <p id="bottom-line-desc" class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"></p>
      </div>
    </div>

    <!-- Explanatory cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div class="flex justify-between items-center mb-1">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Staggered Drawdown Advantage</h3>
          <span id="staggered-savings-pill" class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400"></span>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300">Money needed for later college years continues to compound at 5% safe drawdown return, substantially reducing Day 1 corpus requirements.</p>
      </div>
      <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div class="flex justify-between items-center mb-1">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">3-Year Glide Path Protection</h3>
          <span class="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">De-risks at Age 15</span>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300">Shifts portfolio return from accumulation to a protected 7% rate 3 years before college to prevent sequence-of-returns volatility.</p>
      </div>
    </div>

    <!-- Inputs Section -->
    <div id="inputs" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Child Inputs -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Child Education Profile</h2>
        
        <div>
          <label class="block text-xs font-semibold mb-1">Child's Name</label>
          <input id="child-name" type="text" class="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium" />
        </div>

        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="font-semibold">Current Age</span>
            <span id="child-age-label" class="font-mono font-bold"></span>
          </div>
          <input id="child-age" type="range" min="0" max="17" step="1" class="w-full accent-emerald-600" />
        </div>

        <div>
          <label class="block text-xs font-semibold mb-1">Study Destination</label>
          <select id="child-destination" class="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium">
            <option value="UAE">UAE (Local) - 5% Inflation, 1.0x</option>
            <option value="US">United States - 8% Inflation, 1.3x Living</option>
            <option value="UK">United Kingdom - 6% Inflation, 1.3x Living (3y grad)</option>
            <option value="Canada">Canada - 6% Inflation, 1.3x Living</option>
            <option value="India">India - 9% Inflation, 1.0x</option>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="font-semibold">Grad Annual Cost Today</span>
              <span id="grad-cost-label" class="font-mono font-bold"></span>
            </div>
            <input id="grad-cost" type="range" min="20000" max="300000" step="5000" class="w-full accent-emerald-600" />
          </div>
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="font-semibold">Post-Grad Annual Cost</span>
              <span id="postgrad-cost-label" class="font-mono font-bold"></span>
            </div>
            <input id="postgrad-cost" type="range" min="0" max="350000" step="5000" class="w-full accent-emerald-600" />
          </div>
        </div>

        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="font-semibold">Scholarship & Ongoing Family Aid</span>
            <span id="scholarship-label" class="font-mono font-bold text-emerald-600"></span>
          </div>
          <input id="scholarship" type="range" min="0" max="60" step="5" class="w-full accent-emerald-600" />
        </div>
      </div>

      <!-- Financial Capital & Strategy -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Savings & Investment Strategy</h2>
        
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="font-semibold">Existing Corpus Saved</span>
            <span id="existing-corpus-label" class="font-mono font-bold"></span>
          </div>
          <input id="existing-corpus" type="range" min="0" max="1000000" step="10000" class="w-full accent-emerald-600" />
        </div>

        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="font-semibold">Monthly SIP Amount</span>
            <span id="monthly-sip-label" class="font-mono font-bold"></span>
          </div>
          <input id="monthly-sip" type="range" min="0" max="30000" step="500" class="w-full accent-emerald-600" />
        </div>

        <div>
          <label class="block text-xs font-semibold mb-2">SIP Cadence</label>
          <div class="grid grid-cols-2 gap-3">
            <button id="sip-simple-btn" class="p-2.5 rounded-xl border text-xs font-semibold">Simple SIP (Flat)</button>
            <button id="sip-stepup-btn" class="p-2.5 rounded-xl border text-xs font-semibold">Step-up SIP (+3%/yr)</button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold mb-2">Investment Strategy</label>
          <div class="grid grid-cols-2 gap-3">
            <button id="strat-agg-btn" class="p-2.5 rounded-xl border text-xs font-semibold">Aggressive (12%)</button>
            <button id="strat-cons-btn" class="p-2.5 rounded-xl border text-xs font-semibold">Conservative (8%)</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div id="chart-section" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Projected Portfolio Growth & College Outflows</h2>
          <p class="text-xs text-slate-500">Visualizing compounding accumulation, glide path transition, and staggered college drawdown.</p>
        </div>
      </div>
      <div class="h-80 sm:h-96">
        <canvas id="growthChart"></canvas>
      </div>
    </div>

    <!-- Breakdown Table -->
    <div id="breakdown" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">Staggered Annual Withdrawal Schedule</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-500">
              <th class="py-2 px-3">Year</th>
              <th class="py-2 px-3">Child Age</th>
              <th class="py-2 px-3">Stage</th>
              <th class="py-2 px-3 text-right">Gross Cost</th>
              <th class="py-2 px-3 text-right">Scholarship Credit</th>
              <th class="py-2 px-3 text-right">Net Withdrawal</th>
              <th class="py-2 px-3 text-right text-emerald-600">Discounted to 18 (5%)</th>
            </tr>
          </thead>
          <tbody id="breakdown-tbody" class="divide-y divide-slate-100 dark:divide-slate-800"></tbody>
        </table>
      </div>
    </div>

    <!-- Milestones -->
    <div id="milestones" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">Personalized Education Milestones</h2>
      <div id="milestones-container" class="space-y-3"></div>
    </div>
  </main>

  <script>
    // State
    const state = ${initialConfigJson};
    let chartInstance = null;
    let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Presets
    const PRESETS = {
      UAE: { infl: 0.05, mult: 1.0, gradYears: 4 },
      US: { infl: 0.08, mult: 1.3, gradYears: 4 },
      UK: { infl: 0.06, mult: 1.3, gradYears: 3 },
      Canada: { infl: 0.06, mult: 1.3, gradYears: 4 },
      India: { infl: 0.09, mult: 1.0, gradYears: 4 }
    };

    function updateTheme() {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').textContent = '☀️';
      } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('theme-icon').textContent = '🌙';
      }
      if (chartInstance) renderChart();
    }

    function calculate() {
      const child = state.children[0];
      const preset = PRESETS[child.destination] || PRESETS.UAE;
      const yearsTo18 = Math.max(0, 18 - child.currentAge);
      const totalYears = child.gradYears + child.postGradYears;
      const currentYear = new Date().getFullYear();

      let flows = [];
      let totalGross = 0;
      let totalNet = 0;
      let targetAt18 = 0;
      let crudeSum = 0;

      for (let k = 0; k < totalYears; k++) {
        const isGrad = k < child.gradYears;
        const stage = isGrad ? 'Graduation Yr ' + (k + 1) : 'Post-Grad Yr ' + (k - child.gradYears + 1);
        const yearIndex = yearsTo18 + k;
        const baseCost = isGrad ? child.gradAnnualCostToday : child.postGradAnnualCostToday;
        const grossCost = baseCost * Math.pow(1 + preset.infl, yearIndex) * preset.mult;
        const scholarship = grossCost * (child.scholarshipPercent / 100);
        const net = Math.max(0, grossCost - scholarship);
        const discTo18 = net / Math.pow(1.05, k);

        flows.push({ yearIndex, calYear: currentYear + yearIndex, age: child.currentAge + yearIndex, stage, grossCost, scholarship, net, discTo18 });
        totalGross += grossCost;
        totalNet += net;
        targetAt18 += discTo18;
        crudeSum += net;
      }

      // Trajectory
      const maxHorizon = yearsTo18 + totalYears + 1;
      let balance = state.existingCorpus;
      let monthlySIP = state.monthlySIP;
      let timeline = [];

      for (let y = 0; y <= maxHorizon; y++) {
        const calYear = currentYear + y;
        const childAge = child.currentAge + y;
        const out = flows.find(f => f.yearIndex === y)?.net || 0;
        
        let rate = state.accumulationReturnPercent / 100;
        if (childAge >= 18 + totalYears) rate = 0.05;
        else if (childAge >= 18) rate = 0.05;
        else if (18 - childAge <= 3) rate = 0.07;

        let annualSIP = (childAge < 18 + totalYears) ? monthlySIP * 12 : 0;
        const netInvest = Math.max(0, balance - out);
        const growth = (netInvest + annualSIP * 0.5) * rate;
        let endBal = netInvest + annualSIP + growth;
        if (balance < out) endBal = Math.max(0, balance + annualSIP - out);

        timeline.push({ y, calYear, childAge, balance: endBal, out, rate });
        balance = endBal;
        if (state.sipType === 'stepup') monthlySIP *= 1 + (state.sipStepUpPercent / 100);
      }

      return { child, preset, flows, totalGross, totalNet, targetAt18, crudeSum, staggeredSavings: crudeSum - targetAt18, timeline };
    }

    function renderUI() {
      const res = calculate();
      const curr = state.currency;
      const child = state.children[0];

      // Sliders sync
      document.getElementById('child-name').value = child.name;
      document.getElementById('child-age').value = child.currentAge;
      document.getElementById('child-age-label').textContent = child.currentAge + ' years';
      document.getElementById('child-destination').value = child.destination;
      
      document.getElementById('grad-cost').value = child.gradAnnualCostToday;
      document.getElementById('grad-cost-label').textContent = curr + ' ' + Math.round(child.gradAnnualCostToday).toLocaleString();

      document.getElementById('postgrad-cost').value = child.postGradAnnualCostToday;
      document.getElementById('postgrad-cost-label').textContent = curr + ' ' + Math.round(child.postGradAnnualCostToday).toLocaleString();

      document.getElementById('scholarship').value = child.scholarshipPercent;
      document.getElementById('scholarship-label').textContent = child.scholarshipPercent + '%';

      document.getElementById('existing-corpus').value = state.existingCorpus;
      document.getElementById('existing-corpus-label').textContent = curr + ' ' + Math.round(state.existingCorpus).toLocaleString();

      document.getElementById('monthly-sip').value = state.monthlySIP;
      document.getElementById('monthly-sip-label').textContent = curr + ' ' + Math.round(state.monthlySIP).toLocaleString() + '/mo';

      // Button styles
      const sipSimple = document.getElementById('sip-simple-btn');
      const sipStep = document.getElementById('sip-stepup-btn');
      sipSimple.className = 'p-2.5 rounded-xl border text-xs font-semibold ' + (state.sipType === 'simple' ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-600 text-emerald-800 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-700');
      sipStep.className = 'p-2.5 rounded-xl border text-xs font-semibold ' + (state.sipType === 'stepup' ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-600 text-emerald-800 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-700');

      const stratAgg = document.getElementById('strat-agg-btn');
      const stratCons = document.getElementById('strat-cons-btn');
      stratAgg.className = 'p-2.5 rounded-xl border text-xs font-semibold ' + (state.strategy === 'Aggressive' ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-600 text-emerald-800 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-700');
      stratCons.className = 'p-2.5 rounded-xl border text-xs font-semibold ' + (state.strategy === 'Conservative' ? 'bg-blue-100 dark:bg-blue-950/60 border-blue-600 text-blue-800 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700');

      // Bottom Line text
      document.getElementById('bottom-line-title').innerHTML =
        'To fund ' + (child.name || 'your child') + '\\'s education in <span class="text-emerald-600">' + child.destination + '</span>, you need an initial lump sum of <span class="font-mono">' + curr + ' ' + Math.round(state.existingCorpus).toLocaleString() + '</span> along with your monthly SIP of <span class="font-mono text-emerald-600">' + curr + ' ' + Math.round(state.monthlySIP).toLocaleString() + '</span>.';

      document.getElementById('bottom-line-desc').textContent =
        'Target Corpus needed at age 18 is ' + curr + ' ' + Math.round(res.targetAt18).toLocaleString() + '. Staggered Drawdown compounding saves you ' + curr + ' ' + Math.round(res.staggeredSavings).toLocaleString() + ' compared to crude lump sum requirements.';

      document.getElementById('staggered-savings-pill').textContent = 'Save ' + curr + ' ' + Math.round(res.staggeredSavings).toLocaleString();

      // Table
      const tbody = document.getElementById('breakdown-tbody');
      tbody.innerHTML = res.flows.map(f => \`
        <tr>
          <td class="py-2 px-3 font-mono">\${f.calYear} (+\${f.yearIndex}y)</td>
          <td class="py-2 px-3 font-mono">\${f.age}y</td>
          <td class="py-2 px-3 font-medium">\${f.stage}</td>
          <td class="py-2 px-3 text-right font-mono">\${curr} \${Math.round(f.grossCost).toLocaleString()}</td>
          <td class="py-2 px-3 text-right font-mono text-slate-400">-\${curr} \${Math.round(f.scholarship).toLocaleString()}</td>
          <td class="py-2 px-3 text-right font-mono font-semibold">\${curr} \${Math.round(f.net).toLocaleString()}</td>
          <td class="py-2 px-3 text-right font-mono font-bold text-emerald-600">\${curr} \${Math.round(f.discTo18).toLocaleString()}</td>
        </tr>
      \`).join('');

      // Milestones
      const mContainer = document.getElementById('milestones-container');
      mContainer.innerHTML = \`
        <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center">
          <div><span class="font-bold">Age 15 Checkpoint:</span> 3-Year Glide Path shifts asset allocation to 7% capital preservation.</div>
          <span class="font-mono text-slate-500">\${new Date().getFullYear() + Math.max(0, 15 - child.currentAge)}</span>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center">
          <div><span class="font-bold">Age 18 Matriculation:</span> College begins in \${child.destination}. Staggered drawdown starts with unwithdrawn funds earning 5%.</div>
          <span class="font-mono text-emerald-600 font-bold">\${new Date().getFullYear() + Math.max(0, 18 - child.currentAge)}</span>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center">
          <div><span class="font-bold">Graduation Milestone:</span> Degree completed debt-free!</div>
          <span class="font-mono text-purple-600 font-bold">\${new Date().getFullYear() + Math.max(0, 18 + child.gradYears - child.currentAge)}</span>
        </div>
      \`;

      renderChart();
    }

    function renderChart() {
      const res = calculate();
      const ctx = document.getElementById('growthChart').getContext('2d');
      if (chartInstance) chartInstance.destroy();

      const labels = res.timeline.map(t => t.calYear + ' (Age ' + t.childAge + ')');
      const balances = res.timeline.map(t => Math.round(t.balance));
      const outflows = res.timeline.map(t => Math.round(t.out));

      const textColor = isDarkMode ? '#94A3B8' : '#64748B';
      const gridColor = isDarkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Portfolio Balance',
              data: balances,
              borderColor: '#059669',
              backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.15)',
              fill: true,
              tension: 0.3,
            },
            {
              label: 'College Outflow',
              data: outflows,
              type: 'bar',
              backgroundColor: 'rgba(239, 68, 68, 0.65)',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: textColor }, grid: { color: gridColor } },
            y: { ticks: { color: textColor }, grid: { color: gridColor } }
          }
        }
      });
    }

    // Event listeners
    document.getElementById('theme-toggle').onclick = () => { isDarkMode = !isDarkMode; updateTheme(); };
    document.getElementById('currency-select').onchange = (e) => { state.currency = e.target.value; renderUI(); };
    
    document.getElementById('child-name').oninput = (e) => { state.children[0].name = e.target.value; renderUI(); };
    document.getElementById('child-age').oninput = (e) => { state.children[0].currentAge = Number(e.target.value); renderUI(); };
    document.getElementById('child-destination').onchange = (e) => { 
      state.children[0].destination = e.target.value; 
      state.children[0].gradYears = PRESETS[e.target.value].gradYears;
      renderUI(); 
    };
    document.getElementById('grad-cost').oninput = (e) => { state.children[0].gradAnnualCostToday = Number(e.target.value); renderUI(); };
    document.getElementById('postgrad-cost').oninput = (e) => { state.children[0].postGradAnnualCostToday = Number(e.target.value); renderUI(); };
    document.getElementById('scholarship').oninput = (e) => { state.children[0].scholarshipPercent = Number(e.target.value); renderUI(); };
    
    document.getElementById('existing-corpus').oninput = (e) => { state.existingCorpus = Number(e.target.value); renderUI(); };
    document.getElementById('monthly-sip').oninput = (e) => { state.monthlySIP = Number(e.target.value); renderUI(); };

    document.getElementById('sip-simple-btn').onclick = () => { state.sipType = 'simple'; renderUI(); };
    document.getElementById('sip-stepup-btn').onclick = () => { state.sipType = 'stepup'; renderUI(); };

    document.getElementById('strat-agg-btn').onclick = () => { 
      state.strategy = 'Aggressive'; 
      state.accumulationReturnPercent = 12; 
      renderUI(); 
    };
    document.getElementById('strat-cons-btn').onclick = () => { 
      state.strategy = 'Conservative'; 
      state.accumulationReturnPercent = 8; 
      renderUI(); 
    };

    updateTheme();
    renderUI();
  </script>
</body>
</html>`;
}
