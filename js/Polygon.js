function Polygon (vertices) {

    this.updateBoundaries = function () {
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

    this.getDrawablePerspectiveVertices = function (canvasWidth, canvasHeight, worldWidth, worldHeight, vrp, viewUp) {
        let pipeline = new Pipeline(this, canvasWidth, canvasHeight, worldWidth, worldHeight, vrp, viewUp, true);
        // noinspection UnnecessaryLocalVariableJS
        let vertices = pipeline.run();

        return vertices;
    };

    this.updateDrawableVertices = function (h, v, canvasWidth, canvasHeight, worldWidth, worldHeight, vrp = null, viewUp = null, forceVisible = false) {
        if (h === 'x' && v === 'y') {
            vrp = new Vertex(0, 0, 100);
            viewUp = new Vertex(0, 1, 0);
        } else if (h === 'x' && v === 'z') {
            vrp = new Vertex(0, 100, 0);
            viewUp = new Vertex(0, 0, 1);
        } else if (h === 'z' && v === 'y') {
            vrp = new Vertex(100, 0, 0);
            viewUp = new Vertex(0, 1, 0);
        } else {
            perspective = true;
        }
        let pipeline = new Pipeline(this, canvasWidth, canvasHeight, worldWidth, worldHeight, vrp, viewUp);
        let visible = pipeline.normal(forceVisible);
        this.setVisibility(visible, h, v);
        if (visible) {
            let vertices = pipeline.run();
            this.setDrawableVertices(vertices, h, v);
        }
        return this;
    };

    this.setVisibility = function (visible, h, v) {
        if (h === 'x' && v === 'y') {
            this.visibleXY = visible;
        } else if (h === 'x' && v === 'z') {
            this.visibleXZ = visible;
        } else if (h === 'z' && v === 'y') {
            this.visibleZY = visible;
        } else {
            this.visiblePersp = visible;
        }

        return this;
    };

    this.isVisible = function (h, v) {
        if (h === 'x' && v === 'y') {
            return this.visibleXY;
        } else if (h === 'x' && v === 'z') {
            return this.visibleXZ;
        } else if (h === 'z' && v === 'y') {
            return this.visibleZY;
        } else {
            return this.visiblePersp;
        }
    };

    this.setDrawableVertices = function (vertices, h, v) {
        if (h === 'x' && v === 'y') {
            this.drawableVerticesXY = vertices;
        } else if (h === 'x' && v === 'z') {
            this.drawableVerticesXZ = vertices;
        } else if (h === 'z' && v === 'y') {
            this.drawableVerticesZY = vertices;
        } else {
            this.drawableVerticesPerspective = vertices;
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
        } else {
            return this.drawableVerticesPerspective;
        }
    };

    this.getDrawableVertexAt = function (index, h, v) {
        if (h === 'x' && v === 'y') {
            return this.drawableVerticesXY[ index ];
        } else if (h === 'x' && v === 'z') {
            return this.drawableVerticesXZ[ index ];
        } else if (h === 'z' && v === 'y') {
            return this.drawableVerticesZY[ index ];
        } else {
            return this.drawableVerticesPerspective[ index ];
        }
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
        } else {
            return this.drawableBoundariesPerspective;
        }
    };

    this.setDrawableBoundaries = function (boundary, h, v) {
        if (h === 'x' && v === 'y') {
            this.drawableBoundariesXY = boundary;
        } else if (h === 'x' && v === 'z') {
            this.drawableBoundariesXZ = boundary;
        } else if (h === 'z' && v === 'y') {
            this.drawableBoundariesZY = boundary;
        } else {
            this.drawableBoundariesPerspective = boundary;
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
        return this.vertices[ index ].clone();
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

    this.invertOrientation = function () {
        let newVertices = [];
        for (i = this.vertices.length - 1; i >= 0; i--) {
            newVertices.push(this.vertices[ i ]);
        }
        this.vertices = newVertices;

        return this;
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
            let tempX = vertices[ v ].getX() + vertex.getX();
            let tempY = vertices[ v ].getY() + vertex.getY();
            let tempZ = vertices[ v ].getZ() + vertex.getZ();
            vertices[ v ].setX(tempX);
            vertices[ v ].setY(tempY);
            vertices[ v ].setZ(tempZ);
        }
        this.updateCenter();
        this.updateBoundaries();
    };

    this.extrusionPoint = function (distance, axis) {
        let extrusionDistance;
        if (axis === 'x') {
            extrusionDistance = new Vertex(distance, 0, 0);
        } else if (axis === 'y') {
            extrusionDistance = new Vertex(0, distance, 0);
        } else if (axis === 'z') {
            extrusionDistance = new Vertex(0, 0, distance);
        }
        for (let i = 0; i < this.vertices.length; i++) {
            vertices[ i ].extrusionVertex(extrusionDistance);
        }
    };

    this.rotate = function (tetaX, tetaY, tetaZ) {
        for (let i = 0; i < this.vertices.length; i++) {
            vertices[ i ].rotationVertex(tetaX, tetaY, tetaZ);
        }
        this.updateBoundaries();
        this.updateCenter();
    };

    this.rotateFace = function () {
        if (this.vertices.length % 2 === 0) {
            for (let i = 1; i < this.vertices[ i ].length - 1; i += 2) {
                let temp = this.vertexAt(i + 1);
                this.vertices[ i + 1 ] = this.vertices[ i ];
                this.vertices[ i ] = temp;
            }
        } else {
            for (let i = 0; i < this.vertices[ i ].length - 1; i++) {
                let temp = this.vertexAt(i + 1);
                this.vertices[ i + 1 ] = this.vertices[ i ];
                this.vertices[ i ] = temp;
            }
        }
    };

    this.scale = function (tetaX, tetaY, tetaZ) {
        for (let i = 0; i < this.vertices.length; i++) {
            vertices[ i ].scaleVertex(tetaX, tetaY, tetaZ);
        }
        this.updateBoundaries();
        this.updateCenter();
    };

    this.shearXbyY = function (vertex) {
        let center = this.getCenter();
        let shearFactor = -(vertex.getX() - center.getX()) * .005;
        this.translatePoint(center); // move center to origin
        this.vertices.forEach(function (v) {
            v.setX(v.getX() + shearFactor * v.getY());
        });
        this.translatePoint(center.invert()); // move back to previous location

        return this;
    };

    this.shearXbyZ = function (vertex) {
        let center = this.getCenter();
        let shearFactor = -(vertex.getX() - center.getX()) * .005;
        this.translatePoint(center); // move center to origin
        this.vertices.forEach(function (v) {
            v.setX(v.getX() + shearFactor * v.getZ());
        });
        this.translatePoint(center.invert()); // move back to previous location

        return this;
    };

    this.shearYbyX = function (vertex) {
        let center = this.getCenter();
        let shearFactor = -(vertex.getY() - center.getY()) * .005;
        this.translatePoint(center); // move center to origin
        this.vertices.forEach(function (v) {
            v.setY(v.getY() + shearFactor * v.getX());
        });
        this.translatePoint(center.invert()); // move back to previous location

        return this;
    };

    this.shearYbyZ = function (vertex) {
        let center = this.getCenter();
        let shearFactor = -(vertex.getY() - center.getY()) * .005;
        this.translatePoint(center); // move center to origin
        this.vertices.forEach(function (v) {
            v.setY(v.getY() + shearFactor * v.getZ());
        });
        this.translatePoint(center.invert()); // move back to previous location

        return this;
    };

    this.shearZbyY = function (vertex) {
        vertex.setZ(vertex.getX());
        vertex.setX(0);
        let center = this.getCenter();
        let shearFactor = -(vertex.getZ() - center.getZ()) * .005;
        this.translatePoint(center); // move center to origin
        this.vertices.forEach(function (v) {
            v.setZ(v.getZ() + shearFactor * v.getY());
        });
        this.translatePoint(center.invert()); // move back to previous location

        return this;
    };

    this.shearZbyX = function (vertex) {
        vertex.setZ(vertex.getY());
        vertex.setY(0);
        let center = this.getCenter();
        let shearFactor = -(vertex.getZ() - center.getZ()) * .005;
        this.translatePoint(center); // move center to origin
        this.vertices.forEach(function (v) {
            v.setZ(v.getZ() + shearFactor * v.getX());
        });
        this.translatePoint(center.invert()); // move back to previous location

        return this;
    };

    this.shear = function (sAxis, rAxis, vertex) {
        if (sAxis === 'x') {
            if (rAxis === 'y') {
                return this.shearXbyY(vertex);
            } else if (rAxis === 'z') {
                return this.shearXbyZ(vertex);
            }
        } else if (sAxis === 'y') {
            if (rAxis === 'x') {
                return this.shearYbyX(vertex);
            } else if (rAxis === 'z') {
                return this.shearYbyZ(vertex);
            }
        } else if (sAxis === 'z') {
            if (rAxis === 'x') {
                return this.shearZbyX(vertex);
            } else if (rAxis === 'y') {
                return this.shearZbyY(vertex);
            }
        }
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
        let vertices = [
            [],
            [],
            [],
            []
        ];
        this.getVertices().forEach(function (v) {
            vertices[ 0 ].push(v.getX());
            vertices[ 1 ].push(v.getY());
            vertices[ 2 ].push(v.getZ());
            vertices[ 3 ].push(1);
        });

        return vertices;
    };

    this.isInsideDrawableBoundaryTolerance = function (clickVertex, h, v) {
        if (!this.isVisible(h, v)) {
            return false;
        }
        let tolerance = 20;
        let boundary = this.getDrawableBoundaries(h, v);

        let insideX = (clickVertex.getX() < (boundary.maxX + tolerance)) &&
            (clickVertex.getX() > (boundary.minX - tolerance));
        let insideY = (clickVertex.getY() < (boundary.maxY + tolerance)) &&
            (clickVertex.getY() > (boundary.minY - tolerance));

        return insideX && insideY;
    };

    this.updateCenter = function () {
        let values = this.getBoundaries();
        this.center = new Vertex((values.maxX + values.minX) / 2, (values.maxY + values.minY) / 2, (values.maxZ +
            values.minZ) / 2);

        return this;
    };

    this.getCenter = function () {
        return this.center;
    };

    this.getDistance = function (vertex) {
        return new Vertex(Math.abs(this.center.getX() - vertex.getX()), Math.abs(this.center.getY() -
            vertex.getY()), Math.abs(this.center.getZ() -
            vertex.getZ()));
    };

    this.getEuclideanDistance = function (vertex) {
        return Math.sqrt(Math.pow(this.center.getX() - vertex.getX(), 2) +
            Math.pow(this.center.getY() - vertex.getY(), 2) + Math.pow(this.center.getZ() - vertex.getZ(), 2));
    };

    this.vertices = vertices;

    this.drawableVerticesXY = null;

    this.drawableBoundariesXY = null;

    this.drawableVerticesXZ = null;

    this.drawableVerticesPerspective = null;

    this.drawableBoundariesPerspective = null;

    this.drawableBoundariesXZ = null;

    this.drawableVerticesZY = null;

    this.drawableBoundariesZY = null;

    this.visibleXY = false;

    this.visibleXZ = false;

    this.visibleZY = false;

    this.visiblePersp = false;

    this.edges = [];

    this.boundaries = null;

    this.updateBoundaries();

    this.center = null;

    this.updateCenter();
}