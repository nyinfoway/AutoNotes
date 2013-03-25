var util = {};
var gdocs = {};

var bgPage = chrome.extension.getBackgroundPage();
var pollIntervalMax = 1000 * 60 * 60; // 1 hour
var requestFailureCount = 0; // used for exponential backoff
var requestTimeout = 1000 * 2; // 5 seconds

var DEFAULT_MIMETYPES = {
	'atom' : 'application/atom+xml',
	'document' : 'text/html',
	'spreadsheet' : 'text/csv',
	'presentation' : 'text/plain',
	'pdf' : 'application/pdf'
};

/**
 * Class to compartmentalize properties of a Google document.
 * 
 * @param {Object}
 *            entry A JSON representation of a DocList atom entry.
 * @constructor
 */
gdocs.GoogleDoc = function(entry) {
	this.entry = entry;
	this.title = entry.title.$t;
	this.resourceId = entry.gd$resourceId.$t;
	this.type = gdocs.getCategory(entry.category,
			'http://schemas.google.com/g/2005#kind');
	this.starred = gdocs.getCategory(entry.category,
			'http://schemas.google.com/g/2005/labels',
			'http://schemas.google.com/g/2005/labels#starred') ? true : false;
	this.link = {
		'alternate' : gdocs.getLink(entry.link, 'alternate').href
	};
	this.contentSrc = entry.content.src;
	document.getElementById("notes").innerHTML = "<a target='_blank' href='"
			+ gdocs.getLink(entry.link, 'alternate').href + "'>" + this.title
			+ " " + "  <b>Document Created!</b>";
	$("#notes").css("margin-left", "0");
	document.getElementById("yournoteon").innerHTML = " ";
	localStorage.removeItem("notes");
	$.jGrowl(this.title + " " + "document is created.");

};
gdocs.GoogleDoc1 = function(entry) {
	this.entry = entry;
	this.title = entry.title.$t;
	this.resourceId = entry.gd$resourceId.$t;
	this.type = gdocs.getCategory(entry.category,
			'http://schemas.google.com/g/2005#kind');
	this.starred = gdocs.getCategory(entry.category,
			'http://schemas.google.com/g/2005/labels',
			'http://schemas.google.com/g/2005/labels#starred') ? true : false;
	this.link = {
		'alternate' : gdocs.getLink(entry.link, 'alternate').href
	};
	this.contentSrc = entry.content.src;
	// document.getElementById("notes").innerHTML="<a target='_blank'
	// href='"+gdocs.getLink(entry.link, 'alternate').href+"'>"+this.title+" "+"
	// <b>Document Created!</b>";
	// document.getElementById("yournoteon").innerHTML=" ";
	// localStorage.removeItem("notes");
	$.jGrowl(this.title + " " + "document is created.");

};
/**
 * Sets up a future poll for the user's document list.
 */
util.scheduleRequest = function() {
	var exponent = Math.pow(2, requestFailureCount);
	var delay = Math.min(bgPage.pollIntervalMin * exponent, pollIntervalMax);
	delay = Math.round(delay);

	if (bgPage.oauth.hasToken()) {
		var req = bgPage.window.setTimeout(function() {
			gdocs.getDocumentList();
			util.scheduleRequest();
		}, delay);
		bgPage.requests.push(req);
	}
};

/**
 * Urlencodes a JSON object of key/value query parameters.
 * 
 * @param {Object}
 *            parameters Key value pairs representing URL parameters.
 * @return {string} query parameters concatenated together.
 */
util.stringify = function(parameters) {
	var params = [];
	for ( var p in parameters) {
		params.push(encodeURIComponent(p) + '='
				+ encodeURIComponent(parameters[p]));
	}
	return params.join('&');
};

/**
 * Creates a JSON object of key/value pairs
 * 
 * @param {string}
 *            paramStr A string of Url query parmeters. For example:
 *            max-results=5&startindex=2&showfolders=true
 * @return {Object} The query parameters as key/value pairs.
 */
util.unstringify = function(paramStr) {
	var parts = paramStr.split('&');

	var params = {};
	for ( var i = 0, pair; pair = parts[i]; ++i) {
		var param = pair.split('=');
		params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
	}
	return params;
};

/**
 * Utility for displaying a message to the user.
 * 
 * @param {string}
 *            msg The message.
 */
util.displayMsg = function(msg) {
	$('#butter').removeClass('error').text(msg).show();
};

