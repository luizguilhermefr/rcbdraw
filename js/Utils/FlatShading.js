FlatShading = function (polygon, lighting, vrp, position) {

    this.calculateColor = function () {
        this.lValue.sub(this.polygon.getCenter());
        let normOfL = this.lValue.distanceToVertex(this.polygon.getCenter());
        this.lValue.divScalar(normOfL);
        let N = this.polygon.getNormalVector();
        let magnitude = N.getMagnitude();
        N.divScalar(magnitude);
        this.nDotProductL = this.lValue.dotProduct(N);
        if(this.nDotProductL > 0) {
            this.R = N.multScalar(2 * this.nDotProductL);
            this.R.sub(this.lValue);
            this.S = vrp.sub(this.polygon.getCenter());
            let normOfS = this.S.distanceToVertex(this.polygon.getCenter());
            this.S.divScalar(normOfS);
            this.sDotProductR = this.S.dotProduct(this.R);
        }
    };

    this.getColor = function (color, ila, il) {
        console.log(this.lighting.getParams()[color]);
        this.ia = ila * this.lighting.getParams()[color].getKa();
        if(this.nDotProductL > 0) {
            this.id = il * this.lighting.getParams()[color].getKd() * this.nDotProductL;
            if (this.sDotProductR > 0) {
                this.is = il * this.lighting.getParams()[color].getKs() * Math.pow(this.sDotProductR, this.lighting.getN());
            }
        }
        let tempColor = Math.ceil(this.ia + this.id + this.is);
        console.log(tempColor);
        if(tempColor > 255){
            tempColor = 255;
        } else if( tempColor < 0){
            tempColor = 0;
        }
        return tempColor
    };

    this.sDotProductR = 0;

    this.nDotProductL = 0;

    this.polygon = polygon;

    this.is = 0;

    this.ia = 0;

    this.S = null;

    this.R = null;

    this.id = 0;

    this.vrp = vrp;

    this.lighting = lighting;

    this.lValue = position;

    this.calculateColor();
};