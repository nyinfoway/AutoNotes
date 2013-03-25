/*
 * Get the plugin id
 * 
 */
function getPlugin() {
	return document.getElementById("plugin");
}

/*
 * Check is it windows or not then print the clipboard text in div whose id is
 * copy-notes.
 * 
 */
function showSelection() {
	if (oscheck() == false) {

		$.jGrowl("Sorry, this functionality is only available on Windows.");
		return false;
	}
	console.info("showselection");
	$("#copy-notes").css("display", "block");
	document.getElementById("copy-notes").innerHTML = "";
	document.getElementById("copy-notes").focus();
	document.getElementById("copy-notes").focus();
	var r = document.getElementById("plugin").printText("");
	setTimeout(showAMessage, 10);
}

/*
 * Auto copy function
 * 
 */
tempselection = "";
document.onmouseup = function(e) {

	var text = document.getSelection();
	localStorage.setItem("text", text);
	var ty = localStorage.getItem("text");
	var count = ty.split(' ').length;

	if (!text || text == 0 || count < 2) {
		return;
	}
	localStorage.setItem("URLS", document.URL);
	localStorage.setItem("title", document.title);
	chrome.extension.sendRequest({
		method : "selectionkey"
	}, function(response) {

		var selection = response.selection;
		if (selection == "true") {
			text = document.getSelection();
			localStorage.setItem("text", text);
			var ty = localStorage.getItem("text");
			if (ty != tempselection) {
				tempselection = ty;

				var count = ty.split(' ').length;
				chrome.extension.sendRequest({
					t : "my",
					domain : window.localStorage.getItem("URLS"),
					title : window.localStorage.getItem("title"),
					data : localStorage.getItem("text")
				}, function(response) {
					$.jGrowl(chrome.i18n
							.getMessage("contents_notes_added_notification"));
				});

			}

		}

	});

}

/*
 * Listener implemented through message passing.Listen to background page.
 * 
 */
chrome.extension.onRequest
		.addListener(function(request, sender, sendResponse) {

			if (request.copyfnotes == "opendialoguewithtext") {
				$("#cont").html("");
				var selecttxt = document.getSelection().toString();
				$("#cont").val(selecttxt);

				$("#dial-box")
						.dialog(
								{

									buttons : {
										"Save" : function() {
											chrome.extension.sendRequest({
												t : "my",
												domain : document.domain,
												title : document.title,
												data : $("#cont").val()
											}, function(response) {
											});

											$
													.jGrowl(chrome.i18n
															.getMessage("contents_notes_added_notification"));

											$(this).dialog("close");
										}

									}
								});

				sendResponse({});

			} else if (request.copyfnotes == "opendialogue") {

				openDialogbox();

				sendResponse({});
			}

			else if (request.copyfnotes == "copyformattednotes") {
				if (oscheck() == false) {

					$
							.jGrowl("Sorry, this functionality is only available on Windows.");
					return false;
				}
				c('copyformattednotes');
				text = document.getSelection();
				localStorage.setItem("text", text);
				var ty = localStorage.getItem("text");
				if (localStorage.getItem("check") == "true") {

					var count = ty.split(' ').length;
					if (count > 1) {
						i_o = document.getElementById("plugin").copyText("");
						console.info(i_o);
						localStorage.setItem("URLS", document.URL);
						localStorage.setItem("title", document.title);
						setTimeout(showSelection, 200);
					}

				} else if (ty != tempselection) {

					tempselection = ty;

					var count = ty.split(' ').length;
					if (count > 1) {
						i_o = document.getElementById("plugin").copyText("");
						console.info(i_o);
						localStorage.setItem("URLS", document.URL);
						localStorage.setItem("title", document.title);
						setTimeout(showSelection, 200);
					}
				}
				sendResponse({});
			} else if (request.copyfnotes == "captururl") {
				var text = document.getSelection();
				// console.info(text);
				if (text.length < 1) {
					localStorage.setItem("text", document.URL);
				} else {
					localStorage.setItem("text", text);
				}

				localStorage.setItem("URLS", document.URL);
				localStorage.setItem("title", document.title);
				simpleshowAMessage();
				sendResponse({});
			}
		});

