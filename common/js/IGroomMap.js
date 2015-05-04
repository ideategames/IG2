///////////////////////////////////////////////////////
//
// IGroomMap
//
// for drawing the map of connected rooms
//
///////////////////////////////////////////////////////

// assume h/w for now
var mapWid = 7 // first and last columns blank, so effectively 5
var mapHgt = 7 // bottom row blank
var roomWidth = 90//IGratio*100
var roomHeight = 90//IGratio*100
// this makes a 5x5 grid of 25 possible rooms

// leave a blank row at the bottom and blank columns left and right
// thus 0 - mapWid are always blank, and multiples of mapHgt at 0 and at mapWid

//
// IMPORTANT: Be sure IGroomPahts.js is included before this file!!
// It contains all the room setups used below.

// These are the key setup variables
var roomSet = Math.floor(Math.random()*roomDists.length)
var roomLocs = roomLocsPot[roomSet]

distInstance = roomDists[roomSet]
function dist(ra,rb) {
	var a = ra
	var b = rb
	if (ra>rb) {
		a = rb
		b = ra
	}
	// IGconsole("a,b: "+a+":"+b)
	return (ra==rb) ? 0 : distInstance[a][b]
}
function calcShortestPath(rooms) {

	// these are all the distances for pairwise combinations of 5 rooms
	var d01 = dist(rooms[0],rooms[1])
	var d02 = dist(rooms[0],rooms[2])
	var d03 = dist(rooms[0],rooms[3])
	var d04 = dist(rooms[0],rooms[4])
	var d12 = dist(rooms[1],rooms[2])
	var d13 = dist(rooms[1],rooms[3])
	var d14 = dist(rooms[1],rooms[4])
	var d23 = dist(rooms[2],rooms[3])
	var d24 = dist(rooms[2],rooms[4])
	var d34 = dist(rooms[3],rooms[4])

	// all paths start at room 0
	var paths = [d01+d12+d23+d34]
	paths.push([d01+d12+d24+d34])
	paths.push([d01+d13+d23+d34])
	paths.push([d01+d13+d24+d34])
	paths.push([d01+d14+d24+d24])
	paths.push([d01+d14+d34+d23])

	paths.push([d02+d12+d13+d34])
	paths.push([d02+d12+d14+d34])
	paths.push([d02+d23+d13+d34])
	paths.push([d02+d23+d34+d14])
	paths.push([d02+d24+d14+d13])
	paths.push([d02+d24+d34+d13])

	paths.push([d03+d13+d12+d24])
	paths.push([d03+d13+d14+d24])
	paths.push([d03+d23+d12+d14])
	paths.push([d03+d23+d24+d14])
	paths.push([d03+d34+d14+d12])
	paths.push([d03+d34+d24+d12])

	paths.push([d04+d14+d12+d23])
	paths.push([d04+d14+d13+d23])
	paths.push([d04+d24+d12+d13])
	paths.push([d04+d24+d23+d13])
	paths.push([d04+d34+d13+d12])
	paths.push([d04+d34+d23+d12])

	// IGconsole("Paths: "+paths)
	return IGmin(paths)
}

function getAdjacencies(room) {
	// grid is mapWid x mapHgt
	// grid of rooms always has a blank border row
	// and column, so +/- 1 always works, doesn't wrap row
	var W = (roomLocs.indexOf(room-1) > -1) ? room-1 : null
	var N = (roomLocs.indexOf(room+mapWid) > -1) ? room+mapWid : null
	var E = (roomLocs.indexOf(room+1) > -1) ? room+1 : null
	var S = (roomLocs.indexOf(room-mapWid) > -1) ? room-mapWid : null
	return {W:W,N:N,E:E,S:S}
}
// for (var d=0;d<34;d++) {
// 	if (roomLocs.indexOf(d)>-1) {
// 		var adj = getAdjacencies(d)
// 		var cx = ""
// 		if (adj.W) {cx +="W"}
// 		if (adj.N) {cx +="N"}
// 		if (adj.E) {cx +="E"}
// 		if (adj.S) {cx +="S"}
// 		IGconsole("room: "+d+":"+cx)
// 	}
// }

