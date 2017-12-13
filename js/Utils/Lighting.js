function Lighting() {

    this.setParams = function (params, n = null) {
        this.colorParams = params;
        this.n = n === null ? this.n : n;

        return this;
    };

    this.getParams = function () {
        return this.colorParams;
    };

    this.setN = function (value) {
        this.n = value;

        return this;
    };

    this.getN = function () {
        return this.n;
    };

    this.getKa = function (color) {
        let retVal = 0;
        this.colorParams.every(function (p) {
            if (p.name === color) {
                retVal = p.ka;
                return false;
            }
            return true;
        });

        return retVal;
    };

    this.getKd = function (color) {
        let retVal = 0;
        this.colorParams.every(function (p) {
            if (p.name === color) {
                retVal = p.kd;
                return false;
            }
            return true;
        });

        return retVal;
    };

    this.getKs = function (color) {
        let retVal = 0;
        this.colorParams.every(function (p) {
            if (p.name === color) {
                retVal = p.ks;
                return false;
            }
            return true;
        });

        return retVal;
    };

    this.colorParams = [
        {
            name: 'R',
            ka: 0,
            kd: 0,
            ks: 0
        },
        {
            name: 'G',
            ka: 0,
            kd: 0,
            ks: 0
        },
        {
            name: 'B',
            ka: 0,
            kd: 0,
            ks: 0
        }
    ];

    this.n = 0;
}