# 🚀 Quick Start for Safari Users

## The Easiest Way to Install (5 minutes)

Since you use Safari, here's the simplest installation method:

### Step 1: Install Userscripts Extension

1. Open this link in Safari: https://apps.apple.com/app/userscripts/id1463298887
2. Click "Get" to install the Userscripts extension
3. Once installed, go to Safari > Preferences > Extensions
4. Enable "Userscripts"

### Step 2: Add Your Modified Script

1. Download or copy the file: `source/Monarch-Money-Tweaks.js`
2. Click the Userscripts icon in Safari toolbar (looks like a script icon)
3. Click the "+" button to add a new script
4. Fill in:
   - **Name**: Monarch Money Tweaks v4.9
   - **URL Pattern**: `https://app.monarch.com/*`
   - **Script**: Paste the entire contents of `Monarch-Money-Tweaks.js`
5. Click Save

### Step 3: Test It!

1. Go to https://app.monarch.com
2. Log in to Monarch Money
3. Click on "Reports" in the left sidebar
4. You should now see **5 tabs** instead of 4:
   - Trends
   - Net Income
   - Accounts
   - Investments
   - **Rebalancing** ← NEW!

5. Click "Rebalancing" to see your portfolio analysis!

## What You'll See

### Summary Cards (Top of Page):
- 💰 Total Portfolio Value
- 💵 Total Cash Position (highlighted in red if > 1%)
- 📈 Total Invested
- 📊 Cash as % of Portfolio

### Asset Allocation Table:
Each row shows an asset class with:
- Current Value ($)
- Current % of portfolio
- Target % allocation
- **Variance** (Red = underweight, need to buy | Green = overweight, could sell)
- Target Value ($)
- $ Difference to target

### Your Asset Classes:
1. **US Large/Mid** - 41.65% target (SCHK, SCHX, VINIX, VFIAX)
2. **US Small** - 17.85% target (SCHA, VSCPX, VSCIX)
3. **Int'l Large/Mid** - 17.85% target (VEA, SCHF)
4. **Int'l Small** - 3.83% target (VSS, SCHC)
5. **Int'l EM** - 3.83% target (VWO, SCHE)
6. **Alternatives & Crypto** - 15.00% target (FBTC, ETHE, ETH, EZBC)
7. **Cash** - 0.00% target (auto-calculated)

## 💡 Key Features

### Automatic Cash Detection
The script automatically calculates "inferred cash" for each account:
- Formula: `Account Balance - Sum of All Holdings = Inferred Cash`
- Shows up as "CASH-INFERRED" in your analysis
- Solves the problem where cash doesn't appear in Monarch's holdings API

### Example:
- Joint Brokerage Balance: $1,608,095
- Sum of Holdings (stocks, ETFs, etc.): $1,360,495
- **Inferred Cash**: $247,600 ← Automatically calculated!

### Color-Coded Variance
- **Red Numbers** = Underweight (you need to buy more of this asset class)
- **Green Numbers** = Overweight (you could sell to rebalance)
- **White Numbers** = At or near target

## 🔧 Customizing Your Configuration

Want to change target allocations or add tickers?

1. Open `source/Monarch-Money-Tweaks.js` in a text editor
2. Search for "AssetClassConfig" (around line 26)
3. Edit the configuration:

```javascript
const AssetClassConfig = {
    'US Large/Mid': {
        target: 41.65,  // ← Change this percentage
        tickers: ['SCHK', 'SCHX', 'VINIX', 'VFIAX'],  // ← Add your tickers here
        securityNames: ['Vanguard 500 Index Portfolio']
    },
    // ... modify other asset classes as needed
};
```

4. Save the file
5. In Safari, click Userscripts icon > Edit your script
6. Copy/paste the updated code
7. Reload app.monarch.com

## 📝 Next Steps

### To Use Your Analysis:
1. Look at the Variance column to see which asset classes are off-target
2. Check the $ Difference column to see how much to buy/sell
3. Prioritize the asset classes with the largest variance
4. Start with deploying cash first (0% target means all cash should be invested)
5. Then rebalance by buying underweight (red) positions

### To Add More Features:
The rebalancing function has a placeholder for recommendations at line ~2337:
```javascript
async function BuildRebalancingRecommendations() {
    // Add specific buy/sell recommendations here
}
```

You can expand this to:
- Generate specific trade recommendations
- Calculate tax impact for each trade
- Prioritize tax-loss harvesting opportunities
- Consider account tax status (taxable vs. tax-deferred)

## 🐛 Troubleshooting

**Script isn't loading?**
- Safari > Preferences > Extensions > Make sure Userscripts is ON
- Check that the script is enabled for app.monarch.com
- Try reloading the page (Cmd+R)

**Rebalancing tab doesn't appear?**
- Clear Safari cache: Safari > Develop > Empty Caches
- Check Web Inspector for errors: Develop > Show JavaScript Console
- Verify you're using version 4.9 (check Settings > Display in Monarch)

**Data looks wrong?**
- Make sure your ticker symbols match your actual holdings
- Check that holdings are syncing from Monarch properly
- Enable debug logging: Settings > Display, check "MT_Log"

## 📚 More Documentation

- **SAFARI_INSTRUCTIONS.md** - Detailed Safari installation (including iPad/iPhone)
- **BUILD_INSTRUCTIONS.md** - Full build guide for all browsers
- **DOCUMENTATION.md** - Complete feature documentation
- **CHANGELOG.md** - Version history and changes

## 🎉 You're All Set!

You now have:
✅ Portfolio rebalancing analysis
✅ Automatic cash position calculation
✅ Asset class allocation tracking
✅ Visual variance indicators
✅ Configurable target allocations

Happy rebalancing! 📊💰
