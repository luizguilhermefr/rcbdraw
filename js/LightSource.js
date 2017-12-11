function LightSource(position, intensity) {

    this.setIntensity = function (value) {
        this.intensity = value;

        return this;
    };

    this.getIntensity = function () {
        return this.intensity;
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

    this.intensity = intensity;

    this.position = position;
}