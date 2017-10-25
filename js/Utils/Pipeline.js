function Pipeline (solid, screenWidth, screenHeight, worldWidth, worldHeight, vrp, viewUp, p = null) {

    this.setVectorN = function () {
        let N = this.vrp.clone().sub(p);
        let magnitude = N.getMagnitude();
        this.n = N.divScalar(magnitude);
    };

    this.setVectorV = function () {
        let V = this.viewUp.clone().sub((this.viewUp.clone().mult(this.n)).mult(this.n));
        let magnitude = V.getMagnitude();
        this.v = V.divScalar(magnitude);
    };

    this.setVectorU = function () {
        let xu = this.v.getY() * this.n.getZ() - (this.n.getY() * this.v.getZ());
        let yu = this.v.getZ() * this.n.getX() - (this.n.getZ() * this.v.getX());
        let zu = this.v.getX() * this.n.getY() - (this.n.getX() * this.v.getY());
        this.u = new Vertex(xu, yu, zu);
    };

    this.setMatrixSruSrc = function () {
        this.sruSrc = [
            [this.u.getX(), this.u.getY(), this.u.getZ(), this.vrp.clone().invert().dotProduct(this.u)],
            [this.v.getX(), this.v.getY(), this.v.getZ(), this.vrp.clone().invert().dotProduct(this.v)],
            [this.n.getX(), this.n.getY(), this.n.getZ(), this.vrp.clone().invert().dotProduct(this.n)],
            [0, 0, 0, 1]
        ]
    };

    this.setPSrc = function () {
        this.pSrc = math.multiply(this.sruSrc, this.solid.toMatrix());
    };

    this.setMatrixMjp = function () {
        this.mJp = [
            [this.screenWidth / this.worldWidth, 0, 0],
            [0, this.screenHeight / this.worldHeight, this.screenHeight],
            [0, 0, 1]
        ];
    };

    this.setMatrixPsrt = function () {
        this.psRt = math.multiply(this.mJp, this.pSrc);
    };

    this.print = function () {

    };

    this.run = function () {
        this.setVectorN();
        this.setVectorV();
        this.setVectorU();
        this.setMatrixSruSrc();
        this.setPSrc();
        this.setMatrixMjp();
        this.setMatrixPsrt();
        this.print();
    };

    this.p = p === null ? new Vertex(0, 0, 0) : p;

    this.solid = solid;

    this.screenWidth = screenWidth;

    this.screenHeight = screenHeight;

    this.worldWidth = worldWidth;

    this.worldHeight = worldHeight;

    this.vrp = vrp;

    this.n = null;

    this.v = null;

    this.u = null;

    this.sruSrc = [];

    this.pSrc = [];

    this.mJp = [];

    this.pSrt = [];

    this.viewUp = viewUp;
}