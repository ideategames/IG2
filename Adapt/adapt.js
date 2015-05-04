////////////////////////////////////////////////////////////
//
// diverge.js
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//
/////////////////////////////////////////////////////////////
var preloadBar, setLoc, setWid, setHgt, PreyText,FruitText,ShelterText,WaterText,PreyLabel,FruitLabel,ShelterLabel,WaterLabel,
	CurrentBiome, helpTextLocal
var PopDefaults = {size: 0.5, diversity: 0, strength: 0.5, speed: 0.5, replicationSpeed: 1}
var Populations = {coast: [], prairie: [], hills: [], forest: [], mountains: []}
var triimg = 'trilobite'
var popimg = []
var PopSettings = {coast: {size: 0.5, diversity: 0.3, strength: 0.5, speed: 0.5, replicationSpeed: 1, count: 10},
	prairie: {size: 0.5, diversity: 0.3, strength: 0.5, speed: 0.5, replicationSpeed: 1, count: 10},
	hills: {size: 0.5, diversity: 0.3, strength: 0.5, speed: 0.5, replicationSpeed: 1, count: 10},
	forest: {size: 0.5, diversity: 0.3, strength: 0.5, speed: 0.5, replicationSpeed: 1.1, count: 10},
	mountains: {size: 0.5, diversity: 0.4, strength: 0.5, speed: 0.5, replicationSpeed: 3, count: 10}}
var ActivePopulations = ['forest']
var MEATRES = {min: 0, range: 5}
var FRUITRES = {min: 8, range: 8}
var SHELTERRES = {min: 8, range: 18}
var WATERRES = {min: 8, range: 12}
var BiomeResources = {coast: {},
	prairie: {},
	hills: {},
	forest: {},
	mountains: {}

}
var BLIGHTS = ['disease','storms','earthquakes','drought']
var BLIGHTHIT = ['prey', 'fruit', 'shelter', 'water']
var BlightText = {disease: "The prey have been decimated by a new disease. They are reduced in half.",
	storms: "Raging storms have ruined half the fruit.",
	earthquakes: "Earthquakes have destroyed half the shelters.",
	drought: "Drought has dried up half the water pools."
	}
var BiomeBlight = {coast: 0,
	prairie: 0,
	hills: 0,
	forest: 0,
	mountains: 0

}
var PopSegments = {coast: [], prairie: [], hills: [], forest: [], mountains: []}
var PopLosses = {coast: 0, prairie: 0, hills: 0, forest: 0, mountains: 0}
var PopEfficiencies = {coast: [], prairie: [], hills: [], forest: [], mountains: []}
var generations = 0

var CULLFACTORS = {prey: {large:0.5,medium:0,small:0},
	fruit: {large:1,medium:1,small:1},
	shelter: {large:1,medium:1,small:1},
	water: {large:1,medium:1,small:1}
	}

var SIZEPOINTS = {small: 0.35, large: 0.65}

var BUSTED = 6

function APPnewGame() {
    loadURLExt({'url': AppPath+'entry.html?alias='+DMMalias+"&partner="+IGpartner})
}
function APPrestart() {
    if ((EventVars[EventType])) {
        IGstartSpinner()
        game.state.start('entry',true,true)
    } else {APPnewGame()}
}


