function Solid(polygons, strokeColor = Colors.DEFAULT, fillColor = Colors.DEFAULT, mustStroke = true, mustFill = false){
    this.polygons = polygons;
    this.mustStroke = mustStroke;
    this.mustFill = mustStroke;

    this.getPolygons = function (){
        return this.polygons;
    };

    this.setPolygons = function ( polygons ) {
        this.polygons = polygons;
    };

    this.getStrokeColor = function () {
        return this.strokeColor;
    };

    this.getFillColor = function () {
        return this.fillColor;
    };

    this.setFillColor = function (color) {
        this.fillColor = color;
    };

    this.setStrokeColor = function (color) {
        this.strokeColor = color;
    };

    this.setMustStroke = function (must) {
        this.mustStroke = must;
    };

    this.setMustFill = function (must) {
        this.mustFill = must;
    };

    this.shouldFill = function () {
        return this.mustFill;
    };

    this.shouldStroke = function () {
        return this.mustStroke;
    };
}