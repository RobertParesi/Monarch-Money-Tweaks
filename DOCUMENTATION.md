## 📚 Getting Started & Documentation

### Monarch Money Tweaks - Installation, License and Security

To install Monarch Money Tweaks, visit the [Extensions area](https://github.com/RobertParesi/Monarch-Money-Tweaks/blob/main/README.md) for your browser.   Click here for detailed information on [License](https://github.com/RobertParesi/Monarch-Money-Tweaks/blob/main/LICENSE.md) and [Security](https://github.com/RobertParesi/Monarch-Money-Tweaks/blob/main/SECURITY.md).   Once you have installed the extension, simply refresh the Monarch Money app website.

It's recommended to start with the following steps, all explained further below:

1. **Settings / Display** for initial Monarch Money Tweaks Settings.
2. **Settings / Categories** to further setup Fixed vs Flexible Spending.
3. **Reports / Accounts / use >**  to setup Account Groups.
4. Check out **Reports / (Trends, Net Income, Accounts, Investments)**

### Monarch Money Tweaks - Settings

![Settings](/images/MT_V3_01.png)

### Monarch Money Tweaks - Fixed vs Flexible

You can further specify expenses at the Group level by choosing between "Fixed Spending" and "Flexible Spending" within the Trends and Net Income reports. To do this, navigate to **Settings > Categories** and select the appropriate option. Please note, MMT does not utilize the Fixed and Flexible Spending settings within Monarch, as MMT operates solely at the Group level.

![Settings](/images/MTFixed.png)

### Monarch Money Tweaks - Account Settings 

You can further specify MM-Tweaks special Account settings by going to **Reports** and **Accounts** and select the **>** for each account. Click on the **...** in the upper-right in the side-panel to access this screen.

![Settings](/images/MTAccountSettings.png)

#### Account Group

Monarch Money users utilize them in various scenarios and combinations for the Monarch Money Tweaks reports:

    * Personal vs Business - "Personal", "Business", "ABC Company"
    * Household Members - "Your Name", "Their Name", "Kids", "Both"
    * How taxed - "Taxed", "Tax Deferred"
    * How managed - "Managed", "Non Managed"
    * Types - "Credit Cards", "Retirement", "Trust", "Homes", "Loans"
    * ... or anything else you want to Group reports by

Personally I did the following:
   * Investment accounts: I put "Managed" or "Non Managed" since I have an advisor for some investments and not others.
   * Credit cards: I put "Credit Cards" so they are all grouped together.
   * House, Cars, all other accounts: I put "Trust" or "Non Trust" depending on where it is titled.
     
#### Subtype override

Each account in Monarch has a Subtype. If you’re happy with the current Subtype shown in reports, leave this blank. To further specify the account, you can override it with any label you prefer (for example: Bonds, Municipal Bonds, Short-Term Loan, Long-Term Loan).

#### Holding Category override (applies to all holdings in this account)

Monarch Money assigns each holding a type, which you can change inside Monarch Money: go to Accounts → select the brokerage account → scroll to Holdings, then tap the “>” by a holding to choose one of the nine available types. MM-Tweaks lets you refine those types with custom labels (for example: the Sector, the Asset Class, the Index Stategy, Bond, Municipal Bond, State Bond, Corporate Bond), either for the entire account or for individual holdings that have a ticker. If every holding in the account is the same type (e.g., state bonds), enter that custom label here.

#### Add to Dashboard Accounts list

Check this box to include a summary of this account on your Monarch Money Dashboard.

### Monarch Money Tweaks - Investment Holding Settings 

You can further specify MM-Tweaks Investment Category settings by going to **Reports** and **Investments** and select the **>** for each holding. Click on the **...** in the upper-right in the side-panel to access this screen.

![Settings](/images/MTInvestmentSettings.png)


#### Holding Category override (applies to this ticker)

Monarch Money assigns each holding a type, which you can change inside Monarch Money: go to Accounts → select the brokerage account → scroll to Holdings, then tap the “>” by a holding to choose one of the nine available types. MM-Tweaks lets you refine those types with custom labels (for example: the Sector, the Asset Class, the Index Stategy, Bond, Municipal Bond, State Bond, Corporate Bond), either for the entire account or for individual holdings that have a ticker. You can assign a Category if the holding has a ticker only or to the entire account on the Account level.


### Monarch Money Tweaks - Reports (Trends, Net Income, Accounts and Investments)

All four reports use the same flex-grid, structure and options:

![Settings](/images/MT_V3_99.png)

* The "Sub Report" feature enables you to view the report from different perspectives.
* The "How report is grouped" option allows you to select the data grouping. Click on any column header to sort the report in ascending or descending order.
* The "Account Group Filter" will appear only after you have edited your accounts and assigned your custom account groups.

**Monarch Tweaks Reports - Trends Compare, Monthly & Yearly sub-reports**
![Settings](/images/MT_V3_04.png)

**Monarch Tweaks Reports / Trends Compare**
![Settings](/images/MTTrendInfo.png)

**Monarch Tweaks Reports / Trends Monthly**
![Settings](/images/MT_V3_05.png)

**Monarch Tweaks Reports / Trends Yearly**
![Settings](/images/MT_V3_06.png)

**Monarch Tweaks Reports / Trends > History Drill-down**
![Settings](/images/MT_V3_History.png)

**Monarch Tweaks Reports / Net Income (based on Tags)**
![Settings](/images/MT_V3_09.png)

**Monarch Tweaks Reports / Net Income (based on Notes Field)**
![Settings](/images/MT_TagNotes.png)
![Settings](/images/MT_TagsNotes2.png)

**Monarch Tweaks Reports / Accounts**
![Settings](/images/MT_V3_07.png)

**Monarch Tweaks Reports / Accounts**
![Settings](/images/MT_V3_08.png)

### Monarch Money Tweaks Reports / Accounts [Overall Cash Statement] - Information on how Investment cash is computed

💵 Monarch receives an _Account Balance_ as well as _holdings_ for each investment account.  The difference between the _Account Balance_ and the value of the _holdings_ at that snapshot in time would be the "uninvested" portion of the portfolio.  You'll see this cash figure in both Reports / Accounts [Overall Cash Statement] as well as Reports / Investments with each "CASH/MONEY MARKET" entry.  

🔖 If the cash amount is incorrect, first check whether any holdings are missing — if you find missing holdings, contact Monarch support.
Note that if the account contains any **crypto** or you’ve **manually** added holdings, the system will not search for uninvested cash because manual entries or crypto can skew the account balance returned from the source. If everything looks correct but the amount is still wrong, contact me via Reddit DM, the Discussion thread above, or direct email.

To make cash appear in Cash Holdings, go to Accounts, select the account, scroll down to the holdings, click the > next to the holding to open the side panel, and change the holding Type to “Cash.”


**Monarch Tweaks Reports / Accounts / Personal Statement**
<br>
<img src="images/MT_V3_12.png" style="width:60%; height:auto;">

**Monarch Tweaks Reports tag multiple cells**
<br>
<img src="images/MT_V3_10.png" style="width:60%; height:auto;">

**Monarch Tweaks Reports / Investments**
<br>
<img src="images/MT_Invest01.png" style="width:60%; height:auto;">

**Monarch Tweaks Reports / Investments**
<br>
<img src="images/MT_Invest02.png" style="width:60%; height:auto;">

**Monarch Tweaks Reports / Investments Detail**
<br>
<img src="images/MT_Invest03.png" style="width:60%; height:auto;">

**Monarch Tweaks Reports / Investment Category Totals & Subtotals**
<br>
<img src="images/MT_Invest04.png" style="width:60%; height:auto;">


### Other Monarch Money Tweaks non-report options:

**Monarch Tweaks Split Transaction 50/50**
![Settings](/images/MT_V3_03.png)

**Monarch Tweaks Household Breakdown on Accounts**
![Settings](/images/MT_V3_13.png)
