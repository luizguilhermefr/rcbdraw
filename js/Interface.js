function Interface (newCanvas) {
    this.canvas = newCanvas;
    this.context = this.canvas.getContext('2d');
    this.rect = this.canvas.getBoundingClientRect();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'black';
    this.scene = new Scene();
    this.freeHandDots = [];

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
    };

    this.drawTemporaryPolygon = function () {
        this.context.beginPath();
        if (this.freeHandDots.length > 1) {
            this.context.moveTo(this.freeHandDots[ 0 ].x, this.freeHandDots[ 0 ].y);
            for (var n = 1; n < this.freeHandDots.length; n++) {
                this.context.lineTo(this.freeHandDots[ n ].x, this.freeHandDots[ n ].y);
            }
            this.context.stroke();
        }
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
        this.redraw();
    };

    this.generateSave = function () {
        var polygons = this.scene.getPolygons();
        var dump = [];
        for (var i = 0; i < polygons.length; i++) {
            temp = [];
            for (var j = 0; j < polygons[ i ].countVertices(); j++) {
                temp.push([ polygons[ i ].vertexAt(j).getX(), polygons[ i ].vertexAt(j).getY() ]);
            }
            dump.push(temp);
        }
        return dump;
    };

    this.distanceBetweenTwoPoints = function (first, second) {
        return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
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
          1 ]) < 50;
    };

    this.convertTemporaryToPolygon = function () {
        var tempVertices = [];
        for (var i = 0; i < this.freeHandDots.length; i++) {
            tempVertices.push(new Vertex(this.freeHandDots[ i ].x, this.freeHandDots[ i ].y));
        }
        this.scene.addPolygon(new Polygon(tempVertices));
        this.redraw();
    };

    this.selectionClick = function (x, y) {
        
    };
}