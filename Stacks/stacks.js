/////////////////////////////////////////////////////////////////////
//
// stacks.js
//
// core logic for the Stacks (Rooms) game
//
// Copyright 2014 IdeateGames
// all rights reserved
//
/////////////////////////////////////////////////////////////////////

var notLoaded = true

var sack, bubbleW, columnW, centerW, prevRoom, sackInst, grcheck, grex, bubbleW,columnW,centerW,helpTextLocal,
	currentObj,leftMask,upMask,rightMask,downMask
var masks
var numShelved = 0
var sortedT,remainT

var titleloc = {}
var numInHand = [false,false,false,false]
var maxSlots = 4
var numMistakes = 0
var EventNumU = 0

function DMMmenu() {
    IGendGame({msg:'You are in the middle of a game. Selecting any button but the first will abort this game.',
        fcns: {again: 'APPrestart',subj:'APPnewGame',diff:'IGchangeGame',resume:'IGresume'},
        small:true,nohead:true})
}
function APPrestart() {
    if ((EventVars[EventType])) {
        IGstartSpinner()
        game.state.start('stacks',true,true)
    } else {APPnewGame()}
}
function APPnewGame() {
	loadURLExt({'url': '/launch/sindex.html?alias='+DMMalias+'&level='+DMMlevel})
}
function PSchangeBackground(e) {
	if (e.bg) {game.stage.backgroundColor = IGaltBG; e.bg=false}
	else {game.stage.backgroundColor = IGbackground; e.bg=true}
}
function PSshowHelp() {
	IGalertDIV(helpTextLocal)
}

function PSsetTarget() {
	switch (DMMlevel) {
		case 1:
			DMMtarget = 4;
			break;
		case 2:
			DMMtarget = 7;
			break;
		case 3:
			DMMtarget = DMMnumRooms;
	}
}
function APPdismissSettings() {
    var nodeList = document.getElementsByClassName('IGsettings');
    while (nodeList.length>0) {
        // IGconsole("\nremoving node\n")
        nodeList = document.getElementsByClassName('IGsettings')
        nodeList[0].parentNode.removeChild(nodeList[0]);
    }
}
function APPsettings(par) {
    var wid = (par.width) ? par.width : 300
    var hgt = (par.height) ? par.height : 500
    var xloc = (par.xloc) ? par.xloc : WIDTH/2
    var yloc = (par.yloc) ? par.yloc : HEIGHT/2

    var ret = document.createElement("div");

    //Assign different attributes to the element.
    ret.setAttribute("class", "IGtemp IGsettings");
    var tmp = "position:absolute;width:"+wid+"px;height:"+hgt+"px;"+
    	"left:calc(50% + "+(xloc-WIDTH/2-wid/2)+"px);top:"+(yloc-hgt/2)+"px;"+
    	"border: 1px solid #777;border-radius:5px;background-color:#fff";
    ret.setAttribute("style",tmp);
    var retin1 = document.createElement("div");
    retin1.setAttribute("class", "IGtemp IGsettings");
    tmp = "font-size:14px;line-height:100%;color:#333;font-weight:100;";
    retin1.setAttribute("style",tmp);
    var check = ['','','']
    check[DMMlevel] = ' checked';
    retin1.innerHTML = "<h4>Settings for Rooms</h4><p>&nbsp;</p><p style='font-weight:900;'>Difficulty Level (#rooms to sort):</p>"+
    	'<input id="option1" type="radio" name="level" value="1"'+check[1]+'/>'+
    	'<label for="option1">&nbsp;Any 4 rooms&nbsp;&nbsp;</label>'+
    	'<input id="option2" type="radio" name="level" value="2"'+check[2]+'/>'+
    	'<label for="option2">&nbsp;Any 7 rooms&nbsp;&nbsp;</label>'+
    	'<br/><input id="option3" type="radio" name="level" value="3"'+check[3]+'/>'+
    	'<label for="option3">&nbsp;All '+DMMnumRooms+' rooms</label>'
    ret.appendChild(retin1);

    document.getElementById("game").appendChild(ret);

    return ret
}
var settingsBtn
var settingsOn
function PgetSettings() {
	var wid = 300
	var hgt = 180
	if (settingsOn) {
		DMMlevel = parseInt($('input[name="level"]:checked').val());
		PSsetTarget()
		PSsetFeedback()
		APPdismissSettings()
		settingsOn = false
	} else {
	    IGanalytics(['Stacks', 'Settings', EventType]);
		APPsettings({xloc:wid/2+20,yloc:hgt/2+50,width:wid,height:hgt})
		settingsOn = true
	}
}

function PSunhitTarget(arrow,target) {
//	    music.play();
//	IGconsole("removing : "+arrow.date)
	target.date = null
    target.dattext.setText("[ ]")
}

function PSfullSize(ev) {
	if (ev.fullsize) {
		ev.scale.setTo(0.5,0.5)
		ev.fullsize = false
	} else {ev.scale.setTo(1,1); ev.fullsize=true}

}

