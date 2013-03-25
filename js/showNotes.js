if (window.localStorage.getItem("notes") == undefined) {
	window.localStorage.setItem("notes", "");
}

if (window.localStorage.getItem("notes::title") == null) {
	window.localStorage.setItem("notes::title", "Current Notes");
}

$(function() {

	$('#header').click(function() {
		location.href = 'showNotes.html'
	});
	$("#tabs").tabs({
		event : "mouseover",
		show : {}

	});

	$(".ui-widget-content").css("border", "0px");

	$("#undo").click(function() {
		if (chrome.extension.getBackgroundPage().undo.length > 0) {
			var notes = chrome.extension.getBackgroundPage().undo.pop();
			window.localStorage.setItem("notes", notes);
			window.location.reload();
		}
	});

});

$(function() {
	$(" button", ".demo").button();

});

function reload() {
	var ele = document.getElementById("floating-menu-formatting-id");
	ele.style.display = "run-in";
}

function addbadge() {
	var countcopy = window.localStorage.getItem("countcopy");
	if (countcopy == null) {
		countcopy = 0;
	} else {
		var countcopy = window.localStorage.getItem("countcopy");
		countcopy = Number(countcopy) + 1;
		window.localStorage.setItem("countcopy", countcopy);
	}
	chrome.browserAction.setBadgeText({
		text : String(countcopy)
	});
}

function deletebadge() {
	var countcopy = window.localStorage.getItem("countcopy");
	countcopy = Number(countcopy) - 1;
	window.localStorage.setItem("countcopy", countcopy);
	chrome.browserAction.setBadgeText({
		text : String(countcopy)
	});
}

function _mailto(sub, body) {
	if (document.getElementById('notes').innerText == null) {
		jAlert('Current note is empty.', '');
		return;
	} else {
		body = document.getElementById('notes').innerText;
	}
	try {
		if (document.getElementById('yournoteon').innerText == null) {
			sub = "";
		} else {
			sub = document.getElementById('yournoteon').innerText;
		}
	} catch (Exception) {
		sub = "";
	}
	if (body.length > 1000) {
		jAlert('Character limit reached for send email feature, kindly check.',
				'');
		return;
	}
	sub = encodeURIComponent(sub);
	body = encodeURIComponent(body);
	;
	chrome.tabs.create({
		"url" : "mailto:someone@domain.com?subject=" + sub + "&body=" + body
				+ ""
	});
}

function Goto() {
	var value = window.localStorage.getItem("notes");
	if (value == "") {
		return;
	}
	window.location = "autoEditor.html";

}

function checknameexist(obj) {

	var i = 0;
	for (i = 0; i <= localStorage.length - 1; i++) {
		key = localStorage.key(i);
		if (key.indexOf("Archives::") != -1) {
			var mySplitResult = key.split("::");

			if (mySplitResult[1] == obj) {
				jAlert('This name already exist.', '', function(r) {
					ArchieveAll();
				});
				return false;
			}
		}
	}
	return true;
}

function checkrenaming(obj) {

	var i = 0;
	for (i = 0; i <= localStorage.length - 1; i++) {
		key = localStorage.key(i);
		if (key.indexOf("Archives::") != -1) {
			var mySplitResult = key.split("::");

			if (mySplitResult[1] == obj) {

				return false;
			}
		}
	}
	return true;
}

function showData(obj) {

	var pairs = "";
	var i = 0;

	var nam = obj.title;
	if (nam.indexOf("Archives") == -1) {

		nam = "Archives::" + nam;
	}

	pairs += '<tr><td>' + localStorage.getItem(nam) + '</td></tr>\n';

	if (pairs == "") {
		pairs += "<tr><td><i>empty</i></td>\n</tr>\n";
	}
	document.getElementById('showArchieve').innerHTML = pairs;
	document.getElementById('Head').innerHTML = ' <table align="center"><tr><td><h3>'
			+ obj.title + '</h3></td></tr></table>';
	if (document.getElementById('pairs').innerHTML.indexOf("showNotes.html") == -1) {
		document.getElementById('pairs').innerHTML += '<li><a href="showNotes.html" >Current Notes</a></li>'; //onmouseover="hil(this);" onmouseout="nothil(this);"
	}
	$('#showArchieve').attr('title', nam);
	$('a[href="#"]').click(function() {
		if (this.title) {

			showData(this);

		}

	});
}

