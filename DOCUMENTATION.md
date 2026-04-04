## 📚 Getting Started & Documentation

### Monarch Money Tweaks — Installation, License & Security

Install Monarch Money Tweaks from the [Extensions area](https://github.com/RobertParesi/Monarch-Money-Tweaks/blob/main/README.md) for your browser:  

Click here for detailed information on [License](https://github.com/RobertParesi/Monarch-Money-Tweaks/blob/main/LICENSE.md) and [Security](https://github.com/RobertParesi/Monarch-Money-Tweaks/blob/main/SECURITY.md). 

🧑‍💻 After installing, refresh the Monarch Money web app.  

⚙️ MM‑Tweaks settings are accessible inside the Monarch UI: click your name (lower-left) → **Settings**.

Quick start (recommended order):
1. Settings → Display — initial MM‑Tweaks options  
2. Settings → Categories — configure Fixed vs Flexible spending grouping  
3. Reports → Accounts → click **>** for each account to set Account Groups  
4. Explore Reports → Trends, Net Income, Accounts, Investments

---

### Monarch Money Tweaks — Settings

<br>
<img src="images/MT_V3_01.png" style="width:66%; height:auto;">

---

### Fixed vs Flexible Spending

MM‑Tweaks classifies spending at the *Group* level (not Monarch’s built‑in Fixed/Flexible). To set this:
- Go to **Settings → Categories** and mark groups as Fixed or Flexible.
- MM‑Tweaks uses those group flags in Trends and Net Income reports.

<br>
<img src="images/MTFixed.png" style="width:66%; height:auto;">

---

### Account Settings (Per‑account overrides)

Open **Reports → Accounts** and click **>** for an account, then the `...` in the side panel.

<br>
<img src="images/MTAccountSettings.png">

#### Account Group
Use account groups to organize reports by any label you want:
- Personal vs Business (e.g., `Personal`, `Business`)  
- Household members (`You`, `Partner`, `Kids`)  
- Tax treatment (`Taxed`, `Tax Deferred`)  
- Management (`Managed`, `Non Managed`)  
- Types (`Credit Cards`, `Retirement`, `Trust`, `Homes`, `Loans`)  

Examples (author preference):
- Investments → `Managed` / `Non Managed`  
- Credit cards → `Credit Cards`  
- Property / vehicles → `Trust` or `Non Trust`

#### Subtype override
Override the account subtype shown in reports (optional). Leave blank to use Monarch’s subtype.

#### Holding Category override (account‑level)
Set a default holding category applied to all holdings in the account (useful when all holdings share the same sector/type).

#### Add to Dashboard Accounts list
Enable to include this account’s summary on the Monarch Dashboard.

---

### Investment Holding Settings

Open **Reports → Investments**, select a holding and click the `...` in the holding side panel.

![Settings](/images/MTInvestmentSettings.png)

#### Holding Category override (ticker or account)
- Override a holding’s assigned type (Sector, Asset Class, Bond Type, etc.) at the holding or account level.
- Account-level override applies to all holdings without a ticker.

---

### Reports (Trends, Net Income, Accounts, Investments)

All four reports use the same flex‑grid layout.

<br>
<img src="images/MT_V3_99.png">

Highlights:
- Use **Sub Report** to view different perspectives of the same data.
- Choose **Group By** to change grouping for the report.
- Click any column header to sort ascending/descending.
- After assigning Account Groups, the **Account Group Filter** appears.

#### Trends — Compare, Monthly & Yearly sub‑reports
<br>
<img src="images/MT_V3_04.png" style="width:66%; height:auto;">

#### Trends — Compare
<br>
<img src="images/MTTrendInfo.png" style="width:66%; height:auto;">

#### Trends — Monthly
<br>
<img src="images/MT_V3_05.png" style="width:66%; height:auto;">

#### Trends — Yearly
<br>
<img src="images/MT_V3_06.png" style="width:66%; height:auto;">

#### Trends — History drill‑down
<br>
<img src="images/MT_V3_History.png" style="width:60%; height:auto;">

#### Net Income (Tags / Notes)
<br>
<img src="images/MT_V3_09.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_TagNotes.png" style="width:60%; height:auto;">
<img src="images/MT_TagsNotes2.png" style="width:60%; height:auto;">

#### Accounts
<br>
<img src="images/MT_V3_07.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_V3_08.png" style="width:66%; height:auto;">

---

### Accounts — Overall Cash Statement (How cash is computed)

Monarch provides both an *Account Balance* and *holdings* snapshot.  
Uninvested cash = Account Balance − sum(holdings value) at the snapshot.

If cash looks wrong:
1. Verify holdings are present in the account (missing holdings cause mismatch).  
2. If the account contains crypto or manual holdings, MM‑Tweaks may skip cash computation for that account (these can skew the balance).  
3. If data seems correct but numbers still differ, contact Monarch support or reach out via the repo discussion / email.

To make cash appear in Cash Holdings:
- Go to Accounts → select account → Holdings → click `>` next to holding → set Type to **Cash**.

---

#### Personal Statement (example)
<br>
<img src="images/MT_V3_12.png" style="width:66%; height:auto;">

#### Tag multiple cells (example)
<br>
<img src="images/MT_V3_10.png" style="width:66%; height:auto;">

---

### Investments — Reports & Details

Overview, detail, and allocation views:

<br>
<img src="images/MT_Invest01.png" style="width:66%; height:auto;">
<br>
<img src="images/MT_Invest02.png" style="width:66%; height:auto;">

#### Investment detail & holdings
<br>
<img src="images/MT_Invest03.png" style="width:50%; height:auto;">
<br>
<img src="images/MT_Invest04.png" style="width:50%; height:auto;">

---

📌 **When configuring allocation targets, set them at the following levels (all three where applicable):**

1. Portfolio → Allocation OR Performance (choose the appropriate top‑level view).  
2. Institution → by Account → by Account Subtype → by Holding Type → or by Category.  
3. Account Group (if you use Account Groups) — set targets at the Account Group level as needed.

This ensures targets apply correctly in the Reports → Investments Allocation and Performance views across portfolio, accounts, and grouped reports.

<br>
<img src="images/MT_Invest05.png" style="width:50%; height:auto;">
<br>
<img src="images/MT_Invest06.png" style="width:50%; height:auto;">

---

### Other MM‑Tweaks features

- Split Transaction 50/50
<br>
<img src="images/MT_V3_03.png" style="width:60%; height:auto;">

- Household breakdown on Accounts
<br>
<img src="images/MT_V3_13.png" style="width:60%; height:auto;">

---
