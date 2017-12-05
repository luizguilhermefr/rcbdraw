Vue.component('regular-polygon-modal', {

    template: `
        <b-modal id="light-source-modal" title="Fonte de Luminosidade" @ok="submit" closeTitle="Cancelar" okTitle="Inserir" :ok-disabled="!canInsert()"> 
            <div class="modal-body">
                <div class="form-group">
                    <label>Intensidade</label>
                    <b-input-group>
                        <b-input-group-addon v-show="!intensityOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Intensidade" v-model.number="intensity"></b-form-input>
                        <b-input-group-addon>%</b-input-group-addon>
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseIntensity()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="decreaseIntensity()">+</b-btn>
                        </b-input-group-button>
                    </b-input-group>
                </div>
                <b-alert variant="warning" :show="!canInsert()">
                    Insira uma intensidade entre 0 e 100%.
                </b-alert>
            </div>
        </b-modal>
        `,

    data: function () {
        return {
            intensity: 50
        };
    },

    methods: {
        intensityOk() {
            return this.intensity >= 0 && this.intensity <= 100;
        },
        increaseIntensity() {
            this.intensity++;
        },
        decreaseIntensity() {
            this.intensity--;
        },
        canInsert () {
            return this.intensityOk();
        },
        submit () {
            defineLightSource(this.intensity);
            this.intensity = 0;
        }
    }
});