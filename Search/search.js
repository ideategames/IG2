////////////////////////////////////////////////////////////
//
// search.js
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//
/////////////////////////////////////////////////////////////
var imgLoc, descLoc, seaBtn, objPic, objDescr, resTitle, objObjects
var evTitle = []
var evDescriptions = []
var evTitles = []
var ievents = []
var evTexts = []
var sResults = []
var nextButs = []

evDescriptions[500] = "Search did not find anything."

ievents[500] = "foo"


function APPrestart() {
    if ((EventVars[EventType])) {
        IGstartSpinner()
        game.state.start('entry',true,true)
    } else {APPnewGame()}
}
function APPnewGame() {
	IGconsole("restarting")
	loadURLExt({'url': BasePath+'Search/index.html?alias='+DMMalias+'&partner='+IGpartner})
}
var curItem = 0
function SeShowResults() {
	var idx = (sResults[curItem]>-1) ? sResults[curItem] : 500//Math.floor(Math.random()*EventNum+1)
	IGconsole("object: "+curItem+":"+idx)
	objDescr.setText(evDescriptions[idx])
	if (sResults[curItem]) {
		if (EventVars[EventType][idx].actor.trim()) {
			objActor.setText(EventVars[EventType][idx].actor.trim())

		} else {
          	objActor.setText(evTitles[idx])
        }
        objImage.setText(evTitles[idx])
		objDate.setText(EventVars[EventType][idx].date.trim())
		objLocation.setText(EventVars[EventType][idx].location.trim())
		objObjects.setText(EventVars[EventType][idx].objects.trim())
	} else {
		objImage.setText("")
		objActor.setText("")
		objDate.setText("")
		objLocation.setText("")
		objObjects.setText("")
	}
	if (objPic) {objPic.destroy();objPic=null}
	objPic = IGaddSprite(imgLoc.x,imgLoc.y, ievents[idx])
	curItem = (curItem>sResults.length-2) ? 0 : curItem+1

}
var started = false
function SeGotSearchString() {
	if (!started) {document.getElementById("game").appendChild(nextButs[1]);started=true;}
	IGconsole("search string: "+IGtextString)
	curItem = 0
	sResults = []
	var ss = IGtextString.toLowerCase().trim()
	for (var s=0;s<EventNum;s++) {
		if (evTexts[s].search(ss)>-1) {sResults.push(s);IGconsole("hit on "+s+":"+evTexts[s])}
	}
	resTitle.setText("Search results: "+sResults.length+" hit"+IGplur(sResults.length) )
	SeShowResults()
}
function SeShowSearchBox() {
    IGtextString = ""
    IGaddComment(true, SeGotSearchString)
}
var gameEntry = {
	preload: function() {
		IGwhite = false
		IGdefineScales()
		IGsetStage('#0000ff')
		// parameter tells it to register user
		IGsetGlobalFunctions(true)

		topLoc = 72
		topRow = ry(36)
		imgLoc = {x:17*WIDTH/24, y:HEIGHT/2}
		descLoc = {x:7*WIDTH/24, y:HEIGHT/3}
		seaLoc = {x:100, y:topLoc}

		IGaddDivText({xloc:game.world.centerX, yloc:topRow,text:"Searching "+displayTopics[EventType],
	    	width:500,size:18,color:'#6a6a6a',weight:'400',height:50})

		IGconsole("EventNum: "+EventNum)

		for (var e=0;e<EventNum;e++) {
			var pos = EventVars[EventType][e].image.lastIndexOf('.')
	    	var iname = EventVars[EventType][e].image.substr(0,pos)
	    	var iname2 = iname.replace(/ /g,"_").replace(/,/g,"_")
	    	ievents[e] = 'image'+e
	    	evDescriptions[e] = EventVars[EventType][e].description
	        if (EventType.indexOf("Cities")>=0) {
	        	evTitles[e] = EventVars[EventType][e].description
	        	evDescriptions[e] = EventVars[EventType][e].actor
	        } else if ((EventType=="Museum") || (EventType=="Art") || (EventType=="Culture") || (EventType=="Composers") || (EventType=="Movies") ){
	        	// Composers the image title is redundant with actor
				evTitles[e] = ""
			} else {
				// image name is the new default title
	        	var pos = EventVars[EventType][e].image.lastIndexOf('.')
	        	evTitles[e] = EventVars[EventType][e].image.substr(0,pos).replace('01','').replace(/_/g," ").trim()
			}
			game.load.image(ievents[e], ImgPath+IGimgPath+'/'+iname2+'.png');

			evTexts[e] = ( evDescriptions[e]+EventVars[EventType][e].actor.trim()+
				EventVars[EventType][e].date.trim()+
				EventVars[EventType][e].objects.trim()+
				EventVars[EventType][e].location.trim()+
				EventVars[EventType][e].category.trim()+
				EventVars[EventType][e].image.trim() ).toLowerCase()

			// sResults.push(e)
		}

	},
	create: function() {

		resTitle = IGaddDivText({xloc:WIDTH/2,yloc:topLoc, size:18, text:""})
		seaBtn = IGaddDivButton({xloc:seaLoc.x,yloc:seaLoc.y, text: "Search",rtnf: 'SeShowSearchBox'})
		topBtn = IGaddDivButton({xloc:seaLoc.x+73,yloc:seaLoc.y, text: "Change Topic",rtnf: 'APPnewGame'})

		SeShowSearchBox()

        var xoff = WIDTH/10
        var yoff = 10
        nextButs[0] = document.createElement("a");
        nextButs[0].setAttribute("class", "IGtemp filmBut carousel-control")
        nextButs[0].setAttribute('onclick', 'SeShowResults(-1)')
        nextButs[0].setAttribute('role','button')
        nextButs[0].setAttribute('style',"float:none;position:absolute;margin-right:auto;margin-left:auto;left:"+parseInt(xoff)+"px;top:"+parseInt(yoff)+"%;")
        var chevl = document.createElement("i");
        chevl.setAttribute("class", "IGtemp fa fa-chevron-left fa-3x")
        nextButs[0].appendChild(chevl);
        nextButs[1] = document.createElement("a");
        nextButs[1].setAttribute("class", "IGtemp filmBut back right carousel-control")
        nextButs[1].setAttribute('onclick', 'SeShowResults(1)')
        nextButs[1].setAttribute('role','button')
        nextButs[1].setAttribute('style',"position:absolute;margin-left:auto;margin-right:0;right:"+parseInt(xoff)+"px;top:"+parseInt(yoff)+"%;")
        var chevr = document.createElement("i");
        chevr.setAttribute("class", "IGtemp fa fa-chevron-right-dark fa-3x")
        nextButs[1].appendChild(chevr);
        // document.getElementById("game").appendChild(nextButs[0]);
        // document.getElementById("game").appendChild(nextButs[1]);

		objDescr = IGaddDivText({xloc:descLoc.x, yloc:descLoc.y,text:"", width:500})

		objImage = IGaddDivText({xloc:imgLoc.x, yloc:imgLoc.y-ry(130),text:"", width:400})
		objActor = IGaddDivText({xloc:imgLoc.x, yloc:imgLoc.y-ry(100),text:"", width:400})
		objDate = IGaddDivText({xloc:imgLoc.x, yloc:imgLoc.y+ry(100),text:"", width:400})
		objLocation = IGaddDivText({xloc:imgLoc.x, yloc:imgLoc.y+ry(130),text:"", width:400})
		objObjects = IGaddDivText({xloc:imgLoc.x, yloc:imgLoc.y+ry(160),text:"", width:600})

		IGstopSpinner()

	},
	update : function() {
	},

	shutdown: function() {
		IGcleanupTexts()
	}
}