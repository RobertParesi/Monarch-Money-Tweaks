# 🔧 Troubleshooting: Rebalancing Page Not Loading

## Quick Diagnostic Checklist

### ✅ Step 1: Does the Tab Appear?

Go to Monarch Money > Reports. Do you see **5 tabs**?
- Trends
- Net Income
- Accounts
- Investments
- **Rebalancing** ← Should be here

**If NO** - The script isn't loading or FlexOptions isn't being updated
**If YES** - Continue to Step 2

### ✅ Step 2: What Happens When You Click "Rebalancing"?

Click the Rebalancing tab. What do you see?

**A) Blank/white page** → Script loaded, but function failing
**B) Spinning loader that never stops** → API call hanging or function not completing
**C) Error message** → JavaScript error (check console)
**D) Nothing happens / stays on current tab** → Click handler not working

### ✅ Step 3: Check Safari Console

1. Safari > Preferences > Advanced > ☑️ "Show Develop menu"
2. Develop > Show JavaScript Console
3. Click Reports > Rebalancing
4. Look for **red error messages**

**Take a screenshot of any errors and share them!**

### ✅ Step 4: Verify Script Version

In the Safari console, type:
```javascript
version
```

**Expected**: `"4.9"`
**If "undefined"**: Script not loaded
**If different version**: Wrong script loaded

---

## Common Issues & Fixes

### Issue 1: Tab Doesn't Appear

**Cause**: FlexOptions array not updated or script not loading

**Fix**:
1. Check Userscripts extension is enabled (Safari > Preferences > Extensions)
2. Verify script is enabled for `https://app.monarch.com/*`
3. Check the script content has `FlexOptions = ['MTTrends','MTNet_Income','MTAccounts', 'MTInvestments', 'MTRebalancing']`
4. Hard reload: Cmd+Shift+R

### Issue 2: Tab Appears But Page is Blank

**Cause**: JavaScript error in `MenuReportsRebalancingGo()` function

**Fix**:
1. Open Safari console (Develop > Show JavaScript Console)
2. Click Rebalancing tab
3. Look for error messages (usually red)
4. Common errors:
   - `MF_GridInit is not defined` → Core function missing, script incomplete
   - `getPortfolio is not a function` → API function missing
   - `AssetClassConfig is not defined` → Config object missing

### Issue 3: Infinite Loading Spinner

**Cause**: API call hanging or `glo.spawnProcess` not being set

**Fix**:
1. Check network tab for failed API calls
2. Verify Monarch API is responding
3. Use DEBUG version of script (see below)

### Issue 4: "Cannot read property of undefined"

**Cause**: API returned unexpected data structure

**Fix**:
1. Check if you have any investment accounts in Monarch
2. Verify holdings are syncing properly
3. Try clicking "Investments" tab first (to verify portfolio API works)

---

## 🔍 Debug Version of Script

I've created a DEBUG version that logs every step. Replace your current script with this:

**Location**: `source/Monarch-Money-Tweaks-DEBUG.js`

### How to Use Debug Version:

1. In Userscripts, edit your "Monarch Money Tweaks" script
2. Replace with contents of `Monarch-Money-Tweaks-DEBUG.js`
3. Save and reload Monarch Money
4. Open Safari Console (Develop > Show JavaScript Console)
5. Click Rebalancing tab
6. You'll see step-by-step progress:
   ```
   🔧 MenuReportsRebalancingGo() called
   🔧 Step 1: Initializing grid...
   ✅ Grid initialized
   🔧 Step 2: Initializing asset class totals...
   ✅ Asset classes initialized
   ```
7. **Screenshot where it stops** and share with me!

---

## 🧪 Manual Test: Check Core Functions

In Safari console, test these one by one:

### Test 1: Check if main functions exist
```javascript
typeof MenuReportsRebalancingGo
```
**Expected**: `"function"`

### Test 2: Check FlexOptions
```javascript
FlexOptions
```
**Expected**: `['MTTrends', 'MTNet_Income', 'MTAccounts', 'MTInvestments', 'MTRebalancing']`

### Test 3: Check AssetClassConfig
```javascript
AssetClassConfig
```
**Expected**: Should show object with asset classes

### Test 4: Test API Access
```javascript
getAccountsData().then(data => console.log('Accounts:', data))
```
**Expected**: Should log your accounts data

### Test 5: Test Portfolio API
```javascript
getPortfolio('2025-10-25', '2025-10-25').then(data => console.log('Portfolio:', data))
```
**Expected**: Should log your portfolio holdings

---

## 🎯 Quick Test: Does Investments Tab Work?

Before troubleshooting Rebalancing:

1. Go to Reports > **Investments**
2. Does it load properly?

**If NO**: The issue is with the base script, not just rebalancing
**If YES**: The issue is specific to the rebalancing function

---

## 📋 Information to Provide for Help

When asking for help, please provide:

1. **Does the tab appear?** (Yes/No)
2. **What happens when you click it?** (Blank page / Spinner / Error / Nothing)
3. **Console errors** (Screenshot of Safari console)
4. **Script version** (type `version` in console)
5. **Does Investments tab work?** (Yes/No)
6. **Debug output** (If using DEBUG version, where does it stop?)

---

## 🚨 Emergency Fix: Use Investments Tab as Template

If Rebalancing won't work, you can temporarily use the Investments tab:

1. Go to Reports > Investments
2. This shows your holdings with cash calculation
3. Manually note asset classes for each holding
4. Use a spreadsheet to calculate allocations

(Not ideal, but works while we troubleshoot!)

---

## 🔄 Reset and Try Again

If all else fails:

1. **Remove the script** from Userscripts
2. **Clear Safari cache**: Develop > Empty Caches
3. **Quit and reopen Safari**
4. **Re-add the script** (copy fresh from `source/Monarch-Money-Tweaks.js`)
5. **Hard reload Monarch**: Cmd+Shift+R
6. **Try again**

---

## Next Steps

Please try the diagnostic steps above and let me know:
- Which step fails?
- What error messages do you see?
- What does the DEBUG version output?

I'll help you fix it! 🛠️
