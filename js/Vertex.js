function Vertex (x, y) {
    this.x = x;
    this.y = y;

    this.getX = function () {
        return this.x;
    };

    this.getY = function () {
        return this.y;
    };

    this.setX = function (val) {
        this.x = val;
    };

    this.setY = function (val) {
        this.y = val;
    };

    this.setCoords = function (x, y) {
        this.x = x;
        this.y = y;
    };
}