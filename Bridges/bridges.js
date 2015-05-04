////////////////////////////////////////////////////////////
//
// bridges.js
//
// Copyright 2014 IdeateGames
// all rights reserved
//
/////////////////////////////////////////////////////////////

var notLoaded = true
var ploc = window.location.pathname;
AppPath = ploc.substring(0, ploc.lastIndexOf('/')+1);

var emitter
var bpmText, IGplayer, cursors, descr, timerText, preloadBar, instruct2, descLen, title,currentCategory,
        hitLoc, timeLoc, descLoc, moreLoc, sqLoc, catLoc, doneLoc, helpTextLocal,clue,altclue, movingEv,
        EventIsMoving, endBlock, endBlockL, CategoryMsg, curCatTxt, corner,
        bridgeList, biggestCategoryCnt, biggestCategory, maxScore,  movecnt, invalidDates, sortedDates,
        maxscore
var playerBigCatCnt=0,playerBigCat=0
var rooms = []
var squares = []
var bgcolor = "#dec0e2"
var IGdebug = true
var ORIGsqsize = 120
var sqsize = 120
var sqspacing = 126
// this can change if a small number of events available
var numSquares = 20
var numPool = numSquares - 2
// this affects the layout, cannot change
var numColumns = 9
var numRamps = 5
var numDone = 0
var ievents = []
var titles = []
var titlestxt = []
var titles2 = []
var titlestxt2 = []
var titleshade = []
var evDescriptions = []
var evAltClues = []
var evBridges = []
var evDates = []
var bridges = [{},{},{},{},{},{},{},{},{},{}]
var bridges2 = [{},{},{},{},{},{},{},{},{},{}]
var PoolBridgesAll = {}
var evWorking = []
var idxes = []
var yetToHit = []
var numMistakes = 0
var numCats = 0
var numDates = 0
var topicList = []
var validTopics = []
var landscape, greenEx
var checks = []
var helps = []
var iimgs = []
var ramps = []
var iimgstxt = []
var updcnt = 0
var APPbaseScore = 10
var thisScore = 0
var totalScore = 0
var doneCats = 0
var points = [0,10,8,6,4,2]
var nextDirection = 1
var rotateDirection = 0
// how far two links can be from each other to qualify for a date link
var DATE_BUCKET = 80
// how far beyond the bridge in each direction to add unusable items
var DATE_EXTRA = 30
// bonus for making a link from dates
var DATE_VALUE = 5
var MAX_LINKS = 6

var MIDDATE = 1770
var ENDDATE = 1920

var CAT_VALUE = 20
var TOPIC_VALUE = 15
var PENALTY = 5

var BALL_SPEED = 800;//525;
var BALL_ANGULAR = BALL_SPEED/50
var RAMP_DROP = 5;
var GLOBAL_GRAVITY = 5000;


function IGisBlocked(ev) {
	var ret = false
	if (ev.body.blocked) {if (ev.body.blocked.up && ev.body.blocked.down && ev.body.blocked.left && ev.body.blocked.right) {ret = true}}
	return ret
}
function CshowAltClues(ev) {
    var desctext = EventVars[EventType][ev.idx][altclue].replace(/;/g,"; ")
    if (desctext.length>descLen2) {
        var pos = IGfindPrevious(desctext.substring(0,descLen2),' ')
        desctext = desctext.substring(0,pos) + "..."
    }
    IGalertDIV("\n\n"+desctext,"auto",false,true,true,13)
}
function CshowName(ev) {
    var onoff = (ev.hidden) ? true : false
    IGhide(titlestxt2[ev.idx],onoff)
    IGhide(titleshade[ev.idx],onoff)
    ev.hidden = !onoff
}
var helpcnt = 0
var helpstate ={on: true}
function BrflashHelp() {
	var hbut = document.getElementsByClassName("menuHelp")
	if (helpcnt<8) {
		IGhide(hbut[0],helpstate.on)
		helpstate.on = !helpstate.on
		game.time.events.add(500,BrflashHelp,this)
		helpcnt++
	} else {IGhide(hbut[0],false)}
}
function BcalcBucketValue(bsize,setsize) {
	// bsize is the bridge size; setsize is the number of items at the start of the bridge
	var scdiv = setsize * 0.5 // after 5 bridges completed, then value is less than bridge size, min 1
	// decided not to use this complicated scoring for now
	var tscore = (DMMlevel==9) ? Math.ceil(points[bsize]*scdiv) : Math.ceil(bsize*scdiv)
	return tscore
}

