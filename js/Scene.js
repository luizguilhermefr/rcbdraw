function Scene () {
    this.polygons = [];
    this.dirty = false;

    this.makeDirty = function () {
      this.dirty = true;
    };

    this.addPolygon = function (polygon) {
        this.polygons.push(polygon);
    };

    this.removePolygon = function (id) {
        for (let i = 0; i < this.polygons.length; i++) {
            if (i === id) {
                this.polygons.splice(id, 1);
                this.dirty = true;
                return true;
            }
        }
        return false;
    };

    this.changePolygon = function (id, newPolygon) {
        this.polygons[id] = newPolygon.clone();
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