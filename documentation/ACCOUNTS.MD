## 📚 Reports / Accounts

MM‑Tweaks cand display your account balances in many different ways.

<img src="../images/MTAccountsV5a.png" style="width:66%; height:auto;">

(Standard, Brokerage, Personal Statement)
<br>
<img src="../images/MT_V3_07.png" style="width:66%; height:auto;">
<br>
<img src="../images/MT_V3_08.png" style="width:66%; height:auto;">
<br>
<img src="../images/MT_V3_12.png" style="width:66%; height:auto;">

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