function PSaddNewShelved(obj) {
	var ret = true
	if (DMMobsShelved.indexOf(obj) > -1) {
		ret = false
	} else {
		DMMobsShelved.push(obj)
	}
	return ret
}
function PSnumNewShelved() {
	return DMMobsShelved.length
}
function PSbooksPerMin() {
	return (DMMnumStrings * DMMtarget) / (IGtotalSecs / 60)
}
function PSresetEvents() {
	roomevents = []
	books = []
	daterooms = {}
	sortdates = []
	// if (pidxs) {pidxs.destroy()}
	pidxs = []
	libs = []
	evidx2lib = {}
	objidxs = []
	objdates = []
	date2idx = {}
	checkboxes = {}
	pid2shuff = []
	shuffrooms = []
	steps = 0
	numShelved = 0
	numMistakes = 0
	// for (r=0;r<DMMnumRooms;r++) {if (rooms['library'+r]) {rooms['library'+r].destroy()}}
	rooms = {library0: {}, library1: {},library2: {},library3: {},library4: {},library5: {},library6: {},library7: {},library8: {},
		library9: {},library10: {},library11: {},
		library12: {},library13: {},library14: {},library15: {},
		library16: {},library17: {},library18: {},library19: {},library20: {}}
	IGnumSecs = 0
	numInHand = [false,false,false,false]
}

function PSupdatePenalty(pen) {
	DMMpenalties = ((DMMpenalties+pen) < PmaxPenalty) ? DMMpenalties + pen : PmaxPenalty
	// penaltyMsg.setText("Penalties: "+DMMpenalties)
	// abandon penalties for now
	penaltyMsg.visible = true
}

