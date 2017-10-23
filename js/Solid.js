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

    this.translate = function(vertex, h, v) {
        for (let i = 0; i < this.polygons.length; i++) {
            polygons[i].translate(vertex, h, v);
        }
    };

    this.rotate = function(vertex, rotationSolid) {
        for (let i = 0; i < this.polygons.length; i++) {
            polygons[i].rotation(vertex, rotationSolid);
        }
    };
}