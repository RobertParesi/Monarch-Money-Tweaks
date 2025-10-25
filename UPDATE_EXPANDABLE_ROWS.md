# ✨ NEW FEATURE: Expandable Asset Class Rows

## What's New

You can now **click on any asset class** to expand it and see exactly which holdings and accounts make up that total!

## 🔄 How to Update

### Quick Update (2 minutes):

1. **Pull the latest code**:
   ```bash
   cd ~/Dev/Monarch-Money-Tweaks
   git pull
   ```

2. **Copy the updated script**:
   - Open `source/Monarch-Money-Tweaks.js`
   - Select All (Cmd+A) and Copy (Cmd+C)

3. **Update in Userscripts**:
   - Click Userscripts icon in Safari
   - Edit your "Monarch Money Tweaks v4.9" script
   - Select All (Cmd+A), Delete, Paste (Cmd+V)
   - Save

4. **Reload Monarch Money**:
   - Go to app.monarch.com
   - Hard reload: **Cmd+Shift+R**

## 📊 What You'll See

### Before (Collapsed View):
```
Asset Class           Current Value    Current %    Target %    Variance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶ US Large/Mid        $1,822,999      41.5%        41.65%      -0.15%
▶ US Small            $778,018        17.7%        17.85%      -0.15%
▶ Int'l Large/Mid     $782,898        17.8%        17.85%      -0.05%
```

### After Clicking to Expand:
```
Asset Class           Ticker / Security          Current Value    % of Portfolio
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▼ US Large/Mid
    Joint Brokerage   SCHK • Schwab 1000         $540,000        12.30%
    FPT Roth IRA      VINIX • Vanguard 500      $320,000         7.29%
    TokenTax 401k     VFIAX • Vanguard 500      $280,000         6.38%
    AMT Roth IRA      SCHX • Schwab US LC       $240,000         5.47%
    ...
```

## 🎯 Features

### New Column: "Ticker / Security"
- Shows ticker symbol and security name for each holding
- Empty for asset class summary rows
- Full details when expanded

### Expandable Rows
- Click the **▶** arrow to expand an asset class
- Click **▼** to collapse it back
- Each asset class can be expanded independently

### Holdings Details Show:
1. **Account Name** - Which account holds this position (indented for clarity)
2. **Ticker Symbol** - e.g., SCHK, VFIAX, etc.
3. **Security Name** - Full name of the fund/stock
4. **Current Value** - Dollar amount of this holding
5. **% of Portfolio** - Percentage of your total portfolio

### Automatic Sorting
- Holdings within each asset class are sorted by value
- Largest holdings appear first
- Makes it easy to see your biggest positions

### Clear Hierarchy
- Asset class summary rows (bold)
- Account names indented (  Account Name)
- Visual distinction between summary and detail

## 💡 How to Use

### 1. See Your Biggest Positions
Expand "US Large/Mid" to see which accounts hold SCHK, SCHX, VINIX, etc.

### 2. Find Uninvested Cash
Expand "Cash" to see exactly which accounts have cash sitting idle:
```
▼ Cash
    Joint Brokerage   CASH-INFERRED              $247,600        5.64%
    MTO 401k          CASH-INFERRED              $28,437         0.65%
    FPT Roth IRA      CASH-INFERRED              $7,007          0.16%
```

### 3. Identify Rebalancing Opportunities
If "US Small" is underweight, expand it to see which accounts you should buy SCHA in.

### 4. Review Asset Distribution
Expand any asset class to verify that tickers are classified correctly.

### 5. Account-Level Analysis
See how each account contributes to your overall allocation:
- Which accounts are heavy in US stocks?
- Which accounts hold international positions?
- Which accounts have the most cash?

## 🔍 Example Use Cases

### Use Case 1: "Where is all my cash?"
1. Expand "Cash" asset class
2. See list of all accounts with uninvested cash
3. Prioritize deploying the largest cash positions first

