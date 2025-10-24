## 📖 Documentation & Help:

If you're using Monarch Money Tweaks (MMT), it's highly recommended to start by exploring Account Groups. Creating custom account groups can enhance the usefulness of the four reports in MMT by providing clearer organization and insights. Be sure to review the Account Groups section located at the bottom of this page to get started.


**Monarch Tweaks Settings**
![Settings](/images/MT_V3_01.png)

**Monarch Tweaks - Set Groups that are Fixed vs Flexible**
![Settings](/images/MTFixed.png)

**Monarch Tweaks Spit Transaction 50/50**
![Settings](/images/MT_V3_03.png)

**Monarch Tweaks Reports - Simplified Budgeting by Trends**
![Settings](/images/MTTrendInfo.png)

**Monarch Tweaks Reports / Trends Compare**
![Settings](/images/MT_V3_04.png)

**Monarch Tweaks Reports / Trends Monthly Breakdown**
![Settings](/images/MT_V3_05.png)

**Monarch Tweaks Reports / Trends Yearly Breakdown**
![Settings](/images/MT_V3_06.png)

**Monarch Tweaks Reports / History Drill-down**
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

**Monarch Tweaks Reports tag multiple cells**
![Settings](/images/MT_V3_10.png)

**Personal Net Worth Report (Reports / Accounts / Personal Statement)**
![Settings](/images/MT_V3_12.png)

## Portfolio Rebalancing Analysis
> New feature for analyzing and rebalancing investment portfolios

The Rebalancing Analysis report provides a comprehensive view of your investment portfolio allocation and helps you maintain your target asset allocation strategy.

### Key Features:

**Automatic Cash Calculation:**
- Calculates "inferred cash" for each investment account
- Formula: Account Balance - Sum of All Holdings = Inferred Cash
- Pure cash positions don't appear in Monarch's holdings API, only money market funds do
- Adds CASH-INFERRED line items automatically

**Asset Class Categorization:**
Seven pre-configured asset classes with default target allocations:
- US Large/Mid (41.65% target)
- US Small (17.85% target)
- Int'l Large/Mid (17.85% target)
- Int'l Small (3.83% target)
- Int'l EM (3.83% target)
- Alternatives & Crypto (15.00% target)
- Cash (0.00% target)

**Allocation Analysis:**
- Current Value and Percentage for each asset class
- Target Percentage and Value
- Variance (how far you are from target)
- Dollar amount needed to reach target allocation
- Color-coded variance (Red = underweight, Green = overweight)

**Summary Cards:**
- Total Portfolio Value
- Total Cash Position (with alert if too high)
- Total Invested Amount
- Cash as Percentage of Portfolio

### How to Use:

1. Navigate to Reports section in Monarch Money
2. Click on the "Rebalancing" tab
3. View your current asset allocation vs. targets
4. Identify which asset classes are over/underweight
5. Use the variance column to prioritize rebalancing actions

### Configuration:

Asset class mappings are defined in the code and can be customized:
- Add your specific tickers to each asset class
- Modify target allocation percentages
- Configure cash threshold alerts in Settings > Display


## Account Groups 
> Extension added field found when **editing** an **Institution Account** in Monarch Money:

Account Groups allow you to break out your transactions (Income & Expenses) as well as your Accounts (Assets & Liabilities).

There are different scenerios that Monarch Money users use them in:

    * Personal vs Business
    * Household Members
    * Tax and Tax Deferred
    * Managed vs Non Managed
    * Family vs Kids
    * Credit Cards
    * Loans

For me personally, I have my accounts labeled five ways:  **Personal** (checking, house, cars, etc.), **Credit Cards** (all my credit cards), **Loans** (all other liabilities), **Managed** (investments managed) and **Non Managed** (investments non managed).
    
      
**Personal & Business**

If your accounts also have business accounts, consider adding "Personal", "Business" and "Both".

**Household Members**

If your accounts are designated as either yours personally, your partner's personally as well as maybe joint, you could assign each checking, savings, credit card, etc. account with either "Your Name", "Their Name", or "Both". Example:  "Jerry", "Elaine", "Both" rather than just "Personal".

**Tax and Tax Deferred**

If your accounts are designated as accounts you can touch (taxable) versus IRAs and other Tax Deferred accounts, you could assign each checking, savings, investment, etc. account with either "Taxable" or "Tax Deferred". 

**Managed and Non Managed**

If some accounts are managed by an advisor and some are not, you can assign "Managed" and "Non Managed" to different accounts to compare performance of both types of accounts. 

**Family vs Kids**

If there are investments or credit cards for kids use, you could further designate with "Family" or "Kids".


**Monarch Tweaks Household Description for Breakdown**
![Settings](/images/MT_V3_11.png)

**Monarch Tweaks Household Breakdown on Accounts**
![Settings](/images/MT_V3_13.png)


## Fixed vs Flexible Spending
> Extension added field found when selecting Settings / Categories in Monarch Money:

You can further define expenses **on the Group level** by either "Fixed Spending" or "Flexible Spending" when looking at Trends report and Tags report.   Select Settings / Categories and check the box as appropriate.   If there are no Account Groups that have been checked, these reports will not breakdown the expenses.

![Settings](/images/MM_FixedNoFixed.png)
