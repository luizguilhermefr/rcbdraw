function PolyFill (polygon, h, v) {

    this.polygon = polygon;

    this.h = h;

    this.v = v;

    this.edges = [];

    this.minV = 0;

    this.maxV = 0;

    this.intersections = [];

    this.createEdges = function () {
        let vertices = this.polygon.getVertices();
        this.edges = [];
        for (let i = 0; i < this.vertices.length - 1; i++) {
            if (this.v === 'y') {
                if (vertices[ i ].getY() < vertices[ i + 1 ].getY()) {
                    this.edges.push(new Edge(vertices[ i ], vertices[ i + 1 ]));
                } else {
                    this.edges.push(new Edge(vertices[ i + 1 ], vertices[ i ]));
                }
            }
            else {
                if (vertices[ i ].getZ() < vertices[ i + 1 ].getZ()) {
                    this.edges.push(new Edge(vertices[ i ], vertices[ i + 1 ]));
                } else {
                    this.edges.push(new Edge(vertices[ i + 1 ], vertices[ i ]));
                }
            }
        }
    };

    this.setMinMax = function () {
        let boundaries = this.polygon.getBoundaries();
        if (this.v === 'y') {
            this.minV = boundaries.minY;
            this.maxV = boundaries.maxY;
        }
        else {
            this.minV = boundaries.minZ;
            this.maxV = boundaries.maxZ;
        }
    };

    this.setIntersections = function (value) {
        for (let i = this.edges.length - 1; i >= 0; i--) {
            let currentEdge = this.edges[ i ];
            if (this.v === 'y') {
                if (currentEdge.isValidY(value)) {
                    this.edges.splice(i, 1);
                    this.intersections.push(currentEdge);
                }
            }
            else {
                if (currentEdge.isValidZ(value)) {
                    this.edges.splice(i, 1);
                    this.intersections.push(currentEdge);
                }
            }
        }

        this.intersections.sort(function (a, b) {
            return this.h === 'x' ? a.x - b.x : a.z - b.z;
        }.bind(this));
    };

    this.incrementM = function (intersections) {
        intersections = intersections.filter(function (edge) {
            if (this.h === 'x' && this.v === 'y') { // front
                return edge.nextXY();
            } else if (this.h === 'x' && this.v === 'z') { // top
                return edge.nextXZ();
            } else { // left
                return edge.nextZY();
            }
        }.bind(this));

        return intersections;
    };

    this.run = function (context, color) {
        this.createEdges();
        this.setMinMax();
        this.intersections = [];
        for (let i = this.minV; i <= this.maxV; i++) {
            this.setIntersections(i);
            context.lineWidth = 1;
            context.strokeStyle = color;
            context.beginPath();
            for (let j = 0; j < this.intersections.length - 1; j += 2) {
                if (this.h === 'x' && this.v === 'y') {
                    context.moveTo(this.intersections[ j ].getX0Y(), i);
                    context.lineTo(this.intersections[ j + 1 ].getX0Y(), i);
                }
            }
            context.stroke();
            this.intersections = this.incrementM(this.intersections);
        }
    };

}