function BgetAllCategories() {
	var blist = []
	for (var e=0;e<evBridges.length;e++) {
		for (var b=0;b<evBridges[e].length;b++) {
			if (!IGisInArray(evBridges[e][b],blist)) {blist.push(evBridges[e][b])}
		}
	}
	return _.sortBy(blist, function (i) { return i.toLowerCase(); });
}
function Bbridgelist() {
	bridgeList = BgetAllCategories()
}
function BbridgelistFormat() {
	// var CategoryMsg = "\\n"
	if (!bridgeList) {bridgeList = BgetAllCategories()}
	// for (var b=0;b<bridgeList.length;b++) {var comma=(b==0)?"":", ";CategoryMsg = CategoryMsg+comma+bridgeList[b]}
	return bridgeList.toString().replace(/,/g,", ")
}
function BgetBiggestBucket() {
	var tmpbridge = {}
	// dont do date bridges, too wasteful; count them as bonus if player finds them
	// count the possibles in each bridge
	// need to repeat this here because this is iterative
	// after each category is removed
	for (var e=0;e<evBridges.length;e++) {
		if (!evBridges[e].counted) {
			for (c=0;c<evBridges[e].length;c++) {
		    	if (tmpbridge[evBridges[e][c]]) {
		    		tmpbridge[evBridges[e][c]]++
	    		} else {
	    			tmpbridge[evBridges[e][c]] = 1
	    		}
	    	}
	    }
	}
	// now find the largest
	var bb = ""
	var bbcnt = 0
	for (key in tmpbridge) {
		if (tmpbridge[key] > bbcnt) {
			bbcnt = tmpbridge[key]
			bb = key
		}
	}

	return [bb,bbcnt]
}
function BsetCounted(buck) {
	for (var b=0;b<evBridges.length;b++) {
		if (IGisInArray(buck,evBridges[b])) {evBridges[b].counted=true}
	}
}
function BcalcBridgesAll() {
	var bscores = 0
	maxScore = 0
	var bbset = {}
	bscores[biggestCategory] = biggestCategoryCnt
	BsetCounted(biggestCategory)
	var curbb = []
	bbset[biggestCategory] = BcalcBucketValue(biggestCategoryCnt,numSquares)
	IGconsole("biggest: "+biggestCategory+","+biggestCategoryCnt+":"+bbset[biggestCategory])
	maxScore += bbset[biggestCategory]
	var used = biggestCategoryCnt
	// now find each next largest bridge,
	// calculate its score,
	// then set the members as counted
	for (var bc=0;bc<bridgeList.length;bc++) {
		curbb = BgetBiggestBucket()
		bbset[curbb[0]] = curbb[1]
		var tmpscore = BcalcBucketValue(curbb[1],numSquares-used)
		bscores[curbb[0]] = tmpscore
		IGconsole("next biggest: "+curbb+":"+tmpscore)
		BsetCounted(curbb[0])
		used += curbb[1]
		maxScore += tmpscore
		if (used>=numSquares) {break;}
	}
	IGconsole("Max score: "+maxScore)
}

function BshowCategories() {
	var CategoryMsg = "\\n\\nPossible link categories:\n\n"
	if (DMMlevel==2) {
		for (key in PoolBridges) {
			if (PoolBridges[key]>0) {CategoryMsg = CategoryMsg+"\\n"+key}
		}		
	} else {CategoryMsg+=BbridgelistFormat()+"\n\n"+sortedDates.toString().replace(/,/g,", ")}
	
    IGanalytics(['Paths', 'Categories', EventType]);
	IGalertDIV(CategoryMsg,"auto",false,true,true,13)

}
function CresetGame() {
	bridgeList = null
	topicList = []
	validTopics = []

    rooms = []
    squares = []
    ievents = []
    evDescriptions = []
    evWorking = []
    idxes = []
    yetToHit = []
    numMistakes = 0
    landscape = false; greenEx = false
    checks = []
    iimgs = []
    iimgstxt = []
    updcnt = 0
    thisScore = 0
    totalScore = 0
    currentCatLoc = 0
    PoolBridges = {}
    evBridges = []
    evDates = []
    currentCategory = []
    doneCats = 0
	numMistakes = 0
	numCats = 0
	numDates = 0
    numLeft = numSquares
    numDone = 0
    PoolBridgesAll = {}
    PoolBridges = {}
    invalidDates = false

}
var currentCatLoc = 0

