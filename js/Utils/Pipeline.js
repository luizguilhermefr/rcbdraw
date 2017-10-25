function Pipeline (polygon, width, height, vrp, viewUp, p = null) {

    this.nVector = function () {
        let N = this.vrp.clone().sub(p);
        let magnitude = N.getMagnitude();
        this.n = N.divScalar(magnitude);
    };

    this.vVector = function () {
        let V = this.viewUp.clone().sub((this.viewUp.clone().mult(this.n)).mult(this.n));
        let magnitude = V.getMagnitude();
        this.v = V.divScalar(magnitude);
    };

    this.uVector = function () {
        let xu = this.v.getY() * this.n.getZ() - (this.n.getY() * this.v.getZ());
        let yu = this.v.getZ() * this.n.getX() - (this.n.getZ() * this.v.getX());
        let zu = this.v.getX() * this.n.getY() - (this.n.getX() * this.v.getY());
        this.u = new Vertex(xu, yu, zu);
    };

    this.sruToSrc = function () {

    };

    this.p = p === null ? new Vertex(0, 0, 0) : p;

    this.polygon = polygon;

    this.width = width;

    this.height = height;

    this.vrp = vrp;

    this.n = null;

    this.v = null;

    this.u = null;

    this.viewUp = viewUp;
}