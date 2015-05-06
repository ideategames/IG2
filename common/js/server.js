IGisIGServer = true

// --
// -- server switch to allow debugging
// --

// this is the AWS IdeateGames server
// var server = "54.167.199.174"

// this is my desktop server for marques42.tk
var server = "67.183.64.43"
aids = {Strings: '1580562312186768', Buckets: '753496904745456', Squares: '1383415398637351', Stacks: '', Doors: '1379064372407372', Paths: ''}


var IGuseFB = true
function IGloadFBjs() {
	IGconsole("loading FB for "+IGgameApp)
  window.fbAsyncInit = function() {
    FB.init({
      appId      : aids[IGgameApp],
      status : true,
      xfbml      : true,
      version    : 'v2.2'
    });
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}
if (IGuseFB) {IGloadFBjs()}
