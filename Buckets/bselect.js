/*
-----------------------------------------------------------------------------------------
--
-- bselect.js
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//
-----------------------------------------------------------------------------------------
*/

var head = []
var instr = []
var iTopics = []
var passwordBox
dispatchGame = function() {
	// for now, same code
	var selpath = (DMMlevel == 1) ? 'entry' : 'entry'
	game.state.start(selpath,true,true)
}

dispatchEvent2 = function(topic) {
    IGaddMenuBar(WIDTH/2+IGxratio*436)
	IGstartSpinner()

	EventType = topic

	$.getScript(CommonPath+"js/"+EventType+"_data.js", function(data, textStatus) {
	  // IGconsole(data); //data returned
	  IGconsole("file load: "+textStatus); //success
	  window.setTimeout(dispatchGame,100)
	});

	    // DMMGetHttpRequest({query: "getTopicFull"},"getTopicFull")

	    // function partB() {
	    // 	if (IGactiveComm) {
	    // 		window.setTimeout(partB,700)
	    // 	} else {console.log("dispatching game"); window.setTimeout(dispatchGame,1000)}

	    // }
	    // // the timeout is to be sure that the initial fetch of data above 
	    // // is completed before drawing the screen. 
	    // // Eventually, we will put a subject choice screen first, but this
	    // // is needed for now.
	    // window.setTimeout(partB,500)
}
function preAddAlias() {
	IGdismissTextBox(IGtextBoxSprite)
}
function addAlias() {
	// IGgamePWD = IGgamePWDSprite.content
	console.log("pwd: "+IGgamePWD)
	IGgamePWDSprite.destroy(); IGgamePWDSprite = null
	passwordBox.destroy(); passwordBox = null
}
var sloc // set durint init
function PWsetLevel(btn) {
	DMMlevel = btn.level
	var xloc = sloc[btn.level].x
	var yloc = sloc[btn.level].y
	lButtonSel.x = xloc
	lButtonSel.y = yloc

	if (DMMlevel == 3) {
		IGtextBox(btn.txt,addAlias)
		passwordBox = IGaddSprite(WIDTH/2,ry(140),'pwdbox')
		passwordBox.anchor.setTo(0.5,0.5)
		passwordBox.inputEnabled = true

		IGgamePWDSprite = IGaddText(WIDTH/2,ry(140),IGgamePWD,tstyle2)
		IGgamePWDSprite.anchor.setTo(0.5,0.5)
	    // kb.onDown.add(isTyping,this)

	}
}
function PWsetSkill(btn) {
	DMMcompLevel = btn.level
	var xloc = csloc[btn.level].x
	var yloc = csloc[btn.level].y
	sButtonSel.x = xloc
	sButtonSel.y = yloc
}

var bucketsSelect = {
	// 	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, '', { preload: preload, create: create, shutdown: shutdown });
	preload : function() {

		IGwhite = true

		IGsetStage(rgbToHex(155,233,96))
		IGdefineScales()
		IGsetGlobalFunctions()
		DMMSetTopics()

		sloc = { 1: {x: 5*WIDTH/6+rx(10), y: HEIGHT/3}, 2: {x: 5*WIDTH/6+rx(10), y: HEIGHT/3+ry(50)},
			3: {x: 5*WIDTH/6+rx(10), y: HEIGHT/3+ry(100)} }
		csloc = { 1: {x: rx(50), y: HEIGHT/3}, 2: {x: rx(50), y: HEIGHT/3+ry(50)},
			3: {x: rx(50), y: HEIGHT/3+ry(100)},
			4: {x: rx(50), y: HEIGHT/3+ry(150)},
			5: {x: rx(50), y: HEIGHT/3+ry(200)},
			 }

	    //  Load all the target images -- same image for all spots
	    // for (var top in Topics) {
	   	//     iTopics[top] = '/init/static/IG/common/pics/'+Topics[top].toLowerCase()+'_bar.png';
	    // }
	    game.load.image('AppBG',CommonPath+'pics/BucketsBG.png')

	},

	create: function() {
//	    console.log("in entry create")
		var appbg = IGaddSprite(WIDTH/2,HEIGHT/2,'AppBG')
		appbg.scale.setTo(1.0)

		// instructions
		// var hstyle = { font: "bold 14px Arial", fill: "#ffffff", align: "right", strokeThickness: 10};
		// var hstyle2 = { font: "18px Arial", fill: "#ffffff", align: "right", strokeThickness: 10};
		// var tstyle = { font: "14px Arial", fill: "#aaccaa", align: "center", wordWrap: true,
  //   		wordWrapWidth: instrWidth };

		IGaddDivText({xloc:MIDX, yloc:ry(50),text:"Buckets",size:32, color:"#fff",weight:300})

		// var backT = IGaddText(rx(40),ry(50),"<",hugesty)
		// var backB = IGaddSprite(rx(40),ry(50),'tbutton')
		// backB.inputEnabled = true
		// backB.targ = "buckets"
		// backB.events.onInputDown.add(IGexit,this)

		// topic icons
		var topicCount = 0
		for (var top in Topics) {topicCount++}
		var i = 0
		// if only 1 topic, jump right to the game (for partners)
		if (topicCount<2) {
			var top = Object.keys(Topics)
			dispatchEvent2(top[0]);
			return;
		}

   		var sc = (HEIGHT<590) ? HEIGHT/590 : 1.0
		var rowcnt = (topicCount<8) ? 4 : Math.ceil(topicCount/2)
		var midvert = rowcnt/2*65
	    for (var top in Topics) {
	    	// because buckets uses a higher base, only shrink with width
	    	var xsc = 450*IGratio
	    	var ysc = 77*IGxratio*0.9
	    	var xoff = ((i %2)==0) ? MIDX-xsc/2-5 : MIDX+xsc/2+5
	    	var yoff = sc*midvert+Math.floor(i/2)*86*sc
	    	var icon = (TopicIcons[top]) ? TopicIcons[top] : TopicIcons[EventType2]
			    selTopics[top] = IGaddDivText({xloc: xoff,yloc:yoff, ifile: iTopics[top], hclass: "topicSelect", 
			    	text: displayTopics[top].replace(/\\n/g,' ').replace(/\n/g,' '),
			    	image: CommonPath+'pics/'+icon,talign: "left",
			    	rtn: 'dispatchEvent2("'+Topics[top]+'")', width: xsc, height: ysc});

			    i++;
		}

	},
	shutdown: function() {
		console.log("shutdown called")
		IGcleanupTexts()

	}
}