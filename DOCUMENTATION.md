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

<br>
<img src="images/MTFixed.png" style="width:66%; height:auto;">

---

### Overview Reports — Trends, Net Income, Accounts, Investments

Monarch Money Tweaks focuses on four enhanced reports: Trends, Net Income, Accounts, and Investments.  All four reports use the same flexible grid layout and share many features.
<br>

<img src="images/MT_V3_99.png" style="width:66%; height:auto;">

Highlights:
- **Sub Report**: view the report from different perspectives.  
- **Group By**: change how the report groups data (category, group, account, etc.).  
- Click any column header to sort ascending/descending.  
- **Account Group Filter** appears after you assign account groups.

---

### Use Reports / Accounts for special MM-Tweaks Account Settings

Select **Reports → Accounts**, click **>** (far right) on an account, open the side panel `...` to access MM‑Tweaks account options.

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

#### Reports / Trends — Compare, Monthly & Yearly

MM‑Tweaks derives Trends from transactions and transaction history only — it does not use any Budget, Goals, or Recurring data. For me personally, I prefer this simpler workflow: use transactions as the single source of truth so I don’t have to maintain other data in Monarch. Think of Trends as a practical alternative to traditional budgeting: it builds budget guidance from actual transaction trends (last month, same month last year, same quarter, etc.).

<img src="images/MT_V3_04.png" style="width:66%; height:auto;">

- Compare views, monthly/yearly rollups, and drilldowns into history are supported.
- History drilldowns show per‑month details and allow opening side‑panel details.

<br>
<img src="images/MT_V3_History.png" style="width:60%; height:auto;">

#### Reports / Net Income (by Tags, by Account, by Notes, by Owner)
<br>
<img src="images/MT_V3_09.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_TagNotes.png" style="width:60%; height:auto;">
<img src="images/MT_TagsNotes2.png" style="width:60%; height:auto;">

#### Reports / Accounts (Standard, Brokerage, Personal Statement, Overall Cash Statement)
<br>
<img src="images/MT_V3_07.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_V3_08.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_V3_12.png" style="width:66%; height:auto;">

---

### Accounts — Overall Cash Statement (how cash is computed)

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

1. **Positions** - Displays all your current holdings for each account. Use Allocation report to combine same holdings.
2. **Allocation** - Displays all your current holdings with same holdings combined. Use Portfolio report to split like holdings.
3. **Performance** - Displays all your equity holdings ignoring Fixed Income & Cash. Shows price performance over your selected time frame. Click on the date header to change the range (ie: Past Week, This Month, This Year, etc.)

Portfolio, account, holding, and allocation views are supported.

<br>
<img src="images/MT_Invest01.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_Invest02.png" style="width:66%; height:auto;">

Detailed views:
<br>
<img src="images/MT_Invest03.png" style="width:50%; height:auto;">
<img src="images/MT_Invest04.png" style="width:50%; height:auto;">

- Investments cards and holdings examples:
<br>
<img src="images/MT_Invest01.png" style="width:66%; height:auto;">
<img src="images/MT_Invest02.png" style="width:66%; height:auto;">
<img src="images/MT_Invest03.png" style="width:50%; height:auto;">

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