/**
 * Utility for removing any messages currently showing to the user.
 */
util.hideMsg = function() {
	$('#butter').fadeOut(1500);
};

/**
 * Utility for displaying an error to the user.
 * 
 * @param {string}
 *            msg The message.
 */
util.displayError = function(msg) {
	util.displayMsg(msg);
	$('#butter').addClass('error');
};

/**
 * Returns the correct atom link corresponding to the 'rel' value passed in.
 * 
 * @param {Array
 *            <Object>} links A list of atom link objects.
 * @param {string}
 *            rel The rel value of the link to return. For example: 'next'.
 * @return {string|null} The appropriate link for the 'rel' passed in, or null
 *         if one is not found.
 */
gdocs.getLink = function(links, rel) {
	for ( var i = 0, link; link = links[i]; ++i) {
		if (link.rel === rel) {
			return link;
		}
	}
	return null;
};

/**
 * Returns the correct atom category corresponding to the scheme/term passed in.
 * 
 * @param {Array
 *            <Object>} categories A list of atom category objects.
 * @param {string}
 *            scheme The category's scheme to look up.
 * @param {opt_term?}
 *            An optional term value for the category to look up.
 * @return {string|null} The appropriate category, or null if one is not found.
 */
gdocs.getCategory = function(categories, scheme, opt_term) {
	for ( var i = 0, cat; cat = categories[i]; ++i) {
		if (opt_term) {
			if (cat.scheme === scheme && opt_term === cat.term) {
				return cat;
			}
		} else if (cat.scheme === scheme) {
			return cat;
		}
	}
	return null;
};

/**
 * A generic error handler for failed XHR requests.
 * 
 * @param {XMLHttpRequest}
 *            xhr The xhr request that failed.
 * @param {string}
 *            textStatus The server's returned status.
 */
gdocs.handleError = function(xhr, textStatus) {
	util.displayError('Failed to fetch docs. Please try again.');
	++requestFailureCount;
};

/**
 * A helper for constructing the raw Atom xml send in the body of an HTTP post.
 * 
 * @param {XMLHttpRequest}
 *            xhr The xhr request that failed.
 * @param {string}
 *            docTitle A title for the document.
 * @param {string}
 *            docType The type of document to create. (eg. 'document',
 *            'spreadsheet', etc.)
 * @param {boolean?}
 *            opt_starred Whether the document should be starred.
 * @return {string} The Atom xml as a string.
 */
gdocs.constructAtomXml_ = function(docTitle, docType, opt_starred) {
	var starred = opt_starred || null;

	var starCat = [
			'<category scheme="http://schemas.google.com/g/2005/labels" ',
			'term="http://schemas.google.com/g/2005/labels#starred" ',
			'label="starred"/>' ].join('');

	var atom = [ "<?xml version='1.0' encoding='UTF-8'?>",
			'<entry xmlns="http://www.w3.org/2005/Atom">',
			'<category scheme="http://schemas.google.com/g/2005#kind"',
			' term="http://schemas.google.com/docs/2007#', docType, '"/>',
			starred ? starCat : '', '<title>', docTitle, '</title>', '</entry>' ]
			.join('');
	return atom;
};

/**
 * A helper for constructing the body of a mime-mutlipart HTTP request.
 * 
 * @param {string}
 *            title A title for the new document.
 * @param {string}
 *            docType The type of document to create. (eg. 'document',
 *            'spreadsheet', etc.)
 * @param {string}
 *            body The body of the HTTP request.
 * @param {string}
 *            contentType The Content-Type of the (non-Atom) portion of the http
 *            body.
 * @param {boolean?}
 *            opt_starred Whether the document should be starred.
 * @return {string} The Atom xml as a string.
 */
gdocs.constructContentBody_ = function(title, docType, body, contentType,
		opt_starred) {
	var body = [ '--END_OF_PART\r\n',
			'Content-Type: application/atom+xml;\r\n\r\n',
			gdocs.constructAtomXml_(title, docType, opt_starred), '\r\n',
			'--END_OF_PART\r\n', 'Content-Type: ', contentType, '\r\n\r\n',
			body, '\r\n', '--END_OF_PART--\r\n' ].join('');
	return body;
};

/**
 * Creates a new document in Google Docs.
 */
