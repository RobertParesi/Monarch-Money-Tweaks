// ==UserScript==
// @name         Monarch Money Tweaks
// @version      4.17
// @description  Monarch Money Tweaks
// @author       Robert Paresi
// @match        https://app.monarch.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=app.monarch.com
// ==/UserScript==
const version = '4.17';
const Currency = 'USD', CRLF = String.fromCharCode(13,10);
const graphql = 'https://api.monarch.com/graphql';
const eqTypes = ['equity','mutual_fund','cryptocurrency','etf'];
let css = {headStyle: null, reload: true, green: '', red: '', greenRaw: '', redRaw: '', header: '', subtotal: ''};
let glo = {pathName: '', spawnProcess: 8, debug: 0, cecIgnore: false, flexButtonActive: false, tooltipHandle: null, accountsHasFixed: false};
let accountGroups = [],TrendQueue = [], TrendQueue2 = [], TrendPending = [0,0];
let portfolioData = null, performanceData=null, accountsData = null, transData=null;

// flex container
const FlexOptions = ['MTTrends','MTNet_Income','MTAccounts', 'MTInvestments'];
let MTFlex = [], MTFlexTitle = [], MTFlexRow = [], MTFlexCard = [];
let MTFlexAccountFilter = {name: '', filter: []};
let MTFlexCR = 0, MTFlexTable = null, MTP = null, MTFlexSum = [0,0];
let MTFlexDate1 = new Date(), MTFlexDate2 = new Date();

function MM_Init() {

    MM_RefreshAll();

    const a = isDarkMode();
    if(a == null) {css.reload = true;return;}
    const panelBackground = 'background-color: ' + ['#FFFFFF;','#222221;'][a];
    const panelText = 'color: ' + ['#777573;','#989691;'][a];
    const standardText = 'color: ' + ['#22201d;','#FFFFFF;'][a];
    const sidepanelBackground = 'background: ' + ['#e0f5fd;','#373736;'][a];
    const selectBackground = 'background-color: ' + ['#def7f9;','#082c36;'][a];
    const selectForground = 'color: ' + ['#107d98;','#4ccce6;'][a];
    const accentColor = '#ff692d;';
    const bdr = 'border: 1px solid ' + ['#e4e1de;','#62605D;'][a];
    const bdrb = 'border-bottom: 1px solid ' + ['#e4e1de;','#62605D;'][a];
    const bdrb2 = 'border-bottom: 1px solid ' + ['#e4e1de;','#363532;'][a];
    const bs = 'box-shadow: rgba(8, 40, 100, 0.04) 0px 4px 8px;border-radius: 8px;';

    css.header = getCookie('MT_ColorHigh',false);
    css.subtotal = getCookie('MT_ColorLow',false);

    if(css.header == '') {css.header = ['#e6e4e0','rgb(68,68,68)'][a];}
    if(css.subtotal == '') {css.subtotal = ['#f9f6f3','rgb(48,48,48)'][a];}
    css.header = 'background-color:' + css.header + ';';
    css.subtotal = 'background-color:' + css.subtotal + ';';

    css.green = 'color:' + ['#2a7e3b','#3dd68c'][a] + ';';
    css.red = 'color:' + ['#d13415','#f9918e'][a] + ';';
    css.greenRaw = ['#2a7e3b','#3dd68c'][a];
    css.redRaw = ['#d8543a','#f9918e'][a];

    MTFlexDate1 = getDates('d_StartofMonth');MTFlexDate2 = getDates('d_Today');
    if(getCookie('MT_PlanCompressed',true) == 1) {addStyle('.earyfo, .gwrczp, .hIruVD, .jduSPT {height: 36px; font-size: 14px;}');addStyle('.dzNuLu, .fgtPHG, .dVgTYt, .djwbSf {height: 26px; font-size: 14px;}');}
    if(getCookie('MT_CompressedTx',true) == 1) {addStyle('.dnAUzj {padding-top: 1px; padding-bottom: 1px;}');addStyle('.dHdtJt,.bmeuLc,.dUcLPZ,.hNpQPw,.iRHwlh {font-size:14px;}');}
    if(getCookie('MT_PendingIsRed',true) == 1) {addStyle('.bmeuLc {color:' + accentColor + '}');}
    if(getCookie('MT_Ownership',true) == 1) {addStyle('.lofHBB {display:none;}');}
    addStyle('.MTBub {margin-bottom: 12px;}');
    addStyle('.MTBub1 {cursor: pointer; float: right; margin-left: 10px;font-size: 13px; margin-bottom: 10px; padding: 2px; ' + bdr + bs + ' 4px; width: 150px; text-align: center;font-weight: 500;}');
    addStyle('.MTWait {width: 40%; margin-left: auto; margin-top: 100px;margin-right: auto;justify-content: center; align-items: center;}');
    addStyle('.MTWait2 {font-size: 17px; color:' + accentColor + 'font-weight: 500; font: "Oracle", sans-serif; ' + panelBackground + ' padding: 20px; ' + bs + ' 8px; text-align: center;}');
    addStyle('.MTWait2 p {' + standardText + 'font-family:  MonarchIcons, sans-serif, "Oracle" !important; font-size: 15px; font-weight: 200;}');
    addStyle('.MTPanelLink, .MTBudget a {background-color: transparent; font-weight: 500; font-size: 14px; cursor: pointer; color: rgb(50, 170, 240)}');
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    addStyle('.MTCheckboxClass, .MTFlexCheckbox, .MTFixedCheckbox, .MTDateCheckbox, .MTDashboardCheckbox {width: 19px; height: 19px; margin-right: 10px; float: inline-start; ' + (!isSafari ? 'color: #FFFFFF;accent-color:' + accentColor : '') + '}');
    addStyle('.MTItemClass { padding-top: 6px;padding-bottom: 6px;}');
    addStyle('.MTInputClass { margin-bottom: 12px; padding: 6px 12px; border-radius: 4px; background-color: transparent; ' + bdr + standardText +'}');
    addStyle('.MTInputTitle { font-size: 14px; height: 30px; font-weight: 500;}');
    addStyle('.MTModelContainer {position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);z-index: 1000;}');
    addStyle('.MTModelWindow {position: absolute; top: 25%;left: 35%; }');
    addStyle('.MTModelWindow2 {position: relative; width: 480px; height: 100%; ' + panelBackground + bs + '}');
    addStyle('.MTData {padding: 20px;}');
    addStyle('.MTRow {display: flex;  width: 100%;  padding-top: 12px;}');
    addStyle('.MTField1 {width: 30%;}');addStyle('.MTField2 {width: 70%;}');
    addStyle('.MTButtons { padding-right: 20px; display: flex;justify-content: space-between; width: 100%;}');
    addStyle('.MTWindowButton {margin-bottom: 20px;}');
    addStyle('.MTButtons .MTWindowButton:last-child { margin-left: auto;}');
    addStyle('.MTSideDrawerSummaryTag:hover, .' + FlexOptions.join(':hover, .') + ':hover {cursor:pointer;}');
    addStyle('.MTFlexButtonExport, .MTWindowButton, .MTFlexButton1, .MTFlexButton2, .MTFlexButton4, .MTSettButton1, .MTSettButton2, .MTHistoryButton, .MTSplitButton, .MTInputButton, .MTSettingsButton, .MTNoteTagButton {font-family: MonarchIcons, "Oracle", sans-serif; font-size: 14px;font-weight: 500; padding: 7.5px 12px;' + panelBackground + standardText + 'margin-left: 10px;' + bdr + bs + ' 4px;cursor: pointer;}');
    addStyle('.MTFlexExpand, .MTFlexSave, .MTFlexRestore, .MTFlexConfig {font-family: MonarchIcons; margin-left: 4px; margin-right: 4px; font-size: 19px; cursor: pointer;}');
    addStyle('.MTFlexContainer {display: block; padding-left: 16px; padding-bottom: 20px; padding-right: 20px;}');
    addStyle('.MTFlexContainer2 {margin: 0px;  gap: 16px;  display: flex; flex-wrap: wrap;}');
    addStyle('.MTFlexContainerPanel { display: flex; flex-flow: column; place-content: stretch flex-start; ' + panelBackground + bs + ' 8px;}');
    addStyle('.MTFlexContainerHeader { display: flex; justify-content: space-between;  padding: 16px 24px;');
    addStyle('.MTFlexContainerCard {  display: flex; flex: 1 1 0%; justify-content: space-between; padding: 16px 24px; align-items: center;' + panelBackground + bs + ' 8px;}');
    addStyle('.MTFlexGrid {' + panelBackground + 'padding: 5px 20px 20px 20px; border-spacing: 0px;}');
    addStyle('.MTFlexGrid th, td { padding-right: 6px; padding-left: 6px;}');
    addStyle('.MTFlexTitle2 {display: flex; flex-flow: column;}');
    addStyle('.MTFlexGridTitleRow { font-size: 15.1px; font-weight: 600; height: 40px; position: sticky; top: 0; ' + panelBackground + '}');
    addStyle('.MTFlexGridTitleCell2 { text-align: right;}');
    addStyle('.MTFlexGridTitleInd {display: inline-block; width: 10px;height: 10px; margin-right: 8px;border-radius:100%;}');
    addStyle('.MTFlexGridTitleCell:hover, .MTFlexGridTitleCell2:hover, .MTFlexGridDCell:hover, .MTFlexGridSCell:hover, .MThRefClass2:hover, .MThRefClass:hover, .MTSideDrawerDetail4:hover {cursor:pointer; color: rgb(50, 170, 240);}');
    addStyle('.MTFlexGridRow { font-size: 15.1px; font-weight: 600; height: 30px;}');
    addStyle('.MTFlexSpacer {width: 100%; margin-top: 3px; margin-bottom: 3px; ' + bdrb + '}');
    addStyle('.MTFlexGridItem { font-size: 14px; height: 30px;}');
    addStyle('.MTFlexGridItem:hover { ' + selectBackground + '}');
    addStyle('.MTFlexGridHCell, .MTFlexGridHCell2 { font-size: 15px;}');
    addStyle('.MTFlexGridHCell2 { text-align: right;}');
    addStyle('.MTFlexGridSHCell {font-size: 13px; font-weight: 600;}');
    addStyle('.MTFlexGridDCell, .MTFlexGridD3Cell, .MThRefClass, .MThRefClass2 {' + standardText +' }');
    addStyle('.MTFlexGridDCell, .MTFlexGridD3Cell {white-space: nowrap;  overflow: hidden;  text-overflow: ellipsis;}');
    addStyle('.MThRefClass2 {font-family: MonarchIcons, "Oracle", sans-serif;}');
    addStyle('.MTFlexGridDCell2 { text-align: right; }');
    addStyle('.MTFlexGridSCell,.MTFlexGridS3Cell, .MTFlexGridSCell2 { ' + css.subtotal + 'font-size: 15px; height: 30px;' + standardText + ' font-weight: 600; }');
    addStyle('.MTFlexGridSCell2 { text-align: right !important;}');
    addStyle('.MTFlexError {text-align: center;  font-weight: bold; width: 525px; margin: auto;margin-bottom: auto; margin-bottom: 20px;border: 0px; border-radius: 4px; line-height: 36px; color: white; background-color: ' + accentColor + '}');
    addStyle('.MTFlexBig {font-size: 20px;' + standardText + 'font-weight: 600; padding-top: 6px; padding-bottom: 6px;}');
    addStyle('.MTFlexCardBig {font-size: 20px;' + standardText + 'font-weight: 600; padding-top: 6px; text-align: center;}');
    addStyle('.MTFlexBig {font-size: 18px !important;}');
    addStyle('.MTFlexText {font-size: 14px;' + panelText + 'font-weight: 600;}');
    addStyle('.MTFlexSmall, .MTFlexLittle {font-size: 12px;' + panelText + 'font-weight: 600; padding-top: 2px; padding-bottom: 2px; text-transform: uppercase; line-height: 150%; letter-spacing: 1.2px;}');
    addStyle('.MTFlexLittle {font-size: 10px !important;}');
    addStyle('.MTFlexImage {border-radius: 100%; width: 23px; float: left; margin-right: 5px; background-size: cover;  background-repeat: no-repeat; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset; height: 23px;}');
    addStyle('.MTFlexCellArrow, .MTTrendCellArrow, .MTTrendCellArrow2 {' + panelBackground + standardText + 'width: 25px; height: 25px; font-size: 17px; font-family: MonarchIcons, sans-serif; padding: 0px; cursor: pointer; border-radius: 100%; border-style: none;}');
    addStyle('.MTFlexCellArrow:hover {border: 1px solid ' + sidepanelBackground + '; box-shadow: rgba(8, 40, 100, 0.1) 0px 1px 2px;}');
    addStyle('.MTSideDrawerRoot {position: absolute;  inset: 0px;  display: flex;  -moz-box-pack: end;  justify-content: flex-end;}');
    addStyle('.MTSideDrawerContainer {overflow: hidden; padding: 12px; width: 640px; -moz-box-pack: end; ' + sidepanelBackground + ' position: relative; overflow:auto;}');
    addStyle('.MTSideDrawerMotion {display: flex; flex-direction: column; transform:none;}');
    addStyle('.MTInputDesc {padding-bottom: 20px; padding-top: 10px; display: grid;}');
    addStyle('.MTSideDrawerHeader { font-family:  MonarchIcons, sans-serif, "Oracle" !important;' + standardText + ' padding: 8px; }');
    addStyle('.MTSideDrawerItem { margin-top: 5px; place-content: stretch space-between; display: flex; ');
    addStyle('.MTSideDrawerItem2 { place-content: stretch space-between; display: flex;');
    addStyle('.MTSideDrawerDetail, .MTSideDrawerDetailS, .MTSideDrawerSummaryTag { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 5px;' + standardText + ' width: 24%; text-align: right; font-size: 15px; }');
    addStyle('.MTSideDrawerDetail2, .MTSideDrawerDetail4 { ' + standardText + ' width: 24%; text-align: right; font-size: 14px; padding-right: 5px; }');
    addStyle('.MTSideDrawerDetail3 { ' + standardText + ' width: 13px; text-align: center; font-size: 13.5px; font-weight: 600; font-family: MonarchIcons, sans-serif !important; }');
    addStyle('.MTSideDrawerDetailS:hover, .MTGeneralLink:hover, .MTSortTableByColumn:hover {font-weight: 600  !important; cursor: pointer; color: rgb(50, 170, 240) !important;');
    addStyle('.MTSideDrawerSummary {' + bs + ' 8px; height: 200px; margin-top: 3px; margin-bottom: 10px; ' + panelBackground + ' overflow:auto;}');
    addStyle('.MTSideDrawerSummaryTag {background-color: ' + accentColor + 'border-right: 4px; border-top-left-radius: 8px;  border-bottom-left-radius: 0px;  border-bottom-right-radius: 0px;  border-top-right-radius: 8px;  color: white;  font-weight: bold;}');
    addStyle('.MTSideDrawerSummaryTable {font-size: 13px;text-align: left; width: 100%;}');
    addStyle('.MTSideDrawerSummaryTableTH {font-weight:600; position: sticky; top: 0; ' + panelBackground + '}');
    addStyle('.MTSideDrawerSummaryData {overflow: hidden; white-space: nowrap; text-overflow: ellipsis;max-width: 250px;}');
    addStyle('.MTSideDrawerSummaryData2 {text-align: right;}');
    addStyle('.MTdropdown a:hover {' + selectBackground + selectForground + ' }');
    addStyle('.MTFlexdown, .MTdropdown {float: right;  position: relative; display: inline-block; font-weight: 200;}');
    addStyle('.MTFlexdown-content {' + panelBackground + standardText + ';display:none; margin-top: 12px; padding: 12px; position: absolute; min-width: 278px; overflow: auto;' + bdr + bs + '8px ; right: 0; z-index: 1;}');
    addStyle('.MTFlexdown-content2 {' + panelBackground + standardText + ';display:none; margin-bottom: 14px; padding: 12px; min-width: 278px; ' + bdr + bs + '8px ; z-index: 1;}');
    addStyle('.MTFlexdown-content div,.MTFlexdown-content2 div {font-size: 0px; line-height: 2px; background-color: #ff7369;}');
    addStyle('.MTFlexdown-content a,.MTFlexdown-content2 a {' + panelBackground + standardText + ';font-size: 16px; text-align: left; border-radius: 4px; font-weight: 200; padding: 10px 10px; display: block;}');
    addStyle('.MTSpacerClass {width: 100%;  margin-top: 9px; margin-bottom: 9px; ' + bdrb2 + '}');
    addStyle('.trH {height: 4px;}');addStyle('.trH2 {height: 20px;vertical-align: top;}');
    addStyle('.show {display: block;}');
    addStyle('.MTBudget {margin-top: 20px;font-size: 14px;');
    addStyle('.MTBudget2 {float: right;}');
    addStyle('.MTChartContainer { border: 0px }');
    addStyle('.MTSideDrawerTickerSelect, .MTSideDrawerTickerSelectA {width: 50px;text-align: center;font-size: 15px;border-radius: 100px; height: 32px;padding-top: 5px;font-weight: 600;margin-left: 10px;cursor:pointer;}');
    addStyle('.MTSideDrawerTickerSelect:hover, .MTSideDrawerTickerSelectA {' + panelBackground + '}');
    addStyle('.Toast__Root-sc-1mbc5m5-0 {display: ' + getDisplay(getCookie("MT_HideToaster",false),'block;') + '}');
    addStyle('.ReportsTooltipRow__Diff-k9pa1b-3 {display: ' + getDisplay(getCookie("MT_HideTipDiff",false),'block;') + '}');
    addStyle('.AccountNetWorthCharts__Root-sc-14tj3z2-0 {display: ' + getDisplay(getCookie("MT_HideAccountsGraph",false),'block;') + '}');
    addStyle('.tooltip {position: relative; display: inline-block;}');
    addStyle('.tooltip .tooltiptext { width: 270px; font-size: 14px; font-weight: 600; text-align: left; padding: 10px; visibility: hidden; background-color: black; color: #fff; border-radius: 6px; position: absolute; z-index: 1; bottom: 1.5em; margin-left: -260px;}');
    addStyle('.tooltip .tooltiptext::after { position: absolute; top:100%; left: 50%; border-width: 5px; border-style: solid; border-color: black transparent transparent transparent;}');
    addStyle('.tooltip:hover .tooltiptext {visibility: visible; opacity: 1;}');
}

function MM_MenuFix() {
    const wbs = ['/advice','/investments','/objectives','/recurring','/plan'];
    const cks = ['MT_Advice','MT_Investments','MT_Goals','MT_Recurring','MT_Budget'];
    const divs = document.querySelectorAll('[class*="NavBarLink-sc"]');
    glo.debug = getCookie('MT_Log',true);
    for (const div of divs) {
        let j = startsInList(div.pathname,wbs);
        if(j > 0) {getCookie(cks[j-1],true) == 1 ? div.style.display = 'none' : div.style.display = '';}
    }
}

function MM_RefreshAll() {
    if (getCookie('MT:LastRefresh',false) != getDates('s_FullDate')) {
        if(getCookie('MT_RefreshAll',true) == 1) {refreshAccountsData();}}}

function MM_hideElement(qList,InValue,inStartsWith) {
    const els = document.querySelectorAll(qList);
    for (const el of els) { if(inStartsWith == null || el.innerText.startsWith(inStartsWith)) {InValue == 1 ? el.style.display = 'none' : el.style.display = '';}}
}

function MM_flipSideElement(inCookie) {
    flipCookie(inCookie,1);
    const cv = getCookie(inCookie,true);
    MM_hideElement('div.MTSideDrawerItem2',cv);
    return cv;
}
// [ Flex Queue MF_ Called externally, MT_ used internally]
function MF_SetupDates() {
    let ckd = getCookie(MTFlex.Name + 'LowerDate', false);
    ckd = ckd || (MTFlex.DateEvent == 2 ? 'd_StartofMonth' : '');
    MTFlexDate1 = ckd.startsWith('d_') ? getDates(ckd) : unformatQueryDate(ckd);

    ckd = getCookie(MTFlex.Name + 'HigherDate', false);
    ckd = ckd || 'd_Today';
    MTFlexDate2 = ckd.startsWith('d_') ? getDates(ckd) : unformatQueryDate(ckd);
}

function MF_QueueAddTitle(inCol,inTitle,p,inIsHidden) {
    let useHide = p.IsHidden;
    if(inIsHidden != null) {if(inIsHidden == inCol) useHide = true; else useHide = false;}
    if(useHide == undefined || useHide == null) useHide = false;
    if(p.ShowPercent == undefined) p.ShowPercent = null;
    MTFlexTitle.push({"Col": inCol, "Title": inTitle,"IsSortable": p.IsSortable, "Width": p.Width, "Format": p.Format, "FormatExtended": [], "ShowPercent": p.ShowPercent, "ShowPercentShade": p.ShowPercentShade, "ShowSort": p.ShowSort, "IsHidden": useHide, "IgnoreTotals": p.IgnoreTotals, "Indicator": p.Indicator});
    MTFlexTitle.sort((a, b) => (a.Col - b.Col));}

function MF_QueueAddRow(p) {
    MTFlexCR = MTFlexRow.length;
    p.PK = p.PK ?? '';p.SK = p.SK ?? '';p.IsHeader = p.IsHeader ?? false;
    MTFlexRow.push({"Num": MTFlexCR, "IsHeader": p.IsHeader, "SummaryOnly": p.SummaryOnly, "BasedOn": p.BasedOn, "IgnoreShade": p.IgnoreShade, "Section": p.Section, "PK": p.PK, "SK": p.SK, "UID": p.UID,"PKHRef": p.PKHRef, "PKTriggerEvent": p.PKTriggerEvent, "SKHRef": p.SKHRef, "SKlogoUrl": p.SKlogoUrl, "SKTriggerEvent": p.SKTriggerEvent, "Icon": p.Icon });
    for (let j = 1; j < MTFlexTitle.length; j++) {if(MTFlexTitle[j].Format > 0) {MTFlexRow[MTFlexCR][j] = 0;}}}

function MF_QueueAddCard(p) {
    MTFlexCard.push({"Col": p.Col, "Title": p.Title,"Subtitle": p.Subtitle, "Style": p.Style});}

async function MF_GridInit(inName, inDesc) {

    MTFlex = [];MTFlexTitle = [];MTFlexRow = []; MTFlexCR = 0;MTFlexCard = [];
    MTFlexAccountFilter.name = ''; MTFlexAccountFilter.filter = [];
    portfolioData = null; performanceData = null;
    accountsData = null; transData=null;
    document.body.style.cursor = "wait";MTFlex.Collapse = 1;
    let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
    if(topDiv) {
        topDiv = cec('div','MTWait',topDiv);
        topDiv = cec('div','MTWait2',topDiv,'Please Wait');
        MTFlex.Loading = cec('p','',topDiv,' Loading ' + inDesc + ' ...');
    }
    glo.spawnProcess = 0;MTFlex.Name = inName;MTFlex.Desc = inDesc;
    ['Button1', 'Button2', 'Button3', 'Button4'].forEach(btn => {MTFlex[btn] = getCookie(inName + btn, btn !== 'Button3');});
    MTFlex.RequiredCols = [];
    await buildCategoryGroups();
}

function MF_GridTip() {
    if(getCookie('MTHideReportTips',true) == 1) return '';
    switch (MTFlex.Name) {
        case 'MTInvestments':
            switch (MTFlex.Button2) {
                case 0: return 'Displays all your holdings, grouped different ways.';
                case 1: return 'Displays all your holdings with same holdings combined, grouped different ways.';
                case 2: return 'Displays your Stock, ETF, Mutual Fund & Crypto holdings with price performance over time.';
            }
            break;
        case 'MTTrends':
            switch (MTFlex.Button2) {
                case 0: return "Compare last month's income & spending versus this month's, along with year-to-date pace. Click on date to view as previous month.";
                case 1: return "Compare the same month last year's income & spending versus this month's, along with year-to-date pace. Click on date to view as previous month.";
                case 2: return "Compare the same quarter last year's income & spending versus this month's, along with year-to-date pace. Click on date to view as previous month.";
                case 3: return "Shows this year's income & spending by month with the monthly average. Click on date to view as previous month.";
                case 4: return "Shows last year's income & spending by month with the monthly average. Click on date to view as previous month.";
                case 5: return "Shows the last 12 months' income & spending by month with the monthly average. Click on date to view as previous month.";
                case 6: return "Shows two years ago's income & spending by month with the monthly average.";
                case 7: return "Shows three years ago's income & spending by month with the monthly average.";
                case 8: return "Shows yearly totals for all years with the yearly average.";
                case 9: return "Shows year-to-date totals (up to today) with the yearly average.";
            }
            break;
        case 'MTNet_Income':
            switch (MTFlex.Button2) {
                case 0: return "Shows Income & Spending by tags. Click on date to change date range.";
                case 1: return "Shows Income & Spending by tags, including hidden transactions.";
                case 2: return "Shows Income & Spending by tags for only hidden transactions.";
                case 3: return "Shows Income & Spending by note tags (notes which start with an asterisk, like *Vacation or *Hawaii).";
                case 4: return "Shows Income & Spending by accounts. Great for account reconciliation and comparing with institution websites and statements.";
                case 5: return "Shows Income & Spending related to a goal.";
                case 6: return "Shows Income & Spending related to Shared Views, either Shared or Owner.";
            }
            break;
        case 'MTAccounts':
            switch (MTFlex.Button2) {
                case 0: return "Shows all assets and liabilities within a date range. Click on date to change the range.";
                case 1: return "Shows a consolidated Personal Net Worth Statement for loans and other assets.";
                case 2: return "Shows all investment assets with beginning and ending balances, including Transfers (Ins/Outs).  To exclude transfers from the Net Change amount, see Settings.";
                case 3: return "Shows account balances for the last six months. Click on date range to select the last month.";
                case 4: return "Shows account balances for the last twelve months. Click on date range to select the last month.";
                case 5: return "Shows account balances over time for this year. Click on date range for the last month.";
                case 6: return "Shows account balances over time by quarter for the past three years. Click on date range for the last month.";
            }
            break;
    }
}

function MF_GridOptions(Num,Options) {
    const buttonName = 'Button' + Num;
    MTFlex[`${buttonName}Options`] = Options;
    if (MTFlex[buttonName] >= MTFlex[`${buttonName}Options`].length) { MTFlex[buttonName] = 0; }
    if(Num == 4) {
        if(MTFlex.Button4Options.length > 1 && MTFlex.Button4 > 0) {
            MTFlexAccountFilter.name = getAccountGroupFilter();
            MTFlexAccountFilter.filter = getAccountGroupInfo(MTFlexAccountFilter.name,false);
        }
    }
}

function MF_GridDraw(inRedraw) {
    removeAllSections('div.MTWait');
    removeAllSections(['div.MTFlexContainer','table.MTFlexGrid'][inRedraw]);
    if(inRedraw == false) {MT_GridDrawContainer();}
    MT_GridDrawSort();
    MT_GridDrawDetails();
    MT_GridDrawExpand();
    if(inRedraw == false) {MT_GridDrawCards();}
    if(glo.debug == 1) console.log('MM-Tweaks','FlexGrid',MTFlex,MTFlexTitle,MTFlexRow);
    document.body.style.cursor = "";
}

function MT_GridDrawDetails() {
    let el = null, elx = null;
    let Header = null, SubHeader = false, pct = null;
    let useDesc = '', useStyle = '', useStyle2 = '';
    let useValue = 0, useValue2 = '', workValue = 0, workValue2 = 0;
    let rowVal = 0, rowI = 0, rowsInc = 0, rowIs = MTFlexRow.length -1;
    let Grouptotals = [];
    let FontFamily = getCookie('MT_MonoMT',false);
    if(FontFamily && FontFamily != 'System') {FontFamily = 'font-family: ' + FontFamily + ';';}
    if(MTFlex.TableStyle) FontFamily = FontFamily + MTFlex.TableStyle;

    let hide = getChecked(MTFlex.Button3,'');
    MTFlexSum = [0,0];

    MT_GridDrawClear();
    MT_GridDrawTitles();
    for (rowI = 0; rowI < MTFlexRow.length; rowI++) {
        MT_GridDrawRow(false);
        if (rowI == rowIs) { MT_GridDrawRow(true);} else if (MTFlexRow[rowI].Section != MTFlexRow[rowI+1].Section || MTFlexRow[rowI].PK != MTFlexRow[rowI+1].PK) {
            if(rowsInc > 0) {MT_GridDrawRow(true);}
            MT_GridDrawClear();
        }
    }

    if(rowI < 1) { cec('div','MTFlexError',MTFlexTable,'No records in ' + MTFlex.Title1 + '.\nCheck date range & selections above.');}

    function MT_GridDrawClear() {rowsInc = 0; for (let j=0; j < MTFlexTitle.length; j++) {Grouptotals[j] = null;}}

    function MT_GridDrawTitles() {

        Header = cec('table','MTFlexGrid',MTFlexTable,'','',FontFamily);
        if(MTFlex.HideDetails == true) return;
        el = cec('tr','MTFlexGridTitleRow',Header,'','',MTFlex.CanvasTitle);
        for (rowI = 0; rowI < MTFlexTitle.length; rowI++) {
            if(MTFlexTitle[rowI].IsHidden != true) {
                if(MTFlexTitle[rowI].ShowPercent == null && MTFlexTitle[rowI].Format < 1) {useStyle = 'MTFlexGridTitleCell'; } else {useStyle = 'MTFlexGridTitleCell2'; }
                if(MTFlexTitle[rowI].Indicator != null) {
                    elx = cec('td',useStyle,el,'','','','Column',rowI.toString());
                    cec('div','MTFlexGridTitleInd',elx,'','','background-color: ' + MTFlexTitle[rowI].Indicator + ';');
                    cec('div',useStyle,elx,MTFlexTitle[rowI].Title + ' ' + MTFlexTitle[rowI].ShowSort,'','display: inline-block; border-bottom: 0px;','Column',rowI.toString());
                } else {
                    elx = cec('td',useStyle,el,MTFlexTitle[rowI].Title + ' ' + MTFlexTitle[rowI].ShowSort,'','','Column',rowI.toString());
                }
                if(MTFlexTitle[rowI].Width != '') {elx.style = 'width: ' + MTFlexTitle[rowI].Width;}
            }
        }
        if(MTFlex.TriggerEvents) { cec('td','',el);}
    }

    function MT_GridDrawRow(isSubTotal) {
        let useRow = Object.assign({}, MTFlexRow[rowI]);
        let HeaderStyle = '', skipColumns = 0;

        if(MT_GridDrawRowTitle() == false) return;
        MT_GridDrawRowDetail();
        MT_GridDrawTriggerEvents();
        MT_GridDrawLine();
        glo.cecIgnore = false;

        function MT_GridDrawRowTitle() {
            if(useRow.IsHeader == true) {HeaderStyle = 'border-radius: 10px 0px 0px 10px;' + css.header ;}
            if(!isSubTotal) {
                if (MTFlex.RequiredCols.length > 0) {
                    let allow = false;
                    for (const cI of MTFlex.RequiredCols) {
                        const value = useRow[cI];
                        if (value != null) {
                            const format = MTFlexTitle[cI].Format;
                            if ((format > 0 && value !== 0) || (format <= 0 && value !== '')) {allow = true; break;}
                        }
                    }
                    if (!allow) return false;
                }
                rowsInc++;
                useDesc = useRow[0];
                if(useRow.IsHeader) {
                    if(useRow.SummaryOnly) { el = cec('tr','MTFlexGridRow',Header);useDesc = '  ' + useDesc;
                                                   } else { el = cec('tr','MTFlexGridRow',Header,'','','','MTsection',useRow.Section);useDesc = ' ' + useDesc;}
                    useStyle = 'MTFlexGridHCell';
                } else {
                    if(MTFlex.HideDetails) glo.cecIgnore = true;
                    if(SubHeader == false && MTFlex.Subtotals == true) {
                        let shDesc = useRow.PK;if(MTFlex.PKSlice) {shDesc = shDesc.slice(MTFlex.PKSlice);}
                        el = cec('tr','',Header,'','',MTFlex.CanvasRow,'MTsection',useRow.Section);
                        cec('td','MTFlexGridSHCell',el,shDesc,'',MTFlex.CanvasRow,'colspan',MTFlexTitle.length-1);
                        SubHeader = true;
                    }
                    el = cec('tr','MTFlexGridItem',Header,'','',MTFlex.CanvasRow,'MTsection',useRow.Section);
                    useStyle = 'MTFlexGridDCell';
                    if(useRow.Icon) {useDesc = useRow.Icon + ' ' + useDesc;}
                }
                if(MTFlexTitle[0].IsHidden != true) {
                    if(useRow.SKHRef) {
                        elx = cec('td',useStyle,el,'','',HeaderStyle);
                        if(useRow.SKlogoUrl) {cec('td','MTFlexImage',elx,'','','background-image: url("' + useRow.SKlogoUrl + '");');}
                        cec('a',useStyle,elx,useDesc,useRow.SKHRef);
                    } else {
                        elx = cec('td', useRow.IsHeader ? 'MThRefClass2' : useStyle, el, useDesc,'',HeaderStyle);
                    }
                    if(useRow.IsHeader && MTFlex.SpanHeaderColumns > 0) {elx.setAttribute('colspan',MTFlex.SpanHeaderColumns);}
                }
            } else {
                SubHeader = false;
                if(useRow.IsHeader || MTFlex.Subtotals != true) {return false;}

                useRow.IgnoreShade = true;
                useDesc = useRow.PK;if(MTFlex.PKSlice) {useDesc = useDesc.slice(MTFlex.PKSlice);}

                for (let j = 0; j < MTFlexTitle.length; j++) {useRow[j + 1] = Grouptotals[j];}
                for (let j = 0; j < MTFlexTitle.length; j++) {
                    if(MTFlexTitle[j].FormatExtended.length == 2) { MT_GridDrawRowSub(j,MTFlexTitle[j].FormatExtended[0],MTFlexTitle[j].FormatExtended[1]); }
                }

                el = cec('tr','MTFlexGridItem',Header,'','',MTFlex.CanvasRow,'MTsection',useRow.Section);
                if(MTFlexTitle[0].IsHidden != true) {
                    if(useRow.PKHRef) {
                        elx = cec('td','MTFlexGridSCell',el);
                        cec('a','MTFlexGridDCell',elx,useDesc,useRow.PKHRef);
                    } else {
                        elx = cec('td',MTFlex.HideDetails == true ? 'MTFlexGridDCell' : 'MTFlexGridS3Cell',el,useDesc);
                    }
                    if(MTFlex.SpanHeaderColumns > 0) {elx.setAttribute('colspan',MTFlex.SpanHeaderColumns);}
                }
                MTFlex.HideDetails == true ? useStyle = 'MTFlexGridDCell' : useStyle = 'MTFlexGridSCell';
            }
            return true;
        }

        function MT_GridDrawRowDetail() {
            if(useRow.IsHeader == true) {HeaderStyle = css.header;}
            if (useDesc) {if(useDesc.startsWith('')) useDesc = useDesc.slice(2);}
            useStyle = useStyle + '2';

            if (useRow.IsHeader == true || isSubTotal == true) {
                if(MTFlex.SpanHeaderColumns > 0) {skipColumns = MTFlex.SpanHeaderColumns -1;}
            }

            for (let j = 1; j < MTFlexTitle.length; j++) {
                const thisTitle = MTFlexTitle[j];
                if(thisTitle.IsHidden != true) {
                    if(skipColumns > 0) { skipColumns -=1;continue;}

                    if(useRow.IsHeader == true) {
                        if(j == MTFlexTitle.length -1 && MTFlex.TriggerEvents < 1) {
                            HeaderStyle = 'border-radius: 0px 10px 10px 0px;' + css.header;
                        }
                    }
                    useValue = useRow[j];
                    useValue2 = MT_GetFormattedValue(thisTitle.Format,useValue);
                    useStyle2 = '';

                    // Calc Percentages
                    if((thisTitle.ShowPercent != null)) {
                        workValue = null;workValue2 = null;
                        switch (thisTitle.ShowPercent.Type) {
                            case 'Row':
                                for (let k = 0; k < thisTitle.ShowPercent.Col1.length; k++) {
                                    rowVal = useRow[thisTitle.ShowPercent.Col1[k]];
                                    if(rowVal != null) {
                                        if(k == 0) {workValue = rowVal;} else {
                                            workValue += (thisTitle.ShowPercent.Operand == '+') ? rowVal : -rowVal;
                                        }
                                    }
                                }
                                for (let k = 0; k < thisTitle.ShowPercent.Col2.length; k++) {
                                    rowVal = useRow[thisTitle.ShowPercent.Col2[k]];
                                    if(rowVal != null) {
                                        if(k == 0) {workValue2 = rowVal;} else {
                                            workValue2 += (thisTitle.ShowPercent.Operand == '+') ? rowVal : -rowVal;
                                        }
                                    }
                                }
                                break;
                            case 'Column':
                                if(thisTitle.ShowPercent.Col1 != undefined) {
                                    if(thisTitle.ShowPercent.BasedOn != undefined) {
                                        workValue = MF_GridGetValue(thisTitle.ShowPercent.BasedOn,thisTitle.ShowPercent.Col1);
                                    } else {
                                        workValue = MF_GridGetValue(useRow.BasedOn,thisTitle.ShowPercent.Col1);
                                    }
                                    useValue = useRow[thisTitle.ShowPercent.Col1];
                                } else {
                                    workValue = MF_GridGetValue(useRow.BasedOn,j);
                                }
                                workValue2 = useValue;
                                break;
                            default:
                                return;
                        }
                        pct = MT_GridPercent(workValue,workValue2,thisTitle.ShowPercentShade, thisTitle.ShowPercent.Type == 'Row' ? 1 : 2,useRow.IgnoreShade);
                        useValue2 = useValue2 + ' ' + pct[0];
                        useStyle2 = pct[1];
                    }
                    if(useRow.IsHeader == true || isSubTotal == true) {
                        if(thisTitle.IgnoreTotals == true) { useValue = ''; useValue2 = ''; }
                    }

                    // Write Detail
                    if(thisTitle.ShowPercent == null && thisTitle.Format < 1) {
                        cec('td', isSubTotal ? useStyle : 'MTFlexGridD3Cell', el, useValue2,'',HeaderStyle);
                    } else {
                        if(useStyle2 == '') { useStyle2 = MT_GridDrawEmbed(useRow.Section,j,useValue,useDesc);}
                        if(useStyle2) {elx = cec('td',useStyle,el,useValue2,'',useStyle2+HeaderStyle);} else {elx = cec('td',useStyle,el,useValue2,'',HeaderStyle);}
                        if(useRow[j] != null) { Grouptotals[j-1] += useValue; }
                    }

                    // Write out cards
                    if(MTFlex.AutoCard != undefined) {
                        if(MTFlex.AutoCard.Column == j) {
                            let runCard = false;
                            if(MTFlex.AutoCard.Section == -1 && useRow.Section % 2 == 1) runCard = true;
                            if(MTFlex.AutoCard.Section > 0) {
                                if((isSubTotal == true && MTFlex.AutoCard.Section == useRow.Section) || (isSubTotal == false && MTFlex.AutoCard.Section -1 == useRow.Section)) {runCard = true;}
                            }
                            if(runCard == true) {
                                MTP.Col = 1 + (MTFlexCard.length+1);
                                if(isSubTotal == true || MTFlex.AutoCard.Section == -1) {MTP.Subtitle = useDesc;} else {MTP.Subtitle = MTFlex.AutoCard.Title;}
                                if(MTFlex.AutoCard.Chop != undefined) {MTP.Title = useValue2.slice(0,MTFlex.AutoCard.Chop);} else {MTP.Title = useValue2;}
                                if(MTFlex.AutoCard.Split == true) {MTP.Title = MTP.Title.replace(' ','\n');}
                                if(MTP.Title[0] == '-') {MTP.Style = css.red;} else {MTP.Style = css.green;}
                                MF_QueueAddCard(MTP);
                            }
                        }
                    }
                }
            }
        }
        function MT_GridDrawTriggerEvents() {
            if(useRow.IsHeader) HeaderStyle = 'border-radius: 0px 10px 10px 0px;' + css.header;
            if(MTFlex.TriggerEvents) {
                elx = cec('td',isSubTotal ? 'MTFlexGridSCell2' : '',el,'','','width: 34px;'+ HeaderStyle);
                if ((isSubTotal && useRow.PKTriggerEvent != null) || (!isSubTotal && useRow.SKTriggerEvent != null)) {
                    elx = cec('button', 'MTFlexCellGo MTFlexCellArrow', elx);
                    const triggerEvent = isSubTotal ? useRow.PKTriggerEvent : useRow.SKTriggerEvent;
                    cec('span', 'MTFlexCellGo', elx, '', '', '', 'triggers', triggerEvent + '|');
                }
            }
        }
        function MT_GridDrawLine() {
            let h = 'trH';
            if(useRow.IsHeader == false) {
                if((MTFlex.Subtotals && isSubTotal) || (!MTFlex.Subtotals)) {
                    if (rowI < rowIs && MTFlexRow[rowI].Section != MTFlexRow[rowI+1].Section) {
                        h = 'trH2';
                    }
                }
            }
            let el2 = cec('tr',h,Header,'','','','MTsection',useRow.Section);
            el2 = cec('td','',el2,'','','','colspan',MTFlexTitle.length);
            if(useRow.IsHeader == false) {cec('div','MTFlexSpacer',el2,'','',hide);}
            if(isSubTotal == true && MTFlex.HideDetails != true) {cec('tr','trH',Header,'','','','MTsection',useRow.Section);}
        }

        function MT_GridDrawRowSub(inColumn,inStart,inEnd) {
            let useValue = 0,useCols = 0;
            for ( let j = inStart; j <= inEnd; j++) {
                if(MTFlexTitle[j].IsHidden == false && useRow[j] != null ) {
                    useCols++; useValue = useValue + useRow[j];
                }
            }
            if(useCols > 0) {useRow[inColumn] = useValue / (useCols);} else {useRow[inColumn] = 0;}
        }
    }
}

