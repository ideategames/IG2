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
var tmpAlias
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
		if (IGwhite) {IGsetStage(IGbackground)} else {(IGsetStage())}

		// if there is no such param, then length will be undefined

		IGsetGlobalFunctions()

	    //  Load all the target images -- same image for all spots
	    for (var top in Topics) {
	   	    game.load.image(Topics[top], CommonPath+'pics/'+TopicIcons[top]);
	    }
	},

	create: function() {
//	    IGconsole("in entry create")
		IGconsole('alias: '+DMMalias)

		var instr = []
		// instructions
		instr[0] = game.add.text(WIDTH/2, ry(250), hIntro, hstyle2);
		instr[0].anchor.setTo(0.5,0)
		instr[0].scale.setTo(IGratio,IGratio)
		instr[1] = game.add.text(WIDTH/2, ry(300), introText, hstylecy);
		instr[1].anchor.setTo(0.5,0)
		instr[1].scale.setTo(IGratio,IGratio)

		// alias entry
		// instr[4] = game.add.text(WIDTH/3, 400, hAlias, hstyle);
		// instr[4].anchor.setTo(0.5,0)
		// instr[5] = game.add.text(WIDTH/2-30, 400, "", tstyle2);
		// instr[5].anchor.setTo(0.5,0)

		goButton = game.add.sprite(WIDTH/2,HEIGHT-ry(80),'goButton');
		goButton.scale.setTo(IGratio,IGratio)
		goButton.anchor.setTo(0.5,0.5)
		goButton.inputEnabled=true;
		if (DMMalias=="anonymous") {
			IGsetUpAlias("Enter alias\n\n\n\n\n\n",gotAlias)
			goButton.visible = false
		} else {
			goButton.events.onInputDown.add(enterGame,this)
			IGaddOverlay(goButton,enterGame);
		}

		// if there is no alias param, then length will be undefined

	},
	update: function() {
		if (game.input.keyboard.isDown()) {
			IGconsole("keyboard")
		}
	},
	shutdown: function() {

	}
}