/*
 * Archieve the note
 */
function initLoad() {

	if (document.body.offsetWidth == 0 && window.innerWidth == 0) {
		var ele = document.getElementById("floating-menu-formatting-id");

		ele.style.display = "none";
		document.getElementById("showFormatbar").checked = false;

	}

	if (localStorage.getItem("showFormatbar") == "true"
			|| localStorage.getItem("showFormatbar") == null) {
		document.getElementById("showFormatbar").checked = true;

	} else {
		document.getElementById("showFormatbar").checked = false;

	}

	var key = "";
	var pairs = "<tr><th>Archieves</th></tr>\n";
	var i = 0;

	for (i = 0; i <= localStorage.length - 1; i++) {
		key = localStorage.key(i);
		if (key.indexOf("Archieves::") != -1) {
			var mySplitResult = key.split("::")
			// pairs += '<tr><td><input type="submit" value='+key+' onClick="showData(this);"  />'+key+'</td></tr>\n';
			pairs += '<tr><td><li><a href="#" title=' + mySplitResult[1]
					+ ' onClick="showData(this);"  >' + mySplitResult[1]
					+ '</a></li></td></tr>\n';

		} else if (key.indexOf("Archieves") != -1) {

			// pairs += '<tr><td><input type="submit" value='+key+' onClick="showData(this);"  />'+key+'</td></tr>\n';
			pairs += '<tr><td><li><a href="#" title=' + key
					+ ' onClick="showData(this);"  >' + key
					+ '</a></li></td></tr>\n';
		}

	}
	if (pairs == "<tr><th>Archieves</th></tr>\n") {
		pairs += "<tr><td><i>is empty</i></td>\n</tr>\n";
	}
	document.getElementById('pairs').innerHTML = pairs;

	// localStorage.clear();

}

function togglebullet1() {
	if (document.getElementById("showBulletCheckBx").checked == true) {
		window.localStorage.setItem("csspattern", "true");
		window.location.reload();
	} else {
		window.localStorage.setItem("csspattern", "false");
		window.location.reload();
	}
}
function togglebullet() {
	if (document.getElementById("showBulletCheckBx").checked == true) {
		var styleSheet = getStyleSheet("css/showNotes.css");
		styleSheet.insertRule(".noteList { list-style-type: none;}", 0);
	} else {
		window.location.reload();
	}
}

function toggleURL() {
	if (document.getElementById("showURLCheckBx").checked == true) {
		var styleSheet = getStyleSheet("css/showNotes.css");
		styleSheet.insertRule(".urlLink { display: none;}", 0);
	} else {
		window.location.reload();
	}
}

function hideFormatBar() {
	var ele = document.getElementById("floating-menu-formatting-id");
	if (document.getElementById("hideFormatbar").checked == true) {
		ele.style.display = "none";
		document.getElementById("showFormatbar").checked = false;
	} else {
		window.location.reload();
	}
}

function showFormatBar() {
	var ele = document.getElementById("floating-menu-formatting-id");
	if (document.getElementById("showFormatbar").checked == true) {
		localStorage.setItem("showFormatbar", "true");
		window.location.reload();
	} else {
		localStorage.setItem("showFormatbar", "false");
		ele.style.display = "none";
	}
}

function getStyleSheet(unique_title) {
	for ( var i = 0; i < document.styleSheets.length; i++) {
		var sheet = document.styleSheets[i];
		if (sheet.href.indexOf(unique_title) != -1) {
			return sheet;
		}
	}
}

function saveToGDocs() {

	$.ajaxSetup({
		cache : false
	});
	//var ajax_load = "<img src='img/load.gif' alt='loading...' />";

	//	load() functions
	var loadUrl = "http://chromeautonotes.com/postFile.php?id='pras'";

	//	$.get()
	$("#saveInGdocs").click(function() {
		$("#result").html(ajax_load);
		$.get(loadUrl, {
			language : "php",
			version : 5
		}, function(responseText) {
			$("#result").html(responseText);
		}, "html");
	});

}