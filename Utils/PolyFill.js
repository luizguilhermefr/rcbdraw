function PolyFill (polygon, h, v) {

    this.createEdges = function () {
        let vertices = this.polygon.getDrawableVertices(this.h, this.v);
        this.edges = [];
        for (let i = 0; i < vertices.length - 1; i++) {
            if (vertices[ i ].getY() < vertices[ i + 1 ].getY()) {
                this.edges.push(new Edge(vertices[ i ], vertices[ i + 1 ]));
            } else {
                this.edges.push(new Edge(vertices[ i + 1 ], vertices[ i ]));
            }
        }
    };

    this.setMinMax = function () {
        let boundaries = this.polygon.getDrawableBoundaries(this.h, this.v);
        this.minV = boundaries.minY;
        this.maxV = boundaries.maxY;
    };

    this.setIntersections = function (value) {
        for (let i = this.edges.length - 1; i >= 0; i--) {
            let currentEdge = this.edges[ i ];
            if (currentEdge.isValidY(value)) {
                this.edges.splice(i, 1);
                this.intersections.push(currentEdge);
            }
        }

        this.intersections.sort(function (a, b) {
            return a.x - b.x;
        }.bind(this));
    };

    this.incrementM = function (intersections) {
        intersections = intersections.filter(function (edge) {
            return edge.nextXY();
        });

        return intersections;
    };

    this.run = function (context) {
        this.createEdges();
        this.setMinMax();
        this.intersections = [];
        for (let i = this.minV; i <= this.maxV; i++) {
            this.setIntersections(i);
            for (let j = 0; j < this.intersections.length - 1; j += 2) {
                context.moveTo(this.intersections[ j ].getX0Y(), i);
                context.lineTo(this.intersections[ j + 1 ].getX0Y(), i);
            }
            context.stroke();
            this.intersections = this.incrementM(this.intersections);
        }
    };

    this.polygon = polygon;

    this.edges = [];

    this.minV = 0;

    this.maxV = 0;

    this.intersections = [];

    this.h = h;

    this.v = v;
}