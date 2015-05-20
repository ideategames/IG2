//
//
// config.js
//
// configuration file for IG games
// 

IGisApp = false
IGisIGServer = false
IGuseFB = false

// this is my desktop server for marques42.tk
server = "67.183.64.43"


// this method to allow use on tablet file systems
// redefining the base path
var tmp = window.location.pathname;
// this won't work for iOS, have to search for something else, possibly .app
BasePath = (tmp.indexOf('www')>-1) ? tmp.substring(0,tmp.indexOf('www')+4) : "/"

CommonPath = (BasePath+"common/").replace("//","/")
ImgPath = (BasePath+"/stringsThumbs/").replace("//","/")
 