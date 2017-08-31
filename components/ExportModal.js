Vue.component('export-modal', {

    template: `
        <b-modal id="export-modal" title="Exportar... (BETA)" @shown="prepareDownload"> 
            <div class="modal-body">
                <p><em>Exporte a cena como imagem</em></p>
                <b-form-input placeholder="Nome do arquivo" v-model="filename"></b-form-input>
            </div>
            <div slot="modal-footer">
                <a :download="filenameWithExtension.jpg" :href="jpg" class="btn btn-success">JPG</a>
                <a :download="filenameWithExtension.png" :href="png" class="btn btn-success">PNG</a>
                <b-button @click="hideModal">Fechar</b-button>
            </div>
        </b-modal>
        `,

    data: function () {
        return {
            filename: 'rcb',
            png: '',
            jpg: ''
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
            this.png = panel.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            this.jpg = panel.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
        }
    },
    computed: {
        filenameWithExtension: function () {
            return {
                png: this.filename + '.png',
                jpg: this.filename + '.jpg'
            }
        }
    }
});