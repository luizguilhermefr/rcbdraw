function Scene () {
    this.polygons = [];

    this.addPolygon = function (polygon) {
        this.polygons.push(polygon);
    };

    this.removePolygon = function (id) {
        for (var i = 0; i < this.polygons.length; i++) {
            if ( i === id) { 
                this.polygons.splice(id, 1);
                return true;
            }
        }
        return false;
    };

    this.getPolygons = function () {
        return this.polygons;
    };
}