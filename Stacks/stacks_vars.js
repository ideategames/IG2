//
// paths_vars.js
//
// variables for the Paths variants
//

var libnum = 'library1'
var	iimgsc = ['cimglib0','cimglib1','cimglib2','cimglib3','cimglib4','cimglib5','cimglib6',
			'cimglib7','cimglib8','cimglib9','cimglib10','cimglib11','cimglib12','cimglib13',
			'cimglib14','cimglib15','cimglib16','cimglib17','cimglib18','cimglib19','cimglib20']
var inames = []

var title

var idxs = []
var evDates = []
var iimgstxt = []

var pidxs = []
var pevents = []
var doorev = []
//
// set the 'door' coordinates for each library image
//
var doors
var rooms = []
var startingRoom
var roomimgs = []
var roomevents = []
// these hold the dates for each room, indexed by date
var daterooms = {}
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

// common functions
function penaltyOff() {
	penaltyMsg.visible = false
}
function showMap() {
	if (this.hide) {
		this.hide = false
		mapBut.setText("Show Map")
		IGdrawRoomMap(false)
		// IGnetworkGraph(false)
		IGhide(moreBtn,false)
		IGhide(descr,false)
		// descr.reset(descLoc.x, descLoc.y)
		// descr.style['background-color'] = null
	} else {
		// descr.style['background-color'] = "#3FA9F5"
		IGdrawRoomMap(rooms,libnum)
		// IGnetworkGraph(rooms,daterooms[sortdates[0]],libnum)
		this.hide = true
		mapBut.innerHTML = "Hide Map"
		IGhide(sackInst,true)
		IGhide(moreBtn,true)
		// descr.reset(0,ry(400), true)
		IGhide(descr,true)
	}
}
