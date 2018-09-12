$(document).ready(function(){

// SAMPLE TAX BILL DATA
// 190403361006250  000002  L4L1N6  1689522 1234 st
// 190405228006400  000000  M5R1G2  5438445 94A scollard
// 190411106001900  000002  M6C1R2  4772549 204 st clair
// 190406743005300  000003  L5H2J1  4175378 124 harbord
// 190411446004300  000003  M5N1B4  2017173 524 eglinton
// 190801331000810  000006  M9L2Z5  3342381 50 high meadow
// 190407424001400  000001  M4X1P3  1880094 529 parliament
// 190404408015400  000006  M6B3N1  4611370 654 college
// 190103261001600  000005  M1R3E4  3914395 76 howden not working?
// 190409302014600  000001  M4L1H5  1942353 1906 queen
// 190401264006200  000005  M2K2Y2  1637603 514 annette
// 190601325000500  000000                  1121 A-1121 OCONNOR DR

////////////////////////////////////////////////////////////
'use strict';
if (!window.console) console = {log: function() {}};
/////////////////////////////////////////////////////////////////
  if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    }
  }
/////////////////////////////////////////////////////////////////////////////////////////////////
!(function($) {
    var toggle = $.fn.toggle;
    $.fn.toggle = function() {
        var args = $.makeArray(arguments),
            lastArg = args.pop();

        // if (lastArg == 'visibility') {
        //     return this.visibilityToggle();
        // }

        return toggle.apply(this, arguments);
    };
})(jQuery);
///////////////////////////////////////////////////////////////////////////////////////////////
$("#reset").hover(function(){
			 $(this).css("background-color", "#902020");
			 }, function(){
			 $(this).css("background-color", "#cf2e2e");
	 });
$("#reset2").hover(function(){
			 $(this).css("background-color", "#902020");
       $(this).css("border-color", "#902020");
       document.getElementById("reset2").value = "Reset Form";
     }, function(){
			 $(this).css("background-color", "#557846");
       $(this).css("border-color", "#6b9658");
       document.getElementById("reset2").value = "Property Tax Lookup";
	 });
$("#lookup").hover(function(){
			 $(this).css("background-color", "#557846");
			 }, function(){
			 $(this).css("background-color", "#6b9658");
	 });

/////////////FORM VALIDATION////////////////////////////////////////////////////////////////////////////////////
$('#form').on('submit', function(e){
		e.preventDefault();
		var RN_len   = $('#RN').val().length;
		var RN_count = ($('#RN').val().match(/-/g) || []).length;
		var CN_len = $('#CN').val().length;
		var LN_len = $('#LN').val().length;
		var PC_len = $('#PC').val().length;

		if (CN_len != 7 || $('#CN').val() == "0000000") {
			alert("Customer Number must be 7-digits, formatted as:\n'0000000'\nPlease try again.");
			$("#CN").focus()
			$("#CN").select()
		} else if (LN_len < 3) {
			alert("Last Name or Business Name must be 3-characters minimum.\nPlease try again.");
			$("#LN").focus()
			$("#LN").select()
		} else if (RN_len != 28  || RN_count != 7) {
			alert("Roll Number must be 21-digits, formatted as:\n'00-00-00-0-000-00000-0000-00'.\nPlease try again.");
			$("#RN").focus()
			$("#RN").select()
		} else if (PC_len != 7) {
			alert("Postal Code must be formatted as:\n'M1M 1M1'\nPlease try again.");
			$("#PC").focus()
			$("#PC").select()
		} else {
			this.submit();
		}
});
/////////////////////////////////////////////////////////////////////////////////////////////////
	$("#reset").click(function(){
			window.location = '/';
		 $("#allData").val('');
		 $("#lookup").toggle('visibility');
	});
  $("#reset2").click(function(){
      window.location = '/';
     $("#allData").val('');
     $("#lookup").toggle('visibility');
});
/////////////////////////////////////////////////////////////////////////////////////////////////

