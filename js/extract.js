///// GENERAL VARIABLES ///////////
///// d1 is DATA //////////////////
var formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0
});
var formatter_currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
});
var search = jmespath.search;

var group = search(d1, "group");
console.log("group: " + group);

var region = search(d1, "region");
console.log("region: " + (region));

var property_cd = search(d1, "property_cd");
console.log("property_code: " + (property_cd));

var lot_size = search(d1, "lot_size");
console.log("lot_size: " + (lot_size));
$("#lot_size").text(lot_size);

var roll_num = search(d1, "roll_num");
console.log("roll_num: " + (roll_num.substring(0,15)));
$("#roll_num").text(roll_num.substring(0,15));

var property_address = search(d1, "property_address");
console.log("property_address: " + (property_address));
$("#property_address").text(property_address);
$("#property_address2").text(property_address);

var legal_desc = search(d1, "legal_desc");
console.log("legal_desc: " + (legal_desc));

var homo_nbhd = search(d1, "homo_nbhd");
var reg_nbhd = "Region ".concat(region).concat(", Nbhd ").concat(homo_nbhd);
console.log("reg_nbhd: " + (reg_nbhd));
$("#reg_nbhd").text(reg_nbhd);

var property_code_desc = search(d1, "property_code_desc");
var property_code_desc = property_code_desc.replace("(not on water)","")
console.log("property_code_desc: " + (property_code_desc));
$("#property_code_desc").text(property_code_desc);

var valuation = search(d1, "valuation");
console.log("valuation: " + (valuation))

var current_value_assessment = search(d1, "current_value_assessment");
console.log("current_value_assessment: " + (current_value_assessment));
$("#current_value_assessment").text(current_value_assessment);

var sale = search(d1, "sale");
console.log("sale: " + (sale));

var sale_dte = search(d1, "sale_dte");
console.log("sale_date: " + (sale_dte));
$("#sale_dte").text(sale_dte);

var sale_amt = search(d1, "sale_amt");
console.log("sale_amount: " + (sale_amt));
$("#sale_amt").text(sale_amt);

var site = search(d1, "site");
console.log("site: " + (site));

var effective_frontage = search(d1, "effective_frontage");
console.log("effective_frontage: " + (effective_frontage));
$("#effective_frontage").text(effective_frontage);

var effective_depth = search(d1, "effective_depth");
console.log("effective_depth: " + (effective_depth));
$("#effective_depth").text(effective_depth);

var effective_lot_size = search(d1, "effective_lot_size");
console.log("effective_lot_size: " + (effective_lot_size));
$("#effective_lot_size").text(effective_lot_size);

var actual_lot_size = search(d1, "actual_lot_size");
console.log("actual_lot_size: " + (actual_lot_size));
$("#actual_lot_size").text(actual_lot_size);

var structure = search(d1, "structure");
console.log("structure: " + (structure));

var valuation = search(d1, "valuation");
console.log("valuation: " + (valuation));

var actual_year_built = search(d1, "actual_year_built");
console.log("actual_year_built: " + (actual_year_built));
$("#actual_year_built").text(actual_year_built);

var total_full_storeys_cnt = search(d1, "total_full_storeys_cnt");
console.log("total_full_storeys_cnt: " + (total_full_storeys_cnt));
var tfsc = (total_full_storeys_cnt > 0) ? total_full_storeys_cnt + " Full" : "-";
$("#total_full_storeys_cnt").text(tfsc);

var total_floor_area = search(d1, "total_floor_area");
console.log("total_floor_area: " + (total_floor_area));
$("#total_floor_area").text(total_floor_area);

var total_basement_area = search(d1, "total_basement_area");
console.log("total_basement_area: " + (total_basement_area));
$("#total_basement_area").text(total_basement_area);

var finished_basement_area = search(d1, "finished_basement_area");
console.log("finished_basement_area: " + (finished_basement_area));
$("#finished_basement_area").text(finished_basement_area);

var construction_quality = search(d1, "construction_quality");
console.log("construction_quality: " + (construction_quality));
$("#construction_quality").text(construction_quality);

var central_heating_desc = search(d1, "central_heating_desc");
console.log("central_heating_desc: " + (central_heating_desc));
$("#central_heating_desc").text(central_heating_desc);

var total_full_baths_cnt = search(d1, "total_full_baths_cnt");
console.log("total_full_baths_cnt: " + (total_full_baths_cnt));
var tfbc = (total_full_baths_cnt > 0) ? total_full_baths_cnt + " Full" : "-";
$("#total_full_baths_cnt").text(tfbc);

var total_half_baths_cnt = search(d1, "total_half_baths_cnt");
console.log("total_half_baths_cnt: " + (total_half_baths_cnt));
var thbc = (total_half_baths_cnt > 0) ? total_half_baths_cnt + " Half" : "";
$("#total_half_baths_cnt").text(thbc);

var total_bedrooms_cnt = search(d1, "total_bedrooms_cnt");
console.log("total_bedrooms_cnt: " + (total_bedrooms_cnt));
$("#total_bedrooms_cnt").text(total_bedrooms_cnt);

var part_storey_desc = search(d1, "part_storey_desc");
console.log("part_storey_desc: " + (part_storey_desc));
var psd = part_storey_desc == "-" ? "" : part_storey_desc;
$("#part_storey_desc").text(psd);

var mvr_filename_desc = search(d1, "component_models.mvr[0].desc_en");
console.log("mvr_filename_desc: " + (mvr_filename_desc));

var mvr_filename = search(d1, "component_models.mvr[0].filename");
console.log("mvr_filename: " + (mvr_filename));
$("#mvr_filename").text(mvr_filename);

var lma_filename_desc = search(d1, "component_models.lma[0].desc_en");
console.log("lma_filename_desc: " + (lma_filename_desc));

var lma_filename = search(d1, "component_models.lma[0].filename");
console.log("lma_filename: " + (lma_filename));
$("#lma_filename").text(lma_filename);

var floor_area_numeric = parseFloat(total_floor_area);
var cva_numeric = current_value_assessment.replace("$","").replace(/,/g,'');
var sale_price_numeric = sale_amt.replace("$","").replace(/,/g,'');

if (Number.isInteger(floor_area_numeric)) { 
    var cvapersf = "$".concat((cva_numeric/floor_area_numeric).toFixed(0));
    console.log("cva psf floor area: " + (cvapersf));
    $("#cvapersf").text(cvapersf);
} else {
    console.log("cva psf floor area: - " );
    $("#cvapersf").text(" - ");
}

if (Number.isInteger(sale_price_numeric)) { 
    var salepersf = "$".concat((sale_price_numeric/floor_area_numeric).toFixed(0));
    console.log("sale psf floor area: " + (salepersf));
    $("#salepersf").text(salepersf); 
} else {
    console.log("sale psf floor area: - " );
    $("#salepersf").text(" - ");
}

