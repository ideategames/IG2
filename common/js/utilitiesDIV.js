/******************************************

	utilitiesDIV -- for using DIV instead of phaser
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//

*//////////////////////////////////////////


// !!! NOTE: x and y locs need to always use center coordinates for
// alignment to other items.
function IGhide(obj,dir) {
    if (obj) {
        if (dir) {if (obj.style) {obj.style.display = 'none'};obj.visible=false}
        else {if (obj.style) {obj.style.display = 'block'};obj.visible=true}
    }
}
function IGaddDivButton(par) {
    // xloc, yloc, txt, width, height, rtnf
    var ret = document.createElement("button");
    var tid = (par.stid) ? par.stid : IGgetNextID()
    var wid = (par.width) ? par.width : 120
    var hgt = (par.height) ? par.height : 120
    var xloc = (par.xloc) ? par.xloc : WIDTH/2
    var yloc = (par.yloc) ? par.yloc : HEIGHT/2
    var txt = (par.text) ? par.text : null
    var hclass = (par.hclass) ? par.hclass : "fa fa-exclamation-triangle"
 
    var adj=wid/2

    //Assign different attributes to the element.
    if (hclass.substring(0,2) == "IG") {
        ret.setAttribute("class", "IGtemp btn btn-primary "+hclass);
    } else {ret.setAttribute("class", "IGtemp btn btn-primary");}
    ret.setAttribute("type", "button")
    ret.setAttribute("id", tid);
    var tmp = "position:absolute;left:calc(50% + "+(xloc-WIDTH/2-adj)+"px);top:"+parseInt(yloc-hgt/2)+
        "px;width="+wid+"px;height="+hgt+"px;"
    ret.setAttribute("style", tmp)
    // this is actually a required parameter, but will 
    // prevent an error
    if (par.rtnf) {
        ret.setAttribute("onclick",par.rtnf+'()')
    }
    if (txt) {
        ret.setAttribute("value",txt)
        ret.innerHTML = txt
    } else {
        var men3 =  document.createElement("i");
        men3.setAttribute("class", hclass);
        ret.appendChild(men3)
    }

    ret.setText = function(stxt) {this.innerHTML = stxt}
    document.getElementById("game").appendChild(ret);
    return ret
}
function IGaddDivText(par) {
    // xloc, yloc, txt, width, size, color, weight, tid, rtn
    var wgt = (par.weight) ? par.weight : 100
    var wid = (par.width) ? par.width : WIDTH
    var hgtt = (par.height) ? "height: "+par.height+"px;" : ""
    var hgt = (par.height) ? par.height : 200
    var top = (par.height) ? "top:"+parseInt(par.yloc-hgt/2)+"px;" : "top:"+parseInt(par.yloc)+"px;"
    top = (par.autocenter) ? "" : top
    var siz = (par.size) ? par.size : 16
    var tid = (par.tid) ? par.wid : IGgetNextID()
    var col = (par.color) ? par.color : '#000000'
    var bgcol = (par.bgcolor) ? "background-color:"+par.bgcolor : "background-color:none"
    var bkg = (par.image) ? "background-image:url('"+par.image+"');" : ""
    var tal = (par.talign) ? par.talign : "center"
    var arg = (par.arg) ? par.arg : ""
    var hclass = 'IGtemp IGtext'
    var hclass2 = 'IGtemp IGtext'
    if (par.hclass) {
        if (par.hclass === true) {hclass = 'IGtemp IGtempH IGtext'}
        else {hclass2 = 'IGtemp IGtext '+par.hclass}
    }
    var vtop = (par.vtop) ? true : false

    var adj=wid/2

    var aref
    if (par.rtn) {
        aref = document.createElement("a");
        aref.setAttribute("onclick",par.rtn+'('+arg+')');
        aref.setAttribute("style", "position:absolute;"+hgtt+"width: "+wid+"px;"+
            "left:calc(50% + "+(par.xloc-WIDTH/2-adj)+"px);"+top)
        aref.setAttribute("class", hclass)
    } else {
        aref = document.createElement("div");
        aref.setAttribute("style", "position:absolute;"+hgtt+"width: "+wid+"px;"+
            "left:calc(50% + "+(par.xloc-WIDTH/2-adj)+"px);"+top)
        aref.setAttribute("class", "IGtextContainer")

    }
    // aref.setAttribute("pointer-events",'none')
 
    if (!vtop) {
        var ret2 = document.createElement("div");
        ret2.setAttribute("class", "IGtextContainer")
        ret2.setAttribute("style", "vertical-align:middle;margin: 0 auto;text-align:"+tal+";width: 100%;display:table-cell;")
    }

    var ret = document.createElement("div");

    //Assign different attributes to the element.
    // calculate the vertical offset for multi-line text
    // width / fontsize == # letters per line
    // length / lpl = # lines
    // #lines * fontsize*1.2 = vertical offset

    ret.setAttribute("class", hclass2);
    ret.setAttribute("id", tid);
    var tmp = ";font-size: "+
        parseInt(siz)+"px;vertical-align:middle;color: "+col+";font-weight: "+wgt+";text-align:"+tal+";width:"+wid+"px;"+bkg+bgcol
    ret.setAttribute("style", tmp)
    ret.innerHTML = par.text.replace(/\\n/g,'<br/>').replace(/\n/g,'<br/>')
    ret.text = par.text

    if (ret2) {
        ret2.appendChild(ret);
        aref.appendChild(ret2);
    } else {
        aref.appendChild(ret);
    }

    ret.reset = function(xloc2,yloc2,relativep) {
        var locs = aref.getBoundingClientRect()
        var wid2 = locs.width
        var hgt2 = locs.height
        var xloc3
        var yloc3
        // cannot get this adjustment correct across all dimensions.
        // I don't get how it should be calculated
        var adj = 5 //34 - IGratio*29
        if (relativep) {
            xloc3 = (locs.left+xloc2) - WIDTH/2 - MXOFF + adj
            yloc3 = locs.top+yloc2
        } else {
            xloc3 = xloc2 - WIDTH/2 - wid2/2
            yloc3 = yloc2 - hgt2/2 - adj
        }
        // ASSUME coords passed are center locations! Must correct for this.
        var tmp2 = "position:absolute;height: "+hgt2+"px;width: "+wid2+"px;"+
            "left:calc(50% + "+xloc3+"px);top:"+parseInt(yloc3)+"px;"
        aref.setAttribute("style", tmp2)
    }

    document.getElementById("game").appendChild(aref);
    ret.setText = function(txt) {this.innerHTML = txt.replace(/\\n/g,'<br/>');};
    return ret
}
function IGaddSpriteDIV(par) {
    // xloc,yloc,ifile,width,height,fcns,stid
    var tid = (par.stid) ? par.stid : IGgetNextID()
    var wid = (par.width) ? par.width : 120
    var hgt = (par.height) ? par.height : 120
    var xloc = (par.xloc) ? par.xloc : WIDTH/2
    var yloc = (par.yloc) ? par.yloc : HEIGHT/2
    var fcns = (par.fcns) ? par.fcns : null
    var ifile = par.ifile
    var halo = (par.halo) ? par.halo : false
    // if (MXOFF) {xloc = xloc+MXOFF}

    var adj=wid/2
    var hclass = "IGtemp IGsprite"
    if (par.fcns) {
        if (par.fcns.nodrag) {
            hclass = "IGtemp IGnoDrag"
        } else if (halo) {
            hclass = "IGtemp IGspriteW"
        }
    } else {
        hclass = "IGtemp IGspriteH"
    }
 
    var ret = document.createElement("div");

    //Assign different attributes to the element.
    ret.setAttribute("class", hclass);
    ret.setAttribute("id", tid);
    // this seems to have no effect
    var dgble = false
    if (par.fcns) {if (!par.fcns.nodrag) {dgble=true}}
    ret.setAttribute("draggable", dgble)
    // not sure why the yoffset needs to be 1/2 of height, but it seems to work
    var tmp = "position:absolute;left:calc(50% + "+(xloc-WIDTH/2-adj)+"px);top:"+parseInt(yloc-hgt/2)+"px;"
    ret.setAttribute("style", tmp)
    if (wid) {
        if (halo) {
            ret.width = wid + 10
            ret.height = hgt + 10
        } else {
            ret.width = wid
            ret.height = hgt
        }
    }
    ret.scale = {}

    var spr = document.createElement("img");
    spr.setAttribute("src",ifile)
    if (wid) {
        spr.setAttribute("width",wid)
        spr.setAttribute("height",hgt)
    }

    ret.appendChild(spr);
    ret.setHalo = function(onoff) {
        // IGconsole("setting halo: "+onoff)
        // why I have to move 10px in one direction and only 5 in the other
        // I haven't figured out yet
        if (onoff) {
            // ret.setAttribute("style", "border: 5px solid #3FA9F5;");
            ret.setAttribute('class', "IGtemp IGspriteW IGspriteD")
            // if (!ret.halo) {ret.reset(5,-5,true)}
            ret.halo = true
        } else {
            // ret.setAttribute("style", "border: 5px solid #FFF;");
            ret.setAttribute('class', "IGtemp IGspriteW")
            // if (ret.halo) {ret.reset(-5,5,true)}
            ret.halo = false
        }
    }
    ret.scale.setTo = function(scw,sch) {
        if (!sch) {var sch = scw}
        spr.setAttribute("width", scw*spr.getAttribute("width"))
        spr.setAttribute("height", sch*spr.getAttribute("height"))
    }
    ret.reset = function(xloc2,yloc2,relativep) {
        var locs = ret.getBoundingClientRect()
        var wadj = (halo) ? 0 : 0
        var wid2 = locs.width +wadj
        var hgt2 = locs.height
        var xloc3
        var yloc3
        if (relativep) {
            xloc3 = (locs.left+xloc2) - WIDTH/2
            yloc3 = locs.top+yloc2
        } else {
            // I don't understand why MXOFF is required here! I am using the 50%
            // and I don't need it above!!
            xloc3 = xloc2 - WIDTH/2 - wid2/2
            yloc3 = yloc2 - hgt2/2
        }
        // ASSUME coords passed are center locations! Must correct for this.
        // because we use calc 50%, don't need to account for MXOFF
        var tmp2 = "position:absolute;left:calc(50% + "+xloc3+"px);top:"+parseInt(yloc3)+"px;"
        this.setAttribute("style", tmp2)
    }
// !!! NOTE: x and y locs need to always use center coordinates for
// alignment to other items.

    // these adjustments still don't seem to work correctly. I think it might have something
    // to do with border vs margin, returning differnet locations. The 2.5 correction is
    // for the border (halo) but seems to be needed without, yet I need 7px...???. Not sure
    // what is happening.
    ret.xloc = function() {
        var locs = ret.getBoundingClientRect()
        var wadj = (halo) ? 15 : 10
        // var adj = (ret.halo) ? 2.5 : 2.5
        // position is always absolute on the screen not the div, so
        // need to subtract the game div offset
        return locs.left + (locs.width+wadj)/2 - MXOFF// + adj
    }
    ret.yloc = function() {
        var locs = ret.getBoundingClientRect()
        var wadj = (halo) ? 0 : 0
        // var adj = (ret.halo) ? -5 : -2.5
        return locs.top + (locs.height+wadj)/2// + adj
    }
    if (fcns) {
        if (fcns.touch) {
            ret.setAttribute('onclick',fcns.touch)
        }
        if (fcns.mouseover) {
            ret.setAttribute('onmouseover',fcns.mouseover)
        }
        if (fcns.mouseout) {
            ret.setAttribute('onmouseout',fcns.mouseout)
        }
        if (fcns.dstart) {
            ret.addEventListener('dragstart', fcns.dstart, false);
        }
        if (fcns.denter) {
            ret.addEventListener('dragenter', fcns.denter, false);
        }
        if (fcns.dover) {
            ret.addEventListener('dragover', fcns.dover, false);
        }
        if (fcns.dleave) {
            ret.addEventListener('dragleave', fcns.dleave, false);
        }
        if (fcns.ddrop) {
            ret.addEventListener('drop', fcns.ddrop, false);
        }
        if (fcns.dend) {
            ret.addEventListener('dragend', fcns.dend, false);
        }
    }

    document.getElementById("game").appendChild(ret);
    return ret

}
function IGaddBoxDIV(par) {
    // xloc,yloc,ifile,width,height,fcns,stid
    var tid = (par.stid) ? par.stid : IGgetNextID()
    var wid = (par.width) ? par.width : 120
    var hgt = (par.height) ? par.height : 120
    var xloc = (par.xloc) ? par.xloc : WIDTH/2
    var yloc = (par.yloc) ? par.yloc : HEIGHT/2
    var adj=wid/2
 
    var ret = document.createElement("div");

    //Assign different attributes to the element.
    ret.setAttribute("class", "IGtemp IGdescBox");
    ret.setAttribute("id", tid);
    // not sure why the yoffset needs to be 1/2 of height, but it seems to work
    var tmp = "position:absolute;left:calc(50% + "+(xloc-WIDTH/2-adj)+"px);top:"+parseInt(yloc-hgt/2)+"px;"+
        "width:"+wid+"px;height:"+hgt+"px;"
    ret.setAttribute("style", tmp)
    ret.scale = {}

    ret.setHalo = function(onoff) {
        IGconsole("setting halo: "+onoff)
        if (onoff) {
            ret.setAttribute('class', "IGtemp IGspriteH")
        } else {
            ret.setAttribute('class', "IGtemp IGsprite")
        }
    }
    ret.scale.setTo = function(scw,sch) {
        if (!sch) {var sch = scw}
        ret.setAttribute("width", scw*ret.getAttribute("width"))
        ret.setAttribute("height", sch*ret.getAttribute("height"))
    }
    ret.reset = function(xloc2,yloc2) {
        var wid2 = this.getAttribute("width")
        var hgt2 = this.getAttribute("height")
        MXOFF = 0//(window.innerWidth - WIDTH)/2
        xloc2 = xloc2+MXOFF

        var tmp2 = "position:absolute;left:"+parseInt(xloc2-wid2/2)+"px;top:"+parseInt(yloc2-hgt2/2)+"px;"
        this.setAttribute("style", tmp2)
    }
    ret.xloc = function() {
        var locs = spr.getBoundingClientRect()
        return locs.left//+spr.getAttribute("width")/2
    }
    ret.yloc = function() {
        var locs = spr.getBoundingClientRect()
        return locs.top//+spr.getAttribute("height")/2
    }
    document.getElementById("game").appendChild(ret);
    return ret
}
function IGcleanupTexts() {
    // IGconsole("\ncleaning up text...\n")
    var nodeList = document.getElementsByClassName('IGtemp');
    while (nodeList.length>0) {
        // IGconsole("\nremoving node\n")
        nodeList = document.getElementsByClassName('IGtemp')
        nodeList[0].parentNode.removeChild(nodeList[0]);
    }

}
function IGhideTexts(onoff,sclass) {
    var sett = (onoff) ? 'none' : 'block'
    var hclass = (sclass) ? sclass : 'IGtemp'
    var nodeList = document.getElementsByClassName(hclass);
    for (var n=0;n<nodeList.length;n++) {
        nodeList[n].style.display = sett;
    }

}
function IGputHalo(idiv) {
    IGconsole("putting halo")
    idiv.setAttribute('border-radius', "50%")
    idiv.setAttribute('border', "8px solid #3FA9F5")
}
