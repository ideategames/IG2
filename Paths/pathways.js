////////////////////////////////////////////////////////////
//
// paths.js
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
var ploc = window.location.pathname;
AppPath = ploc.substring(0, ploc.lastIndexOf('/')+1);

IGdragging = false
var evLoc, boardLoc, APPyourScore, APPcompScore, graphics
var PnumEvents = 9
var numShelved = 0
var PoolCategories = {}
var CategoryMsg = ""
var DMMnumPlayers = 1
// lowercase to allow computer to reason about them
var CompPoolCategories = {}
var poolEvs = []
var targs = []
var targsdiv = []
var isReady = false
var nodes = []
var dnodes = []
var nodeOrder = []
var newEventDat = {order: 5, eventPic: 'event99', idx: 99}
var netLoc
var key1, key2, key3, key4, pt, cs, moveMask, catBtn
var gameWidth = 3000
var evWidth = 100
var netSpacing = 110
var boardMask

var numSects = Math.floor(gameWidth/netSpacing) - 1
var board

var PlayerCats = {1:{},2:{}}
var bonuses = {1:0,2:0}
var numCategories = {1:0,2:0}
var numMistakes = {1:0,2:0}
var divLines = []
var topAnch = []
var botAnch = []

var graphics
var lines = []
var dates = []

var DMMturn = Math.floor(Math.random()*(2))+1
// text to show whose turn
var whoseTurn = {}

var txtShowing = {}

var Ploader
var playerPasses = {1: false, 2: false}

var PnumTurns = 0
var PmaxTurns = 10 // each
var PallDone = false
var catpts = 5
var ecredit = 3
var strbonus = 10

var noinstruct

var resumeBtn, resumeMsg
var numleft = 50