gdocs.createDoc = function() {
	var content = localStorage.getItem("notes");// $('#doc_content').val();
	var starred = false;// $('#doc_starred').is(':checked');
	var docType = "document";// $('#doc_type').val();

	util.displayMsg('Creating doc...');
	$("#savein_gdoc").html(
			'<span class="ui-button-text">Creating doc...</span>');

	var handleSuccess = function(resp, xhr) {
		bgPage.docs.splice(0, 0, new gdocs.GoogleDoc(JSON.parse(resp).entry));
		y = new gdocs.GoogleDoc(JSON.parse(resp).entry);
		localStorage.setItem("Document::" + y.title, y.link.alternate + ":::"
				+ y.contentSrc);
		$('#saved_doc').html(showSavedGoogledocs());
		$("#savein_gdoc").html(
				'<span class="ui-button-text">Save in Google Doc</span>');
		util.displayMsg('Document created!');

		// document.getElementById("log").innerHTML='<button onClick="logout();"
		// class="ui-button ui-widget ui-state-default ui-corner-all
		// ui-button-text-only" role="button" aria-disabled="false"><span
		// class="ui-button-text">Log Off</span></button>';
		requestFailureCount = 0;
		window.open(y.link.alternate);
	};

	var params = {
		'method' : 'POST',
		'headers' : {
			'GData-Version' : '3.0',
			'Content-Type' : 'multipart/related; boundary=END_OF_PART',
		},
		'parameters' : {
			'alt' : 'json'
		},
		'body' : gdocs.constructContentBody_(title, docType, content,
				DEFAULT_MIMETYPES[docType], starred)
	};

	// Presentation can only be created from binary content. Instead, create a
	// blank presentation.
	if (docType === 'presentation') {
		params['headers']['Content-Type'] = DEFAULT_MIMETYPES['atom'];
		params['body'] = gdocs.constructAtomXml_(title, docType, starred);
	}
	try {
		bgPage.oauth.sendSignedRequest(bgPage.DOCLIST_FEED, handleSuccess,
				params);

	} catch (err) {

		util.displayMsg('Permission pending...');
		$("#savein_gdoc").html(
				'<span class="ui-button-text">Permission pending...</span>');
		bgPage.oauth.authorize(function() {
			util.scheduleRequest();
			gdocs.createDoc();
		});
	}

};

function createSavedNotesDoc(content) {

	var starred = false;// $('#doc_starred').is(':checked');
	var docType = "document";// $('#doc_type').val();

	$("#savenotetodoc").html(
			'<span class="ui-button-text">Creating doc...</span>');

	var handleSuccess1 = function(resp, xhr) {
		bgPage.docs.splice(0, 0, new gdocs.GoogleDoc1(JSON.parse(resp).entry));
		y = new gdocs.GoogleDoc1(JSON.parse(resp).entry);
		localStorage.setItem("Document::" + y.title, y.link.alternate + ":::"
				+ y.contentSrc);
		$('#saved_doc').html(showSavedGoogledocs());
		$("#savenotetodoc").html(
				'<span class="ui-button-text">Save in Google Doc</span>');

		// document.getElementById("log").innerHTML='<button onClick="logout();"
		// class="ui-button ui-widget ui-state-default ui-corner-all
		// ui-button-text-only" role="button" aria-disabled="false"><span
		// class="ui-button-text">Log Off</span></button>';
		requestFailureCount = 0;
		window.open(y.link.alternate);
	};

	var params = {
		'method' : 'POST',
		'headers' : {
			'GData-Version' : '3.0',
			'Content-Type' : 'multipart/related; boundary=END_OF_PART',
		},
		'parameters' : {
			'alt' : 'json'
		},
		'body' : gdocs.constructContentBody_(title, docType, content,
				DEFAULT_MIMETYPES[docType], starred)
	};

	// Presentation can only be created from binary content. Instead, create a
	// blank presentation.
	if (docType === 'presentation') {
		params['headers']['Content-Type'] = DEFAULT_MIMETYPES['atom'];
		params['body'] = gdocs.constructAtomXml_(title, docType, starred);
	}
	try {
		bgPage.oauth.sendSignedRequest(bgPage.DOCLIST_FEED, handleSuccess1,
				params);

	} catch (err) {

		util.displayMsg('Permission pending...');
		$("#savenotetodoc").html(
				'<span class="ui-button-text">Permission pending...</span>');
		bgPage.oauth.authorize(function() {
			util.scheduleRequest();
			createSavedNotesDoc(content);
		});
	}

};
