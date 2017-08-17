function Polygon(vertices, color = Colors.DEFAULT) {
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
        return this.vertices[index];
    };

    this.boundaries = this.setBoundaries();
    this.getArea = function () {
        let area = 0;
        for (let i = 0; i < this.vertices.length - 1; i++) {
            area += (this.vertices[i].getX() * this.vertices[i + 1].getY()) - (this.vertices[i + 1].getX() * this.vertices[i].getY());
        }
        area /= 2;
        return area;
    };

    this.getCenter = function () {
        let area = this.getArea() * 6;
        let center = {
            x: 0,
            y: 0
        };
        for (let i = 0; i < this.vertices.length - 1; i++) {
            let temp = (this.vertices[i].getX() * this.vertices[i + 1].getY()) - (this.vertices[i + 1].getX() * this.vertices[i].getY());
            center.x += (this.vertices[i].getX() + this.vertices[i + 1].getX()) * temp;
            center.y += (this.vertices[i].getY() + this.vertices[i + 1].getY()) * temp;
        }
        center.x /= area;
        center.y /= area;

        return new Vertex(center.x, center.y);
    };

    this.translate = function (vertex) {
        let dif = this.getCenter();
        this.vertices.forEach(function (vertex) {
            vertex.setX(vertex.getX() + dif.getX());
            vertex.setY(vertex.getY() + dif.getY());
        });
        this.boundaries = this.setBoundaries();
    };
}