function MT_GetFormattedValue(inType,inValue,inRaw = false) {

    // -1 Date, 0=As-is, 1=Decimals, 2=No Decimals, 3=Qty, 4=Percent
    let useValue2 = inValue;
    switch(inType) {
        case -1:
            if(inValue != null) {useValue2 = inRaw == true ? inValue : getMonthName(inValue,2);}
            break;
        case 1:
        case 11:
            if(inValue != null) {useValue2 = inRaw == true ? inValue.toFixed(2) : getDollarValue(inValue,false);}
            break;
        case 2:
        case 12:
            if(inValue != null) {useValue2 = inRaw == true ? inValue.toFixed(0) : getDollarValue(inValue,true);}
            break;
        case 3:
        case 13:
            if(inValue != null) {useValue2 = inRaw == true ? inValue : inValue.toLocaleString('en-US');}
            break;
        case 4:
        case 14:
            if(inValue != null) {useValue2 = inRaw == true ? inValue.toFixed(2) : inValue.toLocaleString('en-US') + '%';}
            break;
    }
    if(inRaw == true && useValue2 == null) useValue2 = '';
    return useValue2;
}

function MT_GridDrawExpand() {

    const trS = document.querySelectorAll('tr[MTsection]');
    const cName = MF_GetSeqKey('Expand');
    let x = null, cv = null;
    trS.forEach((tr) => {
        x = Number(tr.getAttribute('MTsection'));
        if(x > 0) {
            if(tr.className == 'MTFlexGridRow') {
                cv = getCookie(cName + (x+1),true);
                if(cv == 1) {tr.firstChild.innerText = ' ' + tr.firstChild.innerText.slice(2);} else {tr.firstChild.innerText = ' ' + tr.firstChild.innerText.slice(2);}
            } else {
                cv = getCookie(cName + x,true);
                cv == 1 ? tr.style.display = 'none' : tr.style.display = '';
            }
        }
    });
}

function MF_GetSeqKey(inType) {
    return MTFlex.Name + MTFlex.SortSeq[MTFlex.Button2] + inType ;
}

function MT_GridDrawSort() {

    let useSort = getCookie(MF_GetSeqKey('Sort'), true);
    useSort = Math.abs(useSort) >= MTFlexTitle.length ? 0 : useSort;
    const useCol = Math.abs(useSort);

    MTFlexRow.forEach(row => {row.SK = row[useCol]; });
    MTFlexTitle.forEach((title, i) => {title.ShowSort = (i == useSort) ? '▲' : (i == Math.abs(useSort)) ? '▼' : '';});

    const sortable = MTFlexTitle[useCol].IsSortable;
    MTFlexRow.sort((a, b) => {
        const sectionDifference = a.Section - b.Section || a.PK.localeCompare(b.PK);
        const sortValue = useSort < 0 ? -1 : 1;
        switch (sortable) {
            case 1:
                return sectionDifference || sortValue * (a.SK.localeCompare(b.SK));
            case 2:
                return sectionDifference || sortValue * (b.SK - a.SK);
            default:
                return sectionDifference;
        }
    });
}

function MT_GridDrawContainer() {
    const topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
    if(!topDiv) return;

    let MTFlexContainer = document.createElement('div');
    MTFlexContainer.className = 'MTFlexContainer';
    topDiv.prepend(MTFlexContainer);
    MTFlexTable = cec('div','MTFlexContainerPanel',MTFlexContainer);

    let cht = cec('div','MTFlexContainerHeader',MTFlexTable);
    let div = cec('div','MTFlexTitle',cht);
    div = cec('div','MTFlexTitle2',div);
    let div2 = cec('span','MTFlexSmall',div,MTFlex.Title1);
    if(MTFlex.DateEvent > 0) { div2 = cec('a','MTFlexBig MThRefClass',div,MTFlex.Title2); } else {div2 = cec('span','MTFlexBig',div,MTFlex.Title2);}
    div2 = cec('span','MTFlexLittle',div,MTFlex.Title3);

    let tbs = cec('span','MTFlexButtonContainer',cht);

    div2 = cec('span','',tbs,'','','height: 38px; display: block; align-content: end;');
    MTFlex.bub = cec('div','MTBub',div2,'','','display: none;');
    MTFlex.bub5 = cec('div','MTBub1',MTFlex.bub);
    MTFlex.bub2 = cec('div','MTBub1',MTFlex.bub);
    MTFlex.bub1 = cec('div','MTBub1',MTFlex.bub);
    div2 = cec('div','MTdropdown',tbs);
    div2 = cec('button','MTFlexButtonExport',div2,'Export ');

    createDropdown('4',MTFlex.Button4Options,MTFlex.Button4);
    createDropdown('1',MTFlex.Button1Options,MTFlex.Button1);
    createDropdown('2',MTFlex.Button2Options,MTFlex.Button2);

    div2 = cec('div','MTdropdown',tbs);
    div2 = cec('label','',div2,'Compress Grid','','margin-top: 6px; font-size: 14px; font-weight:500;display: inline-block;','htmlFor','CompressGrid');
    div2 = cec('input','MTFlexCheckbox',div2,'','','margin-top: 2px;','id','CompressGrid');
    div2.type = 'checkbox';if(MTFlex.Button3 == 1) {div2.checked = 'true';}

    cht = cec('div','MTFlexContainerHeader',MTFlexTable,'','','padding-top: 0px; padding-bottom: 0px;');
    div2 = cec('div','',cht,'','','display:flex;gap:6px;');
    cec('span','MTFlexExpand',div2,'','','','title','Collapse / Expand');
    cec('span','MTFlexText',div2, MF_GridTip(),'','margin-left: 12px;');
    div2 = cec('div','',cht);
    cec('span','MTFlexRestore',div2,'','','','title','Restore Favorite View');
    cec('span','MTFlexSave',div2,'','','','title','Save as Favorite View');
    cec('span','MTFlexConfig',div2,'','','margin-left:6px;','title',MTFlex.Title1 + ' Settings');

    function createDropdown(inName,inOpt,inBut) {
        if(inOpt != null && inOpt.length > 0) {
            div2 = cec('div','MTdropdown',tbs);
            div2 = cec('button','MTFlexButton' + inName,div2,inOpt[inBut] + ' ');
            let divContent = cec('div','MTFlexdown-content',div2,'','','','id','MTDropdown' + inName);
            for (let i = 0; i < inOpt.length; i++) { div2 = cec('a','MTButton' + inName,divContent,inOpt[i],'','','MTOption',i); }
        }
    }
}

function MT_GridDrawCards() {
    if(MTFlexCard.length == 0) {return;}
    let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
    if(topDiv) {
        MTFlexCard.sort((a, b) => (a.Col - b.Col));
        let splitCards = 'flex-flow: column;';
        let div = document.createElement('div');
        div.className = 'MTFlexContainer';
        topDiv.prepend(div);
        topDiv = cec('div','MTFlexContainer2',div);
        for (let i = 0; i < MTFlexCard.length; i++) {
            let div2 = cec('div','MTFlexContainerCard',topDiv,'','',splitCards);
            cec('span','MTFlexCardBig fs-exclude',div2,MTFlexCard[i].Title,'',MTFlexCard[i].Style);
            cec('span','MTFlexSmall',div2,MTFlexCard[i].Subtitle,'','text-align:center');
        }
    }
}
function MT_GridPercent(inA, inB, inHighlight, inPercent, inIgnoreShade) {

    let p = ['', '',0]; // x%, color, x
    if(inA == null || inB == null) return p;

    if(isNaN(inA)) {inA = 0;}
    if(isNaN(inB)) {inB = 0;}

    if (inA === 0 && inB === 0) return p;

    p[0] = inA > 0 ? (inPercent === 1 ? (inB - inA) / inA : Math.max(inB / inA, 0)) : 1;
    p[0] = Math.round(p[0] * 1000) / 10;
    p[2] = p[0];
    if (inHighlight && !inIgnoreShade) {
        if (p[0] > 100) p[1] = 'background-color: #f7752d; color: black;';
        else if (p[0] > 50) p[1] = 'background-color: #f89155; color: black;';
        else if (p[0] > 25) p[1] = 'background-color: #fde0cf; color: black;';
        if (p[1]) p[1] += 'border-radius: 6px;';
    }
    p[0] = (p[0] > 1000) ? '(>1,000%)' : (p[0] < -1000) ? '(<1,000%)' : ` (${p[0].toFixed(1)}%)`;
    return p;
}

function MT_GridExport() {
    const c = ',';
    let csvContent = '',useValue = '', k = 0,Cols = 0;
    for (const Title of MTFlexTitle) {
        if(Title.IsHidden == false) {
            Cols++;
            if(MTFlex.HideDetails != true) {
                if(MTFlex.Subtotals == true && Cols == 1) {
                    csvContent += '"Group"' + c + '"Category"' + c;
                } else {
                    csvContent += '"' + Title.Title + '"' + c;
                }
            }
        }
    }
    if(MTFlex.HideDetails != true) {
        csvContent += CRLF;
        for (let i = 0; i < MTFlexRow.length; i++) {
            if(i > 0 && MTFlexRow[i].Section != MTFlexRow[i-1].Section && MTFlexRow[i].IsHeader == true) { csvContent += c + CRLF; }
            k = 0;
            for (let j = 0; j < MTFlexTitle.length; j++) {
                if(MTFlexTitle[k].IsHidden == false) {
                    useValue = '';
                    if(MTFlexRow[i].IsHeader == false || MTFlexTitle[k].IgnoreTotals != true) {
                        if(MTFlexRow[i][j] != undefined && MTFlexRow[i][j] != null) {
                            useValue = MT_GetFormattedValue(MTFlexTitle[k].Format,MTFlexRow[i][j],true);
                        }
                    }
                    if(MTFlex.Subtotals == true && j == 0) {
                        if(MTFlexRow[i].IsHeader == false) { csvContent += MTFlexRow[i].PK.slice(MTFlex.PKSlice) + c; }
                    }
                    csvContent += useValue + c;
                    if(MTFlex.Subtotals == true && j == 0) {
                        if(MTFlexRow[i].IsHeader == true) { csvContent += ' ' + c; }
                    }
                }
                k++;
            }
            csvContent = csvContent + CRLF;
        }
     } else {
         const spans = document.querySelectorAll('td.MThRefClass2,td.MTFlexGridDCell,td.MTFlexGridHCell2,td.MTFlexGridS3Cell,td.MTFlexGridDCell2');
         let j=0;
         spans.forEach(span => {
             useValue = span.innerText.trim();
             if (/^( | )/.test(useValue)) {useValue = useValue.slice(2);}
             if(span.className == 'MThRefClass2') csvContent += CRLF;
             if(span.className == 'MTFlexGridDCell') useValue = '  ' + useValue;
             j++;csvContent += '"' + useValue + '"';
             if(j == Cols) { j=0;csvContent += CRLF;} else {csvContent += c;}
         });
     }
    downloadFile( MTFlex.Title1 +' - ' + MTFlex.Title2,csvContent);
}

function MT_GridDrawEmbed(inSection,inCol,inValue, inDesc) {
    switch (MTFlex.Name) {
        case 'MTTrends':
            if(MTFlex.Option2 < 3) {
                if((inSection == 2) && (inCol == 3 || inCol == 6)) {if(inValue > 0) {return css.green;}}
                if((inSection == 4) && (inCol == 3 || inCol == 6)) {if(inValue < 0) {return css.green;}}
            }
            break;
        case 'MTAccounts':
            if(MTFlex.Button2 == 0) {
                if (inSection == 2 && inCol == 9) {return inValue < 0 ? css.red : '';}
                if (inSection == 2 && inCol == 11 && inValue < 0) {return css.red;}
                if (inSection == 4 && inCol == 9) {return inValue < 0 ? css.red : '';}
                if (inSection == 4 && inCol == 11 && inValue < 0) {return css.red;}
            }
            break;
        case 'MTInvestments':
            if(inValue == 0) return '';
            if(MTFlex.Button2 == 2) {
                if (inCol > 9 ) { return inValue < 0 ? css.red : css.green ;}
            } else{
                if (inCol == 10 || inCol == 11 ) { return inValue < 0 ? css.red : css.green ;}
            }
            break;
    }
    return '';
}
function MT_GetInput(inputs) {
    let topDiv = MF_SidePanelOpen('','', null, MTFlex.Title1);
    let div = cec('span','MTSideDrawerHeader',topDiv);
    for (let i = 0; i < inputs.length; i++) {
        let div2 = cec('div','MTInputDesc',div);
        cec('div','',div2,inputs[i].NAME,'','font-weight: 600;padding: 6px;');
        let div3 = cec('input','MTInputClass',div2,'','','','type',inputs[i].TYPE);
        div3.value = inputs[i].VALUE;
        if(i == inputs.length-1) {
            div2 = cec('div','MTdropdown',div2);
            div2 = cec('label','',div2,"Always use today's date",'','margin-top: 10px; font-size: 14px; font-weight: 600; display: inline-block;','htmlFor','TodayDate');
            div2 = cec('input','MTDateCheckbox',div2,'','','margin-top: 2px;','id','TodayDate');
            div2.type = 'checkbox';if(getCookie(MTFlex.Name + 'HigherDate',false) == 'd_Today') {div2.checked = true;}
        }

    }
    div = cec('span','MTSideDrawerHeader',topDiv);
    cec('button','MTInputButton',div,'Past week','','margin-left: 0px;',);
    cec('button','MTInputButton',div,'Last month');
    cec('button','MTInputButton',div,'This month');
    cec('button','MTInputButton',div,'This quarter');
    cec('button','MTInputButton',div,'This year');
    cec('button','MTInputButton',div,'Apply','','float:right;');
}

function MF_ModelWindowOpen(t,d,b) {
    let topDiv = document.querySelector('div.MTHistoryPanel');
    let div = cec('div','MTModelContainer',topDiv);
    div = cec('div','MTModelWindow',div);
    if(t.id) div.id = t.id;
    topDiv = cec('div','MTModelWindow2',div);
    if(t.width) topDiv.style = 'width: ' + t.width + 'px;';
    div = cec('div','MTData',topDiv);
    if(d.length > 0) {
        d.forEach(data => {
            let div2 = cec('div','MTRow',div);
            if(Array.isArray(data.field2)) {
                cec('span','MTField1',div2,data.field1,'',data.style1)
                let div3 = cec('span','MTField2',div2,'','','justify-content: flex-end; align-items: center;display: flex;' + data.style2)
                for (let i = 0; i < data.field2.length; i++) {cec('div','',div3,data.field2[i].name,'',data.field2[i].style);}
            } else if(data.field2 == null) {cec('div','MTField1',div2,data.field1,'','width: 100%;' + data.style1)} else {
                cec('span','MTField1',div2,data.field1,'',data.style1)
                cec('span','MTField2',div2,data.field2,'','text-align: right;' + data.style2)
            }
        });
    }
    div = cec('div','MTButtons',topDiv);
    if(b.length > 0) {b.forEach(but => {cec('button','MTWindowButton',div,but.name,'','','id',but.id)});}
    cec('button','MTWindowButton',div,'Close','','','id','CloseButton')
}

function MF_ModelWindowExecute(i) {
    let div = document.querySelector('div.MTModelWindow');
    let id = div.id;
    switch(i) {
        case 'CloseButton':
            removeAllSections('div.MTModelContainer');return;
       case 'TransEdit':
            window.location.replace('/transactions/' + id);
            return;
    }
}

function MF_SidePanelOpen(inType, inType2, inToggle, inBig, inSmall, inURLText, inURL, inGroupId, inToggleTip , inLogo) {
    let topDiv = document.getElementById('root');
    if(topDiv) {
        topDiv = topDiv.childNodes[0];
        let div = cec('div','MTHistoryPanel',topDiv);
        let div2 = cec('div','MTSideDrawerRoot',div,'','','','tabindex','0');
        let div3 = cec('div','MTSideDrawerContainer',div2);
        let div4 = cec('div','MTSideDrawerMotion',div3,'','','','grouptype',inType);
        if(inType2) {
            div4.setAttribute('groupsubtype',inType2);
            div4.setAttribute('groupid',inGroupId);
        }
        div = cec('span','MTSideDrawerHeader',div4);
        cec('button','MTTrendCellArrow',div,'','','float:right;');
        if(inToggle != null) {
            let useButton = getCookie(MTFlex.Name + '_SidePanel',true);
            useButton = inToggle[useButton];
            const a = cec('button','MTTrendCellArrow2',div,useButton,'','float:right;margin-right: 16px;','options',inToggle);
            a.setAttribute('title',inToggleTip);
        }
        cec('div','MTFlexCardBig',div,inBig,'','text-align: left;');
        div = cec('span','MTSideDrawerHeader',div4);
        cec('div','MTFlexSmall',div, inSmall,'','float:right;');
        if(inLogo) {cec('div','MTFlexImage',div,'','','margin-right: 7px;margin-top: 2px;background-image: url("' + inLogo + '");');}
        cec('a','MTFlexGridDCell',div,inURLText,inURL,'','target','_blank');
        return div4;
    }
}

function MF_GridUpdateUID(inUID,inCol,inValue,addMissing, increment) {
    for (const Row of MTFlexRow) {
        if(Row.UID == inUID) {
            if(increment == true) {Row[inCol] += inValue;
            } else {Row[inCol] = inValue;}
            return true;
        }
    }
    if(addMissing == true) {
        let p = [];p.UID = inUID;MF_QueueAddRow(p);MTFlexRow[MTFlexCR][inCol] = inValue;
    }
    return false;
}

function MF_GridRollup(inSection,inRoll,inBasedOn,inName) {
    if(MTFlexRow.length == 0) {return;}
    let Subtotals = [],useName ='',highSec=0;
    for (let i = 0; i < MTFlexTitle.length; i++) {Subtotals[i] = null;}
    for (let i = 0; i < MTFlexRow.length; i++) {
         if((inRoll == 0 && MTFlexRow[i].IsHeader == true) || MTFlexRow[i].Section == inRoll) {
             useName = MTFlexRow[i].PK;
             if(MTFlexRow[i].Section > highSec) highSec = MTFlexRow[i].Section;
             for (let j = 1; j < MTFlexTitle.length; j++) {
                 if(MTFlexTitle[j].Format > 0) {Subtotals[j] += MTFlexRow[i][j];}
             }
         }
    }
    MTP = [];
    MTP.IsHeader = true; MTP.IgnoreShade = true;MTP.Section = inSection;MTP.BasedOn = inBasedOn;
    if(inSection == 0) { MTP.SummaryOnly = true;}

    MF_QueueAddRow(MTP);
    if(!inName) inName = useName;
    MTFlexRow[MTFlexCR][0] = inName;
    for (let j = 1; j < MTFlexTitle.length; j++) {
        if(MTFlexTitle[j].Format > 0) {MTFlexRow[MTFlexCR][j] = Subtotals[j];} else {MTFlexRow[MTFlexCR][j] = '';}
    }
}

function MF_GridRollDifference(inSection,inA,inB,inBasedOn,inName,inOp) {
    let p1 = null, p2 = null;
    for (let i = 0; i < MTFlexRow.length; i++) {
        if(MTFlexRow[i].Section == inA) {p1 = i;}
        if(MTFlexRow[i].Section == inB) {p2 = i;}
    }
    if(p1 == null || p2 == null) {return;}
    MTP = [];
    MTP.IsHeader = true; MTP.IgnoreShade = true; MTP.Section = inSection; MTP.BasedOn = inBasedOn; MTP.SummaryOnly = true; MF_QueueAddRow(MTP);
    MTFlexRow[MTFlexCR][0] = inName;
    for (let j = 1; j < MTFlexTitle.length; j++) {
        if(MTFlexTitle[j].Format > 0) {
            if(inOp == 'Add') {
                MTFlexRow[MTFlexCR][j] = MTFlexRow[p1][j] + MTFlexRow[p2][j];
            } else {
                MTFlexRow[MTFlexCR][j] = MTFlexRow[p1][j] - MTFlexRow[p2][j];
            }
            MTFlexRow[MTFlexCR][j] = parseFloat(MTFlexRow[MTFlexCR][j].toFixed(2));
        } else { MTFlexRow[MTFlexCR][j] = ''; }
    }
}

function MF_GridGetValue(inSection,inCol) {
    for (let i = 0; i < MTFlexRow.length; i++) {if(MTFlexRow[i].Section == inSection) {return MTFlexRow[i][inCol];}}
    return 0;
}

function MF_GridGroupByPK() {
    MTFlexRow.sort((a, b) => a.PK.localeCompare(b.PK));
    const oldLength = MTFlexRow.length;
    let useSec = 0;
    for (let i = 0; i < oldLength; i++) {
        if(i == 0 || MTFlexRow[i].PK != MTFlexRow[i-1].PK) { useSec = useSec + 2; }
        MTFlexRow[i].BasedOn = useSec -1;
        MTFlexRow[i].IsHeader = false;
        MTFlexRow[i].Section = useSec;
    }
    let i = 2;
    for (i = 2; i < useSec; i+=2) { MF_GridRollup(i-1,i,i-1);}
    MF_GridRollup(i-1,i,i-1);
}

function MF_GridRegroupPK(inCol) {
    for (let i = 0; i < MTFlexRow.length; i++) {MTFlexRow[i].PK = MTFlexRow[i][inCol];}
}

function MF_GridCalcDifference(inSection,in1,in2,inCols,inOp) {
    let p1 = null, p2 = null, p3 = null;
    for (let i = 0; i < MTFlexRow.length; i++) {
        if(MTFlexRow[i].Section == inSection) {p1 = i;}
        if(MTFlexRow[i].Section == in1) {p2 = i;}
        if(MTFlexRow[i].Section == in2) {p3 = i;}
    }
    if(p1 == null || p2 == null || p3 == null) {return;}
    for (let i = 0; i < inCols.length; i++) {
        if(inOp == 'Add') {
            MTFlexRow[p1][inCols[i]] = MTFlexRow[p2][inCols[i]] + MTFlexRow[p3][inCols[i]];
        } else { MTFlexRow[p1][inCols[i]] = MTFlexRow[p2][inCols[i]] - MTFlexRow[p3][inCols[i]]; }
        MTFlexRow[p1][inCols[i]] = parseFloat(MTFlexRow[p1][inCols[i]].toFixed(2));
    }
}

function MF_GridCalcRowPercent(inCol,inX, inY) {
    for (let i = 0; i < MTFlexRow.length; i++) {
        let p = MT_GridPercent(MTFlexRow[i][inX], MTFlexRow[i][inY], false, 1, true);
        MTFlexRow[i][inCol] = p[2];
    }
}

function MF_GridCalcColPercent(inCol, inX, inOnTotal) {
    let basedTotal = MF_GridGetValue(0, inX),basedOn = 0,p = 0;
    for (let i = 0; i < MTFlexRow.length; i++) {
        if (!inOnTotal && basedOn != MTFlexRow[i].BasedOn) {
            basedOn = MTFlexRow[i].BasedOn;
            basedTotal = MF_GridGetValue(basedOn, inX);
        }
        p = MTFlexRow[i][inX] / basedTotal;
        p = Math.round(p * 1000) / 10;
        MTFlexRow[i][inCol] = p;
    }
}

function MF_GridCalcRowRange(inColumn,inStart,inEnd,inOp) {
    let useValue = 0, useCols = 0;
    for (let i = 0; i < MTFlexRow.length; i++) {
        useValue = 0;useCols = 0;
        for ( let j = inStart; j <= inEnd; j++) {
            if(MTFlexTitle[j].IsHidden == false && MTFlexRow[i][j] != null ) {
                useCols++;
                if(inOp == 'Sub') { useValue = useValue - MTFlexRow[i][j]; } else { useValue = useValue + MTFlexRow[i][j]; }
            }
        }
        if(inOp == 'Avg') {
            if(useCols > 0) {MTFlexRow[i][inColumn] = useValue / (useCols);} else {MTFlexRow[i][inColumn] = 0;}
            MTFlexTitle[inColumn].FormatExtended = [inStart,inEnd];
        } else { MTFlexRow[i][inColumn] = useValue;}
    }
}

function MF_GridCardAddAll (inSec, inStart, inEnd, inMax, inTot, inPos, inNeg) {
    let cards=0;
    for (let i = 0; i < MTFlexRow.length; i++) {
        if(MTFlexRow[i].Section == inSec) {
            if(inTot > 0) {
                MT_GridCardAddAllGo(MTFlexRow[i][inTot], MTFlexTitle[inTot].Title + ' ' + MTFlexRow[i][0]);
            }
            for ( let j = inStart; j <= inEnd; j++) {
                MT_GridCardAddAllGo(MTFlexRow[i][j], MTFlexTitle[j].Title);
                if(cards == inMax) break;
            }
        }
    }
    return cards;

    function MT_GridCardAddAllGo (inA,inB) {
        cards++;
        MTP = [];MTP.Col = cards;
        if(MTFlexTitle[inStart].Format == 2) {MTP.Title = getDollarValue(inA,true);} else {MTP.Title = getDollarValue(inA,false);}
        MTP.Subtitle = inB;
        if(MTP.Title[0] == '-') {MTP.Style = inNeg;} else {MTP.Style = inPos;}
        MF_QueueAddCard(MTP);
    }
}

