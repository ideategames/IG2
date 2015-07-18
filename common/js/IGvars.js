/*********************************
	app_vars

	global variables for use in the app
//
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//

*/////////////////////////////////


var game
// these are re-defined in the initial html file after reading the device
WIDTH = 1024
HEIGHT = 648
// these are re-defined after the game is loaded
// in a utilities function IGsetGlobalFunctions
MIDX = WIDTH/2
MIDY = HEIGHT/2

// these are re-defined in the initial html file after reading the device
IGyratio = 1.0
IGxratio = 1.0

// color scheme
IGbackground = '#fef0e1'
IGaltBG = '#000000'
IGisPublic = false
IGwhite = false
// these next 4 are reset by each application to be relative paths
IGgameApp = 'Strings'
AppPath = "/Strings/"
// these have been moved to config.js which is loaded before this
// CommonPath = "/common/"
// ImgPath = "/stringsThumbs/"

// value for completing game, for the analytics
IGgameVal = 1

extname = {Strings: 'Strings', Buckets: 'Buckets', Squares: 'Clues', Stacks: 'Rooms', Doors: 'Collections', Paths: 'Paths'}

IGdebug = true
IGpartner = ""
// this has been moved to config.js which is loaded before this
// IGisApp = false
Partners = {Museum: 'Museum'}
EventType2 = ""

// The above will be reset by checking with the browser
// THus the items below need to be also -- reset in entry.js
var instrWidth, instrWidthMed, instrWidthShort, hstyle, hstyle2, tstyle2, tstyle,
	tstyle2a, tstyle2m, tstyle2w, tstyle3, style, style2, rjstyle, ljstyle2
