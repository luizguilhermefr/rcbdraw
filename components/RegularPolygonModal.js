Vue.component('regular-polygon-modal', {

    template: `
        <b-modal id="regular-polygon-modal" title="Polígono Regular" @ok="submit" closeTitle="Cancelar" okTitle="Inserir" :ok-disabled="!canInsert()"> 
            <div class="modal-body">
                <b-alert variant="warning" :show="!canInsert()">
                    Insira entre três e vinte lados e um tamanho de pelo menos 50px.
                </b-alert>
                <div class="form-group">
                    <label>Lados</label>
                    <input v-model="sides" id="regular-polygon-sides" min="3" type="number" class="form-control"
                           placeholder="Lados">
                    <label>Tamanho</label>
                    <input v-model="size" id="regular-polygon-size" min="50" type="number" class="form-control"
                           placeholder="Tamanho (px)">
                </div>
            </div>
        </b-modal>
        `,

    data: function () {
        return {
            sides: '',
            size: 50
        };
    },

    methods: {
        canInsert () {
            return this.sides >= 3 && this.sides <= 20 && this.size >= 50;
        },
        submit () {
            definePolygon(this.sides, this.size);
            this.sides = '';
            this.size = 50;
        }
    }
});