function Vertex (x, y) {
    this.x = Math.round(x);
    this.y = Math.round(y);

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

    this.clone = function () {
        return new Vertex(this.x, this.y);
    };

    this.invert = function () {
        this.x *=  -1;
        this.y *= -1;

        return this;
    };

    this.distanceTo = function (vertex) {
        return Math.sqrt(Math.pow(vertex.getX() - this.getX(), 2) + Math.pow(vertex.getY() - this.getY(), 2));
    };
}