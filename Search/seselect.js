/*
-----------------------------------------------------------------------------------------
--
-- seselect.js
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

		IGaddDivText({xloc:MIDX, yloc:ry(50),text:"Search",size:32, color:"#fff",weight:300})

		IGtopicSelect(Topics)

	},
	render: function() {
		// game.debug.geom(AppBG,rgbToHex(0,188,251));
	},
	shutdown: function() {
		while (CleanupList.length>0) {CleanupList.pop().destroy()}
		IGcleanupTexts()

	}
}