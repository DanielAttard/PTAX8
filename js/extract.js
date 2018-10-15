///// GENERAL VARIABLES ///////////
///// d1 is Property Tax Lookup PTL
///// d2 is MPAC Disclosure MD
var formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0
});
var formatter_currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
});
var search = jmespath.search;

///////////////// THIS SECTION IS MPAC DISCLOSURE ///////////////////
var arr = [];
var arrayLength = d2.length;
console.log (arrayLength);

for (var i = 0; i < arrayLength; i++) {
    var DiscdisplayName = search(d2[i], "displayName").replace('Level','L').replace('"',' ');
    console.log("Disclosure Type: " + JSON.stringify(DiscdisplayName).replace('Level','L').replace('"',' ')); 
    var DiscUrl = search(d2[i], "url");
    console.log("Disclosure Url: " + JSON.stringify(DiscUrl));
    $("#frmmdreset2").append("<input type='button' class='overflow' onclick=\"window.open('" 
    + JSON.stringify(DiscUrl).replace(/"/g,"") + "')\" id='mpacdisc" + i + "' value='" 
    + JSON.stringify(DiscdisplayName).replace(/"/g,"") + "' /> ").append("<br><br>");  
};

// class="overflow ellipsis"
// class='overflow ellipsis'

///////////////// THIS SECTION IS PROPERTY TAX LOOKUP ///////////////////
///////////////////////////// ACCOUNT DETAILS  /////////////
var Type1 = search(d1, "ServiceAccount[].Type");
console.log("Type: " + Type1);
var ROLL_NUMBER = search(d1, "ServiceAccount[].ID[].body");
console.log("Roll Number: " + (ROLL_NUMBER));
var AccountNumber = search(d1, "ServiceAccount[].AccountNumber");
console.log("AccountNumber: " + (AccountNumber));
$("#t_an").text(AccountNumber);
var StreetName = search(d1, "ServiceAccount[].AccountServiceLocations[].Address[].StreetName");
console.log("StreetName: " + (StreetName));
$("#t_sn").text(StreetName);
var LastName = search(d1, "ServiceAccount[].AccountParty[].Party[].PersonalName[].LastName");
console.log("LastName: " + (LastName));
$("#t_ln").text(LastName);
var AmountDue = search(d1, "ServiceAccount[].AmountDue");
console.log("AmountDue: " + (formatter.format(AmountDue)));
$("#t_ad").text(formatter_currency.format(AmountDue));

/////////////////////// TOTAL 2018 PHASE-IN ////////////
var x = search(d1, "ServiceAccount[].FinancialDocument[? Title=='CVA' && BillingCycle=='2018'].TotalAmount");
var x2 = formatter.format(parseFloat(x).toFixed(0));
$("#t_cvatot18").text(x2);
console.log("18 Total Phase-In CVA: " + (x2));

/////////////////////// PHASE-INs ////////////////////
//2018 Phase-In by class
var x3 = search(d1, 'ServiceAccount[].FinancialDocument[0].AmountLineItem[].body[]').map(formatter.format);
var y = "";
function fnSeparateLines(value) {
    'use strict';
    y = y + value + "<br>";
}
x3.forEach(fnSeparateLines);

$("#t_cva18").html(y);
console.log("18 Phase-In CVA: " + (y));

//2018 Phase-In Type by class ////////////
var x4 = search(d1, 'ServiceAccount[].FinancialDocument[0].AmountLineItem[].AmountType[]');
console.log("18 Phase-In Type: " + (x4));

/////////////////////// TOTAL 16CVA /////////////
var x5 = search(d1, "sum(ServiceAccount[].FinancialDocument[1].AmountLineItem[].body[] | [].to_number(@))");
var x6 = formatter.format(parseFloat(x5));
$("#t_cvatotal").text(x6);
console.log("18 Total CVA: " + (x6));

/////////////////////// CVAs ////////////////////////////////
//2018 CVA_FULL by class
var x7 = search(d1, 'ServiceAccount[].FinancialDocument[1].AmountLineItem[].body[]').map(formatter.format);
var y2 = "";
function fnSeparateLines_t_cva(value) {
    'use strict';
    y2 = y2 + value + "<br>";
}
x7.forEach(fnSeparateLines_t_cva);
$("#t_cva20").html(y2);
console.log("18 CVA: " + (y2));

//2018 CVA_FULL Type by class
var x8 = search(d1, 'ServiceAccount[].FinancialDocument[1].AmountLineItem[].AmountType[]');
var y3 = JSON.stringify(x8).replace("[", "").replace("]", "").replace(/"/g, '').replace(',', '\n');
$("#t_cvatype").html(y3);
console.log("18 CVA Type: " + (y3));


/////////////////////// BILLED TAXES 2016 2017 2018 ////////////
var x9 = search(d1, "sum(ServiceAccount[].FinancialDocument[? BillingCycle=='2016' && Title=='PROPERTY_BILLING'].TotalAmount | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
var x10 = formatter_currency.format(parseFloat(x9.replace(",", "")).toFixed(2));
$("#t_16tax").text(x10);
console.log("16 Billed Taxes: " + (x10));

var x11 = search(d1, "sum(ServiceAccount[].FinancialDocument[? BillingCycle=='2017' && Title=='PROPERTY_BILLING'].TotalAmount | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
var x12 = formatter_currency.format(parseFloat(x11.replace(",", "")).toFixed(2));
$("#t_17tax").text(x12);
console.log("17 Billed Taxes: " + (x12));

var x13 = search(d1, "sum(ServiceAccount[].FinancialDocument[? BillingCycle=='2018' && Title=='PROPERTY_BILLING'].TotalAmount | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
var x14 = formatter_currency.format(parseFloat(x13.replace(",", "")).toFixed(2));
$("#t_18tax").text(x14);
console.log("18 Billed Taxes: " + (x14));

//16,17,18 Total Taxes = Bill + Omit + Supp 
var bt = search(d1, "sum(ServiceAccount[].FinancialDocument[? Title=='PROPERTY_BILLING'].TotalAmount | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
var sb = search(d1, "sum(ServiceAccount[].FinancialDocument[? Title=='SUPP_BILLING'].TotalAmount | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
var ob = search(d1, "sum(ServiceAccount[].FinancialDocument[? Title=='OMIT_BILLING'].TotalAmount | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

 var btv = parseFloat(bt.replace( /,/g, ''));
 var sbv = parseFloat(sb.replace( /,/g, ''));
 var obv = parseFloat(ob.replace( /,/g, ''));
 var ttv = btv + sbv + obv;

var bt2 = formatter_currency.format(parseFloat(bt.replace(",", "")).toFixed(2));
var sb2 = formatter_currency.format(parseFloat(sb.replace(",", "")).toFixed(2));
var ob2 = formatter_currency.format(parseFloat(ob.replace(",", "")).toFixed(2));
var tt2 = formatter_currency.format(parseFloat(ttv).toFixed(2));
console.log("16,17,18 Bill Taxes: " + (bt2));
console.log("16,17,18 Supp Taxes: " + (sb2));
console.log("16,17,18 Omit Taxes: " + (ob2));
console.log("16,17,18 Total Taxes: " + (tt2));
$("#t_161718tax").text(tt2);

/////////////////////// PAID TAXES 2016 2017 2018 ///////////
//Payment History Cheque phc
var a = [];
var b = search(d1, "ServiceAccount[].FinancialDocument[? Title=='PAYMENT_HISTORY' && DocumentType=='PAYMENT_HISTORY' && Description=='Cheque Payment'].TotalAmount");

b.forEach(function (array) {
    'use strict';
    array.forEach(function (element) {
        a.push(element.replace("$", "").replace(",", ""));
    });
});

var phc = search(a, "sum([] | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
var phc2 = formatter_currency.format(parseFloat(phc.replace(",", "")).toFixed(2));
$("#t_phc").text(phc2);
console.log("Payments (Cheque): " + (phc2));

//Payment History Bank phb
var a2 = [];
var b2 = search(d1, "ServiceAccount[].FinancialDocument[? Title=='PAYMENT_HISTORY' && DocumentType=='PAYMENT_HISTORY' && Description=='Bank Payment'].TotalAmount");
b2.forEach(function (array) {
    'use strict';
    array.forEach(function (element) {
        a2.push(element.replace("$", "").replace(",", ""));
    });
});

var phb = search(a2, "sum([] | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
var phb2 = formatter_currency.format(parseFloat(phb.replace(",", "")).toFixed(2));
$("#t_phb").text(phb2);
console.log("Payments (Bank): " + (phb2));

//Payment History - Pre-Authorized Payment pap
var a3 = [];
var b3 = search(d1, "ServiceAccount[].FinancialDocument[? Title=='PAYMENT_HISTORY' && DocumentType=='PAYMENT_HISTORY' && Description=='Pre-Authorized Payment'].TotalAmount");
b3.forEach(function (array) {
    'use strict';
    array.forEach(function (element) {
        a3.push(element.replace("$", "").replace(",", ""));
    });
});
var pap = search(a3, "sum([] | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
var pap2 = formatter_currency.format(parseFloat(pap.replace(",", "")).toFixed(2));
$("#t_pap").text(pap2);
console.log("Payments (Pre-Authorized): " + (pap2));

//Payment History Appeals pha  -  This is just a placeholder
var a4 = [];
var b4 = search(d1, "ServiceAccount[].FinancialDocument[? Title=='PAYMENT_HISTORY' && DocumentType=='PAYMENT_HISTORY' && Description=='Appeal'].TotalAmount");
b4.forEach(function (array) {
    'use strict';
    array.forEach(function (element) {
        a4.push(element.replace("$", "").replace(",", ""));
    });
});
var pha = search(a4, "sum([] | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
var pha2 = formatter_currency.format(parseFloat(pha.replace(",", "")).toFixed(2));
$("#t_pha").text(pha2);
console.log("Payments (Appeal): " + (pha2));

//Payment History Total pht
var a5 = [];
var b5 = search(d1, "ServiceAccount[].FinancialDocument[? Title=='PAYMENT_HISTORY' && DocumentType=='PAYMENT_HISTORY' ].TotalAmount");

b5.forEach(function (array) {
    'use strict';
    array.forEach(function (element) {
        a5.push(element.replace("$", "").replace(",", ""));
    });
});
var pht = search(a5, "sum([] | [].to_number(@))").toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
var pht2 = formatter_currency.format(parseFloat(pht.replace(",", "")).toFixed(2));
$("#t_pht").text(pht2);
console.log("Payments (Total): " + pht2);

/////////////////////// APPEALS ////////////////////////////////
// 2018
var x15 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2018' && Title=='APPEAL'].FinacialDocumentID[]");
// $("#t_fd18").text((x15.length > 0 ? x : "-"));
if (x15.length > 0) {
    $("#t_fd18").text(x15);
} else {
    $("#t_fd18").text('-');
}
console.log("18 Appeal FinacialDocumentID: " + (x15));

var x16 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2018' && Title=='APPEAL'].DocumentType[]");
if (x16.length > 0) {
    $("#t_dt18").text(x16);
} else {
    $("#t_dt18").text('-');
}
console.log("18 Appeal DocumentType: " + (x16));

var x17 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2018' && Title=='APPEAL'].Description[]");
if (x17.length > 0) {
    $("#t_d18").text(x17);
} else {
    $("#t_d18").text('-');
}
console.log("18 Appeal Description: " + (x17));

var x19 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2018' && Title=='APPEAL'].PaymentStatus[]");
if (x19.length > 0) {
    $("#t_ps18").text(x19);
} else {
    $("#t_ps18").text('-');
}
console.log("18 Appeal PaymentStatus: " + (x19));

// 2017
var x20 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2017' && Title=='APPEAL'].FinacialDocumentID[]");
if (x20.length > 0) {
    $("#t_fd17").text(x20);
} else {
    $("#t_fd17").text('-');
}
console.log("17 Appeal FinacialDocumentID: " + (x20));

var x21 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2017' && Title=='APPEAL'].DocumentType[]");
if (x21.length > 0) {
    $("#t_dt17").text(x21);
} else {
    $("#t_dt17").text('-');
}
console.log("17 Appeal DocumentType: " + (x21));

var x22 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2017' && Title=='APPEAL'].Description[]");
if (x22.length > 0) {
    $("#t_d17").text(x22);
} else {
    $("#t_d17").text('-');
}
console.log("17 Appeal Description: " + (x22));

var x23 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2017' && Title=='APPEAL'].PaymentStatus[]");
if (x23.length > 0) {
    $("#t_ps17").text(x23);
} else {
    $("#t_ps17").text('-');
}
console.log("17 Appeal PaymentStatus: " + (x23));

// 2016
var x24 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2016' && Title=='APPEAL'].FinacialDocumentID[]");
if (x24.length > 0) {
    $("#t_fd16").text(x24);
} else {
    $("#t_fd16").text('-');
}
console.log("16 Appeal FinacialDocumentID: " + (x24));

var x25 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2016' && Title=='APPEAL'].DocumentType[]");
if (x25.length > 0) {
    $("#t_dt16").text(x25);
} else {
    $("#t_dt16").text('-');
}
console.log("16 Appeal DocumentType: " + (x25));

var x26 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2016' && Title=='APPEAL'].Description[]");
if (x26.length > 0) {
    $("#t_d16").text(x26);
} else {
    $("#t_d16").text('-');
}
console.log("16 Appeal Description: " + (x26));


var x27 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2016' && Title=='APPEAL'].PaymentStatus[]");
if (x27.length > 0) {
    $("#t_ps16").text(x27);
} else {
    $("#t_ps16").text('-');
}
console.log("16 Appeal PaymentStatus: " + (x27));

// 2015
var x28 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2015' && Title=='APPEAL'].FinacialDocumentID[]");
if (x28.length > 0) {
    $("#t_fd15").text(x28);
} else {
    $("#t_fd15").text('-');
}
console.log("15 Appeal FinacialDocumentID: " + (x28));

var x29 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2015' && Title=='APPEAL'].DocumentType[]");
if (x29.length > 0) {
    $("#t_dt15").text(x29);
} else {
    $("#t_dt15").text('-');
}
console.log("15 Appeal DocumentType: " + (x29));

var x30 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2015' && Title=='APPEAL'].Description[]");
if (x30.length > 0) {
    $("#t_d15").text(x30);
} else {
    $("#t_d15").text('-');
}
console.log("15 Appeal Description: " + (x30));

var x31 = search(d1, "ServiceAccount[].FinancialDocument[? BillingCycle=='2015' && Title=='APPEAL'].PaymentStatus[]");
if (x31.length > 0) {
    $("#t_ps15").text(x31);
} else {
    $("#t_ps15").text('-');
}
console.log("15 Appeal PaymentStatus: " + (x31));

/////////////////////// BILLING ATTRIBUTES ////////////////
// PAYMENT PROGRAM
var x32 = search(d1, "ServiceAccount[].Attribute[? Key=='PAYMENT_PROGRAM'].body[]");
$("#t_pm").text(x32);
console.log("PAYMENT_PROGRAM: " + (x32));

// EPOST_STATUS
var x33 = search(d1, "ServiceAccount[].Attribute[? Key=='EPOST_STATUS'].body[]");
$("#t_ep").text(x33);
console.log("EPOST_STATUS: " + (x33));

// LAST_PAYMENT
var x34 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='LAST_PAYMENT'].body[]"));
$("#t_lp").text(x34);
console.log("LAST_PAYMENT: " + (x34));

// LAST_PAYMENT_DATE
var x35 = search(d1, "ServiceAccount[].Attribute[? Key=='LAST_PAYMENT_DATE'].body[]");
$("#t_lpd").text(x35);
console.log("LAST_PAYMENT_DATE: " + (x35));

// NEXT_PAYMENT
var x36 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='NEXT_PAYMENT'].body[]"));
$("#t_np").text(x36);
console.log("NEXT_PAYMENT: " + (x36));

// NEXT_PAYMENT_DATE
var x37 = search(d1, "ServiceAccount[].Attribute[? Key=='NEXT_PAYMENT_DATE'].body[]");
$("#t_npd").text(x37);
console.log("NEXT_PAYMENT_DATE: " + (x37));

/////////////////////////////////////////////

// INTERIM_BILLING_TOTAL
var x38 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='INTERIM_BILLING_TOTAL'].body[]"));
$("#t_ib").text(x38);
console.log("INTERIM_BILLING_TOTAL: " + (x38));

// FINAL_BILLING_TOTAL
var x39 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='FINAL_BILLING_TOTAL'].body[]"));
$("#t_fb").text(x39);
console.log("FINAL_BILLING_TOTAL: " + (x39));

// PROPERTY_BILLING_TOTAL
var x40 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='PROPERTY_BILLING_TOTAL'].body[]"));
$("#t_pb").text(x40);
console.log("PROPERTY_BILLING_TOTAL: " + (x40));

// SUPPLEMENTARY_BILLING_TOTAL
var x41 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='SUPPLEMENTARY_BILLING_TOTAL'].body[]"));
$("#t_sb").text(x41);
console.log("SUPPLEMENTARY_BILLING_TOTAL: " + (x41));

// OMIT_BILLING_TOTAL
var x42 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='OMIT_BILLING_TOTAL'].body[]"));
$("#t_ob").text(x42);
console.log("OMIT_BILLING_TOTAL: " + (x42));

// OTHER_BILLING_TOTAL
var x43 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='OTHER_BILLING_TOTAL'].body[]"));
$("#t_otb").text(x43);
console.log("OTHER_BILLING_TOTAL: " + (x43));

// OTHER_CHARGES_TOTAL
var x44 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='OTHER_CHARGES_TOTAL'].body[]"));
$("#t_otc").text(x44);
console.log("OTHER_CHARGES_TOTAL: " + (x44));

// BILLED_AMOUNT_TOTAL
var x45 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='BILLED_AMOUNT_TOTAL'].body[]"));
$("#t_ba").text(x45);
$("#t_18tax").text(x45);
console.log("BILLED_AMOUNT_TOTAL: " + (x45));

// DEFERRAL_NOTE
var x46 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='DEFERRAL_NOTE'].body[]"));
$("#t_dn").text(x46);
console.log("DEFERRAL_NOTE: " + (x46));

// INTERIM_BILLING_TOTAL_P1
var x47 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='INTERIM_BILLING_TOTAL_P1'].body[]"));
$("#t_ib1").text(x47);
console.log("INTERIM_BILLING_TOTAL_P1: " + (x47));

// FINAL_BILLING_TOTAL_P1
var x48 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='FINAL_BILLING_TOTAL_P1'].body[]"));
$("#t_fb1").text(x48);
console.log("FINAL_BILLING_TOTAL_P1: " + (x48));

// PROPERTY_BILLING_TOTAL_P1
var x49 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='PROPERTY_BILLING_TOTAL_P1'].body[]"));
$("#t_pb1").text(x49);
console.log("PROPERTY_BILLING_TOTAL_P1: " + (x49));

