$(document).ready(function(){

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
        return toggle.apply(this, arguments);
    };
})(jQuery);
///////////////////////////////////////////////////////////////////////////////////////////////
$("#ptl_reset").hover(function(){
			 $(this).css("background-color", "#902020");
			 }, function(){
			 $(this).css("background-color", "#cf2e2e");
	 });
$("#ptl_reset2").hover(function(){
			 $(this).css("background-color", "#902020");
       $(this).css("border-color", "#902020");
       document.getElementById("ptl_reset2").value = "Reset Form";
     }, function(){
			 $(this).css("background-color", "#557846");
       $(this).css("border-color", "#6b9658");
       document.getElementById("ptl_reset2").value = "Property Tax Lookup";
	 });
$("#ptl_lookup").hover(function(){
			 $(this).css("background-color", "#557846");
			 }, function(){
			 $(this).css("background-color", "#6b9658");
	 });

/////////////FORM VALIDATION////////////////////////////////////////////////////////////////////////////////////
$('#ptl_form').on('submit', function(e){
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
	$("#ptl_reset").click(function(){
			window.location = '/';
		 $("#ptl_data").val('');
		 $("#ptl_lookup").toggle('visibility');
	});
  $("#ptl_reset2").click(function(){
      window.location = '/';
     $("#ptl_data").val('');
     $("#ptl_lookup").toggle('visibility');
});
/////////////////////////////////////////////////////////////////////////////////////////////////

$("#ptl_data").autocomplete({
  source: "/s.php",
  minLength: 3,
  close: function( event, ui ) {
      var ev = event.originalEvent;
      if ( ev.type === "keydown" && ev.keyCode === $.ui.keyCode.ESCAPE ) {
        $( this ).val( "" );
      } else {
        show_ptl_data();
      }
    }
});

	function show_ptl_data() {
  if ($('#ptl_data').val() == "Address Not Found" || $('#ptl_data').val().length < 3) {
    $('#ptl_data').val( "" );
  } else {
  	$("#ptl_lookup").show();
  	$("#frm_ptl_reset").show();
		var ptl_data = $("#ptl_data").val();

		// ADDRESS (not used for Property Tax Lookup cURL, but should probably be displayed)
		var div1       =           Number(ptl_data.indexOf("--"));
		var distance1  =           Number(ptl_data.indexOf("--",div1+3));
		var desc_add   = "Address:" + ptl_data.substring(div1+3,distance1);
		var add        =          ptl_data.substring(div1+3,distance1).trim();
	  console.log(desc_add);

		// POSTAL CODE
		var distance2  =           Number(ptl_data.indexOf("--",distance1+3));
		var desc_pc    = "Postal Code:" + ptl_data.substring(distance1+3,distance2);
		var pc         =         ptl_data.substring(distance1+3,distance2).trim();
		$("#PC").val(pc);
		$("#PC").prop( "disabled", false );
	 console.log(desc_pc);

		// BUSINESS NAME or LAST NAME
    var distance3  =     Number(ptl_data.indexOf("--",distance2+3));
    var desc_owner = "Owner:" + ptl_data.substring(distance2+3,distance3);
		var owner      = ptl_data.substring(distance2+3,distance3).trim();
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
    var distance4  =     Number(ptl_data.indexOf("--",distance3+3));
    var desc_RollSub = "RollSub:" + ptl_data.substring(distance3+3,distance4);
		var RollSub      = ptl_data.substring(distance3+3,distance4).trim();
	  console.log(desc_RollSub);

    // CUSTOMER_NUMBER
    var desc_CustomerNumber = "Customer Number:" + ptl_data.substring(distance4+3);
		var      CustomerNumber                      = ptl_data.substring(distance4+3).trim();
		$("#CN").val(CustomerNumber);
		$("#CN").prop( "disabled", false );
    $("#ptl_lookup").focus()
		$("#ptl_lookup").select()
  console.log(desc_CustomerNumber);

  // ROLL NUMBER
  var desc_rn    = "Roll Number:" + ptl_data.substring(0,15);
  var rn         =         $("#ptl_data").val().substring(0,15) + '000000';
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
	$("#ptl_data").val(add);
	$("#ptl_data").prop( "disabled", true );
	}
}

});
