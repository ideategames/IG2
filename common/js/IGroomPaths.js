// 
// IGroomPaths.js
//
// Source for all room maps
//

var roomLocsPot = []
roomLocsPot.push([8, 9, 10, 11, 16, 18, 19, 25, 26, 32, 33])
roomLocsPot.push([16, 17, 18, 19, 22, 23, 26, 30, 31, 32, 33])
roomLocsPot.push([9, 11, 16, 18, 22, 23, 24, 25, 26, 30, 32])
roomLocsPot.push([10, 17, 19, 22, 23, 24, 25, 26, 29, 31, 38])
roomLocsPot.push([8, 9, 10, 11, 12, 15, 19, 22, 26, 29, 33])
roomLocsPot.push([9, 10, 11, 15, 16, 18, 22, 25, 29, 30, 31])
roomLocsPot.push([9, 11, 16, 17, 18, 23, 24, 25, 30, 31, 32])
roomLocsPot.push([15, 16, 17, 19, 22, 24, 26, 29, 31, 32, 33])
roomLocsPot.push([8, 9, 15, 16, 17, 24, 31, 32, 33, 39, 40])
roomLocsPot.push([8, 12, 15, 16, 18, 19, 23, 24, 25, 30, 32])

var roomDists = []

roomDists.push({8: {9:1,10:2,11:3,16:2,18:4,19:5,25:5,26:6,32:6,33:7, },
	9: {10:1,11:2,16:1,18:3,19:4,25:4,26:5,32:5,33:6, },
	10: {11:1,16:2,18:2,19:3,25:3,26:4,32:4,33:5, },
	11: {16:3,18:1,19:2,25:2,26:3,32:3,33:4, },
	16: {18:4,19:5,25:5,26:6,32:6,33:7, },
	18: {19:1,25:1,26:2,32:2,33:3, },
	19: {25:2,26:1,32:3,33:2, },
	25: {26:1,32:1,33:2, },
	26: {32:2,33:1, },
	32: {33:1, },
})

roomDists.push({16: {17:1,18:2,19:3,22:2,23:1,26:4,30:2,31:3,32:4,33:5, },
	17: {18:1,19:2,22:3,23:2,26:3,30:3,31:4,32:5,33:4, },
	18: {19:1,22:4,23:3,26:2,30:4,31:5,32:4,33:3, },
	19: {22:5,23:4,26:1,30:5,31:4,32:3,33:2, },
	22: {23:1,26:6,30:2,31:3,32:4,33:5, },
	23: {26:5,30:1,31:2,32:3,33:4, },
	26: {30:4,31:3,32:2,33:1, },
	30: {31:1,32:2,33:3, },
	31: {32:1,33:2, },
	32: {33:1, },
})

roomDists.push({9: {11:6,16:1,18:5,22:3,23:2,24:3,25:4,26:5,30:3,32:5, },
	11: {16:5,18:1,22:5,23:4,24:3,25:2,26:3,30:5,32:3, },
	16: {18:4,22:2,23:1,24:2,25:3,26:4,30:2,32:4, },
	18: {22:4,23:3,24:2,25:1,26:2,30:4,32:2, },
	22: {23:1,24:2,25:3,26:4,30:2,32:4, },
	23: {24:1,25:2,26:3,30:1,32:3, },
	24: {25:1,26:2,30:2,32:2, },
	25: {26:1,30:3,32:1, },
	26: {30:4,32:2, },
	30: {32:4, },
})

roomDists.push({10: {17:1,19:5,22:4,23:3,24:2,25:3,26:4,29:5,31:3,38:4, },
	17: {19:4,22:3,23:2,24:1,25:2,26:3,29:4,31:2,38:3, },
	19: {22:5,23:4,24:3,25:2,26:1,29:6,31:4,38:5, },
	22: {23:1,24:2,25:3,26:4,29:1,31:3,38:4, },
	23: {24:1,25:2,26:3,29:2,31:2,38:3, },
	24: {25:1,26:2,29:3,31:1,38:2, },
	25: {26:1,29:4,31:2,38:3, },
	26: {29:5,31:3,38:4, },
	29: {31:4,38:5, },
	31: {38:1, },
})

