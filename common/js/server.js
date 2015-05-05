IGisIGServer = true

// --
// -- server switch to allow debugging
// --

// this is the AWS IdeateGames server
// var server = "54.167.199.174"

// this is my desktop server for marques42.tk
var server = "67.183.64.43"

var IGuseFB = true
function IGloadFBjs() {
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}
if (IGuseFB) {IGloadFBjs()}
