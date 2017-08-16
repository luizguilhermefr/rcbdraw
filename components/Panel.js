Vue.component('panel', {

    template: `
        <canvas v-bind:style="{cursor: cursor}" id="drawpanel" width="1366" height="1024" class="col-md-12" v-on:click="onClick">
            Seu navegador não suporta o Canvas do HTML5. <br>
            Procure atualizá-lo.
        </canvas>
        `,

    data: function () {
        return {
            mode: 0, // 0: nada, 1: esperando posicionamento de polígono, 2: seleção, 3: mão livre
            size: 0,
            sides: 0,
            cursor: 'default'
        };
    },
    methods: {
        expectPolygon (sides, size) {
            this.size = size;
            this.sides = sides;
            this.mode = 1;
            this.cursor = 'copy';
        },
        expectSelection () {
            this.mode = 2;
            this.cursor = 'pointer';
        },
        expectFreehand () {
            this.mode = 3;
            this.cursor = 'crosshair'
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
        putPoly (x, y) {
            drawInterface.newRegularPolygon(this.sides, this.size, x, y);
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
        }
    }
});