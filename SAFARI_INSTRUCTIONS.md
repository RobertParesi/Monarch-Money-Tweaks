# 🧭 Safari Installation Guide

Since you primarily use Safari, here's the simplest way to install your modified Monarch Money Tweaks extension.

## ✨ Easiest Method: Userscript.io (macOS Safari)

1. **Install Userscripts Extension** for Safari:
   - Visit https://apps.apple.com/app/userscripts/id1463298887
   - Or search "Userscripts" in the Mac App Store
   - Install and enable the extension in Safari Preferences > Extensions

2. **Add Your Script**:
   - Open Safari
   - Click the Userscripts extension icon
   - Click "+" to add a new script
   - Give it a name: "Monarch Money Tweaks v4.9"
   - Set the URL pattern: `https://app.monarch.com/*`
   - Copy the entire contents of `source/Monarch-Money-Tweaks.js`
   - Paste into the script editor
   - Save

3. **Test It**:
   - Go to https://app.monarch.com
   - Navigate to Reports
   - You should see the new "Rebalancing" tab!

## 📱 iPad/iPhone Method: Scripts App

For iOS/iPadOS devices:

1. **Install Scripts App**:
   - Open App Store on your iPad/iPhone
   - Search for "Scripts" by Michael Forrest
   - Install the app

2. **Enable Extension**:
   - Go to Settings > Safari > Extensions
   - Enable "Scripts"

3. **Add Your Script**:
   - Open Scripts app
   - Tap "+" to create a new script
   - Name it: "Monarch Money Tweaks v4.9"
   - Copy the entire contents of `source/Monarch-Money-Tweaks.js`
   - Paste into the editor
   - Tap "Done"

4. **Configure**:
   - Tap the script settings
   - Enable for `app.monarch.com`
   - Save

5. **Use It**:
   - Open Safari and go to app.monarch.com
   - Sign in to Monarch Money
   - Navigate to Reports
   - You'll see the new "Rebalancing" tab!

## 🔧 Advanced: Native Safari Extension (macOS only)

If you want a true Safari extension (requires Xcode):

1. **Prerequisites**:
   - Install Xcode from Mac App Store (this is a large download)
   - Enable Developer Mode

2. **Convert Extension**:
   ```bash
   cd ~/Monarch-Money-Tweaks
   xcrun safari-web-extension-converter extension-chrome --app-name "Monarch Tweaks Personal"
   ```

3. **Build in Xcode**:
   - Open the generated `.xcodeproj` file
   - Select your Mac as the target
   - Click "Run" (Cmd+R)
   - The extension will build and Safari will open

4. **Enable Extension**:
   - Safari > Preferences > Extensions
   - Find "Monarch Tweaks Personal"
   - Enable it
   - Allow it to run on app.monarch.com

**Note**: This method is overkill for personal use. The Userscripts method is much simpler!

## 🔄 Updating Your Script

When you make changes to the code:

### For Userscripts Extension:
1. Open Safari
2. Click Userscripts icon
3. Find your "Monarch Money Tweaks v4.9" script
4. Click Edit
5. Replace the code with updated `source/Monarch-Money-Tweaks.js`
6. Save
7. Reload app.monarch.com

### For Scripts App (iPad/iPhone):
1. Open Scripts app
2. Tap your script
3. Tap Edit
4. Replace with updated code
5. Save
6. Force-close Safari and reopen
7. Navigate to app.monarch.com

## ⚙️ Customizing Asset Classes

To modify your target allocations or add/remove tickers:

1. Open `source/Monarch-Money-Tweaks.js` in a text editor
2. Find line ~26 (search for "AssetClassConfig")
3. Edit the configuration:

```javascript
const AssetClassConfig = {
    'US Large/Mid': {
        target: 41.65,  // Change this percentage
        tickers: ['SCHK', 'SCHX', 'VINIX', 'VFIAX'],  // Add your tickers
        securityNames: ['Vanguard 500 Index Portfolio']
    },
    // Add more asset classes or modify existing ones
};
```

4. Save the file
5. Update your Safari script (see "Updating Your Script" above)

## 🐛 Troubleshooting

### Script doesn't load:
- Check Safari > Preferences > Extensions - is Userscripts enabled?
- Check if the script is enabled for app.monarch.com
- Try reloading the page (Cmd+R)

### Rebalancing tab doesn't appear:
- Clear Safari cache (Develop > Empty Caches)
- Check Safari's Web Inspector (Develop > Show JavaScript Console) for errors
- Verify the script is actually running (you should see console logs if MT_Log is enabled)

### Data looks incorrect:
- Make sure your ticker symbols in AssetClassConfig match your actual holdings
- Enable debug mode: Settings > Display in Monarch, check "MT_Log"
- Check Safari Console for API response data

### On iPad/iPhone - Extension not working:
- Go to Settings > Safari > Extensions
- Make sure Scripts is enabled
- Check that the script has permission for app.monarch.com
- Try force-closing Safari and reopening

## 📊 What You'll See

Once installed, in Monarch Money:

1. **New Rebalancing Tab** (Reports > Rebalancing)
   - Asset allocation table
   - Current vs. Target percentages
   - Variance highlighting (red = underweight, green = overweight)

2. **Summary Cards**
   - Total Portfolio Value
   - Total Cash Position (with alert if > 1%)
   - Total Invested Amount
   - Cash as % of Portfolio

3. **Asset Classes**
   - US Large/Mid (41.65% target)
   - US Small (17.85% target)
   - Int'l Large/Mid (17.85% target)
   - Int'l Small (3.83% target)
   - Int'l EM (3.83% target)
   - Alternatives & Crypto (15.00% target)
   - Cash (0.00% target)

4. **Automatic Features**
   - Inferred cash calculation (Account Balance - Holdings)
   - CASH-INFERRED line items added to all accounts
   - Color-coded variance indicators

## 🔒 Privacy & Security

This script:
- Runs entirely in your browser (Safari)
- Only accesses Monarch Money's API (same as the website itself)
- Does NOT send any data to external servers
- Stores settings in browser local storage only
- Is completely under your control (you have the source code)

## ℹ️ Version Info

- **Current Version**: 4.9 (Development)
- **New Feature**: Portfolio Rebalancing Analysis
- **Based On**: Monarch Money Tweaks by Robert Paresi (v4.8)
- **Modified**: Personal fork with rebalancing features

---

**Questions?** Check the main BUILD_INSTRUCTIONS.md file or review DOCUMENTATION.md for detailed feature information.

**Recommendation for Safari Users**: Use the Userscripts extension (macOS) or Scripts app (iOS/iPadOS) - they're much simpler than building a native Safari extension!