function MF_GridCardAdd (inSec,inStart,inEnd,inOp,inPosMsg,inNegMsg,inPosColor,inNegColor,inAddRowTitle,inAddColTitle,inCol) {
    let useValue = 0,useCells = 0,useRow='',useCol='';
    for (let i = 0; i < MTFlexRow.length; i++) {
        if(MTFlexRow[i].Section == inSec) {
            for ( let j = inStart; j <= inEnd; j++) {
                if(MTFlexTitle[j].IsHidden == false && MTFlexRow[i][j] != null) {
                    useCells++;
                    if(inOp == 'HV') {
                        if(useValue == 0 || MTFlexRow[i][j] > useValue) {useValue = MTFlexRow[i][j];useCol = MTFlexTitle[j].Title;useRow=MTFlexRow[i][0];}
                    } else {
                        if(useValue == 0 || MTFlexRow[i][j] < useValue) {useValue = MTFlexRow[i][j];useCol = MTFlexTitle[j].Title;useRow=MTFlexRow[i][0];}
                    }
                }
            }
        }
    }
    if(useCells > 0 && useValue != 0) {
        if((useValue > 0 && inPosMsg != '') || (useValue < 0 && inNegMsg != '')) {
            let useMsg = '',useStyle='';
            if(useValue < 0) {useMsg = inNegMsg;useStyle=inNegColor;useValue = useValue * -1;} else {useMsg = inPosMsg;useStyle=inPosColor;}
            if(MTFlexTitle[inStart].Format == 2) {useValue = getDollarValue(useValue,true);} else {useValue = getDollarValue(useValue,false);}
            MTP = [];
            if(inCol) {MTP.Col = inCol;} else {MTP.Col = MTFlexCard.length+1;}
            if(inAddRowTitle) {useMsg = useMsg + inAddRowTitle + useRow;}
            if(inAddColTitle) {useMsg = useMsg + inAddColTitle + useCol;}
            MTP.Title = useValue;MTP.Subtitle = useMsg;MTP.Style = useStyle;
            MF_QueueAddCard(MTP);
            return 1;
        }
    }
    return 0;
}
// [ Chart Canvas ]
function MF_DrawChart(inLocation) {

    let xAxis = [], yAxis = [], points = [];
    let topDiv = null, topChart = null, tooltip = null,extendedRange = false;

    if(inLocation != null) {
        topDiv = document.createElement('div');
        topDiv.className = 'MTChartContainer';
        topDiv.id = 'MTChartCanvas';
        topDiv = inLocation.insertAdjacentElement('afterend', topDiv);
        topChart = cec('canvas','',topDiv,'','','','id','MTChart');topChart.width = 600; topChart.height = 400;
        tooltip = cec('div','',topDiv,'','','position: absolute;background: #000000; color: #fff; padding: 4px 8px; border-radius: 4px; pointer-events: none; font-size: 14px; font-weight: 600; display: none;','id','MTChartTip');
    } else {
        topDiv = document.getElementById('MTChartCanvas');
        topChart = document.getElementById('MTChart');
        tooltip = document.getElementById('MTChartTip');
    }

    let div = document.querySelector('div.MTSideDrawerMotion');
    if(!div) return;
    let grpID = div.getAttribute('groupid');
    let grpType = div.getAttribute('grouptype');
    const timeLit = getCookie(MTFlex.Name + 'StockSelect',false);

    if(MTFlex.Name == 'MTInvestments') drawChartInvestments();
    if(MTFlex.Name == 'MTAccounts') drawChartAccounts();
    drawChart();
    drawChartTips();

    function drawChartAccounts() {

        let currentD = getDates('d_Today');
        let extendedD = getDates('d_Minus1HYear');
        let useV = 0;
        for (let i = 0; i < performanceData.accounts.length; i++) {
            if(performanceData.accounts[i].id == grpID) {
                const recBal = performanceData.accounts[i].recentBalances;
                const timeNdx = inList(timeLit,['YTD','1Y','2Y','3Y','All'],true) -1;
                let lowDate = null;
                if(timeLit != 'All') lowDate = getDates(['d_StartofYear','d_Minus1Year','d_Minus2Years','d_Minus3Years'][timeNdx]);
                for (let j = recBal.length - 1; j > -1; j--) {
                    if(lowDate) {if(currentD < lowDate) break;}
                    useV = recBal[j];if(grpType == 'liability') {useV = -useV;}
                    xAxis.unshift(useV);yAxis.unshift(formatQueryDate(currentD));
                    if(j == 0) {currentD = getDates('d_StartofWeek');
                    } else {currentD.setDate(currentD.getDate() - 7);}
                    if(extendedRange == false && currentD < extendedD) {extendedRange = true;}
                }
            }
        }
    }

    function drawChartInvestments() {
        const timeNdx = inList(timeLit,['1W','1M','3M','6M','YTD','1Y'],true) -1;
        const timeFrame = getDates(['d_MinusWeek','d_Minus1Month','d_Minus3Months','d_Minus6Months','d_StartofYear','d_Minus1Year'][timeNdx]);
        const chart = performanceData.securityHistoricalPerformance[0].historicalChart;
        const xLen = chart.length;
        let moveAvg = {Start: [xLen > 22 ? xLen - 22 : 0,xLen > 52 ? xLen - 52:0,xLen > 202 ? xLen - 202 : 0], Accum: [0,0,0], Good: [0,0,0,0], Bad: [0,0,0,0], Style: ['','']};
        for (let i = 0; i < xLen; i++) {
            const { date: useDate, value: useAmt } = chart[i];
            const dateS = new Date(useDate);
            for (let j = 0; j < 3; j++) { if (i > moveAvg.Start[j] && i < xLen - 1) {moveAvg.Accum[j] += useAmt;}}
            if (dateS > timeFrame) {xAxis.push(useAmt);yAxis.push(useDate);}
        }
        let p = getPriceDiff();
        if(p) {updateChartDetail('MTPriceChange','Price Change (' + timeLit + ')',getDollarValue(p[0]) + ' (' + p[1] + '%)', p[2]);}

        if(inLocation != null) {
            if(moveAvg.Start[0] > 0) {moveAvg.Accum[0] = moveAvg.Accum[0] / 20;}
            if(moveAvg.Start[1] > 0) {moveAvg.Accum[1] = moveAvg.Accum[1] / 50;}
            if(moveAvg.Start[2] > 0) {moveAvg.Accum[2] = moveAvg.Accum[2] / 200;}
            for (let j = 0; j < 3; j++) {moveAvg.Accum[j] = parseFloat(moveAvg.Accum[j].toFixed(2));}
            for (let i = 0; i < xLen; i++) {
                const { value: useAmt } = chart[i];
                for (let j = 0; j < 3; j++) {
                    if (i > moveAvg.Start[j] && i < xLen - 1) {
                        if(useAmt > moveAvg.Accum[j]) {moveAvg.Good[j]++;} else if (useAmt < moveAvg.Accum[j]) {moveAvg.Bad[j]++;}
                    }
                }
                if(i > xLen - 12 && i < xLen -1) {
                    if(useAmt > moveAvg.Accum[0]) {moveAvg.Good[3]++;} else if (useAmt < moveAvg.Accum[0]) {moveAvg.Bad[3]++;}
                }
            }
            if(moveAvg.Good[0] > 14) {moveAvg.Style[0] = css.green;} else if(moveAvg.Bad[0] > 14) {moveAvg.Style[0] = css.red;}
            if(moveAvg.Good[3] > 6) {moveAvg.Style[0] = css.green;} else if(moveAvg.Bad[3] > 6) {moveAvg.Style[0] = css.red;}
            if(moveAvg.Good[1] > 38) {moveAvg.Style[1] = css.green;} else if(moveAvg.Bad[1] > 38) {moveAvg.Style[1] = css.red;}
            if(moveAvg.Good[2] > 150) {moveAvg.Style[1] = css.green;} else if(moveAvg.Bad[2] > 150) {moveAvg.Style[1] = css.red;}
            let op = getoldChartDetail('MTCurrentPrice'),np = xAxis[xAxis.length-1], updn = '',useColor = '';
            op = getCleanValue(op,2);
            np = +np.toFixed(2);
            if(np > op) {updn = '';useColor = css.green;}
            if(np < op) {updn = '';useColor = css.red;}
            updateChartDetail('MTCurrentPrice','',getDollarValue(np) + ' ' + updn,useColor);
            updateChartDetail('MTMoveAvg20','',getDollarValue(moveAvg.Accum[0],false),moveAvg.Style[0],'20-Day Average\nOver: ' + moveAvg.Good[0] + '   - Under: ' + moveAvg.Bad[0] + '\n\n10-Days\nOver: ' + moveAvg.Good[3] + '  -  Under: ' + moveAvg.Bad[3]);
            updateChartDetail('MTMoveAvg50','',getDollarValue(moveAvg.Accum[1],false) + ' / ' + getDollarValue(moveAvg.Accum[2],false),moveAvg.Style[1],'50-Day Average\nOver: ' + moveAvg.Good[1] + '  -  Under: ' + moveAvg.Bad[1] + '\n\n200-Day Average\nOver: ' + moveAvg.Good[2] + '  -  Under: ' + moveAvg.Bad[2]);
            updateChartDetail('MTYTDPriceChange','',getDollarValue(Math.min(...xAxis)) + ' - ' + getDollarValue(Math.max(...xAxis)));
        }
    }

    function getPriceDiff(inX,inY, tt) {
        if(inX == null) {inY = 0; inX = xAxis.length-1;}
        let df = xAxis[inX] - xAxis[inY];
        let df2 = (df / xAxis[inY]) * 100;
        df = df.toFixed(2);df2 = df2.toFixed(1);
        let uc = '';
        if(tt == true) { uc = (df > 0) ? 'color: #3dd68c;' : (df < 0 ? 'color: #f9918e;' : ''); } else { uc = (df > 0) ? css.green : (df < 0 ? css.red : ''); }
        return([df,df2,uc]);
    }
    function getoldChartDetail(inE) {
        const csp = document.getElementById(inE);
        if(csp) {return csp.childNodes[1].innerText;} else {return '';}
    }

    function updateChartDetail(inE,val1,val2,stl,ttl) {

        const csp = document.getElementById(inE);
        if(csp) {
            if(val1) csp.childNodes[0].innerText = val1;
            if(val2) csp.childNodes[1].innerText = val2;
            if(stl) csp.childNodes[1].style = stl;
            if(ttl) {
                csp.childNodes[1].className = 'MTSideDrawerDetails tooltip';
                let tt = cec('div','tooltip',csp.childNodes[1]);
                cec('span','tooltiptext',tt,ttl);
            }
        }
    }

    function drawChart() {

        const ctx = topChart.getContext('2d');
        const minPrice = Math.min(...xAxis),maxPrice = Math.max(...xAxis);
        const midPrice = (minPrice + maxPrice) / 2,midHPrice = (midPrice + maxPrice) / 2,midLPrice = (minPrice + midPrice) / 2;
        const paddingLeft = 50,chartHeight = topChart.height - 100;
        const standardText = ['#333333','#cccccc'][isDarkMode()];

        ctx.clearRect(0, 0, topChart.width, topChart.height);
        points = [];

        ctx.strokeStyle = standardText;ctx.lineWidth = 1.0;
        // X axis
        ctx.beginPath();ctx.moveTo(paddingLeft, chartHeight + 20);ctx.lineTo(topChart.width, chartHeight + 20); ctx.stroke();
        // Y labels
        ctx.fillStyle = standardText;ctx.font = '600 12.8px Helvetica'; ctx.textAlign = 'right';
        ctx.fillText(drawChartFormatY(maxPrice), paddingLeft - 2, 22);
        ctx.fillText(drawChartFormatY(minPrice), paddingLeft - 2, 24 + chartHeight);

        ctx.font = '12.8px Helvetica';
        ctx.fillText(drawChartFormatY(midHPrice), paddingLeft - 2, 24 + (chartHeight/4));
        ctx.fillText(drawChartFormatY(midPrice), paddingLeft - 2, 24 + (chartHeight/2));
        ctx.fillText(drawChartFormatY(midLPrice), paddingLeft - 2, 24 + (chartHeight/2) + (chartHeight/4));

        if(minPrice < 0 && maxPrice > 0 && midLPrice != 0) {
            const zeroY = 20 + ((maxPrice - 0) / (maxPrice - minPrice)) * chartHeight;
            ctx.setLineDash([5, 3]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(paddingLeft, zeroY);
            ctx.lineTo(topChart.width, zeroY);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillText(drawChartFormatY(0), paddingLeft - 2,4+zeroY);
        }

        const numberOfGridLines = 5;
        const gap = (chartHeight) / (numberOfGridLines - 1);
        const lineYs = [];

        for (let i = 0; i < numberOfGridLines; i++) {lineYs.push(20 + i * gap); }

        // Grid lines
        ctx.strokeStyle = standardText;
        ctx.lineWidth = 0.50;
        lineYs.forEach(y => {
            ctx.beginPath();ctx.moveTo(paddingLeft, y); ctx.lineTo(topChart.width, y);ctx.stroke();
        });

         // Ploy lines
        ctx.lineWidth = 1.8;
        ctx.beginPath();

        let useStyle = '';
        xAxis.forEach((p, i) => {
            const x = paddingLeft + ((topChart.width - paddingLeft - 5 ) * i) / (xAxis.length - 1);
            const y = 20 + ((maxPrice - p) / (maxPrice - minPrice)) * chartHeight;
            if(grpType == 'liability') {
                useStyle = p > 0 ? css.redRaw : css.greenRaw;
            } else {
                useStyle = (i > 0 && xAxis[i] < xAxis[0]) ? css.redRaw : css.greenRaw;
            }
            points.push({x, y, price: p, date: yAxis[i], style: useStyle});
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.strokeStyle = useStyle;
                // Draw line segment
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);
            }
        });

        // Draw dots
        points.forEach(pt => { ctx.beginPath();ctx.fillStyle = pt.style; ctx.arc(pt.x, pt.y, 4, 0, Math.PI*2);ctx.fill(); });

        // X - All date labels
        let dpMod = 1;
        if(points.length > 11) { dpMod = Math.ceil(points.length / 11); }
        ctx.fillStyle = standardText; ctx.font = '12px Helvetica';ctx.textAlign = 'center';
        let dpS = 0,firstPass = false;
        yAxis.forEach((d, i) => {
            dpS++;
            if(dpS == dpMod || firstPass == false) {
                if (dpMod > 1 && i > yAxis.length - dpMod && i != yAxis.length-1) {
                    dpS--;
                } else {
                    let x = paddingLeft + ((topChart.width - paddingLeft ) * i) / (yAxis.length - 1);
                    if(i == yAxis.length-1) x-=19;
                    let dr = extendedRange == true ? getMonthName(d, 4) : d.slice(5,10);
                    ctx.fillText(dr, x, topChart.height - 31);
                    dpS=0;firstPass = true;
                }
            }
        });
    }

    function drawChartFormatY(inV) {
        let newV = inV;
        if(inV > 999 || inV < -999) {
            newV = Math.trunc(inV);
            if(newV > 999999) {newV = newV / 1000000;newV = newV.toFixed(2);return '$' + newV + 'M';}
            newV = newV / 1000;newV = newV.toFixed(1);return '$' + newV + 'K';
        } else { return getDollarValue(inV,false); }
    }

    function drawChartTips() {
        if(glo.tooltipHandle) { topChart.removeEventListener('mousemove', glo.tooltipHandle); }
        glo.tooltipHandle = topChart.addEventListener('mousemove', (e) => {
            const rect = topChart.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            let fd = false,x=0;
            let half = 420;
            if(MTFlex.Name == 'MTAccounts') half = 530;
            for (const pt of points) {
                const dx = mouseX - pt.x;
                const dy = mouseY - pt.y;
                let tt='',mX=0, nd='';
                if (dx * dx + dy * dy <= 64) {
                    mX = mouseX - 48;
                    if(mX > half) mX = half-10;
                    tooltip.style.left = mX + 'px';
                    tooltip.style.top = (e.clientY + 10) + 'px';
                    nd = new Date(pt.date + 'T00:00:00');
                    nd = getDates('s_FullDate',nd);
                    tt = nd + '<br/>' + getDollarValue(pt.price) + '<br/>';
                    if(half == 420 && x > 0) {
                        let p = getPriceDiff(x,x-1, true);
                        tt+= '<div style="' + p[2] + '">Day Change: ' + getDollarValue(p[0]) + ' (' + p[1] + '%)</div>';
                        p = getPriceDiff(x,0, true);
                        tt+= '<div style="' + p[2] + '">Period Change: ' + getDollarValue(p[0]) + ' (' + p[1] + '%)</div>';
                    }
                    tooltip.innerHTML = tt;
                    tooltip.style.display = 'block';
                    fd = true;
                    break;
                }
                x++;
            }
            if (!fd) {tooltip.style.display = 'none';}
        });
    }
}

// [ Reports Menu ]
function MenuReports(OnFocus) {
    if (glo.pathName.startsWith('/reports/')) {
        if(OnFocus == false) {MTFlex = [];}
        if(OnFocus == true) {MenuReportsCustom();}
    }
}

function MenuReportsSetFilter(inType,inCategory,inGroup,inHidden) {
    let reportsObj = localStorage.getItem('persist:reports');
    let startDate = formatQueryDate(getDates('d_Minus3Years'));
    let endDate = formatQueryDate(getDates('d_Today'));
    if(MTFlex.Name == 'MTNet_Income') {startDate = formatQueryDate(MTFlexDate1); endDate = formatQueryDate(MTFlexDate2);}
    let useCats = '';
    let useHidden = '';
    if(inHidden) {useHidden = ',\\"hideFromReports\\":' + inHidden;}
    if(inGroup) {useCats = rtnCategoryGroupList(inGroup,false);} else {useCats = '\\"' + inCategory + '\\"';}
    reportsObj = replaceBetweenWith(reportsObj,'"filters":"{','}','"filters":"{\\"startDate\\":\\"' + startDate + '\\",\\"endDate\\":\\"' + endDate + '\\",\\"categories\\":[' + useCats + ']' + useHidden + '}');
    reportsObj = reportsObj.replace('}}','}');
    reportsObj = replaceBetweenWith(reportsObj,'"groupByTimeframe":',',','"groupByTimeframe":"\\"month\\"",');
    reportsObj = replaceBetweenWith(reportsObj,'"' + inType + '":"{','}",','"' + inType + '":"{\\"viewMode\\":\\"changeOverTime\\",\\"chartType\\":\\"stackedBarChart\\"}",');
    if(inCategory) {reportsObj = replaceBetweenWith(reportsObj,'"groupBy":',',','"groupBy":"\\"category\\"",');
    } else {reportsObj = replaceBetweenWith(reportsObj,'"groupBy":',',','"groupBy":"\\"category_group\\"",');}
    localStorage.setItem('persist:reports',reportsObj,JSON.stringify(reportsObj));
}

function MenuReportsFix() {
    if(MTFlex.Name) {
        const x = inList(MTFlex.Name,FlexOptions);
        if(x > 0) {MenuReportsCustom();MenuReportsCustomUpdate(x+2);}
    }
}

function MenuReportsCustom() {
    let div = document.querySelector('[class*="ReportsHeaderTabs__Root"]');
    if(div) {
        div.style = 'margin-left: 12px;';
        const mItems = div.childNodes.length;
        let useClass = div.childNodes[0].className;
        for (let i = 0; i < 3; i++) {div.childNodes[i].style = 'margin-right: 12px; flex-shrink: 1;  white-space: nowrap; overflow: hidden;';}
        useClass = useClass.replace(' tab-nav-item-active','');
        for (let i = 0; i < FlexOptions.length; i++) {
            if(mItems == 3) { cec('a',FlexOptions[i] + ' ' + useClass,div,FlexOptions[i].replace('_',' ').slice(2),'','margin-right: 12px;white-space: nowrap;');}
            else {div.childNodes[i + 3].className = FlexOptions[i] + ' ' + useClass;}
        }
    }
}

function MenuReportsCustomUpdate(inValue) {
    let div = document.querySelector('[class*="ReportsHeaderTabs__Root"]');
    for (let i = 0; i < FlexOptions.length + 3; i++) {
        let useClass = div.childNodes[i].className;
        if(inValue == i) {
            if(!useClass.includes(' tab-nav-item-active')) {useClass = useClass + ' tab-nav-item-active';}
        } else {useClass = useClass.replace(' tab-nav-item-active','');}
        div.childNodes[i].className = useClass;
    }
    if(inValue < 3) {MTFlex = [];}
}

function MenuReportsPanels(inType) {
    let divs = document.querySelectorAll('[class*="FlexContainer__Root-sc"]');
    for (const div of divs) { if(div.innerText.startsWith('Clear') || div.innerText.includes('Filters')) {div.style=inType;break;}}
    divs = document.querySelector('[class*="Grid__GridStyled-"]');
    if(divs) {divs.style=inType;}
}

function MenuReportsGo(inName) {
    let topDiv = document.querySelector('div.MTWait');
    if(!topDiv) {
        document.body.style.cursor = "wait";
        removeAllSections('.MTFlexContainer');
        MenuReportsPanels('display:none;');
        switch(inName) {
            case 'MTTrends':
                MenuReportsCustomUpdate(3);
                MenuReportsTrendsGo();
                break;
            case 'MTNet_Income':
                MenuReportsCustomUpdate(4);
                MenuReportsNetIncomeGo();
                break;
            case 'MTAccounts':
                MenuReportsCustomUpdate(5);
                MenuReportsAccountsGo();
                break;
            case 'MTInvestments':
                MenuReportsCustomUpdate(6);
                MenuReportsInvestmentsGo();
                break;
        }
    }
}

async function MenuReportsNetIncomeGo() {
    let snapshotData4 = null,snapshotData = null, rec = null;
    let TagQueue = [],TagCols = [];
    let useID = '',useAmt = 0, ii = 0, useTitle='',useURL = '';
    let HiddenFilter = false, hasNotes = false, hasGoals = [];

    MF_GridInit('MTNet_Income', 'Net Income');
    MTFlex.DateEvent = 2;
    MTFlex.TriggerEvents = true;
    MF_SetupDates();
    MF_GridOptions(1,['by Group','by Category','by Both']);
    if(MTFlex.Button1 == 2) {MTFlex.Subtotals = true;}
    MF_GridOptions(2,['by Tags (Ignore hidden)','by Tags (Include hidden)','by Tags (Only hidden)','by Notes (Starts with asterisk)','by Accounts','by Goals', 'by Owner']);
    MF_GridOptions(4,getAccountGroupInfo());
    MTFlex.SortSeq = ['1','1','1','2','3','4'];
    MTFlex.Title2 = getDates('s_FullDate',MTFlexDate1) + ' - ' + getDates('s_FullDate',MTFlexDate2);
    MTP = [];MTP.IsSortable = 1; MTP.Format = 0;
    MF_QueueAddTitle(0,['Group','Category','Group/Category'][MTFlex.Button1],MTP);
    MTFlex.Title1 = 'Net Income Report';
    MTFlex.Title3 = MTFlex.Button2Options[MTFlex.Button2];
    switch(MTFlex.Button2) {
        case 0:
            break;
        case 1:
            HiddenFilter = null;break;
        case 2:
            HiddenFilter = true;break;
        case 3:
            HiddenFilter = null; hasNotes = true;break;
        case 4:
            snapshotData = await getAccountsData();break;
        case 5:
            snapshotData4 = await getGoals();
            for (let i = 0; i < snapshotData4.goalsV2.length; i++) {hasGoals.push(snapshotData4.goalsV2[i].id);}
            if(hasGoals.length == 0) {glo.spawnProcess = 1;return;}
            break;
        case 6:
            HiddenFilter = null;break;
    }

    let recIdx = 0, recCnt = 0,useTag = '';
    do {
        recCnt = 0;
        snapshotData4 = await getTransactions(formatQueryDate(MTFlexDate1),formatQueryDate(MTFlexDate2),recIdx,false,MTFlexAccountFilter.filter,HiddenFilter,hasNotes,hasGoals);
        for (let j = 0; j < snapshotData4.allTransactions.results.length; j += 1) {
            rec = snapshotData4.allTransactions.results[j];
            recCnt++;recIdx++;
            if(MTFlex.Button2 == 3) {if(rec.notes.startsWith('*') == false) continue;}
            if(MTFlex.Button1 == 0) {useID = rec.category.group.id; } else {useID = rec.category.id;}
            useAmt = rec.amount;
            if(rec.category.group.type == 'expense') {useAmt = useAmt * -1;}
            if(MTFlex.Button2 == 4) {
                useTag = getStringPart(rec.account.id);
                TagsUpdateQueue(useID,useAmt,useTag,String(rec.account.order).padStart(3, '0'),'',0);
            } else if(MTFlex.Button2 == 3) {
                useTag = getStringPart(rec.notes.slice(2).split('\n')[0]);
                TagsUpdateQueue(useID,useAmt,useTag,useTag,'',0);
            } else if (MTFlex.Button2 == 5) {
                if(rec.goal == null) return;
                useTag = rec.goal.name;
                TagsUpdateQueue(useID,useAmt,useTag,useTag,'',0);
            } else if (MTFlex.Button2 == 6) {
                if(rec.ownedByUser == null) {
                   TagsUpdateQueue(useID,useAmt,'Shared',' Shared','',0);
                } else {
                    TagsUpdateQueue(useID,useAmt,rec.ownedByUser.displayName,rec.ownedByUser.displayName,'',0);
                }
            } else {
                ii = rec.tags.length;
                if(ii == 0) { TagsUpdateQueue(useID,useAmt,'','000','',9000000);}
                else if (ii > 1) { TagsUpdateQueue(useID,useAmt,'*','001','',8000000);}
                else {TagsUpdateQueue(useID,useAmt,rec.tags[0].name,String(rec.tags[0].order+2).padStart(3, '0'),rec.tags[0].color,0);}
            }
        }
        MTFlex.Loading.innerText = MTFlex.Loading.innerText.trim() + '.';
    } while (recCnt >= 2500);


    if(getCookie('MT_NetIncomeRankOrder',true) == 1) { TagCols.sort((a, b) => a.ORDER - b.ORDER);} else {TagCols.sort((a, b) => b.SORTV - a.SORTV); }
    MTP = [];MTP.Format = [1,2][getCookie('MT_NetIncomeNoDecimals',true)];
    let totalCol = 0;
    for (const TagCol of TagCols) {
        if(MTFlex.Button2 == 4) {
            useTitle = TagsGetAccountName(TagCol.NAME);
        } else {
            switch(TagCol.NAME) {
                case '': useTitle = 'Untagged';break;
                case '*': useTitle = 'Multiple';break;
                default: useTitle = TagCol.NAME;
            }
        }
        totalCol++;
        MTP.IsSortable = 2;
        if(TagCol.COLOR) {MTP.Indicator = TagCol.COLOR;}
        MF_QueueAddTitle(totalCol,useTitle,MTP);
    }
    totalCol++;
    MTP.IsSortable = 2; MF_QueueAddTitle(totalCol,'Total',MTP);

    for (const Tag of TagQueue) {
        ii = TagsIndexQueue(Tag.TagName);
        useID = Tag.ID;
        if(MF_GridUpdateUID(useID,ii+1,Tag.Amt,false) == false) {
            let retGroup = await rtnCategoryGroup(useID);
            MTP = [];
            MTP.IsHeader = false;
            MTP.UID = useID;
            if(retGroup.TYPE == 'expense') {
                if(retGroup.ISFIXED == true) {MTP.BasedOn = 3;MTP.Section = 4;
                                             } else {MTP.BasedOn = 5;MTP.Section = 6;}
                useURL = '#|spending|';
            } else {
                MTP.BasedOn = 1;MTP.Section = 2;
                useURL = '#|income|';
            }

            if(MTFlex.Button1 > 0) {
                if(MTFlex.Button1 == 2) {
                    MTP.PK = retGroup.GROUPNAME;
                    MTP.PKHRef = useURL + '|' + retGroup.GROUP + '|';
                    MTP.PKTriggerEvent = 'category-groups|' + retGroup.GROUP;
                }
                MTP.SKHRef = useURL + retGroup.ID + '||';
                MTP.SKTriggerEvent = 'categories|' + retGroup.ID;
                useTitle = retGroup.NAME;
            } else {
                useTitle = retGroup.GROUPNAME;
                MTP.SKHRef = useURL + '|' + retGroup.GROUP + '|';
                MTP.PKTriggerEvent = '';
                MTP.SKTriggerEvent = 'category-groups|' + retGroup.GROUP;
            }
            MTP.SKHRef = MTP.SKHRef + HiddenFilter + '|';

            MTP.Icon = retGroup.ICON;
            MF_QueueAddRow(MTP);
            MTFlexRow[MTFlexCR][0] = useTitle;
            MTFlexRow[MTFlexCR][ii+1] = Tag.Amt;
        }
    }
    MF_GridRollup(1,2,1,'Income');
    MF_GridRollup(3,4,3,'Fixed Spending');
    MF_GridRollup(5,6,5,'Flexible Spending');
    MF_GridRollDifference(7,3,5,1,'Spending','Add');
    MF_GridRollDifference(8,1,7,1,'Savings','Sub');
    MF_GridCalcRowRange(totalCol,1, totalCol-1,'Add');
    MF_GridCardAddAll(7,1,MTFlexTitle.length-2,8,MTFlexTitle.length-1,css.red,css.green);
    glo.spawnProcess = 1;

    function TagsUpdateQueue(inID,inAmt,inTag,inOrder,inColor,inFirstPass) {
        for (const Tag of TagQueue) {
             if(Tag.ID == inID && Tag.TagName == inTag) {Tag.Amt += inAmt; TagsSortQueue(inTag, inAmt); return;}
        }
        let retGroup = rtnCategoryGroup(useID);
        if(retGroup.TYPE == 'transfer') return;
        TagQueue.push({"ID": inID, "TagName": inTag ,"Amt": inAmt });
        if(inFirstPass == null) inFirstPass = 0;
        if(TagsIndexQueue(inTag) === -1) {TagCols.push({"NAME": inTag, "ORDER": inOrder, "COLOR": inColor, "SORTV": inAmt + inFirstPass});}
    }

    function TagsSortQueue(inTag, inValue) {
        for (let k = 0; k < TagCols.length; k += 1) {if(TagCols[k].NAME == inTag) TagCols[k].SORTV+=inValue;}
    }

    function TagsIndexQueue(inTag) {
        for (let k = 0; k < TagCols.length; k += 1) {if(TagCols[k].NAME == inTag) return k;}
        return -1;
    }

    function TagsGetAccountName(inID) {
        for (let l = 0; l < snapshotData.accounts.length; l += 1) { if(snapshotData.accounts[l].id == inID) return snapshotData.accounts[l].displayName; }
        return '';
    }
}

