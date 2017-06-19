function Polygon (vertices, color = Colors.DEFAULT) {
    this.vertices = vertices;
    this.color = color;
    
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