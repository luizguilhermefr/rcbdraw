function Interface () {

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
            solid.getPolygons().forEach(function (polygon) {
                if (solid.shouldFill() && !this.shouldWireframe) {
                    this.fillPoly(polygon, solid.getFillColor());
                }
                if (solid.shouldStroke() || this.shouldWireframe) {
                    this.strokePoly(polygon, this.shouldWireframe ? Colors.WIREFRAME : solid.getStrokeColor());
                }
            }.bind(this));
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

    this.strokePoly = function (polygon, color) {
        vue.$refs.panelFront.strokePoly(polygon, color);
        vue.$refs.panelTop.strokePoly(polygon, color);
        vue.$refs.panelLeft.strokePoly(polygon, color);
        vue.$refs.panelPerspective.strokePoly(polygon, color);
    };

    this.fillPoly = function (polygon, color) {
        vue.$refs.panelFront.fillPoly(polygon, color);
        vue.$refs.panelTop.fillPoly(polygon, color);
        vue.$refs.panelLeft.fillPoly(polygon, color);
        vue.$refs.panelPerspective.fillPoly(polygon, color);
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

    this.selectionClick = function (x, y, h, v) {
        let solids = this.scene.getSolids();

        let lowestDistance = {
            solid: -1,
            poly: -1,
            distance: Number.POSITIVE_INFINITY
        };

        let point = new Vertex(x, y, 0);

        for (let n = 0; n < solids.length; n++) {
            let polygons = solids[ n ].getPolygons();
            for (let i = 0; i < polygons.length; i++) {
                if (polygons[ i ].isInsideDrawableBoundaryTolerance(point, h, v)) {
                    let distance = polygons[ i ].closestDrawedEdge(point, h, v);
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

    this.scene = new Scene();

    this.selectedSolid = null;

    this.rotationSolid = null;

    this.scaleSolid = null;

    this.shouldWireframe = false;
}