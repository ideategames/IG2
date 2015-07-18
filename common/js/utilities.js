/******************************************

	utilities
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//

*//////////////////////////////////////////

// used to stop swiping if needed
var IGisIGServer
IGdragging = false
IGtick = {}
IGclick = {}
IGinvBut = 'invbut'
IGinvIcon = 'invicon'
IGalertBG = 'alertbg'
var IGalertBGDIV
IGalertBigBG = 'alertbigbg'
IGalertBigBGW = 'alertbigbgw'
IGgreyScreen = 'IGgreyScreen'
var IGgreyScreenDIV
var IGalertText
var IGtextString = ""
IGtextBoxBG = 'textboxgbg'
var IGtextBoxText, IGpasswordBox, IGgamePWDSprite, Telement, IGblankScreen
IGtimerFlag = false
IGnumSecs = 0
IGtotalSecs = 0
IGtnumSecs = {}
IGstillTrying = false
IGspinner = {}
IGbrace1 = null
IGbrace2 = {}
IGgameDiv = document.getElementById('game');
IGendBtn = 'endBtn'
IGidCtr = 0
var IGfilmBtn
var IGimgPath = "circular"
var IGwizardLevel = 0
var FBuserID, IGuseFB
// number of scores to use in calculating total score
// very important for Facebook awards
DMMscoreCount = 3

// Event flag mechanism to force synchronicity
//
var EFL1,EFL2,EFL3

function IGwfef(flag) {
    while (!flag) {if (flag) {IGconsole("flag set")}}
}

function IGgetGameCount() {
    return (DMMscores.length>DMMscoreCount) ? DMMscoreCount : DMMscores.length
}

// these should be defined previously in config.js
if (!CommonPath) {CommonPath = "/common/"}
if (!BasePath) {BasePath = "/"}

// have to have a default IP -- but it is ignored
clientIP = "0.0.0.0"

function IGgetNextID() {
    IGidCtr+=1
    return toString(IGidCtr)
}
IGspinOpts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};

IGgamePWD = "|"
IGalerting = false

function IGstartSpinner() {
    if (!IGgameDiv) {IGgameDiv = document.getElementById('game');}
    IGspinner = new Spinner(IGspinOpts).spin();
    IGgameDiv.appendChild(IGspinner.el);
}
function IGstopSpinner() {
    try {IGbrace1.destroy(); IGbrace1 = null;} catch (e) {}
    try {IGbrace2.destroy(); IGbrace2 = null;} catch (e) {}
    try {IGgameDiv.removeChild(IGspinner.el)} catch(e) {}

}
function IGtitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
function IGcount(str,char) {
    var cnt = 0
    for (var c=0;c<str.length;c++) {if (str[c]==char) cnt++}
    return cnt
}
function IGpadZero(num, lnth) {
    return Array(Math.max(lnth - String(num).length + 1, 0)).join(0) + num;
}
function IGconsole(msg) {
    if (IGdebug) {console.log(msg)}
}
function rx(xval) {
    return IGxratio*xval
}
function ry(yval) {
    return IGyratio*yval
}
function IGplur(num) {
    return (num==1) ? "" : "s"
}
function IGzero(num) {
    return (num==0) ? "no" : num
}
function IGmin(arr) {
    var sorted = arr.sort(function(a,b){return a-b})
    return sorted[0];
}
function IGfindPrevious(str,char) {
    var ptr = str.lastIndexOf(char)
    return ptr
}
function IGsetText(obj, str) {
    if (obj.innerHTML) {obj.innerHTML = str;} else {obj.setText(str);}
}
function IGwrap(str,fnt,wrap) {
    var lnth = wrap/(fnt*0.6)
    var ret = ""
    var ptr = lnth
    var prev = 0
    var numlines = 1
    while (ptr<str.length) {
        ptr = IGfindPrevious(str.substring(0,ptr),' ')
        ret = ret + str.substring(prev,ptr) + '\n'
        prev = ptr
        ptr +=lnth
        numlines ++
    }
    ret = ret + str.substring(prev)
    var yoff = (numlines * 1.2*fnt)/2
    return [ret,yoff]
}
function enter_fullscreen() {
	game.stage.scale.startFullScreen();

}
function exit_fullscreen() {
	game.stage.scale.startFullScreen();

}
function notReady() {
	alert("Not ready yet.")
}

IGdispatchGame = function() {
    game.state.start('entry',true,true)
}

IGdispatchEvent2 = function(topic) {
    IGaddMenuBar(WIDTH/2+IGxratio*304+IGxratio*123)
    IGstartSpinner()

    DMMgameReset()
    IGconsole("Topic: "+topic)
    EventType = topic

    $.getScript(CommonPath+"js/"+EventType+"_data.js", function(data, textStatus) {
      // IGconsole(data); //data returned
      IGconsole("file load: "+textStatus+":"+EventNum); //success
      window.setTimeout(IGdispatchGame,100)
    });
}
var GeoLocLat = {}
GeoLocLat.reset = {}
GeoLocLat.setText = {}
var GeoLocLong = {}
GeoLocLong.reset = {}
GeoLocLat.setText = {}
function IGgetGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(IGshowGeoLoc, IGshowGeoError);
        
    };
}
function IGshowGeoLoc(position) {
    IGconsole("loc: "+position.coords.latitude+":"+position.coords.longitude)
    GeoLocLat.setText(position.coords.latitude.toFixed(4));
    GeoLocLong.setText(position.coords.longitude.toFixed(4));
}
function IGshowGeoError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            GeoLocLat.setText("User denied the request for Geolocation.")
            GeoLocLong.setText("")
            break;
        case error.POSITION_UNAVAILABLE:
            GeoLocLat.setText("Location information is unavailable.")
            GeoLocLong.setText("")
            break;
        case error.TIMEOUT:
            GeoLocLat.setText("The request to get user location timed out.")
            GeoLocLong.setText("")
            break;
        case error.UNKNOWN_ERROR:
            GeoLocLat.setText("An unknown error occurred.")
            GeoLocLong.setText("")
            break;
    }
}
function IGtopicSelect(AppTopics) {
        // topic icons
        var topicCount = 0
        for (var top in AppTopics) {topicCount++}
            IGconsole("topics: "+topicCount)
        var i = 0
        // if only 1 topic, jump right to the game (for partners)
        if (topicCount<2) {
            var top = Object.keys(BrTopics)
            IGdispatchEvent2(top[0]);
            return;
        }

        var sc = (HEIGHT<590) ? HEIGHT/590 : 1.0
        var rowcnt = (topicCount<8) ? 4 : Math.ceil(topicCount/2)
        var midvert = rowcnt/2*65
        for (var top in AppTopics) {
            // because buckets uses a higher base, only shrink with width
            var xsc = 450*IGratio
            var ysc = 56*IGxratio
            var xoff = ((i %2)==0) ? MIDX-xsc/2-5 : MIDX+xsc/2+5
            var yoff = sc*midvert+Math.floor(i/2)*60
            if (topicCount>10) yoff-= 80*sc
            var icon = (TopicIcons[top]) ? TopicIcons[top] : TopicIcons[EventType2]
                selTopics[top] = IGaddDivText({xloc: xoff,yloc:yoff, ifile: iTopics[top], hclass: "topicSelects", 
                    text: displayTopics[top].replace(/\\n/g,' ').replace(/\n/g,' '),
                    image: CommonPath+'pics/'+icon,talign: "left",
                    rtn: 'IGdispatchEvent2("'+AppTopics[top]+'")', width: xsc, height: ysc});

                i++;
        }
}
// function IGloadImage(iname,img) {
//     try {
//         game.load.image(iname, img)
//         IGconsole("found image")
//     } catch (e) {
//         game.load.image(iname, CommonPath+'pics/default_Icon.png')
//         IGconsole("loaded default image")
//     }
// }
function IGcalcTotalScore() {
    var countStop = DMMscores.length - IGgetGameCount()
    var totScore = 0
    var cnt = 0
    for (var i=DMMscores.length-1; i>(countStop-1); i--) {
        IGconsole("score: "+cnt+":"+DMMscores[i])
        totScore = totScore + DMMscores[i]
    }
    DMMtotalScore = totScore
    return totScore

}
var IGalertSprite, IGalertBigSprite, IGtextBoxSprite
var IGcallBack = []
var IGhelpBtn
var helpShowing
function IGshowHelp() {
    if (helpShowing) {
        IGdismissAlert()
        // IGhelpBtn.innerHTML = "Help"
        helpShowing = false
        // if (IGfilmBtn) {IGfilmBtn.style.display = 'block'}
    } else {
        // second param is for window size: default is big
        IGalertDIV(helpTextLocal,"auto",false,true,true,13)
        // IGhelpBtn.innerHTML = "Close"
        helpShowing = true
        IGanalytics([IGgameApp, 'Help', EventType]);
        // if (IGfilmBtn) {IGfilmBtn.style.display = 'none'}
    }
    // IGhelpBtn.style.display = 'block';
}

