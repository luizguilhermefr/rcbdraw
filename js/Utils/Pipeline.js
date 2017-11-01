function Pipeline (polygon, screenWidth, screenHeight, worldWidth, worldHeight, vrp, viewUp, perspective = false, p = null) {

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
        this.pSrc = math.multiply(this.sruSrc, this.polygon.toMatrix());
        this.pSrc.splice(2, 1);
    };

    this.setMatrixPersp = function (){
        let zvp = this.dp * -1;
        this.mPersp = [
            [1, 0 , 0 , 0],
            [0 , 1, 0 , 0],
            [0, 0, (-zvp/ this.dp, 0)],
            [0, 0, -1/this.dp, 0]
        ]                 
    };

    this.setPpersp = function () {
        this.pPersp = math.multiply(this.mPersp, this.pSrc);
        this.pPersp.splice(2, 1);
    };
    
    this.setMatrixHomogeneous = function() {
        for(let i = 0; i < this.pPersp.length; i++){
            for(let j = 0; j < pPersp[i].length - 1; j++) {
                pPersp[i][j] /= pPersp[i][pPersp[i].length - 1];
            }
        }
    };    

    this.setWorldCoordinates = function () {
        this.wMaxX = this.worldWidth/2;
        this.wMinX = -this.worldWidth/2;
        this.wMaxY = this.worldHeight/2;
        this.wMinY = -this.worldHeight/2;
    };

    this.setMatrixMjp = function () {
        this.mJp = [
            [(this.screenWidth) / (this.wMaxX - this.wMinX), 0, (this.wMinX * -1) * (this.screenWidth / (this.wMaxX - this.wMinX))],
            [0, (this.screenHeight * -1) / (this.wMaxY - this.wMinY), (this.wMinY * (this.screenHeight / (this.wMaxY - this.wMinY))) + this.screenHeight],
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
            if (this.vrp.getZ() != 0 ){
                vertices.push(new Vertex(c[0], this.worldHeight - c[1], 0));
            } else {
                vertices.push(new Vertex(this.worldWidth - c[0], this.worldHeight - c[1], 0));    
            } 
        }.bind(this));
        return vertices;
    };

    this.run = function () {
        this.setVectorN();
        this.setVectorV();
        this.setVectorU();
        this.setMatrixSruSrc();
        this.setPSrc();
        if(this.perspective){
            this.setMatrixPersp();
            this.setMatrixHomogeneous();
        }
        this.setWorldCoordinates();
        this.setMatrixMjp();
        this.setMatrixPsrt();
        return this.to2DVertices()
    };

    this.p = p === null ? new Vertex(0, 0, 0) : p;

    this.dp = 100;

    this.polygon = polygon;

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

    this.pPersp = [];

    this.mJp = [];

    this.pSrt = [];

    this.viewUp = viewUp;

    this.perspective = perspective;
}