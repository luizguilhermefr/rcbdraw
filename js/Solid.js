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

    this.setDegree = function(degree) {
        this.degree = degree;
    };

    this.setFaces = function(faces) {
        this.faces = faces;
    };

    this.setAxis = function(axis) {
        this.axis = axis;
    };

    this.getDegree = function() {
        return this.degree;
    };

    this.getFaces = function() {
        return this.faces;
    };

    this.getAxis = function() {
        return this.axis;
    };

    this.getBoundaries = function() {
        return this.boundaries;
    };

    this.setCenter = function () {
        let values = this.getBoundaries();
        this.center = new Vertex((values.maxX + values.minX) / 2, (values.maxY + values.minY) / 2, (values.maxZ +
            values.minZ) / 2);

        return this;
    };

    this.getCenter = function () {
        return this.center;
    };

    this.getDistance = function (vertex, center) {
        return new Vertex(Math.abs(center.x - vertex.getX()), Math.abs(center.y - vertex.getY()), Math.abs(center.z -
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
            } else {
                vertexMove = new Vertex(vertex.getX(), center.getY() - vertex.getY(), center.getZ() - vertex.getZ());
            }
            polygons[ i ].translatePoint(vertexMove);
            this.updateBoundaries();
            this.setCenter();
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
            } else {
                teta = Math.atan2(vertex.getZ() - center.getZ(), -(vertex.getY() - center.getY()));
            }
            polygons[ i ].translatePoint(center);
            polygons[ i ].rotate();
        }
        this.updateBoundaries();
        this.setCenter();
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

    this.runRevolution = function () {
        let teta = this.degree/this.faces;
        teta *= Math.PI/180;        
        this.polygons.push(polygons[0].clone());
        this.polygons[1].rotate(teta, this.axis);
        this.dif = new Vertex(this.polygons[1].getVertices()[0].getX() - this.polygons[0].getVertices()[0].getX(),
                            this.polygons[1].getVertices()[0].getY() - this.polygons[0].getVertices()[0].getY(),
                            this.polygons[1].getVertices()[0].getZ() - this.polygons[0].getVertices()[0].getZ());
        for(let i = 2; i < this.faces - 1; i++) {
            this.polygons.push(polygons[i - 1].clone());
            this.polygons[i].translatePoint(dif);
        }
    };

    this.clone = function (displacement = 0) {
        let nextPolygons = [];
        this.polygons.forEach(function (p) {
            nextPolygons.push(p.clone(displacement));
        });
        return new Solid(nextPolygons, this.strokeColor, this.fillColor, this.mustStroke, this.mustFill);
    };

    this.polygons = polygons;

    this.strokeColor = strokeColor;

    this.fillColor = fillColor;

    this.mustStroke = mustStroke;

    this.mustFill = mustFill;

    this.boundaries = null;

    this.updateBoundaries();

    this.setCenter();

    this.axis = null;

    this.faces = null;

    this.degree = null;
}