function DMMmenu() {
    IGendGame({msg:'You are in the middle of a game. Selecting any button but the first will abort this game.',
        fcns:{again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame',resume:'IGresume'},small:true,nohead:true})
}
function APPnewGame() {
	loadURLExt({'url': '/launch/pindex.html?alias='+DMMalias+'&level='+DMMlevel+'&clevel='+DMMcompLevel})
}
function APPrestart() {
	IGconsole("restarting...")
    if ((EventVars[EventType])) {
        IGstartSpinner()
        window.open(AppPath+'pentry.html?alias='+DMMalias+'&topic='+EventType+
        	'&level='+DMMlevel+'&clevel='+DMMcompLevel,'_self')
        // game.state.start('paths',true,true)
    } else {APPnewGame()}
}
var goTxt,userDataMsg
function APPendGame() {
	// APPrestart()
	IGendGame({msg:goTxt,
    	    fcns:{again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame'},
    	    small:false,nohead:true})
	IGsendScore(userDataMsg)
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
    var hgt = (par.height) ? par.height : 50000
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
    retin1.innerHTML = "<h4>Settings for Paths</h4><p>&nbsp;</p><p style='font-weight:900;'>Difficulty Level:</p>"+
    	'<input id="option1" type="radio" name="level" value="1"'+check[1]+'/>'+
    	'<label for="option1">&nbsp;Level 1&nbsp;&nbsp;</label>'+
    	'<input id="option2" type="radio" name="level" value="2"'+check[2]+'/>'+
    	'<label for="option2">&nbsp;Level 2</label>'+
    	'<br/>(Level 2 hides the category from each image)'
    ret.appendChild(retin1);

    var retin2 = document.createElement("div");
    retin2.setAttribute("class", "IGtemp IGsettings");
    tmp = "font-size:14px;line-height:100%;color:#333;font-weight:100;";
    retin2.setAttribute("style",tmp);
    var ccheck = ['','','','','','']
    ccheck[DMMcompLevel] = ' checked'
    retin2.innerHTML = "<p>&nbsp;</p><p style='font-weight:900;'>Computer Skill Level:</p>"+
    	'<input id="coption1" type="radio" name="clevel" value="1" '+ccheck[1]+'/>'+
    	'<label for="coption1">&nbsp;Level 1&nbsp;&nbsp;</label>'+
    	'<input id="coption2" type="radio" name="clevel" value="2" '+ccheck[2]+'/>'+
    	'<label for="coption2">&nbsp;Level 2&nbsp;&nbsp;</label>'+
    	'<!--input id="coption3" type="radio" name="clevel" value="3" '+ccheck[3]+'/>'+
    	'<label for="coption3">Level 3</label><br/>'+
    	'<input id="coption4" type="radio" name="clevel" value="4" '+ccheck[4]+'/>'+
    	'<label for="coption4">Level 4</label-->'+
    	'<input id="coption5" type="radio" name="clevel" value="5" '+ccheck[5]+'/>'+
    	'<label for="coption5">&nbsp;Level 3</label>'+
    	'<p>&nbsp;</p>'+
    	'<input class="squaredThree" id="option6" type="checkbox" name="restart" value="1"/>'+
    	'<label for="option6">Restart</label><br/>(not required)'
    ret.appendChild(retin2);

    document.getElementById("game").appendChild(ret);

    return ret
}
var settingsBtn
var settingsOn
function PadjustMaxTurns() {
	// if (PmaxTurns>EventNum/2) {PmaxTurns = EventNum/2}
	// stop game when events run out, not turns if too few events
	// no longer used
	if (numleft>EventNum) {numleft = EventNum}
}
function PgetSettings() {
	var wid = 300
	var hgt = 340
	if (settingsOn) {
		DMMlevel = parseInt($('input[name="level"]:checked').val());
		DMMcompLevel = parseInt($('input[name="clevel"]:checked').val());
		if ($('input[name="restart"]:checked').val()) {APPrestart()}
		APPdismissSettings()
		settingsOn = false
	} else {
	    IGanalytics(['Paths', 'Settings', EventType]);
		APPsettings({xloc:wid/2+20,yloc:hgt/2+50,width:wid,height:hgt})
		settingsOn = true
	}
	PcategoryDisplay()
}
function PcategoryDisplay() {
	// turns category display on/off for difficulty level
		for (var e=0;e<PnumEvents;e++) {
		    var catt = (DMMlevel == 1) ? poolEvs[e].category.replace(" ","\n")+"\n" : ""
			poolEvs[e].txt.setText(catt+poolEvs[e].title)
		}
}
function DMMchangeTurn() {
	if (!PallDone) {
		PnumTurns ++; // increment on each, then check for 2x turns
		if ((PnumTurns==2*PmaxTurns) || (numLeft<1)) {
			// must stop turns
			PallDone = true
			{game.time.events.add(1000,PcheckScores({}, false, true))}
			return
		}
		var p1 = (DMMnumPlayers == 1) ? "Your turn" + " ("+(Math.floor(PnumTurns/2)+1)+")" : "Player 1's turn" + " ("+(Math.floor(PnumTurns/2)+1)+")"
		var p2 = (DMMnumPlayers == 1) ? "Computer's turn " + " ("+(Math.floor(PnumTurns/2)+1)+")" : "Player 2's turn" + " ("+(Math.floor(PnumTurns/2)+1)+")"
		if (PnumTurns<1) {p1 += "\n(move an order-appropriate "+objectTypes[EventType2]+" onto any plus sign)"}

		DMMturn = (DMMturn == 1) ? 2 : 1
	    var turn = (DMMturn == 1) ? p1 : p2
	   	moveMask.visible = ((DMMturn == 1) || (DMMnumPlayers > 1)) ? false : true

	    whoseTurn.setText(turn)
	}
}
function PhideOverlay(ev) {
	if (ev.overlay) {ev.overlay.visible = false}
}
function PpassTurn() {
	playerPasses[DMMturn] = true
	if (playerPasses[1] & playerPasses[2]) {PcheckScores({},false,true)}
	else (DMMchangeTurn())
	moveMask.bringToTop()
	PcheckTurn()
	// window.setTimeout(PhideOverlay(ev), 500)
}
var ExtraCredits = {1:0,2:0}
function PaddCredit(turn, bon) {
	// IGconsole("bonus for "+turn)
	ExtraCredits[turn] += bon
}
function PcalcCategories() {
	var yourTops = []
	var compTops = []
	var neitherTops = []
	for (var topic in PlayerCats[1]) {
		if (!PlayerCats[2][topic]) {yourTops.push(topic)}
		else if (PlayerCats[1][topic] > PlayerCats[2][topic]) {yourTops.push(topic)}
		else if (PlayerCats[1][topic] == PlayerCats[2][topic]) {neitherTops.push(topic)}
	}
	for (var topic in PlayerCats[2]) {
		if (!PlayerCats[1][topic]) {compTops.push(topic)}
		else if (PlayerCats[2][topic] > PlayerCats[1][topic]) {compTops.push(topic)}
	}
	return {1:yourTops,2:compTops,3:neitherTops}
}
function PcheckScores(ev,hide, gameOver) {
	if (PallDone) {gameOver = true}
	// window.setTimeout(PhideOverlay(ev), 500)
	// hide is to get the topics without showing the score
	var yours = 0
	var comps = 0
	// must reset so doesn't duplicate additions
	bonuses = {1:0,2:0}
	// calculate topics owned
	var catowners = PcalcCategories()
	yours = catpts*catowners[1].length
	comps = catpts*catowners[2].length
	var links = []
	links[1] = 0
	links[2] = 0

	// now calculate strings, need to walk the entire network by connections
	for (var n=0;n<nodes.length-1;n++) {
		// IGconsole("owners: "+n+":"+nodes[n].owner)
		for (var c=0;c<nodes[n].cx.length;c++) {
			// must be certain to only count in the forward direction
			if ((nodes[n].owner == nodes[nodes[n].cx[c]].owner) & 
				(nodes[n].category == nodes[nodes[n].cx[c]].category))// & 
				// (nodeOrder[nodes[n].cx[c]]>nodeOrder[n])) 
			{bonuses[nodes[n].owner]+=strbonus;links[nodes[n].owner]++}
				//IGconsole("nodes: "+nodeOrder[n]+":"+nodeOrder[nodes[n].cx[c]])}
		}
	}
	// if (nodes[n]) {IGconsole("owners: "+n+":"+nodes[n].owner)}
	yours = yours + bonuses[1] + ExtraCredits[1]
	comps = comps + bonuses[2] + ExtraCredits[2]
	var p1 = (DMMnumPlayers == 1) ? "You: " : "Player 1: "
	var p2 = (DMMnumPlayers == 1) ? "Computer: " : "Player 2: "

	goTxt = (gameOver) ? "<h3>Game Over</h3>\n\n" : ""
	var winner = (yours>comps) ? p1.replace(':','!')+"\n\n" : p2.replace(':','!')+"\n\n"
	if (yours==comps) {winner="it's a tie.\n\n"}
	if ((hide != "noshow") && (!gameOver)) {
		IGalertDIV(goTxt+"Scores:\n\n"+p1+yours+"\n\n"+p2+comps,true)
	}
	if (gameOver) {
		var mplur = (numMistakes[1]==1) ? "" : "s"
		var cplur = (catowners[1].length==1) ? "y" : "ies"
		var lplur = (bonuses[1]==strbonus) ? "" : "s"
		var eplur = (ExtraCredits[1]==ecredit) ? "" : "s"
		var cat = (catowners[1].length==0) ? "no" : catowners[1].length
		var bons = (bonuses[1]/strbonus==0) ? "no" : bonuses[1]/strbonus
		var creds = (ExtraCredits[1]/ecredit==0) ? "no" : ExtraCredits[1]/ecredit
		var miss = (numMistakes[1]==0) ? "no" : numMistakes[1]
		goTxt += "The winner is..."+winner + "Scores:\n\n"+p1+yours+",\t"+p2+comps+
			"\nYou owned "+cat+" categor"+cplur+"."+
			"\nYou made "+bons+" link"+lplur+" between same-category nodes."+
			"\nYou made "+creds+" insertion"+eplur+" between nodes."+
			"\nYou made "+miss+" mistake"+mplur+"."
		userDataMsg = yours+":"+IGnumSecs+":"+p2+":"+comps+":"+bons+":"+creds+":"+miss+" (Level "+DMMlevel+")"
	    IGanalytics(['Paths', 'Finish', EventType]);

	    game.time.events.add(100,APPendGame,this)
	}
	return {1: yours, 2: comps, ylinked:links[1], clinked:links[2]}
}
function PpaintScores() {
	var scores = PcheckScores("","noshow")
	var cats = PcalcCategories()
	var p1 = (DMMnumPlayers == 1) ? "You: " : "Player 1: "
	var p2 = (DMMnumPlayers == 1) ? "Computer: " : "Player 2: "
	APPyourScore.setText(p1+"Score: "+scores[1]+
		"\\nLinked nodes: "+scores.ylinked+
		"\\nCategories owned: "+cats[1].length)
	APPcompScore.setText(p2+"Score: "+scores[2]+
		"\\nLinked nodes: "+scores.clinked+
		"\\nCategories owned: "+cats[2].length)
	IGhide(APPyourScore,false)
	IGhide(APPcompScore,false)

}
function PshowOff() {
	txtShowing.visible = false
}

function PshowBrief(e) {
	e.txt.visible = true
	txtShowing = e.txt
	window.setTimeout(PshowOff,1000)
}

function DMMcleanUpNodes(cnodes) {
	for (var c=0;c<cnodes.length; c++) {
		// cnodes[c].shown.txt.visible = false
		// try {cnodes[c].shown.txt.destroy()} catch(e) {IGconsole("cannot destroy txt "+c)}
		// cnodes[c].shown.txt = null
		cnodes[c].shown.visible = false
		try {cnodes[c].shown.destroy()} catch(e) {}
		cnodes[c].shown = null
		cnodes[c] = null
	}
	graphics.destroy(true)
	// for (var l in lines) {lines[l].destroy()}
	// lines = []
}
function DMMcleanUpSimple(snods) {
	for (var s=0; s<snods.length; s++) {
		snods[s].visible = false
		snods[s].destroy()
		snods[s] = null
	}
}
// variables to determine spacing and sizes
//
var NSIZE = 120
var NLOC = 120
var tscale = 0.8
var nscale = 0.8
// for 10 turns, make them big
function PsetNodeScales() {
	netSpacing = rx(110)
	NSIZE = IGratio*120
	NLOC = IGratio*128
	tscale = IGratio*0.5
	nscale = IGratio*0.6
}
function PpaintNet(pnodes) {
	// var ff = Math.floor(IGratio*14)
	// var tsty = { font: ff+"px Arial", fill: "#ffffff", align: "center", wordWrap: true,
	// 		wordWrapWidth: NSIZE };
	DMMcleanUpSimple(targs)
	targs = []

	if (nodeOrder.length>9) {IGhide(boardMask,true)}
	for (var n=0; n<nodeOrder.length; n++) {
		var nloc = {x: boardLoc.x+netSpacing/2 + n*netSpacing, 
			y: netLoc.y-(ry(NLOC/2)*(pnodes[nodeOrder[n]].tier))}
		// put the insert marker upper left
		// var yloc = (n>0) ? nloc.y : nloc.y
		var tier = (n>0) ? pnodes[nodeOrder[n]].tier + 1 : 0
		// var targvalid = ((yloc>ry(50)) & (nloc.x<(gameWidth-100)))
		var targvalid = n<nodeOrder.length
		if (targvalid) {
			// targs[n] = IGaddSprite(nloc.x, yloc,'target')
	 		// targsdiv[n] = APPcreateTarget({xloc:boardLoc.x+(n*netSpacing),yloc:boardLoc.y+ry(30),width:50,height:50})
		   	targs[n] = IGaddSprite(boardLoc.x+(n*netSpacing),boardLoc.y+boardLoc.hgt,'target')
			targs[n].tier = tier
		}
		if (pnodes[nodeOrder[n]].owner == 1) {
			nodes[nodeOrder[n]].reset(nloc.x, nloc.y)
			nodes[nodeOrder[n]].scale.setTo(nscale*0.85)
			nodes[nodeOrder[n]].txt.setText(nodes[nodeOrder[n]].category)
			nodes[nodeOrder[n]].txt.reset(nloc.x,nloc.y-ry(60))
			pnodes[nodeOrder[n]].shown = IGaddSprite(nloc.x, nloc.y, 'node1')
			pnodes[nodeOrder[n]].shown.scale.setTo(nscale)
			pnodes[nodeOrder[n]].shown.descr = nodes[nodeOrder[n]].description
			pnodes[nodeOrder[n]].shown.inputEnabled = true
			pnodes[nodeOrder[n]].shown.events.onInputDown.add(PshowInfo, pnodes[nodeOrder[n]])

		} else {
			nodes[nodeOrder[n]].reset(nloc.x, nloc.y)
			nodes[nodeOrder[n]].scale.setTo(nscale*0.85)
			nodes[nodeOrder[n]].txt.setText(nodes[nodeOrder[n]].category)
			nodes[nodeOrder[n]].txt.reset(nloc.x,nloc.y-ry(60))
			pnodes[nodeOrder[n]].shown = IGaddSprite(nloc.x, nloc.y, 'node2')
			pnodes[nodeOrder[n]].shown.scale.setTo(nscale)
			pnodes[nodeOrder[n]].shown.descr = nodes[nodeOrder[n]].description
			pnodes[nodeOrder[n]].shown.inputEnabled = true
			pnodes[nodeOrder[n]].shown.events.onInputDown.add(PshowInfo, pnodes[nodeOrder[n]])
		}
		dates[n].setText(pnodes[nodeOrder[n]].date+" ")
		// pnodes[nodeOrder[n]].shown.txt = IGaddText(nloc.x,nloc.y, pnodes[nodeOrder[n]].descr,tsty)
		// pnodes[nodeOrder[n]].shown.txt = IGaddDivText({xloc:nloc.x, yloc:nloc.y, text:pnodes[nodeOrder[n]].descr,
		// 	color:'#ffffff', size: Math.floor(IGratio*14), width: NSIZE, height: NSIZE})
		// if ((EventType != "Science") & (nodeOrder[n]<nodes.length-1)) {pnodes[nodeOrder[n]].shown.txt.visible = false}
		nodes[nodeOrder[n]].bringToTop()
	}
	// put a final insert marker upper right of the end
	if (targvalid) {
 		// targsdiv[n] = APPcreateTarget({xloc:boardLoc.x+(n*netSpacing),yloc:boardLoc.y+ry(30),width:50,height:50})
    	targs[n] = IGaddSprite(boardLoc.x+(n*netSpacing),boardLoc.y+boardLoc.hgt,'target')
		targs[n].tier = 0
	}

	graphics = game.add.graphics(0,0)
	graphics.lineStyle(5,0x777777, 1)

	var off = NSIZE/3
	// var arcs = []
	// now add connections
	for (var n=0; n<nodes.length; n++) {
		if (nodes[n].cx.length>0){
			for (var c=0;c<nodes[n].cx.length;c++) {
				graphics.moveTo(pnodes[n].shown.x+off,pnodes[n].shown.y)
				if (nodes[n].tier < nodes[nodes[n].cx[c]].tier) {
					var lnum = 1
					for (var ns=0;ns<20;ns++) {
						if ((boardLoc.x+netSpacing*ns) > (pnodes[n].shown.x+off)) {
							lnum = ns;
							break;
						}
					}
					graphics.lineTo(boardLoc.x+netSpacing*lnum-5,
						pnodes[n].shown.y)
					graphics.arc(boardLoc.x+netSpacing*lnum-5,pnodes[n].shown.y-5,5,1.57,0,true)
					graphics.lineTo(boardLoc.x+netSpacing*lnum,
						pnodes[nodes[n].cx[c]].shown.y+4)
					graphics.arc(boardLoc.x+netSpacing*lnum+5,pnodes[nodes[n].cx[c]].shown.y+5,5,3.14,4.8,false)
					graphics.lineTo(pnodes[nodes[n].cx[c]].shown.x-off,
						pnodes[nodes[n].cx[c]].shown.y)
				} else {
					lines[n+":"+nodes[n].cx[c]] = graphics.lineTo(pnodes[nodes[n].cx[c]].shown.x-off,
						pnodes[nodes[n].cx[c]].shown.y)
				}
				// lines[n+":"+nodes[n].cx[c]].z=15
			}
		}
	}
}
function PtimerDone() {
	IGtimerFlag = true
	IGnumSecs++;
	IGtnumSecs.setText(IGnumSecs)
    if (IGstillTrying) {window.setTimeout(PStimerDone,1000)}
}
function PunhitTarget(arrow,target) {
	target.date = null
    target.dattext.setText("[ ]")
}

function PresetEvents() {
	roomevents = []
	daterooms = {}
	sortdates = []
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
	rooms = []
	roomimgs = []
	IGnumsecs = 0
	bonuses = {1:0,2:0}
	numCategories = {1:0,2:0}
	numMistakes = {1:0,2:0}
}

function PconnectSource(t, nodid, cxnodes) {
	// t holds the place in nodeOrder
	// nodid holds the ID of the node to connect
	if (t>0) {
		for (var n=(t-1); n>-1; n--) {
			if (cxnodes[nodeOrder[n]].tier <= cxnodes[nodid].tier) {
				// IGconsole("connecting: "+nodeOrder[n]+":"+nodid)
				cxnodes[nodeOrder[n]].cx.push(nodid)
				break
			}
		}
	} else if (cxnodes.length>1) {cxnodes[nodeOrder[0]].cx.push(nodeOrder[1])}
	else {
		// key1.visible = true; key2.visible = true; key3.visible = true; key4.visible = true;
		IGhide(pt,false);
	}
}
function PhitTarget(arrow,target) {
	// notes on data structures
	//`   - dnodes is for display only, and is re-creatd every time for a new network
	//	  - targs is the set of targets, and is re-created after each set of new nodes is displayed
	//	  - nodes is the permanent record of all placed nodes, and is only ever added, never
	//		deleted
    try {IGclick.play();} catch (e) {}
    arrow.anchor.setTo(0.5,0.5)
	arrow.x = target.x
	arrow.y = target.y
	target.date = arrow.date
	target.idx = arrow.idx
   	var fin = (EventVars[EventType][target.idx].category.indexOf(',')>0) ? EventVars[EventType][target.idx].category.indexOf(',') : EventVars[EventType][target.idx].category.length
	var txt = EventVars[EventType][target.idx].category.substring(0,fin)
	// if ((EventType == "Cities") || (EventType == "Dinosaurs")) {txt = EventVars[EventType][target.idx].category}
	target.descr = txt// + "\n"+EventVars[EventType][target.idx].date
	target.owner = DMMturn
	arrow.visible = false
	target.visible = false

	// targs and nodes will always be in chron order
	for (var t=0; t<targs.length; t++) {
		if (targs[t].owner) {
			// target is always one place farther ahead than the nodes
			// insert into the permanent set of nodes
			// nodeOrder keeps the chron order
			// nodes are ordered by creation
			var nodid = nodes.length
			var cat = txt.replace(" ","\n");//.substring(0,12).trim().toLowerCase()
			nodeOrder.splice(t,0,nodid)
			nodes[nodid] = arrow
			nodes[nodid].date = arrow.date
			nodes[nodid].owner = targs[t].owner
			nodes[nodid].descr = targs[t].descr
			nodes[nodid].description = EventVars[EventType][target.idx].description
			nodes[nodid].tier = (targs[t].tier) ? targs[t].tier : 0
			nodes[nodid].category = cat
			nodes[nodid].cx = []
			// this has to be unique, because of the splice above!!
			PconnectSource(t, nodid, nodes)
			// extra credit for inserting node
			if ((t>0) && (t<targs.length-1)) {PaddCredit(DMMturn,ecredit)}
		}
	}
	// first, clean up all old nodes
	DMMcleanUpNodes(dnodes)
	dnodes = []

	// now, add this node to the permanent set of nodes
	for (var n=0; n<nodes.length; n++) {
		dnodes[n] = nodes[n]
		dnodes[n].owner = nodes[n].owner
		dnodes[n].descr = nodes[n].descr
		dnodes[n].date = nodes[n].date
		dnodes[n].tier = nodes[n].tier
	}
	// now, copy all the permanent nodes into nodes
	PpaintNet(dnodes)

}
function DMMcreditCategory(player,category) {
	var cat = category.trim().toLowerCase()
	if (!PlayerCats[player][cat]) {PlayerCats[player][cat]=0}
	PlayerCats[player][cat] ++
}
function PorderCorrect(arrow, target, order) {
	// order had the next node up
	var ret = true
	if (nodes[nodeOrder[order]]) {if (arrow.date > nodes[nodeOrder[order]].date) {ret = false; IGconsole("failed on next")}}
	if (nodes[nodeOrder[order-1]]) {if (arrow.date < nodes[nodeOrder[order-1]].date) {ret = false; IGconsole("failed on prev")}}
	return ret
}
function Ploaded() {
	PsetupEvent(newEventDat.order, newEventDat.eventPic, newEventDat.idx, PnumEvents)
	// need to be sure the mask is on top of the new event
	moveMask.bringToTop()
	PcheckTurn()
}
function PpreloadImage(iname,iURL){
	Ploader.image(iname,iURL)
	Ploader.onLoadComplete.addOnce(Ploaded)
	Ploader.start()
}
function PreplaceEvent(order) {
	var r = Math.floor(Math.random()*(EventNum))
	while (IGisInArray(r,pidxs)) {
		r = Math.floor(Math.random()*(EventNum))
	}
	pidxs.push(r)
	newEventDat.order = order
	newEventDat.idx = r
	newEventDat.eventPic = 'event'+r

   	var pos = EventVars[EventType][r].image.lastIndexOf('.')
	var iname = EventVars[EventType][r].image.substr(0,pos)
	var iname2 = iname.replace(/ /g,"_").replace(/,/g,"_")

	PpreloadImage(newEventDat.eventPic,ImgPath+IGimgPath+'/'+iname2+'.png')
}
function PreturnToStart(ev) {
	ev.x = ev.loc.x;
	ev.y = ev.loc.y;
}

function PspriteTouched() {
	IGdragging = true
	if (!noinstruct) {
		// for (var l=4;l<6;l++) {
	 //    	graphics2.moveTo(boardLoc.x+netSpacing*l,boardLoc.y)
	 //    	divLines[l] = graphics2.lineTo(boardLoc.x+netSpacing*l,boardLoc.y+boardLoc.hgt)
		// }
		IGhide(instruct,true)
		noinstruct = true
	}
}

function PspriteMoving() {
	// penaltyMsg.setText("")
}
function PfinishCMove(ev) {
	PspriteMoved(ev)
}
function PmakeComputerMove(nmove) {
	IGconsole("move: "+nmove[0]+":"+nmove[1])

	var bounce=game.add.tween(poolEvs[nmove[0]]);

    bounce.to({ x:targs[nmove[1]].x, y:targs[nmove[1]].y }, 1500, Phaser.Easing.Exponential.In);
    bounce.onComplete.add(PfinishCMove, this);
    bounce.start();

}
function PcomputerTurn() {
	var possMoves = []
	for (var pm=0;pm<PnumEvents;pm++) {possMoves[pm] = []}
	// block user turn
	// walk the net then walk the event pool to mark which ones can be played where
	// do the first and last targets separately, they are simplest
	if (nodeOrder.length == 0) {
		possMoves = [[0],[0],[0],[0],[0],[0],[0],[0],[0]]
	} else {
		for (var e=0;e<PnumEvents;e++) {
			if (poolEvs[e].date) {
				if (nodes[nodeOrder[0]].date > poolEvs[e].date) {possMoves[e].push(0)}
			}
		}
		// now walk the middle part of the net
		for (var t=1;t<targs.length-1;t++) {
			for (var e=0;e<PnumEvents;e++) {
				if (poolEvs[e].date) {
					// for this target, which events are possible?
					if ((nodes[nodeOrder[t-1]].date < poolEvs[e].date) & (nodes[nodeOrder[t]].date > poolEvs[e].date)) {possMoves[e].push(t)}
				}
			}
		}
		// now the last node
		for (var e=0;e<PnumEvents;e++) {
			if (poolEvs[e].date) {
				if (nodes[nodeOrder[targs.length-2]].date < poolEvs[e].date) {possMoves[e].push(targs.length-1)}
			}
		}
	}
	IGconsole("possible moves: "+possMoves)
	//
	// To help with the strategy, get the topics of all the moves
	//
	var possTopics = {}
	for (var i=0;i<PnumEvents;i++) {
		if (possMoves[i]) {
			if (possTopics[poolEvs[i].category]) {possTopics[poolEvs[i].category].push(i)} 
			else {possTopics[poolEvs[i].category] = [i]}
		}
	}
	for (var top in possTopics) {IGconsole("possible topic: "+top)}
	// now, the logic of selecting the best move
	// Strategy is:
	//	1: Extend a string that is same topic
	//	2: Extend a topic that is equal
	//	3: Block a topic that is behind
	// But, randomly decide between strategy 1 and 3?
	// FIRST, need to get all topic lists

	// return from this will be {1: playerTopics, 2: compTopics, 3: neitherTopics}
	var mytopics = PcalcCategories()
	IGconsole("net topics: "+mytopics[1]+":"+mytopics[2]+":"+mytopics[3])
	var strat2Moves = []
	var strat3Moves = []
	var strat4Moves = []
	var strat5Moves = []
	// Priority will be to 1: take over neither; 2: block player; 3: extend comp
	// ignore for now, just pick one option at random
	var valid = false
	var nmove
	if (DMMcompLevel== 1) {
		var checkRand = Math.floor(Math.random()*(PnumEvents+(PnumEvents/2)))
		if (checkRand>(PnumEvents-1)) {
			var mfrom = Math.floor(Math.random()*(PnumEvents))
			while (!poolEvs[mfrom].date) {mfrom = Math.floor(Math.random()*(PnumEvents))}
			var mto = Math.floor(Math.random()*(targs.length))
			nmove = [mfrom,mto]
		} else {valid = true}
	}
	if ((DMMcompLevel>1) || valid) {
		// pick a starting place less than the total number
		var loc = Math.floor(Math.random()*(PnumEvents-2))
		var thit = false
		for (var e=loc;e<PnumEvents;e++) {
			if (possMoves[e].length>0) {
				thit=true
				nmove = [e,possMoves[e][0]]
				if (CompPoolCategories[poolEvs[e].category]==1) {IGconsole("found strat5");strat5Moves.push([e,possMoves[e][0]])}
			}
			if (thit) {break}
		}
		if (!thit) {
			for (var e=loc-1;e>-1;e--) {
				if (possMoves[e].length>0) {thit=true; nmove = [e,possMoves[e][0]]}
				if (thit) {break}
			}
		}
	}
	if (DMMcompLevel>2) {
		// for each neitherTopics, see if there is a possible move
		for (var t=0;t<mytopics[3].length;t++) {if (possTopics[mytopics[3][t]]) {
			strat2Moves.push([possTopics[mytopics[3][t]][0],possMoves[possTopics[mytopics[3][t]][0]][0]])}
		}
		// IGconsole("Strat2moves: "+strat2Moves[0])
	}
	if (DMMcompLevel>3) {
		for (var t=0;t<mytopics[2].length;t++) {if (possTopics[mytopics[2][t]]) {
			strat3Moves.push([possTopics[mytopics[2][t]][0],possMoves[possTopics[mytopics[2][t]][0]][0]])}
		}
		// IGconsole("Strat3moves: "+strat3Moves[0])
	}
	if (DMMcompLevel>4) {
		for (var t=0;t<mytopics[1].length;t++) {if (possTopics[mytopics[1][t]]) {
			strat4Moves.push([possTopics[mytopics[1][t]][0],possMoves[possTopics[mytopics[1][t]][0]][0]])}
		}
		// IGconsole("Strat4moves: "+strat4Moves[0])
	}
	if (strat2Moves[0]) {nmove = strat2Moves[0];IGconsole("Strat 2")}
	if (strat3Moves[0]) {nmove = strat3Moves[0];IGconsole("Strat 3")}
	if (strat4Moves[0]) {nmove = strat4Moves[0];IGconsole("Strat 4")}
	if (DMMcompLevel>4) {if (strat5Moves[0]) {nmove = strat5Moves[0];IGconsole("Strat 5")}
		// do singletons first

	}
	// if no move, then pass
	if (nmove) {PmakeComputerMove(nmove)} else {PpassTurn({}); IGconsole("No move.")}
	return true
}
function PspriteMoved(ev) {
	IGdragging = false
	var thit = false
	for (i=0; i<targs.length; i++) {
		if (IGcheckOverlap(ev, targs[i])) {
			playerPasses[DMMturn] = false
			if  (PorderCorrect(ev,targs[i],i)) {
				numLeft--
				var order = ev.order
				thit = true
				ttarg = targs[i]
				tarr = ev
			    // targs[i].dattext.setText("[+]")
			    PhitTarget(ev, targs[i]);
				// give credit for this category
				DMMcreditCategory(DMMturn,ev.category)

				// need to destroy the large image first... for later
				// finally, delete the old display object
			 //    if (ev.txt) {ev.txt.destroy(); ev.txt = null}
			    if (ev.info) {ev.info.destroy(); ev.info = null}
				ev.inputEnabled = false
				DMMchangeTurn()
				if (numLeft > 8) {PreplaceEvent(order)} else {poolEvs[order]={date:false};PcheckTurn()}
			} else {
				var errmsg = (DMMturn==2) ? "Computer made a mistake. Your turn." : 
					"The "+objectTypes[EventType2]+" is out of order. Your turn is over."
				numMistakes[DMMturn]++
				if (ev.txt) {ev.txt.visible = true}
				PreturnToStart(ev)
				DMMchangeTurn()
				IGconsole("player error")
				// have to put this here because no replace event
				// PcheckTurn()
				IGalertDIV(errmsg,true,PcheckTurn,true)
				thit = true
			}
		}
		// have to delay the scores to take in the latest change
		if (thit) {game.time.events.add(100,PpaintScores);break}
    }
	// if (!thit) {PreturnToStart(ev)}
}

var preloadBar

function PshowInfo(ev) {
	IGalertDIV(ev.descr,"auto",false,true,true,13)
}
function PshowCategories() {
    IGanalytics(['Paths', 'Categories', EventType]);
	IGalertDIV(CategoryMsg,"auto",false,true,true,13)
}
function PsetupEvent(loc, eventPic, idx, numevents) {
		poolEvs[loc] = {}
		var ff = Math.ceil(rx(14))
		var tsty = {font: ff+"px Helvetica", fill: "#000000", align: "center" }
		var evt = []
	    poolEvs[loc] = game.add.sprite((loc+1)*WIDTH/(numevents+1)+game.camera.x,evLoc.y, eventPic);
	    poolEvs[loc].scale.setTo(IGratio*0.7)
	    poolEvs[loc].anchor.setTo(0.5,0)	// align the top edges
	    poolEvs[loc].loc = {x:(loc+1)*WIDTH/(numevents+1)+game.camera.x, y:evLoc.y}
	    poolEvs[loc].order = loc
	    poolEvs[loc].inputEnabled = true
	    poolEvs[loc].input.enableDrag(false, true)
	    poolEvs[loc].events.onInputDown.add(PspriteTouched, this);
	    poolEvs[loc].events.onDragStart.add(PspriteMoving, this);
	    poolEvs[loc].events.onDragStop.add(PspriteMoved, this);
	    poolEvs[loc].date = parseInt(EventVars[EventType][idx].date)
	    poolEvs[loc].idx = idx
    	var fin = (EventVars[EventType][idx].category.indexOf(',')>0) ? EventVars[EventType][idx].category.indexOf(',') : EventVars[EventType][idx].category.length
    	var cat = EventVars[EventType][idx].category.substring(0,fin).toLowerCase()

	    poolEvs[loc].category = cat
	    poolEvs[loc].iname = ""
	    var catt = (DMMlevel == 1) ? cat.replace(" ","\n") : ""
	    evDates[loc] = parseInt(EventVars[EventType][idx].date)
	    if ((EventType == "Cities") || (EventType == "Dinosaurs")) {
	    	var iname = EventVars[EventType][idx].description.trim()
	    	evt[loc] = IGaddText((loc+1)*WIDTH/(numevents+1)+game.camera.x,evLoc.y-ry(4),
	    		catt+'\n'+iname,tsty)
	    	var sc = 1.0
	    	poolEvs[loc].title = iname
	    	if (WIDTH<1024) {sc = WIDTH/1024}
	    	evt[loc].anchor.setTo(0.5,1)
	    	evt[loc].scale.setTo(sc,sc)
	    	poolEvs[loc].txt = evt[loc]
	    } else if ((EventType == "Science") || (EventType == "Alaska")) {
	    	var pos = EventVars[EventType][idx].image.lastIndexOf('.')
	    	// replace all underscores but only replace the first space with a cr
	    	var iname = EventVars[EventType][idx].image.substr(0,pos).replace('01','').replace(/_/g," ").replace(" ","\n").trim()
	    	evt[loc] = IGaddText((loc+1)*WIDTH/(numevents+1)+game.camera.x,evLoc.y,
	    		catt+'\n'+iname,tsty)
	    	evt[loc].anchor.setTo(0.5,1)
	    	poolEvs[loc].title = iname
	    	poolEvs[loc].txt = evt[loc]
    	} else {
	    	var pos = EventVars[EventType][idx].image.lastIndexOf('.')
	    	// replace all underscores but only replace the first space with a cr
	    	var iname = EventVars[EventType][idx].image.substr(0,pos).replace('01','').replace(/_/g," ").replace(" ","\n").trim()
	    	evt[loc] = IGaddText((loc+1)*WIDTH/(numevents+1)+game.camera.x,evLoc.y,
	    		catt,tsty)
	    	evt[loc].anchor.setTo(0.5,1)
	    	poolEvs[loc].txt = evt[loc]
    	}

    	poolEvs[loc].info = IGaddSprite((loc+1)*WIDTH/(numevents+1)+game.camera.x+(75*0.6*IGratio),evLoc.y, 'info')
		var descr = (EventType == "Cities") ? EventVars[EventType][idx].location : EventVars[EventType][idx].description
		poolEvs[loc].info.descr = descr
		poolEvs[loc].info.inputEnabled = true
		poolEvs[loc].info.events.onInputDown.add(PshowInfo,this)
}
function PcheckTurn() {
	if (!PallDone) {
		if ((DMMturn == 1) || (DMMnumPlayers==2)) {moveMask.visible = false}
		if ((DMMturn == 2) & (DMMnumPlayers == 1)) {moveMask.visible = true; window.setTimeout(PcomputerTurn,200)}
	}

}

function PloadPaths() {

    var event1,event2,event3,event4,event5,event6,event7,event8,event9
    var events = [event1,event2,event3,event4,event5,event6,event7,event8,event9]

    for (i=0; i<events.length; i++) {
    	PsetupEvent(i, ievents[i], pidxs[i], PnumEvents)
    }

	var p1 = (DMMnumPlayers == 1) ? "Your turn" : "Player 1's turn"
	var p2 = (DMMnumPlayers == 1) ? "Computer's turn" : "Player 2's turn"

	DMMturn = (DMMturn == 1) ? 2 : 1
    var turn = (DMMturn == 1) ? p1+'\n(move an order-appropriate '+objectTypes[EventType2]+' onto any plus sign)' : p2
    whoseTurn.setText(turn)// = IGaddText(WIDTH/2, ry(30), turn, tstyh)

	if (preloadBar) {preloadBar.visible = false; preloadBar.destroy()}
	preloadBar = null
	notLoaded = false
	// IGnetworkGraph(rooms,daterooms[sortdates[0]])
	IGhide(instruct2,true)

	moveMask = IGaddSprite(WIDTH/2,3*HEIGHT/4+ry(60),'mask')
	moveMask.alpha = 0.6
	moveMask.inputEnabled = true
	PcheckTurn()

	CategoryMsg = "Number of items in each category\n\n"
	for (c in PoolCategories) {CategoryMsg = CategoryMsg + c+": "+PoolCategories[c]+"\n"}
	// IGalertDIV(CategoryMsg)//PcheckTurn)

    IGanalytics(['Paths', 'Load', EventType]);
	IGstopSpinner()
}
var updcnt = 0
var cursors
var swipeStart

var enter_pathway = {

	preload: function() {
    if (EventNum<IGminEvents[IGgameApp]) {
        var rtn = (Object.keys(PTopics).length<2) ? false : APPnewGame()
        IGstopSpinner()
        IGalertDIV("\n\nThere aren't enough events on this topic to play this game at this time."+
            "\n\nUse the menu upper right to select a different game "+
            "or to restart this game with a different topic.",
            "auto",rtn,true,true,true,16);
        return;
    }
		notLoaded = true
        IGconsole("AppPath: "+AppPath)

		graphics = game.add.graphics(0,0)
		IGwhite = false
		if (IGwhite) {
			IGsetStage()
			IGdefineScales()
		} else {
			IGdefineScales()
			IGsetStage()
		}
		// parameter tells it to register user
		DMMSetTopics()
		IGsetGlobalFunctions(true)
		PsetNodeScales()
		// IGsetStage()
		game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')

		CleanupList = []

		DMMgameReset()
		PnumTurns = 0
		PallDone = false

		PresetEvents()

		Ploader = new Phaser.Loader(game)

	    columnW = rx(280)
	    centerW = IGratio*290

		topRow = ry(30)
		// to match the menu bar, don't scale the y offset
		setLoc = {x: WIDTH/2-IGxratio*457, y: 72}
		catLoc = {x: setLoc.x+42, y: 72}

		netLoc ={x: rx(80), y: 3*HEIGHT/4 - ry(90)}

		evLoc = {x:WIDTH/2, y:3*HEIGHT/4+ry(54)}
		boardLoc = {x:50,y:ry(84),wid:gameWidth,hgt:ry(500)}

		game.load.image('node1', AppPath+'pics/haloBlue.png')
		game.load.image('node2', AppPath+'pics/haloRed.png')
		// game.load.image('pass', AppPath+'pics/passBut.png')
		// game.load.image('checkscores', AppPath+'pics/checkScores.png')
		game.load.image('mask', AppPath+'pics/maskGrey.png')
		game.load.image('info', CommonPath+'pics/help_round.png')
		game.load.image('board', AppPath+'pics/pathsBoard.png')
		game.load.image('target', AppPath+'pics/pathsTarget.png')
		game.load.image('bmask',AppPath+'pics/boardMask.png')

		var tstyh = {font: "20px Helvetica", fill: "#777777", align: "center" }
	    whoseTurn = IGaddText(WIDTH/2, ry(30), 
	    	Subjects[EventType2].replace('Strings','Paths').replace(" in "," through ").replace(" of "," through "),
	    	tstyh)

	    // catch when there aren't enough events in the database
	    numLeft = EventNum

	    pidxs = []
	    for (i=0; i<ievents.length; i++) {
	    	var r = Math.floor(Math.random()*(EventNum))
	    	while (IGisInArray(r,pidxs)) {
	    		r = Math.floor(Math.random()*(EventNum))
	    	}
	    	pidxs[i] = r
	    	var pos = EventVars[EventType][r].image.lastIndexOf('.')
	    	var iname = EventVars[EventType][r].image.substr(0,pos)
	    	var iname2 = iname.replace(/ /g,"_").replace(/,/g,"_")
	    	evDescriptions[i] = EventVars[EventType][r].description
//	    	IGconsole("Descr: "+evDescriptions[i])
//	    	IGconsole("file: "+iname2)
			// do this just so no 'old' image gets loaded on a rerun
	    	game.load.image(ievents[i], ImgPath+IGimgPath+'/'+iname2+'.png');
	    	game.load.image(iimgs[i], ImgPath+'large/'+iname2+'.png')
	    	iimgstxt[i] = 'Image Credit: '+EventVars[EventType][r].URL

	    }


	    // load the category count
	    for (r in EventVars[EventType]) {
	    	var fin = (EventVars[EventType][r].category.indexOf(',')>0) ? EventVars[EventType][r].category.indexOf(',') : EventVars[EventType][r].category.length
	    	var cat = EventVars[EventType][r].category.substring(0,fin).trim()
	    	if (PoolCategories[cat]) {
	    		PoolCategories[cat]++
	    		CompPoolCategories[cat.toLowerCase()]++
	    	} else {
	    		PoolCategories[cat] = 1
	    		CompPoolCategories[cat.toLowerCase()] = 1
	    	}
	    }

		var ff = Math.ceil(rx(17))
		var tsty = { font: "bold "+ff+"px Arial", fill: "#000", align: "center", wordWrap: true,
			wordWrapWidth: 600 };
		instruct2 = IGaddText(WIDTH/2, HEIGHT - ry(80), "Loading...",tsty);

		IGbrace1 = IGaddText(WIDTH/2-150,HEIGHT-ry(27),'[',hstylevlb)
		IGbrace2 = IGaddText(WIDTH/2+150,HEIGHT-ry(27),']',hstylevlb)

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
		listenSwipe(function(direction) {
		    IGconsole(direction);
		});
		game.world.setBounds(0, 0, gameWidth, HEIGHT);

	    // board = new Phaser.Rectangle(boardLoc.x,boardLoc.y,boardLoc.wid,boardLoc.hgt)
	    var board = IGaddSprite(boardLoc.x+gameWidth/2,boardLoc.y+boardLoc.hgt/2,'board')
	    board.scale.setTo(1.0,IGyratio)

	    boardMask = IGaddSprite(boardLoc.x+netSpacing*9,boardLoc.y,'bmask');
	    boardMask.scale.setTo(1.0)
	    boardMask.anchor.setTo(0,0)

		var ff = Math.ceil(rx(16))
		var tsty = { font: ff+"px Arial", fill: "#777777", align: "center", wordWrap: true,
			wordWrapWidth: 600 };
	    // instructions
		instruct = IGaddText(WIDTH/2, 4*HEIGHT/9-ry(30), 
			"",tsty);
		instruct.scale.setTo(1.0)

		IGalertDIV("\n\n"+instructTextP,"auto",false,true,true,16)

	    helpTextLocal = helpTextP[0]
	    for (var i=1; i<8; i++) {helpTextLocal = helpTextLocal + "\n\n"+helpTextP[i]}

	    // IGaddDivButton({xloc:WIDTH-rx(54), yloc: ry(100), text: 'Check Scores', size: 10, width: 60, height: 20, rtnf: 'PcheckScores'})

	    pt = IGaddDivButton({xloc: catLoc.x+98, yloc: catLoc.y,text:'Pass', rtnf:'PpassTurn'})

	 	catBtn = IGaddDivButton({xloc:catLoc.x,yloc:catLoc.y, text: "Categories",rtnf: 'PshowCategories'})

	 	settingsBtn = IGaddDivButton({xloc:setLoc.x,yloc:setLoc.y,rtnf: 'PgetSettings', 
	 		hclass: 'fa fa-cog'})

	    cursors = game.input.keyboard.createCursorKeys();
	    graphics2 = game.add.graphics(0,0)

		graphics2.lineStyle(2,0x777777, 1)

		ff = Math.floor(rx(22))
		tsty = { font: ff+"px Arial", fill: "#777777", align: "center" };
	    for (var l=0;l<numSects-1;l++) {
	    	dates[l] = IGaddText(boardLoc.x+netSpacing/2+(l*netSpacing),boardLoc.y+20,'',tsty)
	    	// divLines[l] = new Phaser.Rectangle(boardLoc.x+netSpacing*l,boardLoc.y,2,boardLoc.hgt-24);
	    	graphics2.moveTo(boardLoc.x+netSpacing*l,boardLoc.y)
	    	// if (l<4 || l>5) {
		    	divLines[l] = graphics2.lineTo(boardLoc.x+netSpacing*l,boardLoc.y+boardLoc.hgt)
		    // }
	    }
    	// targsdiv[0] = APPcreateTarget({xloc:boardLoc.x,yloc:boardLoc.y+ry(30),width:50,height:50}) 
    	targs[0] = IGaddSprite(boardLoc.x,boardLoc.y+boardLoc.hgt,'target')
    	targs[0].tier = 0

    	APPyourScore = IGaddDivText({xloc:WIDTH/3,yloc:26,size:13,weight:900,
    		width:150,height:40,text:"You\nNo score",hclass:"IGtestPathsY"})
    	IGhide(APPyourScore,true)
    	APPcompScore = IGaddDivText({xloc:2*WIDTH/3,yloc:26,size:13,weight:900,
    		width:150,height:40,text:"Computer\nNo score",hclass:"IGtestPathsC"})
    	IGhide(APPcompScore,true)

		window.setTimeout(PloadPaths,300)
	},
	update : function() {
		if ((!IGdragging) & (nodeOrder.length>9)) {
		    if (cursors.left.isDown) {
	            if (game.camera.x>3) {
	            	APPmoveWorld(-4)
				}
		    } else if (cursors.right.isDown) {
				var WWID = game.world.width
				var xstop = WWID-WIDTH-NSIZE
	            if (game.camera.x<xstop) {
	            	APPmoveWorld(4)
				}
	        } else if (IGswiping) {
	        	// move the world with the finger
				var WWID = game.world.width
	        	var adj = ((IGswipeStart - game.input.activePointer.position.x)>0) ? 4 : -4
				var xstop = WWID-WIDTH-NSIZE
	        	if (((adj < 0) && (game.camera.x>3)) || ((adj>0) && (game.camera.x<xstop))) {APPmoveWorld(adj)}
	        }
		}
	},
	render: function() {
	},
    shutdown : function() {
		// while (CleanupList.length>0) {CleanupList.pop().destroy()}
		IGcleanupTexts()

    }
}
function APPmoveWorld(adj) {
    game.camera.x += adj;
	for (var p=0;p<poolEvs.length;p++) {
		if (poolEvs[p].date) {
			poolEvs[p].reset(poolEvs[p].x+adj,poolEvs[p].y); 
			poolEvs[p].loc.x = poolEvs[p].x+adj;
			if (poolEvs[p].txt) {poolEvs[p].txt.x=poolEvs[p].txt.x+adj}
			if (poolEvs[p].info) {poolEvs[p].info.x=poolEvs[p].info.x+adj}
		}
	}
	whoseTurn.reset(whoseTurn.x+adj,whoseTurn.y)
	moveMask.reset(moveMask.x+adj,moveMask.y)
	if (DMMturn==1) {IGhide(moveMask,true)}

}
