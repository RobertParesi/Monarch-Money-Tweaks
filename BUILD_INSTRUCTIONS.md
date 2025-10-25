# Building & Installing Your Personal Extension

This guide will help you install your modified version of Monarch Money Tweaks with the Portfolio Rebalancing Analysis feature.

## 📦 What's Been Created

Two extension folders have been created for you:
- `extension-chrome/` - For Chrome, Edge, Brave, Opera
- `extension-firefox/` - For Firefox

## 🌐 Chrome / Edge / Brave Installation (Developer Mode)

### Step 1: Open Extensions Page
1. Open Chrome/Edge/Brave
2. Navigate to extensions:
   - **Chrome**: `chrome://extensions`
   - **Edge**: `edge://extensions`
   - **Brave**: `brave://extensions`

### Step 2: Enable Developer Mode
1. Toggle "Developer mode" ON (top-right corner)

### Step 3: Load the Extension
1. Click "Load unpacked"
2. Navigate to and select the `extension-chrome` folder
3. The extension should now appear in your extensions list

### Step 4: Test It
1. Go to https://app.monarch.com
2. Navigate to Reports
3. You should see a new "Rebalancing" tab!

## 🦊 Firefox Installation (Temporary)

### Option 1: Temporary Installation (For Testing)
1. Open Firefox
2. Type `about:debugging` in the address bar
3. Click "This Firefox" on the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to `extension-firefox` folder and select `manifest.json`
6. The extension will be active until you close Firefox

### Option 2: Permanent Installation (Requires Signing)
Firefox requires extensions to be signed. For personal use:
1. Go to https://addons.mozilla.org/developers/
2. Create a developer account
3. Submit your extension for self-distribution
4. Download the signed XPI file
5. Install the XPI in Firefox

## 🔄 Updating the Extension

When you make code changes:

### For Chrome/Edge:
1. Go to `chrome://extensions` (or Edge equivalent)
2. Find your extension
3. Click the refresh icon 🔄
4. Reload the Monarch Money page

### For Firefox:
1. Go to `about:debugging#/runtime/this-firefox`
2. Find your extension
3. Click "Reload"
4. Reload the Monarch Money page

### Or Rebuild From Source:
```bash
# Copy updated source to extension folders
cp source/Monarch-Money-Tweaks.js extension-chrome/content.js
cp source/Monarch-Money-Tweaks.js extension-firefox/content.js

# Remove UserScript headers from Chrome version
# (Already done in the initial build)
```

## ⚙️ Customizing Asset Classes

To modify the asset class configuration:

1. Edit `source/Monarch-Money-Tweaks.js`
2. Find the `AssetClassConfig` object (around line 26)
3. Modify tickers, security names, or target percentages:

```javascript
const AssetClassConfig = {
    'US Large/Mid': {
        target: 41.65,
        tickers: ['SCHK', 'SCHX', 'VINIX', 'VFIAX'],
        securityNames: ['Vanguard 500 Index Portfolio']
    },
    // ... add your custom tickers here
};
```

4. Copy the updated file to extension folders (see "Updating" above)
5. Reload the extension

## 🐛 Troubleshooting

### Extension doesn't appear:
- Make sure Developer Mode is enabled
- Check browser console for errors (F12)
- Verify all files are in the extension folder

### Rebalancing tab doesn't show:
- Clear browser cache
- Hard reload Monarch Money (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for JavaScript errors
- Verify you're on version 4.9 (check Settings > Display in Monarch)

### Data looks wrong:
- Verify your ticker symbols match your actual holdings
- Check that your holdings are pulling from Monarch API correctly
- Enable debug mode in Settings (MT_Log checkbox)
- Check browser console for API responses

## 📊 Features Available

Once installed, you'll have access to:

1. **Rebalancing Report Tab** (Reports > Rebalancing)
   - View current vs. target allocation
   - See inferred cash positions
   - Identify over/underweight positions

2. **Summary Cards**
   - Total Portfolio Value
   - Total Cash Position
   - Total Invested
   - Cash Percentage

3. **Asset Allocation Table**
   - 7 configurable asset classes
   - Current/Target percentages
   - Variance analysis
   - Dollar differences

4. **Configuration** (Settings > Display)
   - Enable/disable rebalancing report
   - Set cash threshold alerts

## 🔒 Privacy Note

This extension:
- Runs entirely in your browser
- Only accesses Monarch Money's API (same as the website)
- Does NOT send data to external servers
- Stores settings in browser local storage only

## 📝 Version Information

- **Version**: 4.9 (Development)
- **Added**: Portfolio Rebalancing Analysis
- **Base**: Monarch Money Tweaks by Robert Paresi (v4.8)
- **Modified**: Personal fork with rebalancing features

---

**Need Help?** Check the browser console (F12) for error messages, or review the DOCUMENTATION.md file for feature details.