function IGdismissAlert(ev) {
    IGblankScreen.visible = false
    if (IGalertBigSprite) {IGalertBigSprite.visible = false}
    if (IGalertSprite) {IGalertSprite.visible = false}
    if (ev) {ev.visible = false}
    IGalertText.setText("")
    IGalerting = false
    if (IGcallBack) {
        var cb = IGcallBack.pop()
        window.setTimeout(cb,100)
    }
    // IGcallBack = null
    IGhideTexts(false)
}
function IGalert(text,size,callback,wrld,ishelp) {
    IGhideTexts(true)
    IGalerting = true
    IGcallBack.push(callback)
    var xoff = (wrld) ? game.camera.x + WIDTH/2 : WIDTH/2
    var yoff = (wrld) ? game.camera.y+HEIGHT/2 : HEIGHT/2
    if (size) {
        // for some reason, the big background is not appearing on new game
        // but more important, be sure it is on top
        if (IGalertBigSprite) {IGalertBigSprite.destroy();IGalertBigSprite = null}
        if (IGalertSprite) {IGalertSprite.destroy();IGalertSprite = null}
        if (IGalertBigSprite) {
            IGalertBigSprite.visible = true
        } else {
            IGalertBigSprite = IGaddSprite(xoff,yoff, IGalertBigBG)
            // IGalertBigSprite.inputEnabled = true
            // IGalertBigSprite.events.onInputDown.add(IGdismissAlert,this)
        }
        // IGalertBigSprite.bringToTop()
    } else {
        // // be sure it comes to the top
        // if (IGalertSprite) {IGalertSprite.destroy();IGalertSprite = null}
        if (IGalertSprite) {
            IGalertSprite.bringToTop()
            IGalertSprite.visible = true
        } else {
            IGalertSprite = IGaddSprite(xoff,yoff, IGalertBG)
            // IGalertSprite.inputEnabled = true
            // IGalertSprite.events.onInputDown.add(IGdismissAlert,this)
        }
        // IGalertSprite.bringToTop()
    }
    if (IGalertText) {IGalertText.destroy();IGalertText = null}
    var ttxt = (ishelp) ? text : text+'\n\n\nTouch the grey box to dismiss this message.'
    IGalertText = IGaddText(xoff,yoff,ttxt,tstylew)
    IGalertText.anchor.setTo(0.5,0.5)
    if (IGblankScreen) {IGblankScreen.destroy();IGblankScreen = null}
        IGblankScreen = IGaddSprite(MIDX,MIDY,'blankscreen')
        IGblankScreen.inputEnabled = true
    if (ishelp) {
        // IGfilmBtn.style.display = 'block';
    } else {
        IGblankScreen.events.onInputDown.add(IGdismissAlert,this)
    }


}
var IGaliasCallBack
var tmpBoxText
var Telement
function IGaddAlias() {
    if (Telement) {IGconsole("alias: " +Telement.value)}
    // if (!DMMalias) {try {DMMalias = document.getElementById('IGuserAlias').value.trim()} catch (e) {DMMalias="anonymous"}}
    if ((DMMalias=="anonymous") || (DMMalias.length<3))  {
        DMMalias = ""
        IGsetUpAlias(tmpBoxText,IGaliasCallBack)
        return
    }
    if (IGblankScreen) {IGblankScreen.destroy();IGblankScreen = null}
    IGconsole("alias: "+DMMalias)
    // if (IGgamePWDSprite) {IGgamePWDSprite.destroy(); IGgamePWDSprite=null}
    if (IGpasswordBox) {IGpasswordBox.destroy(); IGpasswordBox=null}
    IGdismissTextBox(IGtextBoxSprite)
    try {
        var foo = document.getElementById("game");
     
        //Append the element in page (in span).
        foo.removeChild(Telement);
    } catch(e) {IGconsole("error deleting input")}

        var sViewport = '<meta name="viewport" content="width=500"/>';
        var jViewport = $('meta[name="viewport"]');
        if (jViewport.length > 0) {
            jViewport.replaceWith(sViewport);
        } else {
            $('head').append(sViewport);
        }
    if (IGaliasCallBack) {game.time.events.add(100,IGaliasCallBack)}
}
function IGsetUpAlias(boxtext,callback) {
    IGconsole("in alias...")
    tmpBoxText = boxtext
    game.input.keyboard.addKey(9)
    IGaliasCallBack = null
    if (callback) {IGaliasCallBack = callback}

    if (IGblankScreen) {IGblankScreen.destroy();IGblankScreen = null}
    IGblankScreen = IGaddSprite(MIDX,MIDY,'blankscreen')
    IGblankScreen.inputEnabled = true

    game.input.keyboard.onUpCallback = function(e) {
        IGconsole("alias key: "+e.keyCode)
        // if (!repl) {IGgamePWDSprite.setText(IGgamePWDSprite.text.replace('|',''))}
        // repl = true
        // if (e.keyCode == 8) {IGgamePWDSprite.setText(IGgamePWDSprite.text.substring(0,IGgamePWDSprite.text.length-1))}
        if (e.keyCode == 13) {game.time.events.add(100,IGaddAlias)} //{window.setTimeout(enterGame,100)}
        // else if (e.keyCode != 9) {IGgamePWDSprite.setText(IGgamePWDSprite.text + String.fromCharCode(e.keyCode).toLowerCase())}
        DMMalias = Telement.value
    }

    IGtextBox(boxtext+"(minimum length: 3)",IGaddAlias,false)

    // if (IGpasswordBox) {IGpasswordBox.destroy(); IGpasswordBox=null}
    // IGpasswordBox = IGaddSprite(WIDTH/2,ry(140),'pwdbox')
    // IGpasswordBox.anchor.setTo(0.5,0.5)
    // IGpasswordBox.inputEnabled = true

    // if (IGgamePWDSprite) {IGgamePWDSprite.destroy(); IGgamePWDSprite=null}
    // IGgamePWDSprite = IGaddText(WIDTH/2,ry(140),"|",style3)
    // IGgamePWDSprite.anchor.setTo(0.5,0.5)

    Telement = document.createElement("input");
 
    //Assign different attributes to the element.
    Telement.setAttribute("class", "IGtemp")
    Telement.setAttribute("id", "IGuserAlias");
    Telement.setAttribute("type", "text");
    Telement.setAttribute("value", "");
    Telement.setAttribute("name", "alias");
    Telement.setAttribute("autofocus", "true");
    Telement.setAttribute("style", "position:absolute;left:calc(50% - "+rx(50)+"px);top:"+ry(140)+"px;width:100px;")
 
 
    var foo = document.getElementById("game");
 
    // var foo = $('#game')
    //Append the element in page (in span).
    foo.appendChild(Telement);

    // var sty = "position:absolute;left:"+(WIDTH/2-300)+"px;top:"+ry(140)+"px;width:600px;"
    // $('<input type="text" size="20" name="alias" autofocus="true" '+
    //     'style="'+sty+'"/>').appendTo(foo)

}

