function onLoad() {
	ChromeExOAuth.initCallbackPage();
	setTimeout(
			function() {
				document.getElementById("stuck").innerHTML = "<font color=red>Check your computer time, if you have stuck here.</font>"
			}, 5000);

};
window.onload = onLoad;
// window.onload=function(){};