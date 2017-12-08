Vue.component('toolbar', {

    template: `
    <div class="toolbar">
        <nav class="nav-toolbar">
            <ul class="ul-toolbar">
                <li v-for="item in items" :content="item.title" :key="item.id" v-bind:class="item.styleClass">
                    <a href="#" v-on:click="item.action">
                        <img :src="item.icon" class="toolbar-icon">
                        {{ item.title }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
    `,

    data: function () {
        return {
            items: [
                {
                    id: 1,
                    title: 'Selecionar',
                    icon: 'icons/select.png',
                    enabled: true,
                    action() {
                        expectSelection();
                    }
                },
                {
                    id: 2,
                    title: 'Excluir',
                    icon: 'icons/delete.png',
                    enabled: true,
                    action() {
                        deleteSolid();
                    }
                },
                {
                    id: 3,
                    title: 'Triângulo',
                    icon: 'icons/triangle.png',
                    enabled: true,
                    action() {
                        definePolygon(3, 50);
                    }
                },
                {
                    id: 4,
                    title: 'Quadrado',
                    icon: 'icons/square.png',
                    enabled: true,
                    action() {
                        definePolygon(4, 50);
                    }
                },
                {
                    id: 5,
                    title: 'Pentágono',
                    icon: 'icons/pentagon.png',
                    enabled: true,
                    action() {
                        definePolygon(5, 50);
                    }
                },
                {
                    id: 7,
                    title: 'Polígono Regular',
                    icon: 'icons/regular.png',
                    enabled: true,
                    action() {
                        openRegularPolygonModal();
                    }
                },
                {
                    id: 8,
                    title: 'Mão Livre',
                    icon: 'icons/freehand.png',
                    enabled: true,
                    action() {
                        expectFreehand();
                    }
                },
                {
                    id: 9,
                    title: 'Wireframe',
                    icon: 'icons/wireframe.png',
                    enabled: true,
                    action() {
                        toggleWireframe();
                    }
                },
                {
                    id: 10,
                    title: 'Ocultação de Faces',
                    icon: 'icons/hide-surfaces.png',
                    enabled: true,
                    action() {
                        toggleSurfaceHiding();
                    }
                },
                {
                    id: 11,
                    title: 'Sombreamento',
                    icon: 'icons/disable-shading.png',
                    enabled: true,
                    action() {
                        toggleShading();
                    }
                }
            ],
        };
    },
});