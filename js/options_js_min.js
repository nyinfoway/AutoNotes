$(function() {
	$("#resetButton").button();
	$('#header').click(function() {
		location.href = 'showNotes.html'
	});
});
var SHIFT_KEY = 16;
var CTRL_KEY = 17;
var ALT_KEY = 18;
var SUCCESS = 0;
var FAIL = 1;
//Restricted keys compiled for windows only-http://www.google.com/support/chrome/bin/static.py?guide=25799&page=guide.cs&topic=28650
//Add values from windows shortcuts which works on chrome also. such as CTRL+A for Select all.
var SHIFT_RESTRICTED_KEYS = new Array('');
var CTRL_RESTRICTED_KEYS = new Array('A', 'C', 'D', 'E', 'F', 'G', 'H', 'J',
		'K', 'L', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X');
var ALT_RESTRICTED_KEYS = new Array('D', 'E', 'F');

function initLoad() {
	document.getElementById('reset').value = localStorage.getItem(chrome.i18n
			.getMessage("options_reset_button_value"));
	document.getElementById('reset').title = localStorage.getItem(chrome.i18n
			.getMessage("options_reset_button_title"));

}

function checkInvalidOptionKeys(fKey, uKey) {
	//Check for duplicate entries for options.
	var checkDuplicate = checkDuplicateOptions();
	if (checkDuplicate) {
		$.jGrowl(chrome.i18n.getMessage("options_duplicate_values_fail"));
		return checkDuplicate;
	}

	//Check for SHIFT, CTRL or ALT key.
	if (((fKey == SHIFT_KEY) && (SHIFT_RESTRICTED_KEYS.indexOf(String
			.fromCharCode(uKey)) >= 0))
			|| ((fKey == CTRL_KEY) && (CTRL_RESTRICTED_KEYS.indexOf(String
					.fromCharCode(uKey)) >= 0))
			|| ((fKey == ALT_KEY) && (ALT_RESTRICTED_KEYS.indexOf(String
					.fromCharCode(uKey)) >= 0))) {
		$.jGrowl(chrome.i18n.getMessage("options_chrome_restricted_key_alert"));
		return 1;
	}

	//Finally check for duplicate key entries in options page.
	return SUCCESS;
}

function setColor() {
	var colorVal = document.getElementById('colorpic').value;
	trc.style.backgroundColor = colorVal;
	localStorage.setItem("color", document.getElementById('colorpic').value);
}

function setOpen() {
	//var openVal = document.getElementById('setop').value;
	localStorage.setItem("setop", document.getElementById('setop').value);
}

function checkShow() {
	var funcKey = document.getElementById('showFunc').value;
	var userKey = document.getElementById('showChar').value;
	if (checkInvalidOptionKeys(funcKey, userKey) > 0)
		return 1;
	else
		return 0;
}

function checkClear() {
	var funcKey = document.getElementById('clearFunc').value;
	var userKey = document.getElementById('clearChar').value;
	if (checkInvalidOptionKeys(funcKey, userKey) > 0)
		return 1;
	else
		return 0;
}

function checkCopy() {
	var funcKey = document.getElementById('copyFunc').value;
	var userKey = document.getElementById('copyChar').value;
	if (checkInvalidOptionKeys(funcKey, userKey) > 0)
		return 1;
	else
		return 0;
}
function checkOption() {
	var funcKey = document.getElementById('optFunc').value;
	var userKey = document.getElementById('optChar').value;
	if (checkInvalidOptionKeys(funcKey, userKey) > 0)
		return 1;
	else
		return 0;
}

function checkDuplicateOptions() {
	//This method still has room for better efficiency, consider refactoring in future. 
	var copyFKey = document.getElementById('copyFunc').value;
	var copyUKey = document.getElementById('copyChar').value;

	//var clearFKey = document.getElementById('clearFunc').value;
	// var clearUKey = document.getElementById('clearChar').value;commented on 19january12

	var showFKey = document.getElementById('showFunc').value;
	var showUKey = document.getElementById('showChar').value;

	var optFKey = document.getElementById('optFunc').value;
	var optUKey = document.getElementById('optChar').value;
	
	var custnotes = document.getElementById('custnotes').value;
	var custnoteschar = document.getElementById('custnoteschar').value;

	//Check duplicate key entries for copy.
	if (((copyFKey == showFKey) && (copyUKey == showUKey))
			|| ((copyFKey == optFKey) && (copyUKey == optUKey))
			|| ((showFKey == optFKey) && (showUKey == optUKey))
			
	||((custnotes == optFKey) && (custnoteschar == copyUKey))
	||((custnotes == copyFKey) && (custnoteschar == showUKey))
	||((custnotes == showFKey) && (custnoteschar == optUKey)))
		return FAIL;

	//Check duplicate key entries for show.
	if (((showFKey == copyFKey) && (showUKey == copyUKey)))
		return FAIL;

	return SUCCESS; //Success.
}

//Set copy keys.
function setCopyFuncKey() {
	if (checkCopy())
	//Revert to previous value if any error code is returned.
	{
		document.getElementById('copyFunc').value = localStorage
				.getItem("copyFunc");

	} else {
		//Set new value for the feature.
		if (document.getElementById('copyFunc').value != localStorage
				.getItem("copyFunc"))
			$.jGrowl(chrome.i18n.getMessage("options_value_set_success"));
		localStorage.setItem("copyFunc",
				document.getElementById('copyFunc').value);

	}
}

function setCustomcharKey() {
	
	if (checkCustom())
	//Revert to previous value if any error code is returned.
	{
		document.getElementById('custnoteschar').value = localStorage
				.getItem("custnoteschar");

	} else {//Set new value for the feature.
		if (document.getElementById('custnoteschar').value != localStorage
				.getItem("custnoteschar"))
			$.jGrowl(chrome.i18n.getMessage("options_value_set_success"));
		localStorage.setItem("custnoteschar",
				document.getElementById('custnoteschar').value);

	}
}

function checkCustom(){
	
	var funcKey = document.getElementById('custnotes').value;
	var userKey = document.getElementById('custnoteschar').value;
	if (checkInvalidOptionKeys(funcKey, userKey) > 0)
		return 1;
	else
		return 0;
}

function setCustomNotes() {
	if (checkCustom())
	//Revert to previous value if any error code is returned.
	{
		document.getElementById('custnotes').value = localStorage
				.getItem("custnotes");

	} else {//Set new value for the feature.
		if (document.getElementById('custnotes').value != localStorage
				.getItem("custnotes"))
			$.jGrowl(chrome.i18n.getMessage("options_value_set_success"));
		localStorage.setItem("custnotes",
				document.getElementById('custnotes').value);

	}
}

function setCopyCharKey() {
	if (checkCustom())
	//Revert to previous value if any error code is returned.
	{
		document.getElementById('copyChar').value = localStorage
				.getItem("copyChar");

	} else {//Set new value for the feature.
		if (document.getElementById('copyChar').value != localStorage
				.getItem("copyChar"))
			$.jGrowl(chrome.i18n.getMessage("options_value_set_success"));
		localStorage.setItem("copyChar",
				document.getElementById('copyChar').value);

	}
}
///////-----------------------option page
function setOptFuncKey() {
	if (checkOption())
	//Revert to previous value if any error code is returned.
	{
		document.getElementById('optFunc').value = localStorage
				.getItem("optFunc");

	} else {
		//Set new value for the feature.
		if (document.getElementById('optFunc').value != localStorage
				.getItem("optFunc"))
			$.jGrowl(chrome.i18n.getMessage("options_value_set_success"));
		localStorage.setItem("optFunc",
				document.getElementById('optFunc').value);

	}
}

function setOptCharKey() {
	if (checkOption())
	//Revert to previous value if any error code is returned.
	{
		document.getElementById('optChar').value = localStorage
				.getItem("optChar");

	} else {//Set new value for the feature.
		if (document.getElementById('optChar').value != localStorage
				.getItem("optChar"))
			$.jGrowl(chrome.i18n.getMessage("options_value_set_success"));
		localStorage.setItem("optChar",
				document.getElementById('optChar').value);

	}
}

///////////////--------------------set 
//Set clear keys.
function setClearFuncKey() {
	if (checkClear())
	//Revert to previous value if any error code is returned.
	{
		document.getElementById('clearFunc').value = localStorage
				.getItem("clearFunc");
	} else { //Set new value for the feature.
		if (document.getElementById('clearFunc').value != localStorage
				.getItem("clearFunc"))
			$.jGrowl(chrome.i18n.getMessage("options_value_set_success"));
		localStorage.setItem("clearFunc",
				document.getElementById('clearFunc').value);

	}
}

function setClearCharKey() {
	if (checkClear()) { //Revert to previous value if any error code is returned.
		document.getElementById('clearChar').value = localStorage
				.getItem("clearChar");
	} else { //Set new value for the feature.
		if (document.getElementById('clearChar').value != localStorage
				.getItem("clearChar"))
			$.jGrowl(chrome.i18n.getMessage("options_value_set_success"));
		localStorage.setItem("clearChar",
				document.getElementById('clearChar').value);

	}
}

//Set show keys.
function setShowFuncKey() {
	if (checkShow()) { //Revert to previous value if any error code is returned.
		document.getElementById('showFunc').value = localStorage
				.getItem("showFunc");
	} else { //Set new value for the feature.
		if (document.getElementById('showFunc').value != localStorage
				.getItem("showFunc"))
			$.jGrowl(chrome.i18n.getMessage("options_value_set_success"));
		localStorage.setItem("showFunc",
				document.getElementById('showFunc').value);

	}
}

function setShowCharKey() {
	if (checkShow()) { //Revert to previous value if any error code is returned.
		document.getElementById('showChar').value = localStorage
				.getItem("showChar");
	} else { //Set new value for the feature.
		if (document.getElementById('showChar').value != localStorage
				.getItem("showChar"))
			$.jGrowl(chrome.i18n.getMessage("options_value_set_success"));
		localStorage.setItem("showChar",
				document.getElementById('showChar').value);

	}
}

function check() {

	if (document.getElementById("check1").checked == false) {
		localStorage.setItem("check", "false");
		 document.getElementById('copyChar').disabled = false;
		 document.getElementById('copyFunc').disabled = false;
	} else {
		document.getElementById("check1").checked = true;
		localStorage.setItem("check", "true");
		//document.getElementById('copyChar').disabled = true;
		//document.getElementById('copyFunc').disabled = true;
	}

}
//loadPrefs: Load user preferences on load.
function loadPrefs() {
	if (localStorage.getItem("copyFunc") == null) {
		resetOptions();
	}
	
	document.getElementById('copyFunc').value = localStorage
			.getItem("copyFunc");
	document.getElementById('copyChar').value = localStorage
			.getItem("copyChar");
	//  document.getElementById('clearFunc').value = localStorage.getItem("clearFunc");
	// document.getElementById('clearChar').value = localStorage.getItem("clearChar");
	document.getElementById('showFunc').value = localStorage
			.getItem("showFunc");
	document.getElementById('showChar').value = localStorage
			.getItem("showChar");
	document.getElementById('optFunc').value = localStorage.getItem("optFunc");
	document.getElementById('optChar').value = localStorage.getItem("optChar");
	//if(localStorage.getItem("disurl")=="true"||localStorage.getItem("disurl")==null){ document.getElementById("disurl").checked=true;}else{document.getElementById("disurl").checked=false;}
	//if(localStorage.getItem("distime")=="true"){ document.getElementById("distime").checked=true;}else{document.getElementById("distime").checked=false;}

	//alert(localStorage.getItem("check"));
	//  document.getElementById('colorpic').value = localStorage.getItem("color");
	//  document.getElementById('setop').value = localStorage.getItem("setop");

	if (localStorage.getItem("check") == "true") {
		document.getElementById("check1").checked = true;
		//document.getElementById('copyChar').disabled = true;
		//document.getElementById('copyFunc').disabled = true;
	} else {
		document.getElementById("check1").checked = false;
		document.getElementById('copyChar').disabled = false;
		document.getElementById('copyFunc').disabled = false;
	}
	//  document.options_form.resetButton.value = chrome.i18n.getMessage("options_reset_button_value");
	//document.options_form.resetButton.title = chrome.i18n.getMessage("options_reset_button_title");
	// trc.style.backgroundColor = localStorage.getItem("color");

	if (localStorage.getItem("custnoteschar")) {
		document.getElementById("custnoteschar").value =localStorage.getItem("custnoteschar");
		document.getElementById("custnotes").value =localStorage.getItem("custnotes");
		
	}
	localStorage.setItem("setop", "tab");

}

function loa() {
	$.jGrowl(chrome.i18n.getMessage("options_value_default_reset"));
}
//resetOptions: Resets user options to default.
function resetOptions() {
	localStorage.setItem("copyFunc", ALT_KEY);
	localStorage.setItem("copyChar", "A".charCodeAt(0));
	localStorage.setItem("optFunc", ALT_KEY);
	localStorage.setItem("optChar", "O".charCodeAt(0));
	localStorage.setItem("showFunc", ALT_KEY);
	localStorage.setItem("showChar", "S".charCodeAt(0));
	localStorage.setItem("color", "#FFFFFF");
	localStorage.setItem("setop", "tab");
	localStorage.setItem("check", "false");
	localStorage.setItem("distime", "false");
	localStorage.setItem("disurl", "true");
	$.jGrowl(chrome.i18n.getMessage("options_value_default_reset"));
	loadPrefs();
}

/*
function checktime(){
if( document.getElementById("distime").checked==true)
{ 
localStorage.setItem("distime", "false");
  }else{
localStorage.setItem("distime", "true");}

}

function checkurl(){
if( document.getElementById("disurl").checked==true)
{
 localStorage.setItem("disurl", "false");
}else{
localStorage.setItem("disurl", "true");}


}

 */

/*
 *   New functions written on 20/8/12
 *
 */

function returnShortcutString(id) {
	var stringT = document.getElementById(id + "1").value + "+"
			+ document.getElementById(id + "2").value + "+"
			+ document.getElementById(id + "3").value;
	stringT = stringT.replace(/\s/g, '');
	if (stringT.charAt(0) != "+")
		return stringT;
	else
		return stringT.substring(1);
}

function findMatch3Options() {
	var keysArray = [];
	keysArray.push(returnShortcutString("copynotes"));
	keysArray.push(returnShortcutString("shownotes"));
	keysArray.push(returnShortcutString("showoptions"));
	keysArray.push(returnShortcutString("Screenshot"));

	if (arrHasDupes(keysArray))
		return true;
	else
		return false;
}

function autoSaveShorcut() {
	if (findMatch3Options()) {
		loadPref_new();
		$.jGrowl("Please check your shorcuts keys.");
	} else {
		localStorage.setItem("copynotes", returnShortcutString("copynotes"));
		localStorage.setItem("shownotes", returnShortcutString("shownotes"));
		localStorage
				.setItem("showoptions", returnShortcutString("showoptions"));
		localStorage.setItem("Screenshot", returnShortcutString("Screenshot"));
		$.jGrowl("Option saved successfully.");

	}
}
function arrHasDupes(A) {
	var i, j, n;
	n = A.length;

	for (i = 0; i < n; i++) {
		for (j = i + 1; j < n; j++) {
			if (A[i] == A[j])
				return true;
		}
	}
	return false;
}
function loadPref_new() {

	if (localStorage.getItem("check") == "true") {
		document.getElementById("check1").checked = true;
	} else {
		document.getElementById("check1").checked = false;
	}
	if (localStorage.getItem("copynotes") == null) {
		resetOption_new();
	}
	var cn = localStorage.getItem("copynotes");//,returnShortcutString("copynotes"));
	var sn = localStorage.getItem("shownotes");//,returnShortcutString("shownotes"));
	var so = localStorage.getItem("showoptions");//,returnShortcutString("showoptions"));
	var ss = localStorage.getItem("Screenshot");
	keys = [];
	if (cn.count("+") == 1) {
		var keys = cn.split("+");
		document.getElementById("copynotes1").value = "";
		document.getElementById("copynotes2").value = keys[0];
		document.getElementById("copynotes3").value = keys[1];
	} else {
		var keys = cn.split("+");
		document.getElementById("copynotes1").value = keys[0];
		document.getElementById("copynotes2").value = keys[1];
		document.getElementById("copynotes3").value = keys[2];
	}
	keys = [];
	if (sn.count("+") == 1) {
		keys = sn.split("+");
		document.getElementById("shownotes1").value = "";
		document.getElementById("shownotes2").value = keys[0];
		document.getElementById("shownotes3").value = keys[1];
	} else {
		keys = sn.split("+");
		document.getElementById("shownotes1").value = keys[0];
		document.getElementById("shownotes2").value = keys[1];
		document.getElementById("shownotes3").value = keys[2];
	}
	keys = [];
	if (so.count("+") == 1) {
		keys = so.split("+");
		document.getElementById("showoptions1").value = "";
		document.getElementById("showoptions2").value = keys[0];
		document.getElementById("showoptions3").value = keys[1];
	} else {
		keys = so.split("+");
		document.getElementById("showoptions1").value = keys[0];
		document.getElementById("showoptions2").value = keys[1];
		document.getElementById("showoptions3").value = keys[2];
	}

	keys = [];
	if (ss.count("+") == 1) {
		keys = ss.split("+");
		document.getElementById("Screenshot1").value = "";
		document.getElementById("Screenshot2").value = keys[0];
		document.getElementById("Screenshot3").value = keys[1];
	} else {
		keys = ss.split("+");
		document.getElementById("Screenshot1").value = keys[0];
		document.getElementById("Screenshot2").value = keys[1];
		document.getElementById("Screenshot3").value = keys[2];
	}
}

function resetOption_new() {
	localStorage.setItem("copynotes", "Ctrl+Shift+A");
	localStorage.setItem("shownotes", "Ctrl+Shift+B");
	localStorage.setItem("showoptions", "Ctrl+Shift+C");
	localStorage.setItem("Screenshot", "Ctrl+Shift+S");
	$.jGrowl(chrome.i18n.getMessage("options_value_default_reset"));
	loadPref_new();
}

String.prototype.count = function(match) {
	var res = this.split(match);

	return res.length - 1;
}

$(document).ready(function() {
	loadPrefs();
	

	$("#custnotes").change(function() {
		setCustomNotes()();

	});

	$("#custnoteschar").change(function() {
		setCustomcharKey();

	});
	/////added for manifest 2
	$("#copyFunc").change(function() {
		setCopyFuncKey();

	});

	$("#copyChar").change(function() {
		setCopyCharKey();

	});

	$("#check1").change(function() {
		check();

	});
	$("#showFunc").change(function() {
		setShowFuncKey();

	});
	$("#showChar").change(function() {
		setShowCharKey();

	});
	$("#optFunc").change(function() {
		setOptFuncKey();

	});
	$("#optChar").change(function() {
		setOptCharKey();

	});

	$("#resetButton").click(function() {
		resetOptions();

	});

});