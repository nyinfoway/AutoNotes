var undo = new Array();
var n = window.localStorage.getItem("notes");
undo.push(n);

/*
 * When context menu is clicked onClickHandler is called.
 */
function onClickHandler(info, tab) {

	if (info.menuItemId == "captururl") {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {
				copyfnotes : 'captururl'
			}, function(response) {
			});
		});

	} else if (info.menuItemId == "autonotes") {
		if (localStorage.getItem("check") == "true") {
			try {
				var not = window.localStorage.getItem("undonotes");
				window.localStorage.setItem("notes", not);
			} catch (err) {
			}
		}
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {
				copyfnotes : 'copyformattednotes'
			}, function(response) {
			});
		});
	} else if (info.menuItemId == "opendialogue") {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {
				copyfnotes : 'opendialogue'
			}, function(response) {
			});
		});

	} else if (info.menuItemId == "opendialoguewithselectedtext") {

		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {
				copyfnotes : 'opendialoguewithtext'
			}, function(response) {
			});
		});

	}
	console.info("onclickhan");
};

var onlyonce = true;
if (onlyonce) {
	onlyonce = false;

	var contexts = [ "page", "selection" ];
	for ( var i = 0; i < contexts.length; i++) {
		var context = contexts[i];
		var title = "";
		var id = "";

		if (context == "selection") {
			title = "Copy notes to Auto Notes";
			id = "autonotes";
			var id = chrome.contextMenus.create({
				"title" : title,
				"contexts" : [ context ],
				id : id
			});
		} else if (context == "page") {
			title = "Copy page URL to Auto Notes";
			id = "captururl";
			var id = chrome.contextMenus.create({
				"title" : title,
				"contexts" : [ context ],
				id : id
			});
		} else if (context == "dialogue") {
			title = "Add custom notes to Auto Notes";
			id = "opendialogue";
			var id = chrome.contextMenus.create({
				"title" : title,
				"contexts" : [ "page" ],
				id : id
			});

		} else if (context == "dialogouetext") {
			title = "Add custom notes to Auto Notes";
			id = "opendialoguewithselectedtext";
			var id = chrome.contextMenus.create({
				"title" : title,
				"contexts" : [ "selection" ],
				id : id
			});

		}

	}
}

/*
 * Add click handler on context menu.
 */
chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.runtime.onInstalled.addListener(function() {

	var contexts = [ "page", "selection" ];
	for ( var i = 0; i < contexts.length; i++) {
		var context = contexts[i];

		var title = "Copy notes to Auto Notes";
		var id = chrome.contextMenus.create({
			"title" : title,
			"contexts" : [ context ],
			id : "autonotes"
		});

	}

});

var countcopy;
var tempDomainholder = "";
/*
 * Count the clipboard
 * 
 */
countcopy = window.localStorage.getItem("countcopy");
if (countcopy == null) {
	countcopy = 0;
}
chrome.browserAction.setBadgeText({
	text : String(countcopy)
});
chrome.browserAction.setBadgeBackgroundColor({
	color : [ 0, 200, 0, 100 ]
});
/*
 * Set browser action icon
 * 
 */
