function Scene () {
    this.polygons = [];

    this.addPolygon = function (polygon) {
        this.polygons.push(polygon);
    };

    this.removePolygon = function (id) {
        for (var i = 0; i < this.polygons.length; i++) {
            if (this.polygons[ i ].id === id) {
                this.polygons.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    this.getPolygons = function () {
        return this.polygons;
    };
}