

function IGnetworkGraph(rooms,starter,nlib) {
    var g, renderer, layouter;

    var gwidth = WIDTH;
    var gheight = ry(400);
    var nodesList = []

    var render = function(r, n) {
            /* the Raphael set is obligatory, containing all you want to display */
            var set = r.set().push(
                /* custom objects go here */
                r.rect(n.point[0]-30, n.point[1]-13, 60, 44).attr({"fill": "#fff", r : "12px", "stroke-width" : n.distance == 0 ? "3px" : "1px" })).push(
                r.text(n.point[0], n.point[1] + 10, (n.label || n.id)));
            return set;
        };

   var render2 = function(r, n) {
            /* the Raphael set is obligatory, containing all you want to display */
            var set = r.set().push(
                /* custom objects go here */
                r.rect(n.point[0]-30, n.point[1]-13, 60, 44).attr({"fill": n.fill, r : "12px", "stroke-width" : n.distance == 0 ? "3px" : "1px" })).push(
                r.text(n.point[0], n.point[1] + 10, (n.label || n.id)));
            return set;
        };



    if (rooms) {

        g = new Graph();

        g.edgeFactory.template.style.directed = true;
        for (var key in rooms) { if (rooms[key].cx) {
            // if (key == starter) {
            // given the fixed location, don't need the start label
            if (key == starter) {
                g.addNode(key, {label: rooms[key].label, render:render})
            } else if (key == nlib) {
                    g.addNode(key, {label: rooms[key].label, fill: "#f00", render:render2})
            } else if (rooms[key].visited) {
                    g.addNode(key, {label: rooms[key].label, fill: "#000", render:render2})
            } else {
                    g.addNode(key, {label: rooms[key].label, fill: "#ff0", render:render2})
            }
            nodesList.push(key)
        }}

        for (var ir in rooms) {
            if (rooms[ir].cx) {
                for (var icx=0;icx<rooms[ir].cx.length;icx++) {g.addEdge(ir,"library"+rooms[ir].cx[icx])}
            }
        }

        /* layout the graph using the Spring layout implementation */
        layouter = new Graph.Layout.Ordered(g, topological_sort(g));
        
        /* draw the graph using the RaphaelJS draw implementation */
        // var layouter = new Graph.Layout.Ordered(g, topological_sort(g));
        renderer = new Graph.Renderer.Raphael('map', g, gwidth, gheight);

    } else {
        // for (var n=0;n<nodesList.length;n++) {g.removeNode(nodesList.pop())}
        var paperDom = document.getElementById("map");
        paperDom.innerHTML = '';
    }

    
};
