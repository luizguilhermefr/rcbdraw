function Edge (from, to) {
    this.from = from;
    this.to = to;
    // this.m = 1 / ((this.to.getY() - this.from.getY()) / (this.to.getX() - this.from.getX()));
    this.m = (this.from.getY() - this.to.getY()) / (this.from.getX() - this.to.getX());
    this.curX = 0;

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
<<<<<<< Updated upstream

    this.activate = function () {
        this.curX = this.from.getX();
    };

    this.deactive = function () {
        this.curX = this.to.getX();
    };

    this.update = function () {
        this.curX += parseFloat(parseFloat(1)/parseFloat(this.m));
    };

=======
    this.getM = function () {
      return 1 / this.m;
    };
    this.isValidY = function (y) {
        if (y >= this.from.getY() && y < this.to.getY()) {
            return true;
        }
        return y >= this.to.getY() && y < this.from.getY();
    }
>>>>>>> Stashed changes
}