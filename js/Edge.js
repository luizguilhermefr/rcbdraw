function Edge (from, to) {
    this.from = from;
    this.to = to;
    this.m = (this.to.getY() - this.from.getY()) / (this.to.getX() - this.from.getX());

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

    this.getX = function (y) {
        if (!this.isValidY(y))
            throw new RangeError();
        return 1 / this.m * (y - this.from.getY()) + this.from.getX();
    };

    this.isValidY = function (y) {
        if (y >= this.from.getY() && y < this.to.getY()) {
            return true;
        }
        return y >= this.to.getY() && y < this.from.getY();
    }
}