### Use Case 2: "Which account should I rebalance?"
1. See that "US Small" is underweight by -2.65%
2. Expand "US Small" to see which accounts already have SCHA
3. Expand "Cash" to see which accounts have available cash
4. Buy more SCHA in the account with the most cash

### Use Case 3: "Verify ticker classification"
1. Expand each asset class
2. Review that all tickers are in the right bucket
3. If something's miscategorized, update AssetClassConfig

### Use Case 4: "Find tax-loss harvesting opportunities"
1. Expand asset classes with losses
2. See which specific holdings are down
3. Identify candidates for tax-loss harvesting in taxable accounts

## 📋 Table Structure

### Summary Row (Collapsed):
| Asset Class / Account | Ticker / Security | Current Value | Current % | Target % | Variance | Target Value | $ Difference |
|-----------------------|-------------------|---------------|-----------|----------|----------|--------------|--------------|
| ▶ US Large/Mid        | (empty)          | $1,822,999    | 41.5%     | 41.65%   | -0.15%   | $1,828,000   | -$5,001      |

### Detail Rows (Expanded):
| Asset Class / Account    | Ticker / Security          | Current Value | Current % | Target % | Variance | Target Value | $ Difference |
|--------------------------|----------------------------|---------------|-----------|----------|----------|--------------|--------------|
| ▼ US Large/Mid           | (empty)                   | $1,822,999    | 41.5%     | 41.65%   | -0.15%   | $1,828,000   | -$5,001      |
|   Joint Brokerage        | SCHK • Schwab 1000        | $540,000      | 12.30%    | -        | -        | -            | -            |
|   FPT Roth IRA          | VINIX • Vanguard 500      | $320,000      | 7.29%     | -        | -        | -            | -            |
|   TokenTax 401k         | VFIAX • Vanguard 500      | $280,000      | 6.38%     | -        | -        | -            | -            |

## 🎨 Visual Design

- **Summary rows**: Bold, collapsible with ▶/▼ arrows
- **Detail rows**: Slightly lighter background (auto-styled by framework)
- **Account names**: Indented with "  " prefix for visual hierarchy
- **Ticker format**: `TICKER • Security Name` for readability
- **Empty cells**: Target %, Variance, etc. are blank for detail rows (not applicable)

## 🔧 Technical Details

### How It Works:
1. `accountsData` array stores every holding with its asset class
2. For each asset class, we create a summary row (`BasedOn = 1`)
3. We filter holdings by asset class and sort by value
4. Each holding becomes a detail row (`BasedOn = 2`)
5. The framework handles expand/collapse automatically

### Data Flow:
```
BuildAccountHoldings()
  ↓
accountsData[] = [
  {account, ticker, name, value, assetClass},
  ...
]
  ↓
BuildAssetAllocationTable()
  ↓
For each assetClass:
  - Add summary row (collapsible)
  - Filter accountsData by assetClass
  - Sort by value
  - Add detail rows for each holding
```

## 🐛 Troubleshooting

### Rows won't expand?
- Make sure you have the latest version (check git pull)
- Hard reload: Cmd+Shift+R
- Check console for errors

### Some holdings missing?
- They might be in a different asset class than expected
- Check AssetClassConfig to verify ticker classifications
- Enable debug mode to see classification logs

### Wrong sorting?
- Holdings should be sorted largest to smallest within each class
- If not, there may be a data type issue (check console)

## 📈 What's Next?

Potential future enhancements:
- Click on a holding to see more details (cost basis, gains/losses)
- Filter view to show only accounts with cash
- Export expanded view to Excel
- Add subtotals by account type (Taxable vs Tax-Deferred)

## 🎉 Enjoy!

This feature gives you complete transparency into your portfolio composition. You can now see exactly:
- What you own
- Where you own it
- How much of each position
- How it contributes to your overall allocation

Happy rebalancing! 📊💰

---

**Updated**: Version 4.9 with expandable rows
**Committed**: Changes pushed to your repo
**Ready to use**: Update your Userscripts and reload!