function deleteArchieve() {
	var n = $('input:checkbox[name="attribute[]"]:checked').length;
	if (n == 0) {
		$.jGrowl("Please select a note.");
		return;
	}

	jConfirm(
			'Are you sure, you want to delete selected notes?',
			'',
			function(r) {
				if (r) {

					$('input:checkbox[name="attribute[]"]:checked')
							.each(
									function(index) {
										localStorage.removeItem($(this).val());
										deletebadge();
										$
												.jGrowl($(this).val()
														+ " "
														+ chrome.i18n
																.getMessage("auto_notes_is_removed"));
									});
					initLoad();
					document.getElementById('showArchieve').innerHTML = "";
					document.getElementById('Head').innerHTML = "";
					$('a').unbind('click');
					$('a[href="#"]').click(function() {
						if (this.title) {
							showData(this);
						}
					});
				}
			});

}

function delcurrent() {

	jConfirm('Do you want to delete current note?', '', function(r) {
		if (r) {
			localStorage.setItem("notes", "");
			window.location.reload();
		}
	});

}

function save_savednotes_doc() {
	var n = $('input:checkbox[name="attribute[]"]:checked').length;
	if (n == 0) {
		$.jGrowl("Please select a note.");
		return;
	}

	$('input:checkbox[name="attribute[]"]:checked').each(function(index) {
		var key = $(this).val();

		title = key.split("::")[1];
		text = localStorage.getItem(key);
		createSavedNotesDoc(text);

	});
}

function renameArchieve() {

	var n = $('input:checkbox[name="attribute[]"]:checked').length;
	if (n > 1) {
		$.jGrowl("Please select only one note to rename.");
		return;
	} else if (n == 0) {
		$.jGrowl("Please select a note.");
		return;
	} else if (n == 1) {

		$('input:checkbox[name="attribute[]"]:checked')
				.each(
						function(index) {
							var key = $(this).val();
							var name = "";

							jPrompt(
									'Enter new name:',
									'',
									'',
									function(r) {
										if (r) {
											name = r;
										}
										if (!checkrenaming(r)) {
											jAlert('This name already exist.',
													'');
											return;
										}
										while (name.indexOf("::") != -1) {

											$
													.jGrowl(chrome.i18n
															.getMessage("auto_notes_error_remove_it"));
											name = prompt(
													"Please enter name for archieve",
													"");
										}

										if (name != null && name != "") {
											var nots = localStorage
													.getItem(key);
											localStorage.removeItem(key);

											key = "Archives" + "::" + name;
											localStorage.setItem(key, nots);
											document
													.getElementById('showArchieve').title = name;
											document
													.getElementById('showArchieve').innerHTML = '<tr><td>'
													+ nots + '</td></tr>\n';
											document.getElementById('Head').innerHTML = ' <table align="center"><tr><td><h3>'
													+ name
													+ '</h3></td></tr></table>';

										}

										initLoad();
										$
												.jGrowl($(this).val()
														+ " "
														+ chrome.i18n
																.getMessage("auto_notes_is_renamed"));

									});

						});

	}

}

