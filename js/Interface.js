function Interface (newCanvas) {
    this.canvas = newCanvas;
    this.context = this.canvas.getContext('2d');
    this.rect = this.canvas.getBoundingClientRect();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'black';
    this.scene = new Scene();

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
            if (polygons[ i ].isClosed()) {
                this.context.lineTo(polygons[ i ].vertexAt(0).getX(), polygons[ i ].vertexAt(0).getY());
            }
            this.context.stroke();
        }
    };

    this.newPolygon = function (sides, size, x, y) {
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
        this.scene.addPolygon(new Polygon(tempVertices, false));
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
        console.log(opened)
    };

    this.generateSave = function () {
        var polygons = this.scene.getPolygons();
        var dump = {
            polygons: []
        };
        for (var i = 0; i < polygons.length; i++) {
            temp = [];
            for (var j = 0; j < polygons[ i ].countVertices() - 1; j++) {
                temp.push([ polygons[ i ].vertexAt(j).getX(), polygons[ i ].vertexAt(j).getY() ]);
            }
            dump.polygons.push(temp);
        }
        return dump;
    };
}