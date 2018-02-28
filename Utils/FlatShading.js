FlatShading = function (polygon, lighting, vrp, position) {

    this.prepare = function () {
        this.lValue.sub(this.polygon.getCenter());
        let normOfL = this.lValue.distanceToVertex(this.polygon.getCenter());
        this.lValue.divScalar(normOfL);
        let N = this.polygon.getNormalVector();
        let magnitude = N.getMagnitude();
        N.divScalar(magnitude);
        this.nDotProductL = this.lValue.dotProduct(N);
        if (this.nDotProductL > 0) {
            this.R = N.multScalar(2 * this.nDotProductL);
            this.R.sub(this.lValue);
            this.S = vrp.sub(this.polygon.getCenter());
            let normOfS = this.S.distanceToVertex(this.polygon.getCenter());
            this.S.divScalar(normOfS);
            this.sDotProductR = this.S.dotProduct(this.R);
        }
    };

    this.getColor = function (color, ila, il) {
        let ia, id = 0, is = 0;
        ia = ila * this.lighting.getKa(color);
        if (this.nDotProductL > 0) {
            id = il * this.lighting.getKd(color) * this.nDotProductL;
            if (this.sDotProductR > 0) {
                is = il * this.lighting.getKs(color) * Math.pow(this.sDotProductR, this.lighting.getN());
            }
        } else {
            id = 0;
            is = 0;
        }
        return Math.ceil(ia + id + is);
    };

    this.sDotProductR = 0;

    this.nDotProductL = 0;

    this.polygon = polygon;

    this.S = null;

    this.R = null;

    this.vrp = vrp;

    this.lighting = lighting;

    this.lValue = position;

    this.prepare();
};