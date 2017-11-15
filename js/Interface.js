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
        this.drawSolids();
        this.drawTemporaryPolygon();
        this.drawAxis();
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

    this.drawSolids = function () {
        let solids;

        this.scene.paintersAlgorithm('z', new Vertex(0, 0, -100));
        solids = this.scene.getSolids();
        vue.$refs.panelFront.drawSolids(solids, this.shouldWireframe);

        this.scene.paintersAlgorithm('y', new Vertex(0, -100, 0));
        solids = this.scene.getSolids();
        vue.$refs.panelTop.drawSolids(solids, this.shouldWireframe);

        this.scene.paintersAlgorithm('x', new Vertex(-100, 0, 0));
        solids = this.scene.getSolids();
        vue.$refs.panelLeft.drawSolids(solids, this.shouldWireframe);

        // painters algorithm for perspective?
        this.scene.paintersAlgorithm('z', new Vertex(0, 0, 100));
        solids = this.scene.getSolids();
        vue.$refs.panelPerspective.drawSolids(solids, this.shouldWireframe);
    };

    this.drawTemporaryPolygon = function () {
        vue.$refs.panelFront.drawTemporaryPolygon();
        vue.$refs.panelTop.drawTemporaryPolygon();
        vue.$refs.panelLeft.drawTemporaryPolygon();
        vue.$refs.panelPerspective.drawTemporaryPolygon();
    };

    this.drawSelectedSolid = function () {        
        if (this.selectedSolid !== null) {    
            vue.$refs.panelFront.drawSelectedSolid(this.scene.getSolidAt(this.selectedSolid.index));
            vue.$refs.panelTop.drawSelectedSolid(this.scene.getSolidAt(this.selectedSolid.index));
            vue.$refs.panelLeft.drawSelectedSolid(this.scene.getSolidAt(this.selectedSolid.index));
            vue.$refs.panelPerspective.drawSelectedSolid(this.scene.getSolidAt(this.selectedSolid.index));
        }
    };

    this.drawAxis = function () {
        vue.$refs.panelFront.drawAxis();
        vue.$refs.panelTop.drawAxis();
        vue.$refs.panelLeft.drawAxis();
        vue.$refs.panelPerspective.drawAxis();
    };

    this.clearSelectedSolid = function (redraw = false) {
        if (this.selectedSolid !== null) {
            this.scene.getSolidAt(this.selectedSolid.index).deleteSelected();
            this.selectedSolid = null;
        }
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
        } else if (h === 'z' && v === 'y') { // left
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
            } else if (h === 'z' && v === 'y') { // left
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
        this.resetScene();
        opened.forEach(function (abstractSolid) {
            let polygons = [];
            abstractSolid.polygons.forEach(function (abstractPolygons) {
                let vertices = [];
                abstractPolygons.forEach(function (v) {
                    vertices.push(new Vertex(v[0], v[1], v[2]));
                });
                polygons.push(new Polygon(vertices));
            });
            this.scene.addSolid(new Solid(polygons, abstractSolid.strokeColor,  abstractSolid.fillColor, abstractSolid.mustStroke, abstractSolid.mustFill));
        }.bind(this));
        this.redraw();
    };

    this.generateSave = function () {
        let solids = this.scene.getSolids();
        let dump = [];
        let current;
        solids.forEach(function (solid) {
            current = {
                fillColor: solid.getFillColor(),
                mustFill: solid.shouldFill(),
                strokeColor: solid.getStrokeColor(),
                mustStroke: solid.shouldStroke(),
                polygons: []
            };
            solid.getPolygons().forEach(function (poly) {
                let polygon = [];
                poly.getVertices().forEach(function (v) {
                    polygon.push([
                        v.getX(),
                        v.getY(),
                        v.getZ()
                    ]);
                });
                current.polygons.push(polygon);
            });
            dump.push(current);
        });

        this.scene.resetDirt();
        return dump;
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
        } else if (h === 'z' && v === 'y') {
            newPoint = new Vertex(0, y, x);
        }
        this.selectedSolid.solid.translate(newPoint, h, v);
        this.scene.makeDirty();
        this.redraw();
    };

    this.scaleClick = function (tetaX, tetaY, h, v) {
        let centerClone, tetaZ;
        if (this.scaleSolid === null) {
            this.scaleSolid = this.selectedSolid.solid.clone();
        } else {
            this.scene.changeSolid(this.selectedSolid.index, this.scaleSolid.clone());
        }
        centerClone = this.scaleSolid.getCenter().clone();
        if (h === 'x' && v === 'y') {
            tetaZ = 0;
        } else if (h === 'x' && v === 'z') {
            tetaZ = tetaY;
        } else if (h === 'z' && v === 'y') {
            tetaZ = tetaX;
        }
        this.selectedSolid.solid.scale(centerClone, tetaX, tetaY, tetaZ);
        this.scene.changeSolid(this.selectedSolid.index, this.selectedSolid.solid.clone());
        this.scene.makeDirty();
        this.redraw();
    };

    this.rotationClick = function (tetaX, tetaY, h, v) {
        let centerClone, tetaZ;
        if (this.rotationSolid === null) {
            this.rotationSolid = this.selectedSolid.solid.clone();
        } else {
            this.scene.changeSolid(this.selectedSolid.index, this.rotationSolid.clone());
        }
        centerClone = this.rotationSolid.getCenter().clone();
        if (h === 'x' && v === 'y') {            
            tetaZ = 0;
        } else if (h === 'x' && v === 'z') {
            tetaZ = tetaY;
            tetaY = 0;
        } else if (h === 'z' && v === 'y') {
            tetaZ = tetaX;
            tetaX = 0;
        }
        this.selectedSolid.solid.rotate(centerClone, tetaX, tetaY, tetaZ);        
        this.scene.changeSolid(this.selectedSolid.index, this.selectedSolid.solid.clone());                   
        this.scene.makeDirty();
        this.redraw();
    };

    this.updateSelectionSolid = function (index) {
        let polygons = this.scene.solids[index].getPolygons();
        for(let i = 0; i < polygons.length; i++) {
            let vertex = polygons[i].getVertices();
            for(let j = 0; j < vertex.length; j++) {
                this.selectedSolid.solid.polygons[i].vertices[j] = vertex[j].clone();
            }
        }
    };

    this.shearClick = function (sAxis, rAxis, vertex) {
        this.selectedSolid.solid.shear(sAxis, rAxis, vertex);
        this.scene.makeDirty();
        this.redraw();
    };

    this.isSomethingSelected = function () {
        return this.selectedSolid !== null;
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
            if(this.selectedSolid) {
                if(this.selectedSolid.index != lowestDistance.index) {
                    this.clearSelectedSolid();
                    this.changeSelected(lowestDistance, solids);
                }
            } else {
                this.changeSelected(lowestDistance, solids);
            }
        } else {
            this.clearSelectedSolid();
        }

        this.redraw();
    };

    this.changeSelected = function (lowestDistance, solids) {
        this.selectedSolid = {
            index: lowestDistance.solid,
            solid: solids[ lowestDistance.solid ]
        };            
        this.scene.getSolidAt(this.selectedSolid.index).startSelected();
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

    this.shearXSolid = null;

    this.shouldWireframe = false;
}