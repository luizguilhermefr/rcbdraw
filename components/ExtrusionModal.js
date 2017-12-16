Vue.component('extrusion-modal', {

    template: `
        <b-modal id="extrusion-modal" title="Object Extrusion" @ok="submit" :ok-disabled="!canExecute()"> 
        <div class="modal-body">
            <div class="form-group">
                <label>Distance</label>
                <br>
                <b-input-group>
                    <b-input-group-addon v-show="!distanceOk()">
                        <strong class="text-danger">!</strong>
                    </b-input-group-addon>
                    <b-form-input type="number" placeholder="Distance" v-model.number="distance"></b-form-input>
                    <b-input-group-addon>px</b-input-group-addon>
                    <b-input-group-button>
                        <b-btn variant="danger" v-on:click="decreaseDistance()">-</b-btn>
                    </b-input-group-button>
                    <b-input-group-button>
                        <b-btn variant="success" v-on:click="increaseDistance()">+</b-btn>
                    </b-input-group-button>
                </b-input-group>
                <br>
                <label>Surfaces Quantity</label>
                <br>
                <b-input-group>
                    <b-input-group-addon v-show="!facesOk()">
                        <strong class="text-danger">!</strong>
                    </b-input-group-addon>
                    <b-form-input type="number" placeholder="Surfaces Quantity" v-model.number="faces"></b-form-input>
                    <b-input-group-button>
                        <b-btn variant="danger" v-on:click="decreaseFaces()">-</b-btn>
                    </b-input-group-button>
                    <b-input-group-button>
                        <b-btn variant="success" v-on:click="increaseFaces()">+</b-btn>
                    </b-input-group-button>
                </b-input-group>
                <br>
                <label>Depth Axis</label>
                <label class="form-check-label">
                    <input class="form-check-input" type="radio" name="X" v-model="axis" value="x">X
                </label>
                <label class="form-check-label">
                    <input class="form-check-input" type="radio" name="Y" v-model="axis" value="y">Y
                </label>
                <label class="form-check-label">
                    <input class="form-check-input" type="radio" name="Z" v-model="axis" value="z">Z
                </label>
            </div>
            <b-alert variant="warning" :show="!canExecute()">
                Insert a distance of least one pixel and two surfaces. Also, choose a depth axis.
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
            return this.distance >= 1;
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