IGdefineScales = function() {
	if (IGwhite) {
		IGwhiteScales()
	} else {

		var wid = (WIDTH>1300) ? 1300 : WIDTH 
		instrWidth = 5*wid/8
		instrWidthW = 6*wid/8
		instrWidthMed = wid/2
		instrWidthShortMed = wid/2-72
		instrWidthShort = wid/3
		instrWidthVShort = wid/4+rx(20)

		instrWidthBubble = IGratio*120
		instrWidthColumn = IGratio*240
		instrWidthVShort = wid/5
		locwidth = WIDTH/10

		hstyle = { font: "bold 14px Arial", fill: "#ffffff", align: "right", strokeThickness: 6};
		hstyle2 = { font: "bold 18px Arial", fill: "#ffffff", align: "right", strokeThickness: 6};
		hstyle3 = { font: "16px Helvetica", fill: "#ffff00", align: "right", strokeThickness: 6};
		hstyle4 = { font: "18px Helvetica", fill: "#777777", align: "center"};
		hstyle5 = { font: "bold 22px Helvetica", fill: "#555555", align: "center"};
		hstylec = { font: "18px Arial", fill: "#ffffff", align: "center", strokeThickness: 6};
		hstylevl = { font: "24px Helvetica", fill: "#ffffff", align: "center", strokeThickness: 0};
		hstylevlb = { font: "24px Helvetica", fill: "#000000", align: "center", strokeThickness: 0};
		hstylecvvs = { font: "18px Arial", fill: "#ffffff", align: "center", strokeThickness: 6,
			wordWrap: true, wordWrapWidth: locwidth};
		hstylecy = { font: "16px Arial", fill: "#ffff00", align: "center", strokeThickness: 6,
			wordWrap: true, wordWrapWidth: instrWidth};
		hstylecw = { font: "18px Helvetica", fill: "#ffffff", align: "center", strokeThickness: 0};
		hstyle3 = { font: "16px Arial", fill: "#ffff00", align: "right", strokeThickness: 6};
		tstyle2 = { font: "14px Arial", fill: "#ffff00", align: "right", strokeThickness: 6};
		tstyle2c = { font: "14px Arial", fill: "#ffff00", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthVShort, strokeThickness: 6 };
		tstyle2cs = { font: "bold 13px Arial", fill: "#ffff00", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthVShort, strokeThickness: 6 };
		tstyle = { font: "14px Arial", fill: "#ddffdd", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthShort };
		tstylew = { font: "14px Arial", fill: "#ddffdd", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthShort };
		tstyles = { font: "14px Arial", fill: "#ddffdd", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthVShort };
		tstylevs = { font: "13px Arial", fill: "#ddffdd", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthVShort };
		tstylevss = { font: "10px Arial", fill: "#ffffff", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthVShort };
		tstylevssy = { font: "10px Arial", fill: "#ffff00", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthVShort };
		tstyle2a = { font: "14px Arial", fill: "#ccffcc", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthShort };
		tstyle2m = { font: "14px Arial", fill: "#ccffcc", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthMed };
		tstyle2sm = { font: "14px Arial", fill: "#ccffcc", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthShortMed };
		tstyle2w = { font: "14px Arial", fill: "#ccffcc", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthW };
		tstyle3 = { font: "14px Arial", fill: "#aaccaa", align: "center", wordWrap: true,
			wordWrapWidth: instrWidthShort, anchor: (0.5,0.5)};
		style = { font: "14px Arial", fill: "#ccccff", align: "center", wordWrap: true,
			wordWrapWidth: instrWidth };
		style2 = { font: "14px Arial", fill: "#eeffee", align: "center", wordWrap: true,
			wordWrapWidth: instrWidth };
		style3 = { font: "12px Arial", fill: "#ccccff", align: "center", wordWrap: true,
			wordWrapWidth: instrWidth };
		style3b = { font: "12px Arial", fill: "#000000", align: "center", wordWrap: true,
			wordWrapWidth: instrWidth };
		rjstyle = { font: "bold 14px Arial", fill: "#eeffee", align: "right", wordWrap: true,
			wordWrapWidth: instrWidth };
		ljstyle2 = { font: "bold 14px Arial", fill: "#ffff00", align: "left" };
		ljstyle2vs = { font: "bold 14px Arial", fill: "#ffff00", align: "left", wordWrap: true,
			wordWrapWidth: instrWidthVShort };
		ljstyle2vss = { font: "bold 12px Arial", fill: "#ffff00", align: "left", wordWrap: true,
			wordWrapWidth: instrWidthVShort };
	}
}
IGwhiteScales = function() {
	var wid = (WIDTH>1300) ? 1300 : WIDTH 
	instrWidth = 5*wid/8
	instrWidthW = 6*wid/8
	instrWidthMed = wid/2
	instrWidthShortMed = wid/2-rx(72)
	instrWidthShort = wid/3
	// fix this to the size of the UI bubbles
	// should use a constant here
	instrWidthBubble = IGratio*120
	instrWidthColumn = IGxratio*270
	instrWidthVShort = wid/5
	locwidth = WIDTH/10

	hugesty = { font: "36px Helvetica", fill: "#ffffff", align: "center", strokeThickness: 0};
	hstyle = { font: "bold 14px Helvetica", fill: "#000000", align: "right", strokeThickness: 0};
	hstylesc = { font: "bold 14px Helvetica", fill: "#000000", align: "center", strokeThickness: 0};
	hstyle2 = { font: "bold 18px Helvetica", fill: "#000000", align: "right", strokeThickness: 0};
	hstylec = { font: "bold 18px Helvetica", fill: "#000000", align: "center", strokeThickness: 0};
	hstylel = { font: "bold 18px Helvetica", fill: "#000000", align: "center", strokeThickness: 0,
		wordWrap: true, wordWrap: IGratio*150};
	hstylevl = { font: "24px Helvetica", fill: "#ffffff", align: "center", strokeThickness: 0};
	hstylevlb = { font: "36px Helvetica", fill: "#000000", align: "center", strokeThickness: 0};
	hstylecw = { font: "18px Helvetica", fill: "#ffffff", align: "center", strokeThickness: 0};
	hstylecvvs = { font: "18px Helvetica", fill: "#000000", align: "center", strokeThickness: 0,
		wordWrap: true, wordWrapWidth: locwidth};
	hstylecy = { font: "16px Helvetica", fill: "#9d0a0e", align: "center", strokeThickness: 0,
		wordWrap: true, wordWrapWidth: instrWidth};
	hstyle3 = { font: "16px Helvetica", fill: "#777777", align: "right", strokeThickness: 0};
	hstyle3a = { font: "16px Helvetica", fill: "#777777", align: "left", strokeThickness: 0};
		hstyle4 = { font: "18px Helvetica", fill: "#666666", align: "center"};
		hstyle5 = { font: "bold 22px Helvetica", fill: "#6a6a6a", align: "center"};
	tstyle2 = { font: "14px Helvetica", fill: "#0000ff", align: "right", strokeThickness: 0};
	tstyle2c = { font: "14px Helvetica", fill: "#0000ff", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthVShort, strokeThickness: 0 };
	tstyle2csb = { font: "bold 14px Helvetica", fill: "#0000ff", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthBubble, strokeThickness: 0 };
	tstyle2cs = { font: "bold 12px Arial", fill: "#0000ff", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthVShort, strokeThickness: 0 };
	tstyle2cb = { font: "bold 12px Arial", fill: "#0000ff", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthBubble, strokeThickness: 0 };
	tstyle = { font: "14px Arial", fill: "#9d0a0e", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthShort };
	tstylew = { font: "14px Arial", fill: "#ddffdd", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthShort };
	tstyles = { font: "14px Arial", fill: "#9d0a0e", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthVShort };
	tstylevs = { font: "13px Arial", fill: "#9d0a0e", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthVShort };
	tstylevb = { font: "13px Arial", fill: "#9d0a0e", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthBubble };
	tstylevss = { font: "10px Arial", fill: "#000000", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthVShort };
	tstylevssy = { font: "10px Arial", fill: "#0000ff", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthVShort };
	tstyle2a = { font: "14px Arial", fill: "#330033", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthShort };
	tstyle2m = { font: "14px Arial", fill: "#330033", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthMed };
	tstyle2sm = { font: "14px Arial", fill: "#9d0a0e", align: "left", wordWrap: true,
		wordWrapWidth: instrWidthShortMed };
	tstyle2w = { font: "14px Arial", fill: "#9d0a0e", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthW };
	tstyle3 = { font: "14px Arial", fill: "#aaccaa", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthShort, anchor: (0.5,0.5)};
	style = { font: "14px Arial", fill: "#9d0a0e", align: "center", wordWrap: true,
		wordWrapWidth: instrWidth };
	style2 = { font: "14px Arial", fill: "#9d0a0e", align: "center", wordWrap: true,
		wordWrapWidth: instrWidth };
	style3 = { font: "12px Arial", fill: "#44aaff", align: "center", wordWrap: true,
		wordWrapWidth: instrWidth };
	style3b = { font: "14px Arial", fill: "#000000", align: "center", wordWrap: true,
		wordWrapWidth: instrWidthColumn };
	rjstyle = { font: "bold 14px Arial", fill: "#110011", align: "right", wordWrap: true,
		wordWrapWidth: instrWidth };
	ljstyle2 = { font: "bold 14px Arial", fill: "#0000ff", align: "left" };
	ljstyle2vs = { font: "bold 14px Arial", fill: "#0000ff", align: "left", wordWrap: true,
		wordWrapWidth: instrWidthVShort };
	ljstyle2vss = { font: "bold 12px Arial", fill: "#0000ff", align: "left", wordWrap: true,
		wordWrapWidth: instrWidthVShort };
}



