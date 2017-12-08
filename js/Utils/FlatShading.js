FlatShading = function (polygon, ka, kd, ks, n, vrp) {

    this.getColor = function(color) {
        let ila = 120;

        this.ia = color * this.ka;

        this.L.sub(this.polygon.getCenter());
        let normOfL = this.L.distanceToVertex(this.polygon.getCenter());
        this.L.divScalar(normOfL);

        let N = this.polygon.getNormalVector();
        let magnitude = N.getMagnitude();
        N.divScalar(magnitude);
        nDotProductL = this.L.dotProduct(N);
        if(nDotProductL > 0) {
            // TODO falar com o professor para saber qual variavel é a cor, se é IL ou ILA
            this.id = color * this.kd * nDotProductL;

            this.R = N.multScalar(2 * nDotProductL);

            this.R.sub(this.L);

            this.S = vrp.sub(this.polygon.getCenter());
            let normOfS = this.S.distanceToVertex(this.polygon.getCenter());
            this.S.divScalar(normOfS);
            let sDotProductR = this.S.dotProduct(this.R);
            if(sDotProductR > 0) {
                this.is = color * this.ks * Math.pow(sDotProductR, this.n);
            }
        }
        return Math.ceil(this.ia + this.id + this.is);
    };

    this.L = new Vertex(0, 0, 100);

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