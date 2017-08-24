Vue.component('regular-polygon-modal', {

    template: `
        <b-modal id="regular-polygon-modal" title="Polígono Regular" @ok="submit" closeTitle="Cancelar" okTitle="Inserir" :ok-disabled="!canInsert()"> 
            <div class="modal-body">
                <div class="form-group">
                    <label>Lados</label>
                    <input v-model="sides" id="regular-polygon-sides" min="3" type="number" class="form-control"
                           placeholder="Lados">
                    <label>Tamanho</label>
                    <input v-model="size" id="regular-polygon-size" min="50" type="number" class="form-control"
                           placeholder="Tamanho (px)">
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
        canInsert () {
            return this.sides >= 3 && this.sides <= 20 && this.size >= 50;
        },
        submit () {
            definePolygon(this.sides, this.size, this.stroke, this.fill, this.mustStroke, this.mustFill);
            this.sides = '';
            this.size = 50;
        }
    }
});