DMMaliasList = []
DMMleaders = []

// user variables
DMMalias = ""
DMMscore = 0
DMMscores = []
DMMnumStrings = 0
DMMtotalScore = 0
IGaliasScores = []
DMMnumRooms = 11
DMMnumRoomsC = 11
DMMnumDoors = 4
DMMnumObjects = 4
DMMtarget = 5
DMMpenalties = 0

DMMtotalShelved = 0

EventNum = 100

EventVars = {}

DMMlevel = 1
userRequested = false

Ppenalty = 5
Psmallpenalty = 3
Pbigpenalty = 10
Pstepbonus = 3

PmaxPenalty = 30


var ievents = ['ievent1','ievent2','ievent3','ievent4','ievent5','ievent6','ievent7','ievent8','ievent9']
var iimgs = ['iimg1','iimg2','iimg3','iimg4','iimg5','iimg6','iimg7','iimg8','iimg9']
var targ1,targ2,targ3,targ4,targ5
var targs = [targ1,targ2,targ3,targ4,targ5]
var targtexts = []

var Topics, PTopics

var objectTypes = {Movies: "movie", Museum: "object", Culture: "object", Fashion: "dress", Art: "work of art", 
	Science: "discovery", Nature: "fact", Cities: "city", Mediterranean: "event",
	Alaska: "event", AlaskanCities: "city", GeoEras: "time period",
	Dinosaurs: "dinosaur", Literature: "book",
	default: "item"}

Topics = {}//{Movies: "Movies", Museum: "Museum", Culture: "Culture", Art: "Art", 
	// Science: "Science", Nature: "Nature", Cities: "Cities", Mediterranean: "Mediterranean",
	// Dinosaurs: "Dinosaurs", Literature: "Literature", Fashion: "Fashion"}
