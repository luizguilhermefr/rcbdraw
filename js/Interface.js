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

    this.redraw = function () {
        this.clearAll();
        var polygons = this.scene.getPolygons();
        for (var i = 0; i < polygons.length; i++) {
            this.context.strokeStyle = polygons[ i ].color;
            this.context.beginPath();
            this.context.moveTo(polygons[ i ].vertexAt(0).getX(), polygons[ i ].vertexAt(0).getY());
            for (var j = 1; j < polygons[ i ].countVertices() - 1; j++) {
                var vertex = polygons[ i ].vertexAt(j);
                this.context.lineTo(vertex.getX(), vertex.getY());
            }
            this.context.lineTo(polygons[ i ].vertexAt(0).getX(), polygons[ i ].vertexAt(0).getY());
            this.context.stroke();
        }
        this.drawTemporaryPolygon();
        this.drawSelectedPolygon();
    };

    this.drawTemporaryPolygon = function () {
        this.context.strokeStyle = Colors.TEMPORARY;
        this.context.beginPath();
        if (this.freeHandDots.length > 1) {
            this.context.moveTo(this.freeHandDots[ 0 ].x, this.freeHandDots[ 0 ].y);
            for (var n = 1; n < this.freeHandDots.length; n++) {
                this.context.lineTo(this.freeHandDots[ n ].x, this.freeHandDots[ n ].y);
            }
            this.context.stroke();
        }
    };

    this.drawSelectedPolygon = function () {
        if (this.selectedPolygon !== null) {
            this.context.strokeStyle = Colors.SELECTED;
            this.context.beginPath();
            this.context.moveTo(this.selectedPolygon.polygon.vertexAt(0).getX(), this.selectedPolygon.polygon.vertexAt(0).getY());
            for (var j = 1; j < this.selectedPolygon.polygon.countVertices() - 1; j++) {
                var vertex = this.selectedPolygon.polygon.vertexAt(j);
                this.context.lineTo(vertex.getX(), vertex.getY());
            }
            this.context.lineTo(this.selectedPolygon.polygon.vertexAt(0).getX(), this.selectedPolygon.polygon.vertexAt(0).getY());
            this.context.stroke();
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

    this.newRegularPolygon = function (sides, size, x, y) {
        var dotX;
        var dotY;
        var temp;
        var tempVertices = [];
        var teta = ((2 * Math.PI) / sides);
        dotX = 0;
        dotY = size;
        if (sides % 2 === 0) {
            temp = dotX;
            dotX = this.getNewDotX(dotX, dotY, (2 * Math.PI) / 8);
            dotY = this.getNewDotY(temp, dotY, (2 * Math.PI) / 8);
        }
        x = this.getRelativeX(x);
        y = this.getRelativeY(y);
        tempVertices.push(new Vertex(dotX + x, (dotY * (-1)) + y));
        for (var i = 0; i < sides; i++) {
            temp = dotX;
            dotX = this.getNewDotX(dotX, dotY, teta);
            dotY = this.getNewDotY(temp, dotY, teta);
            tempVertices.push(new Vertex(dotX + x, (dotY * (-1)) + y));
        }
        this.scene.addPolygon(new Polygon(tempVertices));
        this.redraw();
    };

    this.shouldAskOnReset = function () {
      return this.scene.isDirty();
    };

    this.resetScene = function () {
        this.scene = new Scene();
        this.redraw();
    };

    this.clearAll = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    this.openFile = function (opened) {
        this.resetScene();
        var tempVertices = [];
        for (var i = 0; i < opened.length; i++) {
            for (var j = 0; j < opened[ i ].length; j++) {
                tempVertices.push(new Vertex(opened[ i ][ j ][ 0 ], opened[ i ][ j ][ 1 ]));
            }
            this.scene.addPolygon(new Polygon(tempVertices));
            tempVertices = [];
        }
        this.scene.resetDirt();
        this.redraw();
    };

    this.generateSave = function () {
        var polygons = this.scene.getPolygons();
        var dump = [];
        var temp;
        for (var i = 0; i < polygons.length; i++) {
            temp = [];
            for (var j = 0; j < polygons[ i ].countVertices(); j++) {
                temp.push([ polygons[ i ].vertexAt(j).getX(), polygons[ i ].vertexAt(j).getY() ]);
            }
            dump.push(temp);
        }
        this.scene.resetDirt();
        return dump;
    };

    this.distanceBetweenTwoPoints = function (first, second) {
        return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
    };

    this.distanceBetweenPointAndEdge = function (point, edge) {
        var r = edge.y2 - edge.y1;
        var s = -(edge.x2 - edge.x1);
        var t = edge.x2 * edge.y1 - edge.x1 * edge.y2;
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
        var mustContinue = !this.mustEndFreeHand();
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
        var tempVertices = [];
        for (var i = 0; i < this.freeHandDots.length; i++) {
            tempVertices.push(new Vertex(this.freeHandDots[ i ].x, this.freeHandDots[ i ].y));
        }
        this.scene.addPolygon(new Polygon(tempVertices));
        this.redraw();
    };

    this.isInsideBoundaryTolerance = function (point, boundary) {
        var tolerance = 20;
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

    this.selectionClick = function (x, y) {
        var polygons = this.scene.getPolygons();
        var lowestDistance = {
            poly: -1,
            distance: Number.POSITIVE_INFINITY
        };
        var point = {
            x: this.getRelativeX(x),
            y: this.getRelativeY(y)
        };
        for (var i = 0; i < polygons.length; i++) {
            if (this.isInsideBoundaryTolerance(point, polygons[ i ].getBoundaries())) {
                for (var j = 0; j < polygons[ i ].countVertices() - 1; j++) {
                    var from = polygons[ i ].vertexAt(j);
                    var to = polygons[ i ].vertexAt(j + 1);
                    var edge = {
                        x1: from.getX(),
                        y1: from.getY(),
                        x2: to.getX(),
                        y2: to.getY()
                    };
                    var currentDistance = this.distanceBetweenPointAndEdge(point, edge);
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
}