function PSshowScores() {
	IGstillTrying = false
	DMMnumStrings += 1
	IGtotalSecs = IGtotalSecs + IGnumSecs
	IGconsole("showing scores")
	// penalties are always negative already
	// bonuses for any steps fewer than 8
	// var bonuses = (steps < 8) ? (8 - steps) * Pstepbonus : 0
	if (DMMpenalties > PmaxPenalty) {DMMpenalties = PmaxPenalty}
	// var score = 40-DMMpenalties+bonuses
	DMMtotalShelved = PSnumNewShelved()
	var bpm = PSbooksPerMin().toFixed(1)
	var mplur = (numMistakes==1) ? "" : "s"
	scoreText = "You correctly returned "+numShelved+" "+ObjTypes[EventType2]+" to their correct rooms."+
		"\nThis took you "+IGnumSecs+" seconds."+
		"\nYou passed through "+steps+" doors to return these "+ObjTypes[EventType2]+"."+
		"\nYou made "+numMistakes+" mistake"+mplur+"."
		"\nYou are returning an average of "+bpm+" "+ObjTypes[EventType2]+" per minute."+
		"\nYou have now returned a total of "+DMMtotalShelved+" different "+ObjTypes[EventType2]+
			" of the overall "+EventNumU+" possible."
	// var coverage = DMMobsShelved.toString().replace(/,/g, ":")
	var userDataMsg = numShelved+":"+DMMtotalShelved+":"+steps+":"+EventNumU+
		":"+bpm+":"+numMistakes+" (Level "+DMMlevel+")"
	IGendGame({msg:scoreText,fcns: {again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame'}})
	IGsendScore(userDataMsg)
}

function PSspriteTouched() {
	penaltyMsg.setText("")
	IGhide(sackInst,true)
	if (!IGtimerFlag) {IGstartTimer()}
}
function PSspriteMoving() {
	IGhide(sackInst,true)
	penaltyMsg.setText("")
}
function PSfindClueSlot() {
	ret = maxSlots
	for (s=0;s<numInHand.length;s++) {
		if (!numInHand[s]) {
			ret = s
			break
		}
	}
	return ret
}
function PSswapWithHand(ev,evhand) {
	if (!ev.inhand) {
	    books[ev.i].visible = false
	    ev.scale.setTo(ev.asscaled*(1.4*bubbleW/centerW))
	    ev.reset(evhand.handloc.x,evhand.handloc.y)
	    ev.handloc = {x: ev.x, y: ev.y}
	    ev.slot = evhand.slot
	    ev.inhand = true
	    countSteps = true
	    // numInHand ++
	}
}
function PSsetFeedback() {
	IGconsole("level, target: "+DMMlevel+":"+DMMtarget)
   	sortedT.setText(parseInt(numShelved))
	remainT.setText(parseInt(DMMtarget - numShelved))

}
function PSspriteMoved(ev) {
	var keys = []
	var libn = parseInt(libnum.replace('library',''))
	for (key in checkboxes) {
		keys.push(key)
	}
	grex.visible = true
	if ((IGcheckOverlap(ev, sack)) & !ev.inhand) {
			var slot = PSfindClueSlot()
			if (slot >= maxSlots) {
				IGalertDIV("Your object cart is already full.",true)
				ev.reset(shuffLoc.x,shuffLoc.y)
				grex.bringToTop()
				return
			}
		    try {IGclick.play();} catch (e) {}
		    books[libn].visible = false
		    ev.scale.setTo(ev.asscaled*(1.4*bubbleW/centerW))
		    var adj = slot - (numInHand.length/2 - 0.5)
		    ev.reset(clueLoc.x,clueLoc.y + 0.75*bubbleW*adj)
		    ev.handloc = {x: ev.x, y: ev.y}
		    ev.slot = slot
		    numInHand[slot] = true
		    ev.inhand = true
		    countSteps = true
		    grex.visible = false
		// }
	} else if (IGcheckOverlap(ev,bookStand)) {
		// IGconsole("ev.idx, shuffle, pidxs, libn: "+ev.idx+":"+ev.shuffle+":"+pidxs[libn]+":"+libn)
		if (ev.idx == pidxs[libn]) {
			try {IGbell.play();} catch (e) {}
		    if (!roomevents[libn].inhand & !roomevents[libn].shelved & ev.inhand) 
		    	{PSswapWithHand(roomevents[libn],ev)} else {numInHand[ev.slot]=false}
		    if (!ev.shelved) {
		    	numShelved += 1;
		    	PSsetFeedback()
		    }
		    try {IGclick.play();} catch (e) {}
			ev.scale.setTo(ev.asscaled)
		    ev.reset(shuffLoc.x,shuffLoc.y)
		    ev.shelved = true
		    ev.inputEnabled = false
		    ev.inhand = false
		    books[ev.i].visible = true
		    grex.visible = false
		    grcheck.visible = true
		    grcheck.bringToTop()
		    PSaddNewShelved(ev.idx)
		    rooms[libnum].done = true
		    // if (PSaddNewShelved(ev.idx)) {penaltyMsg.setText("New book shelved!")} else {penaltyMsg.setText("")}
		    // if there is an object in the room, move it to hand
		} else {
			try {IGbuzzer.play();} catch (e) {}
			if (ev.inhand) {
				numMistakes++
				// ev.anchor.setTo(1,1.0)
			    ev.reset(ev.handloc.x,ev.handloc.y)
			} else {
				// ev.anchor.setTo(0.5,1.0)
			    ev.reset(shuffLoc.x,shuffLoc.y)
			}
		}
	} else if (ev.inhand) {
		ev.reset(ev.handloc.x,ev.handloc.y)
	} else {
	    ev.reset(shuffLoc.x,shuffLoc.y)
	}
	var isdone = (numShelved >= DMMtarget) ? true : false
	if (isdone) {
		IGstopTimer(); 
		IGanalytics(['Stacks', 'Finish', EventType]);
		DMMisDone = true; 
		PSshowScores()
	}
    grex.bringToTop()
}
function PSshowDescr() {
	IGalertDIV("\n\n"+EventVars[EventType][currentObj].description,"auto",false,true,true,14,true)
}

function PSreloadPaths(pev) {
	grcheck.visible = false
    pev = (pev) ? pev : this
	var nidx = pev.idx
	// for some reason, the tostart property is not being carried
	// for the DIV version of the back button
	if ((pev.tostart) || (!pev.idx)) {
		nidx = pidxs[startingRoom]
		// backBut.idx = []
	} else if (pev.back) {
		nidx = pev.idx.pop()
		PSupdatePenalty(Psmallpenalty)
	} else {if (countSteps) {steps++;}}

	// libnum holds the library coming from

	//library is held in the evidx2lib[idx]
	var thislib = evidx2lib[nidx]
	libnum = 'library'+thislib
	// making events visible
	// events are visible if:
	//	- they are inhand
	//	- they belong in this room and are shelved
	//	- they originated in this room and are not shelved
	for (var i=0; i<DMMnumRooms; i++) {
		// hide all rooms except this one
		if (i == thislib) {
			// show this room
			if (roomevents[i].shelved) {
				// roomevents[i].
				roomevents[i].visible = false
			} else if (roomevents[i].inhand) {
				roomevents[i].visible = true
			} else {roomevents[i].visible = true}
			books[i].visible = (roomevents[i].shelved || roomevents[i].inhand) ? false : true
			if (books[i].visible & !roomevents[i].shelved) {grex.visible = true} else {grex.visible = false}
		} else {
			//hide this room
			// IGconsole("room, evidx, shelved: "+thislib+":"+evidx2lib[roomevents[i].idx]+":"+roomevents[i].shelved)
			roomevents[i].visible = (roomevents[i].inhand || ((evidx2lib[roomevents[i].idx] == thislib) & roomevents[i].shelved) ) ? true : false
			if (roomevents[i].inhand) {books[i].visible = false}
			else {
				books[i].visible = ((evidx2lib[roomevents[i].idx] == thislib) & roomevents[i].shelved) ? true : false
				if ((evidx2lib[roomevents[i].idx] == thislib) & roomevents[i].shelved) {
					grcheck.visible = true;
					roomevents[i].visible = true
					IGconsole("checked!")
				}
			}
		}
		if (roomevents[i].visible) {roomevents[i].bringToTop()}
	}
	var descrheadtxt = EventVars[EventType][pidxs[thislib]][clue] + ": "+
		EventVars[EventType][pidxs[thislib]].date
	// dhead.setText(descrheadtxt)
	// recreate title to be sure it is on top
	title.setText(descrheadtxt + " ")
	// title.destroy(); title = null
	// title = IGaddText(titleLoc.x,titleLoc.y,
	// 		descrheadtxt,
	// 		hstylevlb)

	var desctext = (overview == "objects") ? shuffleArray(EventVars[EventType][pidxs[thislib]][overview].split(";"))[0].trim() : EventVars[EventType][pidxs[thislib]][overview]
	// this gets the first one
	if (desctext.length>descLen) {
		var pos = IGfindPrevious(desctext.substring(0,descLen),' ')
		desctext = desctext.substring(0,pos) + "..."
		IGhide(moreBtn,false)
		moreBtn.idx = pidxs[thislib]
		currentObj = pidxs[thislib]
	} else {IGhide(moreBtn,true)}

	// IGconsole("descr: "+desctext)
	descr.setText(desctext)
	// // now, adjust the doors
	// IGconsole("doors to: "+rooms[libnum].cx)
    for (var i=0; i<DMMnumDoors; i++) {
    	var nextr = (rooms[libnum].cx[i]>-1) ? rooms[libnum].cx[i] : false
    	// IGconsole("door to: "+nextr)
    	pevents[i].x = doorLoc[i].x//+((i-adj)*doorLoc[i].spacing)
    	pevents[i].y = doorLoc[i].y
    	// catch when there is no other door; sometimes only 1 or 2 doors
    	if (nextr == thislib) {
    		IGconsole("self ptr: "+thislib)
			pevents[i].setText("")
			doorev[i].visible = false
    	} else {
	    	// try {
	    	if (pidxs[nextr]) {
		    	pevents[i].setText(EventVars[EventType][pidxs[nextr]][clue] + "\n"+
			    	EventVars[EventType][pidxs[nextr]].date)
			    doorev[i].visible = true
		    	doorev[i].reset(doorLoc[i].x,doorLoc[i].y)
		    	doorev[i].idx = pidxs[nextr]
			    doorev[i].events.onInputDown.add(PSreloadPaths,this)
		    	IGhide(masks[i],true)
			} else {
				// IGconsole("no door: "+dlocs[i])
				pevents[i].setText("")
				doorev[i].visible = false
		    	IGhide(masks[i],false)
			}
		}
    }

    // shouldn't have to do this, but timer not working on button overlays for some reason
    // backBut.overlay = false

	// mark this room as visited
	rooms[libnum].visited = true
	grex.bringToTop()
	grcheck.bringToTop(); 

}
var preloadBar
function loadLarge() {
	for (var i=3;i<DMMnumRooms;i++) {
		IGconsole("loading: "+inames[i])
	   	game.load.image(iimgs[i], ImgPath+'large/'+inames[i]+'.png')
	}
}

function PSloadPaths() {

	// loadLarge()
	   	game.load.image(iimgs[0], ImgPath+'large/'+inames[0]+'.png')
	   	game.load.image(iimgs[1], ImgPath+'large/'+inames[1]+'.png')
	   	game.load.image(iimgs[2], ImgPath+'large/'+inames[2]+'.png')

	bookStand = IGaddSprite(MIDX,MIDY,'groupb')
	bookStand.scale.setTo(1.4*IGratio)

    moreBtn = IGaddDivButton({xloc:moreLoc.x,yloc:moreLoc.y, text: "more...",rtnf: 'PSshowDescr'});
    IGhide(moreBtn,true)

	IGstillTrying = true

//		waiting.visible = false

    var libn = parseInt(libnum.replace('library',''))
    startingRoom = parseInt(daterooms[sortdates[0]].replace('library',''))

    var descrheadtxt = EventVars[EventType][pidxs[libn]][clue]+": "+
		EventVars[EventType][pidxs[libn]].date
	// dhead = IGaddText(WIDTH/8, HEIGHT/2+ry(106), descrheadtxt, tstyle2c);
	// dhead.anchor.setTo(0.5,1)
	// dhead.scale.setTo(scd,scd)

	// this gets a random selection
	var desctext = (overview == "objects") ? shuffleArray(EventVars[EventType][pidxs[libn]][overview].split(";"))[0].trim() : EventVars[EventType][pidxs[libn]][overview]
	// this gets the first one
	// var desctext = (overview == "objects") ? IGgetFirst(EventVars[EventType][pidxs[libn]][overview]) : EventVars[EventType][pidxs[libn]][overview]
	// IGconsole("descr: "+EventVars[EventType][pidxs[libn]][overview].length)

	// recreate title to be sure it is on top
	title.setText(descrheadtxt + " ")
	// title.destroy(); title = null
	// title = IGaddText(titleLoc.x,titleLoc.y,
	// 		descrheadtxt,
	// 		hstylevlb)

	if (desctext.length>descLen) {
		var pos = IGfindPrevious(desctext.substring(0,descLen),' ')
		desctext = desctext.substring(0,pos) + "..."
		IGhide(moreBtn,false)
		moreBtn.idx = pidxs[libn]
		currentObj = pidxs[libn]
	} else {IGhide(moreBtn,false)}
	// this gets the first one

    descr = IGaddDivText({xloc:descLoc.x, yloc:descLoc.y-ry(30), text:desctext, width:descWidth,
    	height:boxH, size:Math.floor(IGxratio*15), weight:300});

    penaltyMsg = IGaddText(WIDTH/2,ry(40),"",tstyle2)
    penaltyMsg.visible = true

    // get all the candidates that this room could connect to
    // which is all events later in time

    // first, shuffle the books into the wrong rooms
    shuffrooms = []
    for (var i=0; i<DMMnumRooms; i++) {shuffrooms[i]=pidxs[i]}
    shuffrooms = shuffleArray(shuffrooms)
	// now pidxs has the correct room for each book, and shuffrooms has the incorrect room
	// make pointers between the book and its room
	swapRooms = function(a,b) {
		var tmp = shuffrooms[a]
		shuffrooms[a] = shuffrooms[b]
		shuffrooms[b] = tmp
	}
	matchRooms = function() {
		pid2shuff = []
		var ret = false
	    for (var i=0; i<DMMnumRooms; i++) {
	    	for (var j=0; j<DMMnumRooms; j++) {
	    		// pid2shuff contains pointers from correct room to incorrect room
	    		if (shuffrooms[j] == pidxs[i]) {
	    			pid2shuff[i] = j;
	    			if (i==j) {
	    				// IGconsole("correct room: "+EventVars[EventType][pidxs[i]].description)
						if (j>0) {
							swapRooms(j-1,j)
						} else {
							swapRooms(j,j+1)
						}    				
	    				ret = true
	    			}
	    		}
	    	}
	    }
	    return ret
	}
	while (matchRooms()) {
		IGconsole("still a correct room")
	}

	// this routine puts the events in each room
	// the new method, they will be in the rooms in order
    for (var i=0; i<DMMnumRooms; i++) {
		roomevents[i] = IGaddSprite(shuffLoc.x,shuffLoc.y, iimgsc[pid2shuff[i]]);
		var sc
		var sc1 = (roomevents[i].height>ry(centerW)) ? ry(centerW)/roomevents[i].height : 1.0
		var sc2 = (roomevents[i].width>rx(centerW)) ? rx(centerW)/roomevents[i].width : 1.0
		var sc = (sc1>sc2) ? sc2 : sc1
		// IGconsole("rat: "+Math.round(roomevents[i].height)+":"+rat+":"+IGyratio+":"+dhgt)
		roomevents[i].scale.setTo(sc*IGratio,sc*IGratio)
		roomevents[i].asscaled = sc*IGratio
	    roomevents[i].inputEnabled = true
	    roomevents[i].input.enableDrag(false, true)
	    roomevents[i].events.onInputDown.add(PSspriteTouched, this);
	    roomevents[i].events.onDragStart.add(PSspriteMoving, this);
	    roomevents[i].date = ""
	    roomevents[i].events.onDragStop.add(PSspriteMoved, this);
	    // idx contains the room it belongs in
	    roomevents[i].idx = pidxs[pid2shuff[i]]
	    roomevents[i].i = i
	    // shuffle contains the room it is in
		// rooms[rn].doorcandidates.sort(function(a,b){return a-b})
		// IGconsole("sorted cands: "+rooms[rn].doorcandidates.toString())

		books[i] = IGaddSprite(bookLoc.x,bookLoc.y+ry(12), iimgsc[pid2shuff[i]])
		// var dhgt = Math.round(bubbleW)
		// var dwid = ry(bubbleW)
		// var rwid = Math.round(books[i].width)
		// var rhgt = Math.round(books[i].height)
		// var rat1 = (rhgt < dhgt) ? 1.0 : dhgt/rhgt
		// var rat2 = (rwid< dwid) ? 1.0 : dwid/rwid
		// sc = (rat1>rat2) ? rat2 : rat1

		sc1 = (books[i].height>ry(bubbleW+50)) ? ry(bubbleW)/books[i].height : 1.0
		sc2 = (books[i].width>rx(bubbleW)) ? rx(bubbleW)/books[i].width : 1.0
		sc = (sc1>sc2) ? sc2 : sc1

		books[i].scale.setTo(sc*IGratio,sc*IGratio)

		if (i!=libn) {roomevents[i].visible = false; books[i].visible = false}

    }

    // Now, events are in their correct rooms. Now I need to randomly sort the 
    // events into the wrong rooms, so the user can file them back correctly.


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

		// IGconsole("room cx: "+key+":"+adjacs.W+":"+adjacs.N+":"+adjacs.E+":"+adjacs.S)
		// var src = (clue == "category") ? "category" : "actor"
		var tmp1 = EventVars[EventType][pidxs[key.toString().replace('library','')]][clue]
		var tpos = (tmp1.indexOf(",")>-1) ? tmp1.indexOf(",") : tmp1.length
		var label =  tmp1.substring(0,tpos)+'\n'+
			EventVars[EventType][pidxs[key.toString().replace('library','')]].date
		rooms[key].label = label
		rooms[key].date = EventVars[EventType][pidxs[key.toString().replace('library','')]].date
    	// IGconsole('g.addNode("'+key+'",{label: "'+label+'"})')
		// IGconsole("rooms and dates: "+sortdates[i]+":"+knum+":"+roomLocs[knum]+":"+rooms[key].date)
    }

    // set up the doors in this first room

    for (var i=0; i<DMMnumDoors; i++) {
    	// to get the next door, iterate through the cx of this room
    	pevents[i] = {}
    	// IGconsole("nextr: "+nextr)
    	if (rooms['library'+(libn)].cx[i]>-1) {
	    	var nextr = rooms['library'+(libn)].cx[i]
		    pevents[i] = IGaddText(doorLoc[i].x,doorLoc[i].y, EventVars[EventType][pidxs[nextr]][clue] + "\n"+
		    	EventVars[EventType][pidxs[nextr]].date, hstylel);
		    doorev[i] = IGaddSprite(doorLoc[i].x,doorLoc[i].y,'doorbtn')
		    doorev[i].inputEnabled = true
		    doorev[i].events.onInputDown.add(PSreloadPaths,this)
		    doorev[i].idx = pidxs[nextr]
	    	IGhide(masks[i],true)
		} else {
			// IGconsole("no event: "+nextr+":"+pidxs[nextr])
			// need to create the door anyway for use later
		    pevents[i] = IGaddText(0,0,"", hstylel);
		    doorev[i] = IGaddSprite(doorLoc[i].x,doorLoc[i].y,'doorbtn')
		    doorev[i].inputEnabled = true
		    doorev[i].events.onInputDown.add(PSreloadPaths,this)
		    doorev[i].idx = pidxs[0]
		    doorev[i].visible = false
	    	IGhide(masks[i],false)
		}

    }

	// prevRoom = IGaddText(WIDTH/2,backLoc.y,"You are at the start.",hstylel)

	grcheck = IGaddSprite(shuffLoc.x,shuffLoc.y,'grcheck')
	grcheck.visible = false
	grex = IGaddSprite(shuffLoc.x,shuffLoc.y,'grex')

    ////////////////////////////////////////////////////

	instruct.visible = false

	hintBack = game.add.button(WIDTH/2,HEIGHT/2,'background',PSshowHelp,this,2,1,0)
	hintBack.hide = true
	hintBack.visible = false

	hint = IGaddText(WIDTH/2,HEIGHT/2,'This library stack has:\n\n'+EventVars[EventType][pidxs[libn]][objsrc].replace(/;/g,'\n')+
		"\n\n\n\n\n\n\nClick anywhere in the grey to dismiss this hint.", 
		tstyle)
	hint.visible = false

	if (preloadBar) {preloadBar.visible = false; preloadBar.destroy()}
	preloadBar = null
	notLoaded = false

	// For finding missing rooms
	//
	for (var r=0;r<DMMnumRooms;r++) {
		var hit = false
		for (var j=0;j<DMMnumRooms;j++) {
			if (pidxs[j] == roomevents[r].idx) {hit=true}
		}
		if (!hit) {IGconsole("missing room: "+r+":"+roomevents[r].idx)}
	}
	rooms[libnum].visited = true

	instruct2.visible = false
	IGstopSpinner()
	IGanalytics(['Stacks', 'Load', EventType]);

	var dbsiz = "\n\n\n"+DMMnumRooms+" "+ObjTypes[EventType2]+" randomly selected from "+EventNum+" in "+displayTopics[EventType2]+"."

	IGalertDIV("\n\nUse the cart on the left to carry each object to the correct room."+dbsiz,"auto",false,true,true,16)

}
var updcnt = 0
var PSpathway = {


	preload: function() {

    if (EventNum<IGminEvents[IGgameApp]) {
        var rtn = (Object.keys(STopics).length<2) ? false : APPnewGame()
        IGstopSpinner()
        IGalertDIV("\n\nThere aren't enough events on this topic to play this game at this time."+
            "\n\nUse the menu upper right to select a different game "+
            "or to restart this game with a different topic.",
            "auto",rtn,true,true,true,16);
        return;
    }

// until the new arrangement is stable, put this here
DMMnumDoors = 4

		notLoaded = true

		// need to put these here, they have to be re-calculated after page load
		roomWidth = 90//IGratio*100
		roomHeight = 90//IGratio*100

		game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')
		notLoaded = true
		// game.stage.backgroundColor = IGbackground
		IGwhite = true
		// parameter tells it to register user
		DMMSetTopics()
		IGsetGlobalFunctions(true)
		if (IGwhite) {
			IGdefineScales()
			IGsetStage('#ffffff')
		} else {
			IGdefineScales()
			IGsetStage()
		}
		IGsetGlobalFunctions()
		DMMgameReset()
		PSresetEvents()
		CleanupList = []
		DMMnumRooms = 11
		PSsetTarget()
		IGconsole("level, target: "+DMMlevel+":"+DMMtarget)

		game.load.image('groupb', AppPath+'pics/targetCircle.png');
		game.load.image('targitem', AppPath+'pics/cart.png');
		game.load.image('objback', AppPath+'pics/shouldBeIn.png');
		game.load.image('objback2', AppPath+'pics/isIn.png');
		game.load.image('doorbtn', AppPath+'pics/doorBtn2.png');
		game.load.image('museum', AppPath+'images/roomBG.png');
		game.load.image('grcheck', AppPath+'pics/greenCheck.png');
		game.load.image('grex', AppPath+'pics/greenEx.png');
		game.load.image('upa', AppPath+'pics/up.png');
		game.load.image('downa', AppPath+'pics/down.png');
		game.load.image('lefta', AppPath+'pics/left.png');
		game.load.image('righta', AppPath+'pics/right.png');
		game.load.image('upMask', CommonPath+'pics/doorOverlayTop.png')
		game.load.image('downMask', CommonPath+'pics/doorOverlayBottom.png')
		game.load.image('leftMask', CommonPath+'pics/doorOverlayLeft.png')
		game.load.image('rightMask', CommonPath+'pics/doorOverlayRight.png')

		// titleloc = {x: game.world.centerX, y: ry(18)}

		// var dloc = (WIDTH>1100) ? 220 : 180

		// shuffLoc = {x: WIDTH/8, y: HEIGHT-ry(20)}
		// handLoc = {x: 7*WIDTH/8, y: HEIGHT-ry(20)}
		// bookLoc = {x: WIDTH/8, y: HEIGHT/2+ry(30)}
		// descLoc = {x: 7*WIDTH/8-ry(16), y: HEIGHT/4}
		// doorLoc = {x: WIDTH/2+rx(dloc), y: HEIGHT - ry(80)}
		bubbleW = IGratio*190
		columnW = rx(280)
		centerW = IGratio*290
		cartH = IGyratio*700
		boxH = IGratio*154

		topRow = MIDY - IGratio*310
		botRow = MIDY+IGratio*320
		divisionLocs = {0: {x: WIDTH/2, y: ry(32)},
			1: {x: MIDX-IGratio*304-IGxratio*123, y: HEIGHT/2-ry(170)},
			2: {x: MIDX-IGratio*304-IGxratio*123, y: HEIGHT/2},
			3: {x: MIDX+IGratio*304+IGxratio*123, y: HEIGHT/2+ry(126)},
			4: {x: WIDTH/2, y: HEIGHT-ry(3)}
		}
		vbarLoc = {0: {x: WIDTH/9, y:0}, 1:{x: 8*WIDTH/9, y:0}}
		mapLoc = {x: divisionLocs[2].x+IGratio*16, y: topRow-IGratio*8}
		setLoc = {x: WIDTH/2-IGxratio*457, y: 72}

		backLoc = {x: MIDX, y: MIDY+IGratio*216}
		startLoc = {x: MIDX, y: MIDY+IGratio*318}

		sackLoc = {x: 8*WIDTH/9, y: 5*HEIGHT/6}
		shuffLoc = {x: MIDX, y: MIDY}
		// for now, put this off screen
		penLoc = {x: WIDTH+rx(100), y: HEIGHT+100}

		bookLoc = {x: divisionLocs[3].x, y: divisionLocs[1].y}

		var xloc = 7*WIDTH/8 //((EventType == "Science") || (EventType == "Museum")) ? WIDTH/2 : 4*WIDTH/5
		stealLoc = {x: MIDX, y: MIDY}

		descLoc = {x: divisionLocs[3].x, y: divisionLocs[3].y}
		descImgLoc = {x: divisionLocs[3].x, y: divisionLocs[1].y}
		descLen = ry(300)
		descWidth = columnW-rx(50)
		libLoc = {x: WIDTH/2, y: divisionLocs[2].y+ry(100)}
		clueLoc = {x: divisionLocs[2].x, y: divisionLocs[2].y, spacing: cartH}
		missLoc = {x: 7*WIDTH/8+ry(20), y: HEIGHT/6-ry(50)}
		titleLoc = {x: WIDTH/2, y: topRow-ry(10)}
		doorLoc = [{x: WIDTH/2-IGratio*210, y: HEIGHT/2, spacing: IGratio*210},
			{x: WIDTH/2, y: MIDY-IGratio*216, spacing: IGratio*210},
			{x: WIDTH/2+IGratio*210, y: HEIGHT/2, spacing: IGratio*210},
			{x: WIDTH/2, y: MIDY+IGratio*216}]

		xloc = WIDTH/2
		instrLoc = {x: xloc, y: divisionLocs[0].y+ry(110), spacing: rx(456)}
		moreLoc = {x: divisionLocs[3].x+rx(78), y: divisionLocs[3].y+IGratio*178}

		var rightEdge = WIDTH/2 + centerW + columnW - rx(24)
	    menuLoc = {x: rightEdge-30, y:topRow+ry(10)}
		helpLoc = {x: rightEdge-78, y: topRow-IGratio*14}
		filmLoc = {x: rightEdge-180, y: topRow-IGratio*14}

	 	settingsBtn = IGaddDivButton({xloc:setLoc.x,yloc:setLoc.y,rtnf: 'PgetSettings', 
	 		hclass: 'fa fa-cog'})

		revcenter = [WIDTH/8,HEIGHT/3]

		if ((EventType == "Art") || (EventType == "Science") || (EventType == "Movies")) {clue = 'actor'}
		else if (EventType == "Museum") {clue = 'location'}
		else {clue = 'category'}
		if ((EventType == "Literature") || (EventType == "Movies")) {
			// slightly favor using the description
			var ver = Math.floor(Math.random()*1.5)+1
			if (ver < 2) {
				overview = 'description'
				objsrc = 'objects'
			} else {
				overview = 'objects'
				objsrc = 'description'
			}
		}
		if ((objsrc=="objects") || (overview='objects') ) {
				EventNumU = 0
				for (var e=0;e<EventNum;e++) {if (EventVars[EventType][e].objects.length>3) {EventNumU++}}
		} else {EventNumU = EventNum}
		IGconsole("EventNum: "+EventNum+":"+EventNumU+":"+(EventNum-EventNumU))

		iimgs = ['imglib0','imglib1','imglib2','imglib3','imglib4','imglib5','imglib6',
			'imglib7','imglib8','imglib9','imglib10','imglib11','imglib12','imglib13',
			'imglib14','imglib15','imglib16','imglib17','imglib18','imglib19','imglib20']

		// have to reload the rooms dynamically because HEIGHT and WIDTH are set after
		// this file is loaded
	    title = IGaddDivText({xloc:titleLoc.x, yloc:titleLoc.y,
	    	text:Subjects[EventType2].replace('Strings','Rooms').replace(' through ',' in '),
	    	width:500,height:50,size:18,color:'#000000',weight:400})

		// title = IGaddText(titleLoc.x,titleLoc.y,
		// 	Subjects[EventType2].replace('Strings','Rooms').replace(' in ',' through '),
		// 	hstylevl);
		// title.visible = false

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
	    	while ((IGisInArray(r,pidxs)) || EventVars[EventType][r][overview].length<3) {
	    		r = Math.floor(Math.random()*(EventNum))
	    	}
	    	// this has to be here for the above test to work, though re-set below
	    	pidxs[i] = r
	    	// detect an object in the correct room
	    	var dat = parseInt(EventVars[EventType][r].date)+0.1
	    	while (IGisInArray(dat,sortdates)) {dat+=0.1}
	    	dateidxs[dat] = r
	    	sortdates.push(dat)
	    	// IGconsole("dat: "+dat)
	    	// var pos = EventVars[EventType][r].image.lastIndexOf('.')
	    	// var iname = EventVars[EventType][r].image.substr(0,pos)
	    	// var iname2 = iname.replace(/ /g,"_").replace(/,/g,"_")
	    	// inames[i] = iname2
	    	// game.load.image(iimgsc[i], ImgPath+IGimgPath+'/'+iname2+'.png')
		   	// game.load.image(iimgs[i], ImgPath+'large/'+inames[i]+'.png')
	    	// iimgstxt[i] = 'Image Credit: '+EventVars[EventType][r].URL
	    }

	    sortdates.sort(function(a,b){return a-b})
	    // now that sorted in order, need to re-assign rooms to be chron ordered
	    //
	    pidxs = []
	    for (var i=0; i<DMMnumRooms; i++) {
	    	// IGconsole("sorted date: "+sortdates[i])
	    	daterooms[sortdates[i]] = 'library'+i
	    	var r = dateidxs[sortdates[i]]
	    	// pidxs stores a sequential array of event indexes
	    	pidxs[i] = r
	    	// need reverse pointer also, from event index to the room number
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

    // instructions
		instruct = IGaddText(WIDTH/2, 4*HEIGHT/9, instructTextS2, tstyle2m);
		instruct.anchor.setTo(0.5,0)
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

		for (var tt=0;tt<maxSlots;tt++) {
			var yoff = tt - (maxSlots/2-0.5)
		   	var tmptarg = IGaddSprite(clueLoc.x, clueLoc.y+(yoff*clueLoc.spacing/(maxSlots+1)), 'groupb')
		   	tmptarg.scale.setTo(1.35*IGratio,1.35*IGratio)
		}
    	// sackInst = IGaddDivText({xloc:clueLoc.x, yloc:clueLoc.y, 
    	// 	text:"To carry items to another room, drag them onto this cart.", width:descWidth,
	    // 	size:Math.floor(IGxratio*14), weight:400});

		var ff = IGxratio*14
		var tsty = { font: ff+"px Arial", fill: "#000000", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthColumn-rx(16) };
		sackInst = IGaddText(clueLoc.x, clueLoc.y, 
    		"To carry items to another room, drag them onto this cart.", tsty)

	    var objBack = IGaddSprite(descLoc.x, divisionLocs[3].y, 'objback')
    	objBack.scale.setTo(IGxratio,IGyratio)
	    var objBack2 = IGaddSprite(descImgLoc.x, descImgLoc.y, 'objback2')
    	objBack2.scale.setTo(IGxratio,IGyratio)


		mission = IGaddText(descImgLoc.x,descImgLoc.y-ry(110),"What's in this room:",style3b)
		// mission.scale.setTo(sc,sc)
		mission.anchor.setTo(0.5,0)
		mission2 = IGaddText(descLoc.x,descLoc.y-ry(148),"What should be in this room:",style3b)
		// mission.scale.setTo(sc,sc)
		mission2.anchor.setTo(0.5,0)

		var sH = IGaddText(clueLoc.x,botRow,'Sorted: ',hstyle3)
		sH.anchor.setTo(1,0.5)
		var rH = IGaddText(descLoc.x,botRow,'Remaining: ',hstyle3)
		rH.anchor.setTo(1,0.5)
		sortedT = IGaddText(clueLoc.x+10,botRow,'0',hstyle3a)
		remainT = IGaddText(descLoc.x+10,botRow,parseInt(DMMnumRooms),hstyle3a)

	    helpTextLocal = helpTextS[0]
	    for (var i=1; i<8; i++) {helpTextLocal = helpTextLocal + "\n\n"+helpTextS[i]}
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

		window.setTimeout(PSloadPaths,100)
	},

	update : function() {

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