DTopics = {}//{Movies: "Movies", Museum: "Museum", 
	// Science: "Science", Mediterranean: "Mediterranean", Literature: "Literature", Culture: "Culture"}
STopics = {}//{Movies: "Movies", Museum: "Museum", 
	// Science: "Science", Mediterranean: "Mediterranean", Literature: "Literature", Culture: "Culture"}
PTopics = {}//{Movies: "Movies", Museum: "Museum", 
	// Science: "Science", Literature: "Literature", Art: "Art", Cities: "Cities"}
BTopics = {}//{Movies: "Movies", Museum: "Museum", 
	// Science: "Science", Literature: "Literature", Art: "Art", Cities: "Cities"}
TopicDescs = {}
//
// These need to be defined before partner topics to allow partners to redefine them
//
var displayTopics = {Movies: "Movies", Museum: "Objects from the British Museum", Culture: "Western Culture", Fashion: "Fashion", Art: "Art", 
	Science: "Discoveries in Science", Nature: "Nature", Cities: "City Latitudes", 
		Mediterranean: "Mediterranean History", Dinosaurs: "Dinosaurs (when extinct)",
		Literature: "Western Literature", AncientHistory: "Ancient History",
			Composers: "Western Composers", Alaska: "History of Alaska", AlaskanCities: "Alaskan City Latitudes",
			GeoEras: "Geologic Time Periods"}
var Subjects = {Movies: "Strings of Movies", Museum: "Strings in the British Museum", Culture: "Strings through Western Culture", 
	Fashion: "Strings of Fashion", Art: "Strings of Art", Science: "Strings in Science Discoveries", Nature: "Strings through Nature",
	Cities: "Strings between Cities", Mediterranean: "Strings through the Mediterranean",
	Dinosaurs: "Strings in Dinosaurs", Literature: "Strings through Western Literature",
	Alaska: "Strings through Alaksan History", AlaskanCities: "Strings through Alaskan Cities",
	AncientHistory: "Strings through Ancient History",
			Composers: "Strings of Composers", GeoEras: "Strings through Time",
			default: "Strings of Objects"}
var TopicIcons = {Movies: 'movies_Icon.png', Museum: 'museum_Icon.png', Culture: 'culture_Icon.png', 
	Fashion: 'fashion_Icon.png', Art: 'art_Icon.png', Science: 'science_Icon.png', Nature: 'nature_Icon.png',
	Cities: 'city_Icon.png', Mediterranean: 'med_Icon.png', Dinosaurs: 'dino_Icon.png', Literature: 'lit_Icon.png',
	AncientHistory: 'whist_Icon.png',
			Composers: "composer_Icon.png", Alaska: "Alaska_icon_50.png", AlaskanCities: "Alaska_icon_50.png",
			default: "default_Icon.png"}
var TopUnits = {Movies: " years", Museum: " years", Culture: " years", Fashion: " years", Art: " years", 
	Science: " years", Nature: "", Cities: " degrees of latitude", Mediterranean: " years",
	Dinosaurs: " million years", Literature: " years", AncientHistory: " years",
			Composers: " years", Alaska: " years", AlaskanCities: " degrees of latitude", GeoEras: " million years",
			default: " years"}
var ObjTypes = {Movies: "movies", Museum: "objects", Culture: "objects", Fashion: "dresses", Art: "paintings", 
	Science: "diagrams", Nature: "facts", Cities: "cities", Mediterranean: "events",
	Dinosaurs: "dinosaurs", Literature: "books", Alaska: "events", AlaskanCities: "cities",
			Composers: "composers", GeoEras: "time periods",
			default: "items"}
// need to define this outside the set topics in case that is not used
EventType2 = (ObjTypes[EventType]) ? EventType : "default"

