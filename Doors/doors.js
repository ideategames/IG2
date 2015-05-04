/////////////////////////////////////////////////////////////////////
//
// doors.js
//
// core logic for the Doors (Collections) game
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//
/////////////////////////////////////////////////////////////////////

var notLoaded = true

var sackLoc, penLoc, urlLoc, bookLoc, descLoc, clueLoc, title, groupObjs, temptobj, tempidx, title2, stealItem, prevBtn,
	moreBtn, backMsg, descLen,bubbleW,columnW,centerW,helpTextLocal,currentObj,leftMask,upMask,rightMask,downMask
var masks = [leftMask,upMask,rightMask,downMask]
var titleLoc = {}
var daterooms = {}
var currentTitle = ""
var numSections = 5
var sect = []
var vbars = []
var prevRoom
var collected = {}
var animBloom
var bloomcnt = 0
var bloomObjs = []
var iimgstxt = []
var centerImg = {}
var APPmistakes = 0
var EventNumU = 0
// the number is meaningless here, has to be calculated
var minSteps = 8

var CleanupList = []

function DMMmenu() {
    IGendGame({msg:'You are in the middle of a game. Selecting any button but the first will abort this game.',
        fcns:{again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame',resumne:'IGresume'},small:true,nohead:true})
}
function APPrestart() {
    if ((EventVars[EventType])) {
        IGstartSpinner()
        game.state.start('doors',true,true)
    } else {APPnewGame()}
}
function APPnewGame() {
	loadURLExt({'url': '/launch/dindex.html?alias='+DMMalias})
}
function resetBars() {
	IGalerting = true
}

function PCchangeBackground() {
	if (IGwhite) {
		IGwhite = false
		game.state.start('cpaths',true,true)
	} else {
		IGwhite = true
		game.state.start('cpaths',true,true)
	}
}

function PCviewLeaderboard() {
	var packet = {query: "leaders",subject: Subjects[EventType2].replace(/ /g,"_")}
	DMMGetHttpRequest(packet,"leaders")
    function partB() {
    	if (IGactiveComm) {
    		window.setTimeout(partB,500)
    	} else {game.state.start('leaderboard',true,true)}

    }
    // the timeout is to be sure that the initial fetch of data above 
    // is completed before drawing the screen. 
    // Eventually, we will put a subject choice screen first, but this
    // is needed for now.
    window.setTimeout(partB,500)

}

function PCfullSize(ev) {
	if (ev.fullsize) {
		ev.scale.setTo(0.5,0.5)
		ev.fullsize = false
	} else {ev.scale.setTo(1,1); ev.fullsize=true}

}

function PCresetEvents() {
	roomevents = []
	rooms = []
	collected = []
	daterooms = {}
	sortdates = []
	libs = []
	evidx2lib = {}
	objidxs = []
	objdates = []
	date2idx = {}
	checkboxes = {}
	groupObjs = []
	steps = 0
	IGnumSecs = 0
	APPmistakes = 0
	// for (r=0;r<DMMnumRooms;r++) {if (rooms['library'+r]) {rooms['library'+r].destroy()}}
	rooms = {library0: {}, library1: {},library2: {},library3: {},library4: {},library5: {},library6: {},library7: {},library8: {},
		library9: {},library10: {},library11: {},
		library12: {},library13: {},library14: {},library15: {},
		library16: {},library17: {},library18: {},library19: {},library20: {}}
}

function PCupdatePenalty(pen) {
	DMMpenalties = ((DMMpenalties+pen) < PmaxPenalty) ? DMMpenalties + pen : PmaxPenalty
}
function PCaddNewCollected(obj) {
	var ret = true
	if (DMMobsCollected.indexOf(obj) > -1) {
		ret = false
	} else {
		DMMobsCollected.push(obj)
	}
	return ret
}
function PCnumNewCollected() {
	return DMMobsCollected.length
}
function PCbooksPerMin() {
	return (DMMnumStrings * DMMtarget) / (IGtotalSecs / 60)
}

function PCshowScores() {
	// just for testing purposes
	IGstillTrying = false
	IGconsole("showing scores")
	DMMtotalCollected = PCnumNewCollected()
	// penalties are always negative already
	// bonuses for any steps fewer than 8
	// var bonuses = (steps < 8) ? (8 - steps) * Pstepbonus : 0
	if (DMMpenalties > PmaxPenalty) {DMMpenalties = PmaxPenalty}
	// var score = 40-DMMpenalties+bonuses+DMMtotalCollected
	// var bpm = PCbooksPerMin().toFixed(1)
	var miss = (APPmistakes==0) ? "no" : APPmistakes
	var mplur = (APPmistakes==1) ? "" : "s"
	var pctscore = parseInt(100*(minSteps/steps)) - 3*APPmistakes
    DMMscores.push(pctscore)
    // real score is sum of the last 3 runs
    IGcalcTotalScore()
	var stepMsg = (steps<=minSteps) ? "That is the shortest path!" : "The shortest path was "+minSteps+" doors."
	var scoreText = "You found the "+DMMnumObjects+" "+ObjTypes[EventType2]+" requested by the curator."+
		"\nIt took you "+IGnumSecs+" seconds to find and collect the "+DMMnumObjects+" "+ObjTypes[EventType2]+"."+
		"\nYou passed through "+steps+" doors to collect these "+ObjTypes[EventType2]+"."+
		"\n"+stepMsg+
		"\nYou made "+miss+" mistake"+mplur+" trying to collect the wrong "+ObjTypes[EventType2]+"."+
		"\nYour score is "+pctscore+"."+
            "\n\nTo achieve Mastery of "+displayTopics[EventType].replace('\n',' ')+", you need "+IGwizardScores[IGgameApp]+" points total from 3 consecutive games. "+
            "You have "+DMMtotalScore+
            " points (total for "+IGgetGameCount()+" game"+IGplur(IGgetGameCount())+")."
	// hint.visible = true
	// hintBack.visible = true
	// var coverage = DMMobsCollected.toString().replace(/,/g, ":")
	var userDataMsg = IGnumSecs+":"+steps+":"+DMMtotalCollected+":"+EventNumU+":"+miss+" (Level "+DMMlevel+")"
	IGendGame({msg:scoreText,fcns:{again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame'}})
	IGsendScore(userDataMsg)
}

function PCspriteTouched(ev) {
	ev.alpha = 0.7
	// ev.bringToTop()
	if (!IGtimerFlag) {IGstartTimer()}
}
function PCspriteMoving(ev) {
	ev.alpha = 0.7
	// ev.bringToTop()
}
function PCspriteMoved(ev) {
	ev.alpha = 1.0
	var hit = false
	for (var c=0;c<DMMnumObjects;c++)
		if (IGcheckOverlap(ev, groupObjs[c])) {
			if (ev.idx == groupObjs[c].idx) {
				// IGconsole("object: "+ev.idx+":"+keys.toString())
			    try {IGbell.play();} catch (e) {}
			    collected[ev.idx] = true
			    ev.visible=false
			    // title2.fill = '#000000'
			    if (PCaddNewCollected(ev.idx)) {IGconsole("new stolen");}
				checkboxes[ev.idx].image.visible = true
				groupObjs[c].txt.setText(currentTitle)
				animBloom = bloomObjs[c]
				rooms[libnum].done = true
				hit = true
			} else {
				IGconsole("nope: "+ev.idx)
	//			ev.scale.setTo(0.5,0.5)
				ev.anchor.setTo(0.5,0.5)
				PCupdatePenalty(Ppenalty)
				ev.x = stealLoc.x; ev.y = stealLoc.y
			}
		}
	if (!hit) {
		APPmistakes ++
		try {IGbuzzer.play()} catch(e) {}
		ev.anchor.setTo(0.5,0.5)
		ev.x = stealLoc.x; ev.y = stealLoc.y

	}
	var isdone = true
	for (key in checkboxes) {
		if (!checkboxes[key].image.visible) {isdone = false}
	}
	if (isdone) {
		IGstopTimer(); 
		DMMisDone = true; 
		IGanalytics(['Doors', 'Finish', EventType]);
		PCshowScores()
	}
}
function PCshowDescr() {
	IGalertDIV("\n\n"+EventVars[EventType][currentObj].description.replace(/\\n/g,'<p> </p>'),"auto",false,true,true,14,true)
}

function PCreloadPaths(pev) {

	// use this to count every step, every entry of a room
	if (countSteps) {steps++;}

    pev = (pev) ? pev : this
	var nidx = pev.idx
	// for some reason, the tostart property is not being carried
	// for the DIV version of the back button
	if ((pev.tostart) || (!pev.idx)) {
		nidx = pidxs[startingRoom]
	} else if (pev.back) {
		nidx = pev.idx.pop()
		PCupdatePenalty(Psmallpenalty)
	} else {
		// use this if only counting rooms, not steps
		// if (countSteps) {steps++;}
	}

	//library is held in the evidx2lib[idx]
	var thislib = evidx2lib[nidx]

    // IGconsole("old, new: "+libn+":"+thislib)
	var iterlib
	// reset libnum to be current library
	libnum = 'library'+thislib
	for (var i=0; i<DMMnumRooms; i++) {
		// hide all rooms except this one
		iterlib = "library" + i
		if (i == thislib) {
			// show this room
			// if ((EventType != "Science") & (EventType != "Museum")) {libs[i].visible = true}
			roomevents[i].visible = true
		} else {
			//hide this room
			// libs[i].visible = false
			roomevents[i].visible = false
		}
	}


	if (!collected[pidxs[thislib]]) {
		if (stealItem) {stealItem.destroy(); stealItem = null}
		stealItem = IGaddSprite(MIDX, MIDY,iimgsc[thislib])
	    stealItem.anchor.setTo(0.5,0.5)
		var sc
		sc1 = (stealItem.height>centerW) ? centerW/stealItem.height : 1.0
		sc2 = (stealItem.width>centerW) ? centerW/stealItem.width : 1.0
		sc = (sc1>sc2) ? sc2 : sc1
	    stealItem.scale.setTo(IGratio*sc,IGratio*sc)
	    stealItem.inputEnabled = true
	    stealItem.input.enableDrag()
	    stealItem.events.onInputDown.add(PCspriteTouched, this);
	    stealItem.events.onDragStart.add(PCspriteMoving, this);
	    stealItem.date = ""
	    stealItem.events.onDragStop.add(PCspriteMoved, this);
	    stealItem.idx = pidxs[thislib]
	    stealItem.x = stealLoc.x
	    stealItem.y = stealLoc.y
	    stealItem.visible = true
	} else {stealItem.visible = false}

	// recreate title to be sure it is on top
	// if (title2) {title2.destroy(); title2 = null}
	tmp1 = EventVars[EventType][pidxs[thislib]][clue]
	tpos = (tmp1.indexOf(',')>-1) ? tmp1.indexOf(',') : tmp1.length
	// for now, whole clue
	var ttxt = ((EventType == "Sciencex") || (EventType == "Museumx")) ? tmp1.substring(0,tmp1.length)+" "+
		EventVars[EventType][pidxs[thislib]].date : tmp1.substring(0,tmp1.length)+" "+
		EventVars[EventType][pidxs[thislib]].date
	// add the space to avoid clipping the last letter
	title2.setText(ttxt + " ")
	// title2= IGaddText(titleLoc.x,titleLoc.y,
	// 		ttxt,
	// 		hstylevlb)
	currentTitle = ttxt.replace(": ","\n\n")


	// this gets a random selection
	var desctext = (overview == "objects") ? shuffleArray(EventVars[EventType][pidxs[thislib]][overview].split(";"))[0].trim() : EventVars[EventType][pidxs[thislib]][overview]
	if (desctext.length>descLen) {
		var pos = IGfindPrevious(desctext.substring(0,descLen),' ')
		desctext = desctext.substring(0,pos) + "..."
		currentObj = pidxs[thislib]
		IGhide(moreBtn, false)
	} else {IGhide(moreBtn, true)}
	// this gets the first one
	// var desctext = (overview == "objects") ? IGgetFirst(EventVars[EventType][pidxs[thislib]][overview]) : EventVars[EventType][pidxs[thislib]][overview]

    // var wrapped = IGwrap(desctext,IGratio*14,descWidth)

	descr.setText(desctext.replace(/\\n/g,'<p> </p>'))
	// descr.setText(IGwrap(desctext,14,rx(500))
	// // now, adjust the doors
	// IGconsole("doors to: "+rooms[libnum].cx)
    for (var i=0; i<DMMnumDoors; i++) {
    	pevents[i].x = doorLoc[i].x
    	pevents[i].y = doorLoc[i].y
    	// catch when there is no other door; sometimes only 1 or 2 doors
    	if (rooms[libnum].cx[i]>-1) {
	    	var nextr = rooms[libnum].cx[i]
	    	if (nextr == thislib) {
	    		IGconsole("self ptr: "+thislib)
				pevents[i].setText("")
				doorev[i].visible = false
	    	} else {
		    	pevents[i].setText(EventVars[EventType][pidxs[nextr]][clue] + "\n"+
			    	EventVars[EventType][pidxs[nextr]].date)
			    doorev[i].visible = true
		    	// doorev[i].x = doorLoc.x+(i*WIDTH/4),doorLoc.y; doorev[i].y = doorLoc.x+((i-adj)*doorLoc.spacing),doorLoc.y
		    	doorev[i].idx = pidxs[nextr]
			    doorev[i].events.onInputDown.add(PCreloadPaths,this)
		    	IGhide(masks[i],true)
			}
		} else {
			// IGconsole("no door: "+i+":"+rooms[libnum].cx)
			pevents[i].setText("")
			doorev[i].visible = false
	    	IGhide(masks[i],false)
		}
    }

	// mark this room as visited
	rooms[libnum].visited = true

}
function PCshowHelp() {
	IGalertDIV(helpTextLocal)
}
function SSclueMoving(ev) {
	ev.txt.y = ev.y
}
function SSclueMoved(ev) {
	// move all the others up or down
	var newLoc = 0
	if (ev.y < clueLoc.y) {ev.y = clueLoc.y; newLoc = 0}
	else {
		for (var l2=0;l2<DMMnumObjects-1;l2++) {
			if ((ev.y > clueLoc.y+ry(l2*65)) & (ev.y <= clueLoc.y+ry((l2+1)*65))) {
				ev.y = clueLoc.y+ry((l2+1)*65)
				newLoc = l2+1
			}
		}
	}
	ev.txt.y = ev.y
	var newLocs = []
	for (var l=0;l<DMMnumObjects;l++) {
			if ((l<newLoc) & (l>0) & (l>ev.pos)) {
				// move this up
				// groupObjs[l].y -= ry(65)
				// groupObjs[l].txt.y -= ry(65)
				newLocs[l-1] = groupObjs[l]
				IGconsole("filling: "+(l-1))
			} else if ((l>newLoc) & (l<ev.pos)) {
				// groupObjs[l].y += ry(65)
				// groupObjs[l].txt.y += ry(65)
				newLocs[l+1] = groupObjs[l]
				IGconsole("filling: "+(l+1))
			} else if ((l==0) & (l<newLoc) & (l!=ev.pos) & (l!=groupObjs[l].pos)) {
				newLocs[l] = groupObjs[l]
				IGconsole("filling: "+0)
			} else if (l==newLoc) {
				if (newLoc < ev.pos) {
					// groupObjs[l].y += ry(65)
					// groupObjs[l].txt.y += ry(65)
					newLocs[l+1] = groupObjs[l]
					IGconsole("filling: "+(l+1))
				} else if (l>0) {
					// groupObjs[l].y -= ry(65)
					// groupObjs[l].txt.y -= ry(65)
					newLocs[l-1] = groupObjs[l]
					IGconsole("filling: "+(l-1))
				}
			}
	}
	IGconsole("----")
	// now, most important, need to re-order the objects
	newLocs[newLoc] = ev
	newLocs[newLoc].pos = newLoc
				// IGconsole("filling: "+newLoc)
	for (var o=0;o<DMMnumObjects;o++) {
		if (newLocs[o]) {groupObjs[o] = newLocs[o]}
		groupObjs[o].pos = o
		// IGconsole("carry idx: "+groupObjs[o].idx)
		checkboxes[groupObjs[o].idx].image.y = groupObjs[o].y
		// IGconsole("newpos, y: "+o+":"+groupObjs[o].y)
	}
	for (var o=0;o<DMMnumObjects;o++) {
		groupObjs[o].y = clueLoc.y+(ry(65)*o)
		groupObjs[o].pos = o
		groupObjs[o].txt.y = groupObjs[o].y
	}
}

var preloadBar

function PCloadPaths() {

	IGstillTrying = true

//		waiting.visible = false

    var libn = parseInt(libnum.replace('library',''))
    startingRoom = parseInt(daterooms[sortdates[0]].replace('library',''))

    var scd = (IGxratio>IGyratio) ? IGyratio : IGxratio
	dhead = IGaddText(WIDTH/8, HEIGHT/2+ry(106), EventVars[EventType][pidxs[libn]][clue]+"\n"+
		EventVars[EventType][pidxs[libn]].date, tstyle2c);
	dhead.anchor.setTo(0.5,1)
	dhead.scale.setTo(scd,scd)
	// decided to move this to the title
	dhead.visible = false

    // the icon for stealing this item
    // must be before the description and the title

    moreBtn = IGaddDivButton({xloc:moreLoc.x,yloc:moreLoc.y, text: "more...",rtnf: 'PCshowDescr'});
    IGhide(moreBtn,true)

	// if (title2) {title2.destroy(); title2 = null}
	var tmp1 = EventVars[EventType][pidxs[libn]][clue]
	var tpos = (tmp1.indexOf(',')>-1) ? tmp1.indexOf(',') : tmp1.length
	// for now, whole clue
	var ttxt = ((EventType == "Sciencex") || (EventType == "Museumx")) ? tmp1.substring(0,tmp1.length)+" "+
		EventVars[EventType][pidxs[libn]].date : tmp1.substring(0,tmp1.length)+" "+
		EventVars[EventType][pidxs[libn]].date

    title2.setText(ttxt+" ")
	// title2= IGaddText(titleLoc.x,titleLoc.y,
	// 		ttxt,
	// 		hstylevlb)
	currentTitle = ttxt.replace(": ","\n\n")


	// this gets a random selection
	var desctext = (overview == "objects") ? shuffleArray(EventVars[EventType][pidxs[libn]][overview].split(";"))[0].trim() : EventVars[EventType][pidxs[libn]][overview]
	if (desctext.length>descLen) {
		var pos = IGfindPrevious(desctext.substring(0,descLen),' ')
		desctext = desctext.substring(0,pos) + "..."
		IGhide(moreBtn,false)
		currentObj = pidxs[libn]
	} else {IGhide(moreBtn,true)}
	// this gets the first one
	// var desctext = (overview == "objects") ? IGgetFirst(EventVars[EventType][pidxs[libn]][overview]) : EventVars[EventType][pidxs[libn]][overview]

	// for nature text, there is a question at the end. Set the spacing
    descr = IGaddDivText({xloc:descLoc.x, yloc:HEIGHT/2+ry(56), text:desctext.replace(/\\n/g,'<p> </p>'), width:descWidth,
    	size:Math.floor(IGxratio*15),height:boxH, weight:300});

	instruct2.visible = false
	// instruct2.bringToTop()

    // get all the candidates that this room could connect to
    // which is all events later in time
    for (var i=0; i<DMMnumRooms; i++) {
   		roomevents[i] = IGaddSprite(bookLoc.x,bookLoc.y, iimgsc[i]);

		sc1 = (roomevents[i].height>ry(columnW)) ? ry(columnW)/roomevents[i].height : 1.0
		sc2 = (roomevents[i].width>rx(columnW)) ? rx(columnW)/roomevents[i].width : 1.0
		sc = (sc1>sc2) ? sc2 : sc1

		roomevents[i].scale.setTo(sc*IGratio,sc*IGratio)

		roomevents[i].anchor.setTo(0.5,0.5)
	    roomevents[i].idx = pidxs[i]
		if (i!=libn) {roomevents[i].visible = false}
    }
    /////////////////////////////////////////////////
    // now, connect the rooms; must do this in order
    // THIS IS WHERE THE MAGIC HAPPENS
    for (var i=0; i<DMMnumRooms; i++) {
    	var key = daterooms[sortdates[i]]
    	var knum = parseInt(key.replace('library',''))

		// get new adjacent rooms
		var roomid = roomLocs[knum]
		// IGconsole("room, id: "+key+":"+roomid)
		var adjacs = getAdjacencies(roomid)
		// strip to simple list (later we'll fix this to use keys)
		rooms[key].cx = [roomLocs.indexOf(adjacs.W),roomLocs.indexOf(adjacs.N),
			roomLocs.indexOf(adjacs.E),roomLocs.indexOf(adjacs.S)]
		rooms[key].square = roomLocs[knum]
		var tmp1 = EventVars[EventType][pidxs[knum]][clue]
		var tpos = (tmp1.indexOf(",")>-1) ? tmp1.indexOf(",") : tmp1.length
		var label =  tmp1.substring(0,tpos)+'\n'+
			EventVars[EventType][pidxs[knum]].date
		rooms[key].label = label
    	// IGconsole('g.addNode("'+key+'",{label: "'+label+'"})')
    }
    // set up the doors in this first room
    var libn = parseInt(libnum.replace('library',''))

    for (var i=0; i<DMMnumDoors; i++) {
    	// to get the next door, iterate through the cx of this room
    	pevents[i] = {}
    	// if (EventVars[EventType][pidxs[nextr]]) {
    	if (rooms['library'+(libn)].cx[i]>-1) {
	    	var nextr = rooms['library'+(libn)].cx[i]
    		// IGconsole("adding door: "+i+":"+nextr+":"+pidxs[nextr])
		    doorev[i] = IGaddSprite(doorLoc[i].x,doorLoc[i].y,'doorbtn')
		    doorev[i].scale.setTo(IGratio,IGratio)
		    doorev[i].inputEnabled = true
		    doorev[i].events.onInputDown.add(PCreloadPaths,this)
		    doorev[i].idx = pidxs[nextr]
		    pevents[i] = IGaddText(doorLoc[i].x,doorLoc[i].y, EventVars[EventType][pidxs[nextr]][clue] + "\n"+
		    	EventVars[EventType][pidxs[nextr]].date, hstylel);
	    	IGhide(masks[i],true)
		} else {
			// IGconsole("no door: "+i)
			// need to create the door anyway for use later
		    pevents[i] = IGaddText(0,0,"", hstylel);
		    doorev[i] = IGaddSprite(doorLoc[i].x,doorLoc[i].y,'doorbtn')
		    doorev[i].inputEnabled = true
		    doorev[i].events.onInputDown.add(PCreloadPaths,this)
		    doorev[i].idx = pidxs[0]
		    doorev[i].visible = false
	    	IGhide(masks[i],false)
		}
	    // IGconsole("door to: "+nextr)

    }
	var titleObj = IGaddText(descLoc.x,divisionLocs[2].y-ry(274),"This room contains:",style3b)
	titleObj.anchor.setTo(0.5,0.5)

	if (preloadBar) {preloadBar.visible = false; preloadBar.destroy()}
	preloadBar = null
	notLoaded = false
	instruct2.setText("")

	groupObjs = []
	// these are the clues for the objects to be collected
	//
	for (i=0;i<DMMnumObjects;i++) {
			var yoff = i - (DMMnumObjects/2-0.5)
	    	if (groupObjs[i]) {groupObjs[i].destroy()}
	    	bloomObjs[i] = IGaddSprite(clueLoc.x, clueLoc.y+(yoff*clueLoc.spacing/(DMMnumObjects+1)), 'bloomitem')
	    	bloomObjs[i].alpha = (0.4,0.4)
	    	bloomObjs[i].scale.setTo(0.65*IGratio,0.65*IGratio)
	    	groupObjs[i] = IGaddSprite(clueLoc.x, clueLoc.y+(yoff*clueLoc.spacing/(DMMnumObjects+1)), 'groupb')
	    	// groupObjs[i].alpha = (0.4,0.4)
	    	groupObjs[i].scale.setTo(1.4*IGratio,1.4*IGratio)
	    	groupObjs[i].pos = i
	    	// IGconsole("idx: "+tempidx[i])
	    	groupObjs[i].idx = tempidx[i]

	    	checkboxes[tempidx[i]].image = IGaddSprite(clueLoc.x, clueLoc.y+(yoff*clueLoc.spacing/(DMMnumObjects+1)), 'checked')
	    	checkboxes[tempidx[i]].image.anchor.setTo(0.5,0.5)
	    	checkboxes[tempidx[i]].image.scale.setTo(0.7*IGratio,0.7*IGratio)
	    	checkboxes[tempidx[i]].image.visible = false

			groupObjs[i].txt = IGaddText(clueLoc.x, clueLoc.y+(yoff*clueLoc.spacing/(DMMnumObjects+1)), temptobj[i], tstyle2cb)
			groupObjs[i].txt.anchor.setTo(0.5,0.5)
			groupObjs[i].txt.scale.setTo(IGratio,IGratio)
	}

	// calculate the minimum path
	// need to pass a set of rooms with the starting path first
	var trooms = [roomLocs[libn]]
	for (var ob=0;ob<DMMnumObjects;ob++) {
		// evidx2lib gets from idx to lib number
		// roomLocs gets from lib# to room grid number
		trooms.push( roomLocs[evidx2lib[groupObjs[ob].idx]] )
	}
	IGconsole("rooms are: "+trooms)
	minSteps = calcShortestPath(trooms)
	IGconsole("Shortest path: "+minSteps)
	// first time through, there is no previous room

	stealItem = IGaddSprite(MIDX, MIDY,iimgsc[libn])
    stealItem.anchor.setTo(0.5,0.5)
	var sc
	sc1 = (stealItem.height>centerW) ? centerW/stealItem.height : 1.0
	sc2 = (stealItem.width>centerW) ? centerW/stealItem.width : 1.0
	sc = (sc1>sc2) ? sc2 : sc1
    stealItem.scale.setTo(IGratio*sc)
    stealItem.inputEnabled = true
    stealItem.input.enableDrag()
    stealItem.events.onDragStart.add(PCspriteMoving, this);
    stealItem.date = ""
    stealItem.events.onDragStop.add(PCspriteMoved, this);
    stealItem.idx = pidxs[libn]

	rooms[libnum].visited = true

	IGstopSpinner()
	IGanalytics(['Doors', 'Load', EventType]);

	IGalertDIV("\n\nFind the objects indicated on the left and drag them onto their clues.","auto",false,true,true,16)

}
var updcnt = 0
var PCpathway = {

	preload: function() {
		notLoaded = true

    if (EventNum<IGminEvents[IGgameApp]) {
        var rtn = (Object.keys(DTopics).length<2) ? false : APPnewGame()
        IGstopSpinner()
        IGalertDIV("\n\nThere aren't enough events on this topic to play this game at this time."+
            "\n\nUse the menu upper right to select a different game "+
            "or to restart this game with a different topic.",
            "auto",rtn,true,true,true,16);
        return;
    }

		game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')
		IGconsole("in preload")

		if (IGwhite) {
			IGdefineScales()
			IGsetStage('#ffffff')
		} else {
			IGdefineScales()
			IGsetStage()
		}
		// parameter tells it to register user
		DMMSetTopics()
		IGsetGlobalFunctions(true)

		game.load.image('groupb', AppPath+'pics/targetCircle.png');
		// game.load.image('bloomitem', AppPath+'pics/itemCircle.png');
		game.load.image('targitem', AppPath+'pics/cart.png');
		game.load.image('objback', AppPath+'pics/descBox.png');
		game.load.image('checked', AppPath+'pics/correctCircle.png');
		// game.load.image('locbtn', AppPath+'pics/groupBtn.png');
		game.load.image('doorbtn', AppPath+'pics/doorBtn2.png');
		game.load.image('museum', AppPath+'images/roomBG.png');
		game.load.image('upa', AppPath+'pics/up.png');
		game.load.image('downa', AppPath+'pics/down.png');
		game.load.image('lefta', AppPath+'pics/left.png');
		game.load.image('righta', AppPath+'pics/right.png');
		game.load.image('upMask', CommonPath+'pics/doorOverlayTop.png')
		game.load.image('downMask', CommonPath+'pics/doorOverlayBottom.png')
		game.load.image('leftMask', CommonPath+'pics/doorOverlayLeft.png')
		game.load.image('rightMask', CommonPath+'pics/doorOverlayRight.png')

		DMMgameReset()
		PCresetEvents()
		// DMMnumRooms = DMMnumRoomsC


		bubbleW = IGratio*190
		columnW = rx(280)
		centerW = IGratio*290
		cartH = IGyratio*700
		boxH = IGratio*224

		topRow = MIDY - IGratio*310
		botRow = MIDY+IGratio*320

		divisionLocs = {0: {x: WIDTH/2, y: ry(32)},
			1: {x: MIDX-IGratio*304-IGxratio*123, y: HEIGHT/2-ry(156)},
			2: {x: MIDX-IGratio*304-IGxratio*123, y: HEIGHT/2},
			3: {x: MIDX+IGratio*304+IGxratio*123, y: HEIGHT/2+ry(96)},
			4: {x: WIDTH/2, y: HEIGHT-ry(3)}
		}
		vbarLoc = {0: {x: WIDTH/9, y:0}, 1:{x: 8*WIDTH/9, y:0}}
		mapLoc = {x: divisionLocs[2].x+IGratio*16, y: topRow-IGratio*8}

		backLoc = {x: MIDX, y: MIDY+IGratio*216}
		startLoc = {x: MIDX, y: MIDY+IGratio*318}

		sackLoc = {x: 8*WIDTH/9, y: 5*HEIGHT/6}
		shuffLoc = {x: MIDX, y: MIDY}
		// for now, put this off screen
		penLoc = {x: WIDTH+rx(100), y: HEIGHT+100}

		bookLoc = {x: divisionLocs[3].x, y: divisionLocs[1].y}

		var xloc = 7*WIDTH/8 //((EventType == "Science") || (EventType == "Museum")) ? WIDTH/2 : 4*WIDTH/5
		stealLoc = {x: MIDX, y: MIDY}

		descLoc = {x: divisionLocs[3].x, y: HEIGHT/2}
		descImgLoc = {x: divisionLocs[3].x, y: divisionLocs[1].y}
		descLen = ry(350)
		descWidth = columnW-rx(50)
		libLoc = {x: WIDTH/2, y: divisionLocs[2].y+ry(100)}
		clueLoc = {x: divisionLocs[2].x, y: divisionLocs[2].y, spacing: cartH}
		missLoc = {x: 7*WIDTH/8+ry(20), y: HEIGHT/6-ry(50)}
		titleLoc = {x: MIDX, y: topRow}
		doorLoc = [{x: WIDTH/2-IGratio*210, y: HEIGHT/2, spacing: IGratio*210},
			{x: WIDTH/2, y: MIDY-IGratio*216, spacing: IGratio*210},
			{x: WIDTH/2+IGratio*210, y: HEIGHT/2, spacing: IGratio*210},
			{x: WIDTH/2, y: MIDY+IGratio*216}]

		xloc = WIDTH/2
		instrLoc = {x: xloc, y: divisionLocs[0].y+ry(110), spacing: rx(456)}
		moreLoc = {x: divisionLocs[3].x+rx(80), y: divisionLocs[3].y+IGyratio*200}

		var rightEdge = WIDTH/2 + centerW + columnW - rx(24)
	    menuLoc = {x: rightEdge-30, y:topRow+ry(10)}
		helpLoc = {x: rightEdge-78, y: topRow-IGratio*14}
		filmLoc = {x: rightEdge-180, y: topRow-IGratio*14}

		revcenter = [WIDTH/8,HEIGHT/3]

		notLoaded = true



		title2 = IGaddDivText({xloc:titleLoc.x, yloc:titleLoc.y-ry(10),
	    	text:Subjects[EventType2].replace('Strings','Collections').replace(' in ',' from ').replace(' through ',' from '),
	    	width:500,height:50, size:18,color:'#000000',weight:400})

		// preloadBar = game.add.sprite(WIDTH/2, HEIGHT-ry(40), 'preloaderBar');
		// preloadBar.anchor.setTo(0.5,0)
		// game.load.setPreloadSprite(preloadBar);

		if ((EventType == "Art") || (EventType == "Movies") || (EventType == "Science")) {clue = 'actor'}
			objsrc = 'objects'
		// if (EventType == "Art") {objsrc = 'objects'} else {objsrc='objects'}
		if (EventType == "Literature") {
			// slightly favor using the description
			var ver = Math.floor(Math.random()*1.1)+1
			if (ver < 2) {
				clue = 'category'
				overview = 'description'
				objsrc = 'objects'
			} else {
				clue = 'category'
				overview = 'objects'
				objsrc = 'description'
			}
		}
		if ((objsrc=="objects") || (overview='objects') ) {
				EventNumU = 0
				for (var e=0;e<EventNum;e++) {if (EventVars[EventType][e].objects.length>3) {EventNumU++}}
		} else {EventNumU = EventNum}
		IGconsole("EventNum: "+EventNum+":"+EventNumU+(EventNum-EventNumU))
		iimgs = ['imglib0','imglib1','imglib2','imglib3','imglib4','imglib5','imglib6',
			'imglib7','imglib8','imglib9','imglib10','imglib11','imglib12','imglib13',
			'imglib14','imglib15','imglib16','imglib17','imglib18','imglib19','imglib20']

		// title = IGaddText(WIDTH/2, ry(10), 
		// 	"Doors through the Museum",
		// 	hstylec);
		// title.anchor.setTo(0.5,0)

		var htime = IGaddText(60, 10, "Time:", rjstyle);
		htime.anchor.setTo(1,0)
		htime.visible = false
		IGtnumSecs = IGaddText(70, 10, "0", ljstyle2);
		IGtnumSecs.anchor.setTo(0,0)
		IGtnumSecs.visible = false

		rooms = {library0: {}, library1: {},library2: {},library3: {},library4: {},library5: {},library6: {},library7: {},library8: {},
			library9: {},library10: {},library11: {},
			library12: {},library13: {},library14: {},library15: {},
			library16: {},library17: {},library18: {},library19: {},library20: {}}

	    // set up all the rooms; load each with an event
	    //
	    // array pidxs holds the link from room -> event idx
	    // array evidx2lib holds the links from event idx -> room
	    pidxs = []
	    dateidxs = []
	    for (var i=0; i<DMMnumRooms; i++) {
	    	var r = Math.floor(Math.random()*(EventNum))
	    	while ((IGisInArray(r,pidxs)) || EventVars[EventType][r][objsrc].length<1) {
	    		r = Math.floor(Math.random()*(EventNum))
	    	}
	    	// this has to be here for the above test to work, though re-set below
	    	pidxs[i] = r
	    	var dat = parseInt(EventVars[EventType][r].date)+0.1
	    	while (IGisInArray(dat,sortdates)) {dat+=0.1}
	    	dateidxs[dat] = r
	    	sortdates.push(dat)
	    	// IGconsole("index: "+r)
	    }
	    sortdates.sort(function(a,b){return a-b})
	    // now that sorted in order, need to re-assign rooms to be chron ordered
	    //
	    pidxs = []
	    for (var i=0; i<DMMnumRooms; i++) {
	    	// IGconsole("sorted date: "+sortdates[i])
	    	daterooms[sortdates[i]] = 'library'+i
	    	// IGconsole("daterooms: "+i+":"+sortdates[i]+":"+daterooms[sortdates[i]])
	    	var r = dateidxs[sortdates[i]]
	    	// pidxs stores a sequential array of event indexes
	    	pidxs[i] = r
	    	// need reverse pointer also, from event index to the libr number
	    	evidx2lib[r] = i
	    	var pos = EventVars[EventType][r].image.lastIndexOf('.')
	    	var iname = EventVars[EventType][r].image.substr(0,pos)
	    	var iname2 = iname.replace(/ /g,"_").replace(/,/g,"_")
	    	inames[i] = iname2
	    	game.load.image(iimgsc[i], ImgPath+IGimgPath+'/'+iname2+'.png')
		   	game.load.image(iimgs[i], ImgPath+'large/'+inames[i]+'.png')
	    	iimgstxt[i] = 'Image Credit: '+EventVars[EventType][r].URL
	    }
	    libnum = 'library' + Math.floor(Math.random()*11)
	    IGconsole("starting: "+libnum)

		// game.load.image('button', AppPath+'pics/blank_s.png');
		game.load.image(URLbut, AppPath+'pics/grey_l.png');
		game.load.image('invb', CommonPath+'pics/invBut.png')

		/////////////////////////////////////////////////////////
		// objects to be collected
		//
		// this is what drives the game
		//
		checkboxes = {}
		temptobj = []
		tempidx = []
		var evidx
	    for (var i=0; i<DMMnumObjects; i++) {
	    	var r = Math.floor(Math.random()*(DMMnumRooms))
	    	while ((pidxs[r] in checkboxes) || (EventVars[EventType][pidxs[r]][objsrc].trim().length<3)) {
	    		r = Math.floor(Math.random()*(DMMnumRooms))
	    	}
	    	// r now holds the room number of the object
	    	evidx = pidxs[r]
	    	// IGconsole("index: "+evidx)
	    	temptobj[i] = IGshorten(shuffleArray(EventVars[EventType][evidx][objsrc].split(";"))[0].trim(),98)
	    	// IGconsole("object: "+EventVars[EventType][evidx]['objects'])
	    	tempidx[i] = evidx
			// obj[i] = IGaddText(clueLoc.x, clueLoc.y+(ry(65)*i), 
			// 	IGshorten(shuffleArray(EventVars[EventType][evidx][objsrc].split(";"))[0].trim(),130), tsty)
			// obj[i].anchor.setTo(0,0)
			// obj[i].scale.setTo(sc2,sc2)

			checkboxes[evidx] = {}
			checkboxes[evidx].yoff = clueLoc.y+(ry(65)*i)
			var dat = parseInt(EventVars[EventType][evidx].date)
//			while (dat in date2idx) {dat = dat +0.1}
			date2idx[dat] = evidx
			objdates.push(dat)
			// IGconsole("room with object: "+r+":"+pidxs[r])
		}
		objdates.sort(function(a,b) {return a-b})

		// IGconsole("objdates: "+objdates.toString())
		var keys = []
		for (key in checkboxes) {keys.push(key); }//IGconsole("obj in room: "+evidx2lib[key])}
		// game.load.image('sack', AppPath+'images/sack_br.png');

	    // instructions
		// instruct = IGaddText(WIDTH/2, 4*HEIGHT/9, instructTextS, tstyle2m);
		// instruct.anchor.setTo(0.5,0)
		var ff = Math.ceil(rx(17))
		var tsty = { font: "bold "+ff+"px Arial", fill: "#000", align: "center", wordWrap: true,
			wordWrapWidth: 600 };
		instruct2 = IGaddText(WIDTH/2, HEIGHT - ry(80), "Loading...",tsty);

		IGbrace1 = IGaddText(MIDX-150,HEIGHT-ry(27),'[',hstylevlb)
		IGbrace2 = IGaddText(MIDX+150,HEIGHT-ry(27),']',hstylevlb)

	},
	loadUpdate: function() {
		if (notLoaded) {
			if (preloadBar) {preloadBar.destroy(); preloadBar = null}
			preloadBar = game.add.sprite(WIDTH/2, HEIGHT-ry(36), 'preloaderBar');
			if (preloadBar.getLocalBounds().height<30) {
				preloadBar.anchor.setTo(0.5,0)
				game.load.setPreloadSprite(preloadBar);
				notLoaded = false
			} else {preloadBar.visible = false}
		}

	},
	create: function() {

	    // set the background images

    	var wholebg = IGaddSprite(MIDX,MIDY,'museum')
    	wholebg.scale.setTo(IGratio,IGratio)
	    sack = IGaddSprite(clueLoc.x, clueLoc.y, 'targitem')
    	sack.scale.setTo(IGxratio,IGyratio)

    	var upA = IGaddSprite(MIDX, MIDY-IGratio*164, 'upa')
    	upA.scale.setTo(IGratio,IGratio)
    	var downA = IGaddSprite(MIDX, MIDY+IGratio*164, 'downa')
    	downA.scale.setTo(IGratio,IGratio)
    	var leftA = IGaddSprite(MIDX-IGratio*164, MIDY, 'lefta')
    	leftA.scale.setTo(IGratio,IGratio)
    	var rightA = IGaddSprite(MIDX+IGratio*164, MIDY, 'righta')
    	rightA.scale.setTo(IGratio,IGratio)

    	upMask = IGaddSprite(MIDX, MIDY-IGratio*180, 'upMask')
    	upMask.scale.setTo(IGratio,IGratio)
    	IGhide(upMask,true)
    	downMask = IGaddSprite(MIDX, MIDY+IGratio*179.5, 'downMask')
    	downMask.scale.setTo(IGratio,IGratio)
    	IGhide(upMask,true)
    	leftMask = IGaddSprite(MIDX-IGratio*181, MIDY, 'leftMask')
    	leftMask.scale.setTo(IGratio,IGratio)
    	IGhide(upMask,true)
    	rightMask = IGaddSprite(MIDX+IGratio*181, MIDY, 'rightMask')
    	rightMask.scale.setTo(IGratio,IGratio)
    	IGhide(upMask,true)

		masks = [leftMask,upMask,rightMask,downMask]

    	// sackInst = IGaddText(clueLoc.x, clueLoc.y-ry(210),"To carry items to another room, drag them onto this cart.", style3b)

	    var objBack = IGaddSprite(descLoc.x, divisionLocs[2].y, 'objback')
    	objBack.scale.setTo(IGxratio,IGyratio)
	    // var objBack2 = IGaddSprite(descImgLoc.x, descImgLoc.y, 'objback2')
    	// objBack2.scale.setTo(IGxratio,IGyratio)

	    helpTextLocal = helpTextD[0]
	    for (var i=1; i<8; i++) {helpTextLocal = helpTextLocal + "\n\n"+helpTextD[i]}
	    helpTextLocal = helpTextLocal

		// put up the menu buttons
	 //    IGaddMenuBar(DMMmenu,menuLoc.x,menuLoc.y)

		// IGfilmBtn = IGaddDivButton({xloc:filmLoc.x,yloc:topRow,text:'All Images',width:rx(100),height:ry(20),
		// 	rtnf:'IGenter_filmstrip'})
	 //    IGhelpBtn = IGaddDivButton({xloc:helpLoc.x,yloc:topRow,text:'Help',rtnf: 'IGshowHelp',width:rx(100),height:ry(20)})
	 //    IGhelpBtn.helptext = helpTextLocal
	 //    // helpBut.scale.setTo(0.7,0.7)
	    mapBut = IGaddDivButton({xloc:mapLoc.x-rx(8),yloc:21,text:'Show Map',rtnf:'showMap',width:rx(100),height:ry(20)})
	    mapBut.idx = pidxs[0]

		// waiting = IGaddSprite(WIDTH/2,HEIGHT/2,'wait');
		// waiting.anchor.setTo(0.5,0.5)
		window.setTimeout(PCloadPaths,300)
	},
	render: function() {
		// for now, no bars
	},

	update : function() {

		if (animBloom) {
			if (bloomcnt < 25) {
				bloomcnt++
				animBloom.scale.setTo(0.8*IGratio+(0.01*bloomcnt),0.8*IGratio+(0.01*bloomcnt))
			} else {
				animBloom.scale.setTo(0.7*IGratio,0.7*IGratio)
				animBloom = null
				bloomcnt = 0
			}
		}

		// doesn't work, because does not return to update until after loadGame completes
		// even if I put the call to loadGame here
//    	instruct2.angle += 1;

    },
    shutdown : function() {
    	try {IGdrawRoomMap(false)} catch (e) {}
		while (CleanupList.length>0) {CleanupList.pop().destroy()}
		IGcleanupTexts()
    }

}
