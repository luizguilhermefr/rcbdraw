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

    this.updateDrawableVertices = function (h, v, canvasWidth, canvasHeight, worldWidth, worldHeight, vrp = null, viewUp = null, forceVisible = false, color = null) {
        if (vrp === null) {
            vrp = new Vertex(0, 0, 100);
        }
        if (viewUp === null) {
            viewUp = new Vertex(0, 1, 0);
        }

        let pipeline = new Pipeline(this, canvasWidth, canvasHeight, worldWidth, worldHeight, vrp, viewUp);
        let visible = pipeline.normal(forceVisible);
        this.setVisibility(visible);
        if (visible) {
            let vertices = pipeline.run();
            this.setDrawableVertices(vertices);
        }
        return this;
    };

    this.setVisibility = function (visible) {
        this.visible = visible;

        return this;
    };

    this.isVisible = function () {
        return this.visible;
    };

    this.setDrawableVertices = function (vertices, h, v) {
        this.drawableVertices = vertices;
        this.updateDrawableBoundaries();

        return this;
    };

    this.getDrawableVertices = function (h, v) {
        return this.drawableVertices;
    };

    this.getDrawableVertexAt = function (index) {
        return this.drawableVertices[ index ];
    };

    this.updateDrawableBoundaries = function () {
        let maxX = Number.MIN_VALUE;
        let minX = Number.MAX_VALUE;
        let maxY = Number.MIN_VALUE;
        let minY = Number.MAX_VALUE;

        this.getDrawableVertices().forEach(function (v) {
            let vx = v.getX();
            let vy = v.getY();

            maxX = vx > maxX ? vx : maxX;
            minX = vx < minX ? vx : minX;

            maxY = vy > maxY ? vy : maxY;
            minY = vy < minY ? vy : minY;
        });

        this.setDrawableBoundaries({ maxX, minX, maxY, minY });

        return this;
    };

    this.getDrawableBoundaries = function () {
        return this.drawableBoundaries;
    };

    this.setDrawableBoundaries = function (boundary) {
        this.drawableBoundaries = boundary;

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

    this.invertOrientation = function () {
        let newVertices = [];
        for (i = this.vertices.length - 1; i >= 0; i--) {
            newVertices.push(this.vertices[ i ]);
        }
        this.vertices = newVertices;

        return this;
    };

    this.closestDrawedEdge = function (clickVertex) {
        let closestEdge = {
            distance: Number.POSITIVE_INFINITY,
            index: -1
        };
        for (let i = 0; i < this.countVertices() - 1; i++) {
            let from = this.getDrawableVertexAt(i);
            let to = this.getDrawableVertexAt(i + 1);
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
        this.vertices.forEach(function (v) {
            let tempX = v.getX() + vertex.getX();
            let tempY = v.getY() + vertex.getY();
            let tempZ = v.getZ() + vertex.getZ();
            v.setX(tempX);
            v.setY(tempY);
            v.setZ(tempZ);
        });
        this.updateParameters();
    };

    this.extrusionPoint = function (distance, axis) {
        let extrusionDistance = new Vertex(distance, 0, 0);
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
        this.updateParameters();
    };

    this.scale = function (tetaX, tetaY, tetaZ) {
        for (let i = 0; i < this.vertices.length; i++) {
            vertices[ i ].scaleVertex(tetaX, tetaY, tetaZ);
        }
        this.updateParameters();
    };

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

    this.isInsideDrawableBoundaryTolerance = function (clickVertex) {
        if (!this.isVisible(h, v)) {
            return false;
        }
        let tolerance = 20;
        let boundary = this.getDrawableBoundaries();

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

    this.getEuclideanDistance = function (vertex) {
        return Math.sqrt(Math.pow(this.center.getX() - vertex.getX(), 2) +
            Math.pow(this.center.getY() - vertex.getY(), 2) + Math.pow(this.center.getZ() - vertex.getZ(), 2));
    };

    this.getNormalVector = function () {
        let p1 = this.vertexAt(2);
        let p2 = this.vertexAt(1);
        let p3 = this.vertexAt(0);
        let a = p1.sub(p2);
        let b = p3.sub(p2);

        let i = (b.getY() * a.getZ()) - (b.getZ() * a.getY());
        let j = (b.getZ() * a.getX()) - (b.getX() * a.getZ());
        let k = (b.getX() * a.getY()) - (b.getY() * a.getX());

        return new Vertex(i, j, k);
    };

    this.updateParameters = function () {
        this.updateBoundaries();
        this.updateCenter();
    };

    this.vertices = vertices;

    this.drawableVertices = null;

    this.drawableBoundaries = null;

    this.drawableBoundaries = null;

    this.visible = false;

    this.edges = [];

    this.boundaries = null;

    this.center = null;

    this.updateParameters();
}