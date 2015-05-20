////////////////////////////////////////////////////////////
//
// buckets.js
//
// Copyright 2014 IdeateGames
// all rights reserved
//
/////////////////////////////////////////////////////////////

var notLoaded = true

var emitter
var bpmText, IGplayer, cursors, descr, timerText, preloadBar, instruct2, descLen, title,currentCategory,
        hitLoc, timeLoc, descLoc, moreLoc, sqLoc, catLoc, doneLoc, helpTextLocal,clue,altclue, movingEv,
        EventIsMoving, endBlock, endBlockL, CategoryMsg, curCatTxt, 
        bucketList, biggestCategoryCnt, biggestCategory, maxScore,  movecnt, invalidDates
var playerBigCatCnt=0,playerBigCat=0
var rooms = []
var squares = []
var bgcolor = "#dec0e2"
var IGdebug = true
var ORIGsqsize = 120
var sqsize = 120
var sqspacing = 126
// this can change if a small number of events available
var numSquares = 24
// this affects the layout, cannot change
var numColumns = 6
var numRamps = 5
var ievents = []
var titles = []
var titlestxt = []
var titleshade = []
var evDescriptions = []
var evAltClues = []
var evBuckets = []
var evDates = []
var buckets = [{},{},{},{},{},{},{},{},{},{}]
var buckets2 = [{},{},{},{},{},{},{},{},{},{}]
var PoolBucketsAll = {}
var evWorking = []
var idxes = []
var yetToHit = []
var numMistakes = 0
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
var DATE_BUCKET = 20
var DATE_BONUS = 10

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
    IGhide(titlestxt[ev.idx],onoff)
    IGhide(titleshade[ev.idx],onoff)
    ev.hidden = !onoff
}
function BcalcBucketValue(bsize,setsize) {
	// bsize is the bucket size; setsize is the number of items at the start of the bucket
	var scdiv = setsize * 0.5 // after 5 buckets completed, then value is less than bucket size, min 1
	// decided not to use this complicated scoring for now
	var tscore = (DMMlevel==9) ? Math.ceil(points[bsize]*scdiv) : Math.ceil(bsize*scdiv)
	return tscore
}

function BgetAllCategories() {
	var blist = []
	for (var e=0;e<evBuckets.length;e++) {
		for (var b=0;b<evBuckets[e].length;b++) {
			if (!IGisInArray(evBuckets[e][b],blist)) {blist.push(evBuckets[e][b])}
		}
	}
	return _.sortBy(blist, function (i) { return i.toLowerCase(); });
}
function Bbucketlist() {
	bucketList = BgetAllCategories()
	return bucketList
}
function BbucketlistFormat() {
	var CategoryMsg = "\\n"
	if (!bucketList) {bucketList = BgetAllCategories()}
	for (var b=0;b<bucketList.length;b++) {var comma=(b==0)?"":", ";CategoryMsg = CategoryMsg+comma+bucketList[b]}
	return CategoryMsg
}
function BgetBiggestBucket() {
	var tmpbucket = {}
	// dont do date buckets, too wasteful; count them as bonus if player finds them
	// count the possibles in each bucket
	// need to repeat this here because this is iterative
	// after each category is removed
	for (var e=0;e<evBuckets.length;e++) {
		if (!evBuckets[e].counted) {
			for (c=0;c<evBuckets[e].length;c++) {
		    	if (tmpbucket[evBuckets[e][c]]) {
		    		tmpbucket[evBuckets[e][c]]++
	    		} else {
	    			tmpbucket[evBuckets[e][c]] = 1
	    		}
	    	}
	    }
	}
	// now find the largest
	var bb = ""
	var bbcnt = 0
	for (key in tmpbucket) {
		if (tmpbucket[key] > bbcnt) {
			bbcnt = tmpbucket[key]
			bb = key
		}
	}

	return [bb,bbcnt]
}
function BsetCounted(buck) {
	for (var b=0;b<evBuckets.length;b++) {
		if (IGisInArray(buck,evBuckets[b])) {evBuckets[b].counted=true}
	}
}
function BcalcBucketsAll() {
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
	// now find each next largest bucket,
	// calculate its score,
	// then set the members as counted
	for (var bc=0;bc<bucketList.length;bc++) {
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
	var CategoryMsg = "\\n\\nBuckets for the remaining images:\n"
	if (DMMlevel==2) {
		for (key in PoolBuckets) {
			if (PoolBuckets[key]>0) {CategoryMsg = CategoryMsg+"\\n"+key}
		}		
	} else {CategoryMsg+=Bbucketlist().toString().replace(/,/g,", ")}
	
    IGanalytics(['Buckets', 'Categories', EventType]);
	IGalertDIV(CategoryMsg,"auto",false,true,true,13)

}
function CresetGame() {
	bucketList = null
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
    PoolBuckets = {}
    evBuckets = []
    evDates = []
    currentCategory = []
    doneCats = 0
    numLeft = numSquares
    PoolBucketsAll = {}
    PoolBuckets = {}
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
    loadURLExt({'url': '/launch/bindex.html?alias='+DMMalias+"&level="+DMMlevel})
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
    retin1.innerHTML = "<h4>Settings for Buckets</h4><p>&nbsp;</p><p style='font-weight:900;'>Difficulty Level:</p>"+
    	'<input id="option1" type="radio" name="level" value="1"'+check[1]+'/>'+
    	'<label for="option1">&nbsp;Bucket is any common element&nbsp;&nbsp;</label>'+
    	'<br/><input id="option2" type="radio" name="level" value="2"'+check[2]+'/>'+
    	'<label for="option2">&nbsp;Bucket is a single category&nbsp;&nbsp;</label>'
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
	    IGanalytics(['Buckets', 'Settings', EventType]);
		APPsettings({xloc:wid/2+20,yloc:hgt/2+50,width:wid,height:hgt})
		settingsOn = true
	}
}

