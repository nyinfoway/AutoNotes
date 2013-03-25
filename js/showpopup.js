/*
 * Return key shift,ctrl,alt
 * 
 */
function returnKey(charCode) {
	if (charCode == 16) {
		return "SHIFT";
	} else if (charCode == 17) {
		return "CTRL";
	} else if (charCode == 18) {
		return "ATL";
	}
	return "None";
}

/*
 * Show shortcut key details on pop up page
 * 
 */
chrome.extension
		.sendRequest(
				{
					method : "shortkey"
				},
				function(response) {

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
					var optChar = (response.optChar) ? response.optChar : '79';
					var optFunc = (response.optFunc) ? response.optFunc : '18';
					var custnoteschar = (response.custnoteschar) ? response.custnoteschar
							: '67';
					var custnotes = (response.custnotes) ? response.custnotes
							: '18';
					var a = returnKey(copyFunc);
					var b = chrome.i18n
							.getMessage("option_extension_copy_notes");
					var c = String.fromCharCode(copyChar);
					var custnotes_char_t = key[custnotes] + "+"
							+ String.fromCharCode(custnoteschar);
					var pairs = '<td><b>' + b
							+ '</b></td><td><span class="option-val">' + a
							+ " + " + c + '</span> </td>';
					document.getElementById('no1').innerHTML = pairs;

					var a = "";
					var b = chrome.i18n
							.getMessage("option_extension_auto_enabled");
					if (localStorage.getItem("check") == null) {
						c = "false";
					} else {
						c = localStorage.getItem("check");

					}

					var pairs = '<td><b>'
							+ b
							+ '</b></td><td><input type=checkbox id=autocopy ><span class="option-val">'
							+ a
							// + c.toUpperCase()
							+ '</span> </td>';
					document.getElementById('no2').innerHTML = pairs;

					/*
					 * a=returnKey(clearFunc);b=chrome.i18n.getMessage("option_extension_delete_notes");c=String.fromCharCode(clearChar);
					 * pairs='<td>'+b+'</td><td><span class="option-val">'+
					 * a+" + "+c+'</span></td>';
					 * document.getElementById('no2').innerHTML = pairs;
					 */
					a = returnKey(showFunc);
					b = chrome.i18n.getMessage("option_extension_show_notes");
					c = String.fromCharCode(showChar);
					pairs = '<td><b>' + b
							+ '</b></td><td><span class="option-val">' + a
							+ " + " + c + '</span></td>';
					document.getElementById('no3').innerHTML = pairs;
					a = returnKey(optFunc);
					b = chrome.i18n.getMessage("option_extension_Option_page");
					c = String.fromCharCode(optChar);
					pairs = '<td><b>'
							+ b
							+ '</b>:</td><td><span class="option-val"><a href="options.html" target=_blank>'
							+ a + " + " + c + '</a></span></a></td>';
					document.getElementById('no4').innerHTML = pairs;
					var custnotes_char_t = returnKey(custnotes) + "+"
							+ String.fromCharCode(custnoteschar);
					pairs = '<td><b>Manual Notes</b>:</td><td><span class="option-val">'
							+ custnotes_char_t + '</span></td>';
					document.getElementById('no5').innerHTML = pairs;
				});

/*
 * Autocopy checkbox
 * 
 */
function autocopy() {
	c = localStorage.getItem("check");
	if (c.indexOf("true") != -1) {

		document.getElementById("autocopy").checked = true;
	}

	$("#autocopy").change(function() {

		if ($("#autocopy").attr("checked") == "checked") {
			localStorage.setItem("check", "true");
		} else {
			localStorage.setItem("check", "false");
		}
		window.location.reload();
	});

}

$(document).ready(function() {
	setTimeout(function() {
		autocopy();
	}, 500);
});
