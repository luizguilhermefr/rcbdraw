Vue.component('extrusion-modal', {

    template: `
        <b-modal id="extrusion-modal" title="Extrusão de Sólidos" @ok="submit" closeTitle="Cancelar" :ok-disabled="!canExecute()"> 
        <div class="modal-body">
            <div class="form-group">
                <label>Distância</label>
                <br>
                <b-input-group>
                    <b-input-group-addon v-show="!distanceOk()">
                        <strong class="text-danger">!</strong>
                    </b-input-group-addon>
                    <b-form-input placeholder="Distância" v-model.number="distance"></b-form-input>
                    <b-input-group-addon>px</b-input-group-addon>
                    <b-input-group-button>
                        <b-btn variant="danger" v-on:click="decreaseDistance()">-</b-btn>
                    </b-input-group-button>
                    <b-input-group-button>
                        <b-btn variant="success" v-on:click="increaseDistance()">+</b-btn>
                    </b-input-group-button>
                </b-input-group>
                <br>
                <label>Quantidade de faces</label>
                <br>
                <b-input-group>
                    <b-input-group-addon v-show="!facesOk()">
                        <strong class="text-danger">!</strong>
                    </b-input-group-addon>
                    <b-form-input placeholder="Faces" v-model.number="faces"></b-form-input>
                    <b-input-group-button>
                        <b-btn variant="danger" v-on:click="decreaseFaces()">-</b-btn>
                    </b-input-group-button>
                    <b-input-group-button>
                        <b-btn variant="success" v-on:click="increaseFaces()">+</b-btn>
                    </b-input-group-button>
                </b-input-group>
                <br>
                <label>Eixo de Extrusão </label>
                <label class="form-check-label">
                    <input class="form-check-input" type="radio" name="X" id="Xaxis" v-model="axis" value="x">X
                </label>
                <label class="form-check-label">
                    <input class="form-check-input" type="radio" name="Y" id="Yaxis" v-model="axis" value="y">Y
                </label>
                <label class="form-check-label">
                    <input class="form-check-input" type="radio" name="Z" id="Zaxis" v-model="axis" value="z">Z
                </label>
            </div>
            <b-alert variant="warning" :show="!canExecute()">
                Insira uma distância de pelo menos 50 pixels e duas faces. Além disso, escolha um eixo de extrusão.
            </b-alert>
        </div>
    </b-modal>
            `,

    data: function () {
        return {
            distance: 50,
            faces: 2,
            axis: ''
        };
    },

    methods: {
        distanceOk () {
            return this.distance >= 50;
        },
        increaseDistance () {
            this.distance++;
        },
        decreaseDistance () {
            this.distance--;
        },
        facesOk () {
            return this.faces >= 2;
        },
        increaseFaces () {
            this.faces++;
        },
        decreaseFaces () {
            this.faces--;
        },
        axisOk () {
            return this.axis.length;
        },
        canExecute () {
            return this.distanceOk() && this.facesOk() && this.axisOk();
        },
        submit () {
            drawInterface.selectedSolid.solid.runExtrusion(this.faces, this.axis, this.distance);
            drawInterface.redraw();
        }
    }
});