function makeCurrentNote() {

	var n = $('input:checkbox[name="attribute[]"]:checked').length;
	if (n > 1) {
		$.jGrowl("Please select only one note to make it current note.");
		return;
	} else if (n == 0) {
		$.jGrowl("Please select a note.");
		return;
	} else if (n == 1) {

		$('input:checkbox[name="attribute[]"]:checked')
				.each(
						function(index) {

							key = $(this).val();

							var now = new Date();
							var year = now.getFullYear();
							var month = now.getMonth();
							var date = now.getDate();
							var day = now.getDay();

							var rmonth = [ "January", "February", "March",
									"April", "May", "June", "July", "August",
									"September", "October", "November",
									"December" ];

							dateTime = rmonth[month] + " " + date + ", " + year
									+ ':' + now.getHours() + ':'
									+ now.getMinutes() + ':' + now.getSeconds();
							;
							var value = window.localStorage.getItem("notes");

							if ((value != null) && (value != " ")
									&& (value != "")) {
								if (document.getElementById('yournoteon').innerHTML
										.indexOf("Current Notes") != -1) {
									varinput = document
											.getElementById('yournoteon').innerHTML
											+ now.getMilliseconds();
									varinput = "Archives::" + varinput;
								} else {
									varinput = document
											.getElementById('yournoteon').innerHTML;
									varinput = "Archives::" + varinput;
								}

								key1 = varinput;
								var value = window.localStorage.setItem(key1,
										value);
							}
							if (key.indexOf("Archives::") == -1) {
								key = "Archives" + "::" + key;
							}
							var nots = localStorage.getItem(key);
							window.localStorage.setItem("notes::title", key);

							window.localStorage.setItem("notes", nots);
							localStorage.removeItem(key);
							deletebadge();
							try {
								klk = document.getElementById('yournoteon').innerHTML;
							} catch (err) {
								window.location.reload();
							}
							if (key.indexOf("Archives::") != -1) {

								var tlx = key.split("::");
								document.getElementById('yournoteon').innerHTML = tlx[1];
							} else {
								document.getElementById('yournoteon').innerHTML = key;
							}

							$
									.jGrowl(chrome.i18n
											.getMessage("auto_notes_current_note_is_save_and_this_is_current"));

							if (document.getElementById('notes').innerHTML
									.indexOf("><td><h1><b></b></h1></td></tr></tbody>") != -1) {

								document.getElementById('notes').innerHTML = window.localStorage
										.getItem("notes");
								window.location.reload();
							}
							document.getElementById('notes').innerHTML = window.localStorage
									.getItem("notes");
							initLoad();
							alert(document.getElementById('nonotes').innerText);

						});

	}

}

function hil(obj) {
	$(obj).addClass('hilight');
}

