## 📚 Reports / Accounts

MM‑Tweaks cand display your account balances in many different ways.

<img src="../images/MTAccountsV5a.png" style="width:66%; height:auto;">

**Standard Report** show all your accounts by Assets and Liabilities.  Use the Sub Report pull down to group the report many different ways.

<img src="../images/MT_V3_07.png" style="width:66%; height:auto;">
<br>
<img src="../images/MT_V3_08.png" style="width:66%; height:auto;">

---

**Personal Statement** shows a simple Balance Sheet of your Assets and Liabilities.  This report would be good to give to a loan-officer.

<img src="../images/MT_V3_12.png" style="width:66%; height:auto;">

---
**Brokerage Statement** displays just your investment accounts.

<img src="../images/MTAccountsV5d.png" style="width:66%; height:auto;">

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

### Accounts Settings

Click on the ⚙️ for settings specific to Accounts.

<img src="../images/AccountsV5f.png" style="width:60%; height:auto;">