function IGsetTopicDescrs() {
	TopicDescs.Museum = "I played Ideate Games "+extname[IGgameApp]+" and learned, with over 90% accuracy, "+
	      "about 100 objects, their dates, origins, makers, and key facts."
	TopicDescs.Science = "I played Ideate Games "+extname[IGgameApp]+" and learned, with over 90% accuracy, "+
	        "about 50 discoveries before the 20th century, their discoverers, dates, and key facts."
	TopicDescs.Literature = "I played Ideate Games "+extname[IGgameApp]+" and learned, with over 90% accuracy, "+
	      "about 80 classics, their authors, quotes, characters, dates, and key facts."
	TopicDescs.Art = "I played Ideate Games "+extname[IGgameApp]+" and learned, with over 90% accuracy, "+' consists of 94 paintings of Western art '+
	        'before the 20th century, randomly presented with titles, art period or style, or descriptions.'
	TopicDescs.Culture = "I played Ideate Games "+extname[IGgameApp]+" and learned, with over 90% accuracy, "+
	    	'about 275 books, paintings, composers, and science discoveries and their dates and key facts.'
	TopicDescs.Composers = "I played Ideate Games "+extname[IGgameApp]+" and learned, with over 90% accuracy, "+
	    	'about 51 composers of Western music and their compositions, dates, and origins.'
	TopicDescs.Nature = "I played Ideate Games "+extname[IGgameApp]+" and learned, with over 90% accuracy, "+
	    	'about 50 concepts in the conservation of nature and their key statistics.'
	TopicDescs.Movies = "I played Ideate Games "+extname[IGgameApp]+" and learned, with over 90% accuracy, "+
	    	'about 136 movies and their directors, quotes, and dates.'
	TopicDescs.Cities = "I played Ideate Games "+extname[IGgameApp]+" and learned, with over 90% accuracy, "+
	    	'about 149 cities around the world, their latitudes and populations.'
}

IGsetTopicDescrs()
IGpartnerLoaded = false
function DMMSetTopics() {

	// set all the topics first, before checking for partner
	// in case partner file not found
	if (!IGpartnerLoaded) {
		IGconsole("setting topics")
		Topics = {Museum: "Museum",
			Science: "Science", Literature: "Literature", Art: "Art", Composers: "Composers", Culture: "Culture", 
			Movies: "Movies", Nature: "Nature", GeoEras: "GeoEras", Cities: "Cities"}
		PTopics = {Museum: "Museum", 
			Science: "Science", Literature: "Literature", Art: "Art", Composers: "Composers", 
			Movies: "Movies", Cities: "Cities"}
		STopics = {Museum: "Museum", 
			Science: "Science", Literature: "Literature", Art: "Art", Composers: "Composers", Culture: "Culture", 
			Movies: "Movies", Nature: "Nature"}
		DTopics = {Museum: "Museum", 
			Science: "Science", Literature: "Literature", Art: "Art", Composers: "Composers", Culture: "Culture", 
			Movies: "Movies", Nature: "Nature"}
		BTopics = {Museum: "Museum",
			Science: "Science", Literature: "Literature", Art: "Art", Composers: "Composers", 
			Movies: "Movies", Cities: "Cities"}
		StTopics = {Bears: "Bears"}
		BrTopics = {Museum: "Museum", Science: "Science", Literature: "Literature", 
			Art: "Art", Composers: "Composers",Culture: "Culture"}
		if (DMMalias=="wiwax") {
			Topics.Alaska = "Alaska"
			Topics.AlaskanCities = "AlaskanCities"
			Topics.AncientHistory = "AncientHistory"
			Topics.GeoEras = "GeoEras"
			PTopics.Alaska = "Alaska"
			PTopics.AlaskanCities = "AlaskanCities"
			PTopics.AncientHistory = "AncientHistory"
			PTopics.GeoEras = "GeoEras"
			STopics.Alaska = "Alaska"
			DTopics.AlaskanCities = "AlaskanCities"
			STopics.AncientHistory = "AncientHistory"
			STopics.GeoEras = "GeoEras"
			DTopics.Alaska = "Alaska"
			DTopics.AlaskanCities = "AlaskanCities"
			DTopics.AncientHistory = "AncientHistory"
			DTopics.GeoEras = "GeoEras"
			BTopics.Alaska = "Alaska"
			BTopics.AlaskanCities = "AlaskanCities"
			BTopics.AncientHistory = "AncientHistory"
			BTopics.GeoEras = "GeoEras"
			BrTopics.Alaska = "Alaska"
			BrTopics.AlaskanCities = "AlaskanCities"
			BrTopics.AncientHistory = "AncientHistory"
			BrTopics.GeoEras = "GeoEras"
		}
		EF1 = false
		if (IGpartner) {
			IGconsole("getting topic for: "+IGpartner)
			var request = $.getScript(BasePath+"common/js/"+IGpartner+"_topics.js")
			request.done(function(data, textStatus) {
				  // IGconsole(data); //data returned
				  IGconsole("topic list load: "+textStatus+":"+IGpartner);
				  IGpartnerLoaded = true
				  game.state.start('select',true,true)
				});
			request.fail(function() {
					IGconsole("no data")
				});

		}
	}
	if (EF1) {IGconsole("data done")}

	IGsetTopicDescrs()
	EventType2 = (ObjTypes[EventType]) ? EventType : "default"
	IGconsole("EventType2: "+EventType2)
}
var EventType = ""
var TopicImgs = {}
var selTopics = {}
var selTexts = {}