async function MenuReportsAccountsGo() {
    await MF_GridInit('MTAccounts', 'Accounts');
    MTFlex.SortSeq = ['1','2','3','4','5','6','7'];
    if(MTFlex.Button2 == 0 || MTFlex.Button2 == 2) { MTFlex.DateEvent = 2;} else { MTFlex.DateEvent = 3; }
    if(MTFlex.Button2 != 1) MTFlex.TriggerEvents = true;
    MF_SetupDates();
    MF_GridOptions(1,['by Class','by Account Type','by Account Subtype','by Account Group']);
    MF_GridOptions(2,['Standard Report','Personal Statement','Brokerage Statement','Last 6 months with average','Last 12 months with average','This year with average','Last 3 years by Quarter']);
    MF_GridOptions(4,getAccountGroupInfo());
    if(MTFlex.Button1 > 0) MTFlex.Subtotals = true;
    if(MTFlex.Button1 == 1 || MTFlex.Button1 == 2 || MTFlex.Button2 == 1) MTFlex.PKSlice = 2;

    MTFlex.Title1 = 'Accounts Report';
    MTFlex.Title3 = MTFlex.Button2Options[MTFlex.Button2];

    MTP = [];MTP.IsSortable = 1; MTP.Format = 0;
    MF_QueueAddTitle(0,'Description',MTP);
    MF_QueueAddTitle(1,'Type',MTP,MTFlex.Button1);
    MF_QueueAddTitle(2,'Subtype',MTP,MTFlex.Button1);
    MF_QueueAddTitle(3,'Group',MTP,MTFlex.Button1);

    if(MTFlex.Button2 == 1) {
        MTFlex.Subtotals = true;
        MTFlex.TableStyle = 'max-width: 640px;';
        MTFlexTitle[1].IsHidden = true;
        MTFlexTitle[2].IsHidden = true;
        MTFlexTitle[3].IsHidden = true;
        MTFlex.SpanHeaderColumns = 0;
    } else {
        MTFlex.SpanHeaderColumns = 2;
    }
    let skipHidden = getCookie('MT_AccountsHidden',true);
    let skipHidden2 = getCookie('MT_AccountsHidden2',true);
    let AccountGroupFilter = getAccountGroupFilter();
    let snapshotData5 = null;
    if(MTFlex.Button2 > 2) {await MenuReportsAccountsGoExt();} else {await MenuReportsAccountsGoStd();}
    glo.spawnProcess = 1;

    async function MenuReportsAccountsGoExt(){

        let snapshotData3 = null,aSelected = false;
        let CurMonth = getDates('n_CurMonth',MTFlexDate2),CurYear = 0;
        let NumMonths = (MTFlex.Button2 == 3) ? 6 : 12;
        let useDate = getDates('d_Minus1Year',MTFlexDate2);
        let isToday = getDates('isToday',MTFlexDate2);
        MTFlex.Title2 = 'Last ' + NumMonths + ' Months as of ' + getDates('s_FullDate',MTFlexDate2);
        const useEOM = getCookie('MT_AccountsEOM',true);

        if (MTFlex.Button2 == 6) {
            MTFlex.Title2 = 'Last 3 years as of ' + getDates('s_FullDate',MTFlexDate2);
            useDate = getDates('d_ThisQTRs',MTFlexDate2);
            CurMonth = useDate.getMonth();CurYear = useDate.getFullYear() - 3;
            CurMonth+=3; if(CurMonth == 12) {CurMonth = 0;CurYear++;}
            useDate.setFullYear(CurYear,CurMonth,1);
            for (let i = 0; i < 12; i++) {
                MTP.IsSortable = 2;MTP.Format = 2;MF_QueueAddTitle(i+4,getMonthName(CurMonth,true) + "'" + CurYear % 100,MTP);
                CurMonth+=3; if(CurMonth == 12) {CurMonth = 0;CurYear++;}
            }
            CurMonth = useDate.getMonth();CurYear = useDate.getFullYear();
        } else {
            if(MTFlex.Button2 == 5) { NumMonths = CurMonth;MTFlex.Title2 = 'This year as of ' + getDates('s_FullDate',MTFlexDate2); }
            for (let i = 0; i < 12; i++) {
                if(i < (12-NumMonths)) {MTP.IsHidden = true;} else {MTP.IsHidden = false;}
                MTP.IsSortable = 2;MTP.Format = 2;MF_QueueAddTitle(i+4,getMonthName(CurMonth,true),MTP);
                CurMonth++; if(CurMonth == 12) {CurMonth = 0;}
            }
        }
        MTFlex.RequiredCols = [4,5,6,7,8,9,10,11,12,13,14,15,16];
        MTP.IsHidden = false;
        MF_QueueAddTitle(16,getDates('s_ShortDate',MTFlexDate2),MTP);
        MF_QueueAddTitle(17,'Avg',MTP);
        accountsData = await getAccountsData();
        if(isToday == false) {snapshotData5 = await getDisplayBalanceAtDateData(formatQueryDate(MTFlexDate2));}
        for (let i = 0; i < accountsData.accounts.length; i++) {
            if(AccountGroupFilter == '' || AccountGroupFilter == getCookie('MTAccounts:' + accountsData.accounts[i].id,false)) {
                aSelected = true;
                if(accountsData.accounts[i].hideFromList == false || skipHidden == 0) {
                    if(accountsData.accounts[i].includeInNetWorth == true || skipHidden2 == 0) {
                        MTP = [];
                        MTP.IsHeader = false;
                        MTP.UID = accountsData.accounts[i].id;
                        MTP.SKTriggerEvent = i;
                        let accountName = getAccountPrimaryKey(accountsData.accounts[i].isAsset,accountsData.accounts[i].type.display,accountsData.accounts[i].subtype.display,accountsData.accounts[i].logoUrl);
                        MF_QueueAddRow(MTP);
                        MTFlexRow[MTFlexCR][0] = accountsData.accounts[i].displayName;
                        MTFlexRow[MTFlexCR][1] = accountsData.accounts[i].type.display;
                        MTFlexRow[MTFlexCR][2] = accountsData.accounts[i].subtype.display;
                        MTFlexRow[MTFlexCR][3] = accountName;
                        if(isToday == true) {
                             MTFlexRow[MTFlexCR][16] = Number(accountsData.accounts[i].displayBalance);
                        } else {
                            MTFlexRow[MTFlexCR][16] = getAccountPrevBalance(MTP.UID);
                        }
                    }
                }
            }
        }

        let workDate = null;
        for (let i = 0; i < 12; i++) {
            let used = false;
            if(useEOM == true) {workDate = getDates('d_EndofMonth',useDate);} else {workDate = useDate;}
            snapshotData3 = await getDisplayBalanceAtDateData(formatQueryDate(workDate));
            for (let j = 0; j < snapshotData3.accounts.length; j++) {
                MF_GridUpdateUID(snapshotData3.accounts[j].id,i+4,snapshotData3.accounts[j].displayBalance,false);
                if(snapshotData3.accounts[j].displayBalance != null) {used = true;}
            }
            if(MTFlex.Button2 == 6) {
                if(used == false) {MTFlexTitle[i+4].IsHidden = true;}
                CurMonth+=3;
                if(CurMonth > 11) {CurMonth=0;CurYear++;}
                useDate.setFullYear(CurYear,CurMonth,1);
            } else {
                CurMonth++;
                if(CurMonth == 12) {
                    CurMonth=0;
                    useDate.setFullYear(useDate.getFullYear() + 1);
                }
                useDate.setMonth(CurMonth);
            }
        }
        if(MTFlex.Button2 == 5 && CurMonth == 0) {MTFlexTitle[4].IsHidden = false;}
        MF_GridRollup(1,2,1,'Assets');
        MF_GridRollup(3,4,3,'Liabilities');
        MF_GridRollDifference(5,1,3,1,'Net Worth/Totals','Add');
        MF_GridCalcDifference(5,1,3,[4,5,6,7,8,9,10,11,12,13,14,15,16],'Sub');
        MF_GridCalcRowRange(17,4,15,'Avg');
        MF_GridCardAdd(1,4,15,'HV','Highest Assets\nwere','',css.green,'','',' in ');
        MF_GridCardAdd(3,4,15,'HV','Highest Liabilities\nwere','',css.red,'','', ' in ');
        MF_GridCardAdd(2,4,15,'HV','Highest Asset','',css.green,'',' was with ', ' in ');
        MF_GridCardAdd(4,4,15,'HV','Highest Liability','',css.red,'',' was with ', ' in ');
        MF_GridCardAdd(3,17,17,'HV','Average Liabilities','',css.red,'','', '');
    }

    async function MenuReportsAccountsGoStd(){

        let snapshotData3 = null, pendingData = null, aSelected = false;
        let cards = 0,acard=[0,0,0,0,0],cats = [];
        let isToday = getDates('isToday',MTFlexDate2);
        let NetWorthLit = 'Net Worth/Totals';
        let useBalance = 0, pastBalance = 0, useAmount = 0,useSubType = '';
        const incTrans = getCookie('MT_AccountsNetTransfers',true);

        if(MTFlex.Button2 == 1) {
            MTP.IsHidden = true;
            MTFlex.HideDetails = true;
            NetWorthLit = 'Net Worth';
            MF_GridOptions(1,[]);
            MTFlex.Title1 = 'Personal Net Worth Statement';
            MTFlex.Title2 = 'As of ' + getDates('s_FullDate',MTFlexDate2);

        } else {
            MTFlex.Title2 = getDates('s_FullDate',MTFlexDate1) + ' - ' + getDates('s_FullDate',MTFlexDate2);
            MTFlex.Title3 = MTFlex.Button2Options[MTFlex.Button2];
            MTFlex.RequiredCols = [5,9,11,12];
        }

        if(getCookie('MT_AccountsHideUpdated',true) == 1) {MTP.IsHidden = true;}
        MTP.Format = -1;MF_QueueAddTitle(4,'Updated',MTP);
        if(MTFlex.Button2 != 1) MTP.IsHidden = false;
        MTP.IsSortable = 2; MTP.Format = [1,2][getCookie('MT_AccountsNoDecimals',true)];
        if(MTFlex.Button2 == 2) MTP.ShowPercent = {Type: 'Column'};
        MF_QueueAddTitle(5,'Beg Balance',MTP);
        if(MTFlex.Button2 == 2) {MTP.IsHidden = true;}
        MTP.ShowPercent = null;
        MF_QueueAddTitle(6,'Income',MTP);
        MF_QueueAddTitle(7,'Expenses',MTP);
        if(MTFlex.Button2 == 2) {MTP.IsHidden = false;}
        MF_QueueAddTitle(8,'Transfers',MTP);
        MTP.IsHidden = false;
        if(MTFlex.Button2 == 2) MTP.ShowPercent = {Type: 'Column'};
        MF_QueueAddTitle(9,'Balance',MTP);
        MTP.ShowPercent = null;
        if(MTFlex.Button2 != 1) {
            if(MTFlex.Button2 == 2) {
                if(incTrans == 1) MTP.ShowPercent = {Type: 'Row', Col1: [5], Col2: [9,8]}; else MTP.ShowPercent = {Type: 'Row', Col1: [5], Col2: [9]};
                MF_QueueAddTitle(10,'Net Change',MTP);
                cats = rtnCategoryGroupList(null, 'transfer', true);
                portfolioData = await getPortfolioHolding();
                MTP.ShowPercent = null;
                if(getCookie('MT_AccountsHideBSPos',true) == 1) MTP.IsHidden = true; else MTP.IsHidden = false;
                MF_QueueAddTitle(11,'Positions',MTP);
                if(getCookie('MT_AccountsHideBSCash',true) == 1) MTP.IsHidden = true; else MTP.IsHidden = false;
                MF_QueueAddTitle(12,'Cash Balance',MTP);
            } else {
                if(getCookie('MT_AccountsHidePer2',true) == 0) MTP.ShowPercent = {Type: 'Row', Col1: [5], Col2: [9]};
                if(getCookie('MT_AccountsHidePer1',true) == 1) MTP.IsHidden = true; else MTP.IsHidden = false;
                MF_QueueAddTitle(10,'Net Change',MTP);
                if(getCookie('MT_AccountsHidePending',true) == 1) MTP.IsHidden = true; else MTP.IsHidden = false;
                MTP.ShowPercent = null;MF_QueueAddTitle(11,'Pending',MTP);
                MF_QueueAddTitle(12,'Projected',MTP);
            }
        }

        accountsData = await getAccountsData();
        if(MTFlex.Button2 != 1) {
            transData = await getTransactions(formatQueryDate(MTFlexDate1),formatQueryDate(MTFlexDate2),0,false,null,false,null,null,cats);
        }
        snapshotData3 = await getDisplayBalanceAtDateData(formatQueryDate(MTFlexDate1));
        pendingData = await getTransactions(formatQueryDate(getDates('d_StartofLastMonth')),formatQueryDate(MTFlexDate2),0,true,null,false);
        if(isToday == false) {snapshotData5 = await getDisplayBalanceAtDateData(formatQueryDate(MTFlexDate2));}

        for (let i = 0; i < 5; i++) { if(getCookie('MT_AccountsCard' + i.toString(),true) == 1) {cards++;}}
        for (let i = 0; i < accountsData.accounts.length; i ++) {
            if(MTFlex.Button2 == 2) {if(accountsData.accounts[i].type.name != 'brokerage') continue;}
            if(AccountGroupFilter == '' || AccountGroupFilter == getCookie('MTAccounts:' + accountsData.accounts[i].id,false)) {
                aSelected = true;
                if(accountsData.accounts[i].hideFromList == false || skipHidden == 0) {
                    if(accountsData.accounts[i].includeInNetWorth == true || skipHidden2 == 0) {
                        MTP = [];
                        MTP.IsHeader = false;
                        MTP.UID = accountsData.accounts[i].id;
                        MTP.SKTriggerEvent = i;
                        if(isToday == true) { useBalance = Number(accountsData.accounts[i].displayBalance);
                        } else { useBalance = getAccountPrevBalance(MTP.UID); }
                        if(useBalance == null) {useBalance = 0;}
                        pastBalance = getAccountBalance(MTP.UID);
                        if(pastBalance == null) {pastBalance = 0;}
                        if(MTFlex.Button2 == 1 || useBalance !=0 || pastBalance != 0 || getAccountUsed(MTP.UID) == true ) {
                            useSubType = getCookie('MTAccountsSub:' + accountsData.accounts[i].id,false);
                            if(!useSubType) {useSubType = accountsData.accounts[i].subtype.display;}
                            let accountName = getAccountPrimaryKey(accountsData.accounts[i].isAsset,accountsData.accounts[i].type.display,useSubType,accountsData.accounts[i].logoUrl);
                            MF_QueueAddRow(MTP);
                            MTFlexRow[MTFlexCR][0] = accountsData.accounts[i].displayName;
                            MTFlexRow[MTFlexCR][1] = accountsData.accounts[i].type.display;
                            MTFlexRow[MTFlexCR][2] = useSubType;
                            MTFlexRow[MTFlexCR][3] = accountName;
                            MTFlexRow[MTFlexCR][4] = accountsData.accounts[i].displayLastUpdatedAt.substring(0, 10);
                            MTFlexRow[MTFlexCR][9] = useBalance;
                            if(MTFlex.Button2 != 1 && accountsData.accounts[i].hideTransactionsFromReports == false) {
                                for (let j = 0; j < transData.allTransactions.results.length; j++) {
                                    if(transData.allTransactions.results[j].hideFromReports == false) {
                                        if(transData.allTransactions.results[j].account.id == accountsData.accounts[i].id) {
                                            switch (transData.allTransactions.results[j].category.group.type) {
                                                case 'expense':
                                                    useAmount = transData.allTransactions.results[j].amount * -1;
                                                    MTFlexRow[MTFlexCR][7] += useAmount;
                                                    MTFlexRow[MTFlexCR][7] = parseFloat(MTFlexRow[MTFlexCR][7].toFixed(2));
                                                    break;
                                                case 'income':
                                                    MTFlexRow[MTFlexCR][6] += transData.allTransactions.results[j].amount;
                                                    break;
                                                case 'transfer':
                                                    MTFlexRow[MTFlexCR][8] += transData.allTransactions.results[j].amount;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                            MTFlexRow[MTFlexCR][11] = getAccountPendingBalance(accountsData.accounts[i].id);
                            MTFlexRow[MTFlexCR][5] = pastBalance;
                            MTFlexRow[MTFlexCR][5] = parseFloat(MTFlexRow[MTFlexCR][5].toFixed(2));
                            if(MTFlex.Button2 == 2 && incTrans == 1 ) {
                                MTFlexRow[MTFlexCR][10] = useBalance - (MTFlexRow[MTFlexCR][5] + MTFlexRow[MTFlexCR][8]);
                            } else {
                                MTFlexRow[MTFlexCR][10] = useBalance - MTFlexRow[MTFlexCR][5];
                            }
                            MTFlexRow[MTFlexCR][10] = parseFloat(MTFlexRow[MTFlexCR][10].toFixed(2));
                            if(MTFlex.Button2 == 2) {
                                MTFlexRow[MTFlexCR][11] = parseFloat(portfolioData[MTP.UID].toFixed(2));
                                MTFlexRow[MTFlexCR][12] = parseFloat((useBalance - portfolioData[MTP.UID]).toFixed(2));
                            } else {
                                MTFlexRow[MTFlexCR][11] = parseFloat(MTFlexRow[MTFlexCR][11].toFixed(2));
                                MTFlexRow[MTFlexCR][12] = useBalance + MTFlexRow[MTFlexCR][11];
                            }
                            if(MTFlex.Button2 != 1) {
                                if(accountsData.accounts[i].subtype.name == 'checking') {acard[0] += useBalance;}
                                if(accountsData.accounts[i].subtype.name == 'savings') {acard[1] += useBalance;}
                                if(accountsData.accounts[i].subtype.name == 'credit_card') {acard[2] += useBalance;}
                                if(accountsData.accounts[i].type.display == 'Investments') {acard[3] += useBalance;}
                                if(accountsData.accounts[i].subtype.display == '401k') {acard[4] += useBalance;}
                                if((accountsData.accounts[i].subtype.name == 'credit_card') && cards < 5) {
                                    MTP = [];MTP.Col = cards;
                                    MTP.Title = getDollarValue(useBalance,MTFlexTitle[4].Format == 2 ? true : false);
                                    MTP.Subtitle = accountsData.accounts[i].displayName;
                                    MTP.Style = css.red;
                                    MF_QueueAddCard(MTP);
                                    cards++;
                                }
                            }
                        }
                    }
                }
            }
        }

        MF_GridRollup(1,2,1,'Assets');
        if(MTFlex.Button2 == 2) {
            MF_GridCardAdd(1,9,9,'HV','Total Brokerage','Total Brokerage',css.green,css.red,'', '',0);
            MF_GridCardAdd(1,8,8,'HV','Transfers','Transfers',css.green,css.red,'', '',99);
            MTFlex.AutoCard = {Title: 'Net Change', Section: 2, Column: 10, Split: true };
        } else {
            MF_GridRollup(3,4,3,'Liabilities');
            MF_GridRollDifference(5,1,3,1,NetWorthLit,'Add');
            MF_GridCalcDifference(5,1,3,[5,9,10,12],'Sub');
            cards=0;
            for (let i = 0; i < 5; i++) {
                if(getCookie('MT_AccountsCard' + i.toString(),true) == 1) {
                    if(acard[i] != 0) {
                        MTP = [];MTP.Col = cards;MTP.Title = getDollarValue(acard[i],MTFlexTitle[4].Format == 2 ? true : false);MTP.Subtitle = 'Total ' + ['Checking', 'Savings', 'Credit Cards', 'Investments','401k'][i];
                        MTP.Style = [css.green,css.green,css.red,css.green,css.green][i];MF_QueueAddCard(MTP);
                    }
                }
            }
        }

        function getAccountUsed(inId) {
            for (let k = 0; k < transData.allTransactions.results.length; k++) {
                if(transData.allTransactions.results[k].account.id == inId) { return true; }
            }
            return false;
        }

        function getAccountBalance(inId) {
            for (let k = 0; k < snapshotData3.accounts.length; k++) {
                if(snapshotData3.accounts[k].id == inId ) { return snapshotData3.accounts[k].displayBalance; }
            }
            return 0;
        }
        function getAccountPendingBalance(inId) {
            let amt = 0;
            for (let j = 0; j < pendingData.allTransactions.results.length; j++) {
                if(pendingData.allTransactions.results[j].account.id == inId) {
                    amt = amt + pendingData.allTransactions.results[j].amount;
                }
            }
            amt = amt * -1;return amt;
        }
    }

    function getAccountPrevBalance(inId) {
        for (let k = 0; k < snapshotData5.accounts.length; k++) {
            if(snapshotData5.accounts[k].id == inId ) { return snapshotData5.accounts[k].displayBalance; }
        }
        return 0;
    }

    function getAccountPrimaryKey(inAsset,inDisplay,inSubDisplay,inlogoUrl) {
        if(inAsset == true) {
            MTP.BasedOn = 1; MTP.Section = 2;
        } else {
            MTP.BasedOn = 3; MTP.Section = 4;
        }
        MTP.SKHRef = '/accounts/details/' + MTP.UID;
        if(inlogoUrl) { MTP.SKlogoUrl = inlogoUrl;}
        let accountName = getCookie('MTAccounts:' + MTP.UID,false);
        if(MTFlex.Button2 == 1) {
            MTP.PK = inDisplay;
            if(inList(inDisplay,['Credit Cards','Other Liabilities','Other Assets']) == 0) {
                MTP.PK = inDisplay + ' - ' + inSubDisplay;
            }
            MTP.PK = (MTP.PK.startsWith('Other ')) ? '02' + MTP.PK : '01' + MTP.PK;
        } else {
            switch(MTFlex.Button1) {
                case 1:
                    MTP.PK = inDisplay;
                    MTP.PK = (MTP.PK.startsWith('Other ')) ? '02' + MTP.PK : '01' + MTP.PK;
                    break;
                case 2:
                    MTP.PK = inSubDisplay;
                    MTP.PK = (MTP.PK.startsWith('Other ')) ? '02' + MTP.PK : '01' + MTP.PK;
                    break;
                case 3:MTP.PK = accountName;break;
                default:MTP.PK = MTP.BasedOn.toString();
            }
        }
        return accountName;
    }
}

function getAccountGroupInfo(inName) {
    let items = [],value = '',key='',keyid='';
    for (let i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        if(key.startsWith('MTAccounts:')) {
            value = localStorage.getItem(key);
            if(value != '') {
                if(inName) {
                    if(inName == value) {keyid = localStorage.key(i).slice(11);items.push(keyid);}
                } else {if(!items.includes(value)) {items.push(value);}}
            }
        }
    }
    if(inName == undefined && items.length > 0) {items.sort();items.unshift('All Groups');}
    return items;
}

function getAccountSubGroupInfo(inId,inName) {
    const getSub = getCookie('MTAccountsSub:' + inId,false);
    if(getSub) return getSub;
    return inName;
}

function getAccountGroupFilter() {
    if(MTFlex.Button4Options.length > 1 && MTFlex.Button4 > 0) {
        const p = getAccountGroupInfo();
        if(p.length >= MTFlex.Button4) {return p[MTFlex.Button4];}
    }
    return '';
}

async function MenuAccountsSummary() {
    const topDiv = document.querySelector('div.MTAccountSummary');
    if(topDiv) return;
    let aSummary = [];
    const elements = document.querySelectorAll('[class*="AccountSummaryCardGroup__CardSection"]');
    if(elements.length > 1) {
        if(getCookie('MT_Ownership',true) == 1) {
            const divc = document.querySelector('[class*="Controls-sc-1"]');
            if(divc && divc.childNodes.length > 3) {
                divc.childNodes[0].style = 'display:none;';
                divc.childNodes[1].style = 'display:none;';
                divc.childNodes[2].style = 'display:none;';
            }
        }
        let snapshotData = await getAccountsData();
        for (let i = 0; i < snapshotData.accounts.length; i++) {
            if(snapshotData.accounts[i].hideFromList == false && snapshotData.accounts[i].includeInNetWorth == true) {
                let AccountGroupFilter = getCookie('MTAccounts:' + snapshotData.accounts[i].id,false);
                MenuAccountSummaryUpdate(AccountGroupFilter, snapshotData.accounts[i].isAsset, snapshotData.accounts[i].displayBalance,snapshotData.accounts[i].displayName);
            }
        }
        aSummary.sort();
        MenuAccountSummaryShow(elements[0],true);
        MenuAccountSummaryShow(elements[1],false);
    } else { glo.spawnProcess = 4; }

    function MenuAccountSummaryShow(inParent,isAsset) {
        let cn = inParent.childNodes[0];
        let cnClass = cn.className;
        let div = document.createElement('div');
        div.className = 'MTAccountSummary';
        div = inParent.insertBefore(div, cn.nextSibling);
        let divChild = null,tt='';
        for (let j = 0; j < aSummary.length; j++) {
            if((isAsset && aSummary[j].Asset != 0) || (!isAsset && aSummary[j].Liability !=0)) {
                divChild = cec('div',cnClass,div,'','','margin-bottom: 5px;');
                if(isAsset == true) {tt = aSummary[j].ToolTipAsset;} else {tt = aSummary[j].ToolTipLiability;}
                cecTip('span','',divChild,aSummary[j].AccountGroup,tt);
                cec('span','fs-exclude',divChild,isAsset == true ? getDollarValue(aSummary[j].Asset) : getDollarValue(aSummary[j].Liability),'','color: rgb(119, 117, 115)');
            }
        }
        if(divChild) {cec('div','',div,'','','margin-bottom: 18px;');}
    }

    function MenuAccountSummaryUpdate(inGroup,inA,inBal,inDesc) {
        let ttLit = inDesc + ': \xa0\xa0\xa0' + getDollarValue(inBal,2);
        let tta='',ttl='';
        if(inA == true) {tta = ttLit;} else {ttl = ttLit;}

        for (let j = 0; j < aSummary.length; j++) {
            if(aSummary[j].AccountGroup == inGroup) {
                if(inA == true) {
                    aSummary[j].Asset += Number(inBal);
                    aSummary[j].ToolTipAsset += '\n' + ttLit;
                    if(aSummary[j].ToolTipAsset.startsWith('\n')) {aSummary[j].ToolTipAsset = aSummary[j].ToolTipAsset.slice(1);}
                } else {
                    aSummary[j].Liability += Number(inBal);
                    aSummary[j].ToolTipLiability += '\n' + ttLit;
                    if(aSummary[j].ToolTipLiability.startsWith('\n')) {aSummary[j].ToolTipLiability=aSummary[j].ToolTipLiability.slice(1);}
                }
                return;
            }
        }
        aSummary.push({"AccountGroup": inGroup, "ToolTipAsset": tta ,"ToolTipLiability":ttl,"Asset": inA == true ? Number(inBal) : 0, "Liability": inA == true ? 0 : Number(inBal) });
    }
}

async function MenuReportsInvestmentsGo() {

    await MF_GridInit('MTInvestments', 'Investments');
    MTFlex.CanvasTitle = 'font-size: 13px;';
    MTFlex.CanvasRow = 'font-size: 13.1px;  line-height: 26px; height: 26px;';
    if(MTFlex.Button2 == 2) {MTFlex.DateEvent = 2;}
    MTFlex.TriggerEvents = true;
    MF_SetupDates();
    MF_GridOptions(1,['by Positions','by Institution','by Account','by Account Subtype','by Stock Type','by Account/Stock Type']);
    MF_GridOptions(2,['Positions','Allocation','Performance']);
    MF_GridOptions(4,getAccountGroupInfo());
    MTFlex.SortSeq = ['1','2','3'];

    const maxCards = getCookie('MT_InvestmentCards',true);
    const splitTicker = getCookie('MT_InvestmentsSplitTicker',true);

    if(MTFlex.Button2 < 2) {
        MTFlexDate2 = getDates('d_Today');
        MTFlexDate1 = getDates('d_MinusWeek',MTFlexDate2);
    }

    let lowerDate = formatQueryDate(MTFlexDate1);
    let higherDate = formatQueryDate(MTFlexDate2);
    let sumPortfolio = 0, cashValue = 0, sumCash = 0, accQueue = [];
    let tickers = [], Cards = [0,'',0,''],UpDown = [0,0], numCards = 0;

    MTFlex.Title1 = 'Investments Report';
    if(MTFlex.Button2 < 2) {
        MTFlex.Title2 = 'As of ' + getDates('s_FullDate');
    } else {
        if(daysBetween(MTFlexDate1,MTFlexDate2,false) < 7) { MTFlexDate1 = getDates('d_MinusWeek',MTFlexDate2);}
        MTFlex.Title2 = getDates('s_FullDate',MTFlexDate1) + ' - ' + getDates('s_FullDate',MTFlexDate2);
        tickers = getCookie('MTInvestmentTickers',false).split(',');
    }
    MTFlex.Title3 = MTFlex.Button2Options[MTFlex.Button2];
    MTFlex.SpanHeaderColumns = 3;

    MTP = [];MTP.IsSortable = 1; MTP.Format = 0;
    if(splitTicker == 1) {
        MTP.Width = '';MTP.Width = '45px';MF_QueueAddTitle(0,'Ticker',MTP);
        MTP.Width = '125px';MF_QueueAddTitle(1,'Description',MTP);
    } else {
        MTP.Width = '145px;';MF_QueueAddTitle(0,'Name',MTP);
        MTP.Width = '';MF_QueueAddTitle(1,'Description',MTP,true);
    }
    if(getCookie('MT_InvestmentsHideInst',true) == 1) {MF_QueueAddTitle(2,'Institution',MTP,2);} else { MF_QueueAddTitle(2,'Institution',MTP,MTFlex.Button1+1);}
    await MenuReportsInvestmentsStd();
    glo.spawnProcess = 1;

    async function MenuReportsInvestmentsStd() {

        if(MTFlex.Button1 == 2 || MTFlex.Button1 == 5) {MTP.IsHidden = true;}
        MF_QueueAddTitle(3,'Account',MTP,MTFlex.Button1+1);
        MF_QueueAddTitle(4,'Subtype',MTP,MTFlex.Button1+1);
        if(MTFlex.Button2 == 1) {MTFlexTitle[3].IsHidden = true;MTFlexTitle[4].IsHidden = true;}
        MF_QueueAddTitle(5,'Type',MTP,MTFlex.Button1+1);
        MTP.IsSortable = 2;MTP.IsHidden = false;
        MTP.Width = '80px';MTP.Format = 1;MTP.IgnoreTotals = true; MF_QueueAddTitle(6,'Price',MTP);
        MTP.Width = '80px';MTP.Format = 3;MTP.IgnoreTotals = true; MF_QueueAddTitle(7,'Qty',MTP);
        MTP.Width = '105px';MTP.Format = getCookie('MT_InvestmentsNoDecimals',true) + 1;MTP.IgnoreTotals = false;MF_QueueAddTitle(8,'Value',MTP);
        MTP = [];MTP.IsSortable = 2;
        MTP.Width = '106px';MTP.Format = getCookie('MT_InvestmentsNoDecimals',true) + 1;MF_QueueAddTitle(9,'Cost Basis',MTP);
        MTP.Width = '106px';MF_QueueAddTitle(10,'Gain/Loss $',MTP);
        MTP.Width = '108px';MTP.Format = 4;MF_QueueAddTitle(11,'Gain/Loss %',MTP);
        if(MTFlex.Button2 < 2) {
            MTP.Width = '85px';MF_QueueAddTitle(12,'Acct %',MTP);
            MTP.Width = '94px';MF_QueueAddTitle(13,'Port %',MTP,);
        } else {
            MTP.IgnoreTotals = true;
            MTP.ShowPercent = null;
            const db = daysBetween(MTFlexDate1,MTFlexDate2,true);
            MTP.Width = '106px';MTP.Format = 1;MF_QueueAddTitle(12,db + ' Chg $',MTP,);
            MTP.Width = '106px';MTP.Format = 4;MF_QueueAddTitle(13,db + ' Chg %',MTP);
        }
        if(MTFlex.Button1 == 4 && MTFlex.Button2 < 2) { MTFlexTitle[12].Title = 'Type %';}
        if(MTFlex.Button1 == 5) { MTFlexTitle[3].IsHidden = true; MTFlexTitle[5].IsHidden = true;}
        portfolioData = await getPortfolio(lowerDate, higherDate);

        await BuildInvestmentHoldings();
        await BuildInvestmentCash();
        if(MTFlex.Button1 == 0) { MF_GridRollup(1,2,1,'Positions');} else {
            MF_GridGroupByPK(); // Rollup to primary key
            if(MTFlex.Button1 == 5) { MF_GridRegroupPK(5); MTFlex.Subtotals = true; } // rollup to sub-total
            MF_GridRollup(0,0,0,'Total');
        }
        MF_GridCalcRowPercent(11,9,8);
        if(MTFlex.Button2 < 2) {
            MF_GridCalcColPercent(12, 8,false);
            MF_GridCalcColPercent(13, 8,true);
        }
        await BuildInvestmentCards();

        async function BuildInvestmentHoldings() {
            let secPercent = 0, RRN = 0;
            const skipCalc = getCookie('MT_InvestmentSkipCurrent',true);
            for (const edge of portfolioData.portfolio.aggregateHoldings.edges) {
                secPercent = edge.node.securityPriceChangePercent;
                const holdings = edge.node.holdings;
                let CardShown = false,fixEntry = false,hld=0;

                let currentStockPrice = edge.node.security?.currentPrice ?? 0;
                if(edge.node.lastSyncedAt == null) {edge.node.lastSyncedAt = 'MMT'; fixEntry = true;}

                for (const holding of holdings) {
                    let useInst = '', useAccount = '', useTicker = '', shortTitle = '', longTitle = '';
                    hld++;
                    if(MTFlexAccountFilter.filter.length > 0) {if(!MTFlexAccountFilter.filter.includes(holding.account.id)) continue; }
                    if(MTFlex.Button4 < 1) {if(holding.account.includeBalanceInNetWorth == false) continue; }
                    if(MTFlex.Button2 == 2) { if (inList(holding.type,eqTypes) == 0) continue; }
                    let useCostBasis = getCostBasis(holding.costBasis,holding.type,holding.quantity);
                    let skipRec = false;

                    let useSubType = getAccountSubGroupInfo(holding.account.id,holding.account.subtype.display);
                    if(holding.account.institution != null) {useInst = holding.account.institution.name.trim();}
                    if(holding.account.displayName != null) {useAccount = holding.account.displayName.trim();}

                    if(!fixEntry) {
                        const account = accQueue.find(acc => acc.id === holding.account.id);
                        if (account) { account.holdingBalance += holding.value;} else {
                            accQueue.push({"id": holding.account.id, "holdingBalance": holding.value,
                                           "portfolioBalance": Number(holding.account.displayBalance),"institutionName": useInst,
                                           "accountName": useAccount,"accountSubtype": useSubType,});
                        }
                    }
                    if(inList(holding.type,eqTypes) > 0) {
                        if(fixEntry || Number(holding.value) == 0 || skipCalc == false) {
                            if(currentStockPrice == 0) {currentStockPrice = holding.closingPrice;}
                            holding.closingPrice = currentStockPrice;
                            holding.closingPriceUpdatedAt = getDates('s_YMD');
                            holding.value = holding.quantity * holding.closingPrice;
                            holding.value = +holding.value.toFixed(2);
                        }
                    }

                    let useHoldingValue = Number(holding.value);
                    let useGainLoss = useCostBasis != null ? useHoldingValue - useCostBasis : 0;

                    if (holding.ticker != null) {
                        useTicker = holding.ticker.trim();
                        if(MTFlex.Button2 == 1) {
                            if(MTFlex.Button1 == 0 || MTFlex.Button1 == 1 || MTFlex.Button1 == 4) {
                                if(MF_GridUpdateUID(useTicker,7,holding.quantity,false,true)) {
                                    MF_GridUpdateUID(useTicker,8,useHoldingValue,false,true);
                                    MF_GridUpdateUID(useTicker,9,useCostBasis,false,true);
                                    skipRec = true;
                                }
                            }
                        }
                    }

                    if (holding.name != null) {longTitle = holding.name.trim();}
                    if(useTicker == '' && longTitle == '') {
                        longTitle = holding.typeDisplay + ' (' + holding.account.type.display + ' - ' + holding.account.subtype.display + ')';
                        shortTitle = longTitle;
                    } else if (useTicker != '' && longTitle != '') {
                        shortTitle = useTicker + ' \u2022 ' + longTitle;
                    } else {
                        shortTitle = longTitle;
                        if(holding.type == 'fixed_income') {
                            const bP = getBondPieces(shortTitle);
                            shortTitle = bP[0] + ' ' + bP[1];
                        }
                    }
                    if (shortTitle.length > 50) {shortTitle = shortTitle.slice(0, 50) + ' ...';}
                    if(skipRec == false) {
                        if(holding.typeDisplay == 'Cryptocurrency') holding.typeDisplay = 'Crypto';
                        MTP = [];
                        MTP.UID = holding.id;
                        if(MTFlex.Button2 == 1 && useTicker) {MTP.UID = useTicker;}
                        MTP.RRN = RRN;
                        if(MTFlex.Button1 == 0) {MTP.Section = 2;MTP.BasedOn = 1;}
                        MTP.SKTriggerEvent = MTP.RRN + '|' + (hld-1);
                        MTP.PK = getInvestmentPK(useInst,useAccount, useSubType,holding.typeDisplay);
                        if(MTP.PK == null) {MTP.PK = '';}
                        MTP.SKHRef = '/accounts/details/' + holding.account.id;
                        MF_QueueAddRow(MTP);
                        if(splitTicker == 1) { MTFlexRow[MTFlexCR][0] = useTicker;} else {MTFlexRow[MTFlexCR][0] = shortTitle;}
                        if (longTitle.length > 45) {longTitle = longTitle.slice(0, 45) + ' ...';}
                        MTFlexRow[MTFlexCR][1] = longTitle;
                        MTFlexRow[MTFlexCR][2] = useInst;
                        MTFlexRow[MTFlexCR][3] = useAccount;
                        MTFlexRow[MTFlexCR][4] = useSubType;
                        MTFlexRow[MTFlexCR][5] = holding.typeDisplay;
                        MTFlexRow[MTFlexCR][6] = holding.closingPrice;
                        MTFlexRow[MTFlexCR][7] = holding.quantity;
                        MTFlexRow[MTFlexCR][8] = useHoldingValue;
                        MTFlexRow[MTFlexCR][9] = useCostBasis;
                        if(useCostBasis != null && useHoldingValue != 0) {
                            MTFlexRow[MTFlexCR][10] = useGainLoss;
                            // 11 = % of Gain/Loss
                        }
                        if(MTFlex.Button2 == 2) {
                            MTFlexRow[MTFlexCR][12] = edge.node.securityPriceChangeDollars;
                            MTFlexRow[MTFlexCR][13] = secPercent;
                            if(secPercent < Cards[2]) {Cards[2] = secPercent;Cards[3]=shortTitle;}
                            if(secPercent > Cards[0]) {Cards[0] = secPercent;Cards[1]=shortTitle;}
                            if(secPercent < 0) {UpDown[0]++;} else if(secPercent > 0) {UpDown[1]++;}
                            const tickerNdx = inList(holding.ticker,tickers);
                            if(tickerNdx > 0 && CardShown == false) {
                                let cardStyle = '';
                                if(secPercent == null) { secPercent = 0; } else {
                                    if(secPercent < 0) {cardStyle = css.red;}
                                    else if(secPercent > 0) {cardStyle = css.green;}
                                }
                                if(numCards + 2 < maxCards) {
                                    numCards++;
                                    MF_QueueAddCard({Col: tickerNdx + 2, Title: secPercent + '%', Subtitle: BuildInvestmentCardDesc(shortTitle), Style: cardStyle});
                                    CardShown = true;
                                }
                            }
                        }
                    }
                }
                RRN++;
            }
        }
        async function BuildInvestmentCash() {

            if(MTFlex.Button2 == 2) return;
            if(getCookie('MT_InvestmentCardNoCash',true) == 1) return;
            for (const acc of accQueue) {
                sumPortfolio += acc.portfolioBalance;
                cashValue = acc.portfolioBalance - acc.holdingBalance;
                if(cashValue > 0) {
                    sumCash+=cashValue;
                    let useID = '$$';
                    if(MTFlex.Button2 == 1) {
                        if(MTFlex.Button1 == 2 || MTFlex.Button1 == 3 || MTFlex.Button1 == 5) {
                            useID += '-' + acc.id;
                        }
                        if(MF_GridUpdateUID(useID,8,cashValue,false,true)) {
                            MF_GridUpdateUID(useID,9,cashValue,false,true);
                            continue;
                        }
                    }
                    MTP = [];
                    MTP.UID = useID;
                    if(MTFlex.Button1 == 0) {MTP.Section = 2;MTP.BasedOn = 1;}
                    MTP.PK = getInvestmentPK(acc.institutionName,acc.accountName,acc.accountSubtype,'Cash');
                    MF_QueueAddRow(MTP);
                    if(splitTicker == 1) { MTFlexRow[MTFlexCR][0] = '';} else {MTFlexRow[MTFlexCR][0] = ' CASH & MONEY MARKET';}
                    MTFlexRow[MTFlexCR][1] = ' CASH & MONEY MARKET';
                    MTFlexRow[MTFlexCR][2] = acc.institutionName;
                    MTFlexRow[MTFlexCR][3] = acc.accountName;
                    MTFlexRow[MTFlexCR][4] = acc.accountSubtype;
                    MTFlexRow[MTFlexCR][5] = 'Cash';
                    MTFlexRow[MTFlexCR][6] = null;
                    MTFlexRow[MTFlexCR][7] = null;
                    MTFlexRow[MTFlexCR][8] = cashValue;
                    MTFlexRow[MTFlexCR][9] = cashValue;
                    MTFlexRow[MTFlexCR][10] = null;
                    MTFlexRow[MTFlexCR][11] = null;
                }
            }
        }

        async function BuildInvestmentCards() {
            let allTitle = 'Brokerage';
            switch (MTFlex.Button2) {
                case 0:
                case 1:
                    if(MTFlex.Button4 > 0) allTitle = MTFlex.Button4Options[MTFlex.Button4];
                    MF_QueueAddCard({Col: 0, Title: getDollarValue(sumPortfolio,true), Subtitle: 'Total ' + allTitle, Style: css.green});
                    if(maxCards > 0) {
                        if(MTFlex.Button1 == 0) {
                            MF_QueueAddCard({Col: 1, Title: getDollarValue(sumCash,true), Subtitle: 'Cash & Money Market', Style: css.green});
                            MF_QueueAddCard({Col: 1, Title: getDollarValue(sumPortfolio-sumCash,true), Subtitle: 'Total Invested', Style: css.green});
                        } else {
                            MTFlex.AutoCard = {Title: '', Section: -1, Column: 8, Chop: -3};
                        }
                    }
                    break;
                case 2:
                    if(maxCards > 0) {MF_QueueAddCard({Col: 1, Title: Cards[0] + '%', Subtitle: 'Top Gainer: ' + BuildInvestmentCardDesc(Cards[1]), Style: css.green});}
                    if(maxCards > 1) {MF_QueueAddCard({Col: 2, Title: Cards[2] + '%', Subtitle: 'Top Loser: ' + BuildInvestmentCardDesc(Cards[3]), Style: css.red});}
                    if(maxCards > 2) {MF_QueueAddCard({Col: 3, Title: UpDown[1] + ' / ' + UpDown[0], Subtitle: 'Net Gainer / Losers', Style: UpDown[1] > UpDown[0] ? css.green : css.red});}
                    break;
            }
        }

        function BuildInvestmentCardDesc(inCard) {
            let outCard = inCard;
            if(getCookie('MT_InvestmentCardShort',true) == 1) { outCard = inCard.split('•')[0]; } else { outCard = inCard.replace('•','\n');}
            return outCard;
        }

        function getInvestmentPK(inIns,inAcc,inSub,inType) {
            switch(MTFlex.Button1) {
                case 0:
                    return 'Positions';
                case 1:
                    return inIns.trim();
                case 2:
                case 5:
                    return inAcc.trim();
                case 3:
                    return inSub;
                case 4:
                    return inType;
            }
        }
    }
}

async function MenuReportsTrendsGo() {

    TrendQueue = [];
    await MF_GridInit('MTTrends', 'Trends');
    let TrendFullPeriod = getCookie('MT_TrendFullPeriod',true);
    let lowerDate = new Date(MTFlexDate1), higherDate = new Date(MTFlexDate2);
    lowerDate.setDate(1);lowerDate.setMonth(0);
    let month = lowerDate.getMonth(), day = lowerDate.getDate(), year = lowerDate.getFullYear();
    let month2 = higherDate.getMonth(), day2 = higherDate.getDate(), year2 = higherDate.getFullYear();

    MTFlex.DateEvent = 1;
    MTFlex.TriggerEvents = true;
    MF_GridOptions(1,['by Group','by Category','by Both']);
    MF_GridOptions(2,['Compare last month','Compare same month','Compare same quarter','This year by month','Last year by month','Last 12 months by month', 'Two years ago by month', 'Three years ago by month', 'All years by year','All years by YTD']);
    MF_GridOptions(4,getAccountGroupInfo());
    MTFlex.SortSeq = ['1','1','1','2','2','2','2','2','3','3'];
    if(MTFlex.Button1 == 2) {MTFlex.Subtotals = true;}
    MTFlex.Title1 = 'Trends Report';

    MTP = [];
    MTP.IsSortable = 1; MTP.Format = 0;
    MF_QueueAddTitle(0,['Group','Category','Group/Category'][MTFlex.Button1],MTP);

    if(MTFlex.Button2 > 2) {
        MTP.IsSortable = 2;MTP.Format = 2;
        MF_QueueAddTitle(13,'Total',MTP);
        MF_QueueAddTitle(14,'Avg',MTP);
        let newCol = 1;
        if(MTFlex.Button2 == 3) {
            if(getCookie('MT_TrendIgnoreCurrent',true) == 1) { MTFlex.Title3 = '* Average ignores Current Month'; }
            for (let i = 0; i < 12; i++) {
                if(i > month2) {MTP.IsHidden = true;}
                MF_QueueAddTitle(newCol,getMonthName(i,true),MTP);
                newCol++;
            }
        } else if (MTFlex.Button2 == 4 || MTFlex.Button2 == 6 || MTFlex.Button2 == 7) {
            year-=1;
            if(MTFlex.Button2 == 6) {year-=1;}
            if(MTFlex.Button2 == 7) {year-=2;}
            lowerDate.setFullYear(year);
            higherDate.setFullYear(year,11,31);
            for (let i = 0; i < 12; i++) {
                MF_QueueAddTitle(newCol,getMonthName(i,true),MTP);
                newCol++;
            }
        } else if (MTFlex.Button2 > 7) {
            lowerDate.setFullYear(year - 12);
            for (let i = year - 11; i <= year; i++) {
                MF_QueueAddTitle(newCol,i.toString(),MTP);
                newCol++;
            }
        } else if (MTFlex.Button2 == 5) {
            if(getCookie('MT_TrendIgnoreCurrent',true) == 1) { MTFlex.Title3 = '* Average ignores Current Month'; }
            for (let i = month2 + 1; i < 12; i++) {
                MF_QueueAddTitle(newCol,getMonthName(i,true),MTP);
                newCol++;
            }
            for (let i = 0; i <= month2; i++) {
                MF_QueueAddTitle(newCol,getMonthName(i,true),MTP);
                newCol++;
            }
            if(month2 < 11) {
                month2++;
                lowerDate.setMonth(month2);
                year2-=1;
                lowerDate.setFullYear(year2);
            }
        }

        MTFlex.Title2 = getDates('s_FullDate',lowerDate) + ' - ' + getDates('s_FullDate',higherDate);
        if(MTFlex.Button2 == 8) {
            await BuildTrendData('oy',MTFlex.Button1,'year',lowerDate,higherDate,'',MTFlexAccountFilter.filter);
        } else if (MTFlex.Button2 == 9) {
            for (let i = year - 11; i <= year; i++) {
                lowerDate.setFullYear(i,0,1);
                higherDate.setFullYear(i,month2,day2);
                await BuildTrendData('oy',MTFlex.Button1,'year',lowerDate,higherDate,'',MTFlexAccountFilter.filter);
            }
        } else {
            await BuildTrendData('ot',MTFlex.Button1,'month',lowerDate,higherDate,'',MTFlexAccountFilter.filter);
        }
        MTFlex.Title3 = MTFlex.Button2Options[MTFlex.Button2];
        await WriteByMonthData();
    } else {
        let useFormat = 1;
        if(getCookie('MT_NoDecimals',true) == 1) {useFormat = 2;}
        MTFlex.Title2 = getDates('s_FullDate',lowerDate) + ' - ' + getDates('s_FullDate',higherDate);
        if(TrendFullPeriod == 1) {
            MTFlex.Title3 = '* Comparing to End of Month';
        } else {
            MTFlex.Title3 = '* Comparing to Current Day of Month';
        }

        // this year
        MTP = [];
        MTP.IsSortable = 2; MTP.Width = '12%'; MTP.Format = useFormat; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = {Type: 'Column'};}
        MF_QueueAddTitle(5,'YTD ' + year,MTP);
        await BuildTrendData('cp',MTFlex.Button1,'year',lowerDate,higherDate,'',MTFlexAccountFilter.filter);

        // last year
        year-=1;
        lowerDate.setFullYear(year);
        higherDate.setFullYear(year);
        MTP = [];
        MTP.IsSortable = 2; MTP.Format = useFormat; MTP.Width = '12%'; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = {Type: 'Column'};}
        MF_QueueAddTitle(4,'YTD ' + year,MTP);
        MTP.Format = useFormat; MTP.Width = '12%';MTP.ShowPercentShade = true;
        if(getCookie('MT_TrendHidePer2',true) != true) {MTP.ShowPercent = {Type: 'Row',Col1: [4], Col2: [5]};}
        MF_QueueAddTitle(6,'Difference',MTP);
        await BuildTrendData('lp',MTFlex.Button1,'year',lowerDate,higherDate,'',MTFlexAccountFilter.filter);

        // This Period
        let useTitle = '';
        year++;
        month = month2;
        lowerDate.setFullYear(year,month,1);
        higherDate.setFullYear(year2,month2,day2);

        if(MTFlex.Button2 == 2) {
            const QtrDate = getDates('i_ThisQTRs',MTFlexDate1);
            month = parseInt(QtrDate.substring(0,2)) - 1;
            lowerDate.setMonth(month);
            if(month != month2) {useTitle = getMonthName(month,true) + ' - ';}
        }
        if(MTFlex.Button2 == 1) {
            if(TrendFullPeriod == 1) {
                day2 = daysInMonth(month2,year2);
                higherDate.setDate(day2);
            }
        }

        useTitle = useTitle + getMonthName(month2,true) + ' ' + year;
        MTP = [];
        MTP.IsSortable = 2; MTP.Width = '12%'; MTP.Format = useFormat; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = {Type: 'Column'};}
        MF_QueueAddTitle(2,useTitle,MTP);
        await BuildTrendData('cm',MTFlex.Button1,'year',lowerDate,higherDate,'',MTFlexAccountFilter.filter);

        // Last Period
        let forceEOM = false;
        if(daysInMonth(month,year) == day2) { forceEOM = true; }

        useTitle = '';
        if(MTFlex.Button2 == 0) {
            month-=1;
            if(month < 0) { month = 11; year = year - 1;}
            month2 = month;year2 = year;
            lowerDate.setFullYear(year,month,1);
            higherDate.setFullYear(year2,month2,1);

            let x = daysInMonth(month,year);
            if(day2 > x) { day2 = x; }
            if(forceEOM == true) {day2 = x;}
            higherDate.setDate(day2);
            MTFlex.TitleShort = 'Last Month';
            useTitle = getMonthName(month2,true) + ' ' + year;
        }
        if(MTFlex.Button2 == 1) {
            year-=1;
            lowerDate.setFullYear(year,month,1);
            higherDate.setFullYear(year,month,1);
            higherDate.setDate(day2);
            MTFlex.TitleShort = 'Last ' + getMonthName(month);
            useTitle = getMonthName(month,true) + ' ' + year;
        }
        if(MTFlex.Button2 == 2) {
            year-=1;
            lowerDate.setFullYear(year);
            higherDate.setFullYear(year);
            if(month == month2) {
                useTitle = getMonthName(month2,true) + ' ' + year;
            } else {
                useTitle = getMonthName(month,true) + ' - ' + getMonthName(month2,true) + ' ' + year;
            }
            MTFlex.TitleShort = useTitle;
        }
        if(TrendFullPeriod == 1) {
            day2 = daysInMonth(month2,year);
            higherDate.setDate(day2);
        }
        useTitle = useTitle + ' *';
        MTP = [];
        MTP.IsSortable = 2; MTP.Format = useFormat; MTP.Width = '12%'; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = {Type: 'Column'};}
        MF_QueueAddTitle(1,useTitle,MTP);
        MTP = [];
        MTP.IsSortable = 2; MTP.Format = useFormat; MTP.Width = '12%'; MTP.ShowPercentShade = true;
        if(getCookie('MT_TrendHidePer2',true) != true) {MTP.ShowPercent = {Type: 'Row', Col1: [1], Col2: [2]};}
        MF_QueueAddTitle(3,'Difference',MTP);
        await BuildTrendData('lm',MTFlex.Button1,'year',lowerDate,higherDate,'',MTFlexAccountFilter.filter);
        // future month
        lowerDate = getDates('d_LastYear',MTFlexDate2);
        higherDate = getDates('d_EndofNextMonthLY',MTFlexDate2);
        MTP = [];
        MTP.IsSortable = 2;MTP.Format = useFormat; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHideNextMonth',true) == true) {MTP.IsHidden = true;}
        MF_QueueAddTitle(7,getDates('s_MidDate',lowerDate),MTP);
        MF_QueueAddTitle(8,getDates('s_MidDate',higherDate),MTP);
        await BuildTrendData('fu',MTFlex.Button1,'month',lowerDate,higherDate,'',MTFlexAccountFilter.filter);
        await WriteCompareData();
    }
    glo.spawnProcess = 1;
}

async function WriteByMonthData() {

    let useDesc = '',lowestMonth = 13,useURL = '';
    for (let i = 0; i < MTFlexRow.length; i++) {
        let retGroup = await rtnCategoryGroup(MTFlexRow[i].UID);
        if(retGroup.TYPE == 'transfer') {
            MTFlexRow[i].UID = '';
        } else {
            if(retGroup.TYPE == 'expense') {
                if(retGroup.ISFIXED == true) {
                    MTFlexRow[i].BasedOn = 3;MTFlexRow[i].Section = 4;
                } else {
                    MTFlexRow[i].BasedOn = 5;MTFlexRow[i].Section = 6;
                }
                for (let j = 1; j < MTFlexTitle.length; j++) {
                    if(MTFlexRow[i][j] != 0) {
                        if(j < lowestMonth) {lowestMonth = j;}
                        MTFlexRow[i][j] = MTFlexRow[i][j] * -1;
                    }
                }
                 useURL = '#|spending|';
            } else {
                MTFlexRow[i].BasedOn = 1;MTFlexRow[i].Section = 2;
                useURL = '#|income|';
            }
            if(MTFlex.Button1 > 0) {
                if(MTFlex.Button1 == 2) {
                    MTFlexRow[i].PK = retGroup.GROUPNAME;
                    MTFlexRow[i].PKHRef = useURL + '|' + retGroup.GROUP + '|';
                    MTFlexRow[i].PKTriggerEvent = 'category-groups|' + retGroup.GROUP;
                }
                MTFlexRow[i].SKHRef = useURL + retGroup.ID + '|';
                MTFlexRow[i].SKTriggerEvent = 'categories|' + retGroup.ID;
                useDesc = retGroup.NAME;
            } else {
                useDesc = retGroup.GROUPNAME;
                MTFlexRow[i].SKHRef = useURL + '|' + retGroup.GROUP + '|';
                MTFlexRow[i].PKTriggerEvent = '';
                MTFlexRow[i].SKTriggerEvent = 'category-groups|' + retGroup.GROUP;
            }
        }
        MTFlexRow[i].Icon = retGroup.ICON;
        MTFlexRow[i][0] = useDesc;
    }
    MTFlexRow = MTFlexRow.filter(item => item.UID !== '');
    if(MTFlex.Button2 > 7) {
        for(let i = 1; i <= 12; i++){ if(i < lowestMonth) {MTFlexTitle[i].IsHidden = true;}}
        MTFlex.Title2 = MTFlex.Title2.substring(0, 7) + MTFlexTitle[lowestMonth].Title + MTFlex.Title2.substring(11);
    }
    MF_GridRollup(1,2,1,'Income');
    MF_GridRollup(3,4,3,'Fixed Spending');
    MF_GridRollup(5,6,5,'Flexible Spending');
    MF_GridRollDifference(7,3,5,1,'Spending','Add');
    MF_GridRollDifference(8,1,7,1,'Savings','Sub');
    MF_GridCalcRowRange(13,1,12,'Add');

    lowestMonth = 12;
    if(getCookie('MT_TrendIgnoreCurrent',true) == 1) {if(MTFlex.Button2 == 3 || MTFlex.Button2 == 5) {lowestMonth = 11;}}
    if(MTFlex.Button2 == 8) {lowestMonth = 11;}
    MF_GridCalcRowRange(14,1,lowestMonth,'Avg');

    MF_GridCardAdd(1,13,13,'HV','Total Income','',css.green);
    MF_GridCardAdd(7,13,13,'HV','Total Expenses','',css.red);
    MF_GridCardAdd(2,1,12,'HV','Highest Income','',css.green,'',' was with ', ' in ');
    if(glo.accountsHasFixed == true) {
        MF_GridCardAdd(4,1,12,'HV','Highest Fixed Expense','',css.red,'',' was with ', ' in ');
        MF_GridCardAdd(6,1,12,'HV','Highest Non-Fixed Expense','',css.red,'',' was with ', ' in ');
    } else {
        MF_GridCardAdd(6,1,12,'HV','Highest Expense','',css.red,'',' was with ', ' in ');
        MF_GridCardAdd(8,13,13,'HV','Total Savings','Total Overspent',css.green,css.red);
    }
}

async function WriteCompareData() {

    let useDesc = '',Numcards=0, useURL = '', useFormat = false;
    if(getCookie('MT_NoDecimals',true) == 1) {useFormat = true;}

    for (let i = 0; i < TrendQueue.length; i++) {
        MTP = [];
        let retGroup = await rtnCategoryGroup(TrendQueue[i].ID);
        if(retGroup.TYPE == 'expense' || retGroup.TYPE == 'income') {
             if(retGroup.TYPE == 'expense') {
                 TrendQueue[i].N_CURRENT = TrendQueue[i].N_CURRENT * -1;
                 TrendQueue[i].N_LAST = TrendQueue[i].N_LAST * -1;
                 TrendQueue[i].N_CURRENTM = TrendQueue[i].N_CURRENTM * -1;
                 TrendQueue[i].N_LASTM = TrendQueue[i].N_LASTM * -1;
                 TrendQueue[i].N_FUTURE = TrendQueue[i].N_FUTURE * -1;
                 TrendQueue[i].N_FUTURE2 = TrendQueue[i].N_FUTURE2 * -1;
                 if(retGroup.ISFIXED == true) {
                     MTP.BasedOn = 1;MTP.Section = 4;
                 } else {
                     MTP.BasedOn = 5;MTP.Section = 6;
                 }
                 useURL = '#|spending|';
             }
             if(retGroup.TYPE == 'income') {
                 MTP.BasedOn = 1;MTP.Section = 2;
                 MTP.IgnoreShade = true;
                 useURL = '#|income|';
             }
             MTP.IsHeader = false;
             if(MTFlex.Button1 > 0) {
                 if(MTFlex.Button1 == 2) {
                     MTP.PK = retGroup.GROUPNAME;
                     MTP.PKHRef = useURL + '|' + retGroup.GROUP + '|';
                     MTP.PKTriggerEvent = 'category-groups|' + retGroup.GROUP + '|';
                 }
                 MTP.SKHRef = useURL + retGroup.ID + '|';
                 MTP.SKTriggerEvent = 'categories|' + retGroup.ID + '|';
                 useDesc = retGroup.NAME;
             } else {
                 useDesc = retGroup.GROUPNAME;
                 MTP.SKHRef = useURL + '|' + retGroup.GROUP + '|';
                 MTP.PKTriggerEvent = '';
                 MTP.SKTriggerEvent = 'category-groups|' + retGroup.GROUP + '|';
             }
            MTP.Icon = retGroup.ICON;
            MF_QueueAddRow(MTP);
            MTFlexRow[MTFlexCR][0] = useDesc;
            MTFlexRow[MTFlexCR][1] = TrendQueue[i].N_LASTM;
            MTFlexRow[MTFlexCR][2] = TrendQueue[i].N_CURRENTM;
            MTFlexRow[MTFlexCR][3] = TrendQueue[i].N_CURRENTM - TrendQueue[i].N_LASTM;
            MTFlexRow[MTFlexCR][4] = TrendQueue[i].N_LAST;
            MTFlexRow[MTFlexCR][5] = TrendQueue[i].N_CURRENT;
            MTFlexRow[MTFlexCR][6] = TrendQueue[i].N_CURRENT - TrendQueue[i].N_LAST;
            MTFlexRow[MTFlexCR][7] = TrendQueue[i].N_FUTURE;
            MTFlexRow[MTFlexCR][8] = TrendQueue[i].N_FUTURE2;
         }
    }
    MF_GridRollup(1,2,1,'Income');
    MF_GridRollup(3,4,1,'Fixed Spending');
    MF_GridRollup(5,6,1,'Flexible Spending');
    MF_GridRollDifference(7,3,5,1,'Spending','Add');
    MF_GridRollDifference(8,1,7,1,'Savings','Sub');

    if(getCookie('MT_TrendCard1',true) == true) {
        let a_Income = MF_GridGetValue(1,5);
        if(a_Income > 0) {
            let a_Fixed = MF_GridGetValue(3,5);
            let a_Flexible = MF_GridGetValue(5,5);
            let a_Savings = a_Income - a_Fixed - a_Flexible;
            a_Fixed = (a_Fixed / a_Income) * 100;a_Fixed = Math.round(a_Fixed);
            a_Flexible = (a_Flexible / a_Income) * 100;a_Flexible = Math.round(a_Flexible);
            a_Savings = (a_Savings / a_Income) * 100;a_Savings = Math.round(a_Savings);
            Numcards++;
            MTP = [];MTP.Col = Numcards;
            MTP.Title = a_Fixed + '% / ' + a_Flexible + '% / ' + a_Savings + '%';
            MTP.Subtitle = 'Fixed/Flexible/Savings';
            MF_QueueAddCard(MTP);
        }
    }

    Numcards += MF_GridCardAdd(1,6,6,'HV','More Total Income YTD','Less Total Income YTD',css.green,css.red);
    if(glo.accountsHasFixed == true) {
        Numcards += MF_GridCardAdd(3,6,6,'HV','More Fixed Expenses YTD','Less Fixed Expenses YTD',css.red,css.green);
        Numcards += MF_GridCardAdd(5,6,6,'HV','More Flexible Expenses YTD','Less Flexible Expenses YTD',css.red,css.green);
    } else {
        Numcards += MF_GridCardAdd(5,6,6,'HV','More Expenses YTD','Less Expenses YTD',css.red,css.green);
    }
    Numcards += MF_GridCardAdd(8,5,5,'HV','Total Savings','Total Overspent',css.green,css.red);
}

async function BuildTrendData (inCol,inGrouping,inPeriod,lowerDate,higherDate,inID,inAccounts) {

    const firstDate = formatQueryDate(lowerDate);
    const lastDate = formatQueryDate(higherDate);
    const thisMonth = getDates('n_CurMonth') + 1;

    let useID = '', sendCol = '', useType = '',snapshotData = null,retGroups = [], retCats = [], s_ndx = 0;
    if(MTFlex.Button2 > 7) {s_ndx = getDates('n_CurYear', MTFlexDate2) - 12;} else {s_ndx = getDates('n_CurMonth',lowerDate) + 1;}

    if(inID) { useType = rtnCategoryGroup(inID).TYPE; retCats = rtnCategoryGroupList(inID,'',true); }
    inGrouping = Number(inGrouping);

    if(inGrouping == 0) {snapshotData = await getMonthlySnapshotData(firstDate,lastDate,inPeriod,inAccounts,retCats);} else {
        snapshotData = await getMonthlySnapshotData2(firstDate,lastDate,inPeriod,inAccounts,retCats);}
    let useDate = null,yy = null,mm=null,ndx=null,useAmount=null;
    for (const ss of snapshotData.aggregates) {
        switch(inGrouping) {
            case 0: useID = ss.groupBy.categoryGroup.id;break;
            case 1: useID = ss.groupBy.category.id;break;
            case 2: useID = ss.groupBy.category.id;break;
            case 3: useID = ss.groupBy.category.id;
                retGroups = rtnCategoryGroup(useID);
                useID = retGroups.GROUP;useType = retGroups.TYPE;break;
        }
        if(inID == '' || inID == useID) {
            useAmount = Number(ss.summary.sum);
            if(inID) {
                useDate = ss.groupBy.month;
                yy = useDate.substring(0,4);
                mm = useDate.substring(5,7);
                if(useType == 'expense') { useAmount = useAmount * -1;}
                TrendQueue2.push({"YEAR": yy, "MONTH": mm,"AMOUNT": useAmount, "DESC": retGroups.NAME, "ID": retGroups.ID});
            } else if (inCol == 'oy') {
                useDate = ss.groupBy.year;
                ndx = Number(useDate.substring(0,4));
                ndx = ndx - s_ndx;
                MF_GridUpdateUID(useID,ndx,useAmount,true);}
            else if (inCol == 'ot') {
                useDate = ss.groupBy.month;
                ndx = Number(useDate.substring(5,7));
                if(MTFlex.Button2 == 5 && s_ndx != 1) {
                    if(ndx >= s_ndx) {
                        ndx = ndx - s_ndx;
                        ndx++;
                    } else {
                        ndx = (12 - s_ndx + 1) + ndx;
                    }
                }
                MF_GridUpdateUID(useID,ndx,useAmount,true);
            } else {
                sendCol = inCol;
                if(inCol == 'fu') {
                    useDate = ss.groupBy.month;
                    mm = Number(useDate.substring(5,7));
                    if(mm != thisMonth) {sendCol = 'f2';}
                }
                Trend_UpdateQueue(useID,useAmount,sendCol);
            }
        }
    }
    if(inCol == 'hs') {glo.spawnProcess = 2;}
}

function Trend_UpdateQueue(useID,useAmount,inCol) {

    for (let i = 0; i < TrendQueue.length; i++) {
        if(TrendQueue[i].ID == useID) {
            switch(inCol) {
                case 'cp':TrendQueue[i].N_CURRENT = useAmount;break;
                case 'lp':TrendQueue[i].N_LAST = useAmount;break;
                case 'cm':TrendQueue[i].N_CURRENTM = useAmount;break;
                case 'lm':TrendQueue[i].N_LASTM = useAmount;break;
                case 'fu':TrendQueue[i].N_FUTURE = useAmount;break;
                case 'f2':TrendQueue[i].N_FUTURE2 = useAmount;break;
            }
            return;
        }
    }
    switch(inCol) {
        case 'cp':TrendQueue.push({"ID": useID,"N_CURRENT": useAmount,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": 0, "N_FUTURE": 0,"N_FUTURE2": 0});break;
        case 'lp':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": useAmount, "N_CURRENTM": 0, "N_LASTM": 0, "N_FUTURE": 0,"N_FUTURE2": 0});break;
        case 'cm':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": useAmount, "N_LASTM": 0, "N_FUTURE": 0,"N_FUTURE2": 0});break;
        case 'lm':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": useAmount, "N_FUTURE": 0,"N_FUTURE2": 0});break;
        case 'fu':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": 0, "N_FUTURE": useAmount, "N_FUTURE2": 0});break;
        case 'f2':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": 0, "N_FUTURE": 0, "N_FUTURE2": useAmount});break;
    }
}

async function MenuHistoryDrawer(inType,inID) {

    let lowerDate = new Date("2023-01-01"),higherDate = new Date();
    let retGroups = rtnCategoryGroup(inID),inGroup = 1,useURL = '',useURLText = '', useGroupId = '';
    let ExpandItems = null;
    let useTitle = 'Monthly Summary';
    if(MTFlexAccountFilter.name) {useTitle = useTitle + ' - ' + MTFlexAccountFilter.name;}
    if(inType == 'category-groups') {ExpandItems = ['',''];}
    if(retGroups.TYPE == 'expense') {useURL = '#|spending|';} else {useURL = '#|income|';}
    if(inType == 'category-groups') {
        useURLText = retGroups.ICON + ' ' + retGroups.GROUPNAME;
        useURL = useURL + '|' + retGroups.GROUP;
        useGroupId = retGroups.GROUP;
        inGroup = 3;
    } else {
        useURLText = retGroups.ICON + ' ' + retGroups.GROUPNAME + ' / ' + retGroups.NAME;
        useURL = useURL + retGroups.ID + '|';
        useGroupId = retGroups.ID;
    }

    MF_SidePanelOpen(inType, retGroups.TYPE, ExpandItems, useTitle, retGroups.TYPE, useURLText, useURL, useGroupId, 'Show/Hide Categories');

    TrendQueue2 = []; TrendPending = [0,0];
    let ld = getDates('d_StartofLastMonth'),hd = getDates('d_Today');
    ld = formatQueryDate(ld);hd = formatQueryDate(hd);
    const snapshotData4 = await getTransactions(ld,hd,0,true,MTFlexAccountFilter.filter,null,null,null,rtnCategoryGroupList(useGroupId,'',true));
    TrendPending = rtnPendingBalance(snapshotData4);
    BuildTrendData('hs',inGroup,'month',lowerDate,higherDate,inID,MTFlexAccountFilter.filter);
}

function MenuTrendsHistoryDraw() {

    let sumQue = [], detailQue = [];
    const hideDetail = 'display: ' + getDisplay(getCookie(MTFlex.Name + '_SidePanel',true),'');
    const titleStyle = 'font-weight: 600;';
    const titleLStyle = 'text-align: left;';
    const startYear = getDates('n_CurYear') - 2;
    const curYear = getDates('n_CurYear');
    const curMonth = getDates('n_CurMonth');
    let grouptype = '',groupsubtype = '',groupid = '',inGroup = 1,c_r = 'red', c_g = 'green';
    let curYears = 1,skiprow = false,useArrow = 0;
    let T = ['Total',0,0,0,0];
    let curSubTotal = 0;
    let div=null,div2 = null,div3=null;
    let FontFamily = getCookie('MT_MonoMT',false);
    if(FontFamily && FontFamily != 'System') {FontFamily = 'font-family: ' + FontFamily + ';';}
    let topDiv = document.querySelector('div.MTSideDrawerMotion');
    if(topDiv) {
        grouptype = topDiv.getAttribute("grouptype");
        groupsubtype = topDiv.getAttribute("groupsubtype");
        groupid = topDiv.getAttribute("groupid");
        if(grouptype == 'category-groups') { inGroup = 2;}
        if(groupsubtype == 'income') { c_g = 'red'; c_r = 'green'; }

        div = cec('div','MTSideDrawerHeader',topDiv,'','',FontFamily);
        for (let i = 0; i < 12; i++) {
            sumQue.push({"MONTH": i,"YR1": MTHistoryDraw(i+1,startYear),"YR2": MTHistoryDraw(i+1,startYear + 1),"YR3": MTHistoryDraw(i+1,startYear + 2)});
        }

        if(startYear < getCookie('MT_LowCalendarYear',false)) {skiprow = true;}

        div2 = cec('div','MTSideDrawerItem',div);
        div3 = cec('span','MTSideDrawerDetail',div2,'Month','',titleLStyle + titleStyle);
        for (let j = startYear; j <= curYear; j++) {
            if(skiprow == false || j > startYear) { div3 = cec('span','MTSideDrawerDetail',div2,j,'',titleStyle);}
        }
        div3 = cec('span','MTSideDrawerDetail3',div2);
        div3 = cec('span','MTSideDrawerDetail',div2,'Average','',titleStyle);

        div2 = cec('div','MTSideDrawerItem',div);
        div3 = cec('span','MTFlexSpacer',div2);

        for (let i = 0; i < 12; i++) {
            if(i > 0 && i == curMonth) {
                MTHistoryTotals('Sub Total','font-weight: 600; margin-bottom: 14px');
                curSubTotal = T[3];
            }
            if(sumQue[i].YR2 == sumQue[i].YR3){
                useArrow = 2;}
            else {
                if(i >= curMonth) {
                    if(sumQue[i].YR2 > 0 && sumQue[i].YR3 > sumQue[i].YR2) {useArrow = 0;} else {useArrow = 2;}
                } else {
                    if(sumQue[i].YR3 > sumQue[i].YR2) {useArrow = 0;} else {useArrow = 1;}
                }
            }
            div2 = cec('div','MTSideDrawerItem',div);
            if(sumQue[i].YR1 != 0) {curYears = 3;}
            if(curYears < 3) {
                if(sumQue[i].YR2 != 0) {curYears = 2;}
            }
            div3 = cec('span','MTSideDrawerDetail',div2,getMonthName(i,true),'',titleStyle + titleLStyle);
            if(skiprow == false) {div3 = cec('span','MTSideDrawerDetailS',div2,getDollarValue(sumQue[i].YR1),'','','data','range|' + startYear + '|' + String(i+1).padStart(2, '0'));}
            div3 = cec('span','MTSideDrawerDetailS',div2,getDollarValue(sumQue[i].YR2),'','','data','range|' + (startYear + 1) + '|' + String(i+1).padStart(2, '0'));
            div3 = cec('span','MTSideDrawerDetailS',div2,getDollarValue(sumQue[i].YR3),'','','data','range|' + (startYear + 2) + '|' + String(i+1).padStart(2, '0'));
            div3 = cec('span','MTSideDrawerDetail3',div2,['','',' '][useArrow],'','color: ' + [c_r,c_g,''][useArrow]);

            if(i < curMonth) {
                div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue((sumQue[i].YR1 + sumQue[i].YR2 + sumQue[i].YR3) / curYears));
            } else {
                div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue((sumQue[i].YR1 + sumQue[i].YR2)/(curYears-1)));
            }
            T[1] = T[1] + sumQue[i].YR1;T[2] = T[2] + sumQue[i].YR2;T[3] = T[3] + sumQue[i].YR3;
            if(inGroup == 2) { MTHistoryDrawDetail(i+1,div); }
        }
        MTHistoryTotals('Total','font-weight: 600; margin-bottom: 14px;');
        MTHistoryTotals('Pending','');
        MTHistoryTotals('Average','line-height: 20px;margin-top:10px;');
        MTHistoryTotals('Highest','line-height: 20px;');
        MTHistoryTotals('Lowest','line-height: 20px;');
        div = cec('div','MTSideDrawerHeader',topDiv);
        div2 = cec('div','MTPanelLink',div,'Download CSV','','padding: 0px; display:block; text-align:center;');
    }
    function MTHistoryTotals(inTitle,inStyle) {
        let maxCol = 4;
        switch (inTitle) {
            case 'Lowest':
                T[1]=0;T[2]=0;T[3];
                 for (let i = 0; i < 12; i++) {
                     if(sumQue[i].YR1 < T[1] || i == 0) T[1] = sumQue[i].YR1;
                     if(sumQue[i].YR2 < T[2] || i == 0) T[2] = sumQue[i].YR2;
                     if((sumQue[i].YR3 < T[3] || i == 0) && i < curMonth) T[3] = sumQue[i].YR3;
                 }
                maxCol = 3; break;
            case 'Highest':
                T[1]=0;T[2]=0;T[3];
                 for (let i = 0; i < 12; i++) {
                     if(sumQue[i].YR1 > T[1] || i == 0) T[1] = sumQue[i].YR1;
                     if(sumQue[i].YR2 > T[2] || i == 0) T[2] = sumQue[i].YR2;
                     if((sumQue[i].YR3 > T[3] || i == 0) && i < curMonth) T[3] = sumQue[i].YR3;
                 }
                maxCol = 3; break;
            case 'Average':
                T[1] = T[1] / 12;
                T[2] = T[2] / 12;
                T[3] = curSubTotal / curMonth;
                maxCol = 3; break;
            case 'Pending':
                if(TrendPending[1] != 0) {
                    div2 = cec('div','MTSideDrawerItem',div,'','',inStyle);
                    cec('span','MTSideDrawerDetail',div2,inTitle,'',titleStyle + titleLStyle );
                    if(skiprow == false) {cec('span','MTSideDrawerDetail',div2);}
                    cec('span','MTSideDrawerDetail',div2);
                    cec('span','MTSideDrawerDetailS',div2,getDollarValue(TrendPending[0]),'','','data','pending');
                    cec('span','MTSideDrawerDetail3',div2);
                    cec('span','MTSideDrawerDetail',div2);
                }
                return;
        }
        const tot = T[1]+T[2]+T[3];
        if(tot != 0) { T[4] = tot / curYears; }

        if(inTitle.includes('Total')) {
            div2 = cec('div','MTSideDrawerItem',div) ;
            div3 = cec('span','MTFlexSpacer',div2);
        }
        div2 = cec('div','MTSideDrawerItem',div,'','',inStyle);
        div3 = cec('span','MTSideDrawerDetail',div2,inTitle,'',titleStyle + titleLStyle );
        for (let i = 1; i < 5; i++) {
            if(skiprow == false || i > 1) {
                if(i > maxCol) { div3 = cec('span','MTSideDrawerDetail',div2); } else {
                    div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue(T[i]));}
                if(i == 3) { div3 = cec('span','MTSideDrawerDetail3',div2); }
            }
        }
    }

    function MTHistoryDraw(inMonth,inYear) {

        let ms = '0' + inMonth.toString();ms = ms.slice(-2);
        let ys = inYear.toString();
        let amt = 0.00;
        for (let i = 0; i < TrendQueue2.length; i++) {
            if(TrendQueue2[i].MONTH == ms && TrendQueue2[i].YEAR == ys) {amt = amt + TrendQueue2[i].AMOUNT;}
        }
        return amt;
    }

    function MTHistoryDrawDetail(inMonth,inDiv) {

        let ms = '0' + inMonth.toString();ms = ms.slice(-2);
        detailQue = [];

        for (let i = 0; i < TrendQueue2.length; i++) {
            if(TrendQueue2[i].MONTH == ms ) {
                let result = MTHistoryFind(TrendQueue2[i].DESC);
                detailQue[result].ID = TrendQueue2[i].ID;
                if(TrendQueue2[i].YEAR == startYear) { detailQue[result].YR1 = TrendQueue2[i].AMOUNT;}
                if(TrendQueue2[i].YEAR == startYear+1) { detailQue[result].YR2 = TrendQueue2[i].AMOUNT;}
                if(TrendQueue2[i].YEAR == startYear+2) { detailQue[result].YR3 = TrendQueue2[i].AMOUNT;}
            }
        }

        detailQue.sort((a, b) => b.YR3 - a.YR3 || b.YR2 - a.YR2);
        let useURL = '#|';
        useURL += groupsubtype == 'expense' ? 'spending|' : 'income|';

        for (let i = 0; i < detailQue.length; i++) {
            let div2 = cec('div','MTSideDrawerItem2',inDiv,'','',hideDetail);
            let div3 = cec('a','MTSideDrawerDetail4',div2,' ' + detailQue[i].DESC,useURL + detailQue[i].ID+'|',titleLStyle);
            if(skiprow == false) {div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue(detailQue[i].YR1));}
            div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue(detailQue[i].YR2));
            div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue(detailQue[i].YR3));
            div3 = cec('span','MTSideDrawerDetail3',div2);
            if(i < curMonth) {
                div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue((detailQue[i].YR1 + detailQue[i].YR2 + detailQue[i].YR3) / curYears));
            } else {
                div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue((detailQue[i].YR1 + detailQue[i].YR2)/(curYears-1)));
            }
        }
        cec('div','MTSideDrawerItem2 MTSideDrawerItem',inDiv,'','',hideDetail);
    }

    function MTHistoryFind(inDesc) {
        for (let i = 0; i < detailQue.length; i++) { if(detailQue[i].DESC == inDesc) {return(i);} }
        detailQue.push({"DESC": inDesc,"YR1": 0,"YR2": 0,"YR3": 0, "ID": ''});
        return detailQue.length-1;
    }
}