function changeicon() {

	chrome.browserAction.setIcon({
		path : "chromenotes-19.png"
	});

}
var tempmsg = "";
var tempurlcontainer = "";
/*
 * Listen for the content script to send a message to the background page.
 * 
 */

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	if (request.method == "shortkey") {
		sendResponse({
			copyFunc : localStorage['copyFunc'],
			copyChar : localStorage['copyChar'],
			clearFunc : localStorage['clearFunc'],
			clearChar : localStorage['clearChar'],
			showFunc : localStorage['showFunc'],
			showChar : localStorage['showChar'],
			optChar : localStorage['optChar'],
			optFunc : localStorage['optFunc'],

			custnoteschar : localStorage['custnoteschar'],
			custnotes : localStorage['custnotes']

		});

	}
	if (request.t == "count") {
		i = window.localStorage.getItem("count");
		i = Number(i) + Number(1);
		window.localStorage.setItem("count", i);
		if (i > 10) {
			window.localStorage.setItem("count", 9);
		}
		sendResponse({
			count : localStorage['count'],

		});

	}

	if (request.t == "stopcount") {

		window.localStorage.setItem("count", 9);

		sendResponse({
			count : localStorage['count'],

		});

	}

	if (request.method == "selectionkey") { // copying is done
		sendResponse({
			selection : localStorage['check']
		});

	}

	if (request.t == "delete") { // delete local storage
		window.localStorage.setItem("notes", "");
		window.localStorage.setItem("domain", "");

		chrome.tabs.getAllInWindow(undefined, function(tabs) {
			for ( var i = 0, tab; tab = tabs[i]; i++) {
				var text = tab.url;
				if ((text.indexOf("showNotes") != -1)
						&& (tab.title == "Auto Notes")) {
					chrome.tabs.reload(tab.id);
				}
				if ((text.indexOf("autoeditor") != -1)
						&& (tab.title == "Auto Notes Editor")) {
					chrome.tabs.reload(tab.id);

				}
			}
		});
		sendResponse({});
	}
	if (request.t == "my") {
		c("my");

		var not = window.localStorage.getItem("notes");
		window.localStorage.setItem("undonotes", not);

		var x = new Date();
		var month = x.getMonth() + 1;
		var dateTime = month + '/' + x.getDate() + '/' + x.getYear() + '  '
				+ x.getHours() + ':' + x.getMinutes() + ':' + x.getSeconds();
		var msg = "";
		if (window.localStorage.getItem("tempnotes") != request.data) {
			if (request.data.length < 1) {
				var tempdat = request.domain;
				window.localStorage.setItem("tempnotes", tempdat);
			} else {
				window.localStorage.setItem("tempnotes", request.data);
			}
			var ti = window.localStorage.getItem("domain");
			window.localStorage.setItem("domain", request.domain);

			if (request.title == "" || request.title == null) {
				var titlex = request.domain;
			} else {
				var titlex = request.title;
			}

			if (localStorage.getItem("distime") == "false"
					|| localStorage.getItem("distime") == null) {
			}
			if (localStorage.getItem("disurl") == "false") {
			}
			if (localStorage.getItem("notes") == null) {
				localStorage.setItem("notes", "");
			}
			if (window.localStorage.getItem("countcopy") == null) {
				window.localStorage.setItem("countcopy", 0);
			}

			if (request.data.length > 1) {
				if (tempDomainholder == request.domain) {
					c("1");
					tempDomainholder = request.domain;
					var tmpdata = request.data;
					if (tmpdata.length < 1) {
						tmpdata = "<a href='" + request.domain
								+ "' target=_blank >" + request.title + "</a>";
					}
					var savethenotes = '<div><br>' + tmpdata + '</br></div>';

				} else {
					c("2");
					tempDomainholder = request.domain;
					var tmpdata = request.data;
					dateTime = "";
					if (tmpdata.length < 1) {
						tmpdata = "<a href='" + request.domain
								+ "' target=_blank >" + request.title + "</a>";
						var savethenotes = '<div><br><a class="urlLink" href='
								+ request.domain + " "
								+ 'target="_blank" style="color: blueviolet;">'
								+ titlex + dateTime + ' </a></br></div>';
					} else {
						var savethenotes = '<div><br><a class="urlLink" href='
								+ request.domain + " "
								+ 'target="_blank" style="color: blueviolet;">'
								+ titlex + dateTime + ' </a></br><br>'
								+ request.data + '</br></div>';
					}

				}

			} else {

				if (tempurlcontainer != request.domain) {
					tempurlcontainer = request.domain;
					var tmpdata = "";
					tmpdata = "<a href='" + request.domain
							+ "' target=_blank >" + request.title + "</a>";
					var savethenotes = '<div><br>' + tmpdata + '</br></div>';

				} else {
					var savethenotes = "";
				}
			}

			msg = window.localStorage.getItem("notes");
			if (msg == null) {
				msg = savethenotes;
				c(msg);
			} else {
				c(msg);
				if (tempmsg != savethenotes) {
					msg = msg + savethenotes;
					tempmsg = savethenotes;
				}

			}

			window.localStorage.setItem("notes", msg);
			undo.push(msg);

			/*
			 * } else { if (window.localStorage.getItem("countcopy") == null) {
			 * window.localStorage.setItem("countcopy", 0); } var countcopy =
			 * window.localStorage.getItem("countcopy");
			 * 
			 * msg = window.localStorage.getItem("notes") + '<li>' +
			 * request.data + '</li>'; window.localStorage.setItem("notes",
			 * msg); }
			 */
		}
		chrome.tabs.getAllInWindow(undefined, function(tabs) {
			for ( var i = 0, tab; tab = tabs[i]; i++) {
				var text = tab.url;
				if ((text.indexOf("showNotes") != -1)
						&& (tab.title == "Auto Notes")) {
					chrome.tabs.reload(tab.id);

				}
				if ((text.indexOf("autoeditor") != -1)
						&& (tab.title == "Auto Notes Editor")) {
					chrome.tabs.reload(tab.id);

				}
			}
		});
		sendResponse({
			u : "ok"
		});
	}

});

