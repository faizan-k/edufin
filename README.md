<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# EduFund: Children's Higher Education Financial Planner

Interactive financial education planning dashboard with glide path asset allocation, staggered drawdown modeling, multi-destination inflation, and Chart.js portfolio growth visualization.

## 🚀 How to Open in Google Chrome

You do **not** need Node.js or `npm`. This app is completely self-contained and browser-native:

1. Simply double-click **`index.html`** or right-click `index.html` -> **Open with Google Chrome**.
2. All calculations, interactive sliders, multi-child planning, dark/light mode, and growth charts will run instantly.

---

## 🌐 How to Host on GitHub Pages (Zero-Build Setup)

Because `index.html` uses CDN-delivered Tailwind CSS and Chart.js with pure browser JavaScript:

1. Push this entire repository or folder to your GitHub repo.
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Branch**, select `main` (or `master`) and `/ (root)`, then click **Save**.
4. Your planner will be live at `https://<your-username>.github.io/<your-repo-name>/` within seconds!

---

## 🧪 Unit Testing

To verify all mathematical calculations, binary search solvers, edge cases, and real Chrome DOM rendering across all scenarios:

```bash
node test-planner.js
```

This runs an automated 73-check test suite covering 11 scenarios:
1. Baseline Multi-Child Default Setup & Mathematical Solvers
2. Fully Funded Plan via Increased Initial Funding (Lump Sum)
3. Fully Funded Plan via Increased Monthly SIP
4. 100% Upfront Lump Sum (Zero Monthly SIP)
5. Step-Up SIP (+3%/year annual increment)
6. Single Child Plan Validation
7. Multi-Destination Inflation & Duration Presets (UAE, US, UK, Canada, India)
8. Conservative (8%) vs Aggressive (12%) Strategy
9. Currency Formatting Across All Currencies (AED, USD, EUR, GBP, INR, CAD)
10. Edge Cases (Zero Corpus, Zero SIP, Newborns, High Schoolers, 60% Aid)
11. Real Google Chrome Headless DOM & Error-Free Execution

---

## 📁 Files Included

- **`index.html`**: The main complete web application ready for GitHub Pages and local Chrome. Supports multi-child planning, dynamic currency switching, interactive charts, and withdrawal schedules.
- **`standalone.html`**: A single-child standalone export version.
- **`test-planner.js`**: Comprehensive automated unit test suite.