function nothil(obj) {
	$(obj).removeClass('hilight');

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

function printNote() {
	w = window.open();
	w.document.write($('#notes').html());
	w.print();
	w.close();

}

function reload() {
	var ele = document.getElementById("floating-menu-formatting-id");
	ele.style.display = "run-in";
}

function onmoud() {
	$("#hidebutton").removeClass("invisible");
	$("#hidearchivebutton").removeClass("invisible");
}

function hidebutton() {
	$("#hidebutton").addClass("invisible");
	$("#hidearchivebutton").addClass("invisible");
}

////added ffor manifest 2
$(function() {

	$("#savenotetodoc").click(function() {
		save_savednotes_doc();
	});
	$("#deleteGoogledocs")
			.click(
					function() {

						var n = $('input:checkbox[name="googledocs[]"]:checked').length;
						if (n == 0) {
							$.jGrowl("Please select a note.");
							return;
						}

						jConfirm(
								'Are you sure, you want to delete selected notes?',
								'',
								function(r) {
									if (r) {

										$(
												'input:checkbox[name="googledocs[]"]:checked')
												.each(
														function(index) {
															localStorage
																	.removeItem($(
																			this)
																			.val());
															// deletebadge();
															$
																	.jGrowl($(
																			this)
																			.val()
																			+ " "
																			+ chrome.i18n
																					.getMessage("auto_notes_is_removed"));
														});
										initLoad();
										$('#saved_doc').html(
												showSavedGoogledocs());

									}
								});

					});

	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var value = window.localStorage.getItem("notes");
	gettitle = window.localStorage.getItem("notes::title");
	if (gettitle.indexOf("Archives::") != -1) {

		var tlx = gettitle.split("::");
		newtitle = tlx[1];

	} else {
		newtitle = gettitle;
	}
	if (value == "" || value == null) {
		$("#tdscript")
				.html(
						'<table id="notes"><tr bgcolor="#FFFFFF" ><td id="nonotes"><b></b></td></tr></table>');
	} else {
		// document.write('<table id="hidebutton" class="invisible" onmouseover="onmoud();"  align="right"><td><button onClick="ArchieveAll();" title="Archive the current notes and start new.">'+ chrome.i18n.getMessage("Create_Archive")+'</button></td><td><button onClick="Goto();" title="Edit current notes.">'+chrome.i18n.getMessage("Edit_notes")+'</button></td><td><button onClick="delcurrent();" title="Remove current note.">Remove</td></tr></table>	');
		//document.write('<table id="hidebutton" class="invisible" onmouseover="onmoud();"  align="right"><td><button onClick="ArchieveAll();" title="Archive the current notes and start new.">Save</button></td><td><button onClick="Goto();" title="Edit current notes.">Edit</button></td><td><button onClick="delcurrent();" title="Remove current note.">Remove</td></tr></table>	');
		$("#tdscript")
				.html(
						'<table  id="currentnote" align="center" "><tr><td><div id="page_title" style="padding: 5px;"><!--<th id="yournoteon">'
								+ newtitle
								+ '</th>--></div></td>'
								+ '<table id="notes" width="700"   ><tr bgcolor="#FFFFFF" ><td ><div  id="cedit">'
								+ value + '</div></td></tr></table>');
	}

	$("#accordion").accordion({
		collapsible : true,
		active : false
	});
	initLoad();

	$('#floating-menu-formatting-id,#header').mouseover(function() {
		hidebutton();
	});
	$('#notification').click(function() {
		$('#marq').toggle();
	});

	$('#hideFormatbar').click(function() {
		hideFormatBar();
	});
	$('#showFormatbar').click(function() {
		showFormatBar();
	});
	$('#hidebutton,#currentnote,#notes').mouseover(function() {
		onmoud();
	});
	$('#ArchieveAll').click(function() {
		ArchieveAll();
	});
	$('#Goto').click(function() {
		Goto();
	});

	$('#delcurrent').click(function() {
		delcurrent();
	});
	$('#hidearchivebutton').click(function() {
		onmoud();
	});
	$('#deleteArchieve').click(function() {
		deleteArchieve();
	});

	$('#renameArchieve').click(function() {
		renameArchieve();
	});
	$('#makeCurrentNote').click(function() {
		makeCurrentNote();
	});
	$('#pairs').click(function() {
		onmoud();
	});
	$("#notes").css("margin-left", "-130");
	$('#pairs,#Head,#showArchieve').mouseover(function() {
		onmoud();
	});

	$('#saved_doc').html(showSavedGoogledocs());
	$('#notes').keyup(
			function(event) {

				window.localStorage.setItem("notes", document
						.getElementById('cedit').innerHTML);

			});

	$('#notes').focusout(
			function() {
				window.localStorage.setItem("notes", document
						.getElementById('cedit').innerHTML);

			});

	$("#savein_gdoc").click(
			function() {
				if (document.getElementById('yournoteon').innerHTML
						.indexOf("Current Notes") != -1) { //+now.getMilliseconds();
					contenti = $('<div/>').html(value).text();
					varinput = contenti.split(/\b/)[0] + " "
							+ contenti.split(/\b/)[1] + " "
							+ contenti.split(/\b/)[2] + " "
							+ contenti.split(/\b/)[3] + " "
							+ contenti.split(/\b/)[4] + " "
							+ contenti.split(/\b/)[5] + " "
							+ contenti.split(/\b/)[6] + "-By_AutoNotes";
				} else {
					varinput = document.getElementById('yournoteon').innerHTML
							+ "-By_AutoNotes";
				}
				jPrompt('Save notes as:', varinput.replace(/\s/g, ''), '',
						function(r) {
							if (r) {
								title = r;
								gdocs.createDoc();
							}
						});

			});
	$('#mailto').click(function() {
		_mailto();
	});

	$('#printnotes').click(function() {
		printNote();
	});

	$('a:[href="#"]').click(function() {
		if (this.title) {

			showData(this);

		}

	});
	var bgPage = chrome.extension.getBackgroundPage();
	if (bgPage.oauth.hasToken()) {
		$("#log").css('display', 'block');
		$('#log').click(function() {
			bgPage.logout();
			document.getElementById("log").innerHTML = '';
		});
	}

	$("#DownloadasHtml,#DownloadasDoc,#DownloadasPdf")
			.click(
					function() {
						var n = $('input:checkbox[name="googledocs[]"]:checked').length;
						if (n == 0) {
							$.jGrowl("Please select atleast one saved note.");
							return;
						}

						if (this.id == "DownloadasHtml") {
							$('input:checkbox[name="googledocs[]"]:checked')
									.each(
											function(index) {

												key = $(this).val();
												window.open(localStorage
														.getItem(key).split(
																":::")[1]
														+ "&format=html");

											});

						} else if (this.id == "DownloadasPdf") {

							$('input:checkbox[name="googledocs[]"]:checked')
									.each(
											function(index) {

												key = $(this).val();
												window.open(localStorage
														.getItem(key).split(
																":::")[1]
														+ "&format=pdf");
											});
						} else {
							$('input:checkbox[name="googledocs[]"]:checked')
									.each(
											function(index) {

												key = $(this).val();
												window.open(localStorage
														.getItem(key).split(
																":::")[1]
														+ "&format=doc");
											});

						}

					});

});

function ArchieveAll() {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	var date = now.getDate();
	var day = now.getDay();
	var rmonth = [ "January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December" ];
	dateTime = rmonth[month] + " " + date + ", " + year + ':' + now.getHours()
			+ ':' + now.getMinutes() + ':' + now.getSeconds();
	;
	var value = window.localStorage.getItem("notes");
	if (value == "") {
		hidebutton();
		return;
	}
	if (document.getElementById('yournoteon').innerHTML
			.indexOf("Current Notes") != -1) { //+now.getMilliseconds();
		contenti = $('<div/>').html(value).text();
		varinput = contenti.split(/\b/)[0] + " " + contenti.split(/\b/)[1]
				+ " " + contenti.split(/\b/)[2] + " " + contenti.split(/\b/)[3]
				+ " " + contenti.split(/\b/)[4] + " " + contenti.split(/\b/)[5]
				+ " " + contenti.split(/\b/)[6];
	} else {
		varinput = document.getElementById('yournoteon').innerHTML;
	}
	jPrompt(
			'Save notes as:',
			varinput.replace(/\s/g, ''),
			'',
			function(r) {
				if (r) {

					if (!checknameexist(r)) {
						return;
					}
					var value = window.localStorage.getItem("notes");
					if (value == "" || value == null) {
						hidebutton();
						return;
					}
					key1 = "Archives" + "::" + r.replace(/\s/g, '');
					;
					var value = window.localStorage.setItem(key1, value);
					window.localStorage
							.setItem("notes::title", "Current Notes");
					var key = "";
					var pairs = "<table style='margin-top: 40;margin-left: -10;'><tr><th></th></tr>\n";
					var i = 0;
					for (i = 0; i <= localStorage.length - 1; i++) {
						key = localStorage.key(i);
						if (key.indexOf("Archives::") != -1) {
							var mySplitResult = key.split("::")
							pairs += '<tr><td><input class="tabledata"  name="attribute[]" type="checkbox" value="'
									+ key
									+ '" title="'
									+ mySplitResult[1]
									+ '"   ><a href="#" title="'
									+ mySplitResult[1]
									+ '">'
									+ mySplitResult[1] + '</a></td></tr>\n'; //onClick="showData(this);" onmouseover="hil(this);" onmouseout="nothil(this);" 

						} else if (key.indexOf("Archives") != -1) {

							pairs += '<tr><td><input class="tabledata"  name="attribute[]" type="checkbox" value="'
									+ key
									+ '" title='
									+ key
									+ '  ><a href="#" title="'
									+ key
									+ '">'
									+ key + '</a></td></tr>\n'; //onClick="showData(this);" onmouseover="hil(this);" onmouseout="nothil(this);" 
						}

					}
					if (pairs == "<tr><th></th></tr>\n") {
						pairs += "<tr><td><i>empty</i></td>\n</tr>\n";
					}
					pairs += "</table>";
					document.getElementById('pairs').innerHTML = pairs;
					var value = window.localStorage.setItem("notes", "");
					document.getElementById('currentnote').innerHTML = "";
					$("#notes").css("margin-left", "-130");
					document.getElementById('notes').innerHTML = '<tr bgcolor="#FFFFFF" ><td><h3 style="margin-top: 40px;"><b>Note Saved "'
							+ r + '"</b></h3></td></tr>';
					addbadge();
					$.jGrowl(mySplitResult[1] + " "
							+ chrome.i18n.getMessage("auto_notes_saved"));
					$('a').unbind('click');
					$('a[href="#"]').click(function() {
						if (this.title) {
							showData(this);
						}
					});
				}
			});

}

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
	var pairs = "<tr><th style=''></th></tr>\n";
	var i = 0;
	for (i = 0; i <= localStorage.length - 1; i++) {
		key = localStorage.key(i);
		if (key.indexOf("Archives::") != -1) {
			var mySplitResult = key.split("::")
			pairs += '<tr><td><input class="tabledata"  name="attribute[]" type="checkbox" value="'
					+ key
					+ '"><a href="#" title="'
					+ mySplitResult[1]
					+ '"    >' + mySplitResult[1] + '</a></td></tr>\n'; //onClick="showData(this);" onmouseover="hil(this);" onmouseout="nothil(this);"

		} else if (key.indexOf("Archives") != -1) {

			pairs += '<tr><td><input class="tabledata"  name="attribute[]" type="checkbox" value="'
					+ key
					+ '"><a href="#" title='
					+ key
					+ '>'
					+ key
					+ '</a></td></tr>\n'; // onClick="showData(this);" onmouseover="hil(this);" onmouseout="nothil(this);" 
		}

	}
	if (pairs == "<tr><th></th></tr>\n") {
		pairs += "<tr><td><i>empty</i></td>\n</tr>\n";
	}
	document.getElementById('pairs').innerHTML = pairs;
	$('a').unbind('click');
	$('a[href="#"]').click(function() {
		if (this.title) {
			showData(this);
		}
	});
	$("#notes").css("margin-left", "-130");

}
String.prototype.fulltrim = function() {
	return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '')
			.replace(/\s+/g, ' ');
}