var hIntro = "Strings"
var introText = "This is a game to create ordered Strings of concepts. You are given a set of images representing "+
	"events or numerical concepts (eg, 'The number of acres of tropical rainforest destroyed each year.'), and asked to "+
	"put some of them in numerical order, making a String with the shortest span. "+
	"Put them in order by dragging the images to the boxes at the top."+
	"\n\nTolerance for each step is within 5 years for fashion and history, the others must be exact."+
    "\n\nClick or touch the filmstrip icon "+
      "to see all images at full height. Click on the arrows to advance through the deck."
var hIntroS = "Rooms"
var stacksText = "\n\nWe have a problem. "+
	"A history student borrowed 11 objects to make a report on them, but then carelessly (or intentionally!) returned them to the wrong "+
	"rooms. As the newest member of our museum staff, your task is to move them all (or just 4 in Level 1) to the right rooms, and you must finish "+
	"before we open in 20 minutes!"+
    "\n\nClick or touch the filmstrip icon "+
      "to see all images at full height. Click on the arrows to advance through the deck."
var hIntroD = "Collections"
var doorsText = "\n\n"+
	"In this game, you are a gofer (http://en.wikipedia.org/wiki/Gofer) in the museum, asked to collect 4 objects from the museum "+
	" and bring them to "+
	"the curator for more work -- whatever it is she does. \n\nBecause you are the newbie, for initiation "+
	"she has only given you a set of clues to these "+
	"objects, and your task is to visit the right places to find and collect "+
	"objects. Collect them by dragging them onto their clues on the cart at the left."+
    "\n\nClick or touch the filmstrip icon "+
      "to see all images at full height. Click on the arrows to advance through the deck."
var hAlias = "Alias or nickname:"
var hIntroP = "Paths"
var pathsText = "\n\nPaths is a competitve game, each player extending a shared set of events that must be connected chronologically "+
	"(or numerically for some content). The object is to get the most in sequential order (runs of 2, 3, and 4 nodes count) that are your own, "+
	"uninterrupted by events placed by the other player. Players take turns playing events from a common (visible to both) "+
	"pool of events that is refreshed from the database after each play."+
    "\n\nClick or touch the filmstrip icon "+
      "to see all images at full height. Click on the arrows to advance through the deck."

var instruct
hText = ["",
		"Image Size:",
		"Basic Scoring:",
        "Bonuses:",
        "Extra bonuses:",
        "Penalties:",
        ""]

helpText = ["Help and Scoring Rules",
	"Place any 5 images in the correct numerical or chronological order, left to right.",
		"20 points are given for completing a string.",
		"Up to 15 additional points are awarded for Strings matching "+
        	"the shortest span for any 5 within the given set. All Strings are rated against the shortest "+
        "span for that set.",
        "Bonus points (10 pts) are given for getting the first try correct, and for speed (up to 10 pts).",
        "Bonus points (5 pts) are given for any Before Common Era (BCE) date.",
        "Penalties (max 10) are taken for incorrect guesses (number of guesses squared).",
        "Total score is a sum of the 3 most recent Strings."+
			"\n\nClick or touch the filmstrip icon "+
    		"to see all images at full height. Click on the arrows to advance through the deck."
       	]
hText2 = ["","","","","","","",""]
helpTextS = ["Help and Scoring Rules",
	"There are "+DMMnumRooms+" rooms in this museum, each with an object (or book or movie). "+
	"In each of those rooms, the object "+
	"shown is mis-filed, and needs to be moved to its correct room, indicated by a clue in that room.",
	"Your task is to move all 11 objects into their correct rooms. ",
	"To move an object, drag it to cart on the left. To place it in the correct room, drag it from the cart into the room.",
	"",
	"Rooms are arranged somewhat chronologically. "+
		"Move between rooms by touching/clicking the door to another room.",
	"Click or touch the filmstrip icon "+
    	"to see all images at full height. Click on the arrows to advance through the deck.",
	"",""
	],
