function Polygon(vertices, strokeColor = Colors.DEFAULT, fillColor = null, mustStroke = true, mustFill = false) {
    this.vertices = vertices;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    this.mustStroke = mustStroke;
    this.mustFill = mustFill;

    this.setBoundaries = function () {
        let v0 = this.vertexAt(0);
        let maxX = v0.getX(), maxY = v0.getY(), minX = v0.getX(), minY = v0.getY();
        for (let i = 1; i < this.vertices.length; i++) {
            let v = this.vertexAt(i);
            let vx = v.getX(), vy = v.getY();
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
            let temp = (this.vertices[i].getX() * this.vertices[i + 1].getY()) -
                (this.vertices[i + 1].getX() * this.vertices[i].getY());
            center.x += (this.vertices[i].getX() + this.vertices[i + 1].getX()) * temp;
            center.y += (this.vertices[i].getY() + this.vertices[i + 1].getY()) * temp;
        }
        center.x /= area;
        center.y /= area;

        return new Vertex(center.x, center.y);
    };

    this.translate = function (vertex) {
        let currentCenter = this.getCenter();
        let distX = currentCenter.getX() - vertex.getX();
        let distY = currentCenter.getY() - vertex.getY();
        this.vertices.forEach(function (v) {
            v.setX(v.getX() - distX);
            v.setY(v.getY() - distY);
        });
        this.boundaries = this.setBoundaries();
    };

    this.inside = function (x, y) {

        let isInside = false;
        for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            let xi = this.vertices[i].getX(), yi = this.vertices[i].getY();
            let xj = this.vertices[j].getX(), yj = this.vertices[j].getY();

            let intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) isInside = !isInside;
        }
        return isInside;
    };
}