/*
 * Check OS
 * 
 */
function oscheck() {

	var brow = BrowserDetect.OS;
	if (brow.indexOf("Windows") != -1) {
		return true;

	}

	return false;

}

/*
 * Open dialog box for manual notes.
 * 
 */
function openDialogbox(text) {
	$("#cont").html("");
	$("#cont").val(text);
	$("#dial-box")
			.dialog(
					{

						buttons : {
							"Save" : function() {
								chrome.extension.sendRequest({
									t : "my",
									domain : document.domain,
									title : document.title,
									data : $("#cont").val()
								}, function(response) {
								});

								$
										.jGrowl(chrome.i18n
												.getMessage("contents_notes_added_notification"));

								$(this).dialog("close");
							}
						}
					});
}

/*
 * Send clipboard data to background page
 * 
 */
function showAMessage() {
	if (oscheck() == false) {

		$.jGrowl("Sorry, this functionality is only available on Windows.");
		return false;
	}

	var r = document.getElementById("plugin").printText(
			"This is a message sent from the website's javascript...");

	value = document.getElementById("copy-notes").innerHTML;
	if (value.length > 0) {
		$("#copy-notes").css("display", "none");

		window.localStorage.setItem("value", value);
		var text = window.localStorage.getItem("value");
		// if(text.split(" ").length<2)return;

		chrome.extension.sendRequest({
			t : "my",
			domain : window.localStorage.getItem("URLS"),
			title : window.localStorage.getItem("title"),
			data : value
		}, function(response) {
		});

		$.jGrowl(chrome.i18n.getMessage("contents_notes_added_notification"));

	} else {
		setTimeout(showAMessage, 200);
	}
}

/*
 * Send simple text to background page
 * 
 */
function simpleshowAMessage() {
	c('simpleshowAMessage');
	$("#copy-notes").css("display", "none");

	value = window.localStorage.getItem("text");
	var text = window.localStorage.getItem("value");
	// if(text.split(" ").length<2)return;

	chrome.extension.sendRequest({
		t : "my",
		domain : window.localStorage.getItem("URLS"),
		title : window.localStorage.getItem("title"),
		data : value
	}, function(response) {
	});

	$.jGrowl(chrome.i18n.getMessage("contents_notes_added_notification"));

}

/*
 * Pop up a message box on webpage on installing the extension.
 * 
 */
function popup(message) {

	// get the screen height and width
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();

	// calculate the values for center alignment
	var dialogTop = ($('#dialog-box').height() - 90);
	var dialogLeft = (maskWidth) - ($('#dialog-box').width());

	// assign values to the overlay and dialog box
	$('#dialog-overlay').css({
		height : maskHeight,
		width : maskWidth
	}).show();
	$('#dialog-box').css({
		top : dialogTop,
		left : dialogLeft
	}).show();

	$('#dialog-message').html(message);

	$("#showURLCheckBx").change(function() {
		if (document.getElementById('showURLCheckBx').checked == true) {
			chrome.extension.sendRequest({
				t : "stopcount"
			}, function(response) {
			});
		}
	});
}

/*
 * Detect the shortcut keys pressed
 * 
 */
var isCtrl = false;
var isShift = false;
var isAlt = false;
document.onkeyup = function(e) {
	var e = window.event || e
	if (e.which == 17) {

		isCtrl = false;
	} else if (e.which == 16) {
		isShift = false;
	} else if (e.which == 18) {
		isAlt = false;
	}
}

