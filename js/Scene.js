function Scene () {
    this.polygons = [];
    this.polygonTemporary = null;
    this.dirty = false;
    this.vertexTemporary = null;

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

    this.getPolygonTemporary = function () {
        return this.polygonTemporary;

    }

    this.setPolygonTemporary = function (polygon) {
        this.polygonTemporary = polygon.clone();
    }

    this.getPolygons = function () {
        return this.polygons;
    };

    this.setTemporaryVertex = function (x, y) {
        this.vertexTemporary = new Vertex(x, y);
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