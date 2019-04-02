
(function() {
    'use strict';
    
	
    var empty = ["0_0", "0_1", "0_2", "0_3", "1_0", "1_1", "1_2", "1_3", 
				 "2_0", "2_1", "2_2", "2_3", "3_0", "3_1", "3_2", "3_3"];
	var num = [2, 4, 8, 16, 
			   32, 64, 128, 256, 
			   512, 1024, 2048, 4096, 
			   8192, 16384, 32768, 65536, 
			   131072];
	
	var color = ["#ffe6cc", "#ffd9b3", "#ffa64d", "#ff8000",
				 "#ffa366", "#ff751a", "#ffe680", "#ffdb4d",
				 "#e6b800", "#aaff80", "#4ce600", "#ff9999",
				 "#ff4d4d", "#99ffeb", "#80e5ff", "#33d6ff",
				 "#00a3cc"];
	
	var loggedIn = false;
    var username;
	
    var $ = function(id) {
        return document.getElementById(id);
    };
    var qsa = function(sel) {
        return document.querySelectorAll(sel); 
    };

    window.onload = function() {
		initializeUser();
		initialize();
		gridColor();
		$("newGame").onclick = initialize;
    };
	
	document.onkeydown=function(e){
		e=window.event||e;
		switch(e.keyCode){
			case 37: //left key
				moveLeft();
				afterMove();
				return false;
			case 38: //up key
				moveUp();
				afterMove();
				return false;
			case 39: //right key
				moveRight();
				afterMove();
				return false;
			case 40: //down key
				moveDown();
				afterMove();
				return false;
			default:
				return false;
		}
	}
	
	function initialize() {
		$("score").innerHTML = "0";
		var grids = qsa(".grid-cell");
        for (var i = 0; i < grids.length; i++) {
			$(grids[i].id).innerHTML = "";
        }
		empty = ["0_0", "0_1", "0_2", "0_3", "1_0", "1_1", "1_2", "1_3", 
				 "2_0", "2_1", "2_2", "2_3", "3_0", "3_1", "3_2", "3_3"];
		generate();
		generate();
		gridColor();
		/*
		var int1 = parseInt(Math.random() * 16);
		var int2 = parseInt(Math.random() * 16);
		while (int1 == int2) {
			int2 = parseInt(Math.random() * 16);
		}
		var grid1 = parseInt(int1 / 4) + "_" + int1 % 4;
		var grid2 = parseInt(int2 / 4) + "_" + int2 % 4;
		$(grid1).innerHTML = twoFour();
		$(grid2).innerHTML = twoFour();
		*/
	}
	
	function initializeUser() {
        if (getCookie("username")) {
            loggedIn = true;
            username = getCookie("username");
        }
        if (loggedIn) {
            $("username").innerHTML = username;
			$("user-signed-in").classList.remove("hidden");
			$("user-not-signed-in").classList.add("hidden");
            /*$("signIn").classList.add("hidden");
            $("signInNote").classList.add("hidden");
            $("signOut").classList.remove("hidden");
			$("to15puzzle").classList.remove("hidden");
            $("signOut").onclick = signOut;*/
        } else {
			$("user-signed-in").classList.add("hidden");
			$("user-not-signed-in").classList.remove("hidden");
		}
    }
	
	function gameOver() {
		alert("Game Over!");
		var name = "";
		if (getCookie("username")) {
			username = getCookie("username");
			name = username;
			var score = parseInt($("score").innerHTML);
			alert("Well done, " + name + "! Your score has been recorded!");
			var ajaxGetPromise = AjaxGetPromise("record.php" + "?username=" + name + 
													"&score=" + score);
			ajaxGetPromise
				.catch(havingError);
		}
		initialize();
	}
	
	function checkDie() {
		if (empty.length == 0) {
			var over = 1;
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					var thisId = i + "_" + j;
					var leftId = i + "_" + (j-1);
					var upId = (i-1) + "_" + j;
					var rightId = i + "_" + (j+1);
					var downId = (i+1) + "_" + j;
					if (i != 0) {
						if ($(thisId).innerHTML == $(upId).innerHTML) {
							over = 0;
							break;
						}
					}
					if (i != 3) {
						if ($(thisId).innerHTML == $(downId).innerHTML) {
							over = 0;
							break;
						}
					}
					if (j != 0) {
						if ($(thisId).innerHTML == $(leftId).innerHTML) {
							over = 0;
							break;
						}
					}
					if (j != 3) {
						if ($(thisId).innerHTML == $(rightId).innerHTML) {
							over = 0;
							break;
						}
					}
				}
			}
			if (over) {
				gameOver();
			}
		}
	}
	
	function afterMove() {
		gridColor();
		checkDie();
	}
	
	function gridColor() {
		var grids = qsa(".grid-cell");
        for (var i = 0; i < grids.length; i++) {
			var index = num.indexOf(parseInt($(grids[i].id).innerHTML));
			if (index >= 0) {
				grids[i].style.background = color[index];
			} else {
				grids[i].style.background = "#E6C2FF";
			}
        } 
	}
	
	function moveLeft() {
		var changed = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				var id1 = i + "_" + j;
				if ($(id1).innerHTML == "") {
					continue;
				}
				for (var k = j + 1; k < 4; k++) {
					var id2 = i + "_" + k;
					if ($(id2).innerHTML == "") {
						continue;
					} else {
						if ($(id1).innerHTML == $(id2).innerHTML) {
							$(id1).innerHTML = $(id1).innerHTML * 2;
							$("score").innerHTML = 
								parseInt($("score").innerHTML) + parseInt($(id1).innerHTML);
							$(id2).innerHTML = "";
							empty.splice(0, 0, id2);
							changed = 1;
						}
						break;
					}
				}
			}
			for (var j = 0; j < 4; j++) {
				var id1 = i + "_" + j;
				if ($(id1).innerHTML != "") {
					continue;
				}
				for (var k = j + 1; k < 4; k++) {
					var id2 = i + "_" + k;
					if ($(id2).innerHTML != "") {
						$(id1).innerHTML = $(id2).innerHTML;
						$(id2).innerHTML = "";
						empty.splice(empty.indexOf(id1), 1);
						empty.splice(0, 0, id2);
						changed = 1;
						break;
					}
				}
			}
		}
		if (changed) {
			generate();
		}
	}
	
	function moveUp() {
		var changed = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				var id1 = j + "_" + i;
				if ($(id1).innerHTML == "") {
					continue;
				}
				for (var k = j + 1; k < 4; k++) {
					var id2 = k + "_" + i;
					if ($(id2).innerHTML == "") {
						continue;
					} else {
						if ($(id1).innerHTML == $(id2).innerHTML) {
							$(id1).innerHTML = $(id1).innerHTML * 2;
							$("score").innerHTML = 
								parseInt($("score").innerHTML) + parseInt($(id1).innerHTML);
							$(id2).innerHTML = "";
							empty.splice(0, 0, id2);
							changed = 1;
						}
						break;
					}
				}
			}
			for (var j = 0; j < 4; j++) {
				var id1 = j + "_" + i;
				if ($(id1).innerHTML != "") {
					continue;
				}
				for (var k = j + 1; k < 4; k++) {
					var id2 = k + "_" + i;
					if ($(id2).innerHTML != "") {
						$(id1).innerHTML = $(id2).innerHTML;
						$(id2).innerHTML = "";
						empty.splice(empty.indexOf(id1), 1);
						empty.splice(0, 0, id2);
						changed = 1;
						break;
					}
				}
			}
		}
		if (changed) {
			generate();
		}
	}
	
	function moveRight() {
		var changed = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				var id1 = (3-i) + "_" + (3-j);
				if ($(id1).innerHTML == "") {
					continue;
				}
				for (var k = j + 1; k < 4; k++) {
					var id2 = (3-i) + "_" + (3-k);
					if ($(id2).innerHTML == "") {
						continue;
					} else {
						if ($(id1).innerHTML == $(id2).innerHTML) {
							$(id1).innerHTML = $(id1).innerHTML * 2;
							$("score").innerHTML = 
								parseInt($("score").innerHTML) + parseInt($(id1).innerHTML);
							$(id2).innerHTML = "";
							empty.splice(0, 0, id2);
							changed = 1;
						}
						break;
					}
				}
			}
			for (var j = 0; j < 4; j++) {
				var id1 = (3-i) + "_" + (3-j);
				if ($(id1).innerHTML != "") {
					continue;
				}
				for (var k = j + 1; k < 4; k++) {
					var id2 = (3-i) + "_" + (3-k);
					if ($(id2).innerHTML != "") {
						$(id1).innerHTML = $(id2).innerHTML;
						$(id2).innerHTML = "";
						empty.splice(empty.indexOf(id1), 1);
						empty.splice(0, 0, id2);
						changed = 1;
						break;
					}
				}
			}
		}
		if (changed) {
			generate();
		}
	}
	
	function moveDown() {
		var changed = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				var id1 = (3-j) + "_" + (3-i);
				if ($(id1).innerHTML == "") {
					continue;
				}
				for (var k = j + 1; k < 4; k++) {
					var id2 = (3-k) + "_" + (3-i);
					if ($(id2).innerHTML == "") {
						continue;
					} else {
						if ($(id1).innerHTML == $(id2).innerHTML) {
							$(id1).innerHTML = $(id1).innerHTML * 2;
							$("score").innerHTML = 
								parseInt($("score").innerHTML) + parseInt($(id1).innerHTML);
							$(id2).innerHTML = "";
							empty.splice(0, 0, id2);
							changed = 1;
						}
						break;
					}
				}
			}
			for (var j = 0; j < 4; j++) {
				var id1 = (3-j) + "_" + (3-i);
				if ($(id1).innerHTML != "") {
					continue;
				}
				for (var k = j + 1; k < 4; k++) {
					var id2 = (3-k) + "_" + (3-i);
					if ($(id2).innerHTML != "") {
						$(id1).innerHTML = $(id2).innerHTML;
						$(id2).innerHTML = "";
						empty.splice(empty.indexOf(id1), 1);
						empty.splice(0, 0, id2);
						changed = 1;
						break;
					}
				}
			}
		}
		if (changed) {
			generate();
		}
	}
	
	
	
	
	
	
	function generate() {
		if (empty.length > 0) {
			var i = parseInt(Math.random() * empty.length);
			var id = empty[i];
			$(id).innerHTML = twoFour();
			empty.splice(i, 1);
		}
	}
	
	function twoFour() {
		if (parseInt(Math.random() * 10) == 0) {
			return 4;
		} else {
			return 2;
		}
	}
	
	function havingError(errorMessage) {
        alert("Ohhh... There is something wrong: " + errorMessage);
    }
	
	function deleteCookie(name) { 
        var exp = new Date(); 
        exp.setTime(exp.getTime() - 1); 
        var cval = getCookie(name); 
        if(cval != null) {
            document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
        }
    }
    
    function getCookie(cookieName) {
        var name = cookieName + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
	
})();
