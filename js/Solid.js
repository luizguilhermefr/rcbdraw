function Solid(polygons, strokeColor = Colors.DEFAULT, fillColor = Colors.DEFAULT, mustStroke = true, mustFill = false){
    this.polygons = polygons;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    this.mustStroke = mustStroke;
    this.mustFill = mustFill;

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

    this.setBoundaries = function () {
        let maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE, maxZ = Number.MIN_VALUE, minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, minZ = Number.MAX_VALUE;
        for(let j = 0; j < this.polygons.length; j++) {
            let vertices = this.polygons[j].vertices;
            for (let i = 0; i < vertices.length; i++) {
                let v = vertices[i];
                let vx = v.getX(), vy = v.getY(), vz = v.getZ();
                if (vx > maxX) {
                    maxX = vx;
                }
                if (vx < minX) {
                    minX = vx;
                }
                if (vy > maxY) {
                    maxY = vy;
                }
                if (vy < minY) {
                    minY = vy;
                }
                if (vz > maxZ) {
                    maxZ = vz;
                }
                if (vz < minZ) {
                    minZ = vz;
                }
            }
        }

        return {
            maxX: maxX,
            minX: minX,
            maxY: maxY,
            minY: minY,
            minZ: minZ,
            maxZ: maxZ
        };
    };

    this.getBoundaries = function () {
        return this.boundaries;
    };

    this.boundaries = this.setBoundaries();

    this.translate = function (vertex) {
        for(let i = 0; i < this.polygons.length; i++) {
            polygons[i].translate(vertex);
            this.boundaries = this.setBoundaries();
        }
    };

    this.rotate = function (vertex, rotationSolid) {
        for(let i = 0; i < this.polygons.length; i++) {
            polygons[i].rotation(vertex, rotationSolid);
            this.boundaries = this.setBoundaries();
        }
    };
}