Vue.component('light-source-modal', {

    template: `
        <b-modal id="light-source-modal" title="Fonte de Luminosidade" @ok="submit" @shown="setValues" closeTitle="Cancelar" okTitle="Inserir" :ok-disabled="!canInsert()"> 
            <div class="modal-body">
                <h3>Fontes Atuais</h3>
                <b-alert :show="!currentSources.length">Nenhuma fonte de luz inserida.</b-alert>
                <div class="form-group" v-for="source in currentSources">
                    <label>Intensidade {{source.index + 1}}</label>
                    <b-input-group>
                        <b-form-input placeholder="Intensidade" v-model.number="source.intensity"></b-form-input>                        
                    </b-input-group>       
                    <br/>
                    <label>Coordenadas:</label>
                    <div class="row">
                        <div class="col-md-4">                            
                           <b-input-group>                      
                                <b-input-group-addon>X</b-input-group-addon>
                                <b-form-input placeholder="" v-model.number="source.x"></b-form-input>                                 
                            </b-input-group>                                                      
                        </div>
                        <div class="col-md-4">                            
                            <b-input-group>                      
                                <b-input-group-addon>Y</b-input-group-addon>
                                <b-form-input placeholder="" v-model.number="source.y"></b-form-input>                                 
                            </b-input-group>                                                         
                        </div>
                        <div class="col-md-4">      
                            <b-input-group>                      
                                <b-input-group-addon>Z</b-input-group-addon>
                                <b-form-input placeholder="" v-model.number="source.z"></b-form-input>                                 
                            </b-input-group>                                                                                            
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-4">
                        </div>                        
                        <div class="col-md-4">  
                            <button class="btn btn-primary btn-block" v-on:click="updateSource(source.index, source.x, source.y, source.z, source.intensity)">Ok</button>
                        </div>    
                    </div> 
                    <hr>                          
                </div>
                <h3>Adicionar Fonte</h3>
                <div class="form-group">
                    <label>Intensidade</label>
                    <b-input-group>
                        <b-input-group-addon v-show="!intensityOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Intensidade" v-model.number="intensity"></b-form-input>                        
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseIntensity()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="increaseIntensity()">+</b-btn>
                        </b-input-group-button>
                        <b-input-group-addon v-show="!intensityOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                    </b-input-group>
                </div>
                <b-alert variant="warning" :show="!canInsert()">
                    Insira uma intensidade entre 0 e 255.
                </b-alert>
            </div>
        </b-modal>
        `,

    data: function () {
        return {
            intensity: 50,
            currentSources: []
        };
    },

    methods: {
        intensityOk() {
            return this.intensity >= 0 && this.intensity <= 255;
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
        },
        setValues() {
            this.currentSources = [];
            drawInterface.scene.lightSources.forEach(function (ls, i) {
                this.currentSources.push({
                    intensity: ls.getIntensity(),
                    x: ls.getPosition().getX(),
                    y: ls.getPosition().getY(),
                    z: ls.getPosition().getZ(),
                    index: i
                });
            }.bind(this));
        },
        updateSource(id, x, y, z, intensity) {
            drawInterface.scene.lightSources[id].setX(x).setY(y).setZ(z).setIntensity(intensity);
        }
    }
});