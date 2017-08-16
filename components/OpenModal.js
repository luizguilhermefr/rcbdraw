Vue.component('open-modal', {

    template: `
        <b-modal id="open-modal" title="Abrir" @ok="submit" closeTitle="Cancelar" :ok-disabled="!file"> 
            <b-form-file class="file" type="file" accept="application/json" @change="onChangeFiles"></b-form-file>
        </b-modal>
        `,

    data : function () {
        return {
            file: false
        }
    },

    methods: {
        onChangeFiles(e) {
            this.file = e.target.files;
        },
        submit () {
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                alert('Por favor, atualize seu browser!');
                return;
            }
            let reader = new FileReader();
            reader.onload = function (e) {
                let contents = e.target.result;
                drawInterface.openFile(JSON.parse(contents));
            };
            reader.readAsText(this.file[0]);
        }
    }
});