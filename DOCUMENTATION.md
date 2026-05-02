## 📚 Getting Started & Documentation

### Monarch Money Tweaks — Installation, License & Security

Install Monarch Money Tweaks from the [Extensions area](https://github.com/RobertParesi/Monarch-Money-Tweaks/blob/main/README.md) for your browser:  

Click here for detailed information on [License](https://github.com/RobertParesi/Monarch-Money-Tweaks/blob/main/LICENSE.md) and [Security](https://github.com/RobertParesi/Monarch-Money-Tweaks/blob/main/SECURITY.md). 

🧑‍💻 After installing, refresh the Monarch Money web app.  

⚙️ MM‑Tweaks settings are accessible inside the Monarch UI: click your name (lower-left) → **Settings**.

Recommended initial steps (details below):

1. Settings → Display — initial MM‑Tweaks options  
2. Settings → Categories — configure Fixed vs Flexible spending (group level)  
3. Reports → Accounts → click **>** for each account to set Account Groups  
4. Explore Reports → Trends, Net Income, Accounts, Investments

---

### MM‑Tweaks — Settings (overview)

MM‑Tweaks adds UI, preferences, and report improvements inside the Monarch web app. Most settings live in Monarch’s Settings panel after installation.  

Click on **Settings** in lower-left of Monarch Money web app and then **Display**.
 
<img src="images/MT_V3_01.png" style="width:66%; height:auto;">

---

### Fixed vs Flexible Spending (group level)

MM‑Tweaks classifies spending at the *group* level (MM‑Tweaks uses Group-level flags rather than Monarch’s internal Fixed/Flexible).  

To configure: **Settings → Categories** → mark groups Fixed or Flexible. These flags are used by Trends and Net Income reports.  One reason is Monarch uses three category levels; the third level is intended for budgeting, not for pacing/actuals. 


If you need to, simply split those categories into two groups—for example, “Home — Fixed” and “Home — Flexible.”


<img src="images/MTFixed.png" style="width:66%; height:auto;">

---

### Overview Reports — Trends, Net Income, Accounts, Investments

Monarch Money Tweaks focuses on four enhanced reports: Trends, Net Income, Accounts, and Investments.  All four reports use the same flexible grid layout and share many features.
<br>

<img src="images/MT_V3_99.png" style="width:66%; height:auto;">

Highlights:
- **Sub Report**: view the report from different perspectives.  
- **Group By**: change how the report groups data (category, group, account, etc.).  
- **Account Group Filter** appears after you assign account groups.
- Click any column header to sort ascending/descending.
- Click any date header to change date or in Trends change to end of previous month.

---

### Use Reports / Accounts for special MM-Tweaks Account Settings

Select **Reports → Accounts**, click **>** (far right) on an account to open the side panel, then `...` to access MM‑Tweaks account options.

<br>
<img src="images/MTAccountSettings.png" style="width:66%; height:auto;">

Key options:
- **Account Group** — group reports by any label you prefer (Personal, Business, Managed, Credit Cards, Trust, etc.). Useful examples:
  - Investments → `Managed` / `Non Managed` / `Tax Deferred`  
  - Credit cards → `Credit Cards`  
  - Property / vehicles → `Trust` / `Non Trust` / `Personal` / `Jerry` / `Elaine` / `Kids`
- **Subtype override** — replace the account subtype shown in reports (ie: "Short Term Liability", "Long Term Liability", "Equities", "Bonds").
- **Holding Category override (account‑level)** — default holding category for all holdings in the account.
- **Add to Dashboard Accounts list** — include account summary on the Dashboard.

---

### Reports / Trends 

MM‑Tweaks derives Trends from transactions and transaction history only — it does not use any Budget, Goals, or Recurring data. For me personally, I prefer this simpler workflow: use transactions as the single source of truth so I don’t have to maintain other data in Monarch. Think of Trends as a practical alternative to traditional budgeting: it builds budget guidance from actual transaction trends (last month, same month last year, same quarter, etc.).

<img src="images/MT_V3_04.png" style="width:66%; height:auto;">

The first three columns are designed by selecting a "Compare ..." Sub Report:

* **Compare last month** — Column 1 shows last month’s total, Column 2 shows this month’s total, and Column 3 shows the difference. Recommended only for brand‑new Monarch users without historical data.  

* **Compare same month** — Column 1 shows the total for the same month last year, Column 2 shows this month’s total, and Column 3 shows the difference. This is the usual preferred view.  

* **Compare same quarter** — Column 1 shows the total for the same quarter last year, Column 2 shows this quarter’s total, and Column 3 shows the difference. Good choice for retirees, those making estimated IRS payments, or anyone tracking spending on a quarterly basis.

📌 **“Always compare to End of Month” option**
When enabled, comparisons use full month totals for the prior period rather than truncating at today’s date. Normally both columns show values up to today (e.g., on March 16 both Column 1 and Column 2 reflect data through March 16). Turn on this setting (⚙️) to make Column 1 represent the full prior month (e.g., March 1–31) so you’re comparing this partial month to a complete month. I prefer having this option on for a clearer month‑to‑month view without surprises.

Columns 4–6 show year‑to‑date comparisons: this year vs. last year and the difference. This is your pacing view — an easy way to track whether you’re on track without using Monarch’s budget features. I recommend separating Fixed vs. Flexible categories: Fixed spending tends to be steady, while Flexible spending swings more (vacations, seasonal purchases) and can shift between months.

The shading makes this easy.  Only focus on the shaded lines which alert you to being far out of face.   There are three levels of shading (> 25%, > 50%, > 100%)

### Reports / Trends 

Click on the > for  History drilldowns show per‑month details and allow opening side‑panel details.

<img src="images/MT_V3_History.png" style="width:60%; height:auto;">

---

### Reports / Net Income (by Tags, by Account, by Notes, by Owner)
<br>
<img src="images/MT_V3_09.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_TagNotes.png" style="width:60%; height:auto;">
<img src="images/MT_TagsNotes2.png" style="width:60%; height:auto;">

---

### Reports / Accounts (Standard, Brokerage, Personal Statement)
<br>
<img src="images/MT_V3_07.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_V3_08.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_V3_12.png" style="width:66%; height:auto;">

---

### Reports / Accounts (Overall Cash Statement)

This report will show all cash in Checking, Savings and Investments as well as Uninvested Cash in brokerage accounts.

MM-Tweaks calculates the "uninvested cash" in brokerage accounts in the following manner:

* Monarch returns an **Account Balance** at each snapshot.  
* Monarch returns the **Sum of all holdings** at each snapshot.
* MM-Tweaks calculates the _Idle Cash_ (cash uninvested) as **Account Balance - Sum of all holdings**.

If cash looks incorrect:

1. Verify no holdings are missing in the account.  
2. If the account contains crypto or manually added holdings, MM‑Tweaks may skip computing uninvested cash for that account.  
3. If everything looks correct but the amount still differs, contact Monarch support or reach out via GitHub discussion here, Reddit community forum or by email.

To show any holding as _Cash Holdings_ (SGOV, TIPS, SWTXX, etc.) select Accounts → select account → Holdings → click `>` next to the holding → set Type to **Cash**.

---

### Reports / Investments

There are three types of Investment reports:

1. **Positions** - Displays all your current holdings for each account. Use Allocation report to combine same holdings.
2. **Allocation** - Displays all your current holdings with same holdings combined. Use Portfolio report to split like holdings.
3. **Performance** - Displays all your equity holdings ignoring Fixed Income & Cash. Shows price performance over your selected time frame. Click on the date header to change the range (ie: Past Week, This Month, This Year, etc.)

<br>
<img src="images/MT_Invest01.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_Invest02.png" style="width:66%; height:auto;">

Click on the **>** in the far right of any investment holding for a Detailed view:

<img src="images/MT_Invest03.png" style="width:50%; height:auto;">

Click on the **>** in the far right of any Total or Group for a Summary or Allocation view:

<img src="images/MT_Invest04.png" style="width:50%; height:auto;">

---

### Investment Holding Settings

Select **Reports → Investments**, click on **>** (far right) of any equity holding and click `...` in the holding side panel for MM‑Tweaks options.

![Settings](/images/MTInvestmentSettings.png)

- **Holding Category override (ticker or account)** — assign a category (Sector, Asset Class, Bond Type, etc.) either per‑ticker or at the account level.

---
### Allocation targets and notes


Set targets by institution, account, holding type, or category by clicking the > on the Total row (top header) of the grid and then [...] in top-right.

<br>
<img src="images/MT_InvestAlloc.png" style="width:50%; height:auto;">

<br>
<img src="images/MT_Invest06.png" style="width:50%; height:auto;">

📌 When configuring allocation targets, set them at the appropriate levels so they behave consistently across portfolio and filtered/grouped views:
 
1. Positions & Allocation are the same.  You cannot set Targets at the Performance level since Cash & Fixed Income is excluded.
2. By Institution / Account / Account subtype / Holding type / Category (choose the breakdown you need).  
3. By all Accounts or by Account Group. 

Notes:
- Targets do **not** need to sum to 100% (e.g., set 70% Fixed Income and leave the remainder unspecified).  
- Verify targets in both Allocation and Performance views — Positions & Allocation includes Fixed Income where Performance only includes Equities.


---

### Other MM-Tweaks features

- Multi‑cell tagging:
<br>
<img src="images/MT_V3_10.png" style="width:66%; height:auto;">

- Split transaction 50/50
<br>
<img src="images/MT_V3_03.png" style="width:60%; height:auto;">

- Household breakdown on Accounts
<br>
<img src="images/MT_V3_13.png" style="width:60%; height:auto;">

---