function BenablePhysics(ev) {
	game.physics.arcade.enable(ev,true)
	ev.body.collideWorldBounds = true;
	// ev.body.mass = 0;
	// // ev.body.setCircle(45,0,0)
	// ev.body.immovable = true;
	// ev.body.gravity.y = 0;

}
function APPnewGame() {
    loadURLExt({'url': AppPath+'../../../strings/bindex.html?alias='+DMMalias+"&level="+DMMlevel})
}
function APPrestart() {
    if ((EventVars[EventType])) {
        IGstartSpinner()
        game.state.start('entry',true,true)
    } else {APPnewGame()}
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
    retin1.innerHTML = "<h4>Settings for Bridges</h4><p>&nbsp;</p><p style='font-weight:900;'>Difficulty Level:</p>"+
    	'<input id="option1" type="radio" name="level" value="1"'+check[1]+'/>'+
    	'<label for="option1">&nbsp;Bridge link is any common element&nbsp;&nbsp;</label>'+
    	'<br/><input id="option2" type="radio" name="level" value="2"'+check[2]+'/>'+
    	'<label for="option2">&nbsp;Bridge link is a date range&nbsp;&nbsp;</label>'
    ret.appendChild(retin1);

    document.getElementById("game").appendChild(ret);

    return ret
}
var settingsBtn
var settingsOn
function BgetSettings() {
	var wid = 300
	var hgt = 180
	if (settingsOn) {
		if (DMMlevel!=parseInt($('input[name="level"]:checked').val())) {
			DMMlevel = parseInt($('input[name="level"]:checked').val());
			APPrestart()			
		}
		APPdismissSettings()
		settingsOn = false
	} else {
	    IGanalytics(['Bridges', 'Settings', EventType]);
		APPsettings({xloc:wid/2+20,yloc:hgt/2+50,width:wid,height:hgt})
		settingsOn = true
	}
}
var dateScore, catScore, topicScore
function BrCalcScore() {
	// 7 possible links
	// 6 possible items, 4 or fewer possible topics
	maxScore = 4*CAT_VALUE + 4*DATE_VALUE + validTopics.length*TOPIC_VALUE
	topicScore = topicList.length*TOPIC_VALUE
	dateScore = numDates*DATE_VALUE
	IGconsole("date links: "+numDates)
	catScore = numCats*CAT_VALUE
	totalScore =  catScore + dateScore + topicScore
	return totalScore
}
function BrshowScore() {
    IGstopTimer()
    var pen = PENALTY*numMistakes
    var penmsg = (pen>0) ? " ("+pen+" penalty points)" : ""
	var tot = BrCalcScore() - pen
	// catch the probably impossible condition of ties in the smaller bridges
	if (tot>maxScore) {tot=maxScore}
    var plur = (numMistakes==1) ? "" : "s"
    var misnum = (numMistakes==0) ? "no" : numMistakes
    // var datelinks = (numDates>0) ? 1 : 0
    var tmplink = (numCats==0) ? "no link categories" : numCats+" link categories"
    var linkmsg = (numCats==1) ? " one link category" : tmplink
    linkmsg += " ("+catScore+" points)."
    var spm = parseInt(600*numDone/IGnumSecs)/10
    var topicmsg = (EventType=="Culture") ? "\n\nYou used "+topicList.length+" topic"+IGplur(topicList.length)+" ("+topicScore+" points)." : ""
    DMMscores.push(tot)
    // var numgames = (DMMscores.length>=3) ? 3 : DMMscores.length
    IGcalcTotalScore()
        var scoreText = "Your score for this set is "+tot+ ", and the maximum raw score with these items was "+maxScore+"."+
        "\n\nYour raw score was "+tot+ maxmsg+
        // "\n\nYou correctly placed "+numDone+" items onto the bridge."+
        // "\n\nThat's a rate of "+spm+" "+ObjTypes[EventType2]+" per minute."+
        "\n\nYou made "+misnum+" mistake"+plur+penmsg+"."+
        topicmsg+
        "\n\nYou used "+linkmsg+
        "\n\nYou used "+numDates+" links with dates ("+dateScore+" points)."
        // "\n\nTo achieve Competency in Bridges, you need "+IGwizardScores[IGgameApp]+" points from 3 consecutive games. "+
        // "You have "+DMMtotalScore+
        // " points (total for "+numgames+" game"+IGplur(numgames)+")."
        var userDataMsg = tot+":"+DMMtotalScore+":"+maxScore+":"+spm+":"+numMistakes+" (Level "+DMMlevel+")"
        var ldr = true
        if (!IGisIGServer) {ldr = false}
        IGendGame({msg:scoreText,fcns:{again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame',leader:ldr},
            wide: true})
        IGsendScore(userDataMsg)

}
function BmakeDateRange() {
	return (currentDateRange.high-DATE_BUCKET)+" - "+(currentDateRange.low+DATE_BUCKET)
}
function CnextCatLoc() {
	var tmp = currentCatLoc
	currentCatLoc++
	PoolBridges[currentCategory.toString()]--
	return catLoc.x+(tmp*sqspacing)
}
var toExplode
function BreventExplode(ev) {
	ev = toExplode
	IGbang.play();
			emitter.x = ev.x;
			emitter.y = ev.y;
			emitter.start(true,2000,null,50)
	IGhide(ev,true)
	IGhide(titlestxt[ev.idx],true)
	IGhide(titlestxt2[ev.idx],true)
	IGhide(titleshade[ev.idx],true)
	if (helps[ev.idx]) {IGhide(helps[ev.idx],true)}
	// one fewer in this category for next time
	PoolBridges[evBridges[ev.idx][0]]--
	numMistakes++
}
var flashctr = 0
function Bflash2() {
	var hide = !title.hidden
	IGhide(title,hide);title.hidden = hide
	if (flashctr < 5) {game.time.events.add(50,Bflash2,title);flashctr++;curCatTxt.reset(msgLoc.x,msgLoc.y-flashctr*10)} 
	else {IGhide(curCatTxt,true);curCatTxt.reset(msgLoc.x,msgLoc.y);flashctr = 0}
}
function BflashTitle() {
	IGhide(curCatTxt,false)
	game.time.events.add(50,Bflash2)
}
// usage of date range: these represent the current low and high in the
// bridge, not the actual allowable range
// but we calculate the range from this low and high
// the range is from DATE_BUCKET below the high to DATE_BUCKET above the low
var currentDateRange = {low: -1, high: -1}
var currentDateString = ""
var bottomEndBr, topEndBr
function BrDetermineDateBridge(ev,topEnd) {
	var ret = false
	// just be sure it's not a string
	var evdat = parseInt(evDates[ev.idx])
	// was this dropped on the lower end or higher end?
	if (topEnd) {
		// dropped on top end, so ensure lower date than top end
		if ((evdat >= currentDateRange.high-DATE_BUCKET) && (evdat <= currentDateRange.high)) {
			// valid play
			ret = true
		} else {
			//invalid play
		}
	} else {
		if ((evdat <= currentDateRange.low+DATE_BUCKET) && (evdat >= currentDateRange.low)) {
			// valid play
			ret = true
		} else {
			// invalid play
		}
	}
	return ret
}
function IGintersect(a,b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}
function BfindIntersection(a,b) {
	var ret = IGintersect(a,b)
	if (ret[0]) {IGconsole("ovelap: "+ret.toString())}
	return (ret[0]) ? ret : false
}
function BrDetermineCatBridge(ev, topEnd) {
	var cmp = (topEnd) ? topEndBr : bottomEndBr
	var ret = BfindIntersection(evBridges[cmp.idx],evBridges[ev.idx])
	return ret
}
function BrCheckIfDone(firstTime) {
	var ret = true
	// skip the first 2 which are the ends of the bridge
	if (numDone<MAX_LINKS) {
		for (var e=2;e<squares.length;e++) {
			if (!squares[e].done) {
				if ( (evDates[squares[e].idx] > currentDateRange.low) && (evDates[squares[e].idx] < currentDateRange.high) ) {
					ret = false
					if (firstTime) {if (!IGisInArray(EventVars[EventType][idxes[squares[e].idx]].topic,validTopics)) {
						validTopics.push(EventVars[EventType][idxes[squares[e].idx]].topic)
					}}
				}
			}
		}
	} else {
		// need to add the final connection
		var commoncat = BrDetermineCatBridge(bottomEndBr, topEndBr)
		if (commoncat) {numCats+=commoncat.length}
		else {
			var datelink = BrDetermineDateBridge(bottomEndBr, topEndBr)
			if (datelink) {numDates++}
		}
	}
	return ret
}
function BrOKDates(ev) {
	IGconsole("compare dates: "+ev.idx+":"+evDates[ev.idx]+":"+currentDateRange.low+":"+currentDateRange.high)
	return (evDates[ev.idx]>= currentDateRange.low) && (evDates[ev.idx] <= currentDateRange.high)
}
function BraddLink(ev) {
    if (!IGtimerFlag) {IGstartTimer()}
    	var datb = BrDetermineDateBridge(ev)
    	var catb = BrDetermineCatBridge(ev)
    	var datbtop = BrDetermineDateBridge(ev, topEndBr)
    	var catbtop = BrDetermineCatBridge(ev, topEndBr)
    if (IGcheckOverlap(ev, bottomEndBr)) {
    	//
    	if (BrOKDates(ev) && (catb || datb)) {
    		IGclick.play();
    		numDone++
			currentDateRange.low = parseInt(evDates[ev.idx])
			ev.reset(bottomEndBr.xloc()+sqspacing,bottomEndBr.yloc())
			titlestxt[ev.idx].reset(bottomEndBr.xloc()+sqspacing,bottomEndBr.yloc()-sqspacing/2)
			titleshade[ev.idx].reset(bottomEndBr.xloc()+sqspacing,bottomEndBr.yloc())
			helps[ev.idx].reset(bottomEndBr.xloc()+sqspacing-corner,bottomEndBr.yloc()+corner)
			if (!IGisInArray(EventVars[EventType][idxes[ev.idx]].topic,topicList)) {topicList.push(EventVars[EventType][idxes[ev.idx]].topic)}
			ev.input.disableDrag()
			ev.done = true
			bottomEndBr = ev
			var brtxt = (catb) ? catb.toString().replace(/,/g,", ") : "date"
			if (catb) {numCats+=catb.length} else {numDates++}
			IGconsole("link: "+brtxt)
			IGaddDivText({xloc:bottomEndBr.xloc()-sqspacing/2, yloc:bottomEndBr.yloc()-sqspacing/2-IGratio*54,
				text:brtxt, width: sqspacing, bgcolor: "#fff", color: "#000" })
		} else {
			IGbuzzer.play();
			ev.reset(ev.origx,ev.origy);
			numMistakes++
		} 
    } else if (IGcheckOverlap(ev, topEndBr)) {
		if (BrOKDates(ev) && (catbtop || datbtop)) {
			IGclick.play();
    		numDone++
			currentDateRange.high = parseInt(evDates[ev.idx])
			ev.reset(topEndBr.xloc()-sqspacing,topEndBr.yloc())
			titlestxt[ev.idx].reset(topEndBr.xloc()-sqspacing,topEndBr.yloc()-sqspacing/2)
			titleshade[ev.idx].reset(topEndBr.xloc()-sqspacing,topEndBr.yloc())
			helps[ev.idx].reset(topEndBr.xloc()-sqspacing-corner,topEndBr.yloc()+corner)
			ev.input.disableDrag()
			ev.done = true
			topEndBr = ev
			var brtxt = (catbtop) ? catbtop.toString().replace(/,/g,", ") : "date"
			if (catbtop) {numCats+=catbtop.length} else {numDates++}
			IGconsole("link: "+brtxt)
			IGaddDivText({xloc:topEndBr.xloc()+sqspacing/2, yloc:topEndBr.yloc()-sqspacing/2-IGratio*54,
				text:brtxt, width: sqspacing, bgcolor: "#fff", color: "#000" })
		} else {
			IGbuzzer.play();
			ev.reset(ev.origx,ev.origy)
			numMistakes++
		}
	}
	if (BrCheckIfDone()) {game.time.events.add(1000,BrshowScore,this)}

}
// span in dates
var BRIDGE_LNTH = 150
// wiggle room for the bridge -- can be this much longer than the LNTH,
// so the date of the end of the bridge doesn't have to be exact
// the end of the bridge must be in a window of this size
var BRIDGE_VAR = 10
var endDate, startDate
var tryctr = 0
function BreventIsOK(ix,evnum) {
	// IGconsole("trying event: "+EventVars[EventType][ix].date+":"+ENDDATE)
	tryctr ++
	if (tryctr>100) {IGconsole("\nFAIL\n");return true}
	var ret = !IGisInArray(ix,idxes)
	if (parseInt(EventVars[EventType][ix].date)>ENDDATE) {ret = false}
	if (ret && (evnum<2)) {
		// for the last two, pick ones that are in the upper half and lower half
		// assume halfway date = 1825
		if (evnum==0) {
			// this is the first one, make it the start of the bridge
			// must be from the first half
			if (parseInt(EventVars[EventType][ix].date)<MIDDATE) {
				ret = true
				startDate = parseInt(EventVars[EventType][ix].date)
			} else {ret = false}

		} else {
			// this is the last one, the end
			if ( (startDate + BRIDGE_LNTH < parseInt(EventVars[EventType][ix].date)) && 
				(startDate + BRIDGE_LNTH+BRIDGE_VAR > parseInt(EventVars[EventType][ix].date)) ) {
				ret = true
				endDate = parseInt(EventVars[EventType][ix].date)
			} else {ret = false}
		}
	} else if (ret) {
		// make the window only a little beyond the bridge
		if (parseInt(EventVars[EventType][ix].date)>endDate+DATE_EXTRA) {ret = false}
		else if (parseInt(EventVars[EventType][ix].date)<startDate-DATE_EXTRA) {ret = false}
	}
	return ret
}
function BrSelectEvent(ix) {
	        var r = Math.floor(Math.random()*(EventNum))
	        while (!BreventIsOK(r, ix)) {
	            r = Math.floor(Math.random()*(EventNum))
	        }
	        idxes[ix] = r
	        var pos = EventVars[EventType][r].image.lastIndexOf('.')
	        var iname = EventVars[EventType][r].image.substr(0,pos)
	        var iname2 = iname.replace(/ /g,"_").replace(/,/g,"_")
	        game.load.image('room'+ix, ImgPath+IGimgPath+'/'+iname2+'.png');
	        game.load.image('bigroom'+ix, ImgPath+'large/'+iname2+'.png');
	        iimgs[ix] = 'bigroom'+ix
	        iimgstxt[ix] = 'Image Credit: '+EventVars[EventType][r].URL
	        if (titleclue=="image") {
	            titles[ix] = EventVars[EventType][r].image.substr(0,pos).replace('01','').replace(/_/g," ").trim()
	        } else {
	        	titles[ix] = EventVars[EventType][r][titleclue].trim()
	        }
	        if (clue=="image") {
	        	titles2[ix] = EventVars[EventType][r].image.substr(0,pos).replace('01','').replace(/_/g," ").trim()
	        } else {
	        	titles2[ix] = EventVars[EventType][r][clue].trim()
	        }
	        // evAltClues[ix] = EventVars[EventType][r][altclue]
	        // set up the bridges

	        if (DMMlevel<3) {
	        	// level 3 is dates only
		        var cat = []
		    	var tmpcat = EventVars[EventType][r].category.toLowerCase().split(',')
		    	if ((EventType!="Cities") && (EventType!="Culture")) 
		    		{var tmpcat2 = EventVars[EventType][r].actor.split(',')}
		    	if ((EventType != "Movies") && (EventType!="Literature") && (EventType!="Composeers"))
		    		{var tmpcat3 = EventVars[EventType][r].location.split(',')}
		    	for (var a=0;a<tmpcat.length;a++) {
		    		if ((EventType=="Museum") && (tmpcat[a].trim()=="art")) {IGconsole("skipping museum art")}
		    		else {cat.push(tmpcat[a].trim())}
		    	}
		    	if (tmpcat2) {for (var a=0;a<tmpcat2.length;a++) {cat.push(tmpcat2[a].trim())}}
		    	if (tmpcat3) {for (var a=0;a<tmpcat3.length;a++) {cat.push(tmpcat3[a].trim())}}
		    	// cat = [tmpcat[0]]
		    	evBridges[ix] = cat
		    	if (PoolBridges[cat[0]]) {
		    		PoolBridges[cat[0]]++
		    	} else {
		    		PoolBridges[cat[0]] = 1
		    	}
		    	for (c=0;c<cat.length;c++) {
			    	if (PoolBridgesAll[cat[c]]) {
			    		PoolBridgesAll[cat[c]]++
			    	} else {
			    		PoolBridgesAll[cat[c]] = 1
			    	}
		    	}
		    }
	    	// don't want dates in the general categories
	    	// but save as numbers for the range
	    	evDates[ix] = parseInt(EventVars[EventType][r].date)
	    	// IGconsole("date: "+ix+":"+evDates[ix])
	    	// // push the string version
	    	// evBridges[ix].push(EventVars[EventType][r].date)
}

// background is #00C4CE
var gameEntry = {
	preload: function() {

    if (EventNum<IGminEvents[IGgameApp]) {
        var rtn = (Object.keys(Topics).length<2) ? false : APPnewGame()
        IGstopSpinner()
        IGalertDIV("\n\nThere aren't enough events on this topic to play this game at this time."+
            "\n\nUse the menu upper right to select a different game "+
            "or to restart this game with a different topic.",
            "auto",rtn,true,true,true,16);
        return;
    }

		IGratio = (IGratio>0.94) ? 0.94 : IGratio
		IGyratio = (IGyratio>0.94) ? 0.94 : IGyratio
	    notLoaded = true

		DMMSetTopics()
	    DMMgameReset()
	    CresetGame()
	    game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')
	    var ff = Math.ceil(rx(17))
	    var tsty = { font: "bold "+ff+"px Arial", fill: "#000", align: "center", wordWrap: true,
	        wordWrapWidth: 600 };
	    instruct2 = IGaddText(WIDTH/2, HEIGHT - ry(80), "Loading...",tsty);

	    IGnumSecs = 0
	    numMistakes = 0
	    // parameter tells it to register user
	    IGsetGlobalFunctions(true)
	    IGsetStage('#ffffff')
	    IGdefineScales()

		var cnum = Math.floor(Math.random()*6)
		// override, just use silver
		cnum = ""

    game.load.image('correct', CommonPath+'pics/greenCheck.png')
    game.load.image('wrong', CommonPath+'pics/greenEx.png')
    game.load.image('shade', CommonPath+'pics/itemCircleGrey.png')
    game.load.image('itemhelp', CommonPath+'pics/help_round.png')
	game.load.image('pixel',CommonPath+'pics/confetti'+cnum+'_s.png')
	game.load.image('bridge', AppPath+'pics/bridge_1.png')
	// game.load.image('ramp', CommonPath+'pics/ramp.png')
	// game.load.image('chute', CommonPath+'pics/chute.png')
	// game.load.image('chuteend', CommonPath+'pics/chuteend.png')
	// game.load.image('bridge', CommonPath+'pics/bridge.png')
	// game.load.image('bridge_front', CommonPath+'pics/bridge_front.png')
	// game.load.image('chutewood', CommonPath+'pics/ChuteGrass4.png')


	    topRow = ry(30)
	    sqspacing = ORIGsqsize*IGratio+IGratio*4
	    landscape = true//HEIGHT<1000
	    centerW = IGratio*290
	    UNcenterW = 290
	    columnW = rx(280)
	    ctrloc = (HEIGHT>780) ? 360 : HEIGHT/2-IGratio*50
		setLoc = {x: WIDTH/2-IGxratio*457, y: 72}
		catLoc = {x: setLoc.x+42, y: 72}

	    doneLoc = {x: WIDTH/2-centerW-IGratio*170, y:ctrloc-sqspacing, x2: WIDTH/2-centerW+rx(230)}
	    doneLoc2 = {x: WIDTH/2+centerW+IGratio*170, y:ctrloc-sqspacing, x2: WIDTH/2-centerW+rx(230)}
	    timeLoc = {x: WIDTH/2+centerW+(columnW/2), y: ctrloc-ry(100)}
	    msgLoc = {x:WIDTH/2,y:80}

	    title = IGaddDivText({xloc:game.world.centerX, yloc:topRow,text:Subjects[EventType2].replace("Strings","Bridges"),
	    	width:rx(440),size:18,color:'#6a6a6a',bgcolor: "#fff",weight:'400',height:50})
	    curCatTxt = IGaddDivText({xloc:msgLoc.x, yloc:msgLoc.y,text:"",
	    	width:500,size:24,color:'#0000ff',weight:'900',height:50})
	    IGhide(curCatTxt,true)

	    catstxt = IGaddDivText({xloc:doneLoc.x, yloc:doneLoc.y-(0.7*sqspacing),text:"",
	    	width:120,size:16,color:'#333',weight:'400',height:50, bgcolor: "#fff"})
	    catstxt2 = IGaddDivText({xloc:doneLoc2.x, yloc:doneLoc.y-(0.7*sqspacing),text:"",
	    	width:120,size:16,color:'#333',weight:'400',height:50, bgcolor: "#fff"})
	    IGhide(catstxt2,true)


    	var tt = IGaddDivText({xloc:doneLoc.x,yloc:topRow+ry(30),text:"Time"})
    	IGhide(tt,true)
    	IGtnumSecs = IGaddDivText({xloc:doneLoc.x+rx(50),yloc:topRow+ry(30),text:"0"})
    	IGhide(IGtnumSecs,true)

	 	catBtn = IGaddDivButton({xloc:catLoc.x,yloc:catLoc.y, text: "Bridges",rtnf: 'BshowCategories'})
	 	settingsBtn = IGaddDivButton({xloc:setLoc.x,yloc:setLoc.y,rtnf: 'BgetSettings', 
	 		hclass: 'fa fa-cog'})
	 	// IGaddDivButton({xloc:setLoc.x+122,yloc:catLoc.y, text: "Close Bridge",rtnf: 'BcleanupCompleted'})

	    clue = 'description'
	    altclue = 'objects'
	    titleclue = 'date'
	    switch (EventType) {
	        case 'Museum':
				DATE_BUCKET = 8000000
				MIDDATE = 1800
				ENDDATE = 1980
	            clue = 'actor'
	            altclue = 'description'
	            var ch = Math.floor(Math.random()*2)
	            switch (ch) {
	                case 0:
	                    clue = "actor";
	                    altclue = "objects"
	                    break;
	                case 1:
	                    clue = 'actor';
	                    altclue = "description"
	                    break;
	            }
	            break;
	        case 'Alaska':
	        	clue = 'location'
	        	altclue = 'description'
	        	titleclue = 'image'
	        	break;
	        case 'Science':
	            var ch = Math.floor(Math.random()*1)
	            // for now, always case 0
				MIDDATE = 1750
				ENDDATE = 1910
	            switch (ch) {
	            	case 0:
	                    clue = 'image';
	                    altclue = "description"
	                    titleclue = 'date'
	                    break;
	                case 1:
	                    clue = "image";
	                    altclue = "objects"
	                    titleclue = 'date'
	                    break;
	                case 2:
	                    clue = 'image';
	                    altclue = "description"
	                    titleclue = 'actor'
	                    break;
	                case 3:
	                    clue = 'image';
	                    altclue = "description"
	                    titleclue = 'actor'
	                    break;
	            }
	            break;
	        case 'Literature':
	            var ch = Math.floor(Math.random()*3)
				MIDDATE = 1850
				ENDDATE = 2100
	            switch (ch) {
	                case 0:
	                    clue = "actor";
	                    altclue = "objects"
	                    titleclue = 'date'
	                    break;
	                case 1:
	                    clue = 'actor';
	                    altclue = "description"
	                    titleclue = 'date'
	                    break;
	                case 2:
	                    clue = 'actor';
	                    altclue = "description"
	                    titleclue = 'date'
	                    break;
	            }
	            break;
	        case 'Art':
	            var ch = Math.floor(Math.random()*4)
				MIDDATE = 1750
				ENDDATE = 1920

	            switch (ch) {
	                case 0:
	                    clue = "description";
	                    altclue = "objects"
	                    break;
	                case 1:
	                    clue = 'actor';
	                    altclue = "description"
	                    break;
	                case 2:
	                    clue = 'actor';
	                    altclue = "description"
	                    break;
	                case 3:
	                    clue = 'description';
	                    altclue = "description"
	                    break;
	            }
	            break;
	        case 'Culture':
				DATE_BUCKET = 80
				BRIDGE_LNTH = 150
				MIDDATE = 1770
				ENDDATE = 1920
	            clue = 'actor'
	            altclue = "description"
	            break;
	        case 'Composers':
	            clue = 'actor'
	            altclue = "description"
	            var ch = Math.floor(Math.random()*3)
	            if (ch>1) {clue = "actor";altclue = "objects"};
	            break;
	        case 'Movies':
				DATE_BUCKET = 80
				BRIDGE_LNTH = 40
				MIDDATE = 1950
				ENDDATE = 2100
	            clue = 'actor'
	            altclue = "description"
	            var ch = Math.floor(Math.random()*3)
	            if (ch>0) {clue = "actor";altclue = "objects"};
	            break;
	        case 'Cities':
	            var ch = Math.floor(Math.random()*5)
	            if (ch>1) {clue = 'actor';altclue = "date"}
	            else {clue = 'date';altclue = "actor"}
	        case 'AlaskanCities':
	            var ch = Math.floor(Math.random()*5)
	            if (ch>1) {clue = 'actor';altclue = "date"}
	            else {clue = 'date';altclue = "actor"}
	    }

	    // select the items for this game
	    // must be 5 or fewer bridges
	    // no duplicates (of course)
	    // 
	    // catch when database not full yet, mostly for testing
	    if (numSquares>EventNum) {numSquares=EventNum;numLeft=numSquares}
	    // in case numSquares changed
	    numPool = numSquares-2

	    // first, the two end points

	    for (var i=0;i<numSquares;i++) {
	    	BrSelectEvent(i)
			if (i==0) {currentDateRange.low = parseInt(evDates[i])}
			else if (i==1) {currentDateRange.high = parseInt(evDates[i])}
		}

		biggestCategoryCnt = 0
		biggestCategory = ""

		for (key in PoolBridgesAll) {
			if (PoolBridgesAll[key] > biggestCategoryCnt) {
				biggestCategoryCnt = PoolBridgesAll[key]
				biggestCategory = key
			}
		}
		IGconsole("biggest: "+biggestCategory+":"+biggestCategoryCnt)

		Bbridgelist() // creates bridgeList used in next function
		BcalcBridgesAll()

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
	    hitLoc = {x: WIDTH/2-centerW-(columnW/2), y: ctrloc-ry(100)}
	    timeLoc = {x: WIDTH/2+centerW+(columnW/2), y: ctrloc-ry(100)}
	    descLoc = {x: WIDTH/2, y: ctrloc+centerW+ry(38)}
	    moreLoc = {x: WIDTH/2+rx(250), y: ctrloc+centerW+IGratio*170}
	    catLoc = {x: WIDTH/2-2.5*sqspacing, y:ctrloc+2.9*sqspacing}
	    sqLoc = {x: WIDTH/2, y: ctrloc-ry(70)}
	    chuteLoc = {x: WIDTH/2+centerW+rx(184), y:ctrloc-sqspacing}
	    boxW = IGratio*620
	    boxH = IGratio*224
	    if (landscape) {
	        // make the description box placement not scale, so it lines up with menu
	        descLoc = {x:WIDTH/2+centerW+(columnW/2), y: ctrloc}
	        moreLoc = {x:WIDTH/2+centerW+(columnW/2)+rx(55), y: ctrloc+ry(310)}
	        hitLoc = {x: WIDTH/2-centerW-(columnW/2), y: ctrloc}
	        timeLoc = {x: WIDTH/2-centerW-(columnW/2), y: ctrloc-ry(100)}
	        sqLoc = {x: WIDTH/2, y: ctrloc+ry(10)}
	        boxW = IGratio*214
	        boxH = IGratio*620
	    }
	    descLen = IGratio*600
	    descLen2 = 900

	    var bridgebg = IGaddSprite(WIDTH/2,HEIGHT/2+ry(136),'bridge')
	    bridgebg.scale.setTo(IGratio*0.84)


	    // no matter how many items, always default to 6 across
	    var adj = numColumns/2-0.5
	    // var adjy = Math.floor(numSquares/numColumns)/2-0.5
	    // // var adjy = (numSquares/6)/2-0.5
	    corner = sqspacing/2-(IGratio*16)
	    for (var i=0;i<numSquares;i++) {
			var yoff, xoff
	    	if (i<2) {
	    		xoff = (i==0) ? -3.5 : 3.5
	    		yoff = 0.6
	    	} else {
			    xoff = ((i-2)<numColumns) ? (i-2)%numColumns - adj : ((i-2)-numColumns)%numColumns - adj
			    yoff =  ((i-2)<numColumns) ? - 1.5 : 2.7
			}

		    squares[i] = IGaddSprite(sqLoc.x+(xoff*sqspacing),sqLoc.y+(yoff*sqspacing),'room'+i)
		    squares[i].origx = sqLoc.x+(xoff*sqspacing)
		    squares[i].origy = sqLoc.y+(yoff*sqspacing)
		    squares[i].scale.setTo(0.7*IGratio)
		    squares[i].idx = i
		    if (i>1) {
			    squares[i].inputEnabled = true
			    squares[i].input.enableDrag(false,true)
			    squares[i].events.onDragStop.add(BraddLink,this)
			}
		    // squares[i].events.onInputDown.add(BrShowDescription,this)
		    if (!isAndroid & !isiOS) {
			    squares[i].inputEnabled = true
		        squares[i].events.onInputOver.add(CshowName,this)
		        squares[i].events.onInputOut.add(CshowName,this)
		    }
		    checks[i] = IGaddSprite(sqLoc.x+(xoff*sqspacing),sqLoc.y+(yoff*sqspacing),'correct')
		    checks[i].visible = false

		    if (EventType!="WhateverWontWork") {

		        if (isAndroid || isiOS) {
		            var ff = 16//ßMath.ceil(16*IGratio)
		            var tsty = { font: ff+"px Helvetica Neue", fill: "#ffffff", align: "center", wordWrap: true,
		                wordWrapWidth: sqspacing,strokeThickness: 4 }
		            titlestxt[i] = IGaddText(sqLoc.x+(xoff*sqspacing),sqLoc.y+(yoff*sqspacing)+sqspacing/3,titles[i],
		                tsty)
		            IGhide(titlestxt[i],false)
		        } else {
		        	var voff = titles[i].length/15
		        	if (voff>1 & titles[i].length<21) {voff=1}
		        	if (voff>2 && titles[i].length<26) {voff=2}
		            titlestxt[i] = IGaddDivText({xloc:sqLoc.x+(xoff*sqspacing),
		            	yloc:sqLoc.y+(yoff*sqspacing)-sqspacing/2-IGratio*10,
		          	    size:Math.ceil(13*IGratio),text:titles[i],width:sqspacing-4,color:"#000",weight:100, bgcolor: "#fff",
		                })
		            titlestxt[i].idx = i
		            if (titles2[i]) {
		            titlestxt2[i] = IGaddDivText({xloc:sqLoc.x+(xoff*sqspacing),
		            	yloc:sqLoc.y+(yoff*sqspacing)+sqspacing/2,
		          	    size:Math.ceil(13*IGratio),text:titles2[i],width:sqspacing-4,color:"#000",weight:100, bgcolor: "#fff",
		                })
		        	}
		            titlestxt2[i].idx = i
		            titleshade[i] = IGaddSprite(sqLoc.x+(xoff*sqspacing),sqLoc.y+(yoff*sqspacing),'shade')
		            titleshade[i].alpha = 0.75
		            titleshade[i].scale.setTo(IGratio*0.53)
		            IGhide(titleshade[i],true)
		            IGhide(titlestxt2[i],true)
		        }
		    }
		    if (EventType=="Cities" || (EventType=="AlaskanCities") || (EventType=="Science" && clue=="actor")) {
		        helps[i] = null
		    } else {
		        helps[i] = IGaddSprite(sqLoc.x+(xoff*sqspacing)-corner,sqLoc.y+(yoff*sqspacing)+corner,'itemhelp')
		        helps[i].inputEnabled = true
		        helps[i].idx = idxes[i]
		        helps[i].events.onInputDown.add(CshowAltClues,this)
		    }

		    // BenablePhysics(squares[i]);

		}
		bottomEndBr = squares[0]
		topEndBr = squares[1]
		IGconsole("bridge dates: "+evDates[bottomEndBr.idx]+":"+evDates[topEndBr.idx])

		// for (var b=0;b<bridges.length;b++) {
		// 	var xbase = (b<5) ? doneLoc.x : doneLoc2.x
		// 	var ybase = (b<5) ? b : b-5
		// 	bridges[b] = IGaddSprite(xbase,doneLoc.y-10+(ybase*sqspacing),'bridge')
		// 	bridges[b].scale.setTo(0.5)
		// 	IGhide(bridges[b],true)
		// 	bridges2[b] = IGaddSprite(xbase,doneLoc.y-10+(ybase*sqspacing),'bridge_front')
		// 	bridges2[b].scale.setTo(0.5)
		// 	IGhide(bridges2[b],true)
		// }

	    if (preloadBar) {preloadBar.visible = false; preloadBar.destroy()}
	    preloadBar = null
	    notLoaded = false
	    instruct2.setText("")
	    IGstopSpinner()
		IGanalytics(['Bridges', 'Load', EventType]);

		CategoryMsg = (DMMlevel==2) ? "\\n\\nBridges for these images:\n" : "\\n\\nPossible link categories for these images:\n\n"
		if (DMMlevel==2) {
			var arr = _.keys(PoolBridges).sort()
			for (var key=0;key<arr.length;key++) {
				CategoryMsg = CategoryMsg+"\\n"+arr[key]
			}
		} else {CategoryMsg+=BbridgelistFormat()}

		sortedDates = []
		for (var sd=0;sd<evDates.length;sd++) {
			sortedDates.push(evDates[sd])
		}
		sortedDates.sort()
		// set the list of valid topics; argument true means this is the first time
		BrCheckIfDone(true)

		var imsg = "\n\nCreate a bridge of objects from the item on the left to the one on the right. "+
			"Items must be in chronological order. "+
			"\n\nPoints scored for each type of item used (composer, science, art, music) and for each category of link used."+
			"\n\nDrag an item onto the bridge ends to extend the bridge toward the other side. "+
			"\nDate links are a maximum of 20 years."+CategoryMsg+"\n\nDates: "+sortedDates.toString().replace(/,/g,", ")
		if (EventType=="Museum") {imsg += "\n\nIn this Museum topic, 'art' is too large a category and has been excluded."}
		IGalertDIV(imsg,"auto",BrflashHelp(),true,true,14,true)

	    helpTextLocal = "\n\n"+helpTextB[0]
	    for (var i=1; i<8; i++) {helpTextLocal = helpTextLocal + "\n\n"+helpTextB[i]}


		emitter = game.add.emitter(0,0,50)
		emitter.makeParticles('pixel')
		emitter.setYSpeed(-600,600);
		emitter.setXSpeed(-600,600)
		emitter.gravity = 3.0

	},
	update: function() {
		// if (EventIsMoving) {
		// 	movecnt++
		// 	// IGconsole("movingEv: "+movingEv)
		// 	if (squares[movingEv]) {
		// 		if (IGisBlocked(squares[movingEv])) {EventIsMoving=false;IGconsole("blocked")}
		// 		// IGconsole("moving square: "+squares[movingEv].idx)
		// 		squares[movingEv].angle+=BALL_ANGULAR*rotateDirection
		// 		var lastRamp = numRamps-1
		// 		for (var r=0;r<numRamps;r++) {
		// 			if (r==lastRamp) {game.physics.arcade.collide(squares[movingEv],ramps[r],BfloorCollision, null, this);}
		// 			else {game.physics.arcade.collide(squares[movingEv],ramps[r]);}
					
		// 		}
		// 		game.physics.arcade.collide(squares[movingEv],chute, BwallCollision, null, this);
		// 		game.physics.arcade.collide(squares[movingEv],chutel, BwallCollision, null, this);
		// 		game.physics.arcade.collide(squares[movingEv],endBlock, BendCollision, null, this);
		// 		game.physics.arcade.collide(squares[movingEv],endBlockL, BendCollision, null, this);
		// 		// always keep the barrier in the middle to stop runaways
		// 		game.physics.arcade.collide(squares[movingEv],chuteend, BendCollision, null, this);
		// 	}
		// 	// this is an error catcher, if an object didn't stop
		// 	// sometimes happens if a category is too large and they get in the way of each other
		// 	if (movecnt>100) {BendCollision()}
		// 	// don't really need this
		// 	// if (BatEnd(squares[movingEv])) {BendCollision()}
		// } else {movecnt = 0}

	},
	render: function() {
    // game.debug.cameraInfo(game.camera, 32, 32);
    //   // for (var i=0;i<walls.length;i++) {
    //   //   game.debug.geom(w[i],'#8f0a0a')
    //   // }

	},
	shutdown: function() {
		emitter.destroy();emitter = null;
		IGcleanupTexts()

	}

}