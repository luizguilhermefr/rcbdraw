function LightSource(position, intensity) {

    this.setIntensity = function (value) {
        this.intensity = value;

        return this;
    };

    this.getIntensity = function (value) {
        return this.intensity;
    };

    this.getPosition = function () {
        return this.position;
    };

    this.intensity = intensity;

    this.position = position;
}