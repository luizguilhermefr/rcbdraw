function Interface () {
    this.scene = new Scene();
    this.selectedPolygon = null;
    this.rotationPolygon = null;
    this.scalePolygon = null;

    this.getNewDotX = function (x, y, teta) {
        return (x * Math.cos(teta)) - (y * Math.sin(teta));
    };

    this.getNewDotY = function (x, y, teta) {
        return (x * Math.sin(teta)) + (y * Math.cos(teta));
    };

    this.redraw = function () {
        vue.$refs.panelFront.clearPanel();
        vue.$refs.panelTop.clearPanel();
        vue.$refs.panelLeft.clearPanel();
        vue.$refs.panelPerspective.clearPanel();
        let polygons = this.scene.getPolygons();
        for (let i = 0; i < polygons.length; i++) {
            if (polygons[ i ].mustFill) {
                vue.$refs.panelFront.fillPoly(polygons[i]);
                vue.$refs.panelTop.fillPoly(polygons[i]);
                vue.$refs.panelLeft.fillPoly(polygons[i]);
                vue.$refs.panelPerspective.fillPoly(polygons[i]);
            }
            if (polygons[ i ].mustStroke) {
                vue.$refs.panelFront.strokePoly(polygons[i]);
                vue.$refs.panelTop.strokePoly(polygons[i]);
                vue.$refs.panelLeft.strokePoly(polygons[i]);
                vue.$refs.panelPerspective.strokePoly(polygons[i]);
            }
        }
        vue.$refs.panelFront.drawTemporaryPolygon();
        vue.$refs.panelTop.drawTemporaryPolygon();
        vue.$refs.panelLeft.drawTemporaryPolygon();
        vue.$refs.panelPerspective.drawTemporaryPolygon();
        this.drawSelectedPolygon();
    };

    this.resetRotationClick = function() {
        this.rotationPolygon = null;
    };

    this.resetScaleClick = function() {
        this.scalePolygon = null;
    };


    this.drawSelectedPolygon = function () {
        if (this.selectedPolygon !== null) {
            vue.$refs.panelFront.drawSelectedPolygon(this.selectedPolygon.polygon);
            vue.$refs.panelTop.drawSelectedPolygon(this.selectedPolygon.polygon);
            vue.$refs.panelLeft.drawSelectedPolygon(this.selectedPolygon.polygon);
            vue.$refs.panelPerspective.drawSelectedPolygon(this.selectedPolygon.polygon);
        }
    };

    this.clearSelectedPolygon = function (redraw = false) {
        this.selectedPolygon = null;
        if (redraw) {
            this.redraw();
        }
    };

    this.deletePolygon = function () {
        this.scene.removePolygon(this.selectedPolygon.index);
        this.clearSelectedPolygon();
        this.redraw();

        return false;
    };

    this.newRegularPolygon = function (sides, size, stroke, fill, mustStroke, mustFill, x, y) {
        let dotX;
        let dotY;
        let temp;
        let tempVertices = [];
        let teta = ((2 * Math.PI) / sides);
        dotX = 0;
        dotY = size;
        if (sides % 2 == 0) {
            let angle = 0;
            if (sides == 4) {
                angle = (2 * Math.PI) / 8;
            } else {
                angle = (2 * Math.PI);
            }
            temp = dotX;
            dotX = this.getNewDotX(dotX, dotY, angle);
            dotY = this.getNewDotY(temp, dotY, angle);
        }
        tempVertices.push(new Vertex(dotX + x, (dotY * (-1)) + y));
        for (let i = 0; i < sides; i++) {
            temp = dotX;
            dotX = this.getNewDotX(dotX, dotY, teta);
            dotY = this.getNewDotY(temp, dotY, teta);
            tempVertices.push(new Vertex(dotX + x, (dotY * (-1)) + y));
        }
        this.scene.addPolygon(new Polygon(tempVertices, stroke, fill, mustStroke, mustFill));
        this.scene.makeDirty();
        this.redraw();
    };

    this.shouldAskOnReset = function () {
        return this.scene.isDirty();
    };

    this.resetScene = function () {
        this.selectedPolygon = null;
        this.scene = new Scene();
        this.redraw();
    };

    this.openFile = function (opened) {
        this.resetScene();
        let tempVertices = [];
        for (let i = 0; i < opened.length; i++) {
            for (let j = 0; j < opened[ i ].vertices.length; j++) {
                tempVertices.push(new Vertex(opened[ i ].vertices[ j ][ 0 ], opened[ i ].vertices[ j ][ 1 ]));
            }
            this.scene.addPolygon(new Polygon(tempVertices, opened[ i ].stroke_color, opened[ i ].fill_color, opened[ i ].must_stroke, opened[ i ].must_fill));
            tempVertices = [];
        }
        this.redraw();
    };

    this.generateSave = function () {
        let polygons = this.scene.getPolygons();
        let dump = [];
        let current;
        for (let i = 0; i < polygons.length; i++) {
            current = {
                'fill_color': polygons[ i ].getFillColor(),
                'must_fill': polygons[ i ].shouldFill(),
                'stroke_color': polygons[ i ].getStrokeColor(),
                'must_stroke': polygons[ i ].shouldStroke(),
                'vertices': []
            };
            for (let j = 0; j < polygons[ i ].countVertices(); j++) {
                current.vertices.push([
                    polygons[ i ].vertexAt(j).getX(),
                    polygons[ i ].vertexAt(j).getY(),
                    polygons[ i ].vertexAt(j).getZ()
                ]);
            }
            dump.push(current);
        }
        this.scene.resetDirt();
        return dump;
    };

    this.distanceBetweenPointAndEdge = function (point, edge) {
        let r = edge.y2 - edge.y1;
        let s = -(edge.x2 - edge.x1);
        let t = edge.x2 * edge.y1 - edge.x1 * edge.y2;
        return Math.abs(r * point.x + s * point.y + t) / Math.sqrt(Math.pow(r, 2) + Math.pow(s, 2));
    };

    this.convertTemporaryToPolygon = function (freeHandDots) {
        let tempVertices = [];
        for (let i = 0; i < freeHandDots.length - 1; i++) {
            tempVertices.push(new Vertex(freeHandDots[ i ].x, freeHandDots[ i ].y));
        }
        tempVertices.push(new Vertex(freeHandDots[ 0 ].x, freeHandDots[ 0 ].y));
        this.scene.addPolygon(new Polygon(tempVertices));
        this.scene.makeDirty();
        this.redraw();
    };

    this.isInsideBoundaryTolerance = function (point, boundary) {
        let tolerance = 20;
        if (point.x > boundary.maxX + tolerance) {
            return false;
        }
        if (point.x < boundary.minX - tolerance) {
            return false;
        }
        if (point.y > boundary.maxY + tolerance) {
            return false;
        }
        if (point.y < boundary.minY - tolerance) {
            return false;
        }
        return true;
    };

    this.translateClick = function (x, y) {
        this.scene.getPolygonAt(this.selectedPolygon.index).translate(new Vertex(x, y));
        this.scene.makeDirty();
        this.redraw();
    };

    this.scaleClick = function (x, y) {
        if (this.scalePolygon === null) {
            this.scalePolygon = this.scene.getPolygonAt(this.selectedPolygon.index).clone();
        } else {
            this.scene.changePolygon(this.selectedPolygon.index, this.scalePolygon.clone());
        }
        this.scene.getPolygonAt(this.selectedPolygon.index).scale(new Vertex(x, y), this.scalePolygon);
        this.selectedPolygon.polygon = this.scene.getPolygonAt(this.selectedPolygon.index);
        this.scene.makeDirty();
        this.redraw();
    };

    this.rotationClick = function (x, y) {
        if (this.rotationPolygon === null) {
            this.rotationPolygon = this.scene.getPolygonAt(this.selectedPolygon.index).clone();
        } else {
            this.scene.changePolygon(this.selectedPolygon.index, this.rotationPolygon.clone());
        }
        this.scene.getPolygonAt(this.selectedPolygon.index).rotate(new Vertex(x, y), this.rotationPolygon);
        this.selectedPolygon.polygon = this.scene.getPolygonAt(this.selectedPolygon.index);
        this.scene.makeDirty();
        this.redraw();
    };

    this.shearHorizontalClick = function (x, y) {
        this.scene.getPolygonAt(this.selectedPolygon.index).shearX(new Vertex(x, y));
        this.scene.makeDirty();
        this.redraw();
    };

    this.shearVerticalClick = function (x, y) {
        this.scene.getPolygonAt(this.selectedPolygon.index).shearY(new Vertex(x, y));
        this.scene.makeDirty();
        this.redraw();
    };

    this.isSomethingSelected = function () {
        return !(this.selectedPolygon === null);
    };

    this.selectionClick = function (x, y) {
        let polygons = this.scene.getPolygons();
        let lowestDistance = {
            poly: -1,
            distance: Number.POSITIVE_INFINITY
        };
        let point = {
            x: x,
            y: y
        };
        for (let i = 0; i < polygons.length; i++) {
            if (this.isInsideBoundaryTolerance(point, polygons[ i ].getBoundaries())) {
                for (let j = 0; j < polygons[ i ].countVertices() - 1; j++) {
                    let from = polygons[ i ].vertexAt(j);
                    let to = polygons[ i ].vertexAt(j + 1);
                    let edge = {
                        x1: from.getX(),
                        y1: from.getY(),
                        x2: to.getX(),
                        y2: to.getY()
                    };
                    let currentDistance = this.distanceBetweenPointAndEdge(point, edge);
                    if (currentDistance < lowestDistance.distance) {
                        lowestDistance = {
                            poly: i,
                            distance: currentDistance
                        };
                    }
                }
            }
        }
        if (lowestDistance.distance < 10) {
            this.selectedPolygon = {
                index: lowestDistance.poly,
                polygon: polygons[ lowestDistance.poly ]
            };
        } else {
            this.clearSelectedPolygon();
        }
        this.redraw();
    };

    this.duplicateSelected = function () {
        this.scene.addPolygon(this.scene.getPolygonAt(this.selectedPolygon.index).clone(20));
        this.redraw();
    };

    this.bringForward = function () {
        let forward = this.scene.bringForward(this.selectedPolygon.index);
        if (forward) {
            this.selectedPolygon = forward;
        }
        this.redraw();
    };

    this.bringBackward = function () {
        let backward = this.scene.bringBackward(this.selectedPolygon.index);
        if (backward) {
            this.selectedPolygon = backward;
        }
        this.redraw();
    };
}