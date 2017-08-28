Vue.component('panel-right-click', {

    template: `
        <b-list-group v-show="visible" class="rightclick" v-bind:style="styles">
          <b-list-group-item v-for="item in items" :key="item.id" href="#" v-b-modal="item.modal" v-on:click.native="click(item.action)">
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
                    title: 'Mão Livre',
                    enabled: true,
                    action () {
                        expectFreehand();
                    }
                },
                {
                    id: 2,
                    title: 'Polígono Regular',
                    modal: 'regular-polygon-modal',
                    enabled: true,
                    action () {
                        return null;
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