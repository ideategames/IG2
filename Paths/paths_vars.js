//
// paths_vars.js
//
// variables for the Paths variants
//

var libnum = 'library1'
var title

var evDates = []
var iimgstxt = []

var pidxs = []
var pevents = []
var evDescriptions = []
var targs = []
var doorev = []
//
// set the 'door' coordinates for each library image
//
var nodes = []
var startingRoom
var nodeimgs = []
var nodeevents = []
// these hold the dates for each room, indexed by date
var datenodes = {}
// these hold all the dates so they can be sorted
var sortdates = []
var revcenter // have to set this at runtime because of scaling
var libs = []
// evidx2lib keys are event idxs, values are libraries
var evidx2lib = {}
var descr = ""
var dhead = ""
var objidxs = []
var objdates = []
var date2idx = {}
var checkboxes = {}
var sack, bookStand
var penaltyMsg
var backBut
var mission
var helpBut
var hint
var steps = 0
var DMMisDone = false
var hideMapBut
var countSteps = false
DMMobsShelved = []
DMMobsCollected = []


var pid2shuff = []
var shuffrooms = []
var shuffLoc,descLoc,bookLoc,doorLoc,handLoc

var clue = "location"
var overview ="description"
var objsrc = 'objects'

var touchedEv

var pevent1,pevent2,pevent3,pevent4,pevent5,pevent6,pevent7,pevent8,pevent9
var pevents = [pevent1,pevent2,pevent3,pevent4,pevent5,pevent6,pevent7,pevent8,pevent9]

var bot

function showMap(btn) {
	if (btn.hide) {
		btn.hide = false
		IGnetworkGraph(false)
		hideMapBut.visible = false
	} else {
		IGnetworkGraph(rooms,daterooms[sortdates[0]],libnum)
		btn.hide = true
		hideMapBut.visible = true
	}
}

DMMcompLevel = 1