helpTextD = ["Help and Scoring Rules",
	"You are a gofer at the museum. The curator has sent you to find and collect the 4 objects "+
		"indicated by the clues she has given you, in bubbles at the left. ",
	"There are "+DMMnumRoomsC+" rooms in this museum, each containing containing items from the museum."+
		"\nFull points are awarded for collecting all items with the shortest path between rooms.",
	"Penalties are given for attempting to collect items that are not in the list. ",
	"Rooms are arranged somewhat chronologically. "+
		"Move between rooms by touching/clicking the door to another room.",
	"",
	"Hints: Use the filmstrip to see what is in all the stacks. \nTo plan your shortest path, look at the map.",
	"Click or touch the filmstrip icon "+
    	"to see all images at full height. Click on the arrows to advance through the deck.",
	""]
hTextP = ["","","","","","","",""]
helpTextP = ["Help and Scoring Rules",
	"Build and extend a network of topics or objects by dragging them onto the network.",
	"Each object placed must be in correct chronological or numerical order in the network.",
	"The game ends after 10 turns each or when each player passes consecutively.",
	"",
	"Points (5 pts each) are awarded for each category a player 'owns' at the end of the game."+
		" A player owns a category if they played "+
	"more items of that category than the other player.",
	"Bonus points (10 points) are awarded for any consecutive (in the network, not in turns) placements "+
		"by the same player with the same category, and (3 points) for insertions between two other placements.",
	"Click or touch the filmstrip icon "+
    	"to see all images at full height. Click on the arrows to advance through the deck."
	]
helpTextSS = ["Help and Scoring Rules",
	"This is a timed game.",
	"Click on the image that matches the description in the box.",
	"Descriptions can be detailed or just a single fact, quote, or vague reference to the event in the image.",
	"The game ends when you have correctly identified all 16 images.",
	"You are told at the end how long it took you and how many mistakes you made.",
	"Your total score is the sum of the most recent 3 games.",
	"Click or touch the filmstrip icon "+
    	"to see all images at full height. Click on the arrows to advance through the deck."
	]
helpTextB = ["Help and Scoring Rules",
	"Your goal is to create the largest buckets you can. Buckets are defined by whatever is common to each item. ",
	"Each item belongs in several different "+
		"categories, and when you click on the first item, it defines the bucket with all the categories "+
		"of that item.",
	"Each subsequent item you click on must have something in common with all the other items "+
		"already in the bucket.",
	"When there are no more items that share something with all the other items in the bucket, that "+
        "bucket will automatically close. Whenever the selected items are still at the bottom, there is at "+
        "least one more item that will fit in that bucket.",
	"You can close the current bucket at any time.",
	"Larger buckets score higher than smaller buckets.\\nThe first buckets are harder and score higher than later ones.",
	"Mistakes are penalized."+
	"\n\nClick or touch the filmstrip icon "+
    	"to see all images at full height. Click on the arrows to advance through the deck."
	]


lbhText = ["", "Your Total Score:", "What", "Who", "When"]
lbText = ["Leaderboard for "]

instructText = "Place any 5 in correct chronological order, earliest to the left."
instructTextN = "Place any 5 in correct rank order, lowest number to the left. The number associated with each image is the answer "+
	"to a question that shows up when you touch an image."
instructTextC = "Place any 5 in correct latitude order, "+
	"North Pole to the right, southern hemisphere are negative numbers (to the left)."
instructTextS = "In the 21 stacks of books, find and collect the objects or quotes or scenes on the right."
instructTextS2 = ""
instructTextP = "Your goal is to beat the computer."+
	"\n\nPoints are given for:"+
	"\nMost placements of a category (5 pts)"+
	"\nTwo linked of the same category (10 pts)"+
	"\nInserting between two other nodes (3 pts)"

// Credits
CreditTitle = "Credits"
hCreditText = ["British Museum: ", "Movies: ", "Art: ",
	"", "Literature: ", "Culture:", "Science:", ""]
