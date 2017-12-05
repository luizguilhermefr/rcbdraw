function Lighting(ka, kd, ks, n) {

    this.setKa = function (value) {
        this.ka = value;

        return this;
    };

    this.setKs = function (value) {
        this.ks = value;

        return this;
    };

    this.setKd = function (value) {
        this.kd = value;

        return this;
    };

    this.setN = function (value) {
        this.n = value;

        return this;
    };

    this.getKa = function () {
        return this.ka;
    };

    this.getKd = function () {
        return this.kd;
    };

    this.getKs = function () {
        return this.ks;
    };

    this.getN = function () {
        return this.n;
    };

    this.ka = ka;

    this.kd = kd;

    this.ks = ks;

    this.n = n;
}