roomDists.push({8: {9:1,10:2,11:3,12:4,15:1,19:5,22:2,26:6,29:3,33:7, },
	9: {10:1,11:2,12:3,15:2,19:4,22:3,26:5,29:4,33:6, },
	10: {11:1,12:2,15:3,19:3,22:4,26:4,29:5,33:5, },
	11: {12:1,15:4,19:2,22:5,26:3,29:6,33:4, },
	12: {15:5,19:1,22:6,26:2,29:7,33:3, },
	15: {19:6,22:1,26:7,29:2,33:8, },
	19: {22:7,26:1,29:8,33:2, },
	22: {26:8,29:1,33:9, },
	26: {29:9,33:1, },
	29: {33:10, },
})

roomDists.push({9: {10:1,11:2,15:2,16:1,18:3,22:3,25:4,29:4,30:5,31:6, },
	10: {11:1,15:3,16:2,18:2,22:4,25:3,29:5,30:6,31:7, },
	11: {15:4,16:3,18:1,22:5,25:2,29:6,30:7,31:8, },
	15: {16:1,18:5,22:1,25:6,29:2,30:3,31:4, },
	16: {18:4,22:2,25:5,29:3,30:4,31:5, },
	18: {22:6,25:1,29:7,30:8,31:9, },
	22: {25:7,29:1,30:2,31:3, },
	25: {29:8,30:9,31:10, },
	29: {30:1,31:2, },
	30: {31:1, },
})

roomDists.push({9: {11:4,16:1,17:2,18:3,23:2,24:3,25:4,30:3,31:4,32:5, },
	11: {16:3,17:2,18:1,23:4,24:3,25:2,30:5,31:4,32:3, },
	16: {17:1,18:2,23:1,24:2,25:3,30:2,31:3,32:4, },
	17: {18:1,23:2,24:1,25:2,30:3,31:2,32:3, },
	18: {23:3,24:2,25:1,30:4,31:3,32:2, },
	23: {24:1,25:2,30:1,31:2,32:3, },
	24: {25:1,30:2,31:1,32:2, },
	25: {30:3,31:2,32:1, },
	30: {31:1,32:2, },
	31: {32:1, },
})

roomDists.push({15: {16:1,17:2,19:8,22:1,24:3,26:7,29:2,31:4,32:5,33:6, },
	16: {17:1,19:7,22:2,24:2,26:6,29:3,31:3,32:4,33:5, },
	17: {19:6,22:3,24:1,26:5,29:4,31:2,32:3,33:4, },
	19: {22:9,24:5,26:1,29:10,31:4,32:3,33:2, },
	22: {24:4,26:8,29:1,31:5,32:6,33:7, },
	24: {26:4,29:5,31:1,32:2,33:3, },
	26: {29:9,31:3,32:2,33:1, },
	29: {31:6,32:7,33:8, },
	31: {32:1,33:2, },
	32: {33:1, },
})

roomDists.push({8: {9:1,15:1,16:2,17:3,24:4,31:5,32:6,33:7,39:7,40:8, },
	9: {15:2,16:1,17:2,24:3,31:4,32:5,33:6,39:6,40:7, },
	15: {16:1,17:2,24:3,31:4,32:5,33:6,39:6,40:7, },
	16: {17:1,24:2,31:3,32:4,33:5,39:5,40:6, },
	17: {24:1,31:2,32:3,33:4,39:4,40:5, },
	24: {31:1,32:2,33:3,39:3,40:4, },
	31: {32:1,33:2,39:2,40:3, },
	32: {33:1,39:1,40:2, },
	33: {39:2,40:1, },
	39: {40:1, },
})

roomDists.push({8: {12:8,15:1,16:2,18:6,19:7,23:3,24:4,25:5,30:4,32:6, },
	12: {15:7,16:6,18:2,19:1,23:5,24:4,25:3,30:6,32:4, },
	15: {16:1,18:5,19:6,23:2,24:3,25:4,30:3,32:5, },
	16: {18:4,19:5,23:1,24:2,25:3,30:2,32:4, },
	18: {19:1,23:3,24:2,25:1,30:4,32:2, },
	19: {23:4,24:3,25:2,30:5,32:3, },
	23: {24:1,25:2,30:1,32:3, },
	24: {25:1,30:2,32:2, },
	25: {30:3,32:1, },
	30: {32:4, },
})
