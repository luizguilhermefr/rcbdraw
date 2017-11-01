function Polygon (vertices) {

    this.updateBoundaries = function() {
        let maxX = Number.MIN_VALUE;
        let minX = Number.MAX_VALUE;
        let maxY = Number.MIN_VALUE;
        let minY = Number.MAX_VALUE;
        let maxZ = Number.MIN_VALUE;
        let minZ = Number.MAX_VALUE;

        for (let i = 0; i < this.vertices.length; i++) {
            let v = this.vertexAt(i);
            let vx = v.getX();
            let vy = v.getY();
            let vz = v.getZ();

            maxX = vx > maxX ? vx : maxX;
            minX = vx < minX ? vx : minX;

            maxY = vy > maxY ? vy : maxY;
            minY = vy < minY ? vy : minY;

            maxZ = vz > maxZ ? vz : maxZ;
            minZ = vz < minZ ? vz : minZ;
        }

        this.boundaries = { maxX, minX, maxY, minY, maxZ, minZ };

        return this;
    };

    this.getBoundaries = function () {
        return this.boundaries;
    };

    this.getDrawablePerspectiveVertices = function (canvasWidth, canvasHeight, worldWidth, worldHeight) {
        let vrp = new Vertex(0, 100, 0);
        let viewUp = new Vertex(0, 0, 1);
        let pipeline = new Pipeline(this, canvasWidth, canvasHeight, worldWidth, worldHeight, vrp, viewUp, true);
        let vertices = pipeline.run();        
        
        return vertices;
    };

    this.updateDrawableVertices = function (h, v, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        let vrp, viewUp;
        if (h === 'x' && v === 'y') {
            vrp = new Vertex(0, 0, 100);
            viewUp = new Vertex(0, 1, 0);
        } else if (h === 'x' && v === 'z') {
            vrp = new Vertex(0, 100, 0);
            viewUp = new Vertex(0, 0, 1);
        } else if(h === 'z' && v === 'y'){
            vrp = new Vertex(100, 0, 0);
            viewUp = new Vertex(0, 1, 0);
        }
        let pipeline = new Pipeline(this, canvasWidth, canvasHeight, worldWidth, worldHeight, vrp, viewUp);
        let vertices = pipeline.run();        
        this.setDrawableVertices(vertices, h, v);

        return this;
    };

    this.setDrawableVertices = function (vertices, h, v) {
        if (h === 'x' && v === 'y') {
            this.drawableVerticesXY = vertices;
        } else if (h === 'x' && v === 'z') {
            this.drawableVerticesXZ = vertices;
        } else if (h === 'z' && v === 'y') {
            this.drawableVerticesZY = vertices;
        }
        this.updateDrawableBoundaries(h, v);

        return this;
    };

    this.getDrawableVertices = function (h, v) {
        if (h === 'x' && v === 'y') {
            return this.drawableVerticesXY;
        } else if (h === 'x' && v === 'z') {
            return this.drawableVerticesXZ;
        } else if (h === 'z' && v === 'y') {
            return this.drawableVerticesZY;
        }
    };

    this.getDrawableVertexAt = function (index, h, v) {
        if (h === 'x' && v === 'y') {
            return this.drawableVerticesXY[ index ];
        } else if (h === 'x' && v === 'z') {
            return this.drawableVerticesXZ[ index ];
        } else if (h === 'z' && v === 'y') {
            return this.drawableVerticesZY[ index ];
        }

        return null;
    };

    this.updateDrawableBoundaries = function (h, v) {
        let maxX = Number.MIN_VALUE;
        let minX = Number.MAX_VALUE;
        let maxY = Number.MIN_VALUE;
        let minY = Number.MAX_VALUE;

        this.getDrawableVertices(h, v).forEach(function (v) {
            let vx = v.getX();
            let vy = v.getY();

            maxX = vx > maxX ? vx : maxX;
            minX = vx < minX ? vx : minX;

            maxY = vy > maxY ? vy : maxY;
            minY = vy < minY ? vy : minY;
        });

        this.setDrawableBoundaries({ maxX, minX, maxY, minY }, h, v);

        return this;
    };

    this.getDrawableBoundaries = function (h, v) {
        if (h === 'x' && v === 'y') {
            return this.drawableBoundariesXY;
        } else if (h === 'x' && v === 'z') {
            return this.drawableBoundariesXZ;
        } else if (h === 'z' && v === 'y') {
            return this.drawableBoundariesZY;
        }
    };

    this.setDrawableBoundaries = function (boundary, h, v) {
        if (h === 'x' && v === 'y') {
            this.drawableBoundariesXY = boundary;
        } else if (h === 'x' && v === 'z') {
            this.drawableBoundariesXZ = boundary;
        } else if (h === 'z' && v === 'y') {
            this.drawableBoundariesZY = boundary;
        }

        return this;
    };

    this.getVertices = function () {
        return this.vertices;
    };

    this.countVertices = function () {
        return this.vertices.length;
    };

    this.vertexAt = function (index) {
        return this.vertices[ index ];
    };

    this.closestPoint = function (vertex) {
        let closestPoint = {
            distance: Number.POSITIVE_INFINITY,
            vertex: null
        };
        this.vertices.forEach(function (v) {
            let distance = v.distanceToVertex(vertex);
            if (distance < closestPoint.distance) {
                closestPoint.distance = distance;
                closestPoint.vertex = v;
            }
        });

        return closestPoint.vertex;
    };

    this.closestDrawedEdge = function (clickVertex, h, v) {
        let closestEdge = {
            distance: Number.POSITIVE_INFINITY,
            index: -1
        };
        for (let i = 0; i < this.countVertices() - 1; i++) {
            let from = this.getDrawableVertexAt(i, h, v);
            let to = this.getDrawableVertexAt(i + 1, h, v);
            let currentDistance = clickVertex.distanceToEdgeXY(new Edge(from, to));
            if (currentDistance < closestEdge.distance) {
                closestEdge = {
                    distance: currentDistance,
                    index: i
                };
            }
        }

        return closestEdge;
    };

    this.translatePoint = function (vertex) {
        for (let v = 0; v < this.vertices.length; v++) {
            this.vertices[ v ].setX(this.vertices[ v ].getX() - vertex.getX());
            this.vertices[ v ].setY(this.vertices[ v ].getY() - vertex.getY());
            this.vertices[ v ].setZ(this.vertices[ v ].getZ() - vertex.getZ());
        }
        this.updateBoundaries();
    };

    this.getCenter = function () {
        return this.center;
    };

    this.rotate = function(teta, axis) {
        if( axis === 'x') {
            for(let i = 0; i < vertices.length; i++) {
                vertices[i].xRotation(teta);
            }            
        } else if( axis === 'y') {
            for(let i = 0; i < vertices.length; i++) {
                vertices[i].yRotation(teta);
            }
        } else if(axis === 'z'){
            for(let i = 0; i < vertices.length; i++) {
                vertices[i].zRotation(teta);
            }
        }
    };

    this.getNewPointX = function (x, y, teta) {
        return (x * Math.cos(teta)) - (y * Math.sin(teta));
    };

    this.getNewPointY = function (x, y, teta) {
        return (x * Math.sin(teta)) + (y * Math.cos(teta));
    };

    this.scale = function (vertex, clone) {
        let referenceCenter = this.getCenter();
        let scaleFactor = {
            X: (vertex.getX() - referenceCenter.getX()) / 500,
            Y: (vertex.getY() - referenceCenter.getY()) / 500
        };
        this.translatePoint(referenceCenter);
        for (let i = 0; i < this.vertices.length; i++) {
            vertices[ i ].setX(vertices[ i ].getX() + Math.round((clone.vertexAt(i).getX() * scaleFactor.X)));
            vertices[ i ].setY(vertices[ i ].getY() + Math.round(clone.vertexAt(i).getY() * scaleFactor.Y));
        }
        referenceCenter.invert();
        this.translatePoint(referenceCenter);
        this.updateBoundaries();
        return this;
    };

    this.shearX = function (vertex) {
        let referenceVertex = this.getCenter();
        let shearFactor = (vertex.getX() - referenceVertex.getX()) / referenceVertex.getY();
        this.translatePoint(referenceVertex);
        this.vertices.forEach(function (v) {
            v.setX(v.getX() + shearFactor * v.getY());
        });
        referenceVertex.invert();
        this.translatePoint(referenceVertex);
        this.updateBoundaries();

        return this;
    };

    this.shearY = function (vertex) {
        let referenceVertex = this.getCenter();
        let shearFactor = (vertex.getY() - referenceVertex.getY()) / referenceVertex.getX();
        this.translatePoint(referenceVertex);
        this.vertices.forEach(function (v) {
            v.setY(v.getY() + shearFactor * v.getX());
        });
        referenceVertex.invert();
        this.translatePoint(referenceVertex);
        this.updateBoundaries();

        return this;
    };

    this.inside = function (x, y) {
        let isInside = false;
        for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            let xi = this.vertices[ i ].getX(),
                yi = this.vertices[ i ].getY();
            let xj = this.vertices[ j ].getX(),
                yj = this.vertices[ j ].getY();

            let intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                isInside = !isInside;
            }
        }
        return isInside;
    };

    // noinspection SyntaxError
    this.clone = function (displacement = 0) {
        let nextVertices = [];
        this.vertices.forEach(function (v) {
            nextVertices.push(new Vertex(v.getX() + displacement, v.getY() + displacement, v.getZ() + displacement));
        });
        return new Polygon(nextVertices, this.strokeColor, this.fillColor, this.mustStroke, this.mustFill);
    };

    this.toMatrix = function () {
        let vertices = [ [], [], [], [] ];
        this.getVertices().forEach(function (v) {
            vertices[ 0 ].push(v.getX());
            vertices[ 1 ].push(v.getY());
            vertices[ 2 ].push(v.getZ());
            vertices[ 3 ].push(1);
        });

        return vertices;
    };

    this.isInsideDrawableBoundaryTolerance = function (clickVertex, h, v) {
        let tolerance = 20;
        let boundary = this.getDrawableBoundaries(h, v);

        let insideX = (clickVertex.getX() < (boundary.maxX + tolerance)) && (clickVertex.getX() > (boundary.minX - tolerance));
        let insideY = (clickVertex.getY() < (boundary.maxY + tolerance)) && (clickVertex.getY() > (boundary.minY - tolerance));

        return insideX && insideY;
    };

    this.vertices = vertices;

    this.drawableVerticesXY = null;

    this.drawableBoundariesXY = null;

    this.drawableVerticesXZ = null;

    this.drawableVerticesPerspective = null;

    this.drawableBoundariesXZ = null;

    this.drawableVerticesZY = null;

    this.drawableBoundariesZY = null;

    this.edges = [];

    this.boundaries = null;

    this.updateBoundaries();
}