creditText = ["These images are taken from the British Museum web site, "+
	"© Trustees of the British Museum, used in accordance with their terms (http://www.britishmuseum.org/about_this_site/terms_of_use.aspx). "+
	"All objects in the images are from "+
    "the fabulous book 'The History of the World in 100 Objects' by Neil MacGregor.",
    "Low resolution movie poster images are taken from the IMDB web site, their 'top 100' list, and believed by IdeateGames in accordance with 'Fair Use' principles. ",
    "The list of paintings is from the website 'The 100 Greatest Paintings of All time'. "+
    "Images of paintings are from Wikipedia, and all with 'public domain' or Creative Commons licenses.\n"+
    "20th Century paintings (eg, Dali) are not included because of unclear rights to use them.",
    "",
    "Images are low resolution book cover images, believed by IdeateGames in accordance with 'Fair Use' principles. "+
    "Please contact us if you are a publisher who believes we violate your copyright, we will remove the images.",
    // "Dress images are taken from \n'Dresses Through the Ages' web site",
    // "Most of these images are taken from Wikipedia, and have various "+
    // "credit attributions. Specific URLs are given with each detailed description.",
    "The images in this category are a combination of Art, Literature, and Science.",
    "Information is taken mostly from '100 Greatest Science Discoveries of All Time' by Kendall Haven. "+
    "Images are either drawn by IdeateGames or licensed from 123rf.com",
    "",
 //    "Facts are from the Sierra Club Quiz Deck of Numbers in Nature Knowledge Cards, by Pomegranate Communications. "+
	// "Images are randomly downloaded from the web."
	]

creditURLs = ["http://www.bbc.co.uk/ahistoryoftheworld/about/british-museum-objects/",
	"http://www.imdb.com/list/ls055592025/",
	"http://www.listology.com/lukeprog/list/100-greatest-paintings-all-time-pics/",
	"",
	"","",
	"http://www.amazon.com/100-Greatest-Science-Discoveries-Time/dp/1591582652",
	"",
	// "http://www.sierraclub.org"
	]
// 
PCmission = "Your mission is to find and steal all of the objects described below."
PSmission = "Your mission is to put the mis-filed books in the right rooms. This room should contain a book about:"

ShelvInst = "Items are in the wrong rooms. You must restore 5 of them to the correct rooms.\n\n"+
		"\nRecommended Play\n\n\n"+
		"Walk through the rooms until you find an item on the left that you know. To be sure to see "+
		"all rooms, visit the rooms in chronological or numerical order.\n\n"+
		"Note that all rooms are connected with 'doors' (links at the bottom) to rooms more recent or numerically higher. "+
		"To go backward "+
		"in time or earlier in numerical order, use the 'Return' button (to return to the previous room) "+
		"or the 'Back to Start' button.\n\n"+
		"When you find an item you know, drag it to the hand to carry to it correct room.\n\n"+
		"With the item in hand, navigate (use the 'Show Map' button to see how the rooms are connected) "+
		"to the room where that item belongs (based on the subject at the top and the description to the right), "+
		"then drag it from the hand to the bookstand.\n\n"+
		"Repeat until you have correctly shelved 4 items.\n\n"

StealInst = "Suggested Play\n\nDecide the chronologically earliest object indicated by clues at the top."+
		"You do this because "+
		"rooms are in chronological, and links are directional. The only way back in time or order "+
		"is with the 'Back to' or 'Back to Start' buttons, which are inefficient.\n\n"+
		"Using the map ('Show Map' button), find the room that describes an item from the clues. \n\n"+
		"Navigate to that room in the fewest steps possible.\n\n"+
		"Drag the described object onto the clues at the top.\n\n"+
		"Repeat the previous steps for each item described by a clue.\n\n\n"+
		"If you don't know the order of the clues:\n\n"+
		"Visit each room in order (always pick the lowest date or number to be sure you visit every room).\n\n"+
		"Match the description against each clue.\n\n"+
		"If you find a match, drag the item to the clues bar."


function DMMgameReset(full) {
	// reset user variables
	DMMpenalties = 0
	DMMscore = 0
	numChecks = 0
	numSecs = 0
	timerFlag = false
	stillTrying = false
	IGposted = false
	if (full) {
		IGtotalSecs = 0
		DMMscores = []
		DMMnumStrings = 0
	}
}

loadURL = function(e) {
	window.open(e.url)
//	this.document.location.href = url
}
loadURLExt = function(e) {
//	var myWindow=window.open(e.url)
	this.document.location.href = e.url
}
function DMMnewGame() {
	game.state.start('credits',true,true)
}

CleanupList = []
gameStarted = false