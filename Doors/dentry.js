/*
-----------------------------------------------------------------------------------------
--
-- entry
--
-----------------------------------------------------------------------------------------
*/
var goButton

enterGame = function() {
	// if (DMMaliasList.indexOf(DMMalias) < 0) {alert("alias not found")} else
	{game.state.start('credits',true,true)}
}
function enter_fullscreen() {
	game.stage.scale.startFullScreen();

}
function isTyping(e) {
	console.log("key: "+e.keyCode)
}
function gotAlias() {
	goButton.visible = true
	IGaddOverlay(goButton,enterGame);
}
var setAlias = {
	// 	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, '', { preload: preload, create: create, shutdown: shutdown });
	preload : function() {

		// these don't seem to do anything
		// if (window.devicePixelRatio > 1) {
		// }
	
		IGsetStage(IGbackground)
		IGwhiteScales()

		IGsetGlobalFunctions()

	    game.input.keyboard.addKeyCapture([1,2,3,4,5,6,7,8,9])
	},

	create: function() {
		IGconsole('alias: '+DMMalias)

		var instr = []
		// instructions
		// instr[0] = game.add.text(WIDTH/2, ry(100), hIntro, hstyle2);
		// instr[0].anchor.setTo(0.5,0)
		// instr[0].scale.setTo(IGratio,IGratio)
		// instr[1] = game.add.text(WIDTH/2, ry(150), introText, style2);
		// instr[1].anchor.setTo(0.5,0)
		// instr[1].scale.setTo(IGratio,IGratio)

		instr[2] = game.add.text(WIDTH/2, ry(250), hIntroD, hstyle2);
		instr[2].anchor.setTo(0.5,0)
		instr[2].scale.setTo(IGratio,IGratio)
		instr[3] = game.add.text(WIDTH/2, ry(300), doorsText, hstylecy);
		instr[3].anchor.setTo(0.5,0)
		instr[3].scale.setTo(IGratio,IGratio)

		// alias entry
		// instr[4] = game.add.text(WIDTH/3, 400, hAlias, hstyle);
		// instr[4].anchor.setTo(0.5,0)
		// instr[5] = game.add.text(WIDTH/2-30, 400, "", tstyle2);
		// instr[5].anchor.setTo(0.5,0)

//	    kb = new Keyboard(game)
	    kb = game.input.keyboard.addKey(Phaser.Keyboard.SPACE_BAR)
	    kb.onDown.add(isTyping,this)

		goButton = game.add.sprite(WIDTH/2,HEIGHT-ry(80),'goButton');
		goButton.scale.setTo(IGratio,IGratio)
		goButton.anchor.setTo(0.5,0.5)
		goButton.inputEnabled=true;
		if (DMMalias=="anonymous") {
			IGsetUpAlias("Enter alias\n\n\n\n\n\n",gotAlias)
			goButton.visible = false
		} else {
			IGaddOverlay(goButton,enterGame);
		}
		// goButton.events.onInputDown.add(enterGame,this);

		// if there is no alias param, then length will be undefined
	// 	if (tmpAlias.length) {
	// 		DMMalias = tmpAlias
	// 		// instr[5].content = tmpAlias
	// 		window.setTimeout(enterGame,2000)
	// 	} else {
	// 		game.input.keyboard.onUpCallback = function(e) {
	// //			console.log("key: "+e.keyCode)
	// 			// if (e.keyCode == 8) {instr[5].content = instr[5].content.substring(0,instr[5].content.length-1)}
	// 			// else if (e.keyCode == 13) {window.setTimeout(loadEntryURL,1000)} //{window.setTimeout(enterGame,100)}
	// 			// else {instr[5].content = instr[5].content + String.fromCharCode(e.keyCode).toLowerCase()}
	// 			// DMMalias = instr[5].content
	// 		}
	// 	}

	},
	update: function() {
		if (game.input.keyboard.isDown()) {
			console.log("keyboard")
		}
	},
	shutdown: function() {
		console.log("shutdown called")

	}
}