////////////////////////////////////////////////////////////
//
// sequence.js
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//
/////////////////////////////////////////////////////////////

var notLoaded = true

var APPnumEvents = 9

var idxs = []
var evDates = []
var evTitles = []
var titlestxt = [], titleshade = []
var iimgstxt = []
var bloomObjs = []
var event1,event2,event3,event4,event5,event6,event7,event8,event9, halo, bubbleW, target, endText, APParrow
var evt = []
var events = [event1,event2,event3,event4,event5,event6,event7,event8,event9]
var numEvents = events.length

var navTab, newGame, nextSet, leaderboard, shortest, textScore, textPenalties, textBonuses,
	hscore,hbon,hpen, topRow
var numChecks = 0
var numMistakes = 0
var BASESCORE = 20
var MINSCORE = BASESCORE/2
var MAXPENALTY = BASESCORE/2
var BCEBONUS = 5
var maxSpanPts = 15
var maxTime = 60

function DMMmenu() {
	// last three parameters are small, skip header, and put lower
    IGendGame({msg: 'You are in the middle of a game. Selecting any button but the first will abort this game.',
        fcns: {again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame'},small: true,wide:true,lower:true,nohead:true})
}
function APPrestart() {
    if ((EventVars[EventType])) {
        IGstartSpinner()
        game.state.start('entry',true,true)
    } else {APPnewGame()}
}
function APPnewGame() {
	IGconsole("restarting")
	loadURLExt({'url': '/launch/index.html?alias='+DMMalias+'&partner='+IGpartner})
}
function changeBackground(e) {
	if (e.bg) {game.stage.backgroundColor = IGaltBG; e.bg=false}
	else {game.stage.backgroundColor = IGbackground; e.bg=true}
}
function SshowHelp() {
    IGalertDIV(helpTextLocal,'big')
}
function SshowName(ev) {
	var objnum = (isAndroid || isFireFox) ? ev.iloc : ev
    var onoff = (events[objnum].hidden) ? true : false
    IGhide(titlestxt[objnum],false)
    // IGhide(titleshade[ev.idx],onoff)
    events[objnum].hidden = !onoff
}
function ShideName(ev) {
	var objnum = (isAndroid || isFireFox) ? ev.iloc : ev
    var onoff = (events[objnum].hidden) ? true : false
    IGhide(titlestxt[objnum],true)
    // IGhide(titleshade[ev.idx],onoff)
    events[objnum].hidden = !onoff
}
function ShideAllNames() {
	for (var t=0;t<titlestxt.length;t++) {
	    IGhide(titlestxt[t],true)
	}
}
function SshowFinishedNames() {
	for (var t=0;t<titlestxt.length;t++) {
		IGconsole("yloc: "+titlestxt[t].yloc())
	    if (titlestxt[t].yloc()<HEIGHT/3) {IGhide(titlestxt[t],false)}
	}
}
function setScoresVisible(onoff) {
	hscore.visible = onoff
	hbon.visible = onoff
	hpen.visible = onoff
	textPenalties.visible = onoff
	textScore.visible = onoff
	textBonuses.visible = onoff
}

function isInArray(value, array) {
		return array.indexOf(value) > -1;
	}

function addBCE() {
	var bon = 0
	if (EventType.indexOf("Cities")<0) {
		for (var t=0;t<targs.length;t++) {if (parseInt(targs[t].date)<0) {bon+=BCEBONUS}}
	}
	return bon
}
function calcScore() {
	var penalties = 0
	var timeBonus = 0
	var firstBonus = 0
	DMMscore = DMMscore + BASESCORE // value for completing the string
	var span = Math.round((targs[targs.length-1].date - targs[0].date)*100)/100
	// var max = evDates[evDates.length-1] - evDates[0]
	// IGconsole("span, max: "+span+":"+max)
	// bonus for time?
	var timePenalty = 0
	if (IGnumSecs < maxTime) {
		timeBonus = Math.round((maxTime/IGnumSecs) * 5)
		if (timeBonus > 12) {timeBonus = 12}
		if (numChecks < 2) {IGconsole("BIG BONUS"); firstBonus = 10}
	} else {
		// // calculate time penalty -- NO, ABANDON THIS
		// timePenalty = Math.pow(Math.round(IGnumSecs/maxTime),3)
	}
	// calc % of distance between min and max achieved
	// var spanPenalty = Math.round(Math.pow(((span-shortest) / (max-shortest) * 10),2) * 0.18)

	// simple calc % of distance between min and max achieved
	// switch this now [06/24/14] to be a bonus rather than a penalty
	// var tmp = Math.pow(span/shortest,3)
	// if (tmp>10) {tmp=10}
	// var spanBonus = 15 - Math.round((Math.pow(tmp,2) * 0.18))
	var spanBonus = Math.round(shortest/span * maxSpanPts)
	var BCEbonus = addBCE()
	DMMscore = DMMscore + spanBonus + BCEbonus + firstBonus + timeBonus

	IGconsole("shortest, span, spanBonus: "+shortest+":"+span+":"+spanBonus)
	// subtract for retries
	if (numChecks == 1) {numChecks = 0}
//	IGconsole("penalties: "+spanPenalty+":"+Math.pow((numChecks),2)+":"+timePenalty)
	penalties = numMistakes*5 + timePenalty
	if (penalties>MAXPENALTY) {penalties=MAXPENALTY}
	DMMscore = DMMscore - penalties
	DMMscore = (DMMscore<MINSCORE) ? MINSCORE : DMMscore
	textPenalties.setText(penalties+" ")
	textScore.setText(DMMscore+" ")
	textBonuses.setText((timeBonus+firstBonus+BCEbonus)+" ")

	// for multiple runs, store the score
	DMMscores.push(DMMscore)
	// real score is sum of the last 3 runs
	// var countStop = DMMscores.length - IGgetGameCount()
	// var totScore = 0
	// for (var i=DMMscores.length-1; i>(countStop-1); i--) {
	// 	IGconsole("score: "+cnt+":"+DMMscores[i])
	// 	totScore = totScore + DMMscores[i]
	// }
	totScore = IGcalcTotalScore()
	textTotal.setText(totScore+" ")
	IGconsole("total: "+totScore)

	// set score visible
	setScoresVisible(true)

	IGconsole("BCEbonus: "+BCEbonus)

	return [DMMscore, span, spanBonus, BCEbonus, timeBonus]

}
function checkSequence() {
	IGanalytics(['Strings', 'Check', EventType]);
	numChecks = numChecks + 1
	for (var i=0; i<targs.length; i++) {
		if (targs[i].date != null) {targs[i].dattext.setText("[+]")}
	}
	if (numChecks == 1) {numMistakes = 0}
	var ret = true
	var forgive = 0
	if (EventType=="Fashion" || EventType=="History") {forgive = 5}
	for (var i=0; i<targs.length-1; i++) {
		if (targs[i].date != null) {
			if (targs[i+1].date != null) {
				if (parseInt(targs[i].date) > parseInt(targs[i+1].date)+forgive) {
					if (numChecks == 1) {numMistakes++}
	 				// IGconsole("no dates: "+parseInt(targs[i].date) +":"+ parseInt(targs[i+1].date))
					ret = false;
					targs[i+1].dattext.setText("move << left")
				// } else {
				// 	IGconsole("yes dates: "+parseInt(targs[i].date) +":"+ parseInt(targs[i+1].date))
				}
			// } else if (targs[i+2]) {
			// 	if (targs[i+2].date != null) {
			// 		if (parseInt(targs[i].date) > parseInt(targs[i+2].date)+forgive) {
			// 			ret = false;
			// 			targs[i+2].dattext.setText("move << left")
			// 		}
			// 	}
			}
		}
	}
	return ret
}
function checkAllArrows(targ) {
	// see if there is any event overlapping this target
	// this is just a double-check to catch the odd missed '+'
	var ret = false
	for (var a=0;a<events.length;a++) {
		if ((events[a].yloc() < targ.yloc()+10) && (events[a].yloc() > targ.yloc()-10)) {
			// is in the target row somewhere
			if ((events[a].xloc() < targ.xloc()+10) && (events[a].xloc() > targ.xloc()-10)) {
				// just be sure '+' is set and date is set
				targ.dattext.setText('[+]');
				targ.date = events[a].date;
				targ.idx = events[a].idx
				ret = true
			}
		}
	}
	return ret
}
function isReady() {
	var ret = true
	if (!userRequested & IGstillTrying) {
    	if (2>DMMlevel) {
    		// first, be sure to check every target to see if there is 
    		// an event on top
	    	for (i=0; i<targs.length; i++) {
	    		checkAllArrows(targs[i])
	    		if (targs[i].date == null) { ret = false }
	    	}
    	}
    }
    return ret
}
var endMsg, userDataMsg
function endGame() {
	// do this as a final act to catch swap arrows left on Android platform
		SshowFinishedNames()
	setEndText()
	var ldr = true
	if (!IGisIGServer) {ldr = false}
	IGendGame({msg:endMsg,fcns: {again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame',leader:ldr},
		small: true,lower:true,nohead:true,wide:true,size: 12})
	IGsendScore(userDataMsg)
}
function setEndText() {
	for (i=0; i<targs.length; i++) {
		if (EventVars[EventType][targs[i].idx]) {
			var txt = EventVars[EventType][targs[i].idx].actor
			if ((EventType.indexOf("Cities")>-1) || (EventType == "Dinosaurs")) {txt = EventVars[EventType][targs[i].idx].location}
			targs[i].dattext.setText(txt + "\n"+
				EventVars[EventType][targs[i].idx].date)
		} else {IGconsole("missing idx: "+targs[i].idx)}
	}
}
function showSuccess() {
	var foo = true
  if (IGstillTrying) {
	var foo = checkSequence()
	IGconsole("sequence: "+foo)
	if (foo) {
		IGstillTrying = false
		IGanalytics(['Strings', 'Finish', EventType]);
		IGstopTimer()
		var ret = [0,0,0,0]
		ret = calcScore(); thisSpan = ret[1]
		var numgames = (DMMscores.length>=3) ? 3 : DMMscores.length
		IGconsole("Scores: "+ret[0]+":"+ret[1]+":"+ret[2]+":"+ret[3])
		var ftrymsg = (numChecks==0) ? "\nYou received 10 bonus points for getting it right the first time." : "\nYou made "+IGzero(numMistakes)+" mistake"+IGplur(numMistakes)+"."
		var bcemsg = (ret[3]>0) ? "\nYou have "+Math.floor(ret[3]/BCEBONUS)+" date"+IGplur(ret[3]/BCEBONUS)+" from BCE for "+ret[3]+" bonus point"+IGplur(ret[3])+"." : ""
		endMsg = "Success!"+
			"\nYour span is "+thisSpan+". This gives you "+ret[2]+" span point"+IGplur(ret[2])+" of a possible "+maxSpanPts+"."+
			bcemsg+"\nYou received "+IGzero(ret[4])+" bonus point"+IGplur(ret[4])+" for speed."+ftrymsg+
	        "\n\nTo achieve Mastery of "+displayTopics[EventType].replace('\n',' ')+", you need "+IGwizardScores[IGgameApp]+" points from 3 consecutive games. "+
	        "You have "+DMMtotalScore+
	        " points (total for "+numgames+" game"+IGplur(numgames)+")."
		instruct.setText("")
		instruct2.setText("")
		userDataMsg = DMMscore+":"+DMMtotalScore+":"+ret[2]+":"+
			IGnumSecs+":"+numMistakes+" (Level "+DMMlevel+")"
		game.time.events.add(200,endGame)
	} else {instruct.setText("Try again.")}
  }
	return foo
}
var ttarg, tarr
// hack to cover the alignment bug from changing size
function reCenter() {
	tarr.x = ttarg.x
	tarr.y = ttarg.y
}
var savedS, savedSPos
function STRswapArrows(arrow,target) {
	var ret
	IGconsole("swapping: "+arrow.oldtar+":"+target.iloc)
	// must also check to see if moved old arrow lands on a new target
	for (var t=0;t<events.length;t++) {
		if (events[t].idx == target.idx) {
			IGconsole("found swap: "+events[t].tarloc)
			if (events[t].tarloc || events[t].tarloc == 0) {
				targs[events[t].tarloc].idx = null
				targs[events[t].tarloc].date = null
			}
			var tmp = {x:savedSPos.x,y:savedSPos.y}
			if (arrow.oldtar || arrow.oldtar == 0) {
				tmp = {x:targs[arrow.oldtar].xloc(),y:targs[arrow.oldtar].yloc()}
				// must clean up where this came from, in case it is later
				
				events[t].tarloc = arrow.oldtar
				targs[arrow.oldtar].idx = events[t].idx
				targs[arrow.oldtar].date = events[t].date
				targs[arrow.oldtar].dattext.setText("[+]")
			} else {events[t].tarloc = null}
			events[t].reset(tmp.x,tmp.y);
			// check to see if now on a spot
			ret = events[t]
			break;
		}
	}
	return ret
}
var thisSpan
var thisSwap
var tmpArrow,tmpTarget
function resetOnTarget() {
	tmpArrow.reset(tmpTarget.xloc(),tmpTarget.yloc())
}
function hitTarget(arrow,target,tarloc,redo) {
    try {IGclick.play();} catch (e) {}
    // the redo avoids an infinite loop with spriteMoved2
    if ((isAndroid || isFireFox) & !redo) {
	    thisSwap = null
	    if (target.idx || target.idx == 0) {
	    	thisSwap = STRswapArrows(arrow,target)
	    }
	    arrow.anchor.setTo(0.5,0.5)
		if (thisSwap) {game.time.events.add(50,spriteMoved2)}
    }
	arrow.setHalo(false)
    arrow.reset(target.xloc(),target.yloc())
    arrow.tarloc = tarloc
	target.date = arrow.date
	target.idx = arrow.idx

	// if (isReady()) {
	// 	ret = showSuccess()
	// }
	return isReady()
}
function unhitTarget(arrow,target) {
//	    try {IGclick.play();} catch (e) {}
	target.date = null
	target.idx = null
    target.dattext.setText("[ ]")
}
function resetArrow(ev) {
	ev.reset((ev.iloc+1)*WIDTH/(numEvents+1),arrowLoc.y)
}
function arrowHit() {
	// this means one event was dropped on another
	// need to swap places
	if (savedS) {
		IGconsole("arrow hit")
		if ((savedS != this) & (!savedS.istarget)) {
			var savtarloc = savedS.tarloc
			savedS.tarloc = this.tarloc
			this.tarloc = savtarloc
			thisSwap = this
			spriteMoved2()
		}
	}
}
function targetHit(e) {
	IGconsole("hit: "+this.iloc)
	if (e.stopPropagation) e.stopPropagation();
	if (!savedS.istarget) {
		savedS.tarloc = this.iloc
	}
}
function targetHighlight(e) {
	if (e.preventDefault) e.preventDefault(); // required to allow drop on this
}
function resetHalos(eid) {
	for (var e=0;e<events.length;e++) {
		if (e==eid) {events[e].setHalo(true);if (events[e].yloc()>0.3*HEIGHT) {IGhide(titlestxt[e],false)}}
		else {events[e].setHalo(false);if (events[e].yloc()>0.3*HEIGHT) {IGhide(titlestxt[e],true)}}
	}
}
function spriteMoved(e) {
	var ret
	// if (!MXOFF) {MXOFF=0}
	// var ttxloc = (isAndroid || isFireFox) ? 0 : MXOFF
	var ttyloc = (isAndroid || isFireFox) ? ry(57) : ry(50)
	var ttxloc = (isAndroid || isFireFox) ? 0 : 0//MXOFF
	var ev = this
  if (!ev.istarget) {
	if (isAndroid || isFireFox) {
		ev = e;
		IGhideTexts(false);
		// have to run through each target for non-DIV solution
		// because D&D target gets no event
		for (i=0; i<targs.length; i++) {
			if(IGcheckOverlap(ev, targs[i])) {ev.oldtar = ev.tarloc; ev.tarloc = i}
		}

	}
	if ((ev.tarloc) || (ev.tarloc == 0)) {
		var i = ev.tarloc
	    targs[i].dattext.setText("[+]")
	    ret = hitTarget(ev, targs[i],i);
	    if (titlestxt[ev.iloc]) {
	    	// ev.txt.setText(ev.txt.text.replace(/\\n/g," ").replace(/<br\/>/g,' '));
	    	titlestxt[ev.iloc].reset(targs[i].xloc()-ttxloc, targsLoc.y-ttyloc); //ev.txt.visible = true
	    	// ev.txt.setStyle(style3b)
	    }
		if (!isAndroid & !isiOS) {ShideAllNames()}
    }
	if (ret) {resetHalos(20)} else {resetHalos(ev.iloc)}
	if (isReady() & ret) {
		ret = showSuccess()
	}
  }
}
function spriteMoved2() {
	var ret
	// if (!MXOFF) {MXOFF=0}
	// var ttxloc = (isAndroid || isFireFox) ? 0 : MXOFF
	var ttyloc = (isAndroid || isFireFox) ? ry(57) : ry(50)
	var ttylocb = (isAndroid || isFireFox) ? ry(67) : ry(74)
	var ttxloc = (isAndroid || isFireFox) ? 0 : 0//MXOFF
	var ev = thisSwap
	thisSwap = null
	if ((ev.tarloc) || (ev.tarloc == 0)) {
		var i = ev.tarloc
	    targs[i].dattext.setText("[+]")
	    ret = hitTarget(ev, targs[i],i,true);
		if (ret) {resetHalos(20);IGhide(titlestxt,false);}
	    if (titlestxt[ev.iloc]) {
	    	// ev.txt.setText(ev.txt.text.replace(/\\n/g," ").replace(/<br\/>/g,' '));
	    	titlestxt[ev.iloc].reset(ev.xloc()-ttxloc, ev.yloc()-ttyloc); //ev.txt.visible = true
	    	// ev.txt.setStyle(style3b)
	    }
    } else {
    	IGconsole("reset to bottom: "+savedSPos.x+":"+savedSPos.y)
    	ev.reset(savedSPos.x,savedSPos.y)
	    if (titlestxt[ev.iloc]) {
	    	// ev.txt.setText(ev.txt.text.replace(/<br\/>/g,' ').replace(" ","\n"));
	    	titlestxt[ev.iloc].reset(savedSPos.x-ttxloc, savedSPos.y-ttylocb); //ev.txt.visible = true
	    	// ev.txt.setStyle(style3b)
	    }
    }
	if (!isAndroid & !isiOS) {ShideAllNames()}
	if (isReady()) {
		ret = showSuccess()
	}
}

var touchedEv
function DMMSaveStartD(ev) {
	if (ev != savedS) {
		savedS = ev
		savedSPos = {x:ev.xloc(),y:ev.yloc()}
	}
}
function getTextForTouch(idx) {
	var descr = EventVars[EventType][idx].description
	var brk = descr.indexOf('\\n')
	if (brk < 0) {brk = descr.length}
	var dtxt = descr.substring(0,brk)
	if ((EventType.indexOf("Cities")>-1) && EventVars[EventType][idx].actor) {
		dtxt = dtxt + "\npopulation " + EventVars[EventType][idx].actor + " people"
	}
	return dtxt
}
function spriteTouchedDIV(e) {
	instruct.setText(getTextForTouch(idxs[e]))
	var descr = EventVars[EventType][idxs[e]].description
	var brk = descr.indexOf('\n')
	if ((brk > 1) & (brk < descr.length)) {
		instruct2.setText(descr.substring(brk+1,descr.length))
		instruct2.visible = true
	} else {instruct2.visible = false}
	resetHalos(e)
}
function spriteTouched(e) {
	var ev = this
	resetHalos(ev.iloc)
	if (isAndroid || isFireFox) {ev=e;}//IGhideTexts(true)}
	DMMSaveStartD(ev)
  if (!ev.istarget) {
	var dtxt = getTextForTouch(ev.idx)
	instruct.setText(dtxt)
	var descr = EventVars[EventType][ev.idx].description
	var brk = descr.indexOf('\\n')
	if ((brk > 1) & (brk < descr.length)) {
		instruct2.setText(descr.substring(brk+2,descr.length))
		instruct2.visible = true
	} else {instruct2.visible = false}
	// if ((ev.tarloc) || (ev.tarloc==0)) {
	//     unhitTarget(ev, targs[ev.tarloc]);
	//     if (ev.txt) {ev.txt.visible = false}
 //    }
  }
}
function spriteMoving(e) {
	var ev = this
	// resetHalos(ev.iloc)
	if (isAndroid || isFireFox || isFireFox) {ev = e;halo.visible = false}
	IGstartTimer()
	if (EventType!="Nature") {instruct2.setText("")}
	if ((ev.tarloc) || (ev.tarloc==0)) {
	    unhitTarget(ev, targs[ev.tarloc]);
	    if (ev.txt) {ev.txt.visible = false}
    }
}
function enter_fullscreen() {
	game.stage.scale.startFullScreen();

}

function eventsReset() {
	// reset user variables
	// but not scores, which add up
	// DMMnumStrings = 0
	DMMscore = 0
	numChecks = 0
	IGnumSecs = 0
	IGtimerFlag = false
	IGstillTrying = false
}
var evDescriptions = []
var waiting
var notStarted = true

function loadGame() {
    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    var ff = Math.floor(15*IGxratio).toString()
	var twid = 230*IGxratio//(isAndroid || isiOS) ? 250 : 250
    // var f2 = Math.floor(13*IGxratio).toString()
   //  var targtsty = { font: "12px Arial", fill: "#ddffdd", align: "center", wordWrap: true,
			// wordWrapWidth: targsLoc.spacing };
   	var drags
    for (i=0; i<targs.length; i++) {
    	if (isAndroid || isFireFox) {
		    targs[i] = IGaddSprite((i+1)*WIDTH/(targs.length+1),targsLoc.y, 'target');
    	} else {
    		drags = {ddrop: targetHit, dstart: spriteTouched, dover: targetHighlight, nodrag: true}
		    targs[i] = IGaddSpriteDIV({xloc:(i+1)*WIDTH/(targs.length+1)-rx(3),yloc:targsLoc.y, 
		    	ifile: target,width:bubbleW,height:bubbleW,fcns:drags})
    	}
	    targs[i].date = null
	    targs[i].iloc = i
	    targs[i].istarget = true
	    targtexts[i] = IGaddText({xloc:(i+1)*WIDTH/(targs.length+1)-rx(4), yloc: targsLoc.y+ry(98), text: "[ ]", 
	    	size: ff, weight: 300, vtop: true, width: twid, height: 60 });
	    targs[i].dattext = targtexts[i]
	    // set the arrows between targets
	    if (i<targs.length-1) {
	    	var xloc = (i+1)*WIDTH/(targs.length+1)+(WIDTH/(targs.length+1))/2-rx(3)
	    	if (isAndroid || isFireFox) {
		    	var tmp = IGaddSprite(xloc,targsLoc.y,'arrow')
		    	tmp.scale.setTo(0.4*IGratio)
		    } else {
		    	IGaddSpriteDIV({xloc:xloc,yloc:targsLoc.y,ifile:APParrow,width:40,height:40,fcns:null})
		    }
	    }
    }

    for (i=0; i<events.length; i++) {
    	var adj = i - (numEvents/2 - 0.5)
    	if (isAndroid || isFireFox) {
		    events[i] = IGaddSprite(WIDTH/2+adj*arrowLoc.spacing,arrowLoc.y, ievents[i]);
		    events[i].scale.setTo(IGratio*0.7)
		    events[i].setHalo = function(onoff) {
		    	if (onoff) {halo.reset(this.x,this.y);halo.visible = true}
		    }
		    // events[i].anchor.setTo(0.5,0)	// align the top edges
		    events[i].inputEnabled = true
		    events[i].input.enableDrag(false, true)
		    events[i].events.onInputDown.add(spriteTouched, this);
		    events[i].events.onDragStart.add(spriteMoving, this);
		    events[i].events.onDragStop.add(spriteMoved, this);
    	} else {
		    drags = {denter: spriteMoving, dstart: spriteTouched,  dend: spriteMoved, 
		    	dover: targetHighlight, ddrop: arrowHit, touch: 'spriteTouchedDIV('+i+')',
		    	mouseover: 'SshowName('+i+')', mouseout: 'ShideName('+i+')'}
		    events[i] = IGaddSpriteDIV({xloc:WIDTH/2+adj*arrowLoc.spacing,yloc:arrowLoc.y, halo: true,
		    	ifile:ievents[i],width:bubbleW+4,height:bubbleW+4,fcns: drags});
    	}

	    events[i].date = EventVars[EventType][idxs[i]].date
	    events[i].idx = idxs[i]
	    events[i].iloc = i
	    evDates[i] = parseInt(EventVars[EventType][idxs[i]].date)
	    // if ((EventType.indexOf("Cities")>-1) || (EventType == "Dinosaurs")) {
	    // 	evt[i] = IGaddDivText({xloc:(i+1)*WIDTH/(events.length+1),yloc:3*HEIGHT/4,
	    // 		text:EventVars[EventType][idxs[i]].description,
	    // 		size: f2, weight: 400, vtop: true, width: 160, height: 40 })
	    	// var sc = 1.0
	    	// if (WIDTH<1024) {sc = WIDTH/1024}
	    	// evt[i].anchor.setTo(0.5)
	    	// evt[i].scale.setTo(sc,sc)
	    	// events[i].txt = evt[i]
	    // new scheme allows full width on tablets
	    var fsiz = ff//(isAndroid || isiOS) ? f2 : ff
	   //  var tsty = {font: ff+"px Arial", fill: "#000", align: "center", wordWrap: true,
				// wordWrapWidth: IGratio*twid }
	    if (EventType !="Other") {
	    	titlestxt[i] = IGaddDivText({xloc:WIDTH/2+adj*arrowLoc.spacing,yloc:3*HEIGHT/4,
	    		text: evTitles[i], size: fsiz, weight: 300, vtop: true, width: twid, height: 40 });
	    	// titlestxt[i] = IGaddText(WIDTH/2+adj*arrowLoc.spacing,3*HEIGHT/4,
	    	// 	evTitles[i], tsty);
	   		if (isAndroid || isFireFox) {
	    		events[i].events.onInputOver.add(SshowName,this)
	    		events[i].events.onInputOut.add(ShideName,this)
	    	}
    	}
   		IGhide(titlestxt[i],true)
    }

    evDates.sort(function(a,b){return a-b})
//	    IGconsole("sorted: "+evDates)
    // find the shortest span of 5 dates
    shortest = 100000000
    for (i=0; i<evDates.length-3; i++) {
    	var span = (evDates[i+4]-evDates[i])
    	if (span < shortest) {shortest = span}
    }
	var typ = TopUnits[EventType2] + "."

	IGstillTrying = true

	var dbsiz = "\n\n9 "+ObjTypes[EventType2]+" selected from "+EventNum+" in "+displayTopics[EventType2]+"."
//		waiting.visible = false
	instruct2.setText("The shortest span is " + shortest + typ+dbsiz)
	instruct2.visible = true

	if (preloadBar) {preloadBar.visible = false; preloadBar.destroy()}
	preloadBar = null
	notLoaded = false

	// CleanupList.push(bgchange)

	setScoresVisible(false)

	IGstopSpinner()

	IGanalytics(['Strings', 'Load', EventType]);
	// var endText = "vlaasdfgksda ads adsfdsf dsfds\nasdfoasdfaosdfods s asdfd\naashd aew eo anawe\n"
 //    IGendGame({msg: "",
 //        fcns: {again:'APPrestart',subject:'APPnewGame',diff:'IGchangeGame', leader: true},
 //        small: true,lower:true,nohead:true,wide:true})
}


var preloadBar
var updcnt = 0
var sequence = {

	preload: function() {
		// the DIV version of mouseover not working well enough
		isFireFox = true
		notLoaded = true

    if (EventNum<IGminEvents[IGgameApp]) {
        var rtn = (Object.keys(Topics).length<2) ? false : APPnewGame()
        IGstopSpinner()
        IGalertDIV("\n\nThere aren't enough events on this topic to play this game at this time."+
            "\n\nUse the menu upper right to select a different game "+
            "or to restart this game with a different topic.",
            "auto",rtn,true,true,true,16);
        return;
    }
		game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')
		IGwhite = true
		IGsetStage('#ffffff')
		DMMSetTopics()
		IGdefineScales()
		// parameter tells it to register user
		IGsetGlobalFunctions(true)

		eventsReset()
		CleanupList = []

		bubbleW = IGratio*100
		// no columns
		columnW = 0
		centerW = rx(550)

		topRow = ry(23)
		var tty = (isAndroid || isFireFox) ? HEIGHT/6+ry(20) : HEIGHT/6+ry(28)
		arrowLoc = {x: WIDTH/2, y: 3*HEIGHT/4+ry(76), spacing: rx(110)}
		targsLoc = {x: WIDTH/2, y: tty, spacing: rx(200)}

		var rightEdge = WIDTH/2 + centerW + columnW - rx(28)
		var leftEdge = WIDTH/2 - centerW - columnW + rx(28)
	    menuLoc = {x: rightEdge-30, y:topRow+ry(10)}
		helpLoc = {x: rightEdge-78, y: topRow-IGratio*14}
		filmLoc = {x: rightEdge-180, y: topRow-IGratio*14}
		timeLoc = {x: leftEdge+26, y:topRow}

		if (WIDTH<960) {credSc = WIDTH/960}

	    // game.load.audio('click', [CommonPath+'sounds/Effect_Click.mp3', CommonPath+'sounds/Effect_Click.ogg']);
	    // music = game.add.audio('click');

	    IGconsole("EventType: "+EventType)
	    IGaddDivText({xloc:game.world.centerX, yloc:topRow,text:Subjects[EventType2],
	    	width:500,size:18,color:'#6a6a6a',weight:'400',height:50})
		// var title = game.add.text(game.world.centerX, 18, Subjects[EventType2], hstyle2);
		// title.anchor.setTo(0.5,0.5)

	    // instructions
	    // need to elim cities sentence if not cities
	   	var it = (EventType.indexOf("Cities")>-1) ? instructTextC : instructText
	   	if (EventType == "Nature") {it = instructTextN}
	   	else if (EventType == "Composers") {it+= "\n\nDates are the year of birth of the composer."}
	   	var siz = Math.floor(IGratio*15)
	    if (isAndroid || isFireFox) {
		   	var siz2 = Math.ceil(IGratio*16)
	    	var tsty = {font: siz2+"px Arial", fill: "#000", align: "center", wordWrap: true,
				wordWrapWidth: rx(600) };
	    	var tsty2 = {font: 'bold '+(siz2+1)+"px Arial", fill: "#000", align: "center", wordWrap: true,
				wordWrapWidth: rx(600) };
	    	instruct = IGaddText(WIDTH/2, HEIGHT/2+(IGyratio*16), it, tsty);
	    	instruct2 = IGaddText(WIDTH/2, 3*HEIGHT/4 - 60, "Loading...", tsty2);
	    } else {
			instruct = IGaddDivText({xloc:WIDTH/2, yloc:HEIGHT/2-(IGyratio*20), text:it, 
				size:siz,weight:300,width:rx(600),hclass:true});
			// if (EventType == ("Science" || "Medieval")) {instruct.scale.setTo(IGyratio,IGyratio)}
			instruct2 = IGaddDivText({xloc:WIDTH/2, yloc:3*HEIGHT/4 - 60, text:"Loading...", 
				size:14, weight:900,color:000000});
	    }

		IGaddText({xloc:WIDTH/6, yloc:HEIGHT/2-10, text:"Total\nScore:", 
			size:14, weight:300,color:'#6a6a6a',width:60,hclass:true, height:50})
		// htot.anchor.setTo(1,0)
		textTotal = IGaddText({xloc:WIDTH/6+34, yloc:HEIGHT/2, text:DMMtotalScore.toString()+" ", 
			size:14, weight:400,color:'#000000',width:60,hclass:true, height:40})
		// textTotal.anchor.setTo(0.5,0)
		hscore = IGaddText({xloc:5*WIDTH/6, yloc:HEIGHT/2-20, text:"Score:", 
			size:14, weight:300,color:'#6a6a6a',width:60,hclass:true, height:40})

		// hscore.anchor.setTo(1,0)
		textScore = IGaddText({xloc:5*WIDTH/6+34, yloc:HEIGHT/2-20, text:"0", 
			size:14, weight:400,color:'#000000',width:60,hclass:true, height:40})
		// textScore.anchor.setTo(0.5,0)
		hbon = IGaddText({xloc:5*WIDTH/6-8, yloc:HEIGHT/2, text:"Bonuses:", 
			size:14, weight:300,color:'#6a6a6a',width:60,hclass:true, height:40})

		// hbon.anchor.setTo(1,0)
		textBonuses = IGaddText({xloc:5*WIDTH/6+34, yloc:HEIGHT/2, text:"0", 
			size:14, weight:400,color:'#000000',width:60,hclass:true, height:40})
		// textBonuses.anchor.setTo(0.5,0)
		hpen = IGaddText({xloc:5*WIDTH/6-8, yloc:HEIGHT/2+20, text:"Penalties:", 
			size:14, weight:300,color:'#6a6a6a',width:60,hclass:true, height:40})

		// hpen.anchor.setTo(1,0)
		textPenalties = IGaddText({xloc:5*WIDTH/6+34, yloc:HEIGHT/2+20, text:"0", 
			size:14, weight:400,color:'#000000',width:60,hclass:true, height:40})
		// textPenalties.anchor.setTo(0.5,0)
		IGaddDivText({xloc:timeLoc.x, yloc:topRow, text:"Time:", 
			size:16, weight:300,color:'#6a6a6a',width:100, height:40});
		// htime.anchor.setTo(1,0)
		IGtnumSecs = IGaddDivText({xloc:timeLoc.x+54, yloc:topRow, text:"0", 
			size:16, weight:400,color:'#000000',width:40, height:40});


	    //  Load all the target images -- same image for all spots
	    // game.load.image('target', AppPath+'pics/sym_brack_square-blue.png');

	    // load all the event images. Each image is unique.
	    var idxes = []
	    for (i=0; i<APPnumEvents; i++) {
	    	var r = Math.floor(Math.random()*(EventNum))
	    	while (isInArray(r,idxes)) {
	    		r = Math.floor(Math.random()*(EventNum))
	    	}
	    	idxes[i] = r
	    	var pos = EventVars[EventType][r].image.lastIndexOf('.')
	    	var iname = EventVars[EventType][r].image.substr(0,pos)
	    	var iname2 = iname.replace(/ /g,"_").replace(/,/g,"_")
	    	evDescriptions[i] = EventVars[EventType][r].description
	        if (EventType.indexOf("Cities")>=0) {
	        	evTitles[i] = EventVars[EventType][r].description
	        	evDescriptions[i] = EventVars[EventType][r].actor
	        } else if ((EventType=="Science") || (EventType=="Alaska") || (EventType=="GeoEras")) {
	        	var pos = EventVars[EventType][r].image.lastIndexOf('.')
	        	evTitles[i] = EventVars[EventType][r].image.substr(0,pos).replace('01','').replace(/_/g," ").trim()
			} else {evTitles[i] = EventVars[EventType][r].actor.trim()}

//	    	IGconsole("Descr: "+evDescriptions[i])
//	    	IGconsole("file: "+iname2)
			// do this just so no 'old' image gets loaded on a rerun
			if (isAndroid || isFireFox) {
				// IGconsole("image path: "+ImgPath+IGimgPath+'/'+iname2+'.png')
		    	game.load.image(ievents[i], ImgPath+IGimgPath+'/'+iname2+'.png');
			} else {
				ievents[i] = ImgPath+IGimgPath+'/'+iname2+'.png';

			}
		    idxs[i] = r
	    	game.load.image(iimgs[i], ImgPath+'large/'+iname2+'.png')
	    	iimgstxt[i] = 'Image Credit: '+EventVars[EventType][r].URL
	    }
		game.load.image('halo', AppPath+'pics/haloCircle.png');
		game.load.image('target', CommonPath+'pics/targetCircle.png');
		target = CommonPath+'pics/targetCircle.png';
		APParrow = AppPath+'pics/arrow_30_un.png';
		game.load.image('arrow', AppPath+'pics/arrow_30_un.png');
//	    IGconsole("finished preload")

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
		if (EventType=="GeoEras") {BCEBONUS=0}
		if (isAndroid || isFireFox) {
			halo = IGaddSprite(-200,-200,'halo')
			halo.scale.setTo(IGratio*0.77)
			halo.setscale = IGratio*0.77
			halo.visible = false
		}

	    helpTextLocal = helpText[0]
	    for (var i=1; i<8; i++) {helpTextLocal = helpTextLocal + "\n\n"+helpText[i]}

		window.setTimeout(loadGame,300)
	},

	update : function() {

		// doesn't work, because does not return to update until after loadGame completes
		// even if I put the call to loadGame here
//    	instruct2.angle += 1;

    },
    shutdown: function() {
		while (CleanupList.length>0) {
			try {
				CleanupList.pop().destroy()
			} catch (e) {
				CleanupList.pop()
			} 
		}
		IGcleanupTexts()

    }

}

