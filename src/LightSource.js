function LightSource(position, ambientIntensity, sourceIntensity) {

    this.setAmbientIntensity = function (value) {
        this.ambientIntensity = value;

        return this;
    };

    this.getAmbientIntensity = function () {
        return this.ambientIntensity;
    };

    this.setSourceIntensity = function (value) {
        this.sourceIntensity = value;

        return this;
    };

    this.getSourceIntensity = function () {
        return this.sourceIntensity;
    };

    this.getPosition = function () {
        return this.position;
    };

    this.setX = function (x) {
        this.position.setX(x);
        return this;
    };

    this.setY = function (y) {
        this.position.setY(y);
        return this;
    };

    this.setZ = function (z) {
        this.position.setZ(z);
        return this;
    };

    this.ambientIntensity = ambientIntensity;

    this.sourceIntensity = sourceIntensity;

    this.position = position;
}