var copy;
var show;
var opt;
var thiscontent;
var custnotes_char;
$("body")
		.keydown(
				function() {
					chrome.extension
							.sendRequest(
									{
										method : "shortkey"
									},
									function(response) {

										var key = new Array();
										key["18"] = "Alt";
										key["16"] = "Shift";
										key["17"] = "Ctrl";

										var copyFunc = (response.copyFunc) ? response.copyFunc
												: '18';
										var copyChar = (response.copyChar) ? response.copyChar
												: '65';
										var clearFunc = (response.clearFunc) ? response.clearFunc
												: '18';
										var clearChar = (response.clearChar) ? response.clearChar
												: '81';
										var showFunc = (response.showFunc) ? response.showFunc
												: '18';
										var showChar = (response.showChar) ? response.showChar
												: '83';
										var optChar = (response.optChar) ? response.optChar
												: '79';
										var optFunc = (response.optFunc) ? response.optFunc
												: '18';

										var custnoteschar = (response.custnoteschar) ? response.custnoteschar
												: '67';
										var custnotes = (response.custnotes) ? response.custnotes
												: '18';

										var opt_t = key[optFunc] + "+"
												+ String.fromCharCode(optChar);
										var show_t = key[showFunc] + "+"
												+ String.fromCharCode(showChar);
										var copy_t = key[copyFunc] + "+"
												+ String.fromCharCode(copyChar);

										var custnotes_char_t = key[custnotes]
												+ "+"
												+ String
														.fromCharCode(custnoteschar);

										if (opt_t != opt) {
											shortcut.remove(opt);
											opt = opt_t;
											shortcut.add(opt_t, function() {
												chrome.extension.sendRequest({
													greeting : "option"
												}, function(response) {
												});
											});
										}

										if (show_t != show) {

											shortcut.remove(show);
											show = show_t;
											shortcut.add(show, function() {

												localStorage.setItem("URLS",
														document.URL);
												chrome.extension.sendRequest({
													greeting : "show"
												}, function(response) {
												});
											});
										}

										if (copy_t != copy) {

											shortcut.remove(copy);
											copy = copy_t;
											shortcut.add(copy, function() {
												var text = document
														.getSelection();
												// console.info(text);
												if (text.length < 1) {
													localStorage.setItem(
															"text",
															document.URL);
												} else {
													localStorage.setItem(
															"text", text);
												}

												localStorage.setItem("URLS",
														document.URL);
												localStorage.setItem("title",
														document.title);
												simpleshowAMessage();

											});
										}

										if (custnotes_char != custnotes_char_t) {
											alert(document.selection());
											shortcut.remove(custnotes_char);
											custnotes_char = custnotes_char_t;
											shortcut
													.add(
															custnotes_char,
															function() {
																openDialogbox();
																localStorage
																		.setItem(
																				"URLS",
																				document.URL);
																localStorage
																		.setItem(
																				"title",
																				document.title);
																simpleshowAMessage();

															});
										}

									});
				});

$(document)
		.ready(
				function() {

					// $("body").append('<div id="dial-box" title="Add or edit
					// notes"><div id="cont" style="border:1px solid
					// black;width:150px;height:100px;overflow:scroll;overflow-y:scroll;overflow-x:scroll;"></div></div>');

					// 11 $("body").append('<div id="dial-box"
					// style="resize:both;overflow:auto;display:none;"
					// title="Add or edit notes"><a href="#"
					// class="ui-dialog-titlebar-close ui-corner-all"
					// role="button"><span class="ui-icon
					// ui-icon-closethick">close</span></a><textarea id="cont"
					// style="border:1px solid
					// black;width:100%;height:100px;overflow:scroll;overflow-y:scroll;overflow-x:scroll;"></textarea></div>');

					$("body")
							.append(
									'<div id="dial-box" style="resize:both;display:none;" title="Add or edit notes"><textarea id="cont" style="border:1px solid black;width:97%;height:100px;overflow:scroll;overflow-y:scroll;overflow-x:scroll;"></textarea></div>');

					if (thiscontent == undefined) {
						thiscontent = false;
						chrome.extension
								.sendRequest(
										{
											method : "shortkey"
										},
										function(response) {

											var key = new Array();
											key["18"] = "Alt";
											key["16"] = "Shift";
											key["17"] = "Ctrl";

											var copyFunc = (response.copyFunc) ? response.copyFunc
													: '18';
											var copyChar = (response.copyChar) ? response.copyChar
													: '65';
											var clearFunc = (response.clearFunc) ? response.clearFunc
													: '18';
											var clearChar = (response.clearChar) ? response.clearChar
													: '81';
											var showFunc = (response.showFunc) ? response.showFunc
													: '18';
											var showChar = (response.showChar) ? response.showChar
													: '83';
											var optChar = (response.optChar) ? response.optChar
													: '79';
											var optFunc = (response.optFunc) ? response.optFunc
													: '18';
											var custnoteschar = (response.custnoteschar) ? response.custnoteschar
													: '67';
											var custnotes = (response.custnotes) ? response.custnotes
													: '18';

											opt = key[optFunc]
													+ "+"
													+ String
															.fromCharCode(optChar);
											show = key[showFunc]
													+ "+"
													+ String
															.fromCharCode(showChar);
											copy = key[copyFunc]
													+ "+"
													+ String
															.fromCharCode(copyChar);
											var custnotes_char_t = key[custnotes]
													+ "+"
													+ String
															.fromCharCode(custnoteschar);

											shortcut.add(opt, function() {
												chrome.extension.sendRequest({
													greeting : "option"
												}, function(response) {
												});
											});

											shortcut.add(show, function() {

												localStorage.setItem("URLS",
														document.URL);
												chrome.extension.sendRequest({
													greeting : "show"
												}, function(response) {
												});
											});

											shortcut.add(copy, function() {
												var text = document
														.getSelection();
												// console.info(text);
												if (text.length < 1) {
													localStorage.setItem(
															"text",
															document.URL);
												} else {
													localStorage.setItem(
															"text", text);
												}

												localStorage.setItem("URLS",
														document.URL);
												localStorage.setItem("title",
														document.title);
												simpleshowAMessage();

											});

											custnotes_char = custnotes_char_t;
											shortcut
													.add(
															custnotes_char,
															function() {
																var text = document
																		.getSelection()
																		.toString();
																openDialogbox(text);
																localStorage
																		.setItem(
																				"URLS",
																				document.URL);
																localStorage
																		.setItem(
																				"title",
																				document.title);
																// simpleshowAMessage();

															});

										});
					}
				});

