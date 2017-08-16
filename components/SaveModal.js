Vue.component('save-modal', {

    template: `
        <b-modal id="save-modal" title="Salvar" @shown="prepareDownload"> 
            <div class="modal-body">
                <p><em>Faça download da cena para seu computador.</em></p>
                <b-form-input placeholder="Nome do arquivo" v-model="filename"></b-form-input>
            </div>
            <div slot="modal-footer">
                <a :download="filename" :href="url" class="btn btn-success">Download</a>
                <b-button @click="hideModal">Fechar</b-button>
            </div>
        </b-modal>
        `,

    data: function () {
        return {
            filename: 'rcb.json',
            url: ''
        }
    },
    methods: {
        hideModal() {
            this.$root.$emit('hide::modal','save-modal');
        },
        prepareDownload() {
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                alert('Por favor, atualize seu browser!');
                return;
            }
            let json = JSON.stringify(drawInterface.generateSave());
            let blob = new Blob([json], {type: 'application/json'});
            this.url = URL.createObjectURL(blob);
        }
    }
});