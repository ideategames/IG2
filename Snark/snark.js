////////////////////////////////////////////////////////////
//
// snark.js
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//
/////////////////////////////////////////////////////////////
var gameEntry = {
	preload: function() {
		APPgameReset()
	    notLoaded = true

		// DMMSetTopics()
	    DMMgameReset()
	    game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')

	    setLoc = {x:WIDTH-200,y:200}
	    setWid = 300
	    setHgt = 250
	    resLoc = {x:140,y:150}

	    var ff = Math.ceil(rx(17))
	    var tsty = { font: "bold "+ff+"px Arial", fill: "#000", align: "center", wordWrap: true,
	        wordWrapWidth: 600 };
	    instruct2 = IGaddText(WIDTH/2, HEIGHT - ry(80), "Loading...",tsty);

	    IGnumSecs = 0
	    numMistakes = 0
	    // parameter tells it to register user
	    IGsetGlobalFunctions(true)
	    IGsetStage('#000000')
	    IGdefineScales()

	    game.load.image(triimg, AppPath + 'images/radiaspis.png')
	    iimgs[0] = triimg
	    iimgstxt = [""]
	    bigImageCredit = {}


	    helpTextLocal = "\n\nThere are 5 different biomes in this game, each with a different population, each managed by a different player. "+
	    	"\n\nEach round ends when all but one population become extinct."+
	    	"\n\nAt the end of each round, each player receives 3 ratings: \n\tnumber of generations,"+
	    	"\n\tnumber of losses,\n\tefficiency of resource use."+
	    	"\n\nThe winner is the first player to be best (at the end of a game) at least once in each of those ratings."+
	    	"\n\nHints: Biomass is restricted by water availability, large animals need some prey, and all animals need fruit and shelter. "+
	    	"You begin with 10 animals."
	},
	// loadUpdate: function() {
 //        if (notLoaded) {
 //            if (preloadBar) {preloadBar.destroy(); preloadBar = null}
 //            preloadBar = game.add.sprite(WIDTH/2, HEIGHT-ry(36), 'preloaderBar');
 //            if (preloadBar.getLocalBounds().height<30) {
 //                preloadBar.anchor.setTo(0.5,0)
 //                game.load.setPreloadSprite(preloadBar);
 //                notLoaded = false
 //            } else {preloadBar.visible = false}
 //        }

	// },
	create: function() {
	    if (preloadBar) {preloadBar.visible = false; preloadBar.destroy()}
	    preloadBar = null
	    notLoaded = false
	    instruct2.setText("")

    	IGaddMenuBar(WIDTH/2+IGxratio*436)

	    CurrentBiome = 'forest'
	    AsetResources(CurrentBiome)

	    IGaddDivButton({xloc:7*WIDTH/8,yloc:7*HEIGHT/8,text:"Next Generation",rtnf:'Aevolve'})
		
		APPsettings({xloc:setLoc.x,yloc:setLoc.y,width:setWid,height:setHgt})
		// AmakePopulation(CurrentBiome)

	 	setBtn = IGaddDivButton({xloc:setLoc.x+40,yloc:setLoc.y+setHgt/2+10, text: "Set",rtnf: 'AgetSettings'})

	 	IGaddDivText({xloc:resLoc.x, yloc:resLoc.y-30, text: "Resources for the "+CurrentBiome+" biome", weight:400})
	 	PreyLabel = IGaddDivText({xloc:resLoc.x-40, yloc:resLoc.y, text: "Prey: "})
	 	FruitLabel = IGaddDivText({xloc:resLoc.x-40, yloc:resLoc.y+20, text: "Fruit: "})
	 	ShelterLabel = IGaddDivText({xloc:resLoc.x-40, yloc:resLoc.y+40, text: "Shelter: "})
	 	WaterLabel = IGaddDivText({xloc:resLoc.x-40, yloc:resLoc.y+60, text: "Water: "})

	 	PreyText = IGaddDivText({xloc:resLoc.x+40, yloc:resLoc.y, text: "0"})
	 	FruitText = IGaddDivText({xloc:resLoc.x+40, yloc:resLoc.y+20, text: "0"})
	 	ShelterText = IGaddDivText({xloc:resLoc.x+40, yloc:resLoc.y+40, text: "0"})
	 	WaterText = IGaddDivText({xloc:resLoc.x+40, yloc:resLoc.y+60, text: "0"})

	 	ApaintBiome(CurrentBiome)

	 	IGalertDIV(helpTextLocal,"auto",false,true,true,14,true)

	},
	update: function() {

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
};