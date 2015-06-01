/*
-----------------------------------------------------------------------------------------
--
-- entry
--
-----------------------------------------------------------------------------------------
*/

var head = []
var instr = []
var iTopics = []

dispatchGame = function() {
	game.state.start('doors',true,true)
}

IGdispatchEvent2 = function(topic) {
    IGaddMenuBar(WIDTH/2+IGratio*304+IGxratio*123)
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

var doorsSelect = {
	// 	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, '', { preload: preload, create: create, shutdown: shutdown });
	preload : function() {

		IGsetStage(rgbToHex(255,200,33))
		IGdefineScales()
		IGsetGlobalFunctions()
		DMMSetTopics()

		game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')

		sloc = { 1: {x: 5*WIDTH/6+rx(20), y: HEIGHT/3}, 2: {x: 5*WIDTH/6+rx(20), y: HEIGHT/3+ry(30)} }

	    //  Load all the target images -- same image for all spots
	    // for (var top in Topics) {
	   	//     iTopics[top] = CommonPath+'pics/'+Topics[top].toLowerCase()+'_bar.png';
	    // }
	    game.load.image('AppBG',CommonPath+'pics/DoorsBG.png')
	},

	create: function() {
//	    IGconsole("in entry create")
		var appbg = IGaddSprite(WIDTH/2,HEIGHT/2,'AppBG')
		appbg.scale.setTo(1.0)

		IGaddDivText({xloc:MIDX, yloc:ry(50),text:"Collections",size:32, color:"#fff",weight:300})

		// var backT = IGaddText(rx(40),ry(50),"<",hugesty)
		// var backB = IGaddSprite(rx(40),ry(50),'tbutton')
		// backB.inputEnabled = true
		// backB.targ = "Doors"
		// backB.events.onInputDown.add(IGexit,this)

		// topic icons
		IGtopicSelect(DTopics)
		// if ((DMMalias=="anonymous") || (DMMalias.indexOf('{')>-1)) {
		// 	IGsetUpAlias("player name\n\n\n\n\n\n")
		// }

	},
	shutdown: function() {
		IGconsole("shutdown called")
		IGcleanupTexts()

	}
}