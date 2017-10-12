Vue.component('regular-polygon-modal', {

    template: `
        <b-modal id="regular-polygon-modal" title="Polígono Regular" @ok="submit" closeTitle="Cancelar" okTitle="Inserir" :ok-disabled="!canInsert()"> 
            <div class="modal-body">
                <div class="form-group">
                    <label>Tamanho</label>
                    <b-input-group>
                        <b-input-group-addon v-show="!sizeOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Tamanho" v-model.number="size" disabled></b-form-input>
                        <b-input-group-addon>px</b-input-group-addon>
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseSize()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="increaseSize()">+</b-btn>
                        </b-input-group-button>
                    </b-input-group>
                    <br>
                    <b-input-group>
                        <b-input-group-addon v-show="!sidesOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Lados" v-model.number="sides" disabled></b-form-input>
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseSides()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="increaseSides()">+</b-btn>
                        </b-input-group-button>
                    </b-input-group>
                    <label>Borda</label>
                    <br>
                    <input type="color" v-model="stroke">
                    <input class="custom-checkbox form-control-lg" type="checkbox" v-model="mustStroke"/>
                    <br>
                    <label>Preenchimento</label>
                    <br>
                    <input type="color" v-model="fill">
                    <input class="custom-checkbox form-control-lg" type="checkbox" v-model="mustFill"/>
                </div>
                <b-alert variant="warning" :show="!canInsert()">
                    Insira entre três e vinte lados e um tamanho de pelo menos 50px.
                </b-alert>
            </div>
        </b-modal>
        `,

    data: function () {
        return {
            sides: '',
            size: 50,
            stroke: Colors.DEFAULT,
            fill: '#ffffff',
            mustStroke: true,
            mustFill: false
        };
    },

    methods: {
        sidesOk() {
            return this.sides >= 3 && this.sides <= 20;
        },
        sizeOk() {
            return this.size >= 50;
        },
        increaseSides() {
            this.sides++;
        },
        decreaseSides() {
            this.sides--;
        },
        increaseSize() {
            this.size++;
        },
        decreaseSize() {
            this.size--;
        },
        canInsert () {
            return this.sidesOk() && this.sizeOk();
        },
        submit () {
            definePolygon(this.sides, this.size, this.stroke, this.fill, this.mustStroke, this.mustFill);
            this.sides = '';
            this.size = 50;
        }
    }
});