// noinspection LightningSingletonTags
Vue.component('panel', {

    template: `
        <div class="all-canvas">
            <canvas
                :id="myId"
                class="canvas col-md-12"
                v-bind:style="{cursor: cursor}"
                v-on:keyup.esc="esc"
                v-on:keyup.del="del"
                v-on:click="onClick"
                v-on:contextmenu.prevent="contextMenu"
                v-on:mousedown="mouseDown"
                v-on:mouseup="mouseUp"
                v-on:mousemove="mouseMove"
            >
                Seu navegador não suporta o Canvas do HTML5. <br>
                Procure atualizá-lo.
            </canvas>
            <div id="mouse"></div>
         </div>
        `,

    props: [ 'identifier' ],

    data: function () {
        return {
            myId: this.identifier,
            canvas: null,
            context: null,
            rect: null,
            mode: 2,
            size: 0,
            sides: 0,
            stroke: Colors.DEFAULT,
            fill: null,
            mustStroke: true,
            mustFill: false,
            cursor: 'pointer',
            dragging: false,
            prevScaleFactor: {
                X: 0,
                Y: 0
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
            // alert('client: ' + e.clientX + '/'+ e.clientY);
            // alert('normalized: ' + this.getRelativeX(e.clientX) + '/'+ this.getRelativeY(e.clientY));
            switch (this.mode) {
                case 1:
                    this.putPoly(this.getRelativeX(e.clientX), this.getRelativeY(e.clientY));
                    break;
                case 2:
                    this.selectionClick(e.clientX, e.clientY);
                    break;
                case 3:
                    this.freehandClick(e.clientX, e.clientY);
                    break;
                case 6:
                    drawInterface.shearHorizontalClick(e.clientX, e.clientY);
                    break;
                case 7:
                    drawInterface.shearVerticalClick(e.clientX, e.clientY);
                    break;
            }
        },
        mouseDown (e) {
            if (this.mode >= 4 && this.mode <= 5 || this.mode === 8) {
                this.dragging = true;
            }
        },
        mouseMove (e) {
            if (this.dragging) {
                switch (this.mode) {
                    case 4:
                        drawInterface.translateClick(e.clientX, e.clientY);
                        break;
                    case 5:
                        drawInterface.scaleClick(e.clientX, e.clientY);
                        break;
                    case 8:
                        drawInterface.rotationClick(e.clientX, e.clientY);
                        break;
                }
            }
        },
        mouseUp (e) {
            if (this.dragging) {
                switch (this.mode) {
                    case 4:
                        drawInterface.translateClick(e.clientX, e.clientY);
                        break;
                    case 5:
                        drawInterface.scaleClick(e.clientX, e.clientY);
                        drawInterface.resetScaleClick();
                        break;
                    case 8:
                        drawInterface.rotationClick(e.clientX, e.clientY);
                        drawInterface.resetRotationClick();
                        break;
                }
                this.dragging = false;
            }
        },
        putPoly (x, y) {
            drawInterface.newRegularPolygon(this.sides, this.size, this.stroke, this.fill, this.mustStroke, this.mustFill, x, y);
        },
        selectionClick (x, y) {
            drawInterface.selectionClick(x, y);
        },
        freehandClick (x, y) {
            drawInterface.clearSelectedPolygon(true);
            if (!drawInterface.pushFreeHandDot(x, y)) {
                drawInterface.clearFreeHandDots();
                this.reset();
            }
        },
        reset () {
            drawInterface.clearFreeHandDots();
            this.mode = 2;
            this.size = 0;
            this.sides = 0;
            this.cursor = 'pointer';
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
        strokePoly (polygon) {
            this.context.strokeStyle = polygon.strokeColor;
            this.context.beginPath();
            this.context.moveTo(polygon.vertexAt(0).getX(),polygon.vertexAt(0).getY());
            for (let j = 1; j < polygon.countVertices(); j++) {
                let vertex = polygon.vertexAt(j);
                this.context.lineTo(vertex.getX(), vertex.getY());
            }
            this.context.closePath();
            this.context.stroke();
        },
        fillPoly (polygon) {
            //
        },
        contextMenu (e) {
            toggleReset();
            vue.$refs.elementRightClick.hide();
            vue.$refs.panelRightClick.hide();
            drawInterface.selectionClick(e.clientX, e.clientY);
            if (!drawInterface.isSomethingSelected()) {
                vue.$refs.panelRightClick.show(e.clientX, e.clientY);
            } else {
                vue.$refs.elementRightClick.show(e.clientX, e.clientY);
            }
        },
        del () {
            drawInterface.deletePolygon();
        },
        esc () {
            toggleReset();
        }
    },
    mounted () {
        this.canvas = document.getElementById(this.myId);
        this.context = this.canvas.getContext('2d');
        this.rect = this.canvas.getBoundingClientRect();
        this.context.lineWidth = 1;
        this.context.strokeStyle = Colors.DEFAULT;
    }
});