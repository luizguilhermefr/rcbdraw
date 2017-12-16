function Solid (polygons, strokeColor = Colors.DEFAULT, fillColor = Colors.DEFAULT, mustStroke = true, mustFill = false, selected = false) {

    this.getPolygons = function () {
        return this.polygons;
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

    this.getBoundaries = function () {
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

    this.getEuclideanDistance = function (vertex) {
        return Math.sqrt(Math.pow(this.center.getX() - vertex.getX(), 2) +
            Math.pow(this.center.getY() - vertex.getY(), 2) + Math.pow(this.center.getZ() - vertex.getZ(), 2));
    };

    this.translate = function (vertex) {
        let center = this.getCenter();
        this.polygons.forEach(function (p) {
            let vertexMove = new Vertex(vertex.getX() - center.getX(), vertex.getY() - center.getY(), vertex.getZ());
            p.translatePoint(vertexMove);
        }.bind(this));
        this.updateParameters();
    };

    this.rotate = function (center, tetaX, tetaY, tetaZ = 0) {
        this.polygons.forEach(function (p) {
            p.translatePoint(center.invert());
            p.rotate(tetaX, tetaY, tetaZ);
            p.translatePoint(center.invert());
        }.bind(this));
        this.updateParameters();
    };

    this.scale = function (center, tetaX, tetaY, tetaZ = 0) {
        this.polygons.forEach(function (p) {
            p.translatePoint(center.invert());
            p.scale(tetaX, tetaY, tetaZ);
            p.translatePoint(center.invert());
        }.bind(this));
        this.updateParameters();
    };

    this.toMatrix = function () {
        let vertices = [
            [],
            [],
            [],
            []
        ];
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

    this.countPolygons = function () {
        return this.polygons.length;
    };

    this.runRevolution = function (faces, axis, degree) {
        let teta = degree / (faces - 1);
        teta *= Math.PI / 180;
        let tetaX, tetaY, tetaZ;
        let initialTeta = teta;
        let tempPolygons = [
            this.polygons[ 0 ].clone()
        ];
        for (let i = 1; i < faces; i++) {
            if (axis === 'x') {
                tetaX = teta;
                tetaY = 0;
                tetaZ = 0;
            } else if (axis === 'y') {
                tetaX = 0;
                tetaY = teta;
                tetaZ = 0;
            } else if (axis === 'z') {
                tetaX = 0;
                tetaY = 0;
                tetaZ = teta;
            }
            tempPolygons.push(polygons[ 0 ].clone());
            tempPolygons[ i ].rotate(tetaX, tetaY, tetaZ);
            teta += initialTeta;
        }
        for (let i = 0; i < faces - 1; i++) {
            this.closePolygon(tempPolygons[ i ], tempPolygons[ i + 1 ]);
        }
        this.polygons.push(tempPolygons[ i ].invertOrientation());
    };

    this.runExtrusion = function (faces, axis, distance) {
        let tempPolygons = [
            this.polygons[ 0 ].clone()
        ];
        let initialDistance = distance / (faces - 1);
        distance = initialDistance;

        for (let i = 1; i < faces; i++) {
            tempPolygons.push(polygons[ 0 ].clone());
            tempPolygons[ i ].extrusionPoint(distance, axis);
            distance += initialDistance;
        }
        for (let i = 0; i < faces - 1; i++) {
            this.closePolygon(tempPolygons[ i ], tempPolygons[ i + 1 ]);
        }
        this.polygons.push(tempPolygons[ i ].invertOrientation());
    };

    this.closePolygon = function (initial, final) {
        for (let i = 0; i < initial.getVertices().length - 1; i++) {
            let vertexPoly = [];
            vertexPoly.push(initial.vertexAt(i));
            vertexPoly.push(final.vertexAt(i));
            vertexPoly.push(final.vertexAt(i + 1));
            vertexPoly.push(initial.vertexAt(i + 1));
            vertexPoly.push(initial.vertexAt(i));
            this.polygons.push(new Polygon(vertexPoly));
        }
    };

    this.clone = function (displacement = 0) {
        let nextPolygons = [];
        this.polygons.forEach(function (p) {
            nextPolygons.push(p.clone(displacement));
        });
        solid = new Solid(nextPolygons, this.strokeColor, this.fillColor, this.mustStroke, this.mustFill, this.selected);
        return solid.setLighting(this.ligthing.getParams(), this.n);
    };

    this.paintersAlgorithm = function (vrp) {
        this.polygons.sort(function (a, b) {
            return a.getEuclideanDistance(vrp) - b.getEuclideanDistance(vrp);
        });
    };

    this.getSelected = function () {
        return this.selected;
    };

    this.deleteSelected = function () {        
        this.selected = false;
    };

    this.startSelected = function () {
        this.selected = true;
    };

    this.canBeSheared = function () {
        return this.countPolygons() === 1;
    };

    this.shear = function (sAxis, rAxis, vertex) {
        this.polygons.forEach(function (p) {
            p.shear(sAxis, rAxis, vertex);
        });
    };

    this.setLighting = function (colorParams, n) {
        this.ligthing.setParams(colorParams, n);

        return this;
    };

    this.getLighting = function () {
        return this.ligthing;
    };

    this.updateParameters = function () {
        this.updateBoundaries();
        this.updateCenter();
    };

    this.selected = selected;

    this.polygons = polygons;

    this.strokeColor = strokeColor;

    this.fillColor = fillColor;

    this.mustStroke = mustStroke;

    this.mustFill = mustFill;

    this.ligthing = new Lighting();

    this.boundaries = null;

    this.center = null;

    this.updateParameters();
}