function CshowScore() {
    IGstopTimer()
    var pen = Ppenalty*numMistakes
    var penmsg = (pen>0) ? " ("+pen+" penalty points)" : ""
	var tot = totalScore
	if (tot<0) {tot = 20}
	// catch the probably impossible condition of ties in the smaller buckets
	if (tot>maxScore) {tot=maxScore}
    var plur = (numMistakes==1) ? "" : "s"
    var misnum = (numMistakes==0) ? "no" : numMistakes
    var didit = "" //(playerBigCatCnt>=biggestCategoryCnt) ? "You did it!\n\n" : ""
    var spm = parseInt(600*numSquares/IGnumSecs)/10
    var pctscore = Math.ceil(100*tot/maxScore) - pen
    if (pctscore<20) {pctscore=20}

    DMMscores.push(pctscore)
    var numgames = (DMMscores.length>=3) ? 3 : DMMscores.length
    IGcalcTotalScore()
        var scoreText = "Your score for this set is "+pctscore+ "."+
        "\n\nYour raw score was "+tot+", and the maximum raw score with these items was "+maxScore+"."+
        "\n\nYou correctly identified "+(numSquares-numMistakes-numLeft)+" "+ObjTypes[EventType2]+"."+
        // "\n\nThat's a rate of "+spm+" "+ObjTypes[EventType2]+" per minute."+
        "\n\nYou made "+misnum+" mistake"+plur+penmsg+"."+
        "\n\n"+didit+"Your biggest bucket was "+playerBigCat+" with "+playerBigCatCnt+" item"+IGplur(playerBigCatCnt)+". "+
        "\nThe biggest bucket possible was "+biggestCategory+" with "+biggestCategoryCnt+" items."+
        "\n\nTo achieve Mastery of "+displayTopics[EventType].replace('\n',' ')+", you need "+IGwizardScores[IGgameApp]+" points from 3 consecutive games. "+
        "You have "+DMMtotalScore+
        " points (total for "+numgames+" game"+IGplur(numgames)+")."
        var userDataMsg = pctscore+":"+tot+":"+maxScore+":"+spm+":"+numMistakes+" (Level "+DMMlevel+")"
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
	PoolBuckets[currentCategory.toString()]--
	return catLoc.x+(tmp*sqspacing)
}
function CremoveCategory() {
	var off=-1
	// var scdiv = (numLeft<3) ? doneCats : doneCats * 0.3
	// // decided not to use this complicated scoring for now
	// thisScore = (DMMlevel==9) ? Math.ceil(points[evWorking.length]/scdiv) : Math.ceil(evWorking.length*5/scdiv)
	thisScore = BcalcBucketValue(evWorking.length,(numLeft+evWorking.length))
	// bonus for date buckets
	thisScore = (currentCategory.length>0) ? thisScore : thisScore+=DATE_BONUS
	totalScore+=thisScore
	if (evWorking.length>playerBigCatCnt) {playerBigCatCnt=evWorking.length;playerBigCat=currentCategory}
	var ecnt = 0
	while (evWorking.length>0) {
		ecnt++
		var tmp = evWorking.pop()
		tmp.inputEnabled = false
		tmp.scale.setTo(0.3)
		var rndy = Math.floor(Math.random()*10)
		var yloc = (ecnt>5) ? ry(10)+rndy : (-1*sqspacing/2)+ry(10)+rndy
		tmp.reset((doneLoc.x-rx(12))+(off++)*10,doneLoc.y+yloc)
		tmp.bringToTop()
	}
	IGhide(buckets[doneCats-1],false)
	IGhide(buckets2[doneCats-1],false)
	buckets2[doneCats-1].bringToTop()
	var plur = (thisScore==1) ? "" : "s"
	var cattxt = (currentCategory.length>0) ? currentCategory.toString() : BmakeDateRange()
	IGaddDivText({xloc:doneLoc.x, yloc:doneLoc.y,text:cattxt+"\\n"+thisScore+" point"+plur,
	    	width:80,size:14,color:'#fff',weight:'100',height:100})
	doneLoc.y += sqspacing
	return false
}
function BcleanupCompleted() {
	EventIsMoving = false
	doneCats++
	// IGconsole("bucket complete: "+currentCategory.toString())
	var cattxt = (currentCategory.length>0) ? currentCategory.toString()+"!" : BmakeDateRange()
	title.setText("Completed bucket "+cattxt)
	catstxt.setText("Buckets built: "+doneCats)
	catstxt2.setText("Buckets built: "+doneCats)
	currentCatLoc = 0
	IGbell.play();
	// IGconsole("done: "+doneCats)
	if (doneCats>5) {
		IGhide(catstxt2,false)
		doneLoc = doneLoc2
	}
	CremoveCategory()
	// must be after the remove
	currentCategory = []
	endBlock = chuteend
	endBlockL = chuteend
	currentDateRange = {low: -1, high: -1}
	invalidDates = false

}
function CcategoryComplete() {
	ret = false
	if (DMMlevel==2) {
		if ((currentCatLoc>10) || (PoolBuckets[currentCategory.toString()]<1)) {
			ret = true
			BcleanupCompleted()
		}
	} else {
		// check all remaining items to see if any fit the current bucket
		// assume none, then break if find 1
		ret = true
		for (var e=0;e<evBuckets.length;e++) {
			if (!squares[e].done) {
				// IGconsole("remaining intersect: "+IGintersect(evBuckets[e],currentCategory))
				if (IGintersect(evBuckets[e],currentCategory)[0]) {ret=false;break}
				// now check if there are any dates within range, but only if no other buckets
				if (!invalidDates) {
					if (BdetermineDateBucket(squares[e],true)) {ret=false;IGconsole("date found: "+evDates[e]);break}
				}
			}
		}
		if (ret) {
			BcleanupCompleted()
		}
	}
	if ((numLeft < 1) || (doneCats>9)) {
		CshowScore()
	}
	return ret
}
var toExplode
function CeventExplode(ev) {
	ev = toExplode
	IGbang.play();
			emitter.x = ev.x;
			emitter.y = ev.y;
			emitter.start(true,2000,null,50)
	IGhide(ev,true)
	IGhide(titlestxt[ev.idx],true)
	IGhide(titleshade[ev.idx],true)
	if (helps[ev.idx]) {IGhide(helps[ev.idx],true)}
	// one fewer in this category for next time
	PoolBuckets[evBuckets[ev.idx][0]]--
	numMistakes++
}
function BwallCollision() {
	IGtick.play();
	rotateDirection = 0
	if (squares[movingEv]) {squares[movingEv].body.velocity.x = 0;}
	return true
}
var thisCatLoc
function BatEnd(ev) {
	if ((ev.y>catLoc.y-20) && (ev.x < thisCatLoc+4*sqspacing)) {
		ev.reset(thisCatLoc,catLoc.y)
		BendCollision()
	}
}
function BendCollision() {
	rotateDirection = 0
	nextDirection = nextDirection*-1
	if (EventIsMoving && squares[movingEv]) {
		if (nextDirection>0) {
			endBlock = squares[movingEv];
		} else {
			endBlockL = squares[movingEv];
		}
		IGtick.play();
		squares[movingEv].body.velocity.x = 0;
		squares[movingEv].body.velocity.y = 0;
		squares[movingEv].body.mass = 0;
		squares[movingEv].body.immovable = true;
		squares[movingEv].body.gravity.y = 0;
		titlestxt[movingEv].reset(squares[movingEv].x-5,squares[movingEv].y)
		if (titleshade[movingEv]) {
			titleshade[movingEv].reset(squares[movingEv].x-5,squares[movingEv].y)
			IGhide(titleshade[movingEv],true)
		}
		IGhide(titlestxt[movingEv],true)
	}
	EventIsMoving = false
	CcategoryComplete()
}
function BfloorCollision() {
	if (!squares[movingEv].atFloor) {
			IGtick.play();
		squares[movingEv].atFloor = true
		rotateDirection = nextDirection*-1
		if (squares[movingEv]) {squares[movingEv].body.velocity.x = rotateDirection*BALL_SPEED;}
	}
	return true
}
function Croll(ev) {
	// for the alternating row version
	nextDirection = ev.direction
	BenablePhysics(ev);
	ev.body.immovable = false;
	ev.body.gravity.y = GLOBAL_GRAVITY;
	ev.body.velocity.x = nextDirection*BALL_SPEED;
	ev.body.velocity.y = 400;
	rotateDirection = nextDirection
	// ev.body.angularDamping= .9;
 //    ev.body.angularForce= 99;
    movingEv = ev.idx;
    EventIsMoving = true;
	// ev.body.velocity.x = 35;
	// ev.body.moveRight(300);
	// ev.reset(xloc,yloc)

}
function CdropToPoint(ev,xloc,yloc) {
	ev.reset(xloc,yloc)
}
function CaddToCategoryDiv(arg) {
    CaddToCategory(squares[parseInt(arg)])
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
// bucket, not the actual allowable range
// but we calculate the range from this low and high
// the range is from DATE_BUCKET below the high to DATE_BUCKET above the low
var currentDateRange = {low: -1, high: -1}
var currentDateString = ""
function BdetermineDateBucket(ev,checkonly) {
	var ret = ""
	// just be sure it's not a string
	var evdat = parseInt(evDates[ev.idx])
	if (checkonly) {
		ret = ((evdat <= currentDateRange.low+DATE_BUCKET) && (evdat >= currentDateRange.high-DATE_BUCKET))
	} else {
		if (currentDateRange.low <0) {currentDateRange.low = evdat}
		if (currentDateRange.high <0) {currentDateRange.high = evdat}
		if ((evdat <= currentDateRange.low+DATE_BUCKET) && (evdat >= currentDateRange.high-DATE_BUCKET)) {
			// reset the date range
			// range is a max of DATE_BUCKET
				// this means the range can get higher
				if (evdat > currentDateRange.high) {currentDateRange.high = evdat}
				if (evdat < currentDateRange.low) {currentDateRange.low = evdat}
			ret = (currentDateRange.high-DATE_BUCKET)+" - "+(currentDateRange.low+DATE_BUCKET)
			currentDateString = ret
		}
		// IGconsole("date test: "+currentDateRange.low+":"+currentDateRange.high+":"+evdat+":"+ret)
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
	return (ret[0]) ? ret : false
}
function BdetermineJointCategory(ev) {
	var ret = evBuckets[ev.idx]
	if (DMMlevel!=2) {
		if (evWorking.length<1) {
			ret = evBuckets[ev.idx]
		} else {
			ret = BfindIntersection(currentCategory,evBuckets[ev.idx])
		}
	} else {
		if (currentCategory[0]) {
			ret = (evBuckets[ev.idx][0]!=currentCategory[0]) ? false : currentCategory
		} else ret = [evBuckets[ev.idx][0]]
	}
	return ret
}
function CaddToCategory(ev) {
	ev.done = true
    if (!IGtimerFlag) {IGstartTimer()}
    if (!EventIsMoving) {
		var dattxt = ""
		if (!invalidDates) {dattxt=BdetermineDateBucket(ev)}
		// IGconsole("dattxt: "+dattxt)
    	var newcat = BdetermineJointCategory(ev)
		if (!newcat && !dattxt) {
			toExplode = ev;
			var txt = (titlestxt[ev.idx].innerHTML) ? titlestxt[ev.idx].innerHTML : titlestxt[ev.idx].text
			if (DMMlevel!=2) {
				IGalertDIV("\n\nThis "+ObjTypes[EventType2].substring(0,ObjTypes[EventType2].length-1)+
					" is in a different bucket.\n\n"+txt+" could be in buckets "+evBuckets[ev.idx].toString()+", "+evDates[ev.idx]+".",
					"auto",CeventExplode,true,true,16)
			} else {
				IGalertDIV("\n\nThis "+ObjTypes[EventType2].substring(0,ObjTypes[EventType2].length-1)+
					" is in a different bucket.\n\n"+txt+" is in bucket "+evBuckets[ev.idx][0].substring(0,1).toUpperCase()+
					evBuckets[ev.idx][0].substring(1)+", "+evDates[ev.idx]+".",
					"auto",CeventExplode,true,true,16)

			}
			// CeventExplode(ev)
		} else {
			// one last check for date bucket
			currentCategory = (newcat) ? newcat : []
			if (!dattxt) {invalidDates = true}
			var cattxt = (currentCategory.length>0 && dattxt) ? currentCategory.toString() + ", " : currentCategory.toString()
			curCatTxt.setText(currentCategory.toString()+dattxt)
			if (currentCatLoc==0) {IGalertDIV("\n\nBucket is now "+cattxt + dattxt,
				"auto",BflashTitle,true,true,24)}
			title.setText("Building bucket "+cattxt+dattxt)
			evWorking.push(ev)
			// return if catetory is complete
			var xloc = CnextCatLoc()
			thisCatLoc = xloc
			// IGconsole("adding: "+ev.idx+":"+xloc+":"+catLoc.y)
			Croll(ev);
			// CdropToPoint(ev,catLoc.y)
			// CrollToPoint(ev,"ccw",xloc,catLoc.y)
			// ev.reset(xloc,catLoc.y)
			if (helps[ev.idx]) {IGhide(helps[ev.idx],true)}
		}
		numLeft--
	}

}
function CeventIsOK(idx) {
	return !IGisInArray(idx,idxes)
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
	game.load.image('ramp', CommonPath+'pics/ramp.png')
	game.load.image('chute', CommonPath+'pics/chute.png')
	game.load.image('chuteend', CommonPath+'pics/chuteend.png')
	game.load.image('bucket', CommonPath+'pics/bucket.png')
	game.load.image('bucket_front', CommonPath+'pics/bucket_front.png')
	game.load.image('chutewood', CommonPath+'pics/ChuteGrass4.png')


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

	    title = IGaddDivText({xloc:game.world.centerX, yloc:topRow,text:Subjects[EventType2].replace("Strings","Buckets"),
	    	width:rx(440),size:18,color:'#6a6a6a',bgcolor: "#fff",weight:'400',height:50})
	    curCatTxt = IGaddDivText({xloc:msgLoc.x, yloc:msgLoc.y,text:"",
	    	width:500,size:24,color:'#0000ff',weight:'900',height:50})
	    IGhide(curCatTxt,true)

	    catstxt = IGaddDivText({xloc:doneLoc.x, yloc:doneLoc.y-(0.7*sqspacing),text:"Buckets built: 0",
	    	width:120,size:16,color:'#333',weight:'400',height:50, bgcolor: "#fff"})
	    catstxt2 = IGaddDivText({xloc:doneLoc2.x, yloc:doneLoc.y-(0.7*sqspacing),text:"Buckets built: 0",
	    	width:120,size:16,color:'#333',weight:'400',height:50, bgcolor: "#fff"})
	    IGhide(catstxt2,true)


    	var tt = IGaddDivText({xloc:doneLoc.x,yloc:topRow+ry(30),text:"Time"})
    	IGhide(tt,true)
    	IGtnumSecs = IGaddDivText({xloc:doneLoc.x+rx(50),yloc:topRow+ry(30),text:"0"})
    	IGhide(IGtnumSecs,true)

	 	catBtn = IGaddDivButton({xloc:catLoc.x,yloc:catLoc.y, text: "Buckets",rtnf: 'BshowCategories'})
	 	settingsBtn = IGaddDivButton({xloc:setLoc.x,yloc:setLoc.y,rtnf: 'BgetSettings', 
	 		hclass: 'fa fa-cog'})
	 	IGaddDivButton({xloc:setLoc.x+122,yloc:catLoc.y, text: "Close Bucket",rtnf: 'BcleanupCompleted'})

	    clue = 'description'
	    altclue = 'objects'
	    titleclue = 'actor'
	    switch (EventType) {
	        case 'Museum':
	            clue = 'objects'
	            altclue = 'description'
	            var ch = Math.floor(Math.random()*2)
	            switch (ch) {
	                case 0:
	                    clue = "description";
	                    altclue = "objects"
	                    break;
	                case 1:
	                    clue = 'objects';
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
	            switch (ch) {
	            	case 0:
	                    clue = 'location';
	                    altclue = "description"
	                    titleclue = 'image'
	                    break;
	                case 1:
	                    clue = "description";
	                    altclue = "objects"
	                    titleclue = 'image'
	                    break;
	                case 2:
	                    clue = 'actor';
	                    altclue = "description"
	                    titleclue = 'image'
	                    break;
	                case 3:
	                    clue = 'objects';
	                    altclue = "description"
	                    titleclue = 'actor'
	                    break;
	            }
	            break;
	        case 'Literature':
	            var ch = Math.floor(Math.random()*3)
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
	                    clue = 'objects';
	                    altclue = "description"
	                    break;
	            }
	            clue = 'objects'
	            break;
	        case 'Art':
	            var ch = Math.floor(Math.random()*4)
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
	                    clue = 'objects';
	                    altclue = "description"
	                    break;
	                case 3:
	                    clue = 'objects';
	                    altclue = "description"
	                    break;
	            }
	            break;
	        case 'Culture':
	            clue = 'objects'
	            altclue = "description"
	            break;
	        case 'Composers':
	            clue = 'objects'
	            altclue = "description"
	            var ch = Math.floor(Math.random()*3)
	            if (ch>1) {clue = "description";altclue = "objects"};
	            break;
	        case 'Movies':
	            clue = 'objects'
	            altclue = "description"
	            var ch = Math.floor(Math.random()*3)
	            if (ch>0) {clue = "description";altclue = "objects"};
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
	    // must be 5 or fewer buckets
	    // no duplicates (of course)
	    // 
	    // catch when database not full yet, mostly for testing
	    if (numSquares>EventNum) {numSquares=EventNum;numLeft=numSquares}

	    for (var i=0;i<numSquares;i++) {
	        var r = Math.floor(Math.random()*(EventNum))
	        while (!CeventIsOK(r)) {
	            r = Math.floor(Math.random()*(EventNum))
	        }
	        idxes[i] = r
	        var pos = EventVars[EventType][r].image.lastIndexOf('.')
	        var iname = EventVars[EventType][r].image.substr(0,pos)
	        var iname2 = iname.replace(/ /g,"_").replace(/,/g,"_")
	        game.load.image('room'+i, ImgPath+IGimgPath+'/'+iname2+'.png');
	        game.load.image('bigroom'+i, ImgPath+'large/'+iname2+'.png');
	        iimgs[i] = 'bigroom'+i
	        iimgstxt[i] = 'Image Credit: '+EventVars[EventType][r].URL
	        if ((EventType=="Cities") || (EventType=="AlaskanCities")) {titles[i] = EventVars[EventType][r].description}
	        else if (titleclue=="image") {
	            titles[i] = EventVars[EventType][r].image.substr(0,pos).replace('01','').replace(/_/g," ").trim()
	        } else {titles[i] = EventVars[EventType][r][titleclue].trim()}
	        // evAltClues[i] = EventVars[EventType][r][altclue]
	        // set up the buckets

	        if (DMMlevel<3) {
	        	// level 3 is dates only
		        var cat = []
		    	var tmpcat = EventVars[EventType][r].category.toLowerCase().split(',')
		    	if ((EventType!="Cities") && (EventType!="AlaskanCities")) 
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
		    	evBuckets[i] = cat
		    	if (PoolBuckets[cat[0]]) {
		    		PoolBuckets[cat[0]]++
		    	} else {
		    		PoolBuckets[cat[0]] = 1
		    	}
		    	for (c=0;c<cat.length;c++) {
			    	if (PoolBucketsAll[cat[c]]) {
			    		PoolBucketsAll[cat[c]]++
			    	} else {
			    		PoolBucketsAll[cat[c]] = 1
			    	}
		    	}
		    }
	    	// don't want dates in the general categories
	    	// but save as numbers for the range
	    	evDates[i] = parseInt(EventVars[EventType][r].date)
	    	// // push the string version
	    	// evBuckets[i].push(EventVars[EventType][r].date)

		}
		biggestCategoryCnt = 0
		biggestCategory = ""

		for (key in PoolBucketsAll) {
			if (PoolBucketsAll[key] > biggestCategoryCnt) {
				biggestCategoryCnt = PoolBucketsAll[key]
				biggestCategory = key
			}
		}
		IGconsole("biggest: "+biggestCategory+":"+biggestCategoryCnt)

		Bbucketlist() // creates bucketList used in next function
		BcalcBucketsAll()

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

		game.physics.startSystem(Phaser.Physics.ARCADE);
    	// game.physics.arcade.gravity.y = GLOBAL_GRAVITY;

    	// must be a whole number for alignment with the ramps
	    var adjy = Math.floor(numSquares/numColumns)/2-0.5
		chute = IGaddSprite(WIDTH/2+centerW+IGratio*210,ctrloc+IGratio*90,'chute')
		game.physics.arcade.enable(chute);
		chute.body.allowGravity = false;
		chute.body.immovable = true;
		chutel = IGaddSprite(WIDTH/2-centerW-IGratio*210,ctrloc+IGratio*90,'chute')
		game.physics.arcade.enable(chutel);
		chutel.body.allowGravity = false;
		chutel.body.immovable = true;

		numRamps = Math.ceil(numSquares/numColumns)+1
		var lastRamp = numRamps-1
		for (var r=0;r<numRamps;r++) {
			var yloc = (r<lastRamp) ? ctrloc+((r-adjy)*sqspacing)+sqspacing/2+IGratio*10 : ctrloc+centerW+ry(132)
			var xloc = (r<lastRamp) ? WIDTH/2 : WIDTH/2+IGratio*5
			ramps[r] = IGaddSprite(xloc,yloc,'ramp')
			if (r<lastRamp) {ramps[r].scale.setTo(0.9*IGratio,1.0)} else {ramps[r].scale.setTo(1.2*IGratio,1.0)}
			// ramps[r].angle = (r<4) ? 1 : -1;

			game.physics.arcade.enable(ramps[r]);
			ramps[r].body.allowGravity = false;
			ramps[r].body.mass = 10;
			ramps[r].body.immovable = true;
			ramps[r].body.collideWorldBounds = true;
		}
		chuteend = IGaddSprite(WIDTH/2,ctrloc+centerW+IGratio*80,'chuteend')//centerW-IGratio*214
		game.physics.arcade.enable(chuteend);
		chuteend.body.allowGravity = false;
		chuteend.body.immovable = true;
		endBlock = chuteend;
		endBlockL = chuteend;

	    var woodbg2 = IGaddSprite(WIDTH/2,ctrloc+IGratio*70,'chutewood')
	    woodbg2.scale.setTo(IGratio,1.025*IGratio)

	    // put out the events
	    // use a 6 x 4 rectangle

	    // no matter how many items, always default to 6 across
	    var adj = numColumns/2-0.5
	    // var adjy = (numSquares/6)/2-0.5
	    var corner = sqspacing/2-(IGratio*16)
	    for (var i=0;i<numSquares;i++) {
		    var xoff = (i)%numColumns - adj
		    var yoff = Math.floor((i)/numColumns) - adjy
		    squares[i] = IGaddSprite(sqLoc.x+(xoff*sqspacing),sqLoc.y+(yoff*sqspacing),'room'+i)
		    squares[i].scale.setTo(0.7*IGratio)
		    squares[i].idx = i
		    squares[i].inputEnabled = true
		    squares[i].direction = (i<6 || (i>11 && i<18)) ? 1 : -1
		    squares[i].events.onInputDown.add(CaddToCategory,this)
		    if (!isAndroid & !isiOS) {
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
		            	yloc:sqLoc.y+(yoff*sqspacing)-IGratio*(8+voff*15),
		          	    size:Math.ceil(17*IGratio),text:titles[i],width:0.75*sqspacing,color:"#fff",weight:100,
		                rtn: "CaddToCategoryDiv", arg: i.toString()})
		            titlestxt[i].idx = i
		            titleshade[i] = IGaddSprite(sqLoc.x+(xoff*sqspacing),sqLoc.y+(yoff*sqspacing),'shade')
		            titleshade[i].alpha = 0.75
		            titleshade[i].scale.setTo(IGratio*0.53)
		            IGhide(titleshade[i],true)
		            IGhide(titlestxt[i],true)
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

		for (var b=0;b<buckets.length;b++) {
			var xbase = (b<5) ? doneLoc.x : doneLoc2.x
			var ybase = (b<5) ? b : b-5
			buckets[b] = IGaddSprite(xbase,doneLoc.y-10+(ybase*sqspacing),'bucket')
			buckets[b].scale.setTo(0.5)
			IGhide(buckets[b],true)
			buckets2[b] = IGaddSprite(xbase,doneLoc.y-10+(ybase*sqspacing),'bucket_front')
			buckets2[b].scale.setTo(0.5)
			IGhide(buckets2[b],true)
		}

	    if (preloadBar) {preloadBar.visible = false; preloadBar.destroy()}
	    preloadBar = null
	    notLoaded = false
	    instruct2.setText("")
	    IGstopSpinner()
		IGanalytics(['Buckets', 'Load', EventType]);

		CategoryMsg = (DMMlevel==2) ? "\\n\\nBuckets for these images:\n" : "\\n\\nPossible buckets for these images:\n"
		if (DMMlevel==2) {
			var arr = _.keys(PoolBuckets).sort()
			for (var key=0;key<arr.length;key++) {
				CategoryMsg = CategoryMsg+"\\n"+arr[key]
			}
		} else {CategoryMsg+=BbucketlistFormat()}

		var imsg = "\n\nCreate buckets of objects in the same category.\n\nTap objects to "+
			"fill a bucket.\n\nOnce started, you must fill or close the bucket before starting a different bucket!"+
			"\nDate buckets are a maximum of 20 years end-to-end."+CategoryMsg
		if (EventType=="Museum") {imsg += "\n\nIn this Museum topic, 'art' is too large a category and has been excluded."}

	    var dbsiz = "\n\n\n"+numSquares+" "+ObjTypes[EventType2]+" selected from "+EventNum+" in "+displayTopics[EventType2]+"."

		IGalertDIV(imsg+dbsiz,"auto",false,true,true,14,true)

	    helpTextLocal = "\n\n"+helpTextB[0]
	    for (var i=1; i<8; i++) {helpTextLocal = helpTextLocal + "\n\n"+helpTextB[i]}


		emitter = game.add.emitter(0,0,50)
		emitter.makeParticles('pixel')
		emitter.setYSpeed(-600,600);
		emitter.setXSpeed(-600,600)
		emitter.gravity = 3.0

	},
	update: function() {
		if (EventIsMoving) {
			movecnt++
			// IGconsole("movingEv: "+movingEv)
			if (squares[movingEv]) {
				if (IGisBlocked(squares[movingEv])) {EventIsMoving=false;IGconsole("blocked")}
				// IGconsole("moving square: "+squares[movingEv].idx)
				squares[movingEv].angle+=BALL_ANGULAR*rotateDirection
				var lastRamp = numRamps-1
				for (var r=0;r<numRamps;r++) {
					if (r==lastRamp) {game.physics.arcade.collide(squares[movingEv],ramps[r],BfloorCollision, null, this);}
					else {game.physics.arcade.collide(squares[movingEv],ramps[r]);}
					
				}
				game.physics.arcade.collide(squares[movingEv],chute, BwallCollision, null, this);
				game.physics.arcade.collide(squares[movingEv],chutel, BwallCollision, null, this);
				game.physics.arcade.collide(squares[movingEv],endBlock, BendCollision, null, this);
				game.physics.arcade.collide(squares[movingEv],endBlockL, BendCollision, null, this);
				// always keep the barrier in the middle to stop runaways
				game.physics.arcade.collide(squares[movingEv],chuteend, BendCollision, null, this);
			}
			// this is an error catcher, if an object didn't stop
			// sometimes happens if a category is too large and they get in the way of each other
			if (movecnt>100) {BendCollision()}
			// don't really need this
			// if (BatEnd(squares[movingEv])) {BendCollision()}
		} else {movecnt = 0}

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