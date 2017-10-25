// noinspection LightningSingletonTags
Vue.component('panel', {

    template: `
        <div class="all-canvas" v-show="visible">
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
            <b-button size="20" :variant="expanded ? 'primary' : 'outline-primary'" class="expand-btn" v-bind:style="expandStyles" @click="toggleExpand">
                <i class="fa" v-bind:class="expanded ? 'fa-compress' : 'fa-expand'"></i>
            </b-button>
         </div>
        `,

    props: [ 'identifier', 'readonly', 'title', 'h', 'v' ],

    data: function () {
        return {
            initialWidth: 0,
            initialHeight: 0,
            visible: true,
            expanded: false,
            canvas: null,
            context: null,
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
            freeHandDots: [],
            expandStyles: {
                top: '0',
                left: '0'
            }
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
            let x = this.getRelativeX(e.clientX);
            let y = this.getRelativeY(e.clientY);
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
                    drawInterface.shearHorizontalClick(x, y, this.h, this.v);
                    break;
                case 7:
                    drawInterface.shearVerticalClick(x, y, this.h, this.v);
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
            let x = this.getRelativeX(e.clientX);
            let y = this.getRelativeY(e.clientY);
            if (this.dragging) {
                switch (this.mode) {
                    case 4:
                        drawInterface.translateClick(x, y, this.h, this.v);
                        break;
                    case 5:
                        drawInterface.scaleClick(x, y, this.h, this.v);
                        break;
                    case 8:
                        drawInterface.rotationClick(x, y, this.h, this.v);
                        break;
                }
            }
        },
        mouseUp (e) {
            let x = this.getRelativeX(e.clientX);
            let y = this.getRelativeY(e.clientY);
            if (this.dragging) {
                switch (this.mode) {
                    case 4:
                        drawInterface.translateClick(x, y, this.h, this.v);
                        break;
                    case 5:
                        drawInterface.scaleClick(x, y, this.h, this.v);
                        drawInterface.resetScaleClick();
                        break;
                    case 8:
                        drawInterface.rotationClick(x, y, this.h, this.v);
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
            drawInterface.clearSelectedSolid(true);
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
            return Math.round(x - this.canvas.offsetLeft - 15);
        },
        getRelativeY (y) {
            return Math.round(y - this.canvas.offsetTop);
        },
        strokePoly (polygon, color, autoClose = true) {
            this.context.lineWidth = 1;
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
            if (autoClose) {
                this.context.closePath();
            }
            this.context.stroke();
        },
        fillPoly (polygon, color) {
            this.context.lineWidth = 1;
            this.context.strokeStyle = color;
            this.context.beginPath();
            let filler = new PolyFill(polygon, this.h, this.v);
            filler.run(this.context);
        },
        drawTemporaryPolygon () {
            if (this.freeHandDots.length > 1) {
                this.strokePoly(new Polygon(this.freeHandDots), Colors.TEMPORARY, false);
            }
        },
        pushFreeHandDot (x, y) {
            let toPush;
            if (this.h === 'x' && this.v === 'y') { // front
                toPush = new Vertex(x, y, 0);
            } else if (this.h === 'x' && this.v === 'z') { // top
                toPush = new Vertex(x, 0, y);
            } else { // left
                toPush = new Vertex(0, y, x);
            }
            this.freeHandDots.push(toPush);
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

            if (this.h === 'x' && this.v === 'y') { // front
                return this.freeHandDots[ 0 ].distanceToVertexXY(this.freeHandDots[ this.freeHandDots.length -
                1 ]) < 20;
            } else if (this.h === 'x' && this.v === 'z') { // top
                return this.freeHandDots[ 0 ].distanceToVertexXZ(this.freeHandDots[ this.freeHandDots.length -
                1 ]) < 20;
            } else { // left
                return this.freeHandDots[ 0 ].distanceToVertexZY(this.freeHandDots[ this.freeHandDots.length -
                1 ]) < 20;
            }
        },
        drawSelectedSolid (solid) {
            let polygons = solid.getPolygons();
            for (let i = 0; i < polygons.length; i++) {
                this.strokePoly(polygons[ i ], Colors.SELECTED);
            }
        },
        contextMenu (e) {
            let x = this.getRelativeX(e.clientX);
            let y = this.getRelativeY(e.clientY);
            toggleReset();
            vue.$refs.elementRightClick.hide();
            vue.$refs.panelRightClick.hide();
            this.selectionClick(x, y);
            if (!drawInterface.isSomethingSelected()) {
                vue.$refs.panelRightClick.show(e.clientX, e.clientY);
            } else {
                vue.$refs.elementRightClick.show(e.clientX, e.clientY);
            }
        },
        drawAxis () {
            this.context.strokeStyle = Colors.DEFAULT;
            this.context.lineWidth = 1;
            this.context.beginPath();
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
            }
            this.context.stroke();
        },
        toggleExpand () {
            if (this.expanded) {
                this.collapse();
            } else {
                this.maximize();
            }
        },
        makeInvisible () {
            this.visible = false;
        },
        makeVisible () {
            this.visible = true;
        },
        maximize () {
            makeEveryoneInvisible();
            this.makeVisible();
            this.expanded = true;
            this.resizeDefault();
        },
        collapse () {
            makeEveryoneVisible();
            this.expanded = false;
            this.resizeDefault();
        },
        resize (width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.expandStyles.top = (this.canvas.offsetTop + 10) + 'px';
            this.expandStyles.left = (this.canvas.offsetLeft + this.canvas.width - 40) + 'px';
            drawInterface.redraw();
        },
        resizeDefault(isInitialResize) {
            let dimensions;
            if (this.expanded) {
                dimensions = getScreenDimensions();
            } else {
                dimensions = getHalfScreenDimensions();
            }
            this.resize(dimensions.width, dimensions.height);
            if (isInitialResize) {
                this.initialWidth = dimensions.width;
                this.initialHeight = dimensions.height;
            }
        },
    },
    mounted () {
        this.canvas = document.getElementById(this.identifier);
        this.context = this.canvas.getContext('2d');
        this.context.lineWidth = 1;
        this.context.strokeStyle = Colors.DEFAULT;
        this.cursor = this.readonly ? 'default' : 'pointer';
        this.mode = this.readonly ? -1 : 2;
    }
});