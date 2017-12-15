Vue.component('panel-right-click', {

    template: `
        <b-list-group v-show="visible" class="rightclick" v-bind:style="styles">
          <b-list-group-item v-for="item in items" :key="item.id" href="#" v-b-modal="item.modal" v-on:click.native="click(item.action)">
            <i v-bind:class="item.icon" aria-hidden="true"></i>&nbsp;{{item.title}}
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
                    title: 'Freehand',
                    enabled: true,
                    icon: 'fa fa-hand-pointer-o',
                    action () {
                        expectFreehand();
                    }
                },
                {
                    id: 2,
                    title: 'Regular Polygon',
                    modal: 'regular-polygon-modal',
                    enabled: true,
                    icon: 'fa fa-square-o',
                    action () {
                        return null;
                    }
                },
                {
                    id: 3,
                    title: 'Light Source',
                    modal: 'light-source-modal',
                    enabled: true,
                    icon: 'fa fa-lightbulb-o',
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