function _mailto(sub, body) {
	if (document.getElementById('notes').innerText == null) {
		jAlert('Current note is empty.', '');
		return;
	} else {
		body = document.getElementById('notes').innerText;
	}
	try {
		if (document.getElementById('yournoteon').innerText == null) {
			sub = "";
		} else {
			sub = document.getElementById('yournoteon').innerText;
		}
	} catch (Exception) {
		sub = "";
	}
	if (body.length > 1000) {
		jAlert('Character limit reached for send email feature, kindly check.',
				'');
		return;
	}
	sub = encodeURIComponent(sub);
	body = encodeURIComponent(body);
	;
	chrome.tabs.create({
		"url" : "mailto:someone@domain.com?subject=" + sub + "&body=" + body
				+ ""
	});
}

function showSavedGoogledocs() {
	var i = 0;
	var pairs = "<table style='margin-top: 20;margin-left:-180px'><tr><th style='padding:22px;'></th></tr>";
	for (i = 0; i <= localStorage.length - 1; i++) {
		key = localStorage.key(i);
		if (key.indexOf("Document::") != -1) {
			var mySplitResult = key.split("::")
			pairs += '<tr><td><input class="tabledata"  name="googledocs[]" type="checkbox" value="'
					+ key
					+ '"><a target="_blank" href="'
					+ localStorage.getItem(key).split(":::")[0]
					+ '" title="'
					+ mySplitResult[1]
					+ '"    >'
					+ mySplitResult[1]
					+ '</a></td></tr>\n'; //onClick="showData(this);" onmouseover="hil(this);" onmouseout="nothil(this);"

		} else if (key.indexOf("Document") != -1) {

			pairs += '<tr><td><input class="tabledata"  name="googledocs[]" type="checkbox" value="'
					+ key
					+ '"><a target="_blank" href="'
					+ localStorage.getItem(key).split(":::")[0]
					+ '" title='
					+ key + '>' + key + '</a></td></tr>\n'; // onClick="showData(this);" onmouseover="hil(this);" onmouseout="nothil(this);" 
		}

	}
	return pairs + "</table>";
}
