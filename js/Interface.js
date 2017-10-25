function Interface () {
    this.scene = new Scene();
    this.selectedSolid = null;
    this.rotationSolid = null;
    this.scaleSolid = null;
    this.shouldWireframe = false;

    this.toggleWireframe = function () {
        this.shouldWireframe = !this.shouldWireframe;
        this.redraw();
    };

    this.getNewDotX = function (x, y, teta) {
        return (x * Math.cos(teta)) - (y * Math.sin(teta));
    };

    this.getNewDotY = function (x, y, teta) {
        return (x * Math.sin(teta)) + (y * Math.cos(teta));
    };

    this.redraw = function () {
        this.clearPanels();
        this.scene.getSolids().forEach(function (solid) {
            if (solid.shouldFill() && !this.shouldWireframe) {
                this.fillSolid(solid, solid.getFillColor());
            }
            if (solid.shouldStroke() || this.shouldWireframe) {
                this.strokeSolid(solid, this.shouldWireframe ? Colors.WIREFRAME : solid.getStrokeColor());
            }
        }.bind(this));
        this.drawTemporaryPolygon();
        this.drawAxis();
        this.drawSelectedSolid();
    };

    this.resetRotationClick = function () {
        this.rotationSolid = null;
    };

    this.resetScaleClick = function () {
        this.scaleSolid = null;
    };

    this.clearPanels = function () {
        vue.$refs.panelFront.clearPanel();
        vue.$refs.panelTop.clearPanel();
        vue.$refs.panelLeft.clearPanel();
        vue.$refs.panelPerspective.clearPanel();
    };

    this.strokeSolid = function (polygon, color) {
        vue.$refs.panelFront.strokeSolid(polygon, color);
        vue.$refs.panelTop.strokeSolid(polygon, color);
        vue.$refs.panelLeft.strokeSolid(polygon, color);
        vue.$refs.panelPerspective.strokeSolid(polygon, color);
    };

    this.fillSolid = function (polygon, color) {
        vue.$refs.panelFront.fillSolid(polygon, color);
        vue.$refs.panelTop.fillSolid(polygon, color);
        vue.$refs.panelLeft.fillSolid(polygon, color);
        vue.$refs.panelPerspective.fillSolid(polygon, color);
    };

    this.drawTemporaryPolygon = function () {
        vue.$refs.panelFront.drawTemporaryPolygon();
        vue.$refs.panelTop.drawTemporaryPolygon();
        vue.$refs.panelLeft.drawTemporaryPolygon();
        vue.$refs.panelPerspective.drawTemporaryPolygon();
    };

    this.drawSelectedSolid = function () {
        if (this.selectedSolid !== null) {
            vue.$refs.panelFront.drawSelectedSolid(this.selectedSolid.solid);
            vue.$refs.panelTop.drawSelectedSolid(this.selectedSolid.solid);
            vue.$refs.panelLeft.drawSelectedSolid(this.selectedSolid.solid);
            vue.$refs.panelPerspective.drawSelectedSolid(this.selectedSolid.solid);
        }
    };

    this.drawAxis = function () {
        vue.$refs.panelFront.drawAxis();
        vue.$refs.panelTop.drawAxis();
        vue.$refs.panelLeft.drawAxis();
        vue.$refs.panelPerspective.drawAxis();
    };

    this.clearSelectedSolid = function (redraw = false) {
        this.selectedSolid = null;
        if (redraw) {
            this.redraw();
        }
    };

    this.deleteSolid = function () {
        this.scene.removeSolid(this.selectedSolid.index);
        this.clearSelectedSolid();
        this.redraw();

        return false;
    };

    this.newRegularPolygon = function (sides, size, stroke, fill, mustStroke, mustFill, x, y, h, v) {
        let dotX;
        let dotY;
        let temp;
        let tempVertices = [];
        let teta = ((2 * Math.PI) / sides);
        dotX = 0;
        dotY = size;
        if (sides % 2 === 0) {
            let angle = 0;
            if (sides === 4) {
                angle = (2 * Math.PI) / 8;
            } else {
                angle = (2 * Math.PI);
            }
            temp = dotX;
            dotX = this.getNewDotX(dotX, dotY, angle);
            dotY = this.getNewDotY(temp, dotY, angle);
        }
        let tempX = 0;
        let tempY = 0;
        let tempZ = 0;
        if (h === 'x' && v === 'y') { // front
            tempX = dotX + x;
            tempY = (dotY * (-1)) + y;
        } else if (h === 'x' && v === 'z') { // top
            tempX = dotX + x;
            tempZ = (dotY * (-1)) + y;
        } else { // left
            tempZ = dotX + x;
            tempY = (dotY * (-1)) + y;
        }
        let tempVertex = new Vertex(tempX, tempY, tempZ);
        tempVertices.push(tempVertex);
        for (let i = 0; i < sides; i++) {
            temp = dotX;
            dotX = this.getNewDotX(dotX, dotY, teta);
            dotY = this.getNewDotY(temp, dotY, teta);
            if (h === 'x' && v === 'y') { // front
                tempX = dotX + x;
                tempY = (dotY * (-1)) + y;
                tempZ = 0;
            } else if (h === 'x' && v === 'z') { // top
                tempX = dotX + x;
                tempZ = (dotY * (-1)) + y;
                tempY = 0;
            } else { // left
                tempZ = dotX + x;
                tempY = (dotY * (-1)) + y;
                tempX = 0;
            }
            tempVertices.push(new Vertex(tempX, tempY, tempZ));
        }
        let polygon = new Polygon(tempVertices);
        this.scene.addSolid(new Solid([ polygon ], stroke, fill, mustStroke, mustFill));
        this.scene.makeDirty();
        this.redraw();
    };

    this.shouldAskOnReset = function () {
        return this.scene.isDirty();
    };

    this.resetScene = function () {
        this.selectedSolid = null;
        this.scene = new Scene();
        this.redraw();
    };

    this.openFile = function (opened) {
        // this.resetScene();
        // let tempVertices = [];
        // for (let i = 0; i < opened.length; i++) {
        //     for (let j = 0; j < opened[ i ].vertices.length; j++) {
        //         tempVertices.push(new Vertex(opened[ i ].vertices[ j ][ 0 ], opened[ i ].vertices[ j ][ 1 ]));
        //     }
        //     this.scene.addPolygon(new Polygon(tempVertices, opened[ i ].stroke_color, opened[ i ].fill_color, opened[ i ].must_stroke, opened[ i ].must_fill));
        //     tempVertices = [];
        // } 
        // this.redraw();
    };

    this.generateSave = function () {
        // let polygons = this.scene.getPolygons();
        // let dump = [];
        // let current;
        // for (let i = 0; i < polygons.length; i++) {
        //     current = {
        //         'fill_color': polygons[ i ].getFillColor(),
        //         'must_fill': polygons[ i ].shouldFill(),
        //         'stroke_color': polygons[ i ].getStrokeColor(),
        //         'must_stroke': polygons[ i ].shouldStroke(),
        //         'vertices': []
        //     };
        //     for (let j = 0; j < polygons[ i ].countVertices(); j++) {
        //         current.vertices.push([
        //             polygons[ i ].vertexAt(j).getX(),
        //             polygons[ i ].vertexAt(j).getY(),
        //             polygons[ i ].vertexAt(j).getZ()
        //         ]);
        //     }
        //     dump.push(current);
        // }
        // this.scene.resetDirt();
        // return dump;
    };

    this.convertTemporaryToPolygon = function (freeHandDots) {
        freeHandDots.push(freeHandDots[ 0 ].clone());
        this.scene.addSolid(new Solid([ new Polygon(freeHandDots) ]));
        this.scene.makeDirty();
        this.redraw();
    };

    this.isInsideBoundaryTolerance = function (vertex, boundary, h, v) {
        let tolerance = 20;

        let insideX = (vertex.getX() < (boundary.maxX + tolerance)) && (vertex.getX() > (boundary.minX - tolerance));
        let insideY = (vertex.getY() < (boundary.maxY + tolerance)) && (vertex.getY() > (boundary.minY - tolerance));
        let insideZ = (vertex.getZ() < (boundary.maxZ + tolerance)) && (vertex.getZ() > (boundary.minZ - tolerance));

        if (h === 'x' && v === 'y') { // front
            return insideX && insideY;
        } else if (h === 'x' && v === 'z') { // top
            return insideX && insideZ;
        } else { // left
            return insideZ && insideY;
        }
    };

    this.translateClick = function (x, y, h, v) {
        let newPoint;
        if (h == 'x' && v == 'y') {
            newPoint = new Vertex(x, y, 0);
        } else if (h == 'x' && v == 'z') {
            newPoint = new Vertex(x, 0, y);
        } else {
            newPoint = new Vertex(0, y, x);
        }

        this.selectedSolid.solid.translate(newPoint, h, v);
        this.scene.makeDirty();
        this.redraw();
    };

    this.scaleClick = function (x, y) {
        if (this.scaleSolid === null) {
            this.scaleSolid = this.selectedSolid.clone();
        } else {
            this.scene.changeSolid(this.selectedSolid.index, this.scaleSolid.clone());
        }
        this.selectedSolid.scale(new Vertex(x, y), this.scaleSolid);
        this.scene.makeDirty();
        this.redraw();
    };

    this.rotationClick = function (x, y, h, v) {
        let mouseClick;
        if (this.rotationSolid === null) {
            this.rotationSolid = this.selectedSolid.solid.clone();
        } else {
            this.scene.changeSolid(this.selectedSolid.index, this.rotationSolid.clone());
        }
        if (h === 'x' && v === 'y') {
            mouseClick = new Vertex(x, y, 0);
        } else if (h === 'x' && v === 'z') {
            mouseClick = new Vertex(x, 0, y);
        } else {
            mouseClick = new Vertex(0, y, x);
        }
        this.selectedSolid.solid.rotate(mouseClick, this.rotationSolid, h, v);
        this.scene.makeDirty();
        this.redraw();
    };

    this.shearHorizontalClick = function (x, y) {
        this.selectedSolid.shearX(new Vertex(x, y));
        this.scene.makeDirty();
        this.redraw();
    };

    this.shearVerticalClick = function (x, y) {
        this.selectedSolid.shearY(new Vertex(x, y));
        this.scene.makeDirty();
        this.redraw();
    };

    this.isSomethingSelected = function () {
        return !(this.selectedSolid === null);
    };

    this.edgePanel = function (edge, point) {
        if (point.z == -1) {
            return {
                x1: edge.x1,
                y1: edge.y1,
                x2: edge.x2,
                y2: edge.y2,
                pointX: point.x,
                pointY: point.y
            };
        } else if (point.y == -1) {
            return {
                x1: edge.x1,
                y1: edge.z1,
                x2: edge.x2,
                y2: edge.z2,
                pointX: point.x,
                pointY: point.z
            };
        } else if (point.x == -1) {
            return {
                x1: edge.z1,
                y1: edge.y1,
                x2: edge.z2,
                y2: edge.y2,
                pointX: point.z,
                pointY: point.y
            };
        } else {
            alert('problemas');
        }
    };

    this.selectionClick = function (x, y, h, v) {
        let solids = this.scene.getSolids();
        let lowestDistance = {
            solid: -1,
            poly: -1,
            distance: Number.POSITIVE_INFINITY
        };
        let point;

        if (h === 'x' && v === 'y') { // front
            point = new Vertex(x, y, 0);
        } else if (h === 'x' && v === 'z') { // top
            point = new Vertex(x, 0, y);
        } else { // left
            point = new Vertex(0, y, x);
        }

        for (let n = 0; n < solids.length; n++) {
            let polygons = solids[ n ].getPolygons();
            for (let i = 0; i < polygons.length; i++) {
                if (this.isInsideBoundaryTolerance(point, polygons[ i ].getBoundaries(), h, v)) {
                    let distance = polygons[ i ].closestEdge(point, h, v);
                    if (distance.distance < lowestDistance.distance) {
                        lowestDistance.solid = n;
                        lowestDistance.poly = polygons[ i ];
                        lowestDistance.distance = distance.distance;
                    }
                }
            }
        }

        if (lowestDistance.distance < 10) {
            this.selectedSolid = {
                index: lowestDistance.solid,
                solid: solids[ lowestDistance.solid ]
            };
        } else {
            this.clearSelectedSolid();
        }

        this.redraw();
    };

    this.distanceBetweenTwoPoints = function (first, second) {
        return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
    };

    this.distanceBetweenPointAndEdge = function (data) {
        let r = data.y2 - data.y1;
        let s = -(data.x2 - data.x1);
        let t = data.x2 * data.y1 - data.x1 * data.y2;
        return Math.abs(r * data.pointX + s * data.pointY + t) / Math.sqrt(Math.pow(r, 2) + Math.pow(s, 2));
    };

    this.duplicateSelected = function () {
        this.scene.addSolid(this.selectedSolid.solid.clone(20));
        this.redraw();
    };

    this.bringForward = function () {
        let forward = this.scene.bringForward(this.selectedSolid.index);
        if (forward) {
            this.selectedSolid = forward;
        }
        this.redraw();
    };

    this.bringBackward = function () {
        let backward = this.scene.bringBackward(this.selectedSolid.index);
        if (backward) {
            this.selectedSolid = backward;
        }
        this.redraw();
    };
}