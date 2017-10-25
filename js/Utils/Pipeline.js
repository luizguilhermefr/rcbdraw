function Pipeline (solid, screenWidth, screenHeight, worldWidth, worldHeight, vrp, viewUp, p = null) {

    this.setVectorN = function () {
        let N = this.vrp.clone().sub(this.p);
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
        this.pSrc.splice(2, 1);
    };

    this.setWorldCoordinates = function () {
        this.wMaxX = this.worldWidth;//this.worldWidth / 2;
        this.wMinX = 0;//this.worldWidth / -2;
        this.wMaxY = this.worldHeight;//this.worldHeight / 2;
        this.wMinY = 0;//this.worldHeight / -2;
    };

    this.setMatrixMjp = function () {
        this.mJp = [
            [(this.screenWidth) / (this.wMaxX - this.wMinX), 0, (this.wMinX * -1) * (this.screenWidth / (this.wMaxX - this.wMinX))],
            [0, (this.screenHeight * -1) / (this.wMaxY - this.wMinY), (this.wMinX * (this.screenHeight / (this.wMaxY - this.wMinY))) + this.screenHeight],
            [0, 0, 1]
        ];
    };

    this.setMatrixPsrt = function () {
        this.pSrt = math.multiply(this.mJp, this.pSrc);
    };

    this.getCol = function (matrix, col){
        let column = [];
        for (let i = 0; i < matrix.length; i++) {
            column.push(matrix[i][col]);
        }

        return column;
    };

    this.to2DVertices = function () {
        let columns = [];
        let len = this.pSrt[0].length;
        for (i = 0; i < len; i++) {
            columns.push(this.getCol(this.pSrt, i));
        }
        let vertices = [];
        columns.forEach(function (c) {
            vertices.push(new Vertex(c[0], this.worldHeight - c[1], 1));
        }.bind(this));
        return vertices;
    };

    this.run = function () {
        this.setVectorN();
        this.setVectorV();
        this.setVectorU();
        this.setMatrixSruSrc();
        this.setPSrc();
        this.setWorldCoordinates();
        this.setMatrixMjp();
        this.setMatrixPsrt();
        return this.to2DVertices()
    };

    this.p = p === null ? new Vertex(0, 0, 0) : p;

    this.solid = solid;

    this.screenWidth = screenWidth;

    this.screenHeight = screenHeight;

    this.worldWidth = worldWidth;

    this.worldHeight = worldHeight;

    this.wMaxX = 0;

    this.wMaxY = 0;

    this.wMinX = 0;

    this.wMinY = 0;

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