function Edge (from, to) {

    this.setAngular = function () {
        this.dx = (this.from.getX() - this.to.getX());
        this.dy = (this.from.getY() - this.to.getY());
        this.dz = (this.from.getZ() - this.to.getZ());
        this.mxy =  this.dx / this.dy;
        this.mxz =  this.dx / this.dz;
        this.mzy =  this.dz / this.dy;
    };

    this.getFrom = function () {
        return this.from;
    };

    this.getTo = function () {
        return this.to;
    };

    this.setFrom = function (vertex) {
        this.from = vertex;
        this.setAngular();
    };

    this.setTo = function (vertex) {
        this.to = vertex;
        this.setAngular();
    };

    this.isValidY = function (y) {
        return (y >= this.from.getY() && y < this.to.getY());
    };

    this.isValidX = function (x) {
        return (x >= this.from.getX() && x < this.to.getX());
    };

    this.isValidZ = function (z) {
        return (z >= this.from.getZ() && z < this.to.getZ());
    };

    this.setX0Y = function () {
        this.x0y = this.from.getX() + (this.dx * (Math.ceil(this.from.getY()) - this.from.getY()) / this.dy);
        this.y0 = Math.ceil(this.from.getY());
    };

    this.setX0Z = function () {
        this.x0z = this.from.getX() + (this.dx * (Math.ceil(this.from.getZ()) - this.from.getZ()) / this.dz);
        this.z0 = Math.ceil(this.from.getZ());
    };

    this.setZ0Y = function () {
        this.z0y =  this.from.getZ() + (this.dz * (Math.ceil(this.from.getY()) - this.from.getY()) / this.dy);
        this.y0 = Math.ceil(this.from.getY());
    };

    this.getX0Y = function () {
        return this.x0y;
    };

    this.getX0Z = function () {
        return this.x0z;
    };

    this.getZ0Y = function () {
        return this.z0y;
    };

    this.nextXY = function () {
        this.x0y += this.mxy;
        this.y0++;
        return this.y0 < this.to.getY();
    };

    this.nextXZ = function () {
        this.x0z += this.mxz;
        this.z0++;
        return this.z0 < this.to.getZ();
    };

    this.nextZY = function () {
        this.z0y += this.mzy;
        this.y0++;
        return this.y0 < this.to.getY();
    };

    this.from = from;
    this.to = to;
    this.dx = .0;
    this.dy = .0;
    this.dz = .0;
    this.mxy = .0;
    this.mxz = .0;
    this.mzy = .0;
    this.x0y = .0;
    this.x0z = .0;
    this.z0y = .0;
    this.y0 = .0;
    this.z0 = .0;
    this.setAngular();
    this.setX0Y();
    this.setX0Z();
    this.setZ0Y();
}