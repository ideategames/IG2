#!/usr/bin/python
# set up Dijkstra first

roomLocsPot = []
roomLocsPot.append([ 8,9,10,11,16,18,19,25,26,32,33 ])
roomLocsPot.append([ 16,17,18,19,22,23,26,30,31,32,33 ])
roomLocsPot.append([ 9,11,16,18,22,23,24,25,26,30,32 ])
roomLocsPot.append([ 10,17,19,22,23,24,25,26,29,31,38 ])
roomLocsPot.append([ 8,9,10,11,12,15,19,22,26,29,33 ])
roomLocsPot.append([ 9,10,11,15,16,18,22,25,29,30,31 ])
roomLocsPot.append([ 9,11,16,17,18,23,24,25,30,31,32 ])
roomLocsPot.append([ 15,16,17,19,22,24,26,29,31,32,33 ])
roomLocsPot.append([ 8,9,15,16,17,24,31,32,33,39,40 ])
roomLocsPot.append([ 8,12,15,16,18,19,23,24,25,30,32 ])


def dijkstra(graph,src,dest,visited=[],distances={},predecessors={}):
    """ calculates a shortest path tree routed in src
    """    
    # a few sanity checks
    if src not in graph:
        raise TypeError('the root of the shortest path tree cannot be found in the graph')
    if dest not in graph:
        raise TypeError('the target of the shortest path cannot be found in the graph')    
    # ending condition
    if src == dest:
        # We build the shortest path and display it
        path=[]
        pred=dest
        while pred != None:
            path.append(pred)
            pred=predecessors.get(pred,None)
        # print('shortest path: '+str(path)+" cost="+str(distances[dest]))
    else :     
        # if it is the initial  run, initializes the cost
        if not visited: 
            distances[src]=0
        # visit the neighbors
        for neighbor in graph[src] :
            if neighbor not in visited:
                new_distance = distances[src] + graph[src][neighbor]
                if new_distance < distances.get(neighbor,float('inf')):
                    distances[neighbor] = new_distance
                    predecessors[neighbor] = src
        # mark as visited
        visited.append(src)
        # now that all neighbors have been visited: recurse                         
        # select the non visited node with lowest distance 'x'
        # run Dijskstra with src='x'
        unvisited={}
        for k in graph:
            if k not in visited:
                unvisited[k] = distances.get(k,float('inf'))
        # print("unvis: "+str(unvisited))
        if unvisited:
            x=min(unvisited, key=unvisited.get)
        else:
        	x = dest
        dijkstra(graph,x,dest,visited,distances,predecessors)
    return distances[dest]

#
#
##############################################################
#
mapWid = 7 # first and last columns blank, so effectively 5
mapHgt = 7 # bottom row blank

# The network of rooms (assuming a 5x5 within a 7x7)
# rooms = [ 8,12,15,16,18,19,23,24,25,30,32 ]
# roomLocs = [ 8,12,15,16,18,19,23,24,25,30,32 ]

# graphRooms = {}
roomLocs = []
def getRoomAdjacencies(room):
	# grid is mapWid x mapHgt
	# grid of rooms always has a blank border row
	# and column, so +/- 1 always works, doesn't wrap row
	ret = []
	if (room-1) in roomLocs:
		ret.append(room-1)
	if (room+mapWid) in roomLocs:
		ret.append(room+mapWid)
	if (room+1) in roomLocs:
		ret.append(room+1)
	if (room-mapWid) in roomLocs:
		ret.append(room-mapWid)
	return ret

#
#
# Write out the distances
#
of = open('/Users/davidmarques/prog/Mongoose.app/Contents/IdeateGames/init/static/IG/common/js/IGroomPaths.js','w')
of.write("// \n// IGroomPaths.js\n//\n// Source for all room maps\n//\n\n")
#
# write out the rooms
of.write("var roomLocsPot = []\n")
for rs in roomLocsPot:
	of.write("roomLocsPot.push("+str(rs)+")\n")

of.write("\nvar roomDists = []\n")

for rooms in roomLocsPot:
	#
	# loop through the rooms setting and their connections
	#
	roomLocs = rooms
	graphRooms = {}
	for r in rooms:
		graphRooms[r] = {}
		for a in getRoomAdjacencies(r):
			graphRooms[r][a] = 1
		# print(str(r)+":"+str(getRoomAdjacencies(r)))
	of.write('\nroomDists.push({')
	for r in rooms:
		sp = '\t'
		if (r==rooms[0]):
			sp=''
		if (r<rooms[len(rooms)-1]):
			# dijkstra(graphRooms,r,rooms[len(rooms)-1],visited=[],distances={},predecessors={})
			of.write(sp+str(r)+': {')
			for r1 in rooms:
				if (r1>r):
					of.write(str(r1)+':'+str(dijkstra(graphRooms,r,r1,visited=[],distances={},predecessors={}))+',')
			of.write(' },\n')
	of.write('})\n')
of.close()