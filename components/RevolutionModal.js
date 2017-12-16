Vue.component('revolution-modal', {

    template: `
        <b-modal id="revolution-modal" title="Object Revolution" @ok="submit" :ok-disabled="!canExecute()"> 
        <div class="modal-body">
            <div class="form-group">
                <label>Degrees</label>
                <br>
                <b-input-group>
                    <b-input-group-addon v-show="!degreeOk()">
                        <strong class="text-danger">!</strong>
                    </b-input-group-addon>
                    <b-form-input class="col-md-10" type="range" min="1" max="360" v-model.number="degree"></b-form-input>
                    <b-form-input class="col-md-2" type="number" min="1" max="360" v-model.number="degree"></b-form-input>
                </b-input-group>
                <br>
                <label>Surfaces</label>
                <br>
                <b-input-group>
                    <b-input-group-addon v-show="!facesOk()">
                        <strong class="text-danger">!</strong>
                    </b-input-group-addon>
                    <b-form-input type="number" placeholder="Surfaces" v-model.number="faces"></b-form-input>
                    <b-input-group-button>
                        <b-btn variant="danger" v-on:click="decreaseFaces">-</b-btn>
                    </b-input-group-button>
                    <b-input-group-button>
                        <b-btn variant="success" v-on:click="increaseFaces">+</b-btn>
                    </b-input-group-button>
                </b-input-group>
                <br>
                <label>Rotation Axis</label>
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
                Insert between 1 and 360 degrees and at least three surfaces. Also, choose a rotation axis.
            </b-alert>
        </div>
    </b-modal>
            `,

    data: function () {
        return {
            degree: 90,
            faces: 3,
            axis: ''
        };
    },

    methods: {
        degreeOk () {
            return this.degree >= 1 && this.degree <= 360;
        },
        facesOk () {
            return this.faces >= 3;
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
            return this.degreeOk() && this.facesOk() && this.axisOk();
        },
        submit () {
            drawInterface.selectedSolid.solid.runRevolution(this.faces, this.axis, this.degree);
            drawInterface.redraw();
        }
    }
});