function IGdismissTextBox(ev) {
    if (IGtextBoxText) {IGtextBoxText.setText("")}
    if (IGtextBoxSprite) {IGtextBoxSprite.destroy();IGtextBoxSprite=null}
    if (ev) {
        ev.visible = false
        if (ev.callBack != IGaddAlias) {window.setTimeout(ev.callBack,200)}
    }
}
function IGtextBox(text,callBack,nobg,notxt) {
    // // be sure it comes to the top
    // if (IGalertSprite) {IGalertSprite.destroy();IGalertSprite = null}
    if (IGtextBoxSprite) {
        IGtextBoxSprite.destroy();IGtextBoxSprite=null}
    if (!nobg) {
        IGtextBoxSprite = IGaddSprite(WIDTH/2,ry(20), IGtextBoxBG)
        IGtextBoxSprite.anchor.setTo(0.5,0)
        IGtextBoxSprite.inputEnabled = true
        IGtextBoxSprite.events.onInputDown.add(IGdismissTextBox,this)

        IGtextBoxSprite.callBack = callBack
        IGtextBoxSprite.bringToTop()
    }
        if (IGtextBoxText) {IGtextBoxText.destroy();IGtextBoxText = null}
        if (!notxt) {
            var tt = (nobg) ? text : text+'\n\n\nTap or press Return when finished.'
        }
        var tsty = (nobg) ? tstyle : tstylew
        IGtextBoxText = IGaddText(WIDTH/2,ry(60),tt,tsty)
        IGtextBoxText.anchor.setTo(0.5,0)

}
function shuffleArray(array) {
    for (var i = array.length - 1; i > -1; i--) {
        var j = Math.floor(Math.random() * (array.length - 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function IGsumArray(array) {
    ret = 0
    for (var a=0;a<array.length;a++) {ret+=array[a]}
    return ret
}
function IGisInArray(value, array) {
        return array.indexOf(value) > -1;
    }
IGminEvents = {Strings: 9, Squares: 8, Buckets: 12, Stacks: 11, Doors: 11, Paths: 10}
function IGsetGlobalFunctions(register) {
    // this silly replacement is caused by differences in platform treatment of paths
    AppPath = AppPath.replace('//','/')
    IGlcapp = IGgameApp.toLowerCase()
    if (IGuseFB && !FBuserID && !IGisApp) {game.time.events.add(1000,IGcheckFacebookStatus,this)}

    IGconsole("FB result: "+FBuserID+":"+IGgameApp)
    if (register) {IGcheckIn(DMMalias,clientIP,EventType)}
    if (DMMalias=="wiwax") {IGdebug=true} else {IGdebug=false}
    if ( (EventType=="History") ) {
        IGimgPath = "small"
    }
    // clientIP is no longer used for check-in, it is read by the server
    // so the variable is ignored
    // IGconsole("world: "+game.world.getBounds().width)
    MIDX = (game.world.getBounds().width==0) ? WIDTH/2 : game.world.getBounds().width/2
    MIDY = (game.world.getBounds().height==0) ? HEIGHT/2 : game.world.getBounds().height/2
        game.load.audio('click', [CommonPath+'sounds/Effect_Click.ogg',CommonPath+'sounds/Effect_Click.mp3']);
        IGclick = game.add.audio('click');
        game.load.audio('tick', [CommonPath+'sounds/Effect_Tick.ogg', CommonPath+'sounds/Effect_Tick.mp3']);
        IGtick = game.add.audio('tick');
        game.load.audio('bell', [CommonPath+'sounds/correct-answer-2.ogg', CommonPath+'sounds/correct-answer-2.mp3']);
        IGbell = game.add.audio('bell');
        game.load.audio('buzzer', [CommonPath+'sounds/incorrect-answer.ogg', CommonPath+'sounds/incorrect-answer.mp3']);
        game.load.audio('buzzer2', [CommonPath+'sounds/Buzzer.ogg', CommonPath+'sounds/Buzzer.mp3']);
        IGbuzzer = game.add.audio('buzzer');
        IGbuzzer2 = game.add.audio('buzzer2');
        game.load.audio('bang', [CommonPath+'sounds/Flashbang-Kibblesbob-899170896.mp3'])
        IGbang = game.add.audio('bang');
        game.load.image(IGinvBut, CommonPath+'pics/invBut.png')
        game.load.image(IGinvIcon, CommonPath+'pics/invButIcon.png')
        game.load.image(IGalertBG,CommonPath+'pics/alertBack.png')
        IGalertBGDIV = CommonPath+'pics/alertBack.png'
        game.load.image(IGalertBigBG,CommonPath+'pics/alertBigBack.png')
        game.load.image(IGalertBigBGW,CommonPath+'pics/alertBigBackWL.png')
        game.load.image(IGtextBoxBG,CommonPath+'pics/textBoxBack.png')
        game.load.image(IGgreyScreen,CommonPath+'pics/greyScreen.png')
        IGgreyScreenDIV = CommonPath+'pics/greyScreen.png'
        game.load.image('pwdbox', CommonPath+'pics/passwordBox.png');
        game.load.image('blankscreen',CommonPath+'pics/blankScreen.png')
        game.load.image('IGblankBut',CommonPath+'pics/blankBut.png')
        game.load.image(URLbut, CommonPath+'pics/grey_l.png');
        game.load.image('filmback', CommonPath+'pics/filmBack.png');
        game.load.image('tbutton', CommonPath+'pics/blank_text_l.png');

        game.load.image(IGendBtn,CommonPath+'pics/endBtn.png')

}
function IGturnOff(ev) {
    // IGconsole("button off")
    IGgameDiv.removeChild(ev.overlay)
    ev.callBack(ev)
    // window.setTimeout(ev.callBack(ev),100)
}
function IGpushButton(ev) {
    IGtick.play();
    //Append the element in page (in span).
    IGgameDiv.appendChild(ev.overlay);
    game.time.events.add(500,IGturnOff,this,ev)
    // window.setTimeout(IGturnOff(ev), 400);
}
function IGaddOverlay(btn,callback) {

    if (!IGgameDiv) {IGgameDiv = document.getElementById("game");}

    var currentOverlay = document.createElement("div");
 
    //Assign different attributes to the element.
    currentOverlay.setAttribute("id", "overlay");


    var xoff = btn.width/2
    // for centering divs on wide screen
    // assumes buttons here are not divs
    var yoff = btn.y-btn.height/2+4
    currentOverlay.setAttribute("style", 
        "background-color:#99bbff;position:absolute;left:calc(50%-"+xoff+"px);top:"+
        yoff+"px;width:"+(btn.width-8)+"px;height:"+(btn.height-8)+"px;")
 
    btn.overlay = currentOverlay
    btn.callBack = callback
    btn.events.onInputDown.add(IGpushButton,btn);
    return btn
}
function IGcheckIn(alias,userIP) {
    console.log("alias: "+DMMalias)
    DMMGetHttpRequest({query: "checkIn", userIP: userIP},"checkIn")
}

function IGshorten(str,lnth) {
    // IGconsole("length: "+pos)
    var ret = str
    if (str.length>lnth) {
        var pos = IGfindPrevious(str.substring(0,lnth)," ")
        ret = str.substring(0,pos)+"..."
    }
    // IGconsole("length: "+pos)
    return ret
}
function IGgetFirst(txt) {
    var pos = txt.indexOf(';')
    var pos2 = (pos) ? pos : txt.length-1
    return txt.substring(0,pos2)
}
function IGtimerRunning() {
    if (IGtimerFlag) {
        IGnumSecs++;
        IGtnumSecs.setText(IGnumSecs+" ")
    }
}
function IGstartTimer() {
    if (!IGtimerFlag) {
        IGtimerFlag = true
        game.time.events.loop(1000, IGtimerRunning, this);
    }
}
function IGstopTimer() {
    IGtimerFlag = false
}
function IGaddText(xloc, yloc, txt, style) {
    if (xloc.xloc) {
        // using parameters
        IGconsole("using parameters")
        var xloc2 = xloc.xloc
        var yloc = xloc.yloc
        var txt = xloc.text
        var wgt = (xloc.weight>200) ? "bold " : ""
        var style = {font: wgt+xloc.size+"px Helvetica Neue", fill: xloc.color,
            align: "center", wordWrap: true, wordWrapWidth: xloc.width}
    } else {
        var xloc2 = xloc
    }
    var ret = game.add.text(xloc2, yloc, txt, style)
    ret.scale.setTo(IGratio,IGratio)
    ret.anchor.x = Math.round(ret.width * 0.5) / ret.width
    ret.anchor.y = Math.round(ret.height * 0.5) / ret.height
    ret.reset = function(xloc,yloc) {
        ret.x = xloc;
        ret.y = yloc;
    }
    // ret.anchor.setTo(0.5,0.5)
    return ret
}
function IGaddSprite(xloc,yloc,name,fcn,ctxt) {
    var ret = game.add.sprite(xloc,yloc,name)
    ret.scale.setTo(IGratio,IGratio)
    ret.anchor.setTo(0.5,0.5)
    if (fcn) {
        ret.inputEnabled = true
        var ctx = (ctxt) ? ctxt : ret
        ret.events.onInputDown.add(fcn,ctx)
    }
    ret.xloc = function() {return ret.x}
    ret.yloc = function() {return ret.y}
    return ret
}
function IGsetStage(bgcolor) {
    if (!IGaltBG) {IGaltBG = '#000000'}
    var bg = IGaltBG
    if (bgcolor) {bg = bgcolor}
    else if (IGwhite) {bg = IGbackground}
    game.stage.backgroundColor = bg;
    // game.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // game.stage.scale.pageAlignHorizontally = true;
    // game.stage.scale.setScreenSize(true);
    // if (this.game.device.android && this.game.device.chrome == false) {
    //     this.game.stage.scaleMode = Phaser.StageScaleMode.EXACT_FIT;
    // }
    // this.game.stage.scale.maxIterations = 1;
}
function IGcheckOverlap(spriteA, spriteB) {
    var ret = false
    try {
        ret = game.physics.overlap(spriteA, spriteB)
    } catch (e) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        ret = Phaser.Rectangle.intersects(boundsA, boundsB);
    }
    // for some reason, if I move a sprite with resetting x and y, then the above does not register it
    if (!ret) {if ((spriteA.x == spriteB.x) & (spriteA.y == spriteB.y)) {ret = true}}
    return ret

}

var bigImage
var bigImageCredit
var creditBut
var URLbut = 'urlcover'
var URLbutb = 'urlcoverb'
var filmBut
var filmBack
var filmButs = []
var credSc  = 1.0

var savedImgIdx
function IGmoveFilmstrip(dir) {
    var newIdx = savedImgIdx + parseInt(dir)
    if (!iimgstxt[newIdx]) {
        if (dir=='1') {newIdx = 0} else {newIdx=iimgstxt.length-1}
    }
    savedImgIdx = newIdx
    bigImage.destroy(); bigImage = null
    bigImage = game.add.sprite(WIDTH/2, HEIGHT/2, iimgs[newIdx]);
        var scbi = (600/bigImage.width<400/bigImage.height) ? 600/bigImage.width : 400/bigImage.height
        if (bigImage.height>400 || bigImage.width>600) {
            bigImage.scale.setTo(scbi,scbi)
        }
    bigImageCredit.setText(iimgstxt[newIdx])
    bigImage.anchor.setTo(0.5,0.5)
    // bigImage.idx = newIdx
    // bigImage.inputEnabled = true
    // bigImage.events.onInputDown.add(IGmoveFilmstrip, this);
    // filmButs[2].idx = newIdx
    // var tidx = newIdx - 2
    // if (tidx < 0) {tidx = iimgstxt.length-1}
    // filmButs[3].idx = tidx

    // img.destroy();
    // img = null;
    // destroy and re-create to be sure it is on top
    bigImageCredit.destroy()
    bigImageCredit = null
    creditBut.destroy()
    creditBut = null
    creditBut = game.add.sprite(WIDTH/2,HEIGHT-40,URLbut)
    creditBut.anchor.setTo(0.5,0.8)
    var tmp = iimgstxt[newIdx].indexOf("http:")
    creditBut.url = $.trim(iimgstxt[newIdx].substring(tmp))
    creditBut.inputEnabled = true
    creditBut.events.onInputDown.add(loadURL,this)
    bigImageCredit = game.add.text(WIDTH/2,HEIGHT-40,iimgstxt[newIdx],hstyle3)
    bigImageCredit.anchor.setTo(0.5,1)
    bigImageCredit.scale.setTo(credSc,credSc)
    bigImageCredit.visible = true

}
var IGcomment,IGcommentDIV, IGnotReallyComment
function IGsendComment() {

    if (IGnotReallyComment) {
        IGconsole("not a comment")
        IGtextString = IGcomment.value;
        var cb = IGcallBack.pop()
        game.time.events.add(200,cb,this);
        IGnotReallyComment = false

    } else {
        var packet = {query: "sendComment",gameApp: IGgameApp, comment: IGcomment.value}
        DMMGetHttpRequest(packet,"sendComment")
    }

    // IGconsole("\ncleaning up text...\n")
    var nodeList = document.getElementsByClassName('IGcomment');
    while (nodeList.length>0) {
        // IGconsole("\nremoving node\n")
        nodeList = document.getElementsByClassName('IGcomment')
        nodeList[0].parentNode.removeChild(nodeList[0]);
    }
}
function IGnoComment() {
    // IGconsole("\ncleaning up text...\n")
    var nodeList = document.getElementsByClassName('IGcomment');
    while (nodeList.length>0) {
        // IGconsole("\nremoving node\n")
        nodeList = document.getElementsByClassName('IGcomment')
        nodeList[0].parentNode.removeChild(nodeList[0]);
    }
}

function IGaddComment(getText, rtn) {
    //
    // if getText, then just asking for text input
    if (getText && rtn) {
        IGcallBack.push(rtn)
        IGnotReallyComment = getText
    } else {IGnotReallyComment = false}
    var endScreen = document.createElement("div");
    endScreen.setAttribute("class", 'IGtemp IGendScreen IGcomment');
    document.getElementById("game").appendChild(endScreen);

    var wid =  "50%;"
    var xoff = "25%;"

    var hclass,hclass1
            hclass = "IGtemp menuDiv IGcomment"
            hclass1 = "IGtemp endContainS IGcomment"

    var fontchg = "top:3%;font-size:14px;"

    IGcommentDIV = document.createElement("div");
    // IGconsole("rtn: "+rtnf)
    IGcommentDIV.setAttribute("class", hclass)
    IGcommentDIV.setAttribute("style", "left: "+xoff+";width:"+wid)

    var endDIV1 = document.createElement("div");
    // IGconsole("rtn: "+rtnf)
    endDIV1.setAttribute("class", hclass1)
    endDIV1.setAttribute("style",fontchg)
    endDIV1.innerHTML = (getText) ? "Enter your search string" : "<b>Enter your comment or suggestion.</b><br/>('"+IGgameApp+"' and '"+EventType+"' will be appended for context.)"

    IGcomment = document.createElement("textarea");
 
    //Assign different attributes to the element.
    IGcomment.setAttribute("class", "IGtemp")
    IGcomment.setAttribute("id", "IGcomment");
    IGcomment.setAttribute("type", "text");
    IGcomment.setAttribute("value", "");
    IGcomment.setAttribute("name", "alias");
    IGcomment.setAttribute("autofocus", "true");
    IGcomment.setAttribute("style", "position:absolute;left:calc(10%);top:60px;width:80%;")

    // add submit and cancel buttons
    var b1 = document.createElement("button");
    b1.setAttribute("class", "btn btn-primary");
    b1.setAttribute("type", "button")
    b1.setAttribute("onclick",'IGnoComment()');
    b1.setAttribute("style", "position:absolute;left:20px;top:180px;")
    b1.innerHTML = 'Cancel'
    var b2 = document.createElement("button");
    b2.setAttribute("class", "btn btn-primary");
    b2.setAttribute("type", "button")
    b2.setAttribute("onclick",'IGsendComment()');
    b2.setAttribute("style", "position:absolute;right:20px;top:180px;")
    b2.innerHTML = 'Submit'

    IGcommentDIV.appendChild(endDIV1)
    IGcommentDIV.appendChild(IGcomment)
    IGcommentDIV.appendChild(b1)
    IGcommentDIV.appendChild(b2)

    document.getElementById("game").appendChild(IGcommentDIV);

    return IGcommentDIV

}
var filmsOn = false
showfilmButs = function(dir) {
    // for (var f=0;f<filmButs.length;f++) {filmButs[f].visible = dir;}// filmButs[f].bringToTop()}
    if (!dir) {
        var nodeList = document.getElementsByClassName('filmBut');
        while (nodeList.length>0) {
            // IGconsole("\nremoving node\n")
            nodeList = document.getElementsByClassName('filmBut')
            nodeList[0].parentNode.removeChild(nodeList[0]);
        }
    }
}
function IGenter_filmstrip(e) {
    // not sure why ev and this seem not to be set
    // using a global variable instead. A bug somewhere
    if (!filmBack) {
        filmBack = IGaddSprite(WIDTH/2,HEIGHT/2,'filmback');
        filmBack.scale.setTo(IGratio)
        filmBack.inputEnabled = true
    }
    if (e) {IGconsole('entering filmstrip')}
    if (filmsOn) {
        IGhideTexts(false)
        showfilmButs(false)
        filmsOn = false
        bigImage.destroy();
        bigImage = null;
        if (IGfilmBtn) {IGfilmBtn.visible = false;IGfilmBtn.setText("All Images")}
        bigImageCredit.destroy()
        creditBut.destroy()
        creditBut = null
        filmBack.visible = false
        if (this.callback) {window.setTimeout(this.callback,200)}
    } else {
        IGhideTexts(true)
        filmBack.bringToTop();
        // if (filmButs[0]) {
        //     for (var f=0;f<filmButs.length;f++) {filmButs[f].destroy(); filmButs[f] = null;}
        // }
            // need 2 texts and 2 buttons
        filmsOn = true
        if (IGfilmBtn) {IGfilmBtn.visible = true;IGfilmBtn.style.display = 'block';IGfilmBtn.setText("Close")}
        bigImage = game.add.sprite(WIDTH/2, HEIGHT/2, iimgs[0]);
        bigImage.anchor.setTo(0.5,0.5)
        var scbi = (600/bigImage.width<500/bigImage.height) ? 600/bigImage.width : 500/bigImage.height
        if (bigImage.height>500 || bigImage.width>600) {
            bigImage.scale.setTo(scbi,scbi)
        }
        // bigImage.idx = 0
        // bigImage.inputEnabled = true
        // bigImage.events.onInputDown.add(IGmoveFilmstrip, this);
        creditBut = game.add.sprite(WIDTH/2,HEIGHT-40,URLbut)
        creditBut.anchor.setTo(0.5,0.8)
        var tmp = iimgstxt[0].indexOf("http:")
        creditBut.url = $.trim(iimgstxt[0].substring(tmp))
        creditBut.inputEnabled = true
        creditBut.events.onInputDown.add(loadURL,this)
        bigImageCredit = game.add.text(WIDTH/2,HEIGHT-40,iimgstxt[0],hstyle3)
        bigImageCredit.anchor.setTo(0.5,1)
        bigImageCredit.scale.setTo(credSc,credSc)
        bigImageCredit.visible = true
        filmBack.visible = true

// <a class="back left carousel-control" href="#" onclick="dispatch();return false;" role="button" data-slide="prev">
//     <i class="fa fa-chevron-left fa-3x"></i>
// </a>
        var adj = window.innerWidth/1600
        var yoff = ry(20)
        // 130 is the width of the character
        var xoff = WIDTH/2 + MXOFF - 140*adj - IGratio*400
        filmButs[0] = document.createElement("a");
        filmButs[0].setAttribute("class", "IGtemp filmBut carousel-control")
        filmButs[0].setAttribute('onclick', 'IGmoveFilmstrip(-1)')
        filmButs[0].setAttribute('role','button')
        // filmButs[0].setAttribute('style',"position:absolute;top:"+parseInt(yloc)+"px;left:"+parseInt(xloc2)+"px;")
        filmButs[0].setAttribute('style',"float:none;position:absolute;margin-right:auto;margin-left:auto;left:"+parseInt(xoff)+"px;top:"+parseInt(yoff)+"%;")
        var chevl = document.createElement("i");
        chevl.setAttribute("class", "IGtemp fa fa-chevron-left fa-3x")
        filmButs[0].appendChild(chevl);
        filmButs[1] = document.createElement("a");
        filmButs[1].setAttribute("class", "IGtemp filmBut back right carousel-control")
        filmButs[1].setAttribute('onclick', 'IGmoveFilmstrip(1)')
        filmButs[1].setAttribute('role','button')
        filmButs[1].setAttribute('style',"position:absolute;margin-left:auto;margin-right:0;right:"+parseInt(xoff)+"px;top:"+parseInt(yoff)+"%;")
        var chevr = document.createElement("i");
        chevr.setAttribute("class", "IGtemp fa fa-chevron-right fa-3x")
        filmButs[1].appendChild(chevr);
        document.getElementById("game").appendChild(filmButs[0]);
        document.getElementById("game").appendChild(filmButs[1]);
        savedImgIdx = 0
        IGanalytics([IGgameApp, 'Images', EventType]);
    }
}
var leaderBoardDIVs, againRtn, subjRtn, diffRtn, resumeRtn, IGposted
function IGgetNextSet() {
    IGposted = false
    IGconsole("getting next")
    game.state.start('entry',true,true)
}
function IGeventsReset() {
    // reset user variables
    // but not scores, which add up
    // DMMnumStrings = 0
    DMMscore = 0
    numChecks = 0
    IGnumSecs = 0
    IGtimerFlag = false
    IGstillTrying = false
    IGposted = false
}
function isBadScore(scores,newsc) {
    var ret = false
    if (scores.length>9) {if (newsc<scores[9].score) {ret = true}}
    if (!ret) {
        for (var s=0;s<scores.length;s++) {
            if ((scores[s].alias==DMMalias) && (newsc<=scores[s].score)) {
                ret = true;
                break;
            }
        }
    }
    return ret
}
function IGleaderLayout() {
    // set the overall background and div layout
    var badScore = isBadScore(DMMleaders,DMMtotalScore) //false
    // if (DMMleaders.length > 9) {
    //     if (parseInt(DMMtotalScore)<=parseInt(DMMleaders[9].score)) {badScore = true}
    // }
    var scores = ""
    for (var s=0;s<DMMleaders.length;s++) {
        scores = scores+"<tr><td align='center'>"+DMMleaders[s].score+"</td><td align='center'>"+
        DMMleaders[s].alias+"</td><td align='center'>"+
        DMMleaders[s].post_time+"</td></tr>"
    }
    var msg = "<h3>"+lbText[0] + EventType + "</h3>\n\n"+
        lbhText[1] + "\t\t"+DMMtotalScore +
        "<table align='center' text-align='center' border='0' width='90%'>"+
        "<tr><td align='center' width='30%'><b>What</b></td><td align='center' width='30%'><b>Who</b></td>"+
        "<td align='center' width='30%'><b>When</b></td></tr>"+scores+"</table>"
    // need to add all the other text
    // how to format in columns?
    leaderBoardDIVs = IGmessageDIV(msg,false,false,false,true,true)

    var b1 = document.createElement("button");
    b1.setAttribute("class", "btn btn-primary");
    b1.setAttribute("type", "button")
    b1.setAttribute("onclick",againRtn+'()');
    // if (isWide) {b1.setAttribute("style","position:relative:float-left;")}
    b1.innerHTML = 'Play Again'


    var b2 = document.createElement("button");
    b2.setAttribute("class", "btn btn-primary");
    b2.setAttribute("type", "button")
    b2.setAttribute("onclick",subjRtn+'()');
    // if (isWide) {b2.setAttribute("style","position:absolute:left:calc(50% + 200px);")}
    b2.innerHTML = 'Change Subject'


    var b3 = document.createElement("button");
    b3.setAttribute("class", "btn btn-primary");
    b3.setAttribute("type", "button")
    b3.setAttribute("onclick",diffRtn+'()');
    // if (isWide) {b3.setAttribute("style","position:absolute:left:calc(50% - 200px);")}
    b3.innerHTML = 'Play a Different Game'

        var b4 = document.createElement("button");
        b4.setAttribute("class", "btn btn-primary");
        b4.setAttribute("type", "button")
        b4.innerHTML = 'Post Score'
        if (badScore || IGposted) {
            b4.setAttribute("style","opacity:0.3")
        } else {
            b4.setAttribute("onclick",'IGprePostScore()');
        }

    leaderBoardDIVs[1].appendChild(b1);
    leaderBoardDIVs[1].appendChild(b2);
    if (leaderBoardDIVs[2]) {
        leaderBoardDIVs[2].appendChild(b3);
        leaderBoardDIVs[2].appendChild(b4);
    } else {
        leaderBoardDIVs[1].appendChild(b3);
        if (b4) {leaderBoardDIVs[1].appendChild(b4);}

    }

    document.getElementById("game").appendChild(leaderBoardDIVs[0]);
}
function IGleaderBoard() {
    function partB() {
        if (IGactiveComm) {
            game.time.events.add(500,partB,this)
        } else {IGleaderLayout()}

    }
    // the timeout is to be sure that the initial fetch of data above 
    // is completed before drawing the screen. 
    // Eventually, we will put a subject choice screen first, but this
    // is needed for now.
    game.time.events.add(500,partB,this)

}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

IGexit = function(ev) {
    IGstartSpinner()
    var ifile = "index"
    if (ev.targ) {
        switch (ev.targ) {
            case "Strings":
                ifile = "index";
                break;
            case "Squares":
                ifile = "ssindex";
                break;
            case "Doors":
                ifile = "dindex";
                break;
            case "Stacks":
                ifile = "sindex";
                break;
            case "Paths":
                ifile = "pindex";
                break;
        }
        window.open('/launch/'+ifile+'.html?alias='+DMMalias,"_self")
    } else {IGconsole("error, no game"); loadURLExt('/index.html?alias='+DMMalias);}
}
function IGchangeGame() {
    var base = (IGpartner) ? "partners/"+IGpartner+"/" : ""
    window.open(BasePath+base+'index.html?alias='+DMMalias,'_self')
}
IGcurrentDIV = []
function IGresume() {
     // IGconsole("\ncleaning up text...\n")
    var tdiv = IGcurrentDIV.pop()
    // IGconsole("removing divs: "+tdiv)
    var nodeList = document.getElementsByClassName(tdiv);
    while (nodeList.length>0) {
        // IGconsole("\nremoving node\n")
        nodeList[0].parentNode.removeChild(nodeList[0]);
        nodeList = document.getElementsByClassName(tdiv)
    }
    if (tdiv!="IGalert") {
        var nodeList = document.getElementsByClassName('gameEndA');
        while (nodeList.length>0) {
            // IGconsole("\nremoving node\n")
            nodeList[0].parentNode.removeChild(nodeList[0]);
            nodeList = document.getElementsByClassName('gameEndA')
        }
        var nodeList = document.getElementsByClassName('menuDiv');
        while (nodeList.length>0) {
            // IGconsole("\nremoving node\n")
            nodeList[0].parentNode.removeChild(nodeList[0]);
            nodeList = document.getElementsByClassName('menuDiv')
        }
        nodeList = document.getElementsByClassName('gameEndL');
        while (nodeList.length>0) {
            // IGconsole("\nremoving node\n")
            nodeList[0].parentNode.removeChild(nodeList[0]);
            nodeList = document.getElementsByClassName('gameEndL')
        }
        nodeList = document.getElementsByClassName('IGendScreen');
        while (nodeList.length>0) {
            // IGconsole("\nremoving node\n")
            nodeList[0].parentNode.removeChild(nodeList[0]);
            nodeList = document.getElementsByClassName('IGendScreen')
        }
    }
    if (helpShowing) {helpShowing = false}
        var cb = IGcallBack.pop()
    game.time.events.add(200,cb,this);
}
function IGdrawCircle(xloc,yloc,wid,border,color,fill) {
    // if fill, then use beginFill etc [TBD]
    // for dashed, 20 dashes per circle
    // for dotted, 40 dots per circle
    var col = (color) ? color : 0
    var freq = 1
    if (border=="dashed") {freq = 12} else if (border=="dotted") {freq = 40}
    var lnth = Math.PI/freq
    IGconsole("arc lnth: "+lnth)
    // arcs are in radians (2*PI for a circle)
    var IGgraph = game.add.graphics(0,0)
    IGgraph.lineStyle(2,col, 3)
    var a = 0
    for (var a=0;a<freq;a++) {
        IGgraph.arc(xloc,yloc,wid/2,2*a*lnth,2*a*lnth+lnth)
    }
    if (fill) {
        IGgraph.beginFill(fill,1.0)
        IGgraph.drawCircle(xloc,yloc,wid/2-2)
        IGgraph.endFill()
    }

    return IGgraph
}


//
// THIS VERSION DOES NOT CUMULATE MASTERY.
// EVERY MASTERY IS AUTOMATICALLY BLUE RIBBON, 'MASTERY OF'
// WIZLEVEL IS ALWAYS 3 OR NOTHING
//
// careful, this is a duplicate definition for aids (see server.js)
aids = {Strings: '1580562312186768', Buckets: '753496904745456', Squares: '1383415398637351', Stacks: '', Doors: '1379064372407372', Paths: ''}
gameicons = {Strings: 'featBlue.png', Buckets: 'featTeal.png', Squares: 'featLavender.png', 
    Stacks: 'featYellow.png', Doors: 'featRed.png', Paths: 'featGreen.png'}
wizicons = {1: 'wizYellow2.png', 2: 'wizRed2.png', 3: 'wizBlue.png', 4: 'wizGreen2.png'}
wizards = {1: 'Competency in', 2: 'Proficiency in', 3: 'Mastery of', 4: 'Distinguished Master of'}
wizlevel = {1: 'competent', 2: 'proficient', 3: 'master', 4: 'distinguished',
    5: 'competent', 6: 'proficient', 7: 'master', 8: 'distinguished'}
gamedescs = {Strings: 'Strings is a sequencing game, put events or topics in chronological or numerical order.', 
    Buckets: 'Buckets is a quick game sorting objects into groups of the same category.', 
    Squares: 'Clues is a quick but tricky clue-event matching game.', 
    Stacks: 'Rooms is a many-room object to room sorting game.', 
    Doors: 'Collections is a many-room shortest-path object collection game.', 
    Paths: 'Paths is a player vs computer game of building categorized timelines of events.'}
IGwizardScores = {Strings: 149, Buckets: 270, Squares: 270, Stacks: 270, Doors: 270, Paths: 3}
AppMastery = 1

function IGfacebookCleanup() {
    // have to do this on delay because of the dialog with facebook after a post
    IGremoveFacebook()
    IGalertDIV("\n\nYour achievement has been posted to your Activity Log. If you want friends and others to see it, you "+
        "should enable it to your timeline and then set the sharing as you wish.","auto",false,true,true,14)

}
var objPost = {'og:url': "http://www.ideategames.org/"+extname[IGgameApp], 
    'og:title': 'Competent in British Museum Objects', 
    'og:type': 'igstrings:proficient', 
    'og:image': 'http://www.ideategames.org/common/pics/IGlogo.png', 
    'fb:app_id': aids[IGgameApp]}

var FBstatus
IGfacebookInit = function() {
    if (IGuseFB && !IGisApp) {
        try {
            FBstatus = FB.init({
              appId      : aids[IGgameApp],
              status : true,
              xfbml      : true,
              version    : 'v2.2'
            });
        } catch(e) {
            IGconsole("FB not available.")
        }
    }
};

function postMaster() {
    var whatpost = {}
    whatpost[wizlevel[IGwizardLevel]] = objPost
    // whatpost.privacy = {value: 'SELF'}
    FB.api(
       'https://graph.facebook.com/me/ig'+IGlcapp+':attain',
       'post',
        whatpost,
        function(response) {
            if (!response) {
                alert('Error occurred.');
            } else if (response.error) {
               document.getElementById('result').innerHTML =
                'Error: ' + response.error.message;
            } else {
               document.getElementById('result').innerHTML =
                '<a href=\"https://www.facebook.com/me/activity/' +
                response.id + '\">' +
                'Story created.  ID is ' +
                response.id + '</a>';
            }
        }
    );
    game.time.events.add(500,IGfacebookCleanup,this)
};
function IGremoveFacebook() {
    if (!FBuserID) {
        IGconsole("not logged in to Facebook3, unable to record data")
    } else {
        var packet = {query: "postMastery",gameApp: IGgameApp, fb_userID: FBuserID}
        DMMGetHttpRequest(packet,'postMastery')
    }
    var nodeList = document.getElementsByClassName('IGfacebook');
    while (nodeList.length>0) {
        // IGconsole("\nremoving node\n")
        try{
            nodeList[0].parentNode.removeChild(nodeList[0]);
            nodeList = document.getElementsByClassName('IGfacebook')
        } catch(e) {}
    }
}
var FBendDIV = {}
function IGupdateWizardStatus() {
    FBendDIV.innerHTML = ("\n\nYou are now ranked a "+wizards[IGwizardLevel]+" "+displayTopics[EventType].replace('\n',' ')+"!")
}
function IGcheckFacebookStatus() {
    var fbs
    if (IGuseFB && !FBuserID && !IGisApp) {
            try {
                fbs = FB.getLoginStatus(function(response) {
                    IGconsole("userID: "+response.authResponse.userID)
                    FBuserID = response.authResponse.userID
                });
            } catch (e) {IGconsole("no FB status")}
    }
    IGconsole("FBS result: "+fbs+":"+FBuserID)
    // if (FBuserID) {
        // var packet = {query: "getMastery",gameApp: IGgameApp, fb_userID: FBuserID}
        // DMMGetHttpRequest(packet,'getMastery')

    // }
    return FBuserID
}
function IGcheckToPostMastery() {
    if (!FBuserID) {FBuserID = IGcheckFacebookStatus()}
    if (!FBuserID) {
        IGconsole("not logged in to Facebook2")
        game.time.events.add(500,IGcheckToPostMastery,this)
    } else {
        // var packet = {query: "postMastery",gameApp: IGgameApp, fb_userID: FBuserID}
        // DMMGetHttpRequest(packet,'postMastery')
    }
}
function IGshowFacebookPost() {
    // if this is a duplicate, wizardLevel will be over 4
    // if (IGwizardLevel<5) {IGwizardLevel++}
    // IGfacebookInit()

    // IN THIS VERSION, IGwizardLevel is always 3
    //
    IGwizardLevel = 3

    if (!FBuserID) {FBuserID = IGcheckFacebookStatus()}
    if (!FBuserID) {
        IGconsole("not logged in to Facebook1")
        game.time.events.add(500,IGcheckToPostMastery,this)
    } else {
        // var packet = {query: "postMastery",gameApp: IGgameApp, fb_userID: FBuserID}
        // DMMGetHttpRequest(packet,'postMastery')
    }
    // var achtxt = (IGwizardLevel==1) ? "\n\nThis achievement was 90% of the maximum score "+
    //     "in 3 consecutive plays." :  "\n\nThis achievement was 90% of the maximum score "+
    //     "in 3 consecutive plays in each of "+IGwizardLevel+" different games ("+(IGwizardLevel*3)+" scores over 90%)."
    // keep it simple
    var achtxt = "\n\n"+TopicDescs[EventType]
    objPost['fb:app_id'] = aids[IGgameApp]
    objPost['og:type'] = 'ig'+IGlcapp+':'+wizlevel[IGwizardLevel]
    objPost['og:image'] = 'http://www.ideategames.org/common/pics/'+wizicons[IGwizardLevel]+"?mw=200&mh=200"
    objPost['og:title'] = wizards[IGwizardLevel]+" "+displayTopics[EventType].replace('\n',' ')+achtxt

    var endDIV1 = document.createElement("div");
    // IGconsole("rtn: "+rtnf)
    endDIV1.setAttribute("class", "IGtemp IGfacebook gameEndA")
    endDIV1.setAttribute("style", "background-color: #999999;height:300px;width:500px;left:calc(50% - 250px);top:100px;float:center")

    var endDIV = document.createElement("div");
    // IGconsole("rtn: "+rtnf)
    endDIV.setAttribute("class", "IGtemp IGfacebook endContainA")
    endDIV.setAttribute("style", "background-color: #99ddff;width:460px;top:16px;left:20px;float:center")
    endDIV1.appendChild(endDIV)

    // var div2 =  document.createElement("div");
    // div2.setAttribute('id', "fb-root")
    // endDIV.appendChild(div2)

    var div2a = document.createElement("div")
    div2a.setAttribute("style", "width:400px;height:10px;")
    endDIV.appendChild(div2a)

    FBendDIV = document.createElement("div")
    FBendDIV.setAttribute("class", "IGtemp IGfacebook")
    // var fbltext = (FBuserID) ? "" : "\n\nWe use your Facebook user id to connect your games together to get advanced rating (Proficient, Master). "+
    //     "You will need to login to Facebook here."
    var fbltext = "\n\nWe use your Facebook user id to connect your games together to get advanced rating (Proficiency, Mastery). "+
        "You do not have to post to Facebook to receive this rating."
    FBendDIV.innerHTML = "\n\nYou have achieved "+wizards[IGwizardLevel]+" "+displayTopics[EventType].replace('\n',' ')+"!"+fbltext
        
    endDIV.appendChild(FBendDIV)

    var div3 =  document.createElement("div");
    div3.setAttribute('class',"fb-login-button")
    div3.setAttribute('data-show-faces',"true")
    div3.setAttribute('data-width', "200")
    div3.setAttribute('data-height', "50")
    div3.setAttribute('data-max-rows', "1")
    div3.setAttribute('data-scope', "publish_actions")
    endDIV.appendChild(div3)

    var div3a = document.createElement("div")
    div3a.setAttribute("style", "width:400px;height:10px;")
    endDIV.appendChild(div3a)

    var div4 = document.createElement("button")
    div4.setAttribute("class", "btn btn-primary");
    div4.setAttribute("style", "float:center")
    div4.setAttribute("type", "button")
    div4.setAttribute("onclick", "postMaster();")
    div4.innerHTML = "Post to Facebook"

    var div4a = document.createElement("div")
    div4a.setAttribute("style", "width:400px;height:10px;")

    var div5 = document.createElement("button");
    div5.setAttribute("class", "btn btn-primary");
    div5.setAttribute("style", "float:center")
    div5.setAttribute("type", "button")
    div5.setAttribute("onclick", "IGremoveFacebook();")
    div5.innerHTML = "Do not post to Facebook"

    var div5a = document.createElement("div")
    div5a.setAttribute("style", "width:400px;height:10px;")

    endDIV.appendChild(div4)
    endDIV.appendChild(div4a)
    endDIV.appendChild(div5)
    endDIV.appendChild(div5a)

    var div6 =  document.createElement("div");
    div6.setAttribute("id", "result")
// document.getElementById("game").appendChild(div6);
    endDIV.appendChild(div6)

    document.getElementById("game").appendChild(endDIV1);

}
function IGmessageDIV(msg,smallp,head,lower, isWide, hasBtns,fsize,isend) {
    // msg = text to be displayed
    // smallp = small size: also implies skip congratulations
    // nohead = skip the congratulations
    // lower == make message box lower half
    var delclass = (isend) ? "IGend" : "IGalert"
    IGcurrentDIV.push(delclass)
    // IGconsole("pushing: "+delclass)

    var endScreen = document.createElement("div");
    endScreen.setAttribute("class", delclass+' IGtemp IGendScreen');
    endScreen.setAttribute("style", 'width:100%;height:100%;');
    if (!hasBtns) {endScreen.setAttribute("onclick", 'IGresume()')}
    document.getElementById("game").appendChild(endScreen);

    var wid = (isWide) ? "600px;" : "60%;"
    var wid2 = (isWide) ? "540px;" : "60%;"
    var xoff = (isWide) ? "calc(50% - 300px);" : "20%;"
    var xoff2 = (isWide) ? "calc(50% - 270px);" : "20%;"
    var fontsiz = (fsize) ? fsize : 12
    var outtop = (lower) ? "" : "top:8%;"

    var hclass,hclass1
    if (smallp) {
        if (smallp == "auto") {
            // the spacing to be correct
            hclass = delclass+" IGtemp gameEndA"
            hclass1 = delclass+" IGtemp endContainA"

        } else {
            if (lower) {
                // I don't know why, but this seems to need both for
                // the spacing to be correct
                hclass = delclass+" IGtemp gameEnd"
                hclass1 = delclass+" IGtemp endContainS"
            } else {
                hclass = delclass+" IGtemp menuDiv"
                hclass1 = delclass+" IGtemp endContainS"
            }
        }
    } else if (head) {
        hclass = delclass+" IGtemp gameEndL"
        hclass1 =delclass+" IGtemp endContain"
    } else {
        hclass = delclass+" IGtemp gameEndL"
        hclass1 =delclass+" IGtemp endContainL"
    }

    var lines = (msg.match(/\n/g)) ? msg.match(/\n/g).length + 1 : 1
    var fontchg = "top:3%;font-size:"+fontsiz+"px;"
    if (!lower && !hasBtns && (HEIGHT>800)) {fontchg = "top:12%;"}
    else if ((lines>15) && (lines<24) && (HEIGHT>600)) {fontchg = "font-size:14px;line-height:0.5;top:5%"}
    else if ((lines>15) && (lines<24)) {fontchg = "font-size:14px;line-height:0.5;"}
    else if (lines>23) {fontchg = "font-size:10px;line-height:0.3;"}

    var endDIV = document.createElement("div");
    // IGconsole("rtn: "+rtnf)
    endDIV.setAttribute("class", hclass)
    endDIV.setAttribute("style", outtop+"left: "+xoff+"width:"+wid)
    if (!hasBtns) {endDIV.setAttribute("onclick", 'IGresume()')}

    var endDIV1 = document.createElement("div");
    // IGconsole("rtn: "+rtnf)
    endDIV1.setAttribute("class", hclass1)
    if (isWide) {endDIV1.setAttribute("style", "align:center;left: "+xoff2+"width:"+wid2+fontchg)}
    else {endDIV1.setAttribute("style","left: "+xoff2+"width:"+wid2+fontchg)}
    if (head) {
        endDIV1.innerHTML = "<h3>Congratulations!</h3><p>"+msg.replace(/\n/g,"</p><p>").replace(/\\n/g,"</p><p>")+"</p>"
    } else {
        // for some reason, I can't get the center aligns to work correctly, so brute force centering
        endDIV1.innerHTML = '<div style="position:relative;width:90%;left:5%;">'+msg.replace(/\n/g,"<br/>").replace(/\\n/g,"<br/>").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;")+"<br/><br/></div>"
    }

    var endDIV2 = document.createElement("div");
    // IGconsole("rtn: "+rtnf)
    var divloc = (isWide) ? "whatNextL" : "whatNext"
    endDIV2.setAttribute("class", "IGtemp "+divloc)
    endDIV1.appendChild(endDIV2);

    var endDIV3
    if (isWide) {
        endDIV3 = document.createElement("div");
        // IGconsole("rtn: "+rtnf)
        endDIV3.setAttribute("class", "IGtemp whatNextR")
        endDIV1.appendChild(endDIV3);
    }

    endDIV.appendChild(endDIV1)

    return [endDIV,endDIV2,endDIV3]
 
}
function DummyCallBack() {
    return
}
IGalertText = "\n\n<div style='color:#000;font-weight:300;'>[Tap anywhere to dismiss popup messages.]</div>"
function IGalertDIV(msg, size, callBack,nobtn,nointro,fsize,iswide) {
    // default should be big message
    // fourth parameter for messageDIV is for lower window
    // third parameter is no heading
    if (callBack) {IGcallBack.push(callBack)} else {IGcallBack.push(DummyCallBack)}
    var pref = (size & !nointro) ? "\n\n\n\n\n" : ""
    // msg,smallp,head,lower, isWide, hasBtns,fsize
    var endDIVs = IGmessageDIV(pref+msg.replace(/\\n/g,'<br/>').replace(/\n/g,'<br/>'), size,false,false,iswide,false,fsize)
    if (!nobtn) {
        var b0 = document.createElement("button");
        b0.setAttribute("class", "btn btn-primary");
        b0.setAttribute("type", "button")
        b0.setAttribute("onclick",'IGresume()');
        b0.innerHTML = 'Resume Game'
        // b0.setAttribute("style", "float:left;")//position:absolute:left:400px;")
        endDIVs[1].appendChild(b0);
    }

    document.getElementById("game").appendChild(endDIVs[0]);
}
function IGendGame(par) {
    // msg,againRtn,subjRtn,diffRtn,resumeRtn,small,nohead,islower
    // default for end game is to put a header
    // default for alerts generally is to not have one
    var msg = par.msg
    var fcns = (par.fcns) ? par.fcns : {}
    var small = (par.small) ? par.small : false
    var head = (par.nohead) ? false : true
    var islower = (par.lower) ? par.lower : false
    resumeRtn = (fcns.resume) ? fcns.resume : false
    againRtn = (fcns.again) ? fcns.again+'()' : "#"
    subjRtn = (fcns.subj) ? fcns.subj+'()' : "#"
    diffRtn = (fcns.diff) ? fcns.diff+'()' : "#"
    var leader = (fcns.leader) ? fcns.leader : false
    //
    // for the new simpler version, no leaderboard
    //
    leader = false;
    var isWide = (par.wide) ? par.wide : false

    // for end of game message, skipping header also means smaller 
    var endDIVs = IGmessageDIV(msg, small, head, islower, isWide,true, 13, true)

    if (resumeRtn) {
        var b0 = document.createElement("button");
        b0.setAttribute("class", "btn btn-primary");
        b0.setAttribute("type", "button")
        b0.setAttribute("onclick",'IGresume()');
        b0.innerHTML = 'Resume Game'
        // b0.setAttribute("style", "float:left;")//position:absolute:left:400px;")
    }

    var b1 = document.createElement("button");
    b1.setAttribute("class", "btn btn-primary");
    b1.setAttribute("type", "button")
    b1.setAttribute("onclick",againRtn);
    // if (isWide) {b1.setAttribute("style","position:relative:float-left;")}
    b1.innerHTML = 'Play Again'

    var b2 = document.createElement("button");
    b2.setAttribute("class", "btn btn-primary");
    b2.setAttribute("type", "button")
    b2.setAttribute("onclick",subjRtn);
    // if (isWide) {b2.setAttribute("style","position:absolute:left:calc(50% + 200px);")}
    b2.innerHTML = 'Change Subject'


    var b3 = document.createElement("button");
    b3.setAttribute("class", "btn btn-primary");
    b3.setAttribute("type", "button")
    b3.setAttribute("onclick",diffRtn);
    // if (isWide) {b3.setAttribute("style","position:absolute:left:calc(50% - 200px);")}
    b3.innerHTML = 'Play a Different Game'

    if (leader) {
        IGconsole("Subject: "+Subjects[EventType2].replace(/ /g,"_"))
        var packet = {query: "leaders",subject: Subjects[EventType2].replace(/ /g,"_"),gameApp: IGgameApp}
        DMMGetHttpRequest(packet,"leaders")
        var b4 = document.createElement("button");
        b4.setAttribute("class", "btn btn-primary");
        b4.setAttribute("type", "button")
        b4.setAttribute("onclick",'IGleaderBoard()');
        b4.innerHTML = 'Leaderboard'
        // if (isWide) {b4.setAttribute("style","position:absolute:left:calc(50% + 200px);")}
    }

    if (resumeRtn) {endDIVs[1].appendChild(b0);}
    endDIVs[1].appendChild(b1);
    endDIVs[1].appendChild(b2);
    if (endDIVs[2]) {
        endDIVs[2].appendChild(b3);
        if (b4) {endDIVs[2].appendChild(b4);}
    } else {
        endDIVs[1].appendChild(b3);
        if (b4) {endDIVs[1].appendChild(b4);}

    }

    document.getElementById("game").appendChild(endDIVs[0]);

    if (IGuseFB && !IGisApp) {
        if ((DMMtotalScore >= IGwizardScores[IGgameApp]) || (IGpartner=="Facebook")) {
            // if (!FBuserID) {IGfacebookInit()};
            game.time.events.add(10,IGshowFacebookPost,this)
        }
    }
}

//
// the menu bar for site navigation; also has help button and image button
function IGaddMenuBar(xloc) {

    // xloc passed in is the center of the menu bar
    // calc each offset from the center

    // being loaded into the same game div
    // these offsets are to center the whole set of 3 buttons
    var moff = xloc - WIDTH/2 + 13
    var hoff = xloc - WIDTH/2 - 29
    var ioff = xloc - WIDTH/2 - 74 //+ MXOFF
    var coff = xloc - WIDTH/2 - (74 + 44)

// this outer div doesn't seem to make any difference, trying to get rid of
// the need for MXOFF. Why sometimes I need it and sometimes not... confuses me
  var outerDIV = document.createElement("div")
  outerDIV.setAttribute("width", WIDTH);
  document.getElementById("game").appendChild(outerDIV);

  var men0 =  document.createElement("a");
  men0.setAttribute("class", "menuComment");
  men0.setAttribute("href", "#");
  men0.setAttribute("onclick", "Javascript:IGaddComment()");
  men0.setAttribute("style", "position:absolute;top:12px;left:calc(50% + "+parseInt(coff)+"px);right:auto;");
    var men0a =  document.createElement("button");
    men0a.setAttribute("class", "btn btn-primary");
    men0a.setAttribute("type", "button");
      var men0aa =  document.createElement("i");
      men0aa.setAttribute("class", "fa fa-comment");
    men0a.appendChild(men0aa);
  men0.appendChild(men0a)

  var men1 =  document.createElement("a");
  men1.setAttribute("class", "menuImage");
  men1.setAttribute("href", "#");
  men1.setAttribute("onclick", "Javascript:IGenter_filmstrip()");
  men1.setAttribute("style", "position:absolute;top:12px;left:calc(50% + "+parseInt(ioff)+"px);right:auto;");
    var men2 =  document.createElement("button");
    men2.setAttribute("class", "btn btn-primary");
    men2.setAttribute("type", "button");
      var men3 =  document.createElement("i");
      men3.setAttribute("class", "fa fa-image");
    men2.appendChild(men3);
  men1.appendChild(men2)

  var men4 =  document.createElement("a");
  men4.setAttribute("class", "menuHelp");
  men4.setAttribute("href", "#");
  men4.setAttribute("onclick", "Javascript:IGshowHelp()");
  men4.setAttribute("style", "position:absolute;top:12px;left:calc(50% + "+parseInt(hoff)+"px);right:auto;")
    var men5 =  document.createElement("button");
    men5.setAttribute("class", "btn btn-primary");
    men5.setAttribute("type", "button");
      var men6 =  document.createElement("i");
      men6.setAttribute("class", "fa fa-question-circle");
    men5.appendChild(men6);
  men4.appendChild(men5)

// now the dropdown menu
        var men11 = document.createElement("div");
        men11.setAttribute("class", "btn-group menuBtns dropdown")
        men11.setAttribute("style", "position:absolute;top:12px;left:calc(50% + "+parseInt(moff)+"px);right:auto;")
 
          var men12 = document.createElement("a");
          men12.setAttribute("class", "btn btn-primary");
          men12.setAttribute("href", "#");
            var men13 = document.createElement("i");
            men13.setAttribute("class", "fa fa-bars");
          men12.appendChild(men13);

          var men14 = document.createElement("a");
          men14.setAttribute("href", "#");
          men14.setAttribute("class", "btn btn-primary dropdown-toggle");
          men14.setAttribute("data-toggle", "dropdown")
            var men15 = document.createElement("span");
            men15.setAttribute("class", "fa fa-caret-down");
          men14.appendChild(men15);

          var pref = ""
          IGconsole("IGisApp: "+IGisApp)

          var men16 = document.createElement("ul");
          men16.setAttribute("class", "dropdown-menu inGameNav multi-level");
            var men17 = document.createElement("li");
              var men17a = document.createElement("a");
              men17a.setAttribute("href", "Javascript:APPrestart()");
              men17a.innerHTML = "Restart";
            men17.appendChild(men17a)
            var men18 = document.createElement("li");
            men18.setAttribute("class", "dropdown-submenu");
              var men19 = document.createElement("a");
              men19.setAttribute("href", "#");
              men19.setAttribute("tabindex", "-1")
              men19.innerHTML = "Play a Different Game";
              var men20 = document.createElement("ul");
              men20.setAttribute("class", "dropdown-menu switchGame");
                var men22a = document.createElement("li");
                  var men23a = document.createElement("a");
                  pref = (IGisApp) ? '../Buckets/index.html' : '/launch/bindex.html'
                  men23a.setAttribute("href", pref+"?alias="+DMMalias+"&partner="+IGpartner);
                  men23a.innerHTML = "Buckets"
                men22a.appendChild(men23a);
                var men22 = document.createElement("li");
                  var men23 = document.createElement("a");
                  pref = (IGisApp) ? '../Strings/index.html' : '/launch/index.html'
                  men23.setAttribute("href", pref+"?alias="+DMMalias+"&partner="+IGpartner);
                  men23.innerHTML = "Strings"
                men22.appendChild(men23);
                var men24 = document.createElement("li");
                  var men25 = document.createElement("a");
                  pref = (IGisApp) ? '../Squares/index.html' : '/launch/ssindex.html'
                  men25.setAttribute("href", pref+"?alias="+DMMalias+"&partner="+IGpartner);
                  men25.innerHTML = "Clues"
                men24.appendChild(men25);
                var men26 = document.createElement("li");
                  var men27 = document.createElement("a");
                  pref = (IGisApp) ? '../Stacks/index.html' : '/launch/sindex.html'
                  men27.setAttribute("href", pref+"?alias="+DMMalias+"&partner="+IGpartner);
                  men27.innerHTML = "Rooms"
                men26.appendChild(men27);
                var men28 = document.createElement("li");
                  var men29 = document.createElement("a");
                  pref = (IGisApp) ? '../Doors/index.html' : '/launch/dindex.html'
                  men29.setAttribute("href", pref+"?alias="+DMMalias+"&partner="+IGpartner);
                  men29.innerHTML = "Collections"
                men28.appendChild(men29);
                var men30 = document.createElement("li");
                  var men31 = document.createElement("a");
                  pref = (IGisApp) ? '../Paths/index.html' : '/launch/pindex.html'
                  men31.setAttribute("href", pref+"?alias="+DMMalias+"&partner="+IGpartner);
                  men31.innerHTML = "Paths"
                men30.appendChild(men31);
              men20.appendChild(men22a);
              men20.appendChild(men22);
              men20.appendChild(men24);
              men20.appendChild(men26);
              men20.appendChild(men28);
              men20.appendChild(men30);
            men18.appendChild(men19);
            men18.appendChild(men20);


            var men32a = document.createElement("li");
            men32a.setAttribute("class", "divider")
            var men32 = document.createElement("li");
              var men33 = document.createElement("a");
              men33.setAttribute("href", BasePath+IGpartner);
              men33.innerHTML = "Home";
            men32.appendChild(men33);
            if (!IGisApp && !IGpartner) {
                var men34 = document.createElement("li");
                  var men35 = document.createElement("a");
                  men35.setAttribute("href", "/about.html");
                  men35.innerHTML = "About";
                men34.appendChild(men35);
                var men36 = document.createElement("li");
                  var men37 = document.createElement("a");
                  men37.setAttribute("href", "/content.html");
                  men37.innerHTML = "Content";
                men36.appendChild(men37);
                var men38 = document.createElement("li");
                  var men39 = document.createElement("a");
                  men39.setAttribute("href", "/contribute.html");
                  men39.innerHTML = "Contribute";
                men38.appendChild(men39);
            }
            var men40 = document.createElement("li");
              var men41 = document.createElement("a");
              men41.setAttribute("href", "/credits.html");
              men41.innerHTML = "Credits";
            men40.appendChild(men41);

          men16.appendChild(men17);
          men16.appendChild(men18);
          men16.appendChild(men32a);
          men16.appendChild(men32);
          if (!IGisApp && !IGpartner) {
              men16.appendChild(men34);
              men16.appendChild(men36);
              men16.appendChild(men38);
          }
          men16.appendChild(men40);

        men11.appendChild(men12);
        men11.appendChild(men14);
        men11.appendChild(men16);

    outerDIV.appendChild(men11);
    outerDIV.appendChild(men4);
    outerDIV.appendChild(men1);
    outerDIV.appendChild(men0);
  
}
function IGpostScore() {
        IGposted = true
        var packet = {query: "post",score: DMMtotalScore.toString(),seq_length: "5",timer: "",
            subject: Subjects[EventType2].replace(/ /g,"_"),
            gameApp: IGgameApp}
        DMMGetHttpRequest(packet,"alias")
        alert("Score posted")
        var packet = {query: "leaders",subject: Subjects[EventType2].replace(/ /g,"_"), gameApp: IGgameApp}
        DMMGetHttpRequest(packet,"leaders")
        document.getElementById("game").removeChild(leaderBoardDIVs[0]);
        game.time.events.add(500,IGleaderBoard,this)
}
function IGprePostScore() {
    IGanalytics([IGgameApp, 'Leaderboard', EventType]);
    IGaliasCallBack=IGpostScore; 
    IGaddAlias()
}

// tricky adding swipe, but need to add it for a space, not the whole world
IGswiping = false;
var IGswipeStart
function listenSwipe(callback) {
    var eventDuration;
    var startPoint = {};
    var endPoint = {};
    var direction;
    var minimum = {
        duration: 75,
        distance: 150
    }

    game.input.onDown.add(function(pointer) {
        startPoint.x = pointer.clientX;
        startPoint.y = pointer.clientY;
        IGswiping = true;
        IGswipeStart = game.input.activePointer.position.x;
    }, this);

    game.input.onUp.add(function(pointer) {
        IGswiping = false;
        direction = '';
        eventDuration = game.input.activePointer.duration;

        if (eventDuration > minimum.duration) {
            endPoint.x = pointer.clientX;
            endPoint.y = pointer.clientY;

            // Check direction
            if (endPoint.x - startPoint.x > minimum.distance) {
                direction = 'right';
            } else if (startPoint.x - endPoint.x > minimum.distance) {
                direction = 'left';
            } else if (endPoint.y - startPoint.y > minimum.distance) {
                direction = 'bottom';
            } else if (startPoint.y - endPoint.y > minimum.distance) {
                direction = 'top';
            }

            if (direction) {
                callback(direction);
            }
        }
    }, this);
};
function IGanalytics(data){
    var cat = (data[0]) ? data [0] : "Cat"
    var act = (data[1]) ? data [1] : "Action"
    var lab = (data[2]) ? data [2] : "Label"
    // var val = (data[3]) ? data [3] : "Value"
    if ((DMMalias != "wiwax") && (DMMalias != "jez")) {ga('send','event',cat, act, lab)} else {IGconsole("No analytics")}
}
var ScoreText
function IGsendscore2() {
    var packet = {query: "userData", variant: IGgameApp+":"+EventType, user_data: ScoreText, partner:IGpartner}
    DMMGetHttpRequest(packet,"sendUserData")
}
function IGsendScore(scoreText) {
    ScoreText = scoreText
    game.time.events.add(250,IGsendscore2)
}