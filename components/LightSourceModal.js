Vue.component('light-source-modal', {

    template: `
        <b-modal id="light-source-modal" title="Light Source" @ok="submit" @shown="setValues" okTitle="Insert" :ok-disabled="!canInsert()"> 
            <div class="modal-body">
                <h3>Current Sources</h3>
                <b-alert :show="!currentSources.length">No light source inserted.</b-alert>
                <div class="form-group" v-for="source in currentSources">
                    <label>Intensity {{source.index + 1}}</label>
                    <div class="row">
                        <b-input-group class="col-md-6">
                            <b-form-input placeholder="Intensity" v-model.number="source.ambientIntensity"></b-form-input>
                            <b-input-group-addon>ALI</b-input-group-addon>                        
                        </b-input-group>       
                        <br/>
                        <b-input-group class="col-md-6">
                            <b-form-input placeholder="Intensity" v-model.number="source.sourceIntensity"></b-form-input>
                            <b-input-group-addon>LI</b-input-group-addon>                        
                        </b-input-group>  
                    </div>     
                    <br/>
                    <label>Coordinates:</label>
                    <div class="row">
                        <div class="col-md-4">                            
                           <b-input-group>                      
                                <b-input-group-addon>X</b-input-group-addon>
                                <b-form-input v-model.number="source.x"></b-form-input>                                 
                            </b-input-group>                                                      
                        </div>
                        <div class="col-md-4">                            
                            <b-input-group>                      
                                <b-input-group-addon>Y</b-input-group-addon>
                                <b-form-input v-model.number="source.y"></b-form-input>                                 
                            </b-input-group>                                                         
                        </div>
                        <div class="col-md-4">      
                            <b-input-group>                      
                                <b-input-group-addon>Z</b-input-group-addon>
                                <b-form-input v-model.number="source.z"></b-form-input>                                 
                            </b-input-group>                                                                                            
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-6">
                            <button class="btn btn-primary btn-block" v-on:click="updateSource(source.index, source.x, source.y, source.z, source.ambientIntensity, source.sourceIntensity)">Update</button>
                        </div>                        
                        <div class="col-md-6">                            
                            <button class="btn btn-danger btn-block" v-on:click="removeSource(source.index)">Delete</button>
                        </div>    
                    </div> 
                    <hr>                          
                </div>
                <h3>Add Source</h3>
                <div class="form-group">
                    <label>Ambient Light Intensity</label>
                    <b-input-group>
                        <b-input-group-addon v-show="!ambientIntensityOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Intensity" v-model.number="ambientIntensity"></b-form-input>                        
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseAmbientIntensity()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="increaseAmbientIntensity()">+</b-btn>
                        </b-input-group-button>
                        <b-input-group-addon v-show="!ambientIntensityOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                    </b-input-group>
                    <label>Light Source Intensity</label>
                    <b-input-group>
                        <b-input-group-addon v-show="!sourceIntensityOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                        <b-form-input placeholder="Intensidade" v-model.number="sourceIntensity"></b-form-input>                        
                        <b-input-group-button>
                            <b-btn variant="danger" v-on:click="decreaseSourceIntensity()">-</b-btn>
                        </b-input-group-button>
                        <b-input-group-button>
                            <b-btn variant="success" v-on:click="increaseSourceIntensity()">+</b-btn>
                        </b-input-group-button>
                        <b-input-group-addon v-show="!sourceIntensityOk()">
                            <strong class="text-danger">!</strong>
                        </b-input-group-addon>
                    </b-input-group>
                </div>
                <b-alert variant="warning" :show="!canInsert()">
                    Intensities must be between 0 and 255.
                </b-alert>
            </div>
        </b-modal>
        `,

    data: function () {
        return {
            ambientIntensity: 50,
            sourceIntensity: 50,
            currentSources: []
        };
    },

    methods: {
        ambientIntensityOk() {
            return this.ambientIntensity >= 0 && this.ambientIntensity <= 255;
        },
        sourceIntensityOk() {
            return this.sourceIntensity >= 0 && this.sourceIntensity <= 255;
        },
        increaseAmbientIntensity() {
            this.ambientIntensity++;
        },
        decreaseAmbientIntensity() {
            this.ambientIntensity--;
        },
        increaseSourceIntensity() {
            this.sourceIntensity++;
        },
        decreaseSourceIntensity() {
            this.sourceIntensity--;
        },
        canInsert () {
            return this.ambientIntensityOk() && this.sourceIntensityOk();
        },
        submit () {
            defineLightSource(this.ambientIntensity, this.sourceIntensity);
        },
        setValues() {
            this.currentSources = [];
            drawInterface.scene.lightSources.forEach(function (ls, i) {
                this.currentSources.push({
                    ambientIntensity: ls.getAmbientIntensity(),
                    sourceIntensity: ls.getSourceIntensity(),
                    x: ls.getPosition().getX(),
                    y: ls.getPosition().getY(),
                    z: ls.getPosition().getZ(),
                    index: i
                });
            }.bind(this));
        },
        updateSource(id, x, y, z, ambientIntensity, sourceIntensity) {
            alert('Light source updated.');
            drawInterface.scene.lightSources[id].setX(x).setY(y).setZ(z).setAmbientIntensity(ambientIntensity).setSourceIntensity(sourceIntensity);
            drawInterface.redraw();
        },
        removeSource(id) {
            drawInterface.scene.lightSources.splice(id, 1);
            this.setValues();
            drawInterface.redraw();
        }
    }
});