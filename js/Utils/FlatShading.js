FlatShading = function (polygon, color, ka, kd, ks, n, vrp) {

    this.getColor = function() {

        this.ia = this.ambientLightIntensity * this.ka;

        this.lightPosition = new Vertex(70, 20, 35);
        let centerFace = this.polygon.getCenter();

        this.l = this.lightPosition.sub(centerFace);
        this.lNorm = this.lightPosition.distanceToVertex(centerFace);

        this.l.setX(this.l.getX / lNorm);
        this.l.setY(this.l.getY / lNorm);
        this.l.setZ(this.l.getZ / lNorm);

        let faceNormL = this.l.dotProduct(this.polygon.getNormalVector());

        this.id = this.ambientIntensity * this.kd * faceNorm;

        this.s = this.vrp.sub(centerFace);
        let sNorm = this.s.distanceToVertex(centerFace);

        this.s.setX(this.s.getX / sNorm);
        this.s.setY(this.s.getY / sNorm);
        this.s.setZ(this.s.getZ / sNorm);

        let tempR = 2 * (this.l.dotProduct(faceNormL));
        faceNormL.sub(this.l);

        this.r = faceNormL.clone().multScalar(tempR);

        let rs = this.r.dotProduct(this.s);
        if( rs > 0) {
            this.is = this.ambientIntensity * this.ks * (rs ** this.n);
        }

        this.it = this.ia + this.id + this.is;



        return ;
    };

    this.ambientIntensity = 150;

    this.ambientLightIntensity = 120;

    this.polygon = polygon;

    this.ka = ka;

    this.kd = kd;

    this.ks = ks;

    this.n = n;

    this.is = 0;

    this.ia = 0;

    this.l = null;

    this.s = null;

    this.r = null;

    this.id = 0;

    this.vrp = vrp;

    this.color = color;

};