jQuery(document).ready(function() {
	"use strict";
	$("#recordsButton").click(showRecords);
	$("#recordsButton2").click(hideRecords);
});

function hideRecords() {
	$("#recordsButton").removeClass("hidden");
	$("#recordsButton2").addClass("hidden");
	$("#recordsWrap").slideToggle();
}


function showRecords() {
	if ($("#recordsWrap").css("display") == "none") {
		$("#loading1").show();
		$("#loading2").show();
		$("#highScoresList").html("");
		$("#recordsWrap").slideToggle();
		$("#recordsButton").addClass("hidden");
		$("#recordsButton2").removeClass("hidden");
		
		$.get("getRecords.php", function(data, status) {
			if (status === "success") {
				var records = JSON.parse(data);
				for (var i = 0; i < records.length; i++) {
					var row = records[i];
					var newLi = document.createElement("li");
					$(newLi).html(row['username'] + 
								  "&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;&nbsp;scores:&nbsp;&nbsp;" + row['score']);
					$("#highScoresList").append(newLi);	
				}
				$("#loading").hide();
			} else {
				alert("Error! Cannot load the moves data. Error type: " + status);
			}
		});

		
	}
}