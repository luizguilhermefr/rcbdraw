Vue.component('properties-modal', {

    template: `
        <b-modal id="properties-modal" title="Properties..." @ok="submit" @shown="setValues" :ok-disabled="!canSet()"> 
            <div class="modal-body">
                <div class="form-group">
                    <label>Stroke</label>
                    <br>
                    <input type="color" v-model="stroke" @change="setMustStrokeSelected">
                    <input class="custom-checkbox form-control-lg" type="checkbox" v-model="mustStroke"/>
                    <br>
                    <label>Filling</label>
                    <br>
                    <input type="color" v-model="fill" @change="setMustFillSelected">
                    <input class="custom-checkbox form-control-lg" type="checkbox" v-model="mustFill"/>
                    <br><br>
                    <label>Aproximation of the spatial specularly reflected light distribution (n)</label>
                    <b-input-group>
                        <b-input-group-addon v-show="!nOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Aproximation of the spatial specularly reflected light distribution (n)" v-model.number="n"></b-form-input>
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseN()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="increaseN()">+</b-btn>
                        </b-input-group-button>
                    </b-input-group>
                    <br>
                    <b-tabs>
                        <b-tab v-for="param in colorParams" :title="param.name" :key="param.name">
                            <label>Ambience reflection coefficient (Ka)</label>
                            <b-input-group>
                                <b-input-group-addon v-show="!kaOk()">
                                    <strong class="text-danger">!</strong>
                                </b-input-group-addon>
                                <b-form-input placeholder="Ambience reflection coefficient (Ka)" v-model.number="param.ka"></b-form-input>
                                <b-input-group-button>
                                    <b-btn variant="danger" v-on:click="decreaseKa(param)">-</b-btn>
                                </b-input-group-button>
                                <b-input-group-button>
                                    <b-btn variant="success" v-on:click="increaseKa(param)">+</b-btn>
                                </b-input-group-button>
                            </b-input-group>
                            <label>Difuse refflection coefficient (Kd)</label>
                            <b-input-group>
                                <b-input-group-addon v-show="!kdOk()">
                                    <strong class="text-danger">!</strong>
                                </b-input-group-addon>
                                <b-form-input placeholder="Difuse refflection coefficient (Kd)" v-model.number="param.kd"></b-form-input>
                                <b-input-group-button>
                                    <b-btn variant="danger" v-on:click="decreaseKd(param)">-</b-btn>
                                </b-input-group-button>
                                <b-input-group-button>
                                    <b-btn variant="success" v-on:click="increaseKd(param)">+</b-btn>
                                </b-input-group-button>
                            </b-input-group>
                            <label>Specular reflection coefficient (Ks)</label>
                            <b-input-group>
                                <b-input-group-addon v-show="!ksOk()">
                                    <strong class="text-danger">!</strong>
                                </b-input-group-addon>
                                <b-form-input placeholder="Specular reflection coefficient (Ks)" v-model.number="param.ks"></b-form-input>
                                <b-input-group-button>
                                    <b-btn variant="danger" v-on:click="decreaseKs(param)">-</b-btn>
                                </b-input-group-button>
                                <b-input-group-button>
                                    <b-btn variant="success" v-on:click="increaseKs(param)">+</b-btn>
                                </b-input-group-button>
                            </b-input-group>
                        </b-tab>
                    </b-tabs>
                </div>
                <b-alert variant="warning" :show="!canSet()">
                    Luminosity parameters must be between 0 and 1. Spatial distribution aproximation can have any positive value.
                </b-alert>
            </div>
        </b-modal>
        `,

    data: function () {
        return {
            colorParams: [
                {
                    name: 'R',
                    ka: 0,
                    kd: 0,
                    ks: 0
                },
                {
                    name: 'G',
                    ka: 0,
                    kd: 0,
                    ks: 0
                },
                {
                    name: 'B',
                    ka: 0,
                    kd: 0,
                    ks: 0
                }
            ],
            stroke: Colors.DEFAULT,
            fill: '#ffffff',
            mustStroke: true,
            mustFill: false,
            n: 0
        };
    },

    methods: {
        setMustFillSelected() {
            this.mustFill = true;
        },
        setMustStrokeSelected() {
            this.mustStroke = true;
        },
        submit() {
            drawInterface.selectedSolid.solid.setStrokeColor(this.stroke);
            drawInterface.selectedSolid.solid.setFillColor(this.fill);
            drawInterface.selectedSolid.solid.setMustStroke(this.mustStroke);
            drawInterface.selectedSolid.solid.setMustFill(this.mustFill);
            drawInterface.selectedSolid.solid.setLighting(this.colorParams, this.n);
            drawInterface.redraw();
        },
        setValues() {
            this.stroke = drawInterface.selectedSolid.solid.getStrokeColor();
            this.fill = drawInterface.selectedSolid.solid.getFillColor();
            this.mustStroke = drawInterface.selectedSolid.solid.shouldStroke();
            this.mustFill = drawInterface.selectedSolid.solid.shouldFill();
            this.colorParams = drawInterface.selectedSolid.solid.getLighting().getParams();
            this.n = drawInterface.selectedSolid.solid.getLighting().getN();
        },
        kaOk() {
            let toReturn = true;
            this.colorParams.every(function (param) {
                if (param.ka > 1 || param.ka < 0) {
                    toReturn = false;
                    return false;
                }
                return true;
            });
            return toReturn;
        },
        kdOk() {
            let toReturn = true;
            this.colorParams.every(function (param) {
                if (param.kd > 1 || param.kd < 0) {
                    toReturn = false;
                    return false;
                }
                return true;
            });
            return toReturn;
        },
        ksOk() {
            let toReturn = true;
            this.colorParams.every(function (param) {
                if (param.ks > 1 || param.ks < 0) {
                    toReturn = false;
                    return false;
                }
                return true;
            });
            return toReturn;
        },
        nOk() {
            return this.n >= 0;
        },
        canSet() {
            return this.kaOk() && this.kdOk() && this.ksOk() && this.nOk();
        },
        increaseKa(param) {
            param.ka += 0.1;
        },
        decreaseKa(param) {
            param.ka -= 0.1;
        },
        increaseKd(param) {
            param.kd += 0.1;
        },
        decreaseKd(param) {
            param.kd -= 0.1;
        },
        increaseKs(param) {
            param.ks += 0.1;
        },
        decreaseKs(param) {
            param.ks -= 0.1;
        },
        increaseN() {
            this.n = (this.n + 0.1);
        },
        decreaseN() {
            this.n = (this.n - 0.1);
        },
    }
});