function getRoomLoc(locnum) {
	var xadj = (locnum % mapWid) - (mapWid/2 - 0.5)
	var yadj = Math.ceil(locnum/mapHgt) - (mapHgt/2 - 0.25)
	if (locnum==99) {
		xadj = (41 % mapWid) - (mapWid/2 - 0.5) + 0.15
		yadj = Math.ceil(41/mapHgt) - (mapHgt/2 - 0.25)
	} else if (locnum==100) {
		xadj = (41 % mapWid) - (mapWid/2 - 0.5) + 0.15
		yadj = Math.ceil(34/mapHgt) - (mapHgt/2 - 0.25)
	} else if (locnum==101) {
		xadj = (41 % mapWid) - (mapWid/2 - 0.5) + 0.15
		yadj = Math.ceil(27/mapHgt) - (mapHgt/2 - 0.25)
	}
	return {x: WIDTH/2 + xadj*roomWidth, y: HEIGHT/2 - yadj*roomHeight}
}
function IGaddRoom(room,cur,label,bg,iscur) {
	var rwid = "width: "+(roomWidth-2)+"px;"
	var rhgt = "height: "+(roomHeight-2)+"px;"
	var fsiz = 	"font-size: "+Math.ceil(IGratio*14)+"px;"
	var bord = (iscur) ? "border: 5px solid #66ccff;" : ""

	var rnum = room.square
	var locs = getRoomLoc(rnum)
	// IGconsole("locnum,x,y: "+locnum+":"+locs.x+":"+locs.y)
    var ret = document.createElement("div");

    var colr = "background-color: #cccccc;"
    if (cur==1) 
    	{colr = "background-color: #999999;"}
    else if (cur==2) {colr = "background-color: #999999;"}
    else if (cur==3) {colr = "background-color: #99ff99;"}

    //Assign different attributes to the element.
    ret.setAttribute("class", "mapRoom");
    var tmp = "position:absolute;left:calc(50% + "+(locs.x-WIDTH/2-roomWidth/2)+"px);top:"+
    	parseInt(locs.y-roomHeight/2)+"px;"+colr+rwid+rhgt+fsiz+bord
    ret.setAttribute("style", tmp)
    ret.innerHTML = "<br/>"+label;

    bg.appendChild(ret);

    // if (!room.cx) {IGconsole("error room: "+room.square)} else {IGconsole("OK: "+room.square)}
    // I don't know why both of these are needed. cx should always be defined
    if (room.cx) {
	    if (room.cx[1]>-1) {
		    var doorh = document.createElement("div");
		    doorh.setAttribute("class", "mapRoomDoorH");
		    doorh.setAttribute("style", "left:calc(50% + "+(locs.x-WIDTH/2-10)+"px);top:"+
		    	parseInt(locs.y-roomHeight/2-4)+"px;")
		    bg.appendChild(doorh);
		}
		if (room.cx[0]>-1) {
		    var doorv = document.createElement("div");
		    doorv.setAttribute("class", "mapRoomDoorV");
		    doorv.setAttribute("style", "left:calc(50% + "+(locs.x-WIDTH/2-roomWidth/2-2)+"px);top:"+
		    	parseInt(locs.y-10)+"px;")
	    	bg.appendChild(doorv);
	    }
	} else {"ERROR: no cx for room: "+room.square} // should never happen
    return ret

}
function IGdrawRoomMap(rs,curroom) {
	roomWidth = IGratio*100
	roomHeight = IGratio*100
	if (rs) {
	    var map = document.createElement("div");

	    //Assign different attributes to the element.
	    map.setAttribute("class", "mapRoomBG");

		for (var r=0;r<DMMnumRooms;r++) {
			if (!rs['library'+r].square || !rs['library'+r].label) {"blank room: "+r}
			var cur = (curroom == 'library'+r) ? 1 : 0
			var iscur = cur
			if (!cur) {cur = (rs['library'+r].visited) ? 2 : 0}
			// now for rooms already done
			if (rs['library'+r].done) {cur=3}
			IGaddRoom(rs['library'+r],cur,rs['library'+r].label,map,iscur)
		}
		var keysq = {}
		keysq.cx=[]
		keysq.square = 101
		IGaddRoom(keysq,3,"Done",map)
		keysq.square = 100
		IGaddRoom(keysq,2,"Visited",map)
		keysq.square = 99
		IGaddRoom(keysq,1,"Current",map,true)
	    document.getElementById("map").appendChild(map);
	} else {
	    document.getElementById("map").innerHTML = "";

	}
}