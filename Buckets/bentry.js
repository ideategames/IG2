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
	{game.state.start('buckets',true,true)}
}
function gotAlias() {
	goButton.visible = true
	IGaddOverlay(goButton,enterGame);
}

var setAlias = {
	// 	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, '', { preload: preload, create: create, shutdown: shutdown });
	preload : function() {

		game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')

		// these don't seem to do anything
		// if (window.devicePixelRatio > 1) {
		// }
	
		IGsetStage()

		IGsetGlobalFunctions()

	},

	create: function() {
	    console.log("alias: "+DMMalias)

		var instr = []

		instr[2] = game.add.text(WIDTH/2, ry(250), hIntroP, hstyle2);
		instr[2].anchor.setTo(0.5,0)
		instr[2].scale.setTo(IGratio,IGratio)
		instr[3] = game.add.text(WIDTH/2, ry(300), pathsText, style2);
		instr[3].anchor.setTo(0.5,0)
		instr[3].scale.setTo(IGratio,IGratio)

		goButton = game.add.sprite(WIDTH/2,HEIGHT-ry(60),'goButton');
		goButton.scale.setTo(IGratio,IGratio)
		goButton.anchor.setTo(0.5,0.5)
		goButton.inputEnabled=true;
		if (DMMalias=="anonymous") {
			IGsetUpAlias("Enter alias\n\n\n\n\n\n",gotAlias)
			goButton.visible = false
		} else {
			IGaddOverlay(goButton,enterGame);
		}
		goButton.bringToTop()

	},
	update: function() {
		if (game.input.keyboard.isDown()) {
			console.log("keyboard")
		}
		goButton.bringToTop()
	},
	shutdown: function() {
		console.log("shutdown called")

	}
}