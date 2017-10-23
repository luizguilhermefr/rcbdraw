function Edge (from, to) {
    this.from = from;
    this.to = to;
    this.dx = (this.from.getX() - this.to.getX());
    this.dy = (this.from.getY() - this.to.getY());
    this.dz = (this.from.getZ() - this.to.getZ());
    this.mxy =  this.dx / this.dy;
    this.mxz =  this.dx / this.dz;
    this.mzy =  this.dz / this.dy;

    this.x = setX(this.from, this.dx, this.dy);
    this.y = Math.ceil(this.from.getY());

    this.getFrom = function () {
        return this.from;
    };

    this.getTo = function () {
        return this.to;
    };

    this.setFrom = function (vertex) {
        this.from = vertex;
    };

    this.setTo = function (vertex) {
        this.to = vertex;
    };

    /* -- */

    function setX (from,dx,dy) {
        return from.getX() + (dx * (Math.ceil(from.getY()) - from.getY()) / dy);
    }

    this.getX = function () {
        return this.x;
    };

    this.nextXY = function () {
        this.x += this.m;
        this.y++;
        return this.y < this.to.getY();
    };

    this.nextXZ = function () {
        this.x += this.m;
        this.z++;
        return this.z < this.to.getZ();
    };

    this.nextZY = function () {
        this.z += this.m;
        this.y++;
        return this.y < this.to.getY();
    };

    /* -- */

    this.isValidY = function (y) {
        return (y >= this.from.getY() && y < this.to.getY());
    }

    this.isValidX = function (x) {
        return (x >= this.from.getX() && x < this.to.getX());
    }

    this.isValidZ = function (z) {
        return (z >= this.from.getZ() && z < this.to.getZ());
    }
}