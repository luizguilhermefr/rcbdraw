FlatShading = function (polygon, ka, kd, ks, n, vrp) {

    this.getColor = function(color) {
        this.ia = 120 * this.ka;

        this.L.sub(this.polygon.getCenter());
        let normOfL = this.L.distanceToVertex(this.polygon.getCenter());

        this.L.setX(this.L.getX() / normOfL);
        this.L.setY(this.L.getY() / normOfL);
        this.L.setZ(this.L.getZ() / normOfL);

        // TODO nesse caso precisa verificar se o this.L é maior que zero
        let N = this.polygon.getNormalVector();

        nDotProductL = this.L.dotProduct(N);
        // TODO falar com o professor para saber qual variavel é a cor, se é IL ou ILA
        this.id = color * this.kd * nDotProductL;

        this.R = N.multScalar(2 * nDotProductL);

        this.R.sub(this.L);

        this.S = vrp.sub(this.polygon.getCenter());
        let normOfS = this.S.distanceToVertex(this.polygon.getCenter());

        this.S.setX(this.S.getX() / normOfS);
        this.S.setY(this.S.getY() / normOfS);
        this.S.setZ(this.S.getZ() / normOfS);

        let sDotProductR = this.S.dotProduct(this.R);

        // TODO nesse caso precisa verificar se o this.S é maior que zero
        this.is = color * this.ks * Math.pow(sDotProductR, this.n);

        console.log(this.ia);
        console.log(this.id);
        console.log(this.is);

        return this.ia + this.id + this.is;
    };

    this.L = new Vertex(70, 20, 35);

    this.polygon = polygon;

    this.ka = ka;

    this.kd = kd;

    this.ks = ks;

    this.n = n;

    this.is = 0;

    this.ia = 0;

    this.S = null;

    this.R = null;

    this.id = 0;

    this.vrp = vrp;
};