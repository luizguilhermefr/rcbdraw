function Solid (polygons, strokeColor = Colors.DEFAULT, fillColor = Colors.DEFAULT, mustStroke = true, mustFill = false) {

    this.getPolygons = function () {
        return this.polygons;
    };

    this.getPolygonAt = function (index) {
        return this.polygons[ index ];
    };

    this.setPolygons = function (polygons) {
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

    this.deletePolygon = function (index) {
        this.polygons.splice(index, 1);
    };

    this.updateBoundaries = function () {
        let values = {
            minX: Number.MAX_VALUE,
            minY: Number.MAX_VALUE,
            minZ: Number.MAX_VALUE,
            maxX: Number.MIN_VALUE,
            maxY: Number.MIN_VALUE,
            maxZ: Number.MIN_VALUE
        };
        for (let i = 0; i < this.polygons.length; i++) {
            let boundaries = polygons[ i ].getBoundaries();
            values.maxX = boundaries.maxX > values.maxX ? boundaries.maxX : values.maxX;
            values.minX = boundaries.minX < values.minX ? boundaries.minX : values.minX;

            values.maxY = boundaries.maxY > values.maxY ? boundaries.maxY : values.maxY;
            values.minY = boundaries.minY < values.minY ? boundaries.minY : values.minY;

            values.maxZ = boundaries.maxZ > values.maxZ ? boundaries.maxZ : values.maxZ;
            values.minZ = boundaries.minZ < values.minZ ? boundaries.minZ : values.minZ;
        }
        this.boundaries = values;
        return this;
    };

    this.getBoundaries = function() {
        return this.boundaries;
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
        return new Vertex(Math.abs(this.center.getX() - vertex.getX()), Math.abs(this.center.getY() - vertex.getY()), Math.abs(this.center.getZ() -
            vertex.getZ()));
    };

    this.translate = function (vertex, h, v) {
        let center = this.getCenter();
        for (let i = 0; i < this.polygons.length; i++) {
            let vertexMove;
            if (h === 'x' && v === 'y') {
                vertexMove = new Vertex(center.getX() - vertex.getX(), center.getY() - vertex.getY(), vertex.getZ());
            } else if (h === 'x' && v === 'z') {
                vertexMove = new Vertex(center.getX() - vertex.getX(), vertex.getY(), center.getZ() - vertex.getZ());
            } else if (h === 'z' && v === 'y') {
                vertexMove = new Vertex(vertex.getX(), center.getY() - vertex.getY(), center.getZ() - vertex.getZ());
            }
            polygons[ i ].translatePoint(vertexMove);
            this.updateBoundaries();
            this.updateCenter();
        }
    };

    this.rotate = function (vertex, rotationSolid, h, v) {
        let center = this.getCenter();
        let teta;
        for (let i = 0; i < this.polygons.length; i++) {
            if (h === 'x' && v === 'y') {
                teta = Math.atan2(vertex.getX() - center.getX(), -(vertex.getY() - center.getY()));
            } else if (h === 'x' && v === 'z') {
                teta = Math.atan2(vertex.getX() - center.getX(), -(vertex.getZ() - center.getZ()));
            } else if (h === 'z' && v === 'y') {
                teta = Math.atan2(vertex.getZ() - center.getZ(), -(vertex.getY() - center.getY()));
            }
            polygons[ i ].translatePoint(center);
            polygons[ i ].rotate();
        }
        this.updateBoundaries();
        this.updateCenter();
    };

    this.toMatrix = function () {
        let vertices = [ [], [], [], [] ];
        this.polygons.forEach(function (p) {
            p.getVertices().forEach(function (v) {
                vertices[ 0 ].push(v.getX());
                vertices[ 1 ].push(v.getY());
                vertices[ 2 ].push(v.getZ());
                vertices[ 3 ].push(1);
            });
        });

        return vertices;
    };    

    this.runRevolution = function (faces, axis, degree) {
        let teta = degree / (faces - 1);
        teta *= Math.PI / 180;
        // noinspection UnnecessaryLocalVariableJS
        let initialTeta = teta;
        let tempPolygons = [
            this.polygons[0].clone()
        ];
        for (let i = 1; i < faces; i++) {
            tempPolygons.push(polygons[0].clone());
            tempPolygons[i].rotate(teta, axis);
            teta += initialTeta;
        }
        for (let i = 0; i < faces - 1; i++) {
            this.closePolygon(tempPolygons[i], tempPolygons[i + 1]);
        }
    };

    this.closePolygon = function(initial, final){
        for(let i = 0; i < initial.getVertices().length - 1; i++){
            let vertexPoly = [];    
            vertexPoly.push(initial.vertexAt(i));
            vertexPoly.push(final.vertexAt(i));        
            vertexPoly.push(final.vertexAt(i+1));            
            vertexPoly.push(initial.vertexAt(i+1));
            vertexPoly.push(initial.vertexAt(i));
            this.polygons.push(new Polygon(vertexPoly));            
        }
    };

    this.clone = function (displacement = 0) {
        let nextPolygons = [];
        this.polygons.forEach(function (p) {
            nextPolygons.push(p.clone(displacement));
        });
        return new Solid(nextPolygons, this.strokeColor, this.fillColor, this.mustStroke, this.mustFill);
    };

    this.paintersAlgorithm = function (depthAxis, vrp) {
        this.polygons.sort(function (a, b) {
            switch (depthAxis) {
                case 'x' : return a.getDistance(vrp).getX() < b.getDistance(vrp).getX();
                case 'y' : return a.getDistance(vrp).getY() < b.getDistance(vrp).getY();
                default : return a.getDistance(vrp).getZ() < b.getDistance(vrp).getZ();
            }
        });
    };

    this.polygons = polygons;

    this.strokeColor = strokeColor;

    this.fillColor = fillColor;

    this.mustStroke = mustStroke;

    this.mustFill = mustFill;

    this.boundaries = null;

    this.updateBoundaries();

    this.center = null;

    this.updateCenter();
}