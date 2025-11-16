# Change Log (Version History)

* **Up next**
    - NEW: Reports / Accounts side drawer (charts, detail drill down, more)
  
* **Version 4.13 (November 15, 2025 - Firefox)**
    - NEW: Reports / Net Income cards
    - ENHANCEMENT: Reports settings can now be accessed directly from report grid rather than going to Settings / Display.
    - ENHANCEMENT: Reports / Accounts / Brokerage Statement cards now show percentage in addition to amount.
    - ENHANCEMENT: Reports / Accounts / Brokerage Statement can show Positions Balance and Cash Balance.
    - ENHANCEMENT: Reports / Investments will now recalculate institution & holding values with Current Stock Price
    - ENHANCEMENT: Reports / Investments will now show chart for Crypto & Mutual Funds in addition to Stock and ETFs.
    - CHANGE: Reports / Investments accounts marked as **Exclude account balance** will be excluded when **All Groups** is selected.  Allows you to create a manual Asset/Investment account with an Account Group name (ie: Watchlist) and add manual holdings in it.
    - CHANGE: Accounts marked as **Exclude account balance** will be excluded from Accounts Summary breakdown.
    - FIX: Reports / Trends side drawer expand history will now show hidden transactions as crossed out.
    - FIX: Change Reports sub-menu css for reduced screen widths.
    - FIX: Reports / Investments ticker column was not a good width when splitting Ticker and Description.
    - FIX: Reports / Investments will show a better stock price for manually entered holdings.
    - FIX: Reports / Accounts / Brokerage Statement Liability and Net Worth Totals removed.
    - FIX: Reports / Investments side drawer "Shares" would not show for manually entered accounts.

* **Version 4.12 (November 7, 2025)**  
    - NEW: Reports / Net Income / by Owner to show Income & Spending by Shared Views & Owner.
    - NEW: Reports / Investments now include Positions, **Allocation**, and Performance.  Allocation is similar to Positions, but combines all like holdings. Some users prefer viewing duplicate tickers as separate **Positions**, while others prefer viewing them as a consolidated **Allocation**.
    - NEW: Reports / Investments now display a Grand Total at the top.
    - NEW: A "% of Portfolio" column has been added for better insight.
    - NEW: Ability to hide Joint/Ownership options on the Accounts screen (Settings / Display).
    - CHANGE: The columns in Reports / Investments have been reordered for a more intuitive layout.
    - FIX: Resolved an issue with the small initial sorting bug in percentage columns.
    - FIX: Improved consistency in menu item hiding when expanding the sidebar.

  
* **Version 4.10 (November 2, 2025)**  
     - NEW: Added Report Description and Tip to all reports to make it easier for first-time users.  Settings / Display / Reports to turn off.
     - ENHANCEMENT: The accounts listed on the Investments side panel will show if account is outside of filter group.
     - FIX: Toggling Trends date on first day of month would not toggle to previous month.
 
* **Version 4.9 (October 30, 2025)**  
     - NEW: Investments Stock Chart will now show green and red lines depending on if stock price is Up vs Down.
     - NEW: Investments Stock Chart side panel has toggle in upper-right to combine or not combine same holding totals.
     - NEW:  Ability to watch your selected account balances in Dashboard. 
     - CHANGE: History Detail drill-down will now remember sort.

* **Version 4.8 (October 26, 2025)**  
     - NEW: Added link to Stock Analysis when expanding Stock, ETF and Mutual Funds.
     - CHANGE: When exporting reports with Subtotals, GROUP name will export as well as the CATEGORY.
     - CHANGE: Clean up with Exporting - better formatting.
     - CHANGE: Better handling of 1M, 3M and 6M days in stock chart.
     - CHANGE: Saving Favorite View will now save the Sort Sequence as well.
     - CHANGE: Calendar now has "Past Week".
     - FIX: Reports / Net Income / by Accounts would include accounts not used and show all 0.00 
     - FIX: Reports / Investments Accounts column was not hidden when grouping by Account.
     - FIX: Reports / Investments Accounts & Type columns were not hidden when grouping by Account/Stock Type.

* **Version 4.7.1 (October 16, 2025)**
     - CHANGE: Handle new Monarch domain name.

* **Version 4.5 & 4.6 (October 13, 2025)**
     - NEW: Reports / Investments added number of Gainers/Losers to top card.
     - NEW: Reports has Save and Restore favorite view options.
     - CHANGE: Reports with sub totals will now have sub header.
     - FIX: Reports / Investments fixes issue where report does not display because of manual accounts (USD, Crypto) being used.
     - FIX: Reports / Accounts / Standard Report Projected Balance wrong for Liabilities.
    
* **Version 4.3 & 4.4 (October 9, 2025)**
     - NEW: Reports / Investments side panel and pressing > on stocks & ETF's will show Stock Chart.
     - NEW: Reports / Investments side panel Stock Price will now show more recent price.
     - NEW: Reports / Investments side panel will show 20 Day, 50-Day and 200-Day Moving Average with tooltip.     
     - NEW: Reports / Investments drop-down has new report "by Account/Stock Type" with sub-totals.
     - NEW: Reports / Investments stock price will show tooltip "Last Updated".
     - NEW: Reports / Investments will break out Bond information (AMT, XTRO, Coupon Rate, Cost Per Share, Est. Income, etc.)
     - NEW: First time users can have default settings automatically setup.
     - NEW: Expanded/Collapsed sections are now remembered not just by report by also by sub-report as well.
     - CHANGE: Account setup screen has tips on using Account Groups.
     - FIX: Compress tickbox "off" might not draw grid lines in some cases.
     - FIX Cost Basis for CASH/MONEY MARKET holding same as Value to correct Gain/Loss.
     - REGRESSION: Cash Flow / Expenses / [Monthly Summary] button did not work.
       

* **Version 4.2 (September 27, 2025)**
     - NEW: Reports / Investments - Added Green & Red colors on Gain/Loss fields.
     - NEW: Display / Settings - Added ability to pick Header and Subtotal shading colors.  Choose absolute Black (#000000) to clear back to defaults.
     - NEW: Reports / Net Income - Added ability to expand History drill-down side drawer.
     - CHANGE: Reports - Drop down wording streamlined to look like other drop downs.
     - FIX: Reports / Investments could fail (freeze) when selecting Performance.
     
 
* **Version 4.1 (September 24, 2025)**
     - Migration from Tamper Monkey scripts to secured extensions for Chrome & Firefox.
     - Reports / Investments - New Portfolio & Performance reports including Cost Basis and more!
     - Reports / Accounts / Brokerage Statement.
     - Many visual improvements including Group Totals format & shading.
     - Lots of under-the-hood clean-up.
 
       
