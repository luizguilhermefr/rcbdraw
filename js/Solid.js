function Solid(polygons, strokeColor = Colors.DEFAULT, fillColor = Colors.DEFAULT, mustStroke = true, mustFill = false) {
    this.polygons = polygons;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    this.mustStroke = mustStroke;
    this.mustFill = mustFill;
    this.boundaries = null;

    this.getPolygons = function() {
        return this.polygons;
    };

    this.getPolygonAt = function(index) {
        return this.polygons[index];
    };

    this.setPolygons = function(polygons) {
        this.polygons = polygons;
    };

    this.getStrokeColor = function() {
        return this.strokeColor;
    };

    this.getFillColor = function() {
        return this.fillColor;
    };

    this.setFillColor = function(color) {
        this.fillColor = color;
    };

    this.setStrokeColor = function(color) {
        this.strokeColor = color;
    };

    this.setMustStroke = function(must) {
        this.mustStroke = must;
    };

    this.setMustFill = function(must) {
        this.mustFill = must;
    };

    this.shouldFill = function() {
        return this.mustFill;
    };

    this.shouldStroke = function() {
        return this.mustStroke;
    };

    this.setBoundaries = function() {
        let values = {
            minX: Number.MAX_VALUE,
            minY: Number.MAX_VALUE,
            minZ: Number.MAX_VALUE,
            maxX: Number.MIN_VALUE,
            maxY: Number.MIN_VALUE,
            maxZ: Number.MIN_VALUE
        };
        for (let i = 0; i < this.polygons.length; i++) {
            let boundaries = polygons[i].getBoundaries();
            values.maxX = boundaries.maxX > values.maxX ? boundaries.maxX : values.maxX;
            values.minX = boundaries.minX < values.minX ? boundaries.minX : values.minX;

            values.maxY = boundaries.maxY > values.maxY ? boundaries.maxY : values.maxY;
            values.minY = boundaries.minY < values.minY ? boundaries.minY : values.minY;

            values.maxZ = boundaries.maxZ > values.maxZ ? boundaries.maxZ : values.maxZ;
            values.minZ = boundaries.minZ < values.minZ ? boundaries.minZ : values.minZ;
        }
        this.boundaries = values;
    };

    this.getBoundaries = function() {
        return this.boundaries;
    };

    this.setBoundaries();

    this.setCenter = function() {
        let values = this.getBoundaries();
        let center = new Vertex((values.maxX - values.minX) / 2, (values.maxY - values.minY) / 2, (values.maxZ - values.minZ) / 2);
        this.center = center;
    };

    this.getCenter = function() {
        return this.center;
    };

    this.setCenter();

    this.getDistance = function(vertex, center) {
        let distance = new Vertex(Math.abs(center.x - vertex.getX()), Math.abs(center.y - vertex.getY()), Math.abs(center.z - vertex.getZ()));
        return distance;
    };

    this.translate = function(vertex, h, v) {
        let center = this.getCenter();

        for (let i = 0; i < this.polygons.length; i++) {
            let vertexMove;
            if (h === 'x' && v === 'y') { // front
                vertexMove = new Vertex(vertex.getX(), center.getY() - vertex.getY(), center.getZ() - vertex.getZ());
            } else if (h === 'x' && v === 'z') { // top
                vertexMove = new Vertex(center.getX() - vertex.getX(), vertex.getY(), center.getZ() - vertex.getZ());
            } else { // left
                vertexMove = new Vertex(center.getX() - vertex.getX(), center.getY() - vertex.getY(), vertex.getZ());
            }
            polygons[i].translatePoint(vertexMove, h, v);
            this.setCenter();
            this.setBoundaries();
        }

    };

    this.rotate = function(vertex, rotationSolid) {
        for (let i = 0; i < this.polygons.length; i++) {
            polygons[i].rotation(vertex, rotationSolid);
        }
    };
}