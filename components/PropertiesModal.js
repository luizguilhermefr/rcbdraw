Vue.component('properties-modal', {

    template: `
        <b-modal id="properties-modal" title="Propriedades..." @ok="submit" @shown="setValues" closeTitle="Cancelar" :ok-disabled="!canSet()"> 
            <div class="modal-body">
                <div class="form-group">
                    <label>Borda</label>
                    <br>
                    <input type="color" v-model="stroke" @change="setMustStrokeSelected">
                    <input class="custom-checkbox form-control-lg" type="checkbox" v-model="mustStroke"/>
                    <br>
                    <label>Preenchimento</label>
                    <br>
                    <input type="color" v-model="fill" @change="setMustFillSelected">
                    <input class="custom-checkbox form-control-lg" type="checkbox" v-model="mustFill"/>
                    <br><br>
                    <label>Coeficiente de reflexão ambiente (Ka)</label>
                    <b-input-group>
                        <b-input-group-addon v-show="!kaOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Coeficiente de reflexão ambiente (Ka)" v-model.number="ka"></b-form-input>
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseKa()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="increaseKa()">+</b-btn>
                        </b-input-group-button>
                    </b-input-group>
                    <label>Coeficiente de reflexão difusa (Kd)</label>
                    <b-input-group>
                        <b-input-group-addon v-show="!kdOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Coeficiente de reflexão difusa (Kd)" v-model.number="kd"></b-form-input>
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseKd()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="increaseKd()">+</b-btn>
                        </b-input-group-button>
                    </b-input-group>
                    <label>Coeficiente de reflexão especular (Ks)</label>
                    <b-input-group>
                        <b-input-group-addon v-show="!ksOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Coeficiente de reflexão especular (Ks)" v-model.number="ks"></b-form-input>
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseKs()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="increaseKs()">+</b-btn>
                        </b-input-group-button>
                    </b-input-group>
                    <label>Aproximação da distribuição espacial da luz refletida especularmente (n)</label>
                    <b-input-group>
                        <b-input-group-addon v-show="!nOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Aproximação da distribuição espacial da luz refletida especularmente (n)" v-model.number="n"></b-form-input>
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseN()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="increaseN()">+</b-btn>
                        </b-input-group-button>
                    </b-input-group>
                </div>
                <b-alert variant="warning" :show="!canSet()">
                    Insira parâmetros de luminosidade entre 0 e 100. A aproximação da distribuição espacial pode conter qualquer valor positivo.
                </b-alert>
            </div>
        </b-modal>
        `,

    data: function () {
        return {
            stroke: Colors.DEFAULT,
            fill: '#ffffff',
            mustStroke: true,
            mustFill: false,
            ka: 0,
            kd: 0,
            ks: 0,
            n: 0,
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
            drawInterface.selectedSolid.solid.setLighting(this.ka, this.kd, this.ks, this.n);
            drawInterface.redraw();
        },
        setValues() {
            this.stroke = drawInterface.selectedSolid.solid.getStrokeColor();
            this.fill = drawInterface.selectedSolid.solid.getFillColor();
            this.mustStroke = drawInterface.selectedSolid.solid.shouldStroke();
            this.mustFill = drawInterface.selectedSolid.solid.shouldFill();
            this.ka = drawInterface.selectedSolid.solid.getKa();
            this.kd = drawInterface.selectedSolid.solid.getKd();
            this.ks = drawInterface.selectedSolid.solid.getKs();
            this.n = drawInterface.selectedSolid.solid.getN();
        },
        kaOk() {
            return this.ka <= 1 && this.ka >= 0;
        },
        kdOk() {
            return this.kd <= 1 && this.kd >= 0;
        },
        ksOk() {
            return this.ks <= 1 && this.ks >= 0;
        },
        nOk () {
            return this.n >= 0;
        },
        canSet() {
            return this.kaOk() && this.kdOk() && this.ksOk() && this.nOk();
        },
        increaseKa() {
            this.ka = (this.ka + 0.1);
        },
        decreaseKa() {
            this.ka = (this.ka - 0.1);
        },
        increaseKd() {
            this.kd = (this.kd + 0.1);
        },
        decreaseKd() {
            this.kd = (this.kd - 0.1);
        },
        increaseKs() {
            this.ks = (this.ks + 0.1);
        },
        decreaseKs() {
            this.ks = (this.ks - 0.1);
        },
        increaseN() {
            this.n = (this.n + 0.1);
        },
        decreaseN() {
            this.n = (this.n - 0.1);
        },
    }
});