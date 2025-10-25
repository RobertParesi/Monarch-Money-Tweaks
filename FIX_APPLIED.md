# ✅ FIX APPLIED - Please Update Your Script

## What Was Wrong

The error `TypeError: undefined is not an object (evaluating 'MTFlex.SortSeq[MTFlex.Button2]')` was caused by missing property initializations. The grid rendering system expects certain properties to be set, and I forgot to initialize them for the Rebalancing report.

## The Fix

I've added the following lines to `MenuReportsRebalancingGo()`:

```javascript
MTFlex.Title3 = '';
MTFlex.SortSeq = ['1']; // Enable sorting on first column (Asset Class)
MTFlex.Button1 = 0;
MTFlex.Button2 = 0;
MTFlex.Button4 = 0;
```

These are required by the Monarch Money Tweaks framework for any report.

## 🔄 How to Update Your Script

### Option 1: Replace Entire Script (Easiest)

1. **Pull the latest version**:
   ```bash
   cd ~/Dev/Monarch-Money-Tweaks
   git pull
   ```

2. **Copy the updated script**:
   - Open `source/Monarch-Money-Tweaks.js`
   - Select All (Cmd+A) and Copy (Cmd+C)

3. **Update Userscripts**:
   - Click the Userscripts icon in Safari
   - Find "Monarch Money Tweaks v4.9"
   - Click Edit
   - Select All (Cmd+A) and Delete
   - Paste (Cmd+V) the new version
   - Save

4. **Reload Monarch Money**:
   - Go to app.monarch.com
   - Hard reload: **Cmd+Shift+R**
   - Click Reports > Rebalancing
   - **It should now work!** 🎉

### Option 2: Just Fix the Lines (Quick Patch)

If you don't want to replace the whole script:

1. Click Userscripts icon > Edit your script
2. Search for: `MTFlex.TriggerEvents = false;`
3. Add these lines **right after it**:
   ```javascript
   MTFlex.SortSeq = ['1'];
   MTFlex.Button1 = 0;
   MTFlex.Button2 = 0;
   MTFlex.Button4 = 0;
   ```
4. Also add after `MTFlex.Title2 = 'As of ' + getDates('s_FullDate');`:
   ```javascript
   MTFlex.Title3 = '';
   ```
5. Save and reload Monarch (Cmd+Shift+R)

## ✅ What You Should See

After the fix, when you click Reports > Rebalancing, you should see:

### Summary Cards (Top):
- **Total Portfolio Value** - Your total investment portfolio
- **Total Cash Position** - All uninvested cash
- **Total Invested** - Portfolio minus cash
- **Cash as % of Portfolio** - Percentage in cash (red if > 1%)

### Asset Allocation Table:
| Asset Class | Current Value | Current % | Target % | Variance | Target Value | $ Difference |
|-------------|---------------|-----------|----------|----------|--------------|--------------|
| US Large/Mid | $X | XX% | 41.65% | +/-X% | $X | $X |
| US Small | $X | XX% | 17.85% | +/-X% | $X | $X |
| ... | ... | ... | ... | ... | ... | ... |

**Color coding**:
- 🔴 Red variance = Underweight (need to buy)
- 🟢 Green variance = Overweight (could sell)

## 🧪 Test After Updating

In Safari console, verify the fix:

```javascript
// Should now work without error
MTFlex.SortSeq
// Expected: ['1']

MTFlex.Button1
// Expected: 0
```

## 💡 Why This Happened

Other reports (Investments, Accounts, Trends) all set these properties, but I forgot to add them to the new Rebalancing report. These properties control:

- `SortSeq`: Which columns can be sorted
- `Button1/2/4`: Which dropdown options are selected (we don't have dropdowns, so they're 0)
- `Title3`: Subtitle text (we don't have one, so it's empty)

The grid framework expects these to always be defined, so it crashed when they weren't.

## 🎯 Next Steps

1. Update your script using Option 1 or Option 2 above
2. Reload Monarch Money (Cmd+Shift+R)
3. Go to Reports > Rebalancing
4. Take a screenshot of what you see!
5. Let me know if it works or if you see any other issues

## 📊 What to Do With Your Data

Once it's working, you can:

1. **Review allocation** - See which asset classes are over/underweight
2. **Identify cash positions** - See exactly how much uninvested cash you have
3. **Plan rebalancing** - Use the $ Difference column to know what to buy/sell
4. **Export data** - Click the Export button to download to Excel

---

**The fix is committed and pushed to your repo!** Just pull and update your Userscripts. 🚀