// SUPPLEMENTARY_BILLING_TOTAL_P1
var x50 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='SUPPLEMENTARY_BILLING_TOTAL_P1'].body[]"));
$("#t_sb1").text(x50);
console.log("SUPPLEMENTARY_BILLING_TOTAL_P1: " + (x50));

// OMIT_BILLING_TOTAL_P1
var x51 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='OMIT_BILLING_TOTAL_P1'].body[]"));
$("#t_ob1").text(x51);
console.log("OMIT_BILLING_TOTAL_P1: " + (x51));

// OTHER_BILLING_TOTAL_P1
var x52 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='OTHER_BILLING_TOTAL_P1'].body[]"));
$("#t_otb1").text(x52);
console.log("OTHER_BILLING_TOTAL_P1: " + (x52));

// OTHER_CHARGES_TOTAL_P1
var x53 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='OTHER_CHARGES_TOTAL_P1'].body[]"));
$("#t_otc1").text(x53);
console.log("OTHER_CHARGES_TOTAL_P1: " + (x53));

// BILLED_AMOUNT_TOTAL_P1
var x54 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='BILLED_AMOUNT_TOTAL_P1'].body[]"));
$("#t_ba1").text(x54);
$("#t_17tax").text(x54);
console.log("BILLED_AMOUNT_TOTAL_P1: " + (x54));

