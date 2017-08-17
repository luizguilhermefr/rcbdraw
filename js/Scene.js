function Scene () {
    this.polygons = [];

    this.dirty = false;

    this.addPolygon = function (polygon) {
        this.polygons.push(polygon);
        this.dirty = true;
    };

    this.removePolygon = function (id) {
        for (var i = 0; i < this.polygons.length; i++) {
            if (i === id) {
                this.polygons.splice(id, 1);
                this.dirty = true;
                return true;
            }
        }
        return false;
    };

    this.getPolygons = function () {
        return this.polygons;
    };

    this.getPolygonAt = function (id) {
        return this.polygons[id];
    };

    this.isDirty = function () {
        return this.dirty;
    };

    this.resetDirt = function () {
        this.dirty = false;
    };
}