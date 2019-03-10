$(document).ready(function () {
  ////////////////////////////////////////////////////////////
  'use strict';
  if (!window.console) console = {
    log: function () {}
  };
  /////////////////////////////////////////////////////////////////
  if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    }
  }
  /////////////////////////////////////////////////////////////////////
  !(function ($) {
    var toggle = $.fn.toggle;
    $.fn.toggle = function () {
      var args = $.makeArray(arguments),
        lastArg = args.pop();
      return toggle.apply(this, arguments);
    };
  })(jQuery);
  ////////////// RESET ////////////////////////////////////////////////
  $("#amp_reset").hover(function () {
    $(this).css("background-color", "#902020");
  }, function () {
    $(this).css("background-color", "#cf2e2e");
  });
  $("#amp_reset2,#amp_reset").click(function () {
    window.location = '/am/p';
    $("#ampdata").val('');
  });
  $("#amp_reset,#amp_reset2").click(function () {
    window.location = '/';
    $("#ampdata").val('');
  });
  $(".overflow").hover(function () {
    $(this).css("background-color", "#BCDFFB");
    $(this).css("border-color", "#2F7BC6");
  }, function () {
    $(this).css("background-color", "#2F7BC6");
    $(this).css("border-color", "#BCDFFB");
  });
  $("#amp_reset2").hover(function () {
    $(this).css("background-color", "#902020");
    $(this).css("border-color", "#902020");
    $(this).val("Reset Form");
  }, function () {
    //this must be amp green
    $(this).css("background-color", "#557846");
    $(this).css("border-color", "#6b9658");
    $(this).val("AboutMyProperty.ca");
  });
  $("#amp_reset2").hover(function () {
    $(this).css("background-color", "#902020");
    $(this).css("border-color", "#902020");
    $(this).val("Reset Form");
  }, function () {
    $(this).css("background-color", "#557846");
    $(this).css("border-color", "#6b9658");
    $(this).val("AboutMyProperty.ca");
  });
  ///////////// LOOKUP //////////////////////////////////////////////////
  $("#amp_lookup").hover(function () {
    $(this).css("background-color", "#557846");
  }, function () {
    $(this).css("background-color", "#6b9658");
  });
  ///////////// FORM VALIDATION /////////////////////////////////////////
  // $('#frmampshow').on('submit', function (e) {
  //   e.preventDefault();
  //   var RN_len = $('#RN').val().length;
  //   var RN_count = ($('#RN').val().match(/-/g) || []).length;
  //   var CN_len = $('#CN').val().length;
  //   var LN_len = $('#LN').val().length;
  //   var PC_len = $('#PC').val().length;
  //   if (CN_len != 7 || $('#CN').val() == "0000000") {
  //     alert("Customer Number must be 7-digits, formatted as:\n'0000000'\nPlease try again.");
  //     $("#CN").focus()
  //     $("#CN").select()
  //   } else if (LN_len < 3) {
  //     alert("Last Name or Business Name must be 3-characters minimum.\nPlease try again.");
  //     $("#LN").focus()
  //     $("#LN").select()
  //   } else if (RN_len != 28 || RN_count != 7) {
  //     alert("Roll Number must be 21-digits, formatted as:\n'00-00-00-0-000-00000-0000-00'.\nPlease try again.");
  //     $("#RN").focus()
  //     $("#RN").select()
  //   } else if (PC_len != 7) {
  //     alert("Postal Code must be formatted as:\n'M1M 1M1'\nPlease try again.");
  //     $("#PC").focus()
  //     $("#PC").select()
  //   } else {
  //     this.submit();
  //   }
  // });
  $('#frmampshow').on('submit', function (e) {
    e.preventDefault();
    var RN_len = $('#RN').val().length;
    var RN_count = ($('#RN').val().match(/-/g) || []).length;
    console.log(RN_len);
    console.log(RN_count);
    if (RN_len != 15 || RN_count != 7) {    
      if ($('#RN').val().length != 15) {
        alert("Roll Number must be 15-digits, formatted as:\n'0000-000-000-00000'.\nPlease try again.");
        $("#RN").focus()
        $("#RN").select()
      } else {
        this.submit();
      }
    }
  });

  //////////////////////////////////////////////////////////////////////////
  $("#ampdata").autocomplete({
    source: "/samp.php",
    minLength: 15,
    close: function (event, ui) {
      var ev = event.originalEvent;
      if (ev.type === "keydown" && ev.keyCode === $.ui.keyCode.ESCAPE) {
        $(this).val("");
      } else {
        //alert($('#ampdata').val().length);
        // if ( $('#ampdata').val() == "Address Not Found" || $('#ampdata').val().length != 15 ) {
        //if ( ($('#ampdata').val() != "Address Not Found") && ($('#ampdata').val().length == 15) ) {
            // alert("dont want to fire on address not found or RN != 15")
        //} else {
        //  alert("address must be found about to showampdata")
            showampdata();  
        //}

      }
    }
  });

  $("#ampdata2").autocomplete({
    source: "/samp2.php",
    minLength: 5,
    close: function (event, ui) {
      var ev = event.originalEvent;
      if (ev.type === "keydown" && ev.keyCode === $.ui.keyCode.ESCAPE) {
        $(this).val("");
      } else {         
        alert($('#ampdata2').val().length);
      }
    }
  });



  function showampdata() {
    if ($('#ampdata').val() == "Address Not Found" || $('#ampdata').val().length < 15) {
      $('#ampdata').val("");
    } else {
      $("#tblampshow").show();
      $("#frmampreset").show();
      $("#imgamp").show();      
      var ampdata = $("#ampdata").val();
      //console.log(ampdata);

      // LOCATE THE 2 -- CHARACTERS
      var div1 = Number(ampdata.indexOf("--"));
      var div2 = Number(ampdata.indexOf("--", div1 + 3));
      //console.log(div1);
      //console.log(div2);

      // ADDRESS 
      var add = ampdata.substring(div1 + 3, div2).trim();
      var desc_add = "Address:" + add;
      console.log(desc_add);
      // $("#AD").val(add);
      // $("#AD").prop("disabled", true);

      // MUNICIPALITY 
      var mun = ampdata.substring(div2 + 3).trim();
      var desc_mun = "Municipality:" + mun;
      console.log(desc_mun);
      $("#MU").val(mun);
      $("#MU").prop("disabled", true);

      
      // ROLL NUMBER
      var desc_rn = "Roll Number:" + ampdata.substring(0, 15);
      //var rn = $("#ampdata").val().substring(0, 15) + '000000';
      var rn = $("#ampdata").val().substring(0, 15);
      console.log(desc_rn);

      var rn_p1 = rn.substring(0, 2);
      var rn_p2 = rn.substring(2, 4);
      var rn_p3 = rn.substring(4, 6);
      var rn_p4 = rn.substring(6, 7);
      var rn_p5 = rn.substring(7, 10);
      var rn_p6 = rn.substring(10, 15);
      var rn_p7 = rn.substring(15, 19);
      var rn_p8 = rn.substring(19, 21);

      //what format will amp require?
      //this format is for toronto property tax lookup
      //var rnxx = rn_p1.concat("-", rn_p2, "-", rn_p3, "-", rn_p4, "-", rn_p5, "-", rn_p6, "-", rn_p7, "-", rn_p8);
      //var rnxx = rn.slice(0, -1).concat(RollSub);
      //var desc_rn = "Roll Number:" + rn;      

      $("#RN").val(rn);
//      $("#RN").prop("disabled", true);

      // display address in search box
      $("#ampdata").val(add);
      $("#ampdata").prop("disabled", true);
    }
  }

    $("#tblampfind form").submit(function( event ) {
        alert("Roll Number must be 15-digits, formatted as:\n'000000000000000'.\nPlease try again.");
        return false;
    });

      $( "#tabs" ).tabs({
        collapsible: true
      });


// Restricts input for the given textbox to the given inputFilter.
// function setInputFilter(textbox, inputFilter) {
//   ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
//     textbox.addEventListener(event, function() {
//       if (inputFilter(this.value)) {
//         this.oldValue = this.value;
//         this.oldSelectionStart = this.selectionStart;
//         this.oldSelectionEnd = this.selectionEnd;
//       } else if (this.hasOwnProperty("oldValue")) {
//         this.value = this.oldValue;
//         this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
//       }
//     });
//   });
// }

// // Install input filters.
//   setInputFilter(document.getElementById("ampdata"), function(value) {
//     return /^\d*$/.test(value); });
  
//  Request URL: https://aboutmyproperty.ca/property/json/190402445002600/poi



});
