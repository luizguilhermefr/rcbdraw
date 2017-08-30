function Interface (newCanvas) {
    this.canvas = newCanvas;
    this.context = this.canvas.getContext('2d');
    this.rect = this.canvas.getBoundingClientRect();
    this.context.lineWidth = 2;
    this.context.strokeStyle = Colors.DEFAULT;
    this.scene = new Scene();
    this.freeHandDots = [];
    this.selectedPolygon = null;

    this.getRelativeX = function (x) {
        return Math.round((x - this.rect.left) / (this.rect.right - this.rect.left) * this.canvas.width);
    };

    this.getRelativeY = function (y) {
        return Math.round((y - this.rect.top) / (this.rect.bottom - this.rect.top) * this.canvas.height);
    };

    this.getNewDotX = function (x, y, teta) {
        return (x * Math.cos(teta)) - (y * Math.sin(teta));
    };

    this.getNewDotY = function (x, y, teta) {
        return (x * Math.sin(teta)) + (y * Math.cos(teta));
    };

    this.fillPoly = function (polygon) {
        let lines = [];
        for (let i = 1; i < polygon.vertices.length; i++) {
            lines.push(new Edge(polygon.vertices[ i - 1 ], polygon.vertices[ i ]));
        }

        let minY = polygon.getBoundaries().minY;
        let maxY = polygon.getBoundaries().maxY;

        this.context.strokeStyle = polygon.fillColor;
        this.context.lineWidth = 3;
        this.context.beginPath();
        for (let i = minY; i < maxY + 1; i++) {
            let meetPoint = polygon.getMeetPoint(i, lines);
            for (let j = 1; j < meetPoint.length; j += 2) {
                this.context.moveTo(meetPoint[ j - 1 ], i);
                this.context.lineTo(meetPoint[ j ], i);
            }
        }
        this.context.stroke();
    };

    this.strokePoly = function (polygon) {
        this.context.lineWidth = 2;
        this.context.strokeStyle = polygon.strokeColor;
        this.context.beginPath();
        this.context.moveTo(polygon.vertexAt(0).getX(), polygon.vertexAt(0).getY());
        for (let j = 1; j < polygon.countVertices(); j++) {
            let vertex = polygon.vertexAt(j);
            this.context.lineTo(vertex.getX(), vertex.getY());
        }
        // this.context.lineTo(polygon.vertexAt(0).getX(), polygon.vertexAt(0).getY());
        this.context.closePath();
        this.context.stroke();
    };

    this.redraw = function () {
        this.clearAll();
        let polygons = this.scene.getPolygons();
        for (let i = 0; i < polygons.length; i++) {
            if (polygons[ i ].mustFill) {
                this.fillPoly(polygons[ i ]);
            }
            if (polygons[ i ].mustStroke) {
                this.strokePoly(polygons[ i ]);
            }
        }
        this.drawTemporaryPolygon();
        this.drawSelectedPolygon();
    };

    this.drawTemporaryPolygon = function () {
        this.context.strokeStyle = Colors.TEMPORARY;
        this.context.beginPath();
        if (this.freeHandDots.length > 1) {
            this.context.moveTo(this.freeHandDots[ 0 ].x, this.freeHandDots[ 0 ].y);
            for (let n = 1; n < this.freeHandDots.length; n++) {
                this.context.lineTo(this.freeHandDots[ n ].x, this.freeHandDots[ n ].y);
            }
            this.context.stroke();
        }
    };

    this.drawSelectedPolygon = function () {
        if (this.selectedPolygon !== null) {
            this.context.strokeStyle = Colors.DEFAULT;
            this.context.lineWidth = 1;
            this.context.setLineDash([ 5, 3 ]);
            this.context.beginPath();
            let boundaries = this.selectedPolygon.polygon.getBoundaries();
            this.context.moveTo(boundaries.minX - 5, boundaries.minY - 5);
            this.context.lineTo(boundaries.minX - 5, boundaries.maxY + 5);
            this.context.lineTo(boundaries.maxX + 5, boundaries.maxY + 5);
            this.context.lineTo(boundaries.maxX + 5, boundaries.minY - 5);
            this.context.lineTo(boundaries.minX - 5, boundaries.minY - 5);
            this.context.stroke();
            this.context.setLineDash([]);
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
        x = this.getRelativeX(x);
        y = this.getRelativeY(y);
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

    this.clearAll = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
                    polygons[ i ].vertexAt(j).getY()
                ]);
            }
            dump.push(current);
        }
        this.scene.resetDirt();
        return dump;
    };

    this.distanceBetweenTwoPoints = function (first, second) {
        return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
    };

    this.distanceBetweenPointAndEdge = function (point, edge) {
        let r = edge.y2 - edge.y1;
        let s = -(edge.x2 - edge.x1);
        let t = edge.x2 * edge.y1 - edge.x1 * edge.y2;
        return Math.abs(r * point.x + s * point.y + t) / Math.sqrt(Math.pow(r, 2) + Math.pow(s, 2));
    };

    this.clearFreeHandDots = function () {
        this.freeHandDots = [];
        this.redraw();
    };

    this.pushFreeHandDot = function (x, y) {
        this.freeHandDots.push({
            x: this.getRelativeX(x),
            y: this.getRelativeY(y)
        });
        this.redraw();
        let mustContinue = !this.mustEndFreeHand();
        if (!mustContinue) {
            this.convertTemporaryToPolygon();
        }
        return mustContinue;
    };

    this.mustEndFreeHand = function () {
        if (this.freeHandDots.length < 3) {
            return false;
        }
        return this.distanceBetweenTwoPoints(this.freeHandDots[ 0 ], this.freeHandDots[ this.freeHandDots.length -
        1 ]) < 20;
    };

    this.convertTemporaryToPolygon = function () {
        let tempVertices = [];
        for (let i = 0; i < this.freeHandDots.length - 1; i++) {
            tempVertices.push(new Vertex(this.freeHandDots[ i ].x, this.freeHandDots[ i ].y));
        }
        tempVertices.push(new Vertex(this.freeHandDots[ 0 ].x, this.freeHandDots[ 0 ].y));
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
        this.scene.getPolygonAt(this.selectedPolygon.index).translate(new Vertex(this.getRelativeX(x), this.getRelativeY(y)));
        this.scene.makeDirty();
        this.redraw();
    };

    this.scaleClick = function (x, y, prevScaleFactor) {
        let poly = this.scene.getPolygonAt(this.selectedPolygon.index);
        prevScaleFactor = poly.scale(new Vertex(this.getRelativeX(x), this.getRelativeY(y)), prevScaleFactor);
        this.scene.makeDirty();
        this.redraw();
        return prevScaleFactor;
    };

    this.temporaryXY = function (x, y) {
        this.scene.setTemporaryVertex(x, y);
    };

    this.resetSceneTemporary = function(){
        this.scene.resetSceneTemporary();
    };

    this.rotationClick = function (x, y) {
        if(this.scene.getPolygonTemporary() === null)
            this.scene.setPolygonTemporary(this.scene.getPolygonAt(this.selectedPolygon.index));
        else
            this.scene.changePolygon(this.selectedPolygon.index, this.scene.getPolygonTemporary());
        this.scene.getPolygonAt(this.selectedPolygon.index).rotate(new Vertex(this.getRelativeX(x), this.getRelativeY(y)), this.scene.getTemporaryVertex());
        this.scene.makeDirty();
        this.redraw();
    };

    this.shearHorizontalClick = function (x, y) {
        this.scene.getPolygonAt(this.selectedPolygon.index).shearX(new Vertex(this.getRelativeX(x), this.getRelativeY(y)));
        this.scene.makeDirty();
        this.redraw();
    };

    this.shearVerticalClick = function (x, y) {
        this.scene.getPolygonAt(this.selectedPolygon.index).shearY(new Vertex(this.getRelativeX(x), this.getRelativeY(y)));
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
            x: this.getRelativeX(x),
            y: this.getRelativeY(y)
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
}