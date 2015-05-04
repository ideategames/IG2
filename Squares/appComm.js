// -----------------------------------------------------------------------------------------
// --
// -- comm.lua
// --
// -----------------------------------------------------------------------------------------

var IGmadwiz = "Galileo"
var IGapp = "strings"
var IGgame = "squares"
var IGmydev = "984388448"
var alias = "dummy"
var DMMsender
function setSender(seed) {
	DMMsender = CryptoJS.SHA1(seed + CryptoJS.SHA1(IGmadwiz + seed))
}
DMMsender = CryptoJS.SHA1(IGmydev + CryptoJS.SHA1(IGmadwiz + IGmydev))
var stuffing = "&stuffing=" + CryptoJS.SHA1(CryptoJS.SHA1(IGapp + IGmadwiz + alias + IGgame) + alias + IGgame);

var DMMComm = []
DMMComm['message'] = []