function MenuTrendsHistoryExport() {

    const c = ',';
    let csvContent = '',j = 0,Cols = 0;
    const spans = document.querySelectorAll('span.MTSideDrawerDetail,span.MTSideDrawerDetailS,span.MTSideDrawerSummaryTag' + [',span.MTSideDrawerDetail2,a.MTSideDrawerDetail4',''][getCookie(MTFlex.Name + '_SidePanel',true)]);
    spans.forEach(span => {
        j=j+1;
        if(Cols == 0) { if(span.innerText.startsWith('Average')) { Cols = j;}}
        csvContent = csvContent + getCleanValue(span.innerText,2);
        if(j == Cols) { j=0;csvContent = csvContent + CRLF;} else {csvContent = csvContent + c;}
    });
    downloadFile('Monarch Trends History ' + getDates('s_FullDate'),csvContent);
}

// [ Budgets ]
async function MenuPlanRefresh() {

    if(getCookie('MT_PlanLTB',true) == 0) return;

    let budgetI = [0,0,0,0],budgetE = [0,0,0,0]; // 0=remaining,1=budget,2=spent,3=use
    let div=null;
    const elements = document.querySelectorAll('[class*="PlanSummaryWidgetRow"]');
    for (const li of elements) {
        const ca = li.innerText.split('\n');
        if(ca.length > 0) {
            if(ca[0] == 'Income') {
                budgetI[1] = getCleanValue(ca[1]);budgetI[2]=getCleanValue(ca[2]);
                if(ca[3].length > 1) {budgetI[0] = getCleanValue(ca[3]);} else {budgetI[0] = getCleanValue(ca[4]);}
            }
            if(ca[0] == 'Expenses') {
                budgetE[1] = getCleanValue(ca[1]);budgetE[2]=getCleanValue(ca[2]);
                if(ca[3].length > 1) {budgetE[0] = getCleanValue(ca[3]);} else {budgetE[0] = getCleanValue(ca[4]);}
                div = li;
            }
        }
    }
    if(div == null) {glo.spawnProcess = 3;return;}

    let li = document.querySelector('div.MTBudget');
    if(li) return;
    div = cec('div','MTBudget',div);

    let bCK = 0,bCC = 0,bSV=0,LeftToSpend=0,BudgetRemain = 0,BRLit = 'Budget Remaining',LTSLit = 'Left to Spend';
    let noBudget=true;
    let snapshotData = await getAccountsData();
    let snapshotData4 = await getTransactions(formatQueryDate(getDates('d_StartofLastMonth')),formatQueryDate(getDates('d_Today')),0,true,null,false);

    for (let i = 0; i < snapshotData.accounts.length; i++) {
        if(snapshotData.accounts[i].hideTransactionsFromReports == false) {
            if(snapshotData.accounts[i].isAsset == true && snapshotData.accounts[i].subtype.name == 'checking') {
                bCK+=Number(snapshotData.accounts[i].displayBalance);
            } else if (snapshotData.accounts[i].isAsset == true && snapshotData.accounts[i].subtype.name == 'savings') {
                bSV+=Number(snapshotData.accounts[i].displayBalance);
            } else if (snapshotData.accounts[i].isAsset == false && snapshotData.accounts[i].subtype.name == 'credit_card') {
                bCC+=Number(snapshotData.accounts[i].displayBalance);
            }
        }
    }
    const [pendingAmt,pendingTx] = rtnPendingBalance(snapshotData4);
    LeftToSpend = (bCK-bCC-pendingAmt);
    if(getCookie('MT_PlanLTBIR',true) == 0) {budgetI[3] = budgetI[0];budgetE[3]=budgetE[0];} else {
        budgetI[3] = budgetI[1]-budgetI[2];budgetE[3]=budgetE[1]-budgetE[2];}

    if(getCookie('MT_PlanLTBII',true) == 0) {noBudget = false; if(budgetI[3] > 0) { BudgetRemain = budgetI[3];LeftToSpend = LeftToSpend + budgetI[3];}}
    if(getCookie('MT_PlanLTBIE',true) == 0) {noBudget = false; if(budgetE[3] >= 0) { BudgetRemain = BudgetRemain - budgetE[3];LeftToSpend = LeftToSpend - budgetE[3];} else {LTSLit=LTSLit + ' (Over Budget!)';}}
    let LeftToSpendStyle = css.green;if(LeftToSpend < 0) {LeftToSpendStyle = css.red;}

    writePlan('Total in Checking',getDollarValue(bCK,true),'','');
    writePlan('Total in Credit Cards',getDollarValue(bCC,true),'','');
    writePlan('Total Pending (' + pendingTx + ')',getDollarValue(pendingAmt,true),'/transactions?isPending=true','');
    writePlan('Total Available',getDollarValue(bCK-bCC-pendingAmt,true),'','font-weight: 500;');
    if(noBudget == false) {
        writePlan(BRLit,getDollarValue(BudgetRemain,true),'','font-weight: 500;','', true);
        writePlan(LTSLit,getDollarValue(LeftToSpend,true),'','font-weight: 500;',LeftToSpendStyle, true);
    }
    if(bSV > 0) {writePlan('Total in Savings',getDollarValue(bSV,true),'','','', true);}

    function writePlan(inDesc,inValue,inHref,inStyle,inStyle2,isSpace) {
        let div2 = cec('div','',div,'','',isSpace == true ? 'margin-top: 10px;' : '');
        cec(inHref != '' ? 'a' : 'span','MTBudget1',div2,inDesc,inHref,inStyle);
        cec('span','MTBudget2 fs-exclude',div2,inValue,'',inStyle + inStyle2);
    }
}
// [ Budget Plan Reorder ]
function MenuPlanBudgetReorder() {
    const budgetGrid = document.querySelector('[class*="Plan__SectionsContainer"]');
    const separator = document.querySelector('[class*="PlanSectionFooter__Separator"]');
    if(budgetGrid && separator && !budgetGrid.dataset.mtInit === true) {
        const defaultOrder = [0, 1, 2];
        let order = getCookie("MT_BudgetOrder");
        if(!order) {setCookie("MT_BudgetOrder", JSON.stringify(defaultOrder));order = defaultOrder;} else {order = JSON.parse(order);}
        budgetGrid.style.cssText += "display:flex;flex-direction:column;";
        const budgetSections = budgetGrid.children;
        if(budgetSections.length > 1) {
            Array.from(budgetSections).forEach((el, idx) => { el.id = `budget-section-${idx}`;el.style.cssText += `order:${order.at(idx) ?? 0}`;});
            budgetGrid.dataset.mtInit = true;
        }
        const budgetTotal = separator.nextElementSibling;
        separator.style.cssText += "order:100;";budgetTotal.style.cssText += "order:101;";
        budgetGrid.appendChild(separator);budgetGrid.appendChild(budgetTotal);
    }
}