/*
 * Copy the text to clipboard
 * 
 */
function copyText() {
	if (oscheck() == false) {

		$.jGrowl("Sorry, this functionality is only available on Windows.");
		return false;
	}

	var text = document.getSelection();
	console.info(text);
	localStorage.setItem("text", text);
	var ty = localStorage.getItem("text");
	var count = ty.split(' ').length;
	if (count > 1) {
		i_o = "";
		while (i_o == "") {

			i_o = document.getElementById("plugin").copyText("");
			console.info(i_o);
		}

	}
}
var logging = false;
$(document)
		.ready(
				function() {

					$("body")
							.append(
									'<div id="copy-notes" style="position:fixed;bottom:200px;height:30px;text-align:center;" contenteditable="true"></div><embed id="plugin" src="" type="application/npjucedemo-plugin" width="0" height="0"></embed>');
					$('a.btn-ok, #dialog-overlay, #dialog-box')
							.click(
									function() {
										if (document
												.getElementById('showURLCheckBx').checked == true) {
											chrome.extension.sendRequest({
												t : "stopcount"
											}, function(response) {
											});
										}
										$('#dialog-overlay, #dialog-box')
												.hide();
										return false;
									});
					// if user resize the window, call the same function again
					// to make sure the overlay fills the screen and dialogbox
					// aligned to center
					$(window).resize(function() {

						// only do it if the dialog box is not hidden
						if (!$('#dialog-box').is(':hidden'))
							popup();
					});

					chrome.extension
							.sendRequest(
									{
										t : "count"
									},
									function(response) {

										if (response.count < 3)
											popup('Auto Notes Shortcut Keys :<ul><li><font color="#FF0000" size="+1"><b>Alt + S </b></font>  to show notes</li><li><font color="#FF0000" size="+1"><b>Alt +  A </b></font>  to copy notes</li></ul><br></br>');
									});
					setTimeout(disappear, 4000);

					$("body")
							.append(
									'<div id="dialog-overlay" style="display:none;"></div><div id="dialog-box" style="display:none;">	<div class="dialog-content">		<div id="dialog-message"></div><p></p><p></p>	<p><input id="showURLCheckBx" type="checkbox" name="showHideURLs" >&nbsp&nbspDont Show this message box</p></br>	<a href="#" class="button123">Close</a></div></div>');

				});

function disappear() {
	$('#dialog-overlay, #dialog-box').hide();
	return false;
}

function c(y) {
	console.info(y);
}