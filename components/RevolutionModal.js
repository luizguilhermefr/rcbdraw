Vue.component('revolution-modal', {
    
        template: `
        <b-modal id="revolution-modal" title="Revolução do Sólido" @ok="submit" closeTitle="Cancelar" :ok-disabled="!canInsert()"> 
        <div class="modal-body">
            <div class="form-group">
                <label>Quantidade em Graus</label>
                <br>
                <b-input-group>
                    <b-input-group-addon v-show="!degreeOk()">
                        <strong class="text-danger">!</strong>
                    </b-input-group-addon>
                    <b-form-input placeholder="Graus" v-model.number="degree" disabled></b-form-input>
                    <b-input-group-addon>px</b-input-group-addon>
                    <b-input-group-button>
                        <b-btn variant="danger" v-on:click="decreaseDegree()">-</b-btn>
                    </b-input-group-button>
                    <b-input-group-button>
                        <b-btn variant="success" v-on:click="increaseDegree()">+</b-btn>
                    </b-input-group-button>
                </b-input-group>
                <br>
                <label>Quantidade de faces</label>
                <br>
                <b-input-group>
                    <b-input-group-addon v-show="!facesOk()">
                        <strong class="text-danger">!</strong>
                    </b-input-group-addon>
                    <b-form-input placeholder="Faces" v-model.number="faces" disabled></b-form-input>
                    <b-input-group-addon>px</b-input-group-addon>
                    <b-input-group-button>
                        <b-btn variant="danger" v-on:click="decreaseFaces()">-</b-btn>
                    </b-input-group-button>
                    <b-input-group-button>
                        <b-btn variant="success" v-on:click="increaseFaces()">+</b-btn>
                    </b-input-group-button>
                </b-input-group>
                <br>
                <label>Eixo de Rotação </label>
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
        </div>
    </b-modal>
            `,
    
        data: function () {
            return {
                degree: 360,
                faces: 6,
                axis: ""
            };
        },
    
        methods: {
            degreeOk() {
                return this.degree >= 1;
            },
            increaseDegree() {
                this.degree++;
            },
            decreaseDegree() {
                this.degree--;
            },
            facesOk() {
                return this.faces >= 3;
            },
            increaseFaces() {
                this.faces++;
            },
            decreaseFaces() {
                this.faces--;
            },
            axisOk () {
                return this.axis.length;
            },
            canInsert () {
                return this.degreeOk() && this.facesOk() && this.axisOk();
            },
            submit () {                
                drawInterface.selectedSolid.solid.setDegree(this.degree);
                drawInterface.selectedSolid.solid.setFaces(this.faces);
                drawInterface.selectedSolid.solid.setAxis(this.axis);
                drawInterface.selectedSolid.solid.runRevolution();
                drawInterface.redraw();
            }
        }
    });