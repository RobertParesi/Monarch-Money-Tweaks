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
 
<img src="../images/MT_V3_01.png" style="width:66%; height:auto;">

---

### Fixed vs Flexible Spending (group level)

MM‑Tweaks classifies spending at the *group* level (MM‑Tweaks uses Group-level flags rather than Monarch’s internal Fixed/Flexible).  

To configure: **Settings → Categories** → mark groups Fixed or Flexible. These flags are used by Trends and Net Income reports.  One reason is Monarch uses three category levels; the third level is intended for budgeting, not for pacing/actuals. 


If you need to, simply split those categories into two groups—for example, “Home — Fixed” and “Home — Flexible.”


<img src="../images/MTFixed.png" style="width:66%; height:auto;">

---

### Overview Reports — Trends, Net Income, Accounts, Investments

Monarch Money Tweaks focuses on four enhanced reports: Trends, Net Income, Accounts, and Investments.  All four reports use the same flexible grid layout and share many features.
<br>

<img src="../images/MT_V3_99.png" style="width:66%; height:auto;">

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
<img src="../images/MTAccountSettings.png" style="width:66%; height:auto;">

Key options:
- **Account Group** — group reports by any label you prefer (Personal, Business, Managed, Credit Cards, Trust, etc.). Useful examples:
  - Investments → `Managed` / `Non Managed` / `Tax Deferred`  
  - Credit cards → `Credit Cards`  
  - Property / vehicles → `Trust` / `Non Trust` / `Personal` / `Jerry` / `Elaine` / `Kids`
- **Subtype override** — replace the account subtype shown in reports (ie: "Short Term Liability", "Long Term Liability", "Equities", "Bonds").
- **Holding Category override (account‑level)** — default holding category for all holdings in the account.
- **Add to Dashboard Accounts list** — include account summary on the Dashboard.
- **Ignore in Left to Spend** — exclude this account in the Budget / Left to Spend from being included.

---





### Reports / Investments

There are three types of Investment reports:

1. **Positions** - Displays all your current holdings for each account. Use Allocation report to combine same holdings.
2. **Allocation** - Displays all your current holdings with same holdings combined. Use Portfolio report to split like holdings.
3. **Performance** - Displays all your equity holdings ignoring Fixed Income & Cash. Shows price performance over your selected time frame. Click on the date header to change the range (ie: Past Week, This Month, This Year, etc.)
4. **Fixed Income** - Displays all your fixed income (CD & Bond) holdings and trying to extract a maturity date and yearly income from the description.

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

- **Holding Category override (ticker or account)** — assign a category (Sector, Asset Class, your objective, Index Strategy, Bond Type, etc.) either per‑ticker or at the account level.  In my examples below, I use a **sector**.

- If you assign a Category override for all holdings, any uncategorized or new tickers will show up in the “Stock” category—making it easy to spot misses and newly added stocks.

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

- Household breakdown on Accounts
<br>
<img src="images/MT_V3_13.png" style="width:60%; height:auto;">

---
