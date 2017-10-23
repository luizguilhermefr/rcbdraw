function PolyFill (polygon, h, v) {

    this.polygon = polygon;

    this.h = h;

    this.v = v;

    this.edges = [];

    this.minV = 0;

    this.maxV = 0;

    this.intersections = [];


    this.createEdges = function() {
        let vertices = this.polygon.getVertices();
        this.edges = [];
        for (let i = 0; i < this.vertices.length - 1; i++) {
            if (this.v === 'y') {
                if (vertices[i].getY() < vertices[i + 1].getY()) {
                    this.edges.push(new Edge(vertices[i], vertices[i + 1]));
                } else {
                    this.edges.push(new Edge(vertices[i + 1], vertices[i]));
                }
            }
            else {
                if (vertices[i].getZ() < vertices[i + 1].getZ()) {
                    this.edges.push(new Edge(vertices[i], vertices[i + 1]));
                } else {
                    this.edges.push(new Edge(vertices[i + 1], vertices[i]));
                }
            }
        }
    };

    this.setMinMax = function () {
        let boundaries = this.polygon.getBoundaries();
        if (this.v === 'y') {
            this.min = boundaries.minY;
            this.max = boundaries.maxY;
        }
        else {
            this.min = boundaries.minZ;
            this.max = boundaries.maxZ;
        }
    };

    this.intersections = function (active, value) {
        for(let i = this.edges.length - 1; i >= 0; i--){
            let currentEdge = this.edges[i];
            if (this.v === 'y') {
                if(currentEdge.isValidY(value)){
                    this.edges.splice(i, 1);
                    active.push(currentEdge);
                }
            }
            else {
                if(currentEdge.isValidZ(value)){
                    this.edges.splice(i, 1);
                    active.push(currentEdge);
                }
            }
        }
        active.sort(function(a,b){
            return this.h === 'x' ? a.x - b.x : a.z - b.z;
        });
    };

    this.incrementM = function(intersections) {
        intersections = intersections.filter(function(a) {
            if (h === 'x' && v === 'y') { // front
                return a.nextXY();
            } else if (h === 'x' && v === 'z') { // top
                return a.nextXZ();
            } else { // left
                return a.nextZY();
            }
        });
        return intersections;
    };

    this.getX = function (edge) {

    };

    this.getZ = function (edge) {

    };

    this.run = function (context, color) {
        this.createEdges();
        this.setMinMax();
        for(let i = min; i <= max; i++) {
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = color;
            for(let j = 0; j < this.intersections.length - 1; j += 2) {
                if (this.h === 'x') {
                    context.moveTo(this.getX(this.intersections[j]), i);
                    context.lineTo(this.getX(this.intersections[j+1]), i);
                }
                else {
                    context.moveTo(this.getZ(this.intersections[j]), i);
                    context.lineTo(this.getZ(this.intersections[j+1]), i);
                }
            }
            context.stroke();
            intersections = incrementM(intersections);
        }
    };

}