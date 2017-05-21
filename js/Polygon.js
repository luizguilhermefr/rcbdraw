function Polygon (vertices, open) {
    console.log('Um novo poligono nasceu.');
    this.vertices = vertices;
    this.openNotClosed = open;

    this.isOpen = function () {
        return this.openNotClosed;
    };

    this.isClosed = function () {
        return !this.openNotClosed;
    };

    this.countEdges = function () {
        return this.openNotClosed ? this.vertices.length - 1 : this.vertices.length;
    };

    this.countVertices = function () {
        return this.vertices.length;
    };

    this.vertexAt = function (id) {
        return this.vertices[id];
    };
}