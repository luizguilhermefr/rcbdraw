Vue.component('element-right-click', {

    template: `
        <b-list-group class="rightclick" v-bind:style="styles">
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
                    title: 'Rotacionar',
                    enabled: true,
                    action () {
                        return null;
                    }
                },
                {
                    id: 2,
                    title: 'Transladar',
                    enabled: true,
                    action () {
                        expectTranslate();
                    }
                },
                {
                    id: 3,
                    title: 'Escalar',
                    enabled: true,
                    action () {
                        expectScale();
                    }
                },
                {
                    id: 4,
                    title: 'Cisalhar Horizontalmente',
                    enabled: true,
                    action () {
                        expectShear('x');
                    }
                },
                {
                    id: 5,
                    title: 'Cisalhar Verticalmente',
                    enabled: true,
                    action () {
                        expectShear('y');
                    }
                },
                {
                    id: 6,
                    title: 'Propriedades do objeto...',
                    enabled: true,
                    action () {
                        openPropertiesModal();
                    }
                },
                {
                    id: 7,
                    title: 'Duplicar',
                    enabled: true,
                    action () {
                        duplicateSelected();
                    }
                },
                {
                    id: 8,
                    title: 'Excluir',
                    enabled: true,
                    action () {
                        deletePolygon();
                    }
                }
            ]
        };
    },
    methods: {
        show (x, y) {
            if ((this.$el.clientHeight + y) > window.innerHeight) {
                this.y = y - this.$el.clientHeight;
            } else {
                this.y = y;
            }
            this.visible = true;
            this.x = x;
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
                top: this.y + 'px',
                'margin-left': this.visible ? 0 : '-999em'
            };
        }
    },
});