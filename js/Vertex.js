function Vertex(x, y, z) {
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.z = Math.round(z);

    this.getX = function () {
        return this.x;
    };

    this.getY = function () {
        return this.y;
    };

    this.getZ = function () {
        return this.z;
    };

    this.setX = function (val) {
        this.x = val;
    };

    this.setY = function (val) {
        this.y = val;
    };

    this.setZ = function (val) {
        this.z = val;
    };

    this.setCoords = function (x, y) {
        this.x = x;
        this.y = y;
        this.z = z;
    };

    this.clone = function () {
        return new Vertex(this.x, this.y);
    };

    this.invert = function () {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;

        return this;
    };

    this.distanceTo = function (vertex) {
        return Math.sqrt(Math.pow(vertex.getX() - this.getX(), 2) + Math.pow(vertex.getY() - this.getY(), 2));
    };
}