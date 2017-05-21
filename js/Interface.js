function Interface (newCanvas) {
    this.canvas = newCanvas;
    this.context = this.canvas.getContext('2d');
    this.rect = this.canvas.getBoundingClientRect();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'red';
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
        var polygons = this.scene.getPolygons();
        for (var i = 0; i < polygons.length; i++) {
            for (var j = 0; j < polygons[i].countVertices(); j++) {
                // write vertex
                var vertex = polygons[i].vertexAt(j);
                this.context.beginPath();
                this.context.fillRect(vertex.getX(), vertex.getY(), 4, 4);
                this.context.stroke();
            }
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

    this.clearAll = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
}