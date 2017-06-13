function Polygon (vertices) {
    this.vertices = vertices;

    this.countEdges = function () {
        return this.vertices.length;
    };

    this.countVertices = function () {
        return this.vertices.length;
    };

    this.vertexAt = function (id) {
        return this.vertices[id];
    };
}