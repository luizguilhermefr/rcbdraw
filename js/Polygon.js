function Polygon (vertices, color = Colors.DEFAULT) {
    this.vertices = vertices;
    this.color = color;

    this.setBoundaries = function () {
        v0 = this.vertexAt(0);
        var maxX = v0.getX(), maxY = v0.getY(), minX = v0.getX(), minY = v0.getY();
        for (var i = 1; i < this.vertices.length; i++) {
            var v = this.vertexAt(i);
            var vx = v.getX(), vy = v.getY();
            if (vx > maxX) {
                maxX = vx;
            }
            if (vx < minX) {
                minX = vx;
            }
            if (vy > maxY) {
                maxY = vy;
            }
            if (vy < maxY) {
                minY = vy;
            }
        }
        return {
            maxX: maxX,
            minX: minX,
            maxY: maxY,
            minY: minY
        };
    };

    this.getBoundaries = function () {
        return this.boundaries;
    };

    this.countVertices = function () {
        return this.vertices.length;
    };

    this.vertexAt = function (index) {
        return this.vertices[ index ];
    };

    this.boundaries = this.setBoundaries();
}