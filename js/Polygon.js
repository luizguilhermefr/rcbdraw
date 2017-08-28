function Polygon (vertices, strokeColor = Colors.DEFAULT, fillColor = null, mustStroke = true, mustFill = false) {
    this.vertices = vertices;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    this.mustStroke = mustStroke;
    this.mustFill = mustFill;

    this.getStrokeColor = function () {
        return this.strokeColor;
    };

    this.getFillColor = function () {
        return this.fillColor;
    };

    this.shouldFill = function () {
        return this.mustFill;
    };

    this.shouldStroke = function () {
        return this.mustStroke;
    };

    this.setFillColor = function (color) {
        this.fillColor = color;
    };

    this.setStrokeColor = function (color) {
        this.strokeColor = color;
    };

    this.setMustStroke = function (must) {
        this.mustStroke = must;
    };

    this.setMustFill = function (must) {
        this.mustFill = must;
    };

    this.setBoundaries = function () {
        let maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE, minX = Number.MAX_VALUE, minY = Number.MAX_VALUE;
        for (let i = 0; i < this.vertices.length; i++) {
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
            if (vy < minY) {
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

    this.getArea = function () {
        let area = 0;
        for (let i = 0; i < this.vertices.length - 1; i++) {
            area += (this.vertices[ i ].getX() * this.vertices[ i + 1 ].getY()) -
                (this.vertices[ i + 1 ].getX() * this.vertices[ i ].getY());
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
            let temp = (this.vertices[ i ].getX() * this.vertices[ i + 1 ].getY()) -
                (this.vertices[ i + 1 ].getX() * this.vertices[ i ].getY());
            center.x += (this.vertices[ i ].getX() + this.vertices[ i + 1 ].getX()) * temp;
            center.y += (this.vertices[ i ].getY() + this.vertices[ i + 1 ].getY()) * temp;
        }
        center.x /= area;
        center.y /= area;

        return new Vertex(center.x, center.y);
    };

    this.closestPoint = function (vertex) {
        let closestPoint = {
            distance: Number.POSITIVE_INFINITY,
            vertex: null
        };
        this.vertices.forEach(function (v) {
            let distance = v.distanceTo(vertex);
            if (distance < closestPoint.distance) {
                closestPoint.distance = distance;
                closestPoint.vertex = v;
            }
        });
        return closestPoint.vertex;
    };

    this.translatePoint = function (vertex) {
        this.vertices.forEach(function (v) {
            v.setX(v.getX() - vertex.getX());
            v.setY(v.getY() - vertex.getY());
        });
    };

    this.translate = function (vertex) {
        let currentCenter = this.getCenter();
        this.translatePoint(new Vertex(currentCenter.getX() - vertex.getX(), currentCenter.getY() - vertex.getY()));
        this.boundaries = this.setBoundaries();
    };

    this.makeRotation = function(vertex) {
        let newPointTemporary = new Vertex(this.getCenter().getX(), this.getCenter().getY() - 50);
        let oppositeCathets = vertex.distanceTo(newPointTemporary);
        let adjacentCathets = newPointTemporary.distanceTo(this.getCenter());
        let angleRotation = oppositeCathets/adjacentCathets;

        if(vertex.getX() > this.getCenter().getX())
            angleRotation *= -1;
        console.log("centro: "+this.getCenter().getX()+", "+this.getCenter().getY());
        console.log("novo: "+newPointTemporary.getX()+", "+newPointTemporary.getY());
        console.log("angulo:  "+angleRotation*Math.PI/180);

        angleRotation *= Math.PI/180;
        for(let i = 0; i < this.vertices.length; i++){
            //let teste = ;
           // console.log("vertices:  "+vertices[i].getX()+"   "+vertices[i].getY());
            vertices[i].setX(this.getNewPointX(vertices[i].getX(),vertices[i].getY(),angleRotation));
            vertices[i].setY(this.getNewPointY(vertices[i].getX(),vertices[i].getY(),angleRotation));
            //console.log("vertices:  "+vertices[i].getX()+"   "+vertices[i].getY());
        }

        this.boundaries = this.setBoundaries();
    };

    this.getNewPointX = function (x, y, teta) {
        return (x * Math.cos(teta)) - (y * Math.sin(teta));
    };

    this.getNewPointY = function (x, y, teta) {
        return (x * Math.sin(teta)) + (y * Math.cos(teta));
    };

    this.scale = function (vertex) {
        let currentCenter = this.getCenter();
        let distX = currentCenter.getX() - vertex.getX();
        let distY = currentCenter.getY() - vertex.getY();
        this.vertices.forEach(function (v) {
            v.setX(v.getX() - distX);
            v.setY(v.getY() - distY);
        });
        this.boundaries = this.setBoundaries();
    };

    this.shearX = function (vertex) {
        let referenceVertex = this.vertices[this.vertices.length - 1].clone();
        let shearFactor = (vertex.getX() - referenceVertex.getX()) / referenceVertex.getY();
        this.translatePoint(referenceVertex);
        this.vertices.forEach(function (v) {
            v.setX(v.getX() + shearFactor * v.getY());
        });
        referenceVertex.invert();
        this.translatePoint(referenceVertex);
        this.boundaries = this.setBoundaries();
    };

    this.shearY = function (vertex) {
        let referenceVertex = this.vertices[this.vertices.length - 1].clone();
        let shearFactor = (vertex.getY() - referenceVertex.getY()) / referenceVertex.getX();
        this.translatePoint(referenceVertex);
        this.vertices.forEach(function (v) {
            v.setY(v.getY() + shearFactor * v.getX());
        });
        referenceVertex.invert();
        this.translatePoint(referenceVertex);
        this.boundaries = this.setBoundaries();
    };

    this.inside = function (x, y) {
        let isInside = false;
        for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            let xi = this.vertices[ i ].getX(), yi = this.vertices[ i ].getY();
            let xj = this.vertices[ j ].getX(), yj = this.vertices[ j ].getY();

            let intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                isInside = !isInside;
            }
        }
        return isInside;
    };

    this.getMeetPoint = function (y, lines) {
        let meet = [];
        for (let i = 0; i < lines.length; i++) {
            let l = lines[ i ];
            if (l.isValidY(y)) {
                meet.push(l.getX(y));
            }
        }

        //sort
        for (let i = 0; i < meet.length; i++) {
            for (let j = i; j < meet.length; j++) {
                if (meet[ i ] > meet[ j ]) {
                    let temp = meet[ i ];
                    meet[ i ] = meet[ j ];
                    meet[ j ] = temp;
                }
            }
        }
        return meet;
    };
}