// INTERIM_BILLING_TOTAL_P2
var x55 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='INTERIM_BILLING_TOTAL_P2'].body[]"));
$("#t_ib2").text(x55);
console.log("INTERIM_BILLING_TOTAL_P2: " + (x55));

// FINAL_BILLING_TOTAL_P2
var x56 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='FINAL_BILLING_TOTAL_P2'].body[]"));
$("#t_fb2").text(x56);
console.log("FINAL_BILLING_TOTAL_P2: " + (x56));

// PROPERTY_BILLING_TOTAL_P2
var x57 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='PROPERTY_BILLING_TOTAL_P2'].body[]"));
$("#t_pb2").text(x57);
console.log("PROPERTY_BILLING_TOTAL_P2: " + (x57));

// SUPPLEMENTARY_BILLING_TOTAL_P2
var x58 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='SUPPLEMENTARY_BILLING_TOTAL_P2'].body[]"));
$("#t_sb2").text(x58);
console.log("SUPPLEMENTARY_BILLING_TOTAL_P2: " + (x58));

// OMIT_BILLING_TOTAL_P2
var x59 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='OMIT_BILLING_TOTAL_P2'].body[]"));
$("#t_ob2").text(x59);
console.log("OMIT_BILLING_TOTAL_P2: " + (x59));

