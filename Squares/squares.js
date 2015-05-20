////////////////////////////////////////////////////////////
//
// squares.js
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//
/////////////////////////////////////////////////////////////

var notLoaded = true
var bpmText, IGplayer, cursors, descr, timerText, preloadBar, instruct2, descLen,
        hitLoc, timeLoc, descLoc, moreLoc, sqLoc, helpTextLocal,clue,altclue
var rooms = []
var squares = []
var bgcolor = "#dec0e2"
var IGdebug = true
var ORIGsqsize = 150
var sqsize = 150
var numSquares = 16
var numColumns = 4
var ievents = []
var titles = []
var titlestxt = []
var titleshade = []
var evDescriptions = []
var evAltClues = []
var idxes = []
var currentObj = Math.floor(Math.random()*(numSquares))
var yetToHit = []
var numMistakes = 0
var landscape, greenEx
var checks = []
var helps = []
var iimgs = []
var iimgstxt = []
var updcnt = 0
var APPbaseScore = 10

function DMMmenu() {
    IGendGame({msg:'You are in the middle of a game. Selecting any button but the first will abort this game.',
        fcns:{again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame',resume:'IGresume'},small:true,nohead:true})
}
function SSturnOff() {
    greenEx.visible = false
}
function APPnewGame() {
    loadURLExt({'url': '/launch/ssindex.html?alias='+DMMalias+"&partner="+IGpartner})
}
function APPrestart() {
    if ((EventVars[EventType])) {
        IGstartSpinner()
        game.state.start('entry',true,true)
    } else {APPnewGame()}
}
function SSshowDescr() {
    // using DIV now, so this contains the button
    IGalertDIV("\n\n"+evDescriptions[currentObj],"auto",false,true,true,14,true)
}
function SSshowAltClues(ev) {
    var desctext = EventVars[EventType][ev.idx][altclue].replace(/;/g,"; ")
    if (desctext.length>descLen2) {
        var pos = IGfindPrevious(desctext.substring(0,descLen2),' ')
        desctext = desctext.substring(0,pos) + "..."
    }
    IGalertDIV("\n\n"+desctext,"auto",false,true,true,13)
}
function SSshowNameOn(ev) {
    var onoff = false //(ev.hidden) ? true : false
    IGhide(titlestxt[ev.idx],onoff)
    IGhide(titleshade[ev.idx],onoff)
    ev.hidden = !onoff
}
function SSshowNameOff(ev) {
    var onoff = true //(ev.hidden) ? true : false
    IGhide(titlestxt[ev.idx],onoff)
    IGhide(titleshade[ev.idx],onoff)
    ev.hidden = !onoff
}
function SSshowHelp() {
    IGalertDIV(helpTextLocal,'big')
}

function SSgetNewDescr(idx) {
    var tmp = yetToHit.indexOf(idx)
    yetToHit.splice(tmp,1)
    if (yetToHit.length>0) {
        hits.setText(yetToHit.length)
        var next = Math.floor(Math.random()*(yetToHit.length))
        currentObj = yetToHit[next]
        var desctext = evDescriptions[currentObj]
        if (desctext.length>descLen) {
            var pos = IGfindPrevious(desctext.substring(0,descLen),' ')
            desctext = desctext.substring(0,pos) + "..."
            IGhide(moreBtn,false)
            moreBtn.idx = currentObj
        } else {IGhide(moreBtn,true)}
        descr.setText(desctext)
    } else {hits.setText("")}
}
function SScalcThisScore(score) {
    // calculation to normalize to about 100
    // 100 pts for 16 items at 15 spm
    var tmp = APPbaseScore + Math.round(score*.375) - 5*numMistakes
    if (tmp>100 && numMistakes>0) {tmp = 100 - 5*numMistakes}
    IGconsole("raw score: "+tmp)
    return (tmp<10) ? 10 : tmp
}
function SScalcTotalScore(score) {
    // for multiple runs, store the score
    DMMscores.push(score)
    // real score is sum of the last 3 runs
    IGcalcTotalScore()

    return DMMtotalScore

}
function SScheckHitDiv(arg) {
    SScheckHit(squares[parseInt(arg)])
}
function SScheckHit(ev) {
    if (!IGtimerFlag) {IGstartTimer()}
    if (ev.idx == currentObj) {
        checks[ev.idx].visible = true
        IGbell.play()
        SSgetNewDescr(ev.idx)
        var plur = (numMistakes==1) ? "" : "s"
        if (yetToHit.length<1) {
            IGstopTimer()
            IGanalytics(['Squares', 'Finish', EventType]);
            var spm = parseInt(600*numSquares/IGnumSecs)/10
            DMMscore =  SScalcThisScore(numSquares * spm)
            // have to calculate before the number of games is correct
            var tot = SScalcTotalScore(DMMscore)
            // var gcnt = IGgetGameCount()
            // var plur2 = (gcnt==1) ? "" : "(across "+gcnt+" games)"
            var scoreText = "You correctly identified "+numSquares+" "+ObjTypes[EventType2]+" in "+IGnumSecs+" seconds."+
            "\n\nThat's a rate of "+spm+" "+ObjTypes[EventType2]+" per minute."+
            "\n\nYou made "+numMistakes+" mistake"+plur+"."+
            "\n\nYour score for this game is "+DMMscore+"."+
            "\n\nTo achieve Mastery of "+displayTopics[EventType].replace('\n',' ')+", you need "+IGwizardScores[IGgameApp]+" points from 3 consecutive games. "+
            "You have "+DMMtotalScore+
            " points (total for "+IGgetGameCount()+" game"+IGplur(IGgetGameCount())+")."
            var userDataMsg = DMMscore+":"+tot+":"+spm+":"+numMistakes+" (Level "+DMMlevel+")"
            var ldr = true
            if (!IGisIGServer) {ldr = false}
            IGendGame({msg:scoreText,fcns:{again:'APPrestart',subj:'APPnewGame',diff:'IGchangeGame',leader:ldr},
                wide: true})
            IGsendScore(userDataMsg)
        }
    } else {IGbuzzer.play(); numMistakes++; greenEx.reset(ev.x,ev.y); greenEx.visible=true; window.setTimeout(SSturnOff,400)}
}
function SSstartTimer() {
    IGstartTimer()
}
function SSresetGame() {
    rooms = []
    squares = []
    ievents = []
    evDescriptions = []
    idxes = []
    currentObj = Math.floor(Math.random()*(numSquares))
    yetToHit = []
    numMistakes = 0
    landscape = false; greenEx = false
    checks = []
    iimgs = []
    iimgstxt = []
    updcnt = 0
    DMMscore = 0

}

var gameEntry = {
  preload: function() {

    if (EventNum<IGminEvents[IGgameApp]) {
        var rtn = (Object.keys(Topics).length<2) ? false : APPnewGame()
        IGstopSpinner()
        IGalertDIV("\n\nThere aren't enough events on this topic to play this game at this time."+
            "\n\nUse the menu upper right to select a different game "+
            "or to restart this game with a different topic.",
            "auto",rtn,true,true,true,16);
        return;
    }

    notLoaded = true

    // to catch small event databases
    if (numSquares>EventNum) {numSquares = EventNum}

    DMMgameReset()
    SSresetGame()
    game.load.image('preloaderBar', CommonPath+'pics/loaderBar.png')
    var ff = Math.ceil(rx(17))
    var tsty = { font: "bold "+ff+"px Arial", fill: "#000", align: "center", wordWrap: true,
        wordWrapWidth: 600 };
    instruct2 = IGaddText(WIDTH/2, HEIGHT - ry(80), "Loading...",tsty);

    IGnumSecs = 0
    numMistakes = 0
    // parameter tells it to register user
    DMMSetTopics()
    IGsetGlobalFunctions(true)
    IGsetStage('#ffffff')
    IGdefineScales()

    topRow = ry(30)
    sqspacing = ORIGsqsize*IGratio+ry(4)
    landscape = HEIGHT<800

    if (landscape) {
        sqRatio = 1-(1-IGratio)/2
        sqsize = ORIGsqsize*sqRatio
    } else {
        sqRatio = 1-(1-IGyratio)/2
        sqsize = ORIGsqsize*sqRatio
        // sqspacing = sqsize*1.005
    }
    IGconsole("landscape: "+landscape+":"+sqsize.toFixed(0)+":"+sqspacing.toFixed(1))

    clue = 'objects'
    altclue = 'description'
    titleclue = 'actor'
    switch (EventType) {
        case 'Museum':
            clue = 'objects'
            altclue = 'description'
            var ch = Math.floor(Math.random()*2)
            switch (ch) {
                case 0:
                    clue = "description";
                    altclue = "objects"
                    titleclue = 'actor'
                    break;
                case 1:
                    clue = 'objects';
                    altclue = "description"
                    titleclue = 'actor'
                    break;
            }
            break;
        case 'Science':
            var ch = Math.floor(Math.random()*3)
            switch (ch) {
                case 0:
                    clue = "description";
                    altclue = "objects"
                    titleclue = 'image'
                    break;
                case 1:
                    clue = 'actor';
                    altclue = "description"
                    titleclue = 'image'
                    break;
                case 2:
                    clue = 'objects';
                    altclue = "description"
                    titleclue = 'actor'
                    break;
            }
            break;
        case 'Literature':
            var ch = Math.floor(Math.random()*3)
            switch (ch) {
                case 0:
                    clue = "description";
                    altclue = "objects"
                    titleclue = 'actor'
                    break;
                case 1:
                    clue = 'actor';
                    altclue = "description"
                    titleclue = 'actor'
                    break;
                case 2:
                    clue = 'objects';
                    altclue = "description"
                    titleclue = 'actor'
                    break;
            }
            clue = 'objects'
            break;
        case 'Art':
            var ch = Math.floor(Math.random()*4)
            switch (ch) {
                case 0:
                    clue = "description";
                    altclue = "objects"
                    titleclue = 'actor'
                    break;
                case 1:
                    clue = 'actor';
                    altclue = "description"
                    titleclue = 'image'
                    break;
                case 2:
                    clue = 'objects';
                    altclue = "description"
                    titleclue = 'actor'
                    break;
                case 3:
                    clue = 'objects';
                    altclue = "description"
                    titleclue = 'actor'
                    break;
            }
            break;
        case 'Culture':
            clue = 'objects'
            altclue = "description"
            titleclue = 'actor'
            break;
        case 'Composers':
            clue = 'objects'
            altclue = "description"
            titleclue = 'actor'
            var ch = Math.floor(Math.random()*3)
            if (ch>1) {clue = "description";altclue = "objects"};
            break;
        case 'Movies':
            clue = 'objects'
            altclue = "description"
            titleclue = 'actor'
            var ch = Math.floor(Math.random()*3)
            if (ch>0) {clue = "description";altclue = "objects"};
            break;
        case 'Cities':
            var ch = Math.floor(Math.random()*5)
            if (ch>1) {clue = 'actor';altclue = "date"}
            else {clue = 'date';altclue = "actor"}
            titleclue = 'image'
        case 'Alaska':
            var ch = Math.floor(Math.random()*3)
            switch (ch) {
                case 0:
                    clue = "description";
                    altclue = "objects"
                    titleclue = 'image'
                    break;
                case 1:
                    clue = 'date';
                    altclue = "description"
                    titleclue = 'image'
                    break;
                case 2:
                    clue = 'date';
                    altclue = "description"
                    titleclue = 'image'
                    break;
            }
            break;
        default:
            var ch = Math.floor(Math.random()*2)
            switch (ch) {
                case 0:
                    clue = "description";
                    altclue = "objects"
                    titleclue = 'image'
                    break;
                case 1:
                    clue = 'objects';
                    altclue = "description"
                    titleclue = 'image'
                    break;
            }
    }
    IGconsole("clue: "+clue+":"+altclue)
    function getRandClue(clueset) {
        var lnth=0
        for (var i in clueset) {
            lnth++
        }
        var idx = Math.floor(Math.random()*lnth)
        // IGconsole("clue: "+idx+":"+clueset[idx])
        // if (clueset[idx].length<3) {IGconsole("clueset: "+clueset)}
        return clueset[idx]
    }
    for (var i=0;i<numSquares;i++) {

        yetToHit.push(i)

        var r = Math.floor(Math.random()*(EventNum))
        while (IGisInArray(r,idxes)){
            r = Math.floor(Math.random()*(EventNum))
        }
        idxes[i] = r
        var pos = EventVars[EventType][r].image.lastIndexOf('.')
        var iname = EventVars[EventType][r].image.substr(0,pos)
        var iname2 = iname.replace(/ /g,"_").replace(/,/g,"_")

        var useclue = clue
        if ((useclue=="objects") & EventVars[EventType][r][clue].length<3) {useclue="description"}

        var cclue = (useclue=="objects") ? getRandClue(EventVars[EventType][r][useclue].split(';')) : EventVars[EventType][r][useclue]
        if ( (EventType!="Cities") & ((clue=="actor") || (clue=="location")) ) {
            cclue = cclue+", "+EventVars[EventType][r].date
        } else if (EventType=="Cities") {
            if (clue=="date") {cclue = "Latitude: "+cclue}
            else if (clue=="actor") {cclue = cclue+" at Latitude: "+EventVars[EventType][r].date}
        }
        evDescriptions[i] = cclue
        game.load.image('room'+i, ImgPath+IGimgPath+'/'+iname2+'.png');
        game.load.image('bigroom'+i, ImgPath+'large/'+iname2+'.png');
        iimgs[i] = 'bigroom'+i
        iimgstxt[i] = 'Image Credit: '+EventVars[EventType][r].URL
        if (titleclue=="image") {
            titles[i] = EventVars[EventType][r].image.substr(0,pos).replace('01','').replace(/_/g," ").trim()
        } else {titles[i] = EventVars[EventType][r][titleclue]}
        // evAltClues[i] = EventVars[EventType][r][altclue]

    }
    game.load.image('correct', CommonPath+'pics/greenCheck.png')
    game.load.image('wrong', CommonPath+'pics/greenEx.png')
    game.load.image('shade', CommonPath+'pics/itemCircleGrey.png')
    game.load.image('shadow', CommonPath+'pics/sqBG.png')
    game.load.image('itemhelp', CommonPath+'pics/help_round.png')
    // if (landscape) {
    //     game.load.image('objbg', AppPath+'pics/descBox.png')
    // } else {
    //     game.load.image('objbg', AppPath+'pics/descBoxH.png')
    // }
        IGbrace1 = IGaddText(WIDTH/2-150,HEIGHT-ry(27),'[',hstylevlb)
        IGbrace2 = IGaddText(WIDTH/2+150,HEIGHT-ry(27),']',hstylevlb)
  },


    loadUpdate: function() {
        if (notLoaded) {
            if (preloadBar) {preloadBar.destroy(); preloadBar = null}
            preloadBar = game.add.sprite(WIDTH/2, HEIGHT-ry(36), 'preloaderBar');
            if (preloadBar.getLocalBounds().height<30) {
                preloadBar.anchor.setTo(0.5,0)
                game.load.setPreloadSprite(preloadBar);
                notLoaded = false
            } else {preloadBar.visible = false}
        }

    },
  create: function() {
    IGstopSpinner()

    columnW = rx(280)
    centerW = IGratio*290
    var ctrloc = (HEIGHT>780) ? 390 : HEIGHT/2
    hitLoc = {x: WIDTH/2-centerW-(columnW/2), y: ctrloc-ry(100)}
    timeLoc = {x: WIDTH/2+centerW+(columnW/2), y: ctrloc-ry(100)}
    descLoc = {x: WIDTH/2, y: ctrloc+centerW+ry(38)}
    moreLoc = {x: WIDTH/2+rx(250), y: ctrloc+centerW+IGratio*170}
    sqLoc = {x: WIDTH/2, y: ctrloc-ry(70)}
    boxW = IGratio*620
    boxH = IGratio*224
    if (landscape) {
        // make the description box placement not scale, so it lines up with menu
        descLoc = {x:WIDTH/2+centerW+(columnW/2), y: HEIGHT/2}
        moreLoc = {x:WIDTH/2+centerW+(columnW/2)+rx(55), y: HEIGHT/2+ry(310)}
        hitLoc = {x: WIDTH/2-centerW-(columnW/2), y: HEIGHT/2}
        timeLoc = {x: WIDTH/2-centerW-(columnW/2), y: HEIGHT/2-ry(100)}
        sqLoc = {x: WIDTH/2, y: HEIGHT/2+ry(10)}
        boxW = IGratio*214
        boxH = IGratio*620
    }
    descLen = IGratio*600
    descLen2 = 900


    var rightEdge = WIDTH/2 + centerW + columnW - rx(28)
    // var leftEdge = WIDTH/2 - centerW - columnW + rx(28)
    menuLoc = {x: rightEdge-30, y:topRow+ry(10)}
    helpLoc = {x: rightEdge-78, y: topRow-IGratio*14}
    filmLoc = {x: rightEdge-180, y: topRow-IGratio*14}

    graphics = game.add.graphics(0,0)
    graphics.lineStyle(5,0xbbbbbb, 1)

    IGconsole("h,w: "+HEIGHT+":"+WIDTH)
    var adj = numColumns/2-0.5
    var adjy = Math.ceil((numSquares/numColumns))/2-0.5
    var corner = sqspacing/2-(IGratio*16)
    for (var i=0;i<numSquares;i++) {
      var xoff = (i)%4 - adj
      var yoff = Math.floor((i)/4) - adjy
      // IGconsole("x,y: "+xoff+":"+yoff)
      // var shad = IGaddSprite(sqLoc.x+6+xoff*sqspacing,sqLoc.y+6+yoff*sqspacing,'shadow')
      // shad.scale.setTo(0.8*IGratio*sqRatio)
      squares[i] = IGaddSprite(sqLoc.x+(xoff*sqspacing),sqLoc.y+(yoff*sqspacing),'room'+i)
      squares[i].scale.setTo(0.88*IGratio)
      squares[i].idx = i
      squares[i].inputEnabled = true
      squares[i].events.onInputDown.add(SScheckHit,this)
      if (!isAndroid & !isiOS) {
          squares[i].events.onInputOver.add(SSshowNameOn,this)
          squares[i].events.onInputOut.add(SSshowNameOff,this)
      }
      checks[i] = IGaddSprite(sqLoc.x+(xoff*sqspacing),sqLoc.y+(yoff*sqspacing),'correct')
      checks[i].visible = false
      if (EventType!="WhateverWontWork") {

        if (isAndroid || isiOS) {
            var ff = 16//ßMath.ceil(16*IGratio)
            var tsty = { font: ff+"px Helvetica Neue", fill: "#ffffff", align: "center", wordWrap: true,
                wordWrapWidth: sqspacing,strokeThickness: 4 }
            titlestxt[i] = IGaddText(sqLoc.x+(xoff*sqspacing),sqLoc.y+(yoff*sqspacing)+sqspacing/3,titles[i],
                tsty)
            IGhide(titlestxt[i],false)
        } else {
            var voff = titles[i].length/15
            if (voff>1 & titles[i].length<21) {voff=1}
            if (voff>2 && titles[i].length<26) {voff=2}
            titlestxt[i] = IGaddDivText({xloc:sqLoc.x+(xoff*sqspacing),
                yloc:sqLoc.y+(yoff*sqspacing)-IGratio*(8+voff*15),
          	    size:Math.ceil(17*IGratio),text:titles[i],width:0.8*sqspacing,color:"#fff",weight:300,
                rtn: "SScheckHitDiv", arg: i.toString()})
            titlestxt[i].idx = i
            titleshade[i] = IGaddSprite(sqLoc.x+(xoff*sqspacing),sqLoc.y+(yoff*sqspacing),'shade')
            titleshade[i].alpha = 0.75
            titleshade[i].scale.setTo(IGratio*0.66)
            IGhide(titleshade[i],true)
            IGhide(titlestxt[i],true)
        }
      }
      if (EventType=="Cities" || (EventType=="Science" && clue=="actor")) {
        helps[i] = null
    } else {
        helps[i] = IGaddSprite(sqLoc.x+(xoff*sqspacing)-corner,sqLoc.y+(yoff*sqspacing)+corner,'itemhelp')
        helps[i].inputEnabled = true
        helps[i].idx = idxes[i]
        helps[i].events.onInputDown.add(SSshowAltClues,this)
      }

    }

    var descBG// = IGaddSprite(descLoc.x,descLoc.y,'objbg')
    if (landscape) {
        descBG = IGaddBoxDIV({xloc:descLoc.x,yloc:descLoc.y+ry(12),width:boxW,height:boxH*0.9})
    } else {descBG = IGaddBoxDIV({xloc:descLoc.x,yloc:descLoc.y+ry(20),width:boxW,height:0.85*boxH})}
    // must come after the desc box to be sure to be on top

    var desctext = evDescriptions[currentObj]
    var mhide = true
    if (desctext.length>descLen) {
        var pos = IGfindPrevious(desctext.substring(0,descLen),' ')
        desctext = desctext.substring(0,pos) + "..."
        mhide = false
    }

    descr = IGaddDivText({xloc:descLoc.x, yloc:descLoc.y,text:desctext,
            width:boxW-rx(16),height:boxH,size:Math.floor(IGratio*15),color:'#000',weight:'300'})

    var coff = (landscape) ? IGratio*44 : IGratio*14
    IGaddDivText({xloc:descLoc.x, yloc:descLoc.y-boxH/2+coff,text:"Clue",
            size:Math.floor(IGratio*16),color:'#000',weight:'400'})
    // button has to be after description to be on top
    moreBtn = IGaddDivButton({xloc:moreLoc.x,yloc:moreLoc.y, text: "more...",rtnf: 'SSshowDescr'});

    if (mhide) {
        IGhide(moreBtn,true)
    } else {IGhide(moreBtn,false)}

    var tx = (EventType == "Museum") ? " the " : ""
    IGaddDivText({xloc:WIDTH/2-centerW-(columnW/2), yloc:36,
    	text: "Clues into "+tx+displayTopics[EventType],
    	width:300,height:50, size:18,color:'#000000',weight:400})

    IGaddText(hitLoc.x,hitLoc.y,"Remaining",hstylecvvs)
    hits = IGaddText(hitLoc.x,hitLoc.y+ry(30),numSquares,hstylecvvs)

    IGaddText(timeLoc.x,timeLoc.y,"Time",hstylecvvs)
    IGtnumSecs = IGaddText(timeLoc.x,timeLoc.y+ry(30),"0",hstylecvvs)

    greenEx = IGaddSprite(0,0,'wrong')
    greenEx.visible = false

    if (preloadBar) {preloadBar.visible = false; preloadBar.destroy()}
    preloadBar = null
    notLoaded = false
    instruct2.setText("")

    IGstopSpinner()
    IGanalytics(['Squares', 'Load', EventType]);

    // moreBtn.bringToTop()

    helpTextLocal = helpTextSS[0]
    for (var i=1; i<8; i++) {helpTextLocal = helpTextLocal + "\n\n"+helpTextSS[i]}

    var dbsiz = "\n\n\n"+numSquares+" "+ObjTypes[EventType2]+" selected from "+EventNum+" in "+displayTopics[EventType2]+"."

    IGalertDIV("\n\nTap the image that matches each clue."+dbsiz,"auto",false,true,true,16)
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
    IGcleanupTexts()

  }
}