// [ Edit Account ]
function MTUpdateAccountPartner() {
    const li = document.querySelector('[class*="EditAccountForm__FormContainer"]');
    if(li) {
        let li2 = li.childNodes[4];
        let div = document.createElement('div');
        div = li.insertBefore(div, li2);

        cec('div','MTInputTitle',div,'Subtype free-form override - (MM Tweaks)');
        let div3 = cec('input','MTInputClass',div,'','','width: 100%;','id','accountSubGroupID');
        let p = glo.pathName.split('/');
        if(p.length > 2) {div3.value = getCookie('MTAccountsSub:' + p[3],false);}

        div3 = cec('div','MTInputClass',div);
        cec('div','MTInputTitle',div3,'Accounts Dashboard - (MM Tweaks)');
        div3 = cec('label','',div3,'Add to Accounts List on Dashboard','','','htmlFor','DashboardCheckbox');
        div3 = cec('input','MTDashboardCheckbox',div3,'','','float:left;','id','DashboardCheckbox');
        div3.type = 'checkbox';
        div3.setAttribute('act',p[3]);
        if(getCookie('MTAccountDashboard:' + p[3],true) == true) {div3.checked = 'true';}
        cec('div','MTInputTitle',div,'Account Group - (MM Tweaks)');
        div3 = cec('input','MTInputClass',div,'','','width: 100%;','id','accountGroupID');
        p = glo.pathName.split('/');
        if(p.length > 2) {div3.value = getCookie('MTAccounts:' + p[3],false);}
   }
}
// [ Calendar ]
function MM_FixCalendarYears() {
    const elements = document.querySelectorAll('select[name]');
    if(elements) {
        for (const li of elements) {
            if(li.getAttribute('hacked') != 'true') {
                if(li.name == 'year') { MM_FixCalendarDropdown(li);li.setAttribute('hacked','true');}
            }
        }
    }
}

function MM_FixCalendarDropdown(calItems) {
    let ii = parseInt(getCookie("MT_LowCalendarYear",false));
    if(ii < 2000) {ii = 2000;}
    ii -= 2000;
    for (let i = 0; i < ii; i++) { calItems.removeChild(calItems.firstChild); }
}

// [ Splits ]
function MM_SplitTransaction() {

    let li = document.querySelector('[class*="TransactionSplitOriginalTransactionContainer__OriginalAmountColumn"]');
    if(li) {
        let AmtA = getCleanValue(li.innerText.trim(),2);
        li = document.querySelector('[class*="TransactionSplitModal__TabsContainer-sc"]');
        let div = cec('button','MTSplitButton',li,'Split 50%','','margin-left: 0px;');
        let AmtB = AmtA / 2;
        AmtB = parseFloat(AmtB).toFixed(2);
        AmtA = AmtA - AmtB;
        AmtA = parseFloat(AmtA).toFixed(2);
        div.addEventListener('click', () => { inputTwoFields('input.CurrencyInput__Input-ay6xtd-0',AmtA,AmtB); });
    }
}
// [ Fix Note Popup ]
function MM_NoteTag() {

    const divs = document.querySelectorAll('[class*="TransactionDrawerFieldRow__StyledFlexContainer-"]');
    if(divs.length == 0) { glo.spawnProcess = 9; return; }
    for (const div of divs) {
        if(div.innerText.trim() == 'Notes') {
            cec('button','MTNoteTagButton',div.parentNode,'Note Tags ');
            const div2 = div.parentNode.parentNode.children[1];
            const newDiv = document.createElement('div');
            newDiv.id = 'MTNoteTagButton';
            newDiv.className = 'MTFlexdown-content2 MTdropdown';
            div2.parentNode.insertBefore(newDiv, div2);
            break;
        }
    }
}

// [ Fix Merchant Popper ]
function MM_SearchMerchants(inDiv) {

    let merEntry = inDiv.childNodes[0].childNodes[0];
    if(merEntry) {
        let merText = inDiv.childNodes[0].childNodes[1].childNodes[1].innerText.trim();
        merText = merText.trim();
        if(merText) {
            const ii = merText.indexOf('*');
            if(ii < 16) {merText = getStringPart(merText,'*','right');}
            merText = merText.trim();
            let merObjs = ['aplpay', 'gglpay','the ', 'paypal','www.'];
            for (let i = 0; i < merObjs.length; i++) {
                if(merText.toLowerCase().startsWith(merObjs[i].toLowerCase())) {
                    let j = merObjs[i].length;
                    merText = merText.slice(j);
                    merText = merText.trim();
                }
            }
            merObjs = ['.','-','+',',','='];
            for (let i = 0; i < merObjs.length; i++) {
                if(merText[0] == merObjs[i]) {merText = merText.slice(1);}
                merText = getStringPart(merText,merObjs[i],'left');
            }
            merText = getStringPart(merText,' ','left');
            merText = merText.substring(0, 9).toLowerCase();
            merText = merText[0].toUpperCase() + merText.slice(1);
            merEntry.focus({ focusVisible: true });
            merEntry.value = '';
            document.execCommand('insertText', false, merText );
        }
    }
}

// Menu Page Functions
function MenuHistory(OnFocus) {
    if (glo.pathName.startsWith('/categor')) {
        if(OnFocus == true) {
            if(getCookie('MT_Budget',true) == 1) { MM_hideElement('[class*="CategoryDetails__PlanSummaryCard"]',1);}
        }
        let div = findButton('Filters');
        if(div) {
            cec('button','MTHistoryButton',div.parentNode?.parentNode,' Monthly Summary');
            buildCategoryGroups();
        }
    }
}

function MenuCategories(OnFocus) {
    if(glo.pathName.startsWith('/categories')) {
       if(OnFocus == false) {removeAllSections('.MTHistoryButton');}
    }
}

function MenuPlan(OnFocus) {
    if (glo.pathName.startsWith('/plan') || glo.pathName.startsWith('/dashboard')) {
        if(OnFocus == true) {
            const urlParams = new URLSearchParams(window.location.search);
            const name = urlParams.get('debug');
            if (name) {setCookie('MT_Log', name == 'on' ? 1 : 0);glo.debug = getCookie('MT_Log',true);}
            glo.spawnProcess = 3;
            if(glo.pathName.startsWith('/dashboard')) MenuDashboardAccounts();
        }
    }
}

async function MenuDashboardAccounts() {

    let ds = document.getElementById('MTFlexDashboardAccounts');
    if(ds) return;
    let snapshotData = await getAccountsData();
    let snapshotData4 = await getTransactions(formatQueryDate(getDates('d_StartofLastMonth')),formatQueryDate(getDates('d_Today')),0,true,null,false);
    ds = document.querySelector('[class*="Droppable__Unstyled-sc"]');
    if(ds) {
        let newDiv = null;
        for (let i = 0; i < snapshotData.accounts.length; i++) {
            const aa = snapshotData.accounts[i].id;
            if(getCookie('MTAccountDashboard:' + aa,true) != 1) continue;
            if(!newDiv) MenuDashboardAccountsHeader();
            let amt = 0;
            for (let j = 0; j < snapshotData4.allTransactions.results.length; j++) {
                if(snapshotData4.allTransactions.results[j].account.id == aa) {
                    amt = amt + snapshotData4.allTransactions.results[j].amount;
                }
            }
            amt = amt * -1;
            let bal = snapshotData.accounts[i].displayBalance;
            let pBal = bal + amt;
            let newRow = cec('tr','MTSideDrawerSummaryRow',newDiv);
            cec('td','MTSideDrawerSummaryData',newRow,snapshotData.accounts[i].displayName);
            cec('td','MTSideDrawerSummaryData2',newRow,getDollarValue(bal,false));
            cec('td','MTSideDrawerSummaryData2',newRow,getDollarValue(amt,false));
            cec('td','MTSideDrawerSummaryData2',newRow,getDollarValue(pBal,false));
        }
        if(newDiv) sortTableByColumn(newDiv);

        function MenuDashboardAccountsHeader() {
            newDiv = document.createElement('div');
            newDiv.className = 'MTFlexContainerPanel';
            newDiv.id = 'MTFlexDashboardAccounts';
            let topDiv = ds.insertBefore(newDiv, ds.firstChild);
            topDiv = cec('div','',topDiv,'','','padding: 20px;');

            let rowDiv = cec('div','',topDiv);
            cec('span','MTFlexBig',rowDiv,'Accounts');
            rowDiv = cec('div','',topDiv);
            cec('span','MTSpacerClass',rowDiv,'','','display:block; margin: 5px 0px 5px 0px;');

            newDiv = cec('table','MTSideDrawerSummaryTable',topDiv,'','','font-size: 14px;','TableName','DashboardAccounts');
            let newRow = cec('tr','MTSideDrawerSummaryTableTH',newDiv);
            let td = cec('td','MTSortTableByColumn MTSideDrawerSummaryData',newRow,'Account','','','datatype','alpha');
            td.setAttribute('columnindex','0');
            td = cec('td','MTSortTableByColumn MTSideDrawerSummaryData2',newRow,'Balance','','','datatype','amount');
            td.setAttribute('columnindex','1');
            td = cec('td','MTSortTableByColumn MTSideDrawerSummaryData2',newRow,'Pending','','','datatype','amount');
            td.setAttribute('columnindex','2');
            td = cec('td','MTSortTableByColumn MTSideDrawerSummaryData2',newRow,'Projected','','','datatype','amount');
            td.setAttribute('columnindex','3');
        }
    }
}

function MenuTransactions(OnFocus) {
    if (glo.pathName.startsWith('/transactions')) {
        if(OnFocus == true) {
            if(glo.pathName.split('/')[2] != undefined) { glo.spawnProcess = 9; }
        }
    }
}

function MenuLogin(OnFocus) {
    if (glo.pathName.startsWith('/login')) {if(OnFocus == false) { MM_MenuFix(); } }
}

function MenuAccounts(OnFocus) {
    if(OnFocus == true) {
        if (glo.pathName.startsWith('/accounts/details') && glo.pathName.endsWith('/edit') ) { MTUpdateAccountPartner(); }
        if (glo.pathName == '/accounts' ) { glo.spawnProcess = 4; }
    }
}

function MenuSettings(OnFocus) {

    if(glo.pathName.startsWith('/settings/categories')) {
        if(OnFocus == false) {accountGroups=[];}
        if(OnFocus == true) {MenuSetttingsCategory();}
    }
    if(glo.pathName.startsWith('/settings/display')) {
        if(OnFocus == true) {MenuSettingsDisplay();}
    }
}

function MenuSetttingsCategory() {
    let divs = document.querySelectorAll('[class*="ManageCategoryGroupCard__Header-"]');
    if(divs.length == 0) {glo.pathName = '';return;}
    let div = null,grp=null,isExp=null;
    for (let i = 0; i < divs.length; i++) {
        grp = divs[i].getAttribute('data-rbd-drag-handle-draggable-id');
        isExp = divs[i].parentNode.parentNode.parentNode;
        if(isExp && isExp.innerText.startsWith('Expenses')) {
            div = cec ('div','',divs[i],'','','flex:1;');
            div = cec('label','',div,'Fixed Expense (MM Tweaks)','','font-size: 13px;float:right;','htmlFor','MTFixed');
            div = cec('input','MTFixedCheckbox',div,'','','margin-top: 2px;','id','MTFixed');
            div.setAttribute('grp',grp);
            div.type = 'checkbox';
            if(getCookie('MTGroupFixed:' + grp,true) == true) {div.checked = 'true';}
        }
    }
}

function MenuSettingsDisplay(inDiv) {

    let qs = inDiv;
    if(!qs) {
        qs = document.querySelector('[class*="SettingsCard__StyledCard-sc-189f681"]');
        if (!qs) {glo.spawnProcess = 11;return;}
        qs=cec('div','',qs,'','','margin-left: 25px; margin-right: 25px;');
    } else {
        qs = cec('span','MTSideDrawerHeader',qs);
    }
    let OnOff = (inDiv == null);
    let dropDowns = 0;

    if(getCookie('MT_LowCalendarYear',false) == '') {MenuFirstTimeUser();}
    if(getCookie('MT_InvestmentURLStock',false) == '') setCookie('MT_InvestmentURLStock','https://stockanalysis.com/stocks/{ticker}');
    if(getCookie('MT_InvestmentURLETF',false) == '') setCookie('MT_InvestmentURLETF','https://stockanalysis.com/etf/{ticker}');
    if(getCookie('MT_InvestmentURLMuni',false) == '') setCookie('MT_InvestmentURLMuni','https://stockanalysis.com/quote/mutf/{ticker}');
    const p = MenuDisplay_Input('Monarch Money Tweaks - ' + version,'','text','font-size: 18px; font-weight: 500;');
    MenuDisplay_Input('• To change Fixed Spending & Flexible Spending settings, choose Settings / Categories.','','text','font-size: 16px;');
    MenuDisplay_Input('• To add Account Groups, choose Accounts and Edit / Edit account.','','text','font-size: 16px;');
    MenuDisplay_Input(p,'Save Settings', 'button');
    MenuDisplay_Input(p,'Restore Settings', 'button');
    MenuDisplay_Input('Lowest Calendar/Data year','','spacer');
    MenuDisplay_Input('','MT_LowCalendarYear','number',null,2000,getDates('n_CurYear'));
    MenuDisplay_Input('Menu','','spacer');
    MenuDisplay_Input('Hide Budget','MT_Budget','checkbox');
    MenuDisplay_Input('Hide Recurring','MT_Recurring','checkbox');
    MenuDisplay_Input('Hide Goals','MT_Goals','checkbox');
    MenuDisplay_Input('Hide Investments','MT_Investments','checkbox');
    MenuDisplay_Input('Hide Advice','MT_Advice','checkbox');
    MenuDisplay_Input('Accounts','','spacer');
    MenuDisplay_Input('"Refresh All" accounts the first time logging in for the day','MT_RefreshAll','checkbox');
    MenuDisplay_Input('Hide Accounts Net Worth Graph panel','MT_HideAccountsGraph','checkbox');
    MenuDisplay_Input('Hide Shared View / Joint Ownership','MT_Ownership','checkbox');
    MenuDisplay_Input('Transactions','','spacer');
    MenuDisplay_Input('Transactions panel has smaller font & compressed grid','MT_CompressedTx','checkbox');
    MenuDisplay_Input('Highlight Pending Transactions (Preferences / "Allow Pending Edits" must be off)','MT_PendingIsRed','checkbox');
    MenuDisplay_Input('Hide Create Rule pop-up','MT_HideToaster','checkbox');
    MenuDisplay_Input('Assist & populate when Searching Merchants','MT_MerAssist','checkbox');
    MenuDisplay_Input('Reports','','spacer');
    MenuDisplay_Input('Hide the Difference Amount in Income & Spending chart tooltips','MT_HideTipDiff','checkbox');
    MenuDisplay_Input('Hide Tweak Report Descriptions and Tips','MTHideReportTips','checkbox');
    MenuDisplay_Input('Report Grid font','MT_MonoMT','dropdown','',['System','Monospace','Courier','Courier New','Arial','Trebuchet MS','Verdana']);
    MenuDisplay_Input('Override Report Grid Header background-color','MT_ColorHigh','color','');
    MenuDisplay_Input('Override Report Grid SubTotal background-color','MT_ColorLow','color','');
    MenuDisplay_Input('Reports / Trends Report','','spacer');
    MenuDisplay_Input('Always compare to End of Month','MT_TrendFullPeriod','checkbox');
    MenuDisplay_Input('By Month "Avg" ignores Current Month','MT_TrendIgnoreCurrent','checkbox');
    MenuDisplay_Input('Hide percentages not in Difference columns','MT_TrendHidePer1','checkbox');
    MenuDisplay_Input('Hide percentages in Difference columns','MT_TrendHidePer2','checkbox');
    MenuDisplay_Input('Hide future month columns (Remaining "this month" & "next month")','MT_TrendHideNextMonth','checkbox');
    MenuDisplay_Input('Show Fixed/Flexible/Savings percentage card','MT_TrendCard1','checkbox');
    MenuDisplay_Input('Always hide decimals','MT_NoDecimals','checkbox');
    MenuDisplay_Input('Reports / Net Income Report','','spacer');
    MenuDisplay_Input('Sort column results by Tag/Account Ranking rather than Value','MT_NetIncomeRankOrder','checkbox');
    MenuDisplay_Input('Show Note Tags drop-down button on Transaction screen (Used if Tagging notes with "*")','MT_NetIncomeNoteTags','checkbox');
    MenuDisplay_Input('Always hide decimals','MT_NetIncomeNoDecimals','checkbox');
    MenuDisplay_Input('Reports / Accounts Report','','spacer');
    MenuDisplay_Input('Hide accounts marked as "Hide this account in list"','MT_AccountsHidden','checkbox');
    MenuDisplay_Input('Hide accounts marked as "Hide balance from net worth"','MT_AccountsHidden2','checkbox');
    MenuDisplay_Input('Hide Last Updated column','MT_AccountsHideUpdated','checkbox');
    MenuDisplay_Input('Hide Net Change column','MT_AccountsHidePer1','checkbox');
    MenuDisplay_Input('Hide percentage in Net Change column','MT_AccountsHidePer2','checkbox');
    MenuDisplay_Input('Hide Pending & Projected Balance columns on Standard Report','MT_AccountsHidePending','checkbox');
    MenuDisplay_Input('Hide Positions Balance column on Brokerage Statement','MT_AccountsHideBSPos','checkbox');
    MenuDisplay_Input('Hide Cash Balance column on Brokerage Statement','MT_AccountsHideBSCash','checkbox');
    MenuDisplay_Input('Month/Year reports based on "End of month" instead of "Beginning of month"','MT_AccountsEOM','checkbox');
    MenuDisplay_Input('Show total Checking card','MT_AccountsCard0','checkbox');
    MenuDisplay_Input('Show total Savings card','MT_AccountsCard1','checkbox');
    MenuDisplay_Input('Show total Credit Card Liability card','MT_AccountsCard2','checkbox');
    MenuDisplay_Input('Show total Investments card','MT_AccountsCard3','checkbox');
    MenuDisplay_Input('Show total 401k card','MT_AccountsCard4','checkbox');
    MenuDisplay_Input('Add Transfers to Net Change amount in Brokerage Statement','MT_AccountsNetTransfers','checkbox');
    MenuDisplay_Input('Always hide decimals','MT_AccountsNoDecimals','checkbox');
    MenuDisplay_Input('Reports / Investments Report','','spacer');
    MenuDisplay_Input('Hide Institution column (If all holdings are from same institution)','MT_InvestmentsHideInst','checkbox');
    MenuDisplay_Input('Split Ticker and Description into two columns','MT_InvestmentsSplitTicker','checkbox');
    MenuDisplay_Input('Show Ticker symbol without description in cards','MT_InvestmentCardShort','checkbox');
    MenuDisplay_Input('Skip creating CASH/MONEY MARKET entries','MT_InvestmentCardNoCash','checkbox');
    MenuDisplay_Input('Skip recalculating institution & holding values with Current Price','MT_InvestmentSkipCurrent','checkbox');
    MenuDisplay_Input('Maximum cards to show','MT_InvestmentCards','number',null,0,20);
    MenuDisplay_Input('Stock Lookup URL - Use {ticker}','MT_InvestmentURLStock','string','width: 380px;');
    MenuDisplay_Input('ETF Lookup URL - Use {ticker}','MT_InvestmentURLETF','string','width: 380px;');
    MenuDisplay_Input('Mutual Fund Lookup URL - Use {ticker}','MT_InvestmentURLMuni','string','width: 380px;');
    MenuDisplay_Input('Budget','','spacer');
    MenuDisplay_Input('Budget panel has smaller font & compressed grid','MT_PlanCompressed','checkbox');
    MenuDisplay_Input('Show "Left to Spend" from Checking after paying off Credit Cards in Budget Summary','MT_PlanLTB','checkbox');
    MenuDisplay_Input('Ignore Budget Income remaining in "Left to Spend"','MT_PlanLTBII','checkbox','margin-left: 22px;');
    MenuDisplay_Input('Ignore Budget Expenses remaining in "Left to Spend"','MT_PlanLTBIE','checkbox','margin-left: 22px;');
    MenuDisplay_Input('Ignore Rollover budgets, always use actual Budget minus actual Spent for “Left to Spend”','MT_PlanLTBIR','checkbox','margin-left: 22px;');
    MenuDisplay_Input('Reorder Budget Categories','MT_BudgetOrder','dropdown','',['Income, Expenses, Contributions|[0,1,2]','Expenses, Income, Contributions|[1,0,2]','Expenses, Contributions, Income|[2,0,1]']);

    function MenuDisplay_Input(inValue,inCookie,inType,inStyle,optValue,optValue2) {
        if(inDiv && inType == 'spacer') {
            if(inValue.includes(MTFlex.Title1)) {OnOff = true; return;}
            OnOff = false;
        }
        if(OnOff == false) return;

        let e1 = null,e2=null,e3=null;

        switch(inType) {
            case 'button':
                return cec('button','MTSettingsButton',inValue,inCookie,'','float:right;');
            case 'spacer':
                e1 = cec('div','MTSpacerClass',qs);
                return cec('div','MTItemClass',qs,inValue,'','font-size: 17px; font-weight: 500;');
            case 'text':
                return cec('div','MTItemClass',qs,inValue,'',inStyle);
            case 'dropdown':
                e1 = cec('div','MTItemClass',qs,'','','display:flex;column-gap: 10px;');
                dropDowns++;
                break;
            default:
                e1 = cec('div','MTItemClass',qs);
        }

        let OldValue = getCookie(inCookie,false),mtObj = [],fnd=false;

        switch(inType) {
            case 'checkbox':
                e2 = cec('input','MTCheckboxClass',e1,'','',inStyle,'type',inType);
                e2.id = inCookie;
                if(OldValue == 1) {e2.checked = 'checked';}
                e2.addEventListener('change', () => { flipCookie(inCookie,1); MM_MenuFix();});
                e3 = document.createElement("label");
                e3.innerText = inValue;
                e3.htmlFor = inCookie;
                e2.parentNode.insertBefore(e3, e2.nextSibling);
                break;
            case 'color':
                e2 = cec('input','MTCheckboxClass',e1,'','',inStyle,'type',inType);
                e2.value = OldValue;
                e2.id = inCookie;
                e2.addEventListener('input', () => { if(event.target.value == '#000000') {setCookie(inCookie,'');} else {setCookie(inCookie,event.target.value);} MM_Init();});
                e3 = document.createElement("label");
                e3.innerText = inValue;
                e3.htmlFor = inCookie;
                e2.parentNode.insertBefore(e3, e2.nextSibling);
                break;
            case 'number':
                cec('div','',e1,inValue,'','font-size: 14px; font-weight: 500;');
                e2 = cec('input','MTInputClass',e1,'','','','type',inType);
                e2.min = optValue;
                e2.max = optValue2;
                e2.value = OldValue;
                e2.addEventListener('change', () => { setCookie(inCookie,e2.value);});
                break;
            case 'string':
                cec('div','',e1,inValue,'','font-size: 14px; font-weight: 500;');
                e2 = cec('input','MTInputClass',e1,'','',inStyle,'value',OldValue);
                e2.addEventListener('change', () => { setCookie(inCookie,e2.value);});
                break;
            case 'dropdown':
                for (let i = 0; i < optValue.length; i++) {
                    mtObj = optValue[i].split('|');if(mtObj[1] == null) mtObj[1] = mtObj[0];
                    if(OldValue == mtObj[1]) {OldValue = mtObj[0];fnd=true;break;}
                }
                if(fnd==false) {
                    mtObj = optValue[0].split('|');if(mtObj[1] == null) mtObj[1] = mtObj[0];
                    setCookie(inCookie,mtObj[1]);OldValue = mtObj[0];
                }
                cec('div','',e1,inValue + ':','','margin-top: 10px;');
                e2 = cec('div','MTdropdown',e1,'','','width: 270px;');
                e2 = cec('button','MTSettButton' + dropDowns,e2,OldValue + ' ','','width: 270px; margin-left: 0px !important;');
                e3 = cec('div','MTFlexdown-content',e2,'','','','id','MTDropdown'+dropDowns);
                for (let i = 0; i < optValue.length; i++) {
                    mtObj = optValue[i].split('|');if(mtObj[1] == null) mtObj[1] = mtObj[0];
                    e2 = cec('a','MTSetupDropdown',e3,mtObj[0],'','','MTSetupOption',inCookie);
                    e2.setAttribute('MTSetupValue',mtObj[1]);
                }
        }
        return e1;
    }
}

function MenuFirstTimeUser() {
    const a = confirm('Welcome to Monarch Money Tweaks!\n\nWould you like to set up the default configuration now to get started?');
    if(a) {
        setCookie('MT_RefreshAll',1);setCookie('MT_MerAssist',1);setCookie('MT_MonoMT','Arial');
        setCookie('MT_TrendHidePer1',1);setCookie('MT_TrendCard1',1);setCookie('MT_NoDecimals','1');
        setCookie('MT_AccountsHidden',1);setCookie('MT_AccountsHidden2',1);setCookie('MT_AccountsHideUpdated','1');
        setCookie('MT_AccountsCard0',1);setCookie('MT_AccountsCard2','1');
        setCookie('MT_AccountsNoDecimals',1);setCookie('MT_AccountsNetTransfers',1);setCookie('MT_AccountsCard2','1');
        setCookie('MT_InvestmentCardShort',1);setCookie('MT_InvestmentCards',10);setCookie('MT_AccountsCard2','1');
        setCookie('MT_PlanCompressed',1);setCookie('MT_PlanLTB',1);
        setCookie('MT_CompressedTx',1);setCookie('MT_PendingIsRed',1);
        setCookie('MT_LowCalendarYear','2020');
    }
}

