// noinspection LightningSingletonTags
Vue.component('panel', {

    template: `
        <div class="all-canvas">
            <canvas
                :id="identifier"
                class="canvas col-md-12"
                v-bind:style="{cursor: cursor}"
                v-on:click="onClick"
                v-on:contextmenu.prevent="contextMenu"
                v-on:mousedown.prevent="mouseDown"
                v-on:mouseup="mouseUp"
                v-on:mousemove="mouseMove"
            >
                Seu navegador não suporta o Canvas do HTML5. <br>
                Procure atualizá-lo.
            </canvas>
            <div id="mouse"></div>
         </div>
        `,

    props: [ 'identifier', 'readonly', 'title', 'h', 'v'],

    data: function () {
        return {
            canvas: null,
            context: null,
            rect: null,
            mode: -1,
            size: 0,
            sides: 0,
            stroke: Colors.DEFAULT,
            fill: null,
            mustStroke: true,
            mustFill: false,
            cursor: 'default',
            dragging: false,
            prevScaleFactor: {
                X: 0,
                Y: 0
            },
            freeHandDots: []
        };
    },
    methods: {
        expectPolygon (sides, size, stroke, fill, mustStroke, mustFill) {
            this.size = size;
            this.sides = sides;
            this.stroke = stroke;
            this.fill = fill;
            this.mustStroke = mustStroke;
            this.mustFill = mustFill;
            this.mode = 1;
            this.cursor = 'copy';
        },
        expectSelection () {
            this.mode = 2;
            this.cursor = 'pointer';
        },
        expectFreehand () {
            this.mode = 3;
            this.cursor = 'crosshair';
        },
        expectTranslate () {
            this.mode = 4;
            this.cursor = 'move';
        },
        expectScale () {
            this.mode = 5;
            this.cursor = 'w-resize';
        },
        expectRotation () {
            this.mode = 8;
            this.cursor = 'move';
        },
        expectShear (direction) {
            if (direction === 'x') {
                this.mode = 6;
            } else if (direction === 'y') {
                this.mode = 7;
            }
            this.cursor = 'pointer';
        },
        onClick (e) {
            let x, y;

            x = this.getRelativeX(e.clientX);
            y = this.getRelativeY(e.clientY);

            switch (this.mode) {
                case 1:
                    this.putPoly(x, y);
                    break;
                case 2:
                    this.selectionClick(x, y);
                    break;
                case 3:
                    this.freehandClick(x, y);
                    break;
                case 6:
                    drawInterface.shearHorizontalClick(x, y);
                    break;
                case 7:
                    drawInterface.shearVerticalClick(x, y);
                    break;
            }
        },
        mouseDown (e) {
            if (this.mode >= 4 && this.mode <= 5 || this.mode === 8) {
                this.dragging = true;
            }

            return false;
        },
        mouseMove (e) {            
            if (this.dragging) {                
                let temp = this.defineXYZ(e.clientX, e.clientY, e.clientZ);
                let x = temp.x, y = temp.y, z = temp.z;
                switch (this.mode) {
                    case 4:
                        drawInterface.translateClick(x, y, z);
                        break;
                    case 5:
                        drawInterface.scaleClick(x, y, z);
                        break;
                    case 8:
                        drawInterface.rotationClick(x, y, z);
                        break;
                }
            }
        },
        mouseUp (e) {
            if (this.dragging) {
                let temp = this.defineXYZ(e.clientX, e.clientY, e.clientZ);
                let x = temp.x, y = temp.y, z = temp.z;                
                switch (this.mode) {
                    case 4:
                        drawInterface.translateClick(x, y, z);
                        break;
                    case 5:
                        drawInterface.scaleClick(x, y, z);
                        drawInterface.resetScaleClick();
                        break;
                    case 8:
                        drawInterface.rotationClick(x, y, z);
                        drawInterface.resetRotationClick();
                        break;
                }
                this.dragging = false;
            }
        },
        putPoly (x, y) {
            drawInterface.newRegularPolygon(this.sides, this.size, this.stroke, this.fill, this.mustStroke, this.mustFill, x, y, this.h, this.v);
        },
        selectionClick (x, y) {
            drawInterface.selectionClick(x, y, this.h, this.v);
        },
        freehandClick (x, y) {
            drawInterface.clearSelectedPolygon(true);
            if (!this.pushFreeHandDot(x, y)) {
                this.clearFreeHandDots();
                this.reset();
            }
        },
        reset () {
            this.clearFreeHandDots();
            this.mode = this.readonly ? -1 : 2;
            this.size = 0;
            this.sides = 0;
            this.cursor = this.readonly ? 'default' : 'pointer';
            this.dragging = false;
            this.stroke = Colors.DEFAULT;
            this.fill = Colors.DEFAULT;
            this.mustStroke = true;
            this.mustFill = false;
            this.prevScaleFactor = 0;
        },
        clearPanel () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        getRelativeX (x) {
            return Math.round(x - this.canvas.offsetLeft);
        },
        getRelativeY (y) {
            return Math.round(y - this.canvas.offsetTop);
        },
        strokePoly (polygon, color) {
            this.context.strokeStyle = color;
            this.context.beginPath();
            let coordX, coordY;
            if (this.h === 'x' && this.v === 'y') { // front
                coordX = polygon.vertexAt(0).getX();
                coordY = polygon.vertexAt(0).getY();
            } else if (this.h === 'x' && this.v === 'z') { // top
                coordX = polygon.vertexAt(0).getX();
                coordY = polygon.vertexAt(0).getZ();
            } else { // left
                coordX = polygon.vertexAt(0).getZ();
                coordY = polygon.vertexAt(0).getY();
            }
            this.context.moveTo(coordX, coordY);
            for (let j = 1; j < polygon.countVertices(); j++) {
                let vertex = polygon.vertexAt(j);
                if (this.h === 'x' && this.v === 'y') { // front
                    coordX = vertex.getX();
                    coordY = vertex.getY();
                } else if (this.h === 'x' && this.v === 'z') { // top
                    coordX = vertex.getX();
                    coordY = vertex.getZ();
                } else { // left
                    coordX = vertex.getZ();
                    coordY = vertex.getY();
                }
                this.context.lineTo(coordX, coordY);
            }
            this.context.closePath();
            this.context.stroke();
        },
        fillPoly (polygon, color) {
            polygon.createEdges();
            let minY = polygon.getBoundaries().minY;
            let maxY = polygon.getBoundaries().maxY;
            let intersections = [];
            for (let y = minY; y <= maxY; y++) {
                polygon.intersections(intersections, y);
                this.context.strokeStyle = color;
                this.context.lineWidth = 1;
                this.context.beginPath();
                for (let d = 0; d < intersections.length - 1; d += 2) {
                    this.context.moveTo(intersections[ d ].getX(), y);
                    this.context.lineTo(intersections[ d + 1 ].getX(), y);
                }
                this.context.stroke();
                intersections = polygon.addValueM(intersections);
            }
        },
        drawTemporaryPolygon () {
            this.context.strokeStyle = Colors.TEMPORARY;
            this.context.beginPath();
            if (this.freeHandDots.length > 1) {
                this.context.moveTo(this.freeHandDots[ 0 ].getX(), this.freeHandDots[ 0 ].getY());
                for (let n = 1; n < this.freeHandDots.length; n++) {
                    this.context.lineTo(this.freeHandDots[ n ].getX(), this.freeHandDots[ n ].getY());
                }
                this.context.stroke();
            }
        },
        pushFreeHandDot (x, y) {
            this.freeHandDots.push(new Vertex(x, y, 0));
            drawInterface.redraw();
            let mustContinue = !this.mustEndFreeHand();
            if (!mustContinue) {
                drawInterface.convertTemporaryToPolygon(this.freeHandDots);
            }

            return mustContinue;
        },
        clearFreeHandDots () {
            this.freeHandDots = [];
            drawInterface.redraw();
        },
        mustEndFreeHand () {
            if (this.freeHandDots.length < 3) {
                return false;
            }
            return this.freeHandDots[ 0 ].distanceTo(this.freeHandDots[ this.freeHandDots.length -
            1 ]) < 20;
        },
        drawSelectedPolygon (polygon) {
            this.context.strokeStyle = Colors.DEFAULT;
            this.context.lineWidth = 1;
            this.context.setLineDash([ 5, 3 ]);
            this.context.beginPath();
            let boundaries = polygon.getBoundaries();
            this.context.moveTo(boundaries.minX - 5, boundaries.minY - 5);
            this.context.lineTo(boundaries.minX - 5, boundaries.maxY + 5);
            this.context.lineTo(boundaries.maxX + 5, boundaries.maxY + 5);
            this.context.lineTo(boundaries.maxX + 5, boundaries.minY - 5);
            this.context.lineTo(boundaries.minX - 5, boundaries.minY - 5);
            this.context.stroke();
            this.context.setLineDash([]);
        },
        drawSelectedSolid (solid) {
            let polygons = solid.getPolygons();
            for (let i = 0; i < polygons.length; i++) {
                this.strokePoly(polygons[i], Colors.SELECTED);
            }
        },
        contextMenu (e) {
            let x = this.getRelativeX(e.clientX);
            let y = this.getRelativeY(e.clientY);
            toggleReset();
            vue.$refs.elementRightClick.hide();
            vue.$refs.panelRightClick.hide();
            drawInterface.selectionClick(x, y);
            if (!drawInterface.isSomethingSelected()) {
                vue.$refs.panelRightClick.show(e.clientX, e.clientY);
            } else {
                vue.$refs.elementRightClick.show(e.clientX, e.clientY);
            }
        },
        drawAxis() {
            this.context.strokeStyle = Colors.DEFAULT;
            this.context.lineWidth = 1;
            this.context.font = '12px Arial';
            this.context.fillText(this.title, 10, 30);
            // noinspection EqualityComparisonWithCoercionJS
            if (this.h != null && this.v != null) {
                this.context.moveTo(10, 40);
                this.context.lineTo(10, 80);
                this.context.lineTo(5, 75);
                this.context.moveTo(10, 80);
                this.context.lineTo(15, 75);
                this.context.fillText(this.v, 8, 90);
                this.context.moveTo(10, 40);
                this.context.lineTo(50, 40);
                this.context.lineTo(45, 35);
                this.context.moveTo(50, 40);
                this.context.lineTo(45, 45);
                this.context.fillText(this.h, 55, 42);
                this.context.stroke();
            }
        }
    },
    mounted () {
        this.canvas = document.getElementById(this.identifier);
        this.context = this.canvas.getContext('2d');
        this.rect = this.canvas.getBoundingClientRect();
        this.context.lineWidth = 1;
        this.context.strokeStyle = Colors.DEFAULT;
        this.cursor = this.readonly ? 'default' : 'pointer';
        this.mode = this.readonly ? -1 : 2;
    }
});