function APPdismissSettings() {
    var nodeList = document.getElementsByClassName('IGsettings');
    while (nodeList.length>0) {
        // IGconsole("\nremoving node\n")
        nodeList = document.getElementsByClassName('IGsettings')
        nodeList[0].parentNode.removeChild(nodeList[0]);
    }
}
function APPsettings(par) {
    var wid = (par.width) ? par.width : 300
    var hgt = (par.height) ? par.height : 500
    var xloc = (par.xloc) ? par.xloc : WIDTH/2
    var yloc = (par.yloc) ? par.yloc : HEIGHT/2
    var biome = (par.biome) ? par.biome : CurrentBiome

    var ret = document.createElement("div");

    //Assign different attributes to the element.
    ret.setAttribute("class", "IGtemp IGsettings");
    var tmp = "position:absolute;width:"+wid+"px;height:"+hgt+"px;"+
    	"left:calc(50% + "+(xloc-WIDTH/2-wid/2)+"px);top:"+(yloc-hgt/2)+"px;"+
    	"border: 1px solid #777;border-radius:5px;background-color:#fff";
    ret.setAttribute("style",tmp);
    var retin1 = document.createElement("div");
    retin1.setAttribute("class", "IGtemp IGsettings");
    tmp = "font-size:14px;line-height:100%;color:#333;font-weight:100;";
    retin1.setAttribute("style",tmp);
    var check = ['','','']
    check[DMMlevel] = ' checked';
    retin1.innerHTML = "<h4>Your selection pressures</h4><p>(valid values are 1 - 10)</p>"+
    	'<table align="center"><tr><td/><td>&nbsp;&nbsp;</td><td/></tr>'+
    	'<tr><td>Size: </td><td/><td><input id="option1" type="text" size="1" name="size" value="'+PopSettings[biome].size*10+'"/></td></tr>'+
    	'<tr><td>Strength: </td><td/><td><input id="option3" type="text" size="1" name="strength" value="'+PopSettings[biome].strength*10+'"/></td></tr>'+
    	'<tr><td>Speed: </td><td/><td><input id="option4" type="text" size="1" name="speed" value="'+PopSettings[biome].speed*10+'"/></td></tr>'+
    	'<tr><td>Diversity: </td><td/><td><input id="option2" type="text" size="1" name="diversity" value="'+PopSettings[biome].diversity*10+'"/></td></tr>'+
    	'<tr><td>Replication speed: </td><td/><td><input id="option5" type="text" size="1" name="replicationSpeed" value="'+parseInt((PopSettings[biome].replicationSpeed-1.0)*10)+'"/></td></tr>'+
    	'</table>'
    ret.appendChild(retin1);

    document.getElementById("game").appendChild(ret);

    return ret
}
var settingsBtn
var settingsOn
function AgetSettings() {
		PopSettings[CurrentBiome].size = $('input[name="size"]').val()/10;
		PopSettings[CurrentBiome].strength = $('input[name="strength"]').val()/10;
		PopSettings[CurrentBiome].speed = $('input[name="speed"]').val()/10;
		PopSettings[CurrentBiome].diversity = $('input[name="diversity"]').val()/10;
		PopSettings[CurrentBiome].replicationSpeed = 1.0+$('input[name="replicationSpeed"]').val()/10;
		IGconsole("New pop settings: "+PopSettings[CurrentBiome].size+":"+
			PopSettings[CurrentBiome].strength+":"+
			PopSettings[CurrentBiome].speed+":"+
			PopSettings[CurrentBiome].diversity+":"+
			PopSettings[CurrentBiome].replicationSpeed)
		// APPdismissSettings()
}
function AsetResources(biome) {
	// reshigh ensures that there aren't too many high values
	// that the biome isn't too good
	var reshigh
	BiomeResources[biome].prey = Math.ceil(Math.random()*MEATRES.range)+MEATRES.min
	reshigh = (BiomeResources[biome].prey>1+MEATRES.min+MEATRES.range/2) ? 'prey' : null
	var rmult = (reshigh) ? 0.5 : 1.0 
	BiomeResources[biome].fruit = Math.ceil(Math.random()*rmult*FRUITRES.range)+FRUITRES.min
	if (!reshigh) {
		reshigh = (BiomeResources[biome].fruit>1+FRUITRES.min+FRUITRES.range/2) ? 'prey' : null
		rmult = (reshigh) ? 0.5 : 1.0 
	}
	BiomeResources[biome].shelter = Math.ceil(Math.random()*rmult*SHELTERRES.range)+SHELTERRES.min
	if (!reshigh) {
		reshigh = (BiomeResources[biome].shelter>2+SHELTERRES.min+SHELTERRES.range/2) ? 'prey' : null
		rmult = (reshigh) ? 0.5 : 1.0 
	}
	BiomeResources[biome].water = Math.ceil(Math.random()*rmult*WATERRES.range)+WATERRES.min
}
function ApaintBiome(biome) {
	PreyText.setText(BiomeResources[biome].prey.toString())
	FruitText.setText(BiomeResources[biome].fruit.toString())
	ShelterText.setText(BiomeResources[biome].shelter.toString())
	WaterText.setText(BiomeResources[biome].water.toString())
}
function AcalcBiomass(biome,record) {
	var ret = 0
	var eff = 0
	for (var b=0;b<Math.floor(PopSettings[biome].count);b++) {
		if (Populations[biome][b]) {
			ret += Populations[biome][b].size + 0.5
		}
	}
	// record biomass efficiency
	if (record) {
		eff = ret/BiomeResources[biome].water
		// IGconsole("efficiency: "+eff);
		PopEfficiencies[biome].push(eff)
	}
	return [Math.ceil(ret),eff]
}
function AinitPopulation(biome) {

	for (var i=0;i<Math.floor(PopSettings[biome].count); i++) {
		Populations[biome][i] = {size: msi, strength: mst, speed: msp}
	}
}
function AparsePopulation(biome) {
	// figure out how many large, med, small creatures
	var small = 0
	var med = 0
	var large = 0
	for (var n=0;n<Math.floor(PopSettings[biome].count);n++) {
		if (Populations[biome][n].size < SIZEPOINTS.AcullSmall) {small++}
		else if (Populations[biome][n].size > SIZEPOINTS.large) {large++}
		else {med++}
	}
	return [small,med,large]
}
function AmakePopulation(biome,replicate) {
	// clear all previous images
	for (var im=0;im<20;im++) {
		if (popimg[im]) {IGhide(popimg[im],true);popimg[im].destroy();popimg[im]=null;}
	}
	var div = PopSettings[biome].diversity
	var repl = PopSettings[biome].replicationSpeed

	// work in replication speed for next generation
	var num = (replicate) ? PopSettings[biome].count*repl : PopSettings[biome].count

	// zero out the population first; always a replace
	// Populations[biome] = []

	for (var i=0;i<Math.floor(num); i++) {
		if (!Populations[biome][i]) {
			Populations[biome][i] = PopSettings[biome]
		}
		var siz = Populations[biome][i].size
		var str = Populations[biome][i].strength
		var sp = Populations[biome][i].speed
		// need to add in the diversity
		var msi = siz+(Math.random()*div-(div/2))
		msi = (msi<0.05) ? 0.05 : msi
		msi = (msi>9) ? 9.0 : msi
		var mst = str+(Math.random()*div-(div/2))
		mst = (mst<0.05) ? 0.05 : mst
		mst = (mst>9) ? 9.0 : mst
		var msp = sp+(Math.random()*div-(div/2))
		msp = (msp<0.05) ? 0.05 : msp
		msp = (msp>9) ? 9.0 : msp
		Populations[biome][i] = {size: msi, strength: mst, speed: msp}
		// IGconsole("Size: "+msi)
		if (!popimg[i]) {
			var adj = (i - Math.floor(num)/2 + 0.5) * 110
			popimg[i] = IGaddSprite(WIDTH/2+adj,2*HEIGHT/3,triimg)
		}
		popimg[i].scale.setTo(0.3*msi)
	}
	PopSettings[biome].count = num
	PopSegments[biome] = AparsePopulation(biome)
	// IGalertDIV("\n\nSpread = "+spread[0]+":"+spread[1]+":"+spread[2],"auto",false,true,true,14,true)
}
function AcullWater(biome) {
	return (AcalcBiomass(biome)[0] > BiomeResources[biome].water) ? AcalcBiomass(biome)[0] - BiomeResources[biome].water : 0
}
function AcullLarge(biome) {
	ret = {prey:0, fruit:0,shelter:0}
	if (PopSegments[biome][2]/2 > BiomeResources[biome]['prey']) 
		{ret.prey = Math.ceil(PopSegments[biome][2] - 0.5*BiomeResources[biome]['prey'])}
	if (PopSegments[biome][2] > BiomeResources[biome]['fruit']) 
		{ret.fruit = Math.ceil(PopSegments[biome][2] - BiomeResources[biome]['fruit'])}
	if (PopSegments[biome][2] > BiomeResources[biome]['shelter']) 
		{ret.shelter = Math.ceil(PopSegments[biome][2] - BiomeResources[biome]['shelter'])}

	return ret
}
function AcullMedium(biome) {
	ret = {prey:0, fruit:0,shelter:0}
	// first, reduce the available resources by the large population
	var fruitleft = BiomeResources[biome]['fruit'] - PopSegments[biome][2]
	fruitleft = (fruitleft < 0) ? 0 : fruitleft
	var shelterleft = BiomeResources[biome]['shelter'] - PopSegments[biome][2]
	shelterleft = (shelterleft < 0) ? 0 : shelterleft
	if (PopSegments[biome][1] > fruitleft) {
		ret.fruit = PopSegments[biome][1] - fruitleft
	}
	if (PopSegments[biome][1] > shelterleft) {
		ret.shelter = PopSegments[biome][1] - shelterleft
	}

	return ret
}
function AcullSmall(biome) {
	ret = {prey:0, fruit:0,shelter:0}
	var fruitleft = BiomeResources[biome]['fruit'] - (PopSegments[biome][2] + PopSegments[biome][1])
	fruitleft = (fruitleft < 0) ? 0 : fruitleft
	var shelterleft = BiomeResources[biome]['shelter'] - (PopSegments[biome][2] + PopSegments[biome][1])
	shelterleft = (shelterleft < 0) ? 0 : shelterleft
	if (PopSegments[biome][0] > fruitleft) {ret.fruit = fruitleft}
	if (PopSegments[biome][0] > shelterleft) {ret.shelter = shelterleft}

	return ret
}
function Arecount(biome) {
	PopSegments[biome][0] = 0;
	PopSegments[biome][1] = 0;
	PopSegments[biome][2] = 0;
	for (var i=0;i<Math.floor(PopSettings[biome].count);i++) {
		if (Populations[biome][i].size > SIZEPOINTS.large) {
			PopSegments[biome][2]++;
		} else if (Populations[biome][i].size < SIZEPOINTS.small) {
			PopSegments[biome][0]++;
		} else {
			PopSegments[biome][1]++;
		}
	}
	return PopSegments[biome][0]+PopSegments[biome][1]+PopSegments[biome][2]
}
function ArandomCull(biome,size,count) {
	var dels = {small:0,medium:0,large:0}
	// need to check if there are enough to cull
	// else set loop to cull all randomly
	// this should not happen, however
	if (count > Math.floor(PopSettings[biome].count)) {count = Math.floor(PopSettings[biome].count)}
	while (count>0) {
		for (var i=0;i<Math.floor(PopSettings[biome].count)-1;i++) {
			if ((Populations[biome][i].size > SIZEPOINTS.large) && IGisInArray(size,['large','any'])) {
				count--;
				PopSettings[biome].count--;
				PopSegments[biome][2]--;
				Populations[biome].splice(i,1);
				dels.large++
				break;
			} else if ((Populations[biome][i].size < SIZEPOINTS.small) && IGisInArray(size,['small','any'])) {
				count--;
				PopSettings[biome].count--;
				PopSegments[biome][0]--;
				Populations[biome].splice(i,1);
				dels.small++
				break;

			} else if (IGisInArray(size,['medium','any'])) {
				count--;
				PopSettings[biome].count--;
				PopSegments[biome][1]--;
				Populations[biome].splice(i,1);
				dels.medium++
				break;
			}
		}
	}
	return dels
}
var curblight = -1
function AshowBlight() {
	// decrease the resource, set the 2-generation counter
	BiomeResources[CurrentBiome][BLIGHTHIT[curblight]] = BiomeResources[CurrentBiome][BLIGHTHIT[curblight]]/2
	IGconsole("new "+BLIGHTHIT[curblight]+": "+BiomeResources[CurrentBiome][BLIGHTHIT[curblight]])
	ApaintBiome(CurrentBiome)
	IGalert("\n\n"+BlightText[BLIGHTS[curblight]]+"\n\nIt will take 2 generations to recover.",false,false,false,false)

}
function AcheckIfBusted() {
	var biome = CurrentBiome
	IGconsole("checking if busted")
	if (Math.floor(PopSettings[biome].count)<BUSTED) {
		// erase individual images
		for (var im=0;im<20;im++) {
			if (popimg[im]) {IGhide(popimg[im],true);popimg[im].destroy();popimg[im]=null;}
		}
		// remove the last efficiency, when it went extinct
		PopEfficiencies[biome].pop()
		if (PopEfficiencies[biome].length < 1) {PopEfficiencies[biome].push(0)}
		scoreText = "\nYour population has become extinct. It survived for "+generations+" generation"+IGplur(generations)+"."+
			"\n\nThere were "+PopLosses[biome]+" premature deaths from your population during this time."+
			"\n\nYour average use of resources was "+parseInt((IGsumArray(PopEfficiencies[biome])/PopEfficiencies[biome].length)*100)+"%."
		IGendGame({msg:scoreText,fcns:{again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame'},
            small: true, wide: true, nohead: true})
	} else {
		var blight = Math.random()*7
		IGconsole("blight: "+blight)
		if (blight>5 && curblight<0) {
			BiomeBlight[biome] = 2
			curblight = Math.floor(Math.random()*4)
			game.time.events.add(500,AshowBlight)
		} else if (curblight>=0) {
			IGconsole("decrementing")
			BiomeBlight[biome]--
			if (BiomeBlight[biome] < 1) {
				BiomeBlight[biome] = 0
				BiomeResources[CurrentBiome][BLIGHTHIT[curblight]] = BiomeResources[CurrentBiome][BLIGHTHIT[curblight]]*2
				ApaintBiome(biome)
				curblight = -1
			}
		}
	}
}
function Aevolve() {
	var biome = CurrentBiome
	for (var pop in ActivePopulations) {
		AmakePopulation(ActivePopulations[pop],true)
	}
	var beforecnt = Arecount(biome)
	var oldPop = "\nSmall: "+PopSegments[biome][0]+
		"\nMedium: "+PopSegments[biome][1]+
		"\nLarge: "+PopSegments[biome][2]

	// first, kill off the small from water shortage
	// [should it be smallest, or mediums, or random?]

	var firstBiomass = AcalcBiomass(biome)
	var cullW = AcullWater(biome)
	var cullWText = "\n\nWater cull: "+cullW
	var tmp = (cullW>PopSegments[biome][1]) ? 'any' : 'medium'
	var rcull = ArandomCull(biome,tmp,cullW)

	var killL = AcullLarge(CurrentBiome)
	var cullL = killL.prey + killL.fruit + killL.shelter
	var tmp = (cullL>PopSegments[biome][2]) ? 'any' : 'large'
	rcull = ArandomCull(biome,'large',cullL)
	var killM = AcullMedium(CurrentBiome)
	var tmp = (killM>PopSegments[biome][1]) ? 'any' : 'medium'
	rcull = ArandomCull(biome,'medium',killM.prey + killM.fruit + killM.shelter)
	var killS = AcullSmall(CurrentBiome)
	var tmp = (killS>PopSegments[biome][1]) ? 'any' : 'small'
	rcull = ArandomCull(biome,'small',killS.prey + killS.fruit + killS.shelter)

	var aftercnt = Arecount(biome)
	PopLosses[biome]+= beforecnt-aftercnt
	var afterBiomass = AcalcBiomass(biome,true)
	
		generations++
		IGalertDIV("\n\nInitial population\nBiomass: "+firstBiomass[0]+
			oldPop+cullWText+"\n\nLarge culls -- Prey: "+killL.prey+", Fruit: "+killL.fruit+", Shelter: "+killL.shelter+
			"\n\nMedium culls -- Prey: "+killM.prey+", Fruit: "+killM.fruit+", Shelter: "+killM.shelter+
			"\n\nSmall culls -- Prey: "+killS.prey+", Fruit: "+killS.fruit+", Shelter: "+killS.shelter+
			"\n\nEnding population\nBiomass: "+afterBiomass[0]+"\nSmall: "+PopSegments[biome][0]+
			"\nMedium: "+PopSegments[biome][1]+
			"\nLarge: "+PopSegments[biome][2]+
			"\n\nEfficiency: "+parseInt(afterBiomass[1]*100)+"%",
			"auto",AcheckIfBusted(),true,true,14,true)
		for (var pop in ActivePopulations) {
			IGconsole("biome: "+ActivePopulations[pop])
			AmakePopulation(ActivePopulations[pop])
		}

}
function APPgameReset() {
	PopLosses = {coast: 0, prairie: 0, hills: 0, forest: 0, mountains: 0}
	PopEfficiencies = {coast: [], prairie: [], hills: [], forest: [], mountains: []}
	generations = 0
}
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

	    game.load.image(triimg, AppPath + 'images/Trilobite.png')
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