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
	game.state.start('entry',true,true)
}

dispatchEvent2 = function(topic) {
    IGaddMenuBar(WIDTH/2+IGratio*290+IGxratio*280/2)
	IGstartSpinner()

	EventType = topic
	IGconsole("topic: "+topic)

	$.getScript("../common/js/"+EventType+"_data.js", function(data, textStatus) {
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

var squaresSelect = {
	// 	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, '', { preload: preload, create: create, shutdown: shutdown });
	preload : function() {

		game.transparent = false
		IGsetStage('#B98EC1')
		IGdefineScales()
		IGsetGlobalFunctions()
	    if (qs('pwd')=="sn00ker") {IGisPublic=false} else {IGisPublic=true}
		DMMSetTopics()

		game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')

		sloc = { 1: {x: 5*WIDTH/6+rx(20), y: HEIGHT/3}, 2: {x: 5*WIDTH/6+rx(20), y: HEIGHT/3+ry(30)} }

		// fetch the top scores for this alias
		//
		// DMMGetHttpRequest({query: "aliasscores", topic: "aliasscores"},"IGfetchAliasScores")

	    game.load.audio('click', [CommonPath+'sounds/Effect_Click.mp3', CommonPath+'sounds/Effect_Click.ogg']);
	    music = game.add.audio('click');

	    //  Load all the target images -- same image for all spots
	    // for (var top in Topics) {
	   	//     iTopics[top] = CommonPath+'pics/'+Topics[top].toLowerCase()+'_bar.png';
	    // }
	    game.load.image('AppBG',CommonPath+'pics/SquaresBG.png')
	},

	create: function() {
//	    IGconsole("in entry create")
		var appbg = IGaddSprite(WIDTH/2,HEIGHT/2,'AppBG')
		appbg.scale.setTo(1.0)

		IGaddDivText({xloc:MIDX, yloc:ry(50),text:"Clues",size:32, color:"#fff",weight:300})

		// var backT = IGaddText(rx(40),ry(50),"<",hugesty)
		// var backB = IGaddSprite(rx(40),ry(50),'tbutton')
		// backB.inputEnabled = true
		// backB.targ = "Squares"
		// backB.events.onInputDown.add(IGexit,this)

		// topic icons
		var topicCount = 0
		for (var top in Topics) {topicCount++}
		// if only 1 topic, jump right to the game (for partners)
		if (topicCount<2) {
			var top = Object.keys(Topics)
			dispatchEvent2(top[0]);
			return;
		}

		var i = 0
   		var sc = (HEIGHT<590) ? HEIGHT/590 : 1.0
		var rowcnt = (topicCount<8) ? 4 : Math.ceil(topicCount/2)
		var midvert = rowcnt/2*65
	    for (var top in Topics) {
	    	var xsc = 450*IGratio
	    	var ysc = 77*IGratio*0.9
	    	var xoff = ((i %2)==0) ? MIDX-xsc/2-5 : MIDX+xsc/2+5
	    	var yoff = sc*midvert+Math.floor(i/2)*86*sc
	    	var icon = (TopicIcons[top]) ? TopicIcons[top] : TopicIcons[EventType2]
			    selTopics[top] = IGaddDivText({xloc: xoff,yloc:yoff, ifile: iTopics[top], hclass: "topicSelect", 
			    	text: displayTopics[top].replace(/\\n/g,' ').replace(/\n/g,' '),
			    	image: CommonPath+'pics/'+icon,talign: "left",
			    	rtn: 'dispatchEvent2("'+Topics[top]+'")', width: xsc, height: ysc});
			    if ((top != "Music") || (DMMalias == "wiwax") || (DMMalias == "sara")) {
				    selTopics[top].inputEnabled=true;
				    // selTopics[top].events.onInputDown.add(dispatchEvent2,this);
				    selTopics[top].topic = Topics[top]
				    // IGaddOverlay(selTopics[top],dispatchEvent2,1.0,"icon")
				} else {
					selTopics[top].alpha = 0.3
					// selTexts[top].alpha = 0.6
				}

			    i++;
		}
		// if ((DMMalias=="anonymous") || (DMMalias.indexOf('{')>-1)) {
		// 	IGsetUpAlias("player name\n\n\n\n\n\n")
		// }

	},
	shutdown: function() {
		IGcleanupTexts()

	}
}