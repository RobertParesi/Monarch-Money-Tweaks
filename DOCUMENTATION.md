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

<br>
<img src="images/MT_V3_01.png" style="width:66%; height:auto;">

MM‑Tweaks adds UI, preferences, and report improvements inside the Monarch web app. Most settings live in Monarch’s Settings panel after installation.

---

### Fixed vs Flexible Spending (group level)

MM‑Tweaks classifies spending at the *group* level (MM‑Tweaks uses Group-level flags rather than Monarch’s internal Fixed/Flexible).  
To configure: **Settings → Categories** → mark groups Fixed or Flexible. These flags are used by Trends and Net Income reports.

<br>
<img src="images/MTFixed.png" style="width:66%; height:auto;">

---

### Account Settings (per-account overrides)

Open **Reports → Accounts**, click **>** on an account, open the side panel `...` to access MM‑Tweaks account options.

<br>
<img src="images/MTAccountSettings.png" style="width:66%; height:auto;">

Key options:
- **Account Group** — group reports by any label you prefer (Personal, Business, Managed, Credit Cards, Trust, etc.). Useful examples:
  - Investments → `Managed` / `Non Managed` / `Tax Deferred`  
  - Credit cards → `Credit Cards`  
  - Property / vehicles → `Trust` / `Non Trust` / `Personal` / `John` / `Melonie` / `Kids`
- **Subtype override** — replace the account subtype shown in reports (ie: "Short Term Liability", "Long Term Liability", "Equities", "Bonds").
- **Holding Category override (account‑level)** — default holding category for all holdings in the account.
- **Add to Dashboard Accounts list** — include account summary on the Dashboard.

---

### Investment Holding Settings

Open **Reports → Investments**, select a holding and click `...` in the holding side panel for MM‑Tweaks options.

![Settings](/images/MTInvestmentSettings.png)

- **Holding Category override (ticker or account)** — assign a category (Sector, Asset Class, Bond Type, etc.) either per‑ticker or at the account level.

---

### Reports — Overview (Trends, Net Income, Accounts, Investments)

All four reports use the same flexible grid layout and share many features.

<br>
<img src="images/MT_V3_99.png" style="width:66%; height:auto;">

Highlights:
- **Sub Report**: view the report from different perspectives.  
- **Group By**: change how the report groups data (category, group, account, etc.).  
- Click any column header to sort ascending/descending.  
- **Account Group Filter** appears after you assign account groups.

#### Trends — Compare, Monthly & Yearly
<br>
<img src="images/MT_V3_04.png" style="width:66%; height:auto;">

- Compare views, monthly/yearly rollups, and drilldowns into history are supported.
- History drilldowns show per‑month details and allow opening side‑panel details.

<br>
<img src="images/MT_V3_History.png" style="width:60%; height:auto;">

#### Net Income (Tags / Notes)
<br>
<img src="images/MT_V3_09.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_TagNotes.png" style="width:60%; height:auto;">
<img src="images/MT_TagsNotes2.png" style="width:60%; height:auto;">

#### Accounts (Standard, Brokerage, Cash Statement, Personal Statement)
<br>
<img src="images/MT_V3_07.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_V3_08.png" style="width:66%; height:auto;">

---

### Accounts — Overall Cash Statement (how cash is computed)
* Monarch returns an **Account Balance** at each snapshot.  
* Monarch returns the **Sum of all h_oldings** at each snapshot.
* MM-Tweaks calculates the _Idle Cash (cash uninvested) as **Account Balance - Sum of all holdings**.

If cash looks incorrect:
1. Verify no holdings are missing in the account.  
2. If the account contains crypto or manually added holdings, MM‑Tweaks may skip computing uninvested cash for that account.  
3. If everything looks correct but the amount still differs, contact Monarch support or reach out via repo discussion / email.

To show any holding as _Cash Holdings_ (SGOV, TIPS, SWTXX, etc.) select Accounts → select account → Holdings → click `>` next to the holding → set Type to **Cash**.

---

### Investments — reports, details and allocation

Portfolio, account, holding, and allocation views are supported.

<br>
<img src="images/MT_Invest01.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_Invest02.png" style="width:66%; height:auto;">

Detailed views:
<br>
<img src="images/MT_Invest03.png" style="width:50%; height:auto;">
<img src="images/MT_Invest04.png" style="width:50%; height:auto;">

---
### Allocation targets and notes


Set targets for any account, holding type, or category by clicking the > on the Total row (top header) in the grid.

<br>
<img src="images/MT_Invest05.png" style="width:50%; height:auto;">

<br>
<img src="images/MT_InvestAlloc.png" style="width:50%; height:auto;">

📌 When configuring allocation targets, set them at the appropriate levels so they behave consistently across portfolio and filtered/grouped views:

1. **Portfolio** → Allocation OR Performance (top-level portfolio view).  
2. **Institution** → by **Account** → by **Account Subtype** → by **Holding Type** → or by **Category** (choose the breakdown you need).  
3. **Account Group** (if you use Account Groups) — set targets per Account Group so filtered/grouped reports honor the group allocations.

<br>
<img src="images/MT_Invest06.png" style="width:50%; height:auto;">

Notes:
- Targets do **not** need to sum to 100% (e.g., set 70% Fixed Income and leave the remainder unspecified).  
- Verify targets in both Allocation and Performance views — behavior can differ depending on selected report and grouping.


---

### Examples & UI tips

- Personal Statement, multi‑cell tagging, and allocation examples:
<br>
<img src="images/MT_V3_12.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_V3_10.png" style="width:66%; height:auto;">

- Investments cards, holdings and allocation examples:
<br>
<img src="images/MT_Invest01.png" style="width:66%; height:auto;">
<img src="images/MT_Invest02.png" style="width:66%; height:auto;">
<img src="images/MT_Invest03.png" style="width:50%; height:auto;">

---

### Other MM‑Tweaks features

- Split transaction 50/50
<br>
<img src="images/MT_V3_03.png" style="width:60%; height:auto;">

- Household breakdown on Accounts
<br>
<img src="images/MT_V3_13.png" style="width:60%; height:auto;">

---
