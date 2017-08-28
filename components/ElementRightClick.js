Vue.component('element-right-click', {

    template: `
        <b-list-group v-show="visible" class="rightclick" v-bind:style="styles">
          <b-list-group-item v-for="item in items" :key="item.id" href="#" v-on:click.native="click(item.action)">
            {{item.title}}
          </b-list-group-item>
        </b-list-group>
    `,

    data: function () {
        return {
            visible: false,
            x: 0,
            y: 0,
            items: [
                {
                    id: 1,
                    title: 'Excluir',
                    enabled: true,
                    action () {
                        drawInterface.deletePolygon();
                    }
                },
                {
                    id: 2,
                    title: 'Rotacionar',
                    enabled: true,
                    action () {
                        return null;
                    }
                },
                {
                    id: 3,
                    title: 'Transladar',
                    enabled: true,
                    action () {
                        expectTranslate();
                    }
                },
                {
                    id: 4,
                    title: 'Escalar',
                    enabled: true,
                    action () {
                        expectScale();
                    }
                },
                {
                    id: 5,
                    title: 'Cisalhar Horizontalmente',
                    enabled: true,
                    action () {
                        expectShear('x');
                    }
                },
                {
                    id: 6,
                    title: 'Cisalhar Verticalmente',
                    enabled: true,
                    action () {
                        expectShear('y');
                    }
                },
                {
                    id: 7,
                    title: 'Propriedades do objeto...',
                    enabled: true,
                    action () {
                        openPropertiesModal();
                    }
                }
            ]
        };
    },
    methods: {
        show (x, y) {
            this.visible = true;
            this.x = x;
            this.y = y;
        },
        hide () {
            this.visible = false;
            this.x = 0;
            this.y = 0;
        },
        click (action) {
            action();
            this.hide();
        }
    },
    computed: {
        styles: function() {
            return {
                left: this.x + 'px',
                top: this.y + 'px'
            };
        }
    }
});