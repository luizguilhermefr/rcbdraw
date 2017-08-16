Vue.component('about-modal', {

    template: `
        <b-modal id="about-modal" title="RCBDraw" ok-only> 
            <div class="modal-body">
                <p><em>Rosa, Canabarro & Baldi.</em></p>
                <p>Ferramenta web para manipulação de polígonos 2D.</p>
                <p>Trabalho da disciplina de Computação Gráfica do curso de Ciência da Computação da Universidade
                    Estadual do Oeste do Paraná (UNIOESTE), sob orientação do professor Adair Santa Catarina.</p>
                <p><br></p>
                <p>Cascavel, Paraná - 2017</p>
                <p><strong>Versão 2.0</strong></p>
            </div>
            <div slot="modal-close"></div>
        </b-modal>
        `
});