// Function calls which need waits and retries ...
function MenuCheckSpawnProcess() {

    if(glo.spawnProcess > 0) {
        const sp = glo.spawnProcess;glo.spawnProcess = 0;
        switch(sp) {
            case 5:
                MM_Init();
                MenuReportsFix();
                break;
            case 1:
                MF_GridDraw(0); break;
            case 2:
                MenuTrendsHistoryDraw(); break;
            case 3:
                MenuPlanRefresh();
                MenuPlanBudgetReorder();
                break;
            case 4:
                MenuAccountsSummary();break;
            case 6:
                if(getCookie('MT_MerAssist',true)) {onClickContainer();}
                break;
            case 7:
                MM_SplitTransaction();
                break;
            case 8:
                break;
            case 9:
                if(getCookie('MT_NetIncomeNoteTags',true) == 1) {MM_NoteTag();}
                break;
            case 11:
                MenuSettings();
                break;
        }
    }
}
// Generic on-click event handler ...
window.onclick = function(event) {

    let cn = event.target.className;
    if(typeof cn === 'object') {MM_MenuFix();return;}
    if(typeof cn === 'string') {
        if(glo.debug == 1) console.log('MM-Tweaks',cn,event.target);
        cn = getStringPart(cn,' ','left');
        switch (cn) {
            case '':
                glo.spawnProcess=6;return;
            case 'AbstractButton__Root-sc-1ebfgjo-0':
                MM_MenuFix();
                break;
            case 'Menu__MenuItem-nvthxu-1':
            case 'Flex-sc-165659u-0':
                if(event.target.innerText.trim() == 'Last') {onClickLastNumber();}
                if(startsInList(event.target.innerText.trim(),['\uf183','\uf13e','Light','Dark', 'System preference'])) {glo.spawnProcess = 5;return;}
                break;
            case 'Text-qcxgyd-0':
                if(event.target.innerText.trim() == 'Split') { glo.spawnProcess = 7;}
                break;
            case 'MTGeneralLink':
                cn = event.target.getAttribute('link').split('|');
                onClickGeneralLink(cn);return;
            case 'MTWindowButton':
                cn = event.target.getAttribute('id');
                MF_ModelWindowExecute(cn);return;
            case 'MTSortTableByColumn':
                sortTableByColumn(event.target);
                return;
            case 'DateInput_input':
                MM_FixCalendarYears();return;
            case 'Tab__Root-ilk1fo-0':
            case 'Flex-sc-165659u-0':
                if(event.target.innerText.trim() == 'Summary') { glo.spawnProcess = 3;}return;
            case 'PlanHeader__Tab-sc-19mk9dy-1':
                if(event.target.innerText.trim() == 'Budget') { glo.spawnProcess = 3;} return;
            case 'MTSideDrawerRoot':
            case 'MTTrendCellArrow':
            case 'MTInputButton':
                if(onClickCloseDrawer() == true) {MenuReportsGo(MTFlex.Name);}
                return;
            case 'MTSideDrawerDetailS':
            case 'MTSideDrawerSummaryTag':
                onClickExpandSidePanelDetail(event.target);
                break;
            case 'MTTrendCellArrow2':
                cn = event.target.getAttribute('options').split(',');
                cn = cn[MM_flipSideElement(MTFlex.Name + '_SidePanel')];
                event.target.innerText = cn;
                if(MTFlex.Name =='MTInvestments') MenuTickerDrawer(null);
                return;
            case 'MTPanelLink':
                MenuTrendsHistoryExport();return;
            case 'MTSettingsButton':
                onClickMTSettings();return;
            case 'MTFlexBig':
                onClickMTFlexBig();return;
            case 'MThRefClass2':
                onClickMTFlexExpand(0);return;
            case 'MTFlexExpand':
                onClickMTFlexExpand(1);return;
            case 'MTFlexSave':
                onClickMTFlexExpand(2);return;
            case 'MTFlexConfig':
                onClickMTFlexConfig();return;
            case 'MTFlexRestore':
                onClickMTFlexExpand(3);return;
            case 'MTNoteTagButton':
                onClickNoteTagButton();return;
            case 'MTNoteTagDropdown':
                onClickNoteTagDropdown();return;
            case 'MTFlexButton1':
            case 'MTFlexButton2':
            case 'MTFlexButton4':
            case 'MTSettButton1':
            case 'MTSettButton2':
            case 'MTSettButton3':
            case 'MTSettButton4':
                onClickMTDropdown(cn.slice(12));return;
            case 'MTFlexCellGo':
                onClickMTDropdownRelease();
                cn = event.target.getAttribute("triggers");
                if(cn == null) cn = event.target.childNodes[0].getAttribute("triggers");
                onClickMTFlexArrow(cn);
                return;
            case 'MTButton1':
            case 'MTButton2':
            case 'MTButton4':
                setCookie(MTFlex.Name + cn.slice(2),event.target.getAttribute('mtoption'));
                MenuReportsGo(MTFlex.Name);return;
            case 'MTFlexGridTitleCell':
            case 'MTFlexGridTitleCell2':
                onClickGridSort();return;
            case 'MTFlexCheckbox':
                MTFlex.Button3 = (event.target.checked === true || event.target.checked === 'true') ? 1 : 0;
                setCookie(MTFlex.Name + 'Button3',MTFlex.Button3);
                if(MTFlex.Button3 == 1) {MM_hideElement('div.MTFlexSpacer',1);} else {MM_hideElement('div.MTFlexSpacer',0);}
                return;
            case 'MTFixedCheckbox':
                cn = event.target.getAttribute('grp');
                if(cn != '') flipCookie('MTGroupFixed:' + cn,1);
                return;
            case 'MTDashboardCheckbox':
                cn = event.target.getAttribute('act');
                if(cn != '') flipCookie('MTAccountDashboard:' + cn,1);
                return;
            case 'MTFlexButtonExport':
                MT_GridExport(); break;
            case 'MTSetupDropdown':
                onClickSetupDropdown(event.target); break;
            case 'MTBub1':
                switch (startsInList(event.target.textContent,['SUM','AVG','CNT'])) {
                    case 1: navigator.clipboard.writeText(MTFlexSum[1]);return;
                    case 2: navigator.clipboard.writeText(getCleanValue('$' + MTFlexSum[1]/MTFlexSum[0],2));return;
                    case 3: navigator.clipboard.writeText(MTFlexSum[0]);return;
                }
                break;
            case 'MTHistoryButton':
                MTFlexAccountFilter.name = ''; MTFlexAccountFilter.filter = [];
                cn = glo.pathName.slice(1);cn = cn.replace('/','|');
                onClickMTFlexArrow(cn); return;
            case 'MTFlexGridDCell2':
                onClickSumCells(); return;
            case 'MTSideDrawerTickerSelect':
                onClickUpdateTicker();return;
            case 'MTFlexGridDCell':
            case 'MTSideDrawerDetail4':
                if(event.target.hash) {
                    if(event.target.hash.startsWith('#') == true) {
                        event.stopImmediatePropagation();
                        event.stopPropagation();
                        event.preventDefault();
                        const p = event.target.hash.split('|');
                        MenuReportsSetFilter(p[1],p[2],p[3],p[4]);
                        window.location.replace('/reports/' + p[1]);
                    }
                }
                return;
        }
        if(inList(cn,FlexOptions)) {
            MTFlexDate1 = getDates('d_Today');MTFlexDate2 = getDates('d_Today');
            MenuReportsGo(cn);return;
        }
        if(event.target.className.includes('AbstractButton')) {
            if(event.target.className.includes('EditAccountForm__StyledSubmitButton')) {
                let li = document.getElementById("accountGroupID");
                if(li) {
                    let inputValue = li.value;
                    let p = glo.pathName.split('/');
                    if(p) {setCookie('MTAccounts:' + p[3],inputValue.trim());}
                }
                li = document.getElementById("accountSubGroupID");
                if(li) {
                    let inputValue = li.value;
                    let p = glo.pathName.split('/');
                    if(p) {setCookie('MTAccountsSub:' + p[3],inputValue.trim());}
                }
            }
        }
        if(cn.startsWith('TabNavLink')) {
            if(event.target.pathname == window.location.pathname) {
                removeAllSections('.MTFlexContainer');
                MenuReportsPanels('');
                MenuReportsCustomUpdate(inList(window.location.pathname,['/reports/spending','/reports/income']));
                return;
            }
        }
    }
    onClickMTDropdownRelease();
};

function onClickGeneralLink(cn) {
    if(cn[0] = 'transdata') {
        let d = [], b = [], rrn = cn[1];
        let t = transData.allTransactions.results[rrn];
        let useAmt = t.amount, useLit = 'Amount', useColor = '';
        if(t.category.group.type == 'expense') {
            useAmt = useAmt * -1;
            if(useAmt < 0) {useLit = 'Refund/Credit'; useColor = css.green;}
        } else {
            if(useAmt < 0) useColor = css.red;
        }
        d.push({field1: useLit, style1: '', field2: getDollarValue(useAmt), style2: useColor});
        d.push({field1: 'Account', style1: '', field2: t.account.name, style2: ''});
        d.push({field1: 'Merchant', style1: '', field2: t.merchant.name, style2: ''});
        d.push({field1: 'Date', style1: '', field2: getMonthName(t.date,2), style2: ''});
        d.push({field1: 'Group', style1: '', field2: t.category.group.name, style2: ''});
        d.push({field1: 'Category', style1: '', field2: t.category.name, style2: ''});
        d.push({field1: 'Owner', style1: '', field2: t.ownedByUser != null ? t.ownedByUser.displayName : 'Shared', style2: ''});
        d.push({field1: 'Goal', style1: '', field2: t.goal != null ? t.goal : '(None)', style2: ''});
        d.push({field1: 'Tags', style1: '', field2: t.tags.length == 0 ? '(None)' : getTags(t.tags), style2: ''});
        d.push({field1: t.notes, style1: '', field2: null, style2: ''});
        b.push({name: 'Edit', id: 'TransEdit'});
        MF_ModelWindowOpen({width: 480, id: t.id},d,b);
    }
}
function getTags(tags) {

    let rtnV = [];
    for (let i = 0; i < tags.length; i++) {
        rtnV.push({name: '',style: 'margin-left: 12px; margin-right: 5px; width: 15px; height: 15px; background-color: ' + tags[i].color + '; border-radius: 100%;'});
        rtnV.push({name: tags[i].name,style: ''});
    }
    return rtnV;
}

function onClickUpdateTicker() {
    const element = event.target;
    const pElement = event.target.parentNode;
    for (let i = 0; i < pElement.children.length; i++) {
        const child = pElement.children[i];
        child.className = 'MTSideDrawerTickerSelect';
    }
    element.className = 'MTSideDrawerTickerSelectA';
    setCookie(MTFlex.Name + 'StockSelect',element.innerText);
    MF_DrawChart(null);
}

function onClickMTFlexConfig() {
    let topDiv = MF_SidePanelOpen('','', null, MTFlex.Title1 + ' Settings' );
    MenuSettingsDisplay(topDiv);
    let div = cec('span','MTSideDrawerHeader',topDiv);
    cec('button','MTInputButton',div,'Close','','float:right;');
    cec('button','MTInputButton',div,'Reload','','float:right;');
}

function onClickMTFlexExpand(inAll) {

    let cName = MF_GetSeqKey('Expand');
    let x = null, els = null;
    switch(inAll) {
        case 0:
            x = event.target.parentNode.getAttribute('MTSection');
            if(x) {x = Number(x) + 1;flipCookie(cName + x,1);}
            MT_GridDrawExpand();
            return;
        case 1:
            els = document.querySelectorAll('tr.MTFlexGridRow');
            els.forEach(el => {
                x = el.getAttribute('MTSection');
                if(x) {x = Number(x) + 1;setCookie(cName + x,MTFlex.Collapse);}
            });
            MTFlex.Collapse = 1 - MTFlex.Collapse;
            MT_GridDrawExpand();
            return;
        case 2:
            if(confirm('Save current view as ' + MTFlex.Title1 + ' favorite?')) {
                setCookie(MTFlex.Name + 'View',MTFlex.Button1+'|'+ MTFlex.Button2+'|' + MTFlex.Button3+'|' + MTFlex.Button4 + '|' + getCookie(MF_GetSeqKey('Sort'), true));
            }
            break;
        case 3:
            cName = MTFlex.Name;
            els = getCookie(cName + 'View',false);
            if(els) {
                els = els.split('|');
                setCookie(cName + 'Button1',els[0]);
                setCookie(cName + 'Button2',els[1]);
                setCookie(cName + 'Button3',els[2]);
                setCookie(cName + 'Button4',els[3]);
                if(els[4] != undefined) {setCookie(MF_GetSeqKey('Sort'),els[4]);}
            }
            MenuReportsGo(MTFlex.Name);break;
    }
}

async function onClickExpandSidePanelDetail(useTarget) {

    removeAllSections('div.MTSideDrawerSummary');
    if(useTarget.className == 'MTSideDrawerSummaryTag') {
        useTarget.classList.replace('MTSideDrawerSummaryTag','MTSideDrawerDetailS');return;
    }
    const oldDiv = document.querySelector('span.MTSideDrawerSummaryTag');
    if(oldDiv) oldDiv.classList.replace('MTSideDrawerSummaryTag','MTSideDrawerDetailS');
    useTarget.classList.replace('MTSideDrawerDetailS', 'MTSideDrawerSummaryTag');
    const data = useTarget.getAttribute('data').split('|');
    if(data != null) {
        const pn = useTarget.parentNode;
        let newDiv = document.createElement('div');
        newDiv.className = 'MTSideDrawerSummary';
        newDiv = pn.insertAdjacentElement('afterend', newDiv);
        newDiv = cec('table','MTSideDrawerSummaryTable',newDiv,'','','','TableName','AccountDetailSummary');
        await SidePanelDetailTransactions(event.target,newDiv,data);
        sortTableByColumn(newDiv);
    }
}

async function SidePanelDetailTransactions(useTarget,newDiv,inData) {

    const groupIDs = useTarget?.parentNode?.parentNode?.parentNode?.getAttribute('groupid');
    let filterType = '',filterAct='';
    let ldR = formatQueryDate(getDates('d_StartofLastMonth'));
    let hdR = formatQueryDate(getDates('d_Today'))
    if(inData[1] != null) {
        ldR = inData[1] + '-' + inData[2] + '-01';
        hdR = inData[1] + '-' + inData[2] + '-' + String(daysInMonth((Number(inData[2])-1),inData[1])).padStart(2, '0');
    }
    switch(inData[0]) {
        case 'pending':
            if(groupIDs == undefined) return;
            transData = await getTransactions(ldR,hdR,0,true,MTFlexAccountFilter.filter,null,null,null,rtnCategoryGroupList(groupIDs,'',true));
            break;
        case 'range':
            if(groupIDs == undefined) return;
            transData = await getTransactions(ldR,hdR,0,false,MTFlexAccountFilter.filter,null,null,null,rtnCategoryGroupList(groupIDs,'',true));
            break;
        default:
            filterType = inData[0];
            filterAct = groupIDs;
    }

    let newRow = cec('tr','MTSideDrawerSummaryTableTH',newDiv);
    let td = cec('td','MTSortTableByColumn MTSideDrawerSummaryData',newRow,'Date','','width: 105px;','datatype','date');
    td.setAttribute('columnindex','0');
    td = cec('td','MTSortTableByColumn MTSideDrawerSummaryData',newRow,'Merchant','','','datatype','alpha');
    td.setAttribute('columnindex','1');
    td = cec('td','MTSortTableByColumn MTSideDrawerSummaryData',newRow,'Category','','','datatype','alpha');
    td.setAttribute('columnindex','2');
    td = cec('td','MTSortTableByColumn MTSideDrawerSummaryData2',newRow,'Amount','','','datatype','amount');
    td.setAttribute('columnindex','3');

    let rec = null, useDate = null,useAmt = 0,useColor = '';
    for (let j = 0; j < transData.allTransactions.results.length; j++) {
        rec = transData.allTransactions.results[j];
        if(filterType) { if(rec.category.group.type != filterType) continue; }
        if(filterType == '') { if(rec.category.group.type == 'transfer') continue; }
        if(filterAct) {
            if(rec.account.id != filterAct) continue;
            if(rec.date < ldR || rec.date > hdR) continue;
        }

        newRow = cec('tr','MTSideDrawerSummaryRow',newDiv);
        useDate = unformatQueryDate(rec.date);
        cec('td','MTGeneralLink',newRow,getDates('s_FullDate',useDate),'','','link','transdata|' + j);
        cec('td','MTSideDrawerSummaryData',newRow,rec.merchant.name);
        cec('td','MTSideDrawerSummaryData',newRow,rec.category.name);
        useColor = '';
        if(rec.category.group.type == 'expense') {
            useAmt = rec.amount * -1;
            if(useAmt < 0) useColor = css.green;
        } else {
            useAmt = rec.amount;
            if(useAmt < 0) useColor = css.red;
        }
        if(rec.category.group.type == 'income') {useColor = css.green;}
        if(rec.hideFromReports == true) useColor += 'text-decoration: line-through;';
        cec('td','MTSideDrawerSummaryData2',newRow,getDollarValue(useAmt),'',useColor);
    }
}

function onClickCloseDrawer() {

    let divs = null,returnV=false;
    switch(event.target.innerText.trim()) {
        case 'Apply':
            if(MTFlex.DateEvent == 2) {
                let lv = null,hv=null;
                divs = document.querySelectorAll('input.MTInputClass');
                for (let i = 0; i < divs.length; i++) {
                    if(i == 0) lv = divs[i].value;
                    if(i == 1) hv = divs[i].value;
                }
                if(lv > hv) {divs[0].style = css.red;return;}
            }
            divs = document.querySelectorAll('input.MTInputClass');
            for (let i = 0; i < divs.length; i++) {
                let value = divs[i].value;
                if(MTFlex.DateEvent == 3) {
                    MTFlexDate2 = unformatQueryDate(value);setCookie(MTFlex.Name + 'HigherDate',formatQueryDate(MTFlexDate2));
                } else {
                    if(i == 0) {MTFlexDate1 = unformatQueryDate(value);setCookie(MTFlex.Name + 'LowerDate',formatQueryDate(MTFlexDate1));}
                    if(i == 1) {MTFlexDate2 = unformatQueryDate(value);setCookie(MTFlex.Name + 'HigherDate',formatQueryDate(MTFlexDate2));}
                }
            }
            divs = document.querySelector('input.MTDateCheckbox');
            if(divs) {if(divs.checked == true) {setCookie(MTFlex.Name + 'HigherDate','d_Today');}}
            returnV = true; break;
        case 'Past week':
        case 'Last month':
        case 'This month':
        case 'This quarter':
        case 'This year':
            onClickCloseDrawer2();
            returnV = true;
            break;
        case 'Remove Ticker':
        case 'Watch Ticker':
            divs = event.target.getAttribute('id');
            MenuTickerUpdate(divs);
            break;
        case 'Reload':
            returnV = true;
            break;
        case 'Debug':
            onClickDumpDebug(Number(event.target.getAttribute('id')));
    }
    removeAllSections('div.MTHistoryPanel');
    return returnV;
}

async function MenuAccountsDrawer(inP) {

    const p1 = inP[0];
    const acc = accountsData.accounts[p1];
    let transQueue = [],incs=0,exps=0,trns=0,tots=0;

    let topDiv = MF_SidePanelOpen(acc.type.group,acc.type.display, null , 'Account Summary',acc.type.display,acc.displayName,'/accounts/details/' + acc.id,acc.id, '',acc.logoUrl);
    if(transData == null) {
        document.body.style.cursor = "wait";
        transData = await getTransactions(formatQueryDate(MTFlexDate1),formatQueryDate(MTFlexDate2),0,false,null,false,null,null);
        document.body.style.cursor = "";
    }

    let topDiv2 = cec('div','MTSideDrawerHeader',topDiv);
    MenuDrawerLine(topDiv2,'Current Balance',getDollarValue(acc.displayBalance));
    let cl = acc.dataProviderCreditLimit;
    if(acc.limit != null) cl = acc.limit;
    if(cl) {
        MenuDrawerLine(topDiv2,'Credit Limit',getDollarValue(cl));
        MenuDrawerLine(topDiv2,'Credit Remaining',getDollarValue(cl-acc.displayBalance));
    }

    const div = cec('span','',topDiv2,'','','display:flex;float:right;margin-top: 12px;');
    let dSelect = getCookie(MTFlex.Name + 'StockSelect',false),dCurrent = '';
    if(dSelect == '') dSelect = 'YTD';
    for (let s = 0; s < 5; s++) {
        dCurrent = ['YTD','1Y','2Y','3Y','All'][s];
        cec('span',dSelect == dCurrent ? 'MTSideDrawerTickerSelectA' : 'MTSideDrawerTickerSelect',div,dCurrent );
    }

    if(performanceData == null) {performanceData = await getAccountsBalance(formatQueryDate(getDates('d_Minus3Years'))); }
    MF_DrawChart(div);

    topDiv2 = cec('div','MTSideDrawerHeader',topDiv);
    let div2 = cec('div','MTSideDrawerItem',topDiv2,'','','font-weight: 600;text-align: right;');
    cec('span','MTSideDrawerDetail',div2,'Month','','text-align: left;');
    cec('span','MTSideDrawerDetail',div2,'Income');
    cec('span','MTSideDrawerDetail',div2,'Expenses');
    cec('span','MTSideDrawerDetail',div2,'Net Income');
    cec('span','MTSideDrawerDetail3',div2);
    cec('span','MTSideDrawerDetail',div2,'Transfers');
    div2 = cec('div','MTSideDrawerItem',topDiv2);
    cec('span','MTFlexSpacer',div2);

    transData.allTransactions.results.forEach(t => {
        if(t.account.id == acc.id) {
            MenuAccountsDrawerUpdate(t.date,t.amount,t.category.group.type);
        }
    });
    transQueue.sort((a, b) => a.date.localeCompare(b.date));

    for (let m = 0; m < transQueue.length; m++) {
        div2 = cec('div','MTSideDrawerItem',topDiv2);
        cec('span','MTSideDrawerDetail',div2,getMonthName(transQueue[m].date,3),'','font-weight: 600;text-align: left;');
        cec('span','MTSideDrawerDetailS',div2,getDollarValue(transQueue[m].inc),'','','data','income|' + transQueue[m].date.substring(0,4) + '|' + transQueue[m].date.substring(5,7));
        cec('span','MTSideDrawerDetailS',div2,getDollarValue(transQueue[m].exp),'','','data','expense|' + transQueue[m].date.substring(0,4) + '|' + transQueue[m].date.substring(5,7));
        let tot = transQueue[m].inc - transQueue[m].exp;
        cec('span','MTSideDrawerDetailS',div2,getDollarValue(tot),'','','data','|' + transQueue[m].date.substring(0,4) + '|' + transQueue[m].date.substring(5,7));
        cec('span','MTSideDrawerDetail3',div2);
        cec('span','MTSideDrawerDetailS',div2,getDollarValue(transQueue[m].trn),'','','data','transfer|' + transQueue[m].date.substring(0,4) + '|' + transQueue[m].date.substring(5,7));
        incs+=transQueue[m].inc;
        exps+=transQueue[m].exp;
        tots+=tot;
        trns+=transQueue[m].trn;
    }
    div2 = cec('div','MTSideDrawerItem',topDiv2);
    cec('span','MTFlexSpacer',div2);

    div2 = cec('div','MTSideDrawerItem',topDiv2);
    cec('span','MTSideDrawerDetail',div2,'Totals','','font-weight: 600;text-align: left;');
    cec('span','MTSideDrawerDetail',div2,getDollarValue(incs));
    cec('span','MTSideDrawerDetail',div2,getDollarValue(exps));
    cec('span','MTSideDrawerDetail',div2,getDollarValue(tots));
    cec('span','MTSideDrawerDetail3',div2);
    cec('span','MTSideDrawerDetail',div2,getDollarValue(trns));
    div2 = cec('span','MTSideDrawerHeader',topDiv);
    cec('button','MTInputButton',div2,'Close','','float:right;');

    function MenuAccountsDrawerUpdate(inDate,inAmt,inType) {
        let ud = inDate.substring(0, 7);
        let idx = transQueue.findIndex(item => item.date === ud);
        if (idx === -1) {
            transQueue.push({date: ud, inc: 0, exp: 0, trn: 0});
            idx = transQueue.length-1;
        }
        switch(inType) {
            case 'income':
                transQueue[idx].inc += inAmt;return;
            case 'expense':
                inAmt = -inAmt; transQueue[idx].exp += inAmt;return;
            case 'transfer':
                transQueue[idx].trn += inAmt;return;
        }
    }
}

async function MenuTickerDrawer(inP) {

    let reload = null,topDiv=null,topDiv2=null;
    if(inP == null) {
        reload = document.getElementById('MTSideDrawerGroup');
        inP = reload.getAttribute('data').split(',');
    }
    const p1 = inP[0];
    const p2 = inP[1];
    const edg = portfolioData.portfolio.aggregateHoldings.edges[p1].node;
    const hld = portfolioData.portfolio.aggregateHoldings.edges[p1].node.holdings;
    let bondInfo = [],stockInfo = ['',''];
    let useTitle = hld[p2].name;
    if(hld[p2].type == 'fixed_income') {
        bondInfo = getBondPieces(useTitle);
        useTitle = bondInfo[0];
    } else {
        if(hld[p2].ticker != null) {
            useTitle = hld[p2].ticker + ' • ' + hld[p2].name;
            const xT = inList(hld[p2].typeDisplay,['Stock','ETF','Mutual Fund']);
            if(xT > 0) {
                stockInfo[0] = 'Stock Analysis for ' + hld[p2].ticker;
                stockInfo[1] = getCookie(['MT_InvestmentURLStock','MT_InvestmentURLETF','MT_InvestmentURLMuni'][xT-1],false);
                stockInfo[1] = stockInfo[1].replace('{ticker}',hld[p2].ticker);
            }
        }
    }

    if(reload == null) {
        topDiv = MF_SidePanelOpen('','', ['',''] , useTitle, hld[p2].typeDisplay,stockInfo[0],stockInfo[1],null,'Split/Combine Holdings');
        topDiv2 = cec('span','MTSideDrawerHeader',topDiv,'','','','id','SideDrawerHeader');
        MenuDrawerLine(topDiv2,'Current Price',getDollarValue(hld[p2].closingPrice,false),'MTCurrentPrice');
        if(inList(hld[p2].type,eqTypes) > 0) {
            MenuDrawerLine(topDiv2,'52-Week Closing Range','','MTYTDPriceChange');
            MenuDrawerLine(topDiv2,'20-Day Moving Average','','MTMoveAvg20');
            MenuDrawerLine(topDiv2,'50-Day / 200-Day Moving Average','','MTMoveAvg50');
            MenuDrawerLine(topDiv2,'Price Change','','MTPriceChange','margin-top:20px;');
            const div = cec('span','',topDiv2,'','','display:flex;float:right;margin-top: 12px;');
            let dSelect = getCookie(MTFlex.Name + 'StockSelect',false),dCurrent = '';
            if(dSelect == '') dSelect = '1W';
            for (let s = 0; s < 6; s++) {
                dCurrent = ['1W','1M','3M','6M','YTD','1Y'][s];
                cec('span',dSelect == dCurrent ? 'MTSideDrawerTickerSelectA' : 'MTSideDrawerTickerSelect',div,dCurrent);
            }
            performanceData = await getPerformance(formatQueryDate(getDates('d_LastYear')),formatQueryDate(getDates('d_Today')),edg.id);
            MF_DrawChart(div);
        } else if (hld[p2].type == 'fixed_income') {
            if(bondInfo[1] != '') {
                MenuDrawerLine(topDiv2,'Coupon Rate',bondInfo[1]);
                let pct = bondInfo[1].replace('%','');
                pct = Number(pct);
                if(isNaN(pct) == false) {
                    pct = hld[p2].quantity * (pct * 0.01);
                    MenuDrawerLine(topDiv2,'Estimated Yearly Income',getDollarValue(pct,false));
                }
            }
            if(bondInfo[2] != '') MenuDrawerLine(topDiv2,'Maturity Date ',bondInfo[2]);
            if(bondInfo[3] == 'Yes') MenuDrawerLine(topDiv2,'Extraordinary Redemption',bondInfo[3]);
            if(bondInfo[4] == 'Yes') MenuDrawerLine(topDiv2,'Subject to AMT',bondInfo[4]);
            if(bondInfo[5] == 'Yes') MenuDrawerLine(topDiv2,'Original Issue Discount',bondInfo[5]);
            MenuDrawerSpacer(topDiv2);
        }
    }

    let allQty = 0,allCost = 0,allValue=0;
    for (let h = 0; h < hld.length; h++) {
        if(hld[h].account.institution != null) {
            allQty+=hld[h].quantity;
            allValue+=hld[h].value;
            allCost+=getCostBasis(hld[h].costBasis,hld[h].type,hld[h].quantity);
        }
    }

    if(reload == null) {
        topDiv2 = cec('div','',topDiv2,'','','','id','MTSideDrawerGroup');
        topDiv2.setAttribute('data',inP);
    } else {
        topDiv2 = reload;
        while (topDiv2.firstChild) {topDiv2.removeChild(topDiv2.firstChild);}
    }

    if(getCookie('MTInvestments_SidePanel',true) == 0) {
        allQty = hld[p2].quantity;
        allValue = hld[p2].value;
        allCost = getCostBasis(hld[p2].costBasis,hld[p2].type,hld[p2].quantity);
        MenuDrawerLine(topDiv2,'Account',hld[p2].account.displayName,'','margin-top:20px;');
        if(hld[p2].account.institution != null) {MenuDrawerLine(topDiv2,'Institution',hld[p2].account.institution.name);}
    }
    MenuDrawerLine(topDiv2,'Price',getDollarValue(hld[p2].closingPrice,false));
    MenuDrawerLine(topDiv2,'Current Value',getDollarValue(allValue,false));
    MenuDrawerLine(topDiv2,'Cost Basis',getDollarValue(allCost),'','','','To change Cost Basis, choose Accounts and go to Holdings (' + hld[p2].name + ')');

    let useGainLoss = allValue - allCost;
    let useGainLossPct = ((useGainLoss / allCost) * 100);
    useGainLossPct = +useGainLossPct.toFixed(2);
    MenuDrawerLine(topDiv2,'Unrealized Gain/Loss',getDollarValue(useGainLoss) + ' (' + useGainLossPct + '%)','','',null,'',useGainLoss < 0 ? css.red : css.green);

    if(hld[p2].type == 'fixed_income') {
        useGainLoss = (allQty / allCost) * 100;
        MenuDrawerLine(topDiv2,'Cost Per Share',getDollarValue(useGainLoss));
    }

    MenuDrawerSpacer(topDiv2);

    for (let h = 0; h < hld.length; h++) {
        let useName = hld[h].account.displayName;
        if(MTFlexAccountFilter.filter.length > 0) {if(!MTFlexAccountFilter.filter.includes(hld[h].account.id)) {useName += ' (Outside ' + MTFlexAccountFilter.name + ')';} }
        MenuDrawerLine(topDiv2,useName,getDollarValue(hld[h].value),'','',hld[h].account.logoUrl);
        MenuDrawerLine(topDiv2,hld[h].account?.institution?.name,hld[h].quantity.toLocaleString('en-US') + ' shares',null,'font-size:13px;margin-bottom:12px;');
    }

    if(reload == null) {
        topDiv2 = cec('span','MTSideDrawerHeader',topDiv);
        cec('button','MTInputButton',topDiv2,'Close','','float:right;' );
        if(glo.debug == 1) {cec('button','MTInputButton',topDiv2,'Debug','','float:right;','id',p1);}
        if(MTFlex.Button2 == 2) {
            if(hld[p2].ticker != 'null') {
                let bName = 'Watch Ticker';
                if(getCookie('MTInvestmentTickers',false).split(',').includes(hld[p2].ticker)) bName = 'Remove Ticker';
                cec('button','MTInputButton',topDiv2,bName,'','margin-left: 0px;','id',hld[p2].ticker);
            }
        }
    }
}

function MenuTickerUpdate(inT) {

    const tickers = getCookie('MTInvestmentTickers',false).split(',');
    const tIndex = tickers.findIndex(entry => entry.includes(inT));
    if (tIndex !== -1) {tickers.splice(tIndex, 1);}
    else {tickers.push(inT);tickers.sort();}
    setCookie('MTInvestmentTickers',tickers.join(','));
    MenuReportsGo(MTFlex.Name);return;
}

function MenuDrawerLine(inDiv,inA,inB,inId,stl,url,ttl,fStl) {
    let div = cec('span','MTSideDrawerItem',inDiv,'','',stl,'id',inId);
    if(url) { cec('span','MTFlexImage',div,'','','background-image: url("' + url + '");');}
    cec('span','MTSideDrawerDetails',div,inA,'',url != null ? 'width:450px;' : '');
    if(ttl) {
        cecTip('span','MTSideDrawerDetails',div,inB,ttl);
    } else {
        div = cec('span','MTSideDrawerDetails',div,inB,'',fStl);
    }
}

function MenuDrawerSpacer(inDiv) {
    cec('span','MTFlexSpacer',inDiv,'','','display: block;height:20px;margin-bottom:20px;');
}

function onClickDumpDebug(inNode) {

    let divs = portfolioData.portfolio.aggregateHoldings.edges[inNode];
    let jsonString = JSON.stringify(divs, null, 2);
    jsonString = 'Monarch Money Tweaks - Version: ' + version + CRLF + 'Node - ' + inNode + CRLF + CRLF + jsonString;
    navigator.clipboard.writeText(jsonString);
    alert('Debug copied to keyboard. (node=' + inNode + ')');
}

function onClickCloseDrawer2() {
    const cases = {'Past week': ['d_MinusWeek','d_Today'],'Last month': ['d_StartofLastMonth', 'd_EndofLastMonth'], 'This month': ['d_StartofMonth', 'd_Today'], 'This quarter': ['d_ThisQTRs', 'd_Today'], 'This year': ['d_StartofYear', 'd_Today']};
    if(cases[event.target.innerText.trim()]) {
        const [lowerDate, higherDate] = cases[event.target.innerText.trim()];
        if(MTFlex.DateEvent == 2) {
            setCookie(MTFlex.Name + 'LowerDate', lowerDate);
            setCookie(MTFlex.Name + 'HigherDate', higherDate);
        }
    }
}

function onClickContainer() {
    const divsWithLtrDir = document.querySelectorAll('div[dir="ltr"]');
    let cn = '',it = '';
    if(divsWithLtrDir.length > 0) {
        for (let i = 0; i < divsWithLtrDir.length; i++) {
            cn = divsWithLtrDir[i].className;
            it = divsWithLtrDir[i].innerText.trim();
            if(cn != 'osano-cm-window' && it.startsWith('Original')) {MM_SearchMerchants(divsWithLtrDir[i]);return;}
        }
    }
}

function onClickSetupDropdown(et) {
    let cn = et.getAttribute('mtsetupoption');
    let cvalue = et.getAttribute('mtsetupvalue');
    setCookie(cn,cvalue);
    const pDiv = et.parentNode.parentNode;
    pDiv.childNodes[0].textContent = et.innerText.trim() + ' ';
}

async function onClickNoteTagButton() {

    const divNotetag = document.querySelector('div#MTNoteTagButton');
    if(divNotetag && divNotetag.childNodes.length == 0) {
        const noteTags = await rtnNoteTagList();
        for (let i = 0; i < noteTags.length; i++) {cec('a','MTNoteTagDropdown',divNotetag,noteTags[i]);}
    }
    divNotetag.classList.toggle("show");
}

function onClickNoteTagDropdown() {
    const divNotetag = document.querySelector('div#MTNoteTagButton');
    divNotetag.classList.toggle("show");
    const newNoteTag = event.target.innerText.trim();
    let noteDiv = event.target.parentNode.parentNode.childNodes[2];
    if(noteDiv) {
        noteDiv = noteDiv.childNodes[0];
        let noteField = noteDiv.textContent;
        if(noteField.startsWith('*')) {noteField = getStringPart(noteField,'\n','right',true);}
        let newNoteField = '* ' + newNoteTag;
        if(noteField != '') { newNoteField = newNoteField + '\n' + noteField;}
        noteDiv.focus();
        noteDiv.value = '';
        document.execCommand('insertText', false, newNoteField);
    }
}