// OTHER_BILLING_TOTAL_P2
var x60 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='OTHER_BILLING_TOTAL_P2'].body[]"));
$("#t_otb2").text(x60);
console.log("OTHER_BILLING_TOTAL_P2: " + (x60));

// OTHER_CHARGES_TOTAL_P2
var x61 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='OTHER_CHARGES_TOTAL_P2'].body[]"));
$("#t_otc2").text(x61);
console.log("OTHER_CHARGES_TOTAL_P2: " + (x61));

// BILLED_AMOUNT_TOTAL_P2
var x62 = formatter_currency.format(search(d1, "ServiceAccount[].Attribute[? Key=='BILLED_AMOUNT_TOTAL_P2'].body[]"));
$("#t_ba2").text(x62);
$("#t_16tax").text(x62);
console.log("BILLED_AMOUNT_TOTAL_P2: " + (x62));

// VALID_YEARS
var x63 = search(d1, "ServiceAccount[].Attribute[? Key=='VALID_YEARS'].body[]");
$("#t_vy").text(x63);
console.log("VALID_YEARS: " + (x63));

// ACCOUNT_MESSAGE
var x64 = search(d1, "ServiceAccount[].Attribute[? Key=='ACCOUNT_MESSAGE'].body[]");
$("#t_am").text(x64);
console.log("ACCOUNT_MESSAGE: " + (x64));

