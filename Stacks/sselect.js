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

		IGtopicSelect(STopics)

	},
	shutdown: function() {
		IGconsole("shutdown called")
		IGcleanupTexts()

	}
}