$("#allData").autocomplete({
  source: "/s.php",
  minLength: 3,
  close: function( event, ui ) {
      var ev = event.originalEvent;
      if ( ev.type === "keydown" && ev.keyCode === $.ui.keyCode.ESCAPE ) {
        $( this ).val( "" );
      } else {
        showData();
      }
    }
});

	function showData() {
  if ($('#allData').val() == "Address Not Found" || $('#allData').val().length < 3) {
    $('#allData').val( "" );
  } else {
  	$("#Lookup").show();
  	$("#frmReset").show();
		var allData = $("#allData").val();

		// ADDRESS (not used for Property Tax Lookup cURL, but should probably be displayed)
		var div1       =           Number(allData.indexOf("--"));
		var distance1  =           Number(allData.indexOf("--",div1+3));
		var desc_add   = "Address:" + allData.substring(div1+3,distance1);
		var add        =          allData.substring(div1+3,distance1).trim();
	  console.log(desc_add);

		// POSTAL CODE
		var distance2  =           Number(allData.indexOf("--",distance1+3));
		var desc_pc    = "Postal Code:" + allData.substring(distance1+3,distance2);
		var pc         =         allData.substring(distance1+3,distance2).trim();
		$("#PC").val(pc);
		$("#PC").prop( "disabled", false );
	 console.log(desc_pc);

		// BUSINESS NAME or LAST NAME
    var distance3  =     Number(allData.indexOf("--",distance2+3));
    var desc_owner = "Owner:" + allData.substring(distance2+3,distance3);
		var owner      = allData.substring(distance2+3,distance3).trim();
    //identify personal names and grab the last name only
    //var inc_co_ltd = owner.indexOf("Inc");
    if ( owner.match( /(Inc|Corp|Ltd|Limited|Company)/ ) ) {
      /* Found - use all*/
      $("#LN").val(owner);
    } else {
      /* Not Found - use last string*/
      var n = owner.split(" ");
      $("#LN").val(n[n.length - 1]);
    }

		$("#LN").prop( "disabled", false );
	  console.log(desc_owner);

    // ROLLSUB
    var distance4  =     Number(allData.indexOf("--",distance3+3));
    var desc_RollSub = "RollSub:" + allData.substring(distance3+3,distance4);
		var RollSub      = allData.substring(distance3+3,distance4).trim();
	  console.log(desc_RollSub);

    // CUSTOMER_NUMBER
    var desc_CustomerNumber = "Customer Number:" + allData.substring(distance4+3);
		var      CustomerNumber                      = allData.substring(distance4+3).trim();
		$("#CN").val(CustomerNumber);
		$("#CN").prop( "disabled", false );
    $("#lookup").focus()
		$("#lookup").select()
  console.log(desc_CustomerNumber);

  // ROLL NUMBER
  var desc_rn    = "Roll Number:" + allData.substring(0,15);
  var rn         =         $("#allData").val().substring(0,15) + '000000';
  var rn_p1         =         rn.substring(0,2);
  var rn_p2         =         rn.substring(2,4);
  var rn_p3         =         rn.substring(4,6);
  var rn_p4         =         rn.substring(6,7);
  var rn_p5         =         rn.substring(7,10);
  var rn_p6         =         rn.substring(10,15);
  var rn_p7         =         rn.substring(15,19);
  var rn_p8         =         rn.substring(19,21);

  var rn = rn_p1.concat("-", rn_p2, "-", rn_p3, "-", rn_p4, "-", rn_p5, "-", rn_p6, "-", rn_p7, "-", rn_p8);
  var rn = rn.slice(0, -1).concat(RollSub);
  $("#RN").val(rn);
  $("#RN").prop( "disabled", false );

  // display address in search box
	$("#allData").val(add);
	$("#allData").prop( "disabled", true );
	}
}

});
