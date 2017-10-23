function Solid(polygons, strokeColor = Colors.DEFAULT, fillColor = Colors.DEFAULT, mustStroke = true, mustFill = false) {
    this.polygons = polygons;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    this.mustStroke = mustStroke;
    this.mustFill = mustFill;

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

    this.setCenter = function() {
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

        let center = {
            x: (values.maxX - values.minX) / 2,
            y: (values.maxY - values.minY) / 2,
            z: (values.maxZ - values.minZ) / 2
        };

        return center;
    };

    this.center = this.setCenter();

    this.getCenter = function() {
        return this.center;
    };

    this.getDistance = function(vertex, center) {
        return new Vertex(center.x - vertex.getX(), center.y - vertex.getY(), center.z - vertex.getZ());
    };

    this.translate = function(vertex, h, v) {
        let center = this.getCenter();

        let distanceMove = this.getDistance(vertex, center);

        for (let i = 0; i < this.polygons.length; i++) {
            polygons[i].translate(distanceMove);
        }
    };

    this.rotate = function(vertex, rotationSolid) {
        for (let i = 0; i < this.polygons.length; i++) {
            polygons[i].rotation(vertex, rotationSolid);
        }
    };
}