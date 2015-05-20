/*
-----------------------------------------------------------------------------------------
--
-- sselect.js
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

dispatchGame = function() {
	game.state.start('stacks',true,true)
}

IGdispatchEvent2 = function(topic) {
if (!IGgameDiv) {IGgameDiv = document.getElementById('game');}
IGspinner = new Spinner(IGspinOpts).spin();
IGgameDiv.appendChild(IGspinner.el);

    IGaddMenuBar(WIDTH/2+IGratio*304+IGxratio*123)
	EventType = topic

	$.getScript(CommonPath+'js/'+EventType+"_data.js", function(data, textStatus) {
	  // IGconsole(data); //data returned
	  IGconsole("file load: "+textStatus); //success
	  window.setTimeout(dispatchGame,100)
	});

	    // DMMGetHttpRequest({query: "getTopicFull"},"getTopicFull")

	    // function partB() {
	    // 	if (IGactiveComm) {
	    // 		window.setTimeout(partB,700)
	    // 	} else {IGconsole("dispatching game"); window.setTimeout(dispatchGame,1000)}

	    // }
	    // // the timeout is to be sure that the initial fetch of data above 
	    // // is completed before drawing the screen. 
	    // // Eventually, we will put a subject choice screen first, but this
	    // // is needed for now.
	    // window.setTimeout(partB,500)
}
var sloc // set durint init
function PWsetLevel(btn) {
	DMMlevel = btn.level
	var xloc = sloc[btn.level].x
	var yloc = sloc[btn.level].y
	lButtonSel.x = xloc
	lButtonSel.y = yloc
	for (var i=0;i<8;i++) {
		head[i].setText(hText2[i])
		instr[i].setText(helpTextS[DMMlevel][i])
	}
}

var pathsSelect = {
	// 	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, '', { preload: preload, create: create, shutdown: shutdown });
	preload : function() {

		IGsetStage(rgbToHex(238,91,92))
		IGdefineScales()
		IGsetGlobalFunctions()
		DMMSetTopics()
		// IGcheckIn(DMMalias,clientIP)

		game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')

		sloc = { 1: {x: 5*WIDTH/6+rx(20), y: HEIGHT/3}, 2: {x: 5*WIDTH/6+rx(20), y: HEIGHT/3+ry(30)} }

		// fetch the top scores for this alias
		//
		// DMMGetHttpRequest({query: "aliasscores", topic: "aliasscores"},"IGfetchAliasScores")

	    game.load.audio('click', [CommonPath+'sounds/Effect_Click.mp3', CommonPath+'sounds/Effect_Click.ogg']);
	    music = game.add.audio('click');

	    //  Load all the target images -- same image for all spots
	    // for (var top in STopics) {
	   	//     iTopics[top] = CommonPath+'pics/'+Topics[top].toLowerCase()+'_bar.png';
	    // }
	    game.load.image('AppBG',CommonPath+'pics/StacksBG.png')
	},

	create: function() {
//	    IGconsole("in entry create")
		var appbg = IGaddSprite(WIDTH/2,HEIGHT/2,'AppBG')
		appbg.scale.setTo(1.0)

		IGaddDivText({xloc:MIDX, yloc:ry(50),text:"Rooms",size:32, color:"#fff",weight:300})

		// topic icons
		var topicCount = 0
		for (var top in STopics) {topicCount++}
		// if only 1 topic, jump right to the game (for partners)
		if (topicCount<2) {
			var top = Object.keys(STopics)
			IGdispatchEvent2(top[0]);
			return;
		}

		var i = 0
   		var sc = (HEIGHT<590) ? HEIGHT/590 : 1.0
		var rowcnt = (topicCount<8) ? 4 : Math.ceil(topicCount/2)
		var midvert = rowcnt/2*65
	    for (var top in STopics) {
	    	var xsc = 450*IGratio
	    	var ysc = 77*IGratio*0.9
	    	var xoff = ((i %2)==0) ? MIDX-xsc/2-5 : MIDX+xsc/2+5
	    	var yoff = sc*midvert+Math.floor(i/2)*86*sc
	    	var icon = (TopicIcons[top]) ? TopicIcons[top] : TopicIcons[EventType2]
			    selTopics[top] = IGaddDivText({xloc: xoff,yloc:yoff, ifile: iTopics[top], hclass: "topicSelect", 
			    	text: displayTopics[top].replace(/\\n/g,' ').replace(/\n/g,' '),
			    	image: CommonPath+'pics/'+icon,talign: "left",
			    	rtn: 'IGdispatchEvent2("'+Topics[top]+'")', width: xsc, height: ysc});

			    i++;
		}
		// if ((DMMalias=="anonymous") || (DMMalias.indexOf('{')>-1)) {
		// 	IGsetUpAlias("player name\n\n\n\n\n\n")
		// }

	},
	shutdown: function() {
		IGconsole("shutdown called")
		IGcleanupTexts()

	}
}