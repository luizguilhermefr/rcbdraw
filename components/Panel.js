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
         </div>
        `,

    props: [ 'identifier', 'readonly', 'title' ],

    data: function () {
        return {
            initialWidth: 0,
            initialHeight: 0,
            visible: true,
            expanded: false,
            canvas: null,
            context: null,
            mode: NULL_MODE,
            size: 0,
            sides: 0,
            stroke: Colors.DEFAULT,
            fill: null,
            mustStroke: true,
            mustFill: false,
            lightAmbientIntensity: 0,
            lightSourceIntensity: 0,
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
            this.mode = PUT_POLY;
            this.cursor = 'copy';
        },
        expectLightSource (ambientIntensity, sourceIntensity) {
            this.lightAmbientIntensity = ambientIntensity;
            this.lightSourceIntensity = sourceIntensity;
            this.mode = PUT_LIGHT;
            this.cursor = 'copy';
        },
        expectSelection () {
            this.mode = SELECTION;
            this.cursor = 'pointer';
        },
        expectFreehand () {
            this.mode = FREEHAND;
            this.cursor = 'crosshair';
        },
        expectTranslate () {
            this.mode = TRANSLATE;
            this.cursor = 'move';
        },
        expectScale () {
            this.mode = RESIZE;
            this.cursor = 'w-resize';
        },
        expectRotation () {
            this.mode = ROTATE;
            this.cursor = 'move';
        },
        vrpRotation () {
            this.mode = MOVE_VRP;
            this.cursor = 'pointer';
        },
        onClick (e) {
            hideContext();
            let x = this.getRelativeX(e.clientX);
            let y = this.getRelativeY(e.clientY);
            switch (this.mode) {
                case PUT_POLY:
                    x = x - (this.canvas.width / 2);
                    y = y - (this.canvas.height / 2);
                    this.putPoly(x, y);
                    break;
                case SELECTION:
                    this.selectionClick(x, y);
                    break;
                case FREEHAND:
                    x = x - (this.canvas.width / 2);
                    y = y - (this.canvas.height / 2);
                    this.freehandClick(x, y);
                    break;
                case PUT_LIGHT:
                    x = x - (this.canvas.width / 2);
                    y = y - (this.canvas.height / 2);
                    this.putLight(x, y);
            }
        },
        mouseDown (e) {
            if (this.mode === TRANSLATE || this.mode === MOVE_VRP || this.mode === RESIZE || this.mode === ROTATE) {
                this.dragging = true;
                this.tempClickX = this.getRelativeX(e.clientX);
                this.tempClickY = this.getRelativeY(e.clientY);
            }

            return false;
        },
        mouseMove (e) {
            if (this.dragging) {
                let x = this.getRelativeX(e.clientX);
                let y = this.getRelativeY(e.clientY);
                switch (this.mode) {
                    case TRANSLATE:
                        drawInterface.translateClick(x - (this.canvas.width / 2), y -
                            (this.canvas.height / 2));
                        break;
                    case RESIZE:
                        drawInterface.scaleClick((x - this.tempClickX) / 80, ((y - this.tempClickY) /
                            80));
                        this.tempClickX = x;
                        this.tempClickY = y;
                        break;
                    case ROTATE:
                        drawInterface.rotationClick(-(y - this.tempClickY) / 80, (x - this.tempClickX) /
                            80);
                        this.tempClickX = x;
                        this.tempClickY = y;
                        break;
                    case MOVE_VRP:
                        this.vrp.vrpRotation(((y - this.tempClickY) / 180), -(x - this.tempClickX) / 180);
                        drawInterface.redraw();
                        this.tempClickX = x;
                        this.tempClickY = y;
                        break;
                }
            }
        },
        mouseUp (e) {
            if (this.dragging) {
                let x = this.getRelativeX(e.clientX);
                let y = this.getRelativeY(e.clientY);
                switch (this.mode) {
                    case TRANSLATE:
                        drawInterface.translateClick(x - (this.canvas.width / 2), y -
                            (this.canvas.height / 2));
                        break;
                    case RESIZE:
                        drawInterface.scaleClick((x - this.tempClickX) / 80, ((y - this.tempClickY) /
                            80));
                        drawInterface.resetScaleClick();
                        this.tempClickX = x;
                        this.tempClickY = y;
                        break;
                    case ROTATE:
                        drawInterface.rotationClick(-(y - this.tempClickY) / 80, (x - this.tempClickX) /
                            80);
                        drawInterface.resetRotationClick();
                        this.tempClickX = 0;
                        this.tempClickY = 0;
                        break;
                    case MOVE_VRP:
                        this.vrp.vrpRotation(((y - this.tempClickY) / 180), -(x - this.tempClickX) / 180);
                        drawInterface.redraw();
                        this.tempClickX = 0;
                        this.tempClickX = 0;
                        break;
                }
                this.dragging = false;
            }
        },
        normalizeViewUp () {
            let norm = this.viewUp.getMagnitude();
            this.viewUp.divScalar(norm);
        },
        putPoly (x, y) {
            drawInterface.newRegularPolygon(this.sides, this.size, this.stroke, this.fill, this.mustStroke, this.mustFill, x, y);
        },
        putLight (x, y) {
            drawInterface.newLightSource(this.lightAmbientIntensity, this.lightSourceIntensity, x, y);
            toggleReset();
            drawInterface.redraw();
        },
        selectionClick (x, y) {
            drawInterface.selectionClick(x, y);
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
        drawSolids (solids, lightSource, shouldWireframe = false, shouldHideSurfaces = true, shouldShade = true) {
            solids.forEach(function (solid) {
                let shouldIgnoreVisibility = (solid.countPolygons() < 2) || !shouldHideSurfaces;
                solid.getPolygons().forEach(function (polygon) {
                    polygon.updateDrawableVertices(this.canvas.width, this.canvas.height, this.initialWidth, this.initialHeight, this.vrp, this.viewUp, shouldIgnoreVisibility, this.fillColor);
                    if (polygon.isVisible(this.h, this.v)) {
                        if (solid.shouldFill() && !shouldWireframe) {
                            this.fillPoly(polygon, solid.getLighting(), solid.getFillColor(), lightSource, shouldShade);
                        }
                        if (solid.shouldStroke() || shouldWireframe) {
                            let color = solid.getStrokeColor();
                            if (solid.getSelected()) {
                                color = Colors.SELECTED;
                            }

                            this.strokePoly(polygon, shouldWireframe ? Colors.WIREFRAME : color);
                        }
                    }
                }.bind(this));
            }.bind(this));
        },
        strokePoly (polygon, color, autoClose = true) {
            this.context.lineWidth = 1;
            this.context.strokeStyle = color;
            this.context.beginPath();
            let vertices = polygon.getDrawableVertices();
            if (vertices.length > 1) {
                this.context.moveTo(vertices[ 0 ].getX(), vertices[ 0 ].getY());
                this.context.lineTo(vertices[ 1 ].getX(), vertices[ 1 ].getY());
            }
            for (let j = 1; j < vertices.length; j++) {
                this.context.lineTo(vertices[ j ].getX(), vertices[ j ].getY());
            }
            if (autoClose) {
                this.context.closePath();
            }
            this.context.stroke();
        },
        fillPoly (polygon, lighting, color, lightSource, shouldShade = true) {
            this.context.lineWidth = 1;
            if (shouldShade) {
                let r = 0, g = 0, b = 0;
                lightSource.forEach(function (ls) {
                    let li = new FlatShading(polygon, lighting, this.vrp, ls.getPosition().clone());
                    r += li.getColor('R', ls.ambientIntensity, ls.sourceIntensity);
                    g += li.getColor('G', ls.ambientIntensity, ls.sourceIntensity);
                    b += li.getColor('B', ls.ambientIntensity, ls.sourceIntensity);
                }.bind(this));
                r = r > 255 ? 255 : r;
                g = g > 255 ? 255 : g;
                b = b > 255 ? 255 : b;
                r = r.toString(16);
                g = g.toString(16);
                b = b.toString(16);
                r = r.length === 0x2 ? r : '0' + r;
                g = g.length === 0x2 ? g : '0' + g;
                b = b.length === 0x2 ? b : '0' + b;
                color = '#' + r + g + b;
            }
            this.context.strokeStyle = color;
            this.context.beginPath();
            let filler = new PolyFill(polygon);
            filler.run(this.context);
        },
        drawTemporaryPolygon () {
            if (this.freeHandDots.length > 1) {
                let polygon = new Polygon(this.freeHandDots);
                polygon.updateDrawableVertices(this.canvas.width, this.canvas.height, this.initialWidth, this.initialHeight, this.vrp, this.viewUp, true);
                this.strokePoly(polygon, Colors.TEMPORARY, false);
            }
        },
        pushFreeHandDot (x, y) {
            let toPush;
            toPush = new Vertex(x, y, 0);
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
            return this.freeHandDots[ 0 ].distanceToVertexXY(this.freeHandDots[ this.freeHandDots.length -
            1 ]) < 20;
        },
        drawSelectedSolid (solid) {
            let polygons = solid.getPolygons();
            for (let i = 0; i < polygons.length; i++) {
                if (polygons[ i ].isVisible(this.h, this.v)) {
                    this.strokePoly(polygons[ i ], Colors.SELECTED);
                }
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
            this.context.moveTo(10, 40);
            this.context.lineTo(10, 80);
            this.context.lineTo(5, 75);
            this.context.moveTo(10, 80);
            this.context.lineTo(15, 75);
            this.context.fillText('y', 8, 90);
            this.context.moveTo(10, 40);
            this.context.lineTo(50, 40);
            this.context.lineTo(45, 35);
            this.context.moveTo(50, 40);
            this.context.lineTo(45, 45);
            this.context.fillText('x', 55, 42);
            this.context.stroke();
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
        resizeDefault (isInitialResize = false) {
            this.$nextTick(function () {
                let dimensions;
                dimensions = getScreenDimensions();
                this.resize(dimensions.width, dimensions.height);
                if (isInitialResize) {
                    this.initialWidth = dimensions.width;
                    this.initialHeight = dimensions.height;
                }
            }.bind(this));
        }
    },
    mounted () {
        this.canvas = document.getElementById(this.identifier);
        this.context = this.canvas.getContext('2d');
        this.context.lineWidth = 1;
        this.context.strokeStyle = Colors.DEFAULT;
        this.cursor = this.readonly ? 'default' : 'pointer';
        this.mode = this.readonly ? -1 : 2;
        this.tempClickX = null;
        this.tempClickY = null;
        this.vrp = new Vertex(0, 0, 100);
        this.viewUp = new Vertex(0, 1, 0);
    }
});