// OVERDUE_CREDIT_BOX_TITLE
var x65 = search(d1, "ServiceAccount[].Attribute[? Key=='OVERDUE_CREDIT_BOX_TITLE'].body[]");
if (x65.length > 0) {
    $("#t_oc").text(x65);
} else {
    $("#t_oc").text('-');
}
console.log("OVERDUE_CREDIT_BOX_TITLE: " + (x65));

// OVERDUE_CREDIT_BOX_CONTENT
var x66 = search(d1, "ServiceAccount[].Attribute[? Key=='OVERDUE_CREDIT_BOX_CONTENT'].body[]");
if (x66.length > 0) {
    $("#t_occ").html(x66);
} else {
    $("#t_occ").html('-');
}
console.log("OVERDUE_CREDIT_BOX_CONTENT: " + (x66));

var x67 = "";
var PhaseIn2018 = search(d1, 'ServiceAccount[].FinancialDocument[0].AmountLineItem[].body[]');
function fnSeparateLinesx2(value) {
    'use strict';
    x67 = x67 + value + "<br>";
}
PhaseIn2018.forEach(fnSeparateLinesx2);

var x68 = "";
var PhaseIn2020 = search(d1, 'ServiceAccount[].FinancialDocument[1].AmountLineItem[].body[]');
function fnSeparateLinesx3(value) {
    'use strict';
    x68 = x68 + value + "<br>";
}
PhaseIn2020.forEach(fnSeparateLinesx3);