function onClickLastNumber() {
    const id = document.querySelector('input.NumericInput__Input-sc-1km21mm-0');
    if(id) {id.type = 'Number';id.min = 0; id.max = 365;}
}

function onClickSumCells() {
    let x = Number(getCleanValue(event.target.textContent,2));
    if(event.target.id != 'selected') {
        event.target.style = 'border: 2px solid green;';event.target.id = 'selected';
        MTFlexSum[0]++; MTFlexSum[1] += x;
    } else {
        event.target.style = '';event.target.id = '';
        MTFlexSum[0] -=1; MTFlexSum[1] -= x;
    }
    if(MTFlexSum[0] < 2) {MTFlex.bub.setAttribute('style','display:none;');} else {
        MTFlex.bub.setAttribute('style','display:block;');
        MTFlex.bub1.textContent = 'SUM: ' + getDollarValue(MTFlexSum[1],false);
        MTFlex.bub2.textContent = 'AVG: ' + getDollarValue(MTFlexSum[1]/MTFlexSum[0],false);
        MTFlex.bub5.textContent = 'CNT: ' + MTFlexSum[0];
    }
}

function onClickMTDropdown(cActive) {
    if(cActive == glo.flexButtonActive) { onClickMTDropdownRelease(); } else {
        onClickMTDropdownRelease();
        if(document.getElementById("MTDropdown"+cActive).classList.toggle("show") == true) { glo.flexButtonActive = cActive;} else { glo.flexButtonActive = 0;}
    }
}

function onClickMTDropdownRelease() {
    if(glo.flexButtonActive > 0) {
        let li = document.getElementById("MTDropdown" + glo.flexButtonActive);
        if(li) {li.className = 'MTFlexdown-content';}
        glo.flexButtonActive = 0;
    }
}

function onClickMTSettings() {
    const bt = event.target.innerText.trim();
    if(bt == 'Save Settings') {
        let csvContent = 'Monarch Money Tweaks Configuration File' + CRLF;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            if(key.startsWith('MT')) {
                csvContent = csvContent + key + '||' + value + CRLF;
            }
        }
        downloadFile('Monarch Money Tweaks Settings',csvContent);
    }
    if(bt == 'Restore Settings') { uploadfileSettings(); }
}

function onClickMTFlexBig() {
    let inputs = [];
    switch(MTFlex.DateEvent) {
        case 1:
            if(getDates('isToday',MTFlexDate2)) { MTFlexDate1 = getDates('d_StartofLastMonth'); MTFlexDate2 = getDates('d_EndofLastMonth');
                                                } else { MTFlexDate1 = getDates('d_StartofMonth'); MTFlexDate2 = getDates('d_Today');}
            MenuReportsGo(MTFlex.Name);break;
        case 2:
            inputs.push({'NAME': 'Lower Date', 'TYPE': 'date', 'VALUE': formatQueryDate(MTFlexDate1)});
            inputs.push({'NAME': 'Higher Date', 'TYPE': 'date', 'VALUE': formatQueryDate(MTFlexDate2)});
            MT_GetInput(inputs);break;
        case 3:
            inputs.push({'NAME': 'As of Date', 'TYPE': 'date', 'VALUE': formatQueryDate(MTFlexDate2)});
            MT_GetInput(inputs);break;
    }
}

function onClickMTFlexArrow(inP) {

    if(inP == null) return;
    let p = inP.split('|');
    switch(MTFlex.Name) {
        case 'MTTrends':
        case 'MTNet_Income':
        case undefined:
            MenuHistoryDrawer(p[0],p[1]);
            break;
        case 'MTInvestments':
            MenuTickerDrawer(p);
            break;
        case 'MTAccounts':
            MenuAccountsDrawer(p);
            break;
    }
}

function onClickGridSort() {

    let Column = event.target.getAttribute("column");
    if(Column != '') {
        let elSelected = Number(Column);
        let elCurrent = getCookie(MF_GetSeqKey('Sort'),true);
        if(Math.abs(elCurrent) == Math.abs(elSelected)) { elSelected = elCurrent * -1; }
        setCookie(MF_GetSeqKey('Sort'),elSelected);
        MF_GridDraw(1);
    }
}

// Monarch Money needed
function isDarkMode() {
    const rObj = document.querySelector('[class*=Page__Root]');
    if(rObj == null) {return null;}
    const cssObj = window.getComputedStyle(rObj, null);
    if(cssObj == null) {return null;}
    const bgColor = cssObj.getPropertyValue('background-color');
    if(bgColor == null || bgColor == '') {return null;}
    if (bgColor === 'rgb(25, 25, 24)') { return 1; } else { return 0; }
}
function addStyle(aCss) {
    if(css.headStyle == null) {css.headStyle = document.getElementsByTagName('head')[0]; }
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    css.headStyle.appendChild(style);
}

// Create Element Child (element,className,parentNode,innerText,href,style,[extra])
function cec(e, c, p, it, hr, st, a1, a2,isAfter) {
    if(glo.cecIgnore == true) return;
    const div = document.createElement(e);
    if (c) div.className = c;
    if (it) div.innerText = it;
    if (hr) div.href = hr;
    if (st) div.style = st;
    if (a1) div.setAttribute(a1, a2);
    if(isAfter == true) { return p.after(div); } else { return p.appendChild(div);}
}
function cecTip(e,c,p,it,tip) {
    const div = cec('span',c + ' tooltip',p,it);
    const tt = cec('div','tooltip',div);
    cec(e,'tooltiptext',tt,tip);
}

// Generic Functions
function removeAllSections(inDiv) {
    const divs = document.querySelectorAll(inDiv);
    for (let i = 0; i < divs.length; i++) { divs[i].remove(); }
}

function inputTwoFields(InSelector,InValue1,InValue2) {

    let x = document.querySelectorAll(InSelector);
    if(x[0]) {
        x[0].focus();x[0].value = '';
        document.execCommand('insertText', false, InValue1);
        if(x[1]) {
            x[1].focus();x[1].value = '';
            document.execCommand('insertText', false, InValue2);
        }
    }
}

function getMonthName(inValue,inType) {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    switch(inType) {
        case 4:
            if(inValue) {
                const [year, month] = inValue.split('-');
                return months[Number(month)-1].substring(0,3) + year.substring(2,4) ;} else {return '';}
        case 3:
            if(inValue) {
                const [year, month] = inValue.split('-');
                return year + '-' + months[Number(month)-1].substring(0,3);} else {return '';}
        case 2:
            if(inValue) {
                const [year, month, day] = inValue.split('-');
                return months[Number(month)-1].substring(0,3) + ' ' + day + ', ' + year;} else {return '';}
        default:
            if(inType == true) {return months[inValue].substring(0,3); } else { return months[inValue];}
    }
}

function getDates(InValue,InDate) {

    let d = InDate ? new Date(InDate) : new Date();
    if (InValue == 's_CompleteDate') {
        return d.toLocaleString(undefined, {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC'});
    }
    d.setHours(0,0,0,0);
    let month = d.getMonth(), day = d.getDate(), year = d.getFullYear();
    if(InValue == 'isToday') {
        d.setHours(0, 0, 0, 0);
        let todaysDate = new Date();
        todaysDate.setHours(0, 0, 0, 0);
        if (InValue == 'isToday') {if (d.getTime() === todaysDate.getTime()) {return true;} else {return false;}}
    }
    if(InValue == 'isWeekend') {if(d.getDay() == 0 || d.getDay() == 6) {return true;} else {return false;}}
    switch (InValue) {
        case 'n_CurYear':return(year);
        case 'n_CurMonth':return(month);
        case 'n_CurDay':return(day);
        case 'n_DOW':return d.getDay();
        case 'd_Today':return d;
        case 'd_Yesterday':d.setDate(d.getDate() - 1);return d;
        case 'd_MinusWeek':d.setDate(d.getDate() - 7);return d;
        case 'd_Minus2Weeks':d.setDate(d.getDate() - 14);return d;
        case 'd_Minus1Month':d.setMonth(d.getMonth() - 1);return d;
        case 'd_Minus3Months':d.setMonth(d.getMonth() - 3);d.setDate(d.getDate() + 1);return d;
        case 'd_Minus6Months':d.setMonth(d.getMonth() - 6);d.setDate(d.getDate() + 1);return d;
        case 'd_LastYear':
            d.setFullYear(d.getFullYear() - 1);
            d.setDate(d.getDate() + 1);
            return d;
        case 'd_Minus1Year':d.setDate(1);d.setFullYear(d.getFullYear() - 1);return d;
        case 'd_Minus1HYear':d.setDate(d.getDate()-548);return d;
        case 'd_Minus2Years':d.setDate(1);d.setFullYear(d.getFullYear() - 2);return d;
        case 'd_Minus3Years':d.setDate(1);d.setFullYear(d.getFullYear() - 3);return d;
        case 'd_Minus4Years':d.setDate(1);d.setFullYear(d.getFullYear() - 4);return d;
        case 'd_Minus5Years':d.setDate(1);d.setFullYear(d.getFullYear() - 5);return d;
        case 'd_StartofWeek':
            day = d.getDay();
            if (day === 0) {return d;}
            d.setDate(d.getDate() - day);
            return d;
        case 'd_StartofMonth':d.setDate(1);return d;
        case 'd_EndofMonth':day = daysInMonth(month,year); d.setDate(day);return d;
        case 'd_StartofNextMonthLY':month+=1;d.setMonth(month);d.setDate(1);d.setYear(year-1);return d;
        case 'd_EndofNextMonthLY':
            if(month == 11) {month = 0;day=31;year+=1;} else {month+=1;day = daysInMonth(month,year);}
            d.setMonth(month);d.setDate(day);d.setYear(year-1);return d;
        case 'd_StartofYear':d.setDate(1);d.setMonth(0);return d;
        case 's_YMD':
            return year + '-' + String(month+1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        case 's_FullDate':return(getMonthName(month,true) + ' ' + day + ', ' + year );
        case 's_ShortDate':return(getMonthName(month,true) + ' ' + day);
        case 's_MidDate':return(getMonthName(month,true) + ' ' + year);
        case 'd_ThisQTRs':
            month = (month < 3) ? 0 : (month == 4 || month == 5) ? 3 : (month == 7 || month == 8) ? 6 : (month == 10 || month == 11) ? 9 : month;
            d.setFullYear(year,month,1);
            return d;
        case 'd_StartofLastMonth':
            month-=1;
            if(month < 0) {month = 11;year-=1;}
            day = 1;
            d.setFullYear(year, month, day);return d;
        case 'd_EndofLastMonth':
            month-=1;
            if(month < 0) {month = 11;year-=1;}
            day = daysInMonth(month,year);
            d.setFullYear(year, month, day);return d;
        case 'i_Last12s':year-=1;break;
        case 'i_Last12e':if(getCookie('MT_CalendarEOM',true) == 1) {day = daysInMonth(month,year);}break;
        case 'i_LastYearYTDs':month = 0;day = 1;year-=1;break;
        case 'i_LastYearYTDe':
            year-=1;if(getCookie('MT_CalendarEOM',true) == 1) {day = daysInMonth(month,year); }break;
        case 'i_ThisQTRs':
            month = (month < 3) ? 0 : (month == 4 || month == 5) ? 3 : (month == 7 || month == 8) ? 6 : (month == 10 || month == 11) ? 9 : month;
            day = 1;
            break;
        case 'i_ThisQTRe':
            month = (month < 2) ? 2 : (month == 3 || month == 4) ? 5 : (month == 6 || month == 7) ? 8 : (month == 9 || month == 10) ? 11 : month;
            if(getCookie('MT_CalendarEOM',true) == 1) {day = daysInMonth(month,year); }
            break;
        default:
            alert('MT-Tweaks: Invalid Date in getDates: ' + InValue); return;
    }
    month+=1;
    const FullDate = [("0" + month).slice(-2),("0" + day).slice(-2),year].join('/');
    return(FullDate);
}

function unformatQueryDate(date) {

    let year = Number(date.slice(0,4));
    let month = Number(date.slice(5,7)) -1;
    let day = Number(date.slice(8,10));
    const x = new Date(year,month,day);
    return x;
}

function formatQueryDate(date) {
    var d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) {month = '0' + month;}
    if (day.length < 2) {day = '0' + day;}
    return [year, month, day].join('-');
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function daysBetween(date1,date2, asLit) {

    const d1 = date1.setHours(0,0,0,0);
    const d2 = date2.setHours(0,0,0,0);
    const millisecondsPerDay = 1000 * 3600 * 24;
    const diffInMilliseconds = Math.abs(d2 - d1);
    const diffInDays = Math.floor(diffInMilliseconds / millisecondsPerDay);

    if (asLit === true) {
        switch (diffInDays) {
            case 7: return '1w';
            case 14: return '2w';
            case 21: return '3w';
            case 28: return '4w';
            case 30:
            case 31: return '1m';
            default:break;
        }
        if (diffInDays > 61 && diffInDays < 63) { return '2m'; }
        if (diffInDays > 90 && diffInDays < 94) { return '3m'; }
        if (date1.getDate() === 1 && date1.getMonth() === date2.getMonth() && getDates('isToday', date2)) {return 'MTD';}
        return diffInDays + 'd';
    }

    if (asLit === 3) {
        switch (diffInDays) {
            case 7: return '1 week';
            case 14: return '2 weeks';
            case 21: return '3 weeks';
            case 28: return '4 weeks';
            case 30:
            case 31: return '1 month';
            default: break;
        }
        if (diffInDays > 61 && diffInDays < 63) { return '2 months';}
        if (diffInDays > 90 && diffInDays < 94) { return '3 months';}
        if (date1.getDate() === 1 && date1.getMonth() === date2.getMonth() && getDates('isToday', date2)) {return 'MTD';}
        return diffInDays + ' days';
    }
    return diffInDays;
}

function findButton(inName) {
    if(inName) {
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {if (button.innerText.includes(inName)) {return button;}}
    }
    return null;
}

function startsInList(v = '',p,d) {return inList(v,p,d,true);}
function inList(v,p,d,sW) {
    for (let i = 0; i < p.length; i++) {
        if(sW == true) {if(v.startsWith(p[i]) == true) {return i+1;}} else {if(v == p[i]) {return i+1;}}
    }
    if(d) return 1;return 0;
}

function getStringPart(inValue, inChr, inDirection,inNotFoundBlank) {
    const idx = inValue.indexOf(inChr);
    if (idx === -1) {if(inNotFoundBlank == true) {return '';} else {return inValue;}}
    if (inDirection === 'right') {return inValue.slice(idx + 1); } else {return inValue.slice(0, idx);}
}

function replaceBetweenWith(InValue,InStart,InEnd,InReplaceWith) {

    let result = InValue;
    if(InValue != null) {
        let a = InValue.indexOf(InStart);
        if(a > 0) {
            let b = InValue.indexOf(InEnd,a+1);
            if(b > a) {
                b = b + InEnd.length;
                result = InValue.substring(0, a) + InReplaceWith + InValue.substring(b);
            }
        }
    }
    return result;
}

function getCleanValue(inValue,inDec) {
    if(inValue.startsWith('$') || inValue.startsWith('-') || inValue.startsWith('+')) {
        inValue = inValue.split(" ")[0];
        inValue = replaceBetweenWith(inValue,'(',')','');
        const AmtStr = inValue.replace(/[$,]+/g,"");
        let Amt = Number(AmtStr);
        if(inDec > 0) {Amt = Number(Amt.toFixed(inDec));}
        return Amt;
    }
    else { return inValue; }
}

function getBondPieces(inVal) {

    let usePct = null,useDate = null,newStr = inVal, useXtro = '',useAMT = '', useOID = '';
    if(newStr.endsWith('OID')) {useOID = 'Yes'; newStr = newStr.trim().slice(0, -3).trim();} else {if(newStr.includes('OID ')) {useOID = 'Yes'; newStr = newStr.replace('OID ','');}}
    if(newStr.includes('**CALLED**')) {useDate = '** CALLED **'; newStr = newStr.replace('**CALLED**','');}
    if(newStr.includes('XTRO')) {useXtro = 'Yes'; newStr = newStr.replace('XTRO','');}
    newStr = newStr.replace(' DUE ', '').trim();
    const dateMatch = newStr.match(/\d{2}\/\d{2}\/\d{2}/);
    if (dateMatch) {
        useDate = dateMatch[0];
        newStr = newStr.replace(useDate, '').trim();
    }
    const match = newStr.match(/\d+(\.\d+)?%/);
    if (match) {
        usePct = match[0];
        const idxS = match.index;
        const idxE = idxS + match[0].length;
        const isM = newStr.substring(idxE).match(/^\d{2}/);
        if (isM) {newStr = newStr.substring(0, idxS) + newStr.substring(idxE + 2);}
    }
    if(newStr.endsWith('AMT')) {
        useAMT = 'Yes'; newStr = newStr.trim().slice(0, -3).trim();
    }
    return [newStr,usePct,useDate, useXtro,useAMT,useOID];
}

function getCostBasis(inVal,inType,inQty) {

    let useCostBasis = 0;
    if(inType == 'fixed_income') {useCostBasis = inVal * 0.01;} else {useCostBasis = inVal;}
    if(useCostBasis > 1100000 && inQty > 0) {
        useCostBasis = useCostBasis / inQty;
        useCostBasis = +useCostBasis.toFixed(2);
    }
    return useCostBasis;
}

function getDollarValue(InValue,ignoreCents) {
    if(InValue == null) {return '';}
    if(InValue === -0 || isNaN(InValue)) {InValue = 0;}
    if(ignoreCents == true) { InValue = Math.round(InValue);}
    let useValue = InValue.toLocaleString("en-US", {style:"currency", currency:Currency});
    if(ignoreCents == true) { useValue = useValue.substring(0, useValue.length-3);}
    return useValue;
}

function downloadFile(inTitle,inData) {
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + inData);
    const link = cec('a','',document.body,'',encodedUri,'','download',inTitle + '.csv');
    link.click();
    document.body.removeChild(link);
}

function uploadfileSettings() {
    const link = cec('input','',document.body,'','','display:none;','type','file');
    const cf = 'Monarch Money Tweaks Configuration File';
    link.setAttribute('accept','.csv');
    link.addEventListener('change', (event) => {
        const file = event.target.files[0];
        let csvContent = [];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                const lines = contents.split(/\r?\n/);
                lines.forEach((line, index) => {csvContent.push(line);});
                if(csvContent[0] == null || csvContent[0] != cf) {alert('MT-Tweaks: Invalid ' + cf);}
                else {
                    for (let i = 1; i < csvContent.length; i++) {
                        const line = csvContent[i].split('||');
                        if(line[0] != '') {setCookie(line[0],line[1]);}
                    }
                    location.reload();
                }
            };
            reader.readAsText(file);
        }
    });
    link.click();
}

function setCookie(cName, cValue) {localStorage.setItem(cName,cValue);}

function getCookie(cname, isNum = false, useDefault) {
    let value = localStorage.getItem(cname);
    if (value !== null) { return isNum ? Number(value) : value;}
    if (useDefault !== undefined) {return useDefault;}
    return isNum ? 0 : '';
}

function flipCookie(inCookie,spin) {
    let OldValue = parseInt(getCookie(inCookie,true)) + 1;
    if(spin == null) {spin = 1;}
    if(OldValue > spin) { setCookie(inCookie,0); } else {setCookie(inCookie,OldValue); }
}
function getDisplay(InA,InB) {
    if(InA == 1) {return 'none;';} else {return InB;}
}
function getChecked(InA,InB) {
    if(InA == 1) {return 'display: none;';} else {return InB;}
}

function sortTableByColumn(inEvent) {

    let table = null,tableName = '',columnIndex='',datatype='',dirModifier='';
    const nodeN = inEvent.nodeName;
    if(nodeN == 'TABLE') {
        tableName = inEvent.getAttribute('TableName');
        table = inEvent;
        const ck = getCookie( 'MTSortTable' + tableName,false).split('|');
        if(ck.length == 0) return;
        columnIndex = ck[0];
        datatype = ck[1];
        dirModifier = ck[2];
    } else {
        table = inEvent.parentNode.parentNode;
        tableName = table.getAttribute('TableName');
        columnIndex = inEvent.getAttribute('ColumnIndex');
        datatype = inEvent.getAttribute('datatype');
        dirModifier = inEvent.innerText.includes('▲') ? -1 : 1;
        setCookie('MTSortTable' + tableName,columnIndex + '|' + datatype + '|' + dirModifier);
    }
    if(table.childNodes.length > 1) {
        const secondRowClassName = 'tr.' + table.childNodes[1].className;
        const rows = Array.from(document.querySelectorAll(secondRowClassName));
        const sortedRows = rows.sort((a, b) => {
            const aText = a.children[columnIndex].innerText.trim();
            const bText = b.children[columnIndex].innerText.trim();
            switch (datatype) {
                case 'date':return (new Date(aText) - new Date(bText)) * dirModifier;
                case 'amount':return (parseFloat(aText.replace(/[$,]/g, '')) - parseFloat(bText.replace(/[$,]/g, ''))) * dirModifier;
                default:return aText.localeCompare(bText) * dirModifier;
            }
        });
        rows.forEach(row => row.remove());
        sortedRows.forEach(row => table.appendChild(row));
    }
    const cols = document.querySelectorAll('td.MTSortTableByColumn');
    for (let i = 0; i < cols.length; i++) {
        cols[i].innerText = cols[i].innerText.replace(/[▲▼]/g, "");
        if(i == columnIndex) { if(dirModifier == -1) {cols[i].innerText += ' ▼';} else {cols[i].innerText += ' ▲';} }
    }
}

// Main Execution Loop
(function() {
    MM_MenuFix();
    setInterval(() => {
        if(css.reload == true) {css.reload = false; MM_Init();}
        if(window.location.pathname != glo.pathName) {
            if(glo.pathName) {MM_MenuRun(false);}
            glo.pathName = window.location.pathname;
            MM_MenuFix();MM_MenuRun(true);
        }
        MenuCheckSpawnProcess();
    },300);
}());

// Run when leaving & entering a page
function MM_MenuRun(onFocus) {
    MenuReports(onFocus);
    MenuLogin(onFocus);
    MenuPlan(onFocus);
    MenuAccounts(onFocus);
    MenuHistory(onFocus);
    MenuSettings(onFocus);
    MenuCategories(onFocus);
    MenuTransactions(onFocus);
}
// Query functions
function getGraphqlToken() {return JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).token;}

function callGraphQL(data) {
    return {
        mode: 'cors',
        method: 'POST',
        headers: {accept: '*/*',authorization: `Token ${getGraphqlToken()}`,'content-type': 'application/json',},
        body: JSON.stringify(data),
    };
}
async function getMonthlySnapshotData2(startDate, endDate, groupingType, inAccounts, inCat) {
    if(inAccounts == undefined) inAccounts = [];
    if(inCat == undefined || inCat == null) inCat = [];
    const filters = {startDate: startDate, endDate: endDate, ...(inCat.length > 0 && { categories: inCat }), ...(inAccounts.length > 0 && { accounts: inAccounts })};
    const options = callGraphQL({operationName: 'GetAggregatesGraph', variables: {filters: filters },
          query: "query GetAggregatesGraph($filters: TransactionFilterInput) {\n aggregates(\n filters: $filters \n groupBy: [\"category\", \"" + groupingType + "\"]\n  fillEmptyValues: false\n ) {\n groupBy {\n category {\n id\n }\n " + groupingType + "\n }\n summary {\n sum\n }\n }\n }\n"
     });
    return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => { if(glo.debug == 1) console.log('MM-Tweaks','getMonthlySnapshotData2',filters,data.data);return data.data; }).catch((error) => { console.error(version,error); });
}

async function getMonthlySnapshotData(startDate, endDate, groupingType, inAccounts, inCat) {
    if(inAccounts == undefined) inAccounts = [];
    if(inCat == undefined || inCat == null) inCat = [];
    const filters = {startDate: startDate, endDate: endDate, ...(inCat.length > 0 && { categories: inCat }), ...(inAccounts.length > 0 && { accounts: inAccounts })};
    const options = callGraphQL({ operationName: 'GetAggregatesGraphCategoryGroup',variables: {filters: filters },
          query: "query GetAggregatesGraphCategoryGroup($filters: TransactionFilterInput) {\n aggregates(\n filters: $filters \n groupBy: [\"categoryGroup\", \"" + groupingType + "\"]\n fillEmptyValues: false\n ) {\n groupBy {\n categoryGroup {\n id\n }\n " + groupingType + "\n }\n summary {\n sum\n }\n }\n }\n"
    });
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {if(glo.debug == 1) console.log('MM-Tweaks','getMonthlySnapshotData',filters,data.data);return data.data; }).catch((error) => { console.error(version,error); });
}

async function getTransactions(startDate,endDate, offset, isPending, inAccounts, inHideReports, inNotes, inGoals, inCat) {
    const limit = 2500;
    if(inAccounts == undefined || inAccounts == null) inAccounts = [];
    if(inGoals == undefined || inGoals == null) inGoals = [];
    if(inCat == undefined || inCat == null) inCat = [];
    const filters = {startDate: startDate, endDate: endDate, hideFromReports: inHideReports, isPending: isPending, ...(inCat.length > 0 && { categories: inCat }), ...(inAccounts.length > 0 && { accounts: inAccounts }), ...(inNotes == true && {hasNotes: true}), ...(inGoals.length > 0 && { goals: inGoals })};
    const options = callGraphQL({operationName: 'GetTransactions', variables: {offset: offset, limit: limit, filters: filters},
          query: "query GetTransactions($offset: Int, $limit: Int, $filters: TransactionFilterInput) {\n allTransactions(filters: $filters) {\n totalCount\n results(offset: $offset, limit: $limit ) {\n id\n amount\n pending\n date \n hideFromReports \n merchant {\n id\n name} \n notes \n tags {\n id\n name\n color\n order\n } \n account {\n id \n name \n order} \n ownedByUser {\n id \n displayName} \n goal { \n id \n name} \n category {\n id\n name \n group {\n id\n name\n type }}}}}\n"
    });
    return fetch(graphql, options)
        .then((response) => response.json())
        .then((data) => {if(glo.debug == 1) console.log('MM-Tweaks','getTransactions',filters,data.data);return data.data;}).catch((error) => { console.error(version,error);});
}

async function getTransactionNotes(startDate,endDate) {
    const limit = 2500, offset = 0;
    const filters = {startDate: startDate, endDate: endDate, hasNotes: true};
    const options = callGraphQL({operationName: 'GetTransactions', variables: {offset: offset, limit: limit, filters: filters},
          query: "query GetTransactions($offset: Int, $limit: Int, $filters: TransactionFilterInput) {\n allTransactions(filters: $filters) {\n totalCount\n results(offset: $offset, limit: $limit ) {\n id \n notes }}}\n"
    });
    return fetch(graphql, options)
        .then((response) => response.json())
        .then((data) => {return data.data;}).catch((error) => { console.error(version,error);});
}

async function getGoals() {
    const options = callGraphQL({operationName: 'Web_GoalsV2', variables: { },
          query: "query Web_GoalsV2 {\n goalsV2 {\n id\}}\n"});
    return fetch(graphql, options)
        .then((response) => response.json())
        .then((data) => {return data.data;}).catch((error) => { console.error(version,error);});
}

async function getPortfolio(startDate,endDate,inAccounts) {
    if(inAccounts == undefined || inAccounts == null) inAccounts = [];
    const filters = {startDate: startDate, endDate: endDate, ...(inAccounts.length > 0 && { accounts: inAccounts })};
    const options = callGraphQL({"operationName":"Web_GetPortfolio","variables":{"portfolioInput": filters},
          query: "query Web_GetPortfolio($portfolioInput: PortfolioInput) {  portfolio(input: $portfolioInput) { \n aggregateHoldings { \n edges { \n node {\n id \n quantity \n basis \n totalValue \n securityPriceChangeDollars \n securityPriceChangePercent \n lastSyncedAt \n security {\n currentPrice \n currentPriceUpdatedAt } \n holdings { \n id \n type \n typeDisplay \n name \n ticker \n costBasis \n closingPrice \n closingPriceUpdatedAt \n quantity \n value \n account {\n id \n displayName \n displayBalance \n icon \n logoUrl \n includeBalanceInNetWorth \n institution { \n id \n name } type {\n name \n display } \n subtype { \n name \n display}} }}}}}}\n"});
       return fetch(graphql, options)
        .then((response) => response.json())
        .then((data) => { if(glo.debug == 1) console.log('MM-Tweaks','getPortfolio',filters,data.data);return data.data; }).catch((error) => { console.error(version,error); });
}

async function getPortfolioHolding(startDate,endDate,inAccounts) {

    const accountSums = {};
    portfolioData = await getPortfolio(startDate,endDate,inAccounts);
    portfolioData.portfolio.aggregateHoldings.edges.forEach(edge => {
        edge.node.holdings.forEach(holding => {
            const accountId = holding.account.id;
            const totalValue = holding.value;
            if (accountSums[accountId]) { accountSums[accountId] += totalValue; } else { accountSums[accountId] = totalValue; }
        });
    });
    return accountSums;
}

async function getPerformance(startDate,endDate,securityIds) {
    const filters = {startDate: startDate, endDate: endDate, securityIds: securityIds};
    const options = callGraphQL({"operationName":"Web_GetInvestmentsHoldingDrawerHistoricalPerformance","variables":{"input": filters},
    query: "query Web_GetInvestmentsHoldingDrawerHistoricalPerformance($input: SecurityHistoricalPerformanceInput!) {\n  securityHistoricalPerformance(input: $input) {\n security {\n id\n  __typename\n    }\n historicalChart {\n date\n returnPercent\n value\n __typename\n }\n __typename\n  }\n}"});
       return fetch(graphql, options)
        .then((response) => response.json())
        .then((data) => { if(glo.debug == 1) console.log('MM-Tweaks','getPerformance',filters,data.data);return data.data; }).catch((error) => { console.error(version,error); });
}

async function getDisplayBalanceAtDateData(date) {
    const options = callGraphQL({ operationName: 'Common_GetDisplayBalanceAtDate',variables: {date: date, },
          query: "query Common_GetDisplayBalanceAtDate($date: Date!) {\n accounts {\n id\n displayBalance(date: $date)\n type {\n name\n}\n }\n }\n"});
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {if(glo.debug == 1) console.log('MM-Tweaks','getDisplayBalanceAtDateData',null,data.data);return data.data; }).catch((error) => { console.error(version,error); });
}

async function getAccountsBalance(startDate) {
    const options = callGraphQL({ operationName: 'Web_GetAccountsPageRecentBalance', variables: { startDate: startDate, },
         query: "query Web_GetAccountsPageRecentBalance($startDate: Date!) {\n accounts {\n id \n recentBalances(startDate: $startDate)}}"});
   return fetch(graphql, options)
    .then((response) => response.json())
        .then((data) => { if(glo.debug == 1) console.log('MM-Tweaks','getAccountsBalance',null,data.data);return data.data; }).catch((error) => { console.error(version,error); });
}

async function getAccountsData(inID) {
    const options = callGraphQL({ operationName: 'GetAccounts',variables: { },
          query: "query GetAccounts {\n accounts {\n id\n displayName\n deactivatedAt\n isHidden\n isAsset\n isManual\n mask\n displayLastUpdatedAt\n currentBalance\n displayBalance\n limit \n dataProviderCreditLimit\n hideFromList\n hideTransactionsFromReports\n includeInNetWorth\n order\n icon\n logoUrl\n deactivatedAt \n type {\n  name\n  display\n  group\n  }\n subtype {\n name\n display\n }\n }}\n"});
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => { if(glo.debug == 1) console.log('MM-Tweaks','getAccountsData',null,data.data);return data.data; }).catch((error) => { console.error(version,error); });
}

async function refreshAccountsData() {
 const options = callGraphQL({operationName:"Common_ForceRefreshAccountsMutation",variables: { },
         query: "mutation Common_ForceRefreshAccountsMutation {\n  forceRefreshAllAccounts {\n    success\n    errors {\n      ...PayloadErrorFields\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PayloadErrorFields on PayloadError {\n  fieldErrors {\n    field\n    messages\n    __typename\n  }\n  message\n  code\n  __typename\n}"});
    return fetch(graphql, options)
    .then((response) => setCookie('MT:LastRefresh', getDates('s_FullDate')))
    .then((data) => {return data.data;}).catch((error) => { console.error(version,error); });
}

async function getCategoryData() {
    const options = callGraphQL({ operationName: 'GetCategorySelectOptions', variables: {},
          query: "query GetCategorySelectOptions {categories {\n id\n name\n order\n icon\n group {\n id\n name \n type}}}"});
    return fetch(graphql, options)
        .then((response) => response.json())
        .then((data) => {if(glo.debug == 1) console.log('MM-Tweaks','getCategoryData',null,data.data);return data.data;}).catch((error) => { console.error(version,error); });
}

async function buildCategoryGroups() {

    if(accountGroups.length == 0) {
        const categoryData = await getCategoryData();
        let isFixed = '';
        for (let i = 0; i < categoryData.categories.length; i++) {
            isFixed = getCookie('MTGroupFixed:' + categoryData.categories[i].group.id,true);
            if(isFixed == true) {glo.accountsHasFixed = true;}
            accountGroups.push({"GROUP": categoryData.categories[i].group.id, "GROUPNAME": categoryData.categories[i].group.name, "ID": categoryData.categories[i].id, "NAME": categoryData.categories[i].name, "ICON": categoryData.categories[i].icon, "TYPE": categoryData.categories[i].group.type, "ORDER": categoryData.categories[i].order, "ISFIXED": isFixed});
        }
    }
}

function rtnPendingBalance(inData) {
    let amt = 0,cnt = 0;
    inData.allTransactions.results.forEach(transaction => {
        if (transaction.amount !== 1) {
            if(transaction.category.group.type == 'expense') {amt = amt + (transaction.amount * -1);} else {amt += transaction.amount;}cnt++;}
    });
    return [amt, cnt];
}

async function rtnNoteTagList() {
    const snapshotData = await getTransactionNotes(formatQueryDate(getDates('d_Minus2Years')),formatQueryDate(getDates('d_Today')));
    let rv = [], useTag = '';
    for (let i = 0; i < snapshotData.allTransactions.results.length; i++) {
        useTag = snapshotData.allTransactions.results[i].notes;
        if(useTag.startsWith('*')) {
            useTag = getStringPart(useTag.slice(2).split('\n')[0]);
            if (!rv.includes(useTag)) {rv.push(useTag); }
        }
    }
    rv.sort();return rv;
}

function rtnCategoryGroupList(InId, InType, InAsArray) {
    let cl = '',cla = [];
    buildCategoryGroups();
    for (let i = 0; i < accountGroups.length; i++) {
        if((InType != '' && accountGroups[i].TYPE == InType) || accountGroups[i].GROUP == InId) {
            if(cl) {cl += ',';}
            cl += `\\"${accountGroups[i].ID}\\"`;cla.push(accountGroups[i].ID);
        }
    }
    if(cla.length == 0) {cl = `\\"${InId}\\"`;cla.push(InId);}
    if(InAsArray == true) {return cla;} else {return cl;}
}

function rtnCategoryGroup(InId) {
    for (let i = 0; i < accountGroups.length; i++) {if(accountGroups[i].ID == InId || accountGroups[i].GROUP == InId) {return accountGroups[i];}}
    return [null];
}
