/*
-----------------------------------------------------------------------------------------
--
-- select.js
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//
--
-----------------------------------------------------------------------------------------
*/
var CleanupList = []
var iTopics = []

function enter_fullscreen() {
	game.stage.scale.startFullScreen();

}

var game_entry = {
	// 	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, '', { preload: preload, create: create, shutdown: shutdown });
	preload : function() {

		game.transparent = false
		IGwhite = true
		IGsetStage(rgbToHex(0,188,251))
		IGdefineScales()
		IGsetGlobalFunctions()
		DMMSetTopics()

		// fetch the top scores for this alias
		//
		// DMMGetHttpRequest({query: "aliasscores", topic: "aliasscores"},"IGfetchAliasScores")

	    //  Load all the target images -- same image for all spots
	    // for (var top in Topics) {
	    // 	IGconsole("topic in list: "+top)
	   	//     iTopics[top] = CommonPath+'pics/'+Topics[top].toLowerCase()+'_bar.png';
	    // }
	    game.load.image('AppBG',CommonPath+'pics/StringsBG.png')

	},

	create: function() {
//	    IGconsole("in entry create")

		var appbg = IGaddSprite(WIDTH/2,HEIGHT/2,'AppBG')
		appbg.scale.setTo(1.0)

		IGaddDivText({xloc:MIDX, yloc:ry(50),text:"Strings",size:32, color:"#fff",weight:300})



		// topic icons
		var topicCount = 0
		for (var top in Topics) {topicCount++}
		// if only 1 topic, jump right to the game (for partners)
		if (topicCount<2) {
			var top = Object.keys(Topics)
			IGdispatchEvent2(top[0]);
			return;
		}

		var i = 0
   		var sc = (HEIGHT<590) ? HEIGHT/590 : 1.0
		var rowcnt = (topicCount<8) ? 4 : Math.ceil(topicCount/2)
		var midvert = rowcnt/2*65
	    for (var top in Topics) {
	    	// IGconsole("top: "+top)
	    	var xsc = 450*IGratio
	    	var ysc = 77*IGratio*0.9
	    	var xoff = ((i %2)==0) ? MIDX-xsc/2-5 : MIDX+xsc/2+5
	    	var yoff = sc*midvert+Math.floor(i/2)*86*sc
	    	if (topicCount>10) yoff-= 80*sc
	    	var icon = (TopicIcons[top]) ? TopicIcons[top] : TopicIcons[EventType2]
			    selTopics[top] = IGaddDivText({xloc: xoff,yloc:yoff, ifile: iTopics[top], hclass: "topicSelect", 
			    	text: displayTopics[top].replace(/\\n/g,' ').replace(/\n/g,' '),
			    	image: CommonPath+'pics/'+icon,talign: "left",
			    	rtn: 'IGdispatchEvent2("'+Topics[top]+'")', width: xsc, height: ysc});
		    if ((top == "Music") && (DMMalias != "sara") && (DMMalias != "wiwax")) {
		    	selTexts[top].alpha = 0.6
		    }

		    i++;
		}

		// if ((DMMalias=="anonymous") || (DMMalias.indexOf('{')>-1)) {
		// 	IGsetUpAlias("player name\n\n\n\n\n\n")
		// }
	},
	render: function() {
		// game.debug.geom(AppBG,rgbToHex(0,188,251));
	},
	shutdown: function() {
		while (CleanupList.length>0) {CleanupList.pop().destroy()}
		IGcleanupTexts()

	}
}