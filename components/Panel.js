Vue.component('panel', {

    template: `
        <div>
            <canvas v-bind:style="{cursor: cursor}" id="drawpanel" width="1366" height="1024" class="canvas col-md-12" v-on:click="onClick" @mousedown="mouseDown" @mouseup="mouseUp" @mousemove="mouseMove">
                Seu navegador não suporta o Canvas do HTML5. <br>
                Procure atualizá-lo.
            </canvas>
            <div id="mouse"></div>
         </div>
        `,

    data: function () {
        return {
            mode: 0, // 0: nada, 1: esperando posicionamento de polígono, 2: seleção, 3: mão livre
            size: 0,
            sides: 0,
            stroke: Colors.DEFAULT,
            fill: null,
            mustStroke: true,
            mustFill: false,
            cursor: 'default',
            dragging: false
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
        expectShear (direction) {
            if (direction === 'x') {
                this.mode = 6;
            } else if (direction === 'y') {
                this.mode = 7;
            }
            this.cursor = 'pointer';
        },
        onClick (e) {
            switch (this.mode) {
                case 1:
                    this.putPoly(e.clientX, e.clientY);
                    break;
                case 2:
                    this.selectionClick(e.clientX, e.clientY);
                    break;
                case 3:
                    this.freehandClick(e.clientX, e.clientY);
                    break;
            }
        },
        mouseDown () {
            if (this.mode >= 4 && this.mode <= 7) {
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
                    case 6:
                        drawInterface.shearHorizontalClick(e.clientX, e.clientY);
                        break;
                    case 7:
                        drawInterface.shearVerticalClick(e.clientX, e.clientY);
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
                        break;
                    case 6:
                        drawInterface.shearHorizontalClick(e.clientX, e.clientY);
                        break;
                    case 7:
                        drawInterface.shearVerticalClick(e.clientX, e.clientY);
                        break;
                }
                this.dragging = false;
            }
        },
        putPoly (x, y) {
            drawInterface.newRegularPolygon(this.sides, this.size, this.stroke, this.fill, this.mustStroke, this.mustFill, x, y);
            this.reset();
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
            this.mode = 0;
            this.size = 0;
            this.sides = 0;
            this.cursor = 'default';
            this.dragging = false;
            this.stroke = Colors.DEFAULT;
            this.fill = null;
            this.mustStroke = true;
            this.mustFill = false;
        }
    }
});