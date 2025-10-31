# Repository Guidelines

## Project Structure & Module Organization
Core logic lives in `source/Monarch-Money-Tweaks.js`; there is no longer a parallel debug build. Reference assets (icons, screenshots) stay in `images/`, while root-level guides (`BUILD_INSTRUCTIONS.md`, `SAFARI_INSTRUCTIONS.md`, `TROUBLESHOOTING.md`) capture browser-specific install flows. Local build folders such as `extension-chrome/` and `extension-firefox/` are generated on demand, untracked, and should mirror the current main script.

## Build, Test, and Development Commands
Use targeted copies instead of transpilation:  
`cp source/Monarch-Money-Tweaks.js extension-chrome/content.js` updates Chromium builds, and `cp source/Monarch-Money-Tweaks.js extension-firefox/content.js` refreshes Firefox. For Safari or iOS Scripts App usage, paste the same file directly. Reload the browser extension page (`chrome://extensions`, `about:debugging`) after each copy to pick up changes.

## Rebalancing Report Notes
- Manual alternative investments (Origin Opportunity Zone, Brewpub, Portfolia, etc.) are injected as `MANUAL` holdings under `Alternatives & Crypto`; inferred cash is forced to zero for those accounts.
- The Schwab MTO 401k SDBA is treated as a normal controllable account; any placeholder “SDBA / Self-Directed Brokerage” rows from the Principal account are filtered out and the parent’s inferred cash is forced to zero.
- No-control accounts (KPMG Pension, MTO Profit Sharing Plan) are flagged via `showInNoControl`; they appear in the summary bullets after the grid and are excluded from the controllable target scaling.
- Target percentages are scaled by the controllable share of the portfolio (`controllableScale`); totals still rely on the original grand total logic, so downstream work may be needed to make target value/$ difference foot perfectly.
- Recommendation metadata is assembled (cash deployment, shortfalls) but currently rendered as bullet summaries after the TOTAL row rather than collapsible sections.

## Coding Style & Naming Conventions
Stick to vanilla ES2020 with four-space indentation, trailing semicolons, and single quotes for strings unless template literals clarify intent. Global helpers follow the `MM_*` prefix, while configuration objects use `PascalCase` keys (`AssetClassConfig`). Keep constants uppercase (`CRLF`, `FlexOptions`), prefer `const` over `let` unless reassignment is required, and co-locate feature-specific helpers near their usage.

## Testing Guidelines
There is no automated test harness; rely on browser-based verification. Enable the `MT_Log` setting to surface console diagnostics. Regression-test the five major panels (`MTTrends`, `MTNet_Income`, `MTAccounts`, `MTInvestments`, `MTRebalancing`) plus the Rebalancing summary cards and summary sections (recommendations, cash deployment). Record steps and screenshots when exercising fixes, especially when toggles, filters, or asset-class rollups are touched.

## Commit & Pull Request Guidelines
Follow the existing concise, imperative history (`Fix: Adjust rollover panel`, `Add debug version`). Each PR should summarize scope, link relevant issues or docs, and attach before/after visuals when UI is involved. Call out manual test coverage in the description so reviewers can replay high-risk flows.

## Security & Distribution Notes
Respect the all-rights-reserved notice in `source/README.md`: changes are for personal use only. Never check in API keys, account data, or browser export artifacts, >>>>>>>>>>>>>>>>>>>>> **and avoid publishing modified builds to public stores without written approval.**
