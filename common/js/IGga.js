//
// IGga.js
//
// This file is the Google Analytics for IdeateGames
//
// It should be included in every html file
//

// this is to catch function calls from local sites
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
function IGga() {
	console.log("This is the ga file at "+window.location.host)
	// for analytics
	// only do this for ideategames.org
	//
	if (window.location.host.indexOf("ideategames")>-1) {

		ga('create', 'UA-53888584-1', 'auto');
		ga('send', 'pageview');
	} else {
		console.log("Not IG");
		ga = function(cmd,typ,cat, act, lab) {console.log("not ga: "+cmd+":"+typ+":"+cat+":"+act+":"+lab);return;}
	}
}
////////