var PhaseIn2017 = [], PhaseIn2019 = [], Destination = [], peryear = [];
$.each(PhaseIn2018, function (index, value) {
    'use strict';
    Destination = PhaseIn2020[index];
    peryear = (Destination - value) / 2;
    PhaseIn2017[index] = parseInt(value) - parseInt(peryear);
    PhaseIn2019[index] = parseInt(value) + parseInt(peryear);
});


/////////////////////// 2017 PHASE-IN ///////////////////////////////
var pi, z = "";
function fnSeparateLinesPI17(value) {
    'use strict';
    pi = new Intl.NumberFormat().format(value);
    z = z + pi + "<br>";
}
PhaseIn2017.forEach(fnSeparateLinesPI17);
$("#t_cva17").html(z);
console.log("2017 Phase-In CVA: " + (z));
var x69 = new Intl.NumberFormat().format(PhaseIn2017.reduce(function (a, b) {
    'use strict';
    return a + b;
}, 0));
$("#t_cvatot17").html(x69);
console.log("2017 Total Phase-In CVA: " + (x69));

/////////////////////// 2019 PHASE-IN ///////////////////////////////
var x70 = "";
function fnSeparateLinesPI19(value) {
    'use strict';
    pi = new Intl.NumberFormat().format(value);
    x70 = x70 + pi + "<br>";
}
PhaseIn2019.forEach(fnSeparateLinesPI19);
$("#t_cva19").html(x70);
console.log("2019 Phase-In CVA: " + (x70));

var x71 = new Intl.NumberFormat().format(PhaseIn2019.reduce(function (a, b) {
    'use strict';
    return a + b;
}, 0));
$("#t_cvatot19").html(x71);
console.log("2019 Total Phase-In CVA: " + (x71));
