Vue.component('toolbar', {

    template: `
    <div class="col-md-6 paleta-ferramentas">
        <b-tooltip v-for="item in items" :content="item.title" :key="item.id">
            <button type="button" class="btn btn-default btn-circle btn-lg selection" v-on:click="item.action">
                <h1 class="icon" v-bind:class="item.styleClass"></h1>
            </button>
        </b-tooltip>
    </div>
    `,

    data: function () {
        return {
            items: [
                {
                    id: 1,
                    title: 'Selecionar',
                    styleClass: 'icon-mouse',
                    enabled: true,
                    action () {
                        expectSelection();
                    }
                },
                {
                    id: 2,
                    title: 'Excluir',
                    styleClass: 'icon-delete',
                    enabled: true,
                    action () {
                        drawInterface.deletePolygon();
                    }
                },
                {
                    id: 3,
                    title: 'Triângulo',
                    styleClass: 'icon-triangle',
                    enabled: true,
                    action () {
                        definePolygon(3, 50);
                    }
                },
                {
                    id: 4,
                    title: 'Quadrado',
                    styleClass: 'icon-square',
                    enabled: true,
                    action () {
                        definePolygon(4, 50);
                    }
                },
                {
                    id: 5,
                    title: 'Pentágono',
                    styleClass: 'icon-pentagon',
                    enabled: true,
                    action () {
                        definePolygon(5, 50);
                    }
                },
                {
                    id: 6,
                    title: 'Hexágono',
                    styleClass: 'icon-hexagon',
                    enabled: true,
                    action () {
                        definePolygon(6, 50);
                    }
                },
                {
                    id: 7,
                    title: 'Polígono Regular',
                    styleClass: 'icon-regular',
                    enabled: true,
                    action () {
                        openRegularPolygonModal();
                    }
                },
                {
                    id: 8,
                    title: 'Mão Livre',
                    styleClass: 'icon-freehand',
                    enabled: true,
                    action () {
                        expectFreehand();
                    }
                }
            ]
        };
    }
});