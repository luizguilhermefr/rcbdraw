function Polygon(vertices) {
    this.vertices = vertices;
    this.edges = [];

    this.getVertices = function() {
        return this.vertices;
    };

    this.setBoundaries = function() {
        let maxX = Number.MIN_VALUE;
        let minX = Number.MAX_VALUE;
        let maxY = Number.MIN_VALUE;
        let minY = Number.MAX_VALUE;
        let maxZ = Number.MIN_VALUE;
        let minZ = Number.MAX_VALUE;

        for (let i = 0; i < this.vertices.length; i++) {
            let v = this.vertexAt(i);
            let vx = v.getX()
            let vy = v.getY();
            let vz = v.getZ();

            maxX = vx > maxX ? vx : maxX;
            minX = vx < minX ? vx : minX;

            maxY = vy > maxY ? vy : maxY;
            minY = vy < minY ? vy : minY;

            maxZ = vz > maxZ ? vz : maxZ;
            minZ = vz < minZ ? vz : minZ;
        }

        return { maxX, minX, maxY, minY, maxZ, minZ };
    };

    this.getBoundaries = function() {
        return this.boundaries;
    };

    this.countVertices = function() {
        return this.vertices.length;
    };

    this.vertexAt = function(index) {
        return this.vertices[index];
    };

    this.boundaries = this.setBoundaries();

    this.closestPoint = function(vertex) {
        let closestPoint = {
            distance: Number.POSITIVE_INFINITY,
            vertex: null
        };
        this.vertices.forEach(function(v) {
            let distance = v.distanceToVertex(vertex);
            if (distance < closestPoint.distance) {
                closestPoint.distance = distance;
                closestPoint.vertex = v;
            }
        });
        return closestPoint.vertex;
    };

    this.closestEdge = function(vertex, h, v) {
        let closestEdge = {
            distance: Number.POSITIVE_INFINITY,
            index: -1
        };
        for (let i = 0; i < this.countVertices() - 1; i++) {
            let from = this.vertexAt(i);
            let to = this.vertexAt(i + 1);
            let currentDistance;
            if (h === 'x' && v === 'y') { // front
                currentDistance = vertex.distanceToEdgeXY(new Edge(from, to));
            } else if (h === 'x' && v === 'z') { // top
                currentDistance = vertex.distanceToEdgeXZ(new Edge(from, to));
            } else { // left
                currentDistance = vertex.distanceToEdgeZY(new Edge(from, to));
            }
            if (currentDistance < closestEdge.distance) {
                closestEdge = {
                    distance: currentDistance,
                    index: i
                };
            }
        }

        return closestEdge;
    };

    this.translatePoint = function(vertex) {
        for (let v = 0; v < this.vertices.length; v++) {
            this.vertices[v].setX(this.vertices[v].getX() - vertex.getX());
            this.vertices[v].setY(this.vertices[v].getY() - vertex.getY());
            this.vertices[v].setZ(this.vertices[v].getZ() - vertex.getZ());
        }
    };

    this.setCenter = function() {};

    this.center = this.setCenter();

    this.getCenter = function() {
        return this.center;
    };

    this.translate = function(distance) {
        for (let i = 0; i < this.vertices.length; i++) {
            vertices[i].setX(vertices[i].getX() + distance.getX());
            vertices[i].setY(vertices[i].getY() + distance.getY());
            vertices[i].setZ(vertices[i].getZ() + distance.getZ());
        }
    };

    this.rotate = function(vertex, clone) {
        let referenceCenter = this.getCenter();
        let teta = Math.atan2(vertex.getX() - referenceCenter.getX(), -(vertex.getY() - referenceCenter.getY()));
        this.translatePoint(this.getCenter().invert());
        for (let i = 0; i < this.vertices.length; i++) {
            vertices[i].setX(Math.round(this.getNewPointX(clone.vertexAt(i).getX(), clone.vertexAt(i).getY(), teta)));
            vertices[i].setY(Math.round(this.getNewPointY(clone.vertexAt(i).getX(), clone.vertexAt(i).getY(), teta)));
        }
        this.translate(referenceCenter);
        this.boundaries = this.setBoundaries();
        return this;
    };

    this.getNewPointX = function(x, y, teta) {
        return (x * Math.cos(teta)) - (y * Math.sin(teta));
    };

    this.getNewPointY = function(x, y, teta) {
        return (x * Math.sin(teta)) + (y * Math.cos(teta));
    };

    this.scale = function(vertex, clone) {
        let referenceCenter = this.getCenter();
        let scaleFactor = {
            X: (vertex.getX() - referenceCenter.getX()) / 500,
            Y: (vertex.getY() - referenceCenter.getY()) / 500
        };
        this.translatePoint(referenceCenter);
        for (let i = 0; i < this.vertices.length; i++) {
            vertices[i].setX(vertices[i].getX() + Math.round((clone.vertexAt(i).getX() * scaleFactor.X)));
            vertices[i].setY(vertices[i].getY() + Math.round(clone.vertexAt(i).getY() * scaleFactor.Y));
        }
        referenceCenter.invert();
        this.translatePoint(referenceCenter);
        this.boundaries = this.setBoundaries();
        return this;
    };

    this.shearX = function(vertex) {
        let referenceVertex = this.getCenter();
        let shearFactor = (vertex.getX() - referenceVertex.getX()) / referenceVertex.getY();
        this.translatePoint(referenceVertex);
        this.vertices.forEach(function(v) {
            v.setX(v.getX() + shearFactor * v.getY());
        });
        referenceVertex.invert();
        this.translatePoint(referenceVertex);
        this.boundaries = this.setBoundaries();

        return this;
    };

    this.shearY = function(vertex) {
        let referenceVertex = this.getCenter();
        let shearFactor = (vertex.getY() - referenceVertex.getY()) / referenceVertex.getX();
        this.translatePoint(referenceVertex);
        this.vertices.forEach(function(v) {
            v.setY(v.getY() + shearFactor * v.getX());
        });
        referenceVertex.invert();
        this.translatePoint(referenceVertex);
        this.boundaries = this.setBoundaries();

        return this;
    };

    this.inside = function(x, y) {
        let isInside = false;
        for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            let xi = this.vertices[i].getX(),
                yi = this.vertices[i].getY();
            let xj = this.vertices[j].getX(),
                yj = this.vertices[j].getY();

            let intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                isInside = !isInside;
            }
        }
        return isInside;
    };

    // noinspection SyntaxError
    this.clone = function(displacement = 0) {
        let nextVertices = [];
        this.vertices.forEach(function(v) {
            nextVertices.push(new Vertex(v.getX() + displacement, v.getY() + displacement));
        });
        return new Polygon(nextVertices, this.strokeColor, this.fillColor, this.mustStroke, this.mustFill);
    };

    this.destroyClone = function() {
        return new Polygon(null);
    };

    this.createEdges = function() {
        this.edges = [];
        for (let i = 0; i < this.vertices.length - 1; i++) {
            if (this.vertices[i].getY() < this.vertices[i + 1].getY()) {
                this.edges.push(new Edge(this.vertices[i], this.vertices[i + 1]));
            } else {
                this.edges.push(new Edge(this.vertices[i + 1], this.vertices[i]));
            }
        }
    };

    this.intersections = function(active, y) {
        for (let j = this.edges.length - 1; j > -1; j--) {
            let actualEdge = this.edges[j];

            if (actualEdge.isValidY(y)) {
                this.edges.splice(j, 1);
                active.push(actualEdge);
            }
        }
        active.sort(function(a, b) {
            return a.x - b.x;
        });
    };

    this.addValueM = function(intersections) {
        intersections = intersections.filter(function(a) {
            return a.next();
        });
        return intersections;
    };
}