chrome.extension.onRequest.addListener(onRequest);

function onRequest(request, sender, sendResponse) {

	if (request.greeting == "show") {
		chrome.tabs
				.getAllInWindow(
						undefined,
						function(tabs) {
							for ( var i = 0, tab; tab = tabs[i]; i++) {
								var text = tab.url;
								if ((text.indexOf("showNotes") != -1)
										&& (tab.title == "Auto Notes")) {
									// chrome.tabs.reload(tab.id);
									chrome.tabs.update(tab.id, {
										selected : true
									});
									return;
								} else if (((text.indexOf("options") != -1) && (tab.title == "Auto Notes Options"))
										|| ((text.indexOf("availableFeatures") != -1) && (tab.title == "Auto Notes Features"))
										|| ((text.indexOf("autoEditor") != -1) && (tab.title == "Auto Notes Editor"))
										|| ((text.indexOf("autoNotesFAQ") != -1) && (tab.title == "Auto Notes Frequently Asked Questions"))) {

									chrome.tabs.remove(tab.id,
											function callback() {
												chrome.tabs.create({
													url : "showNotes.html"
												});
												// window.open("showNotes.html");
												return;
											});
									return;
								}
							}
							chrome.tabs.create({
								url : "showNotes.html"
							});
						});
		sendResponse({});
	}
	if (request.greeting == "option") {
		chrome.tabs
				.getAllInWindow(
						undefined,
						function(tabs) {
							for ( var i = 0, tab; tab = tabs[i]; i++) {
								var text = tab.url;
								if ((text.indexOf("options") != -1)
										&& (tab.title == "Auto Notes Options")) {
									// chrome.tabs.reload(tab.id);
									chrome.tabs.update(tab.id, {
										selected : true
									});
									return;
								} else if (((text.indexOf("showNotes") != -1) && (tab.title == "Auto Notes"))
										|| ((text.indexOf("autoEditor") != -1) && (tab.title == "Auto Notes Editor"))
										|| ((text.indexOf("availableFeatures") != -1) && (tab.title == "Auto Notes Features"))
										|| ((text.indexOf("autoNotesFAQ") != -1) && (tab.title == "Auto Notes Frequently Asked Questions"))) {
									// chrome.tabs.reload(tab.id);
									chrome.tabs.remove(tab.id,
											function callback() {
												chrome.tabs.create({
													url : "options.html"
												});
												return;
											});
									return;
								}
							}
							chrome.tabs.create({
								url : "options.html"
							});
						});
		sendResponse({});
	}

};

/*
 * Show notes
 */
function showPrintableNotes(notes) {

	if (notes != null) {
		var x = new Date();
		var month = x.getMonth() + 1;

		var dateTime = month + '/' + x.getDate() + '/' + x.getYear() + '  '
				+ x.getHours() + ':' + x.getMinutes() + ':' + x.getSeconds();

		// get screen coordinates.
		var windowX = window.screen.width - 510;
		var windowY = window.screen.height - 500;

		top.wRef = window.open('', 'myconsole', 'width=500,height=450,left='
				+ windowX + ',top=' + windowY + +',menubar=1' + ',toolbar=0'
				+ ',status=1' + ',scrollbars=1' + ',resizable=1')
		top.wRef.document
				.writeln('<html><head><title>Your notes on:'
						+ dateTime
						+ '</title>'
						+ '</head>'
						+ '<body bgcolor=white onLoad="self.focus()"  >'
						+ '<center><font color=red><b><i><a href=# onclick="window.print();return false;">Print notes</a></i></b></font>'
						+ '<br/><b>Your notes on:'
						+ dateTime
						+ '</b>'
						+ '<br /></center></b> <table border=0 cellspacing=3 cellpadding=3>');

		var domainName = window.localStorage.getItem("domain");

		var temp = new Array();
		temp = domainName.split('(');
		var col = localStorage.getItem("color");

		if (col == null) {
			col = "#FFFFFF";
		}
		for (i = 0; i < temp.length; i++) {
			var value = window.localStorage.getItem(temp[i]);

			top.wRef.document.writeln('<tr bgcolor=' + col + '><td>' + value
					+ '</td></tr>');
		}
		top.wRef.document.writeln('</body></html>');
		top.wRef.document.close();
	}
}

function c(t) {
	//console.info(t);
}