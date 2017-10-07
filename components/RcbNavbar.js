Vue.component('rcb-navbar', {

    template: `
    <b-navbar id="navbar" toggleable fixed="top" type="inverse" variant="inverse"> 
        <b-nav-toggle target="nav_collapse"></b-nav-toggle> 
        <b-link class="navbar-brand" to="#"> 
            <span>RCBDraw 2.0</span> 
        </b-link> 
        <b-collapse is-nav id="nav_collapse"> 
            <b-nav is-nav-bar class="ml-0"> 
               <b-nav-item-dropdown v-for="item in items" :text="item.title" :key="item.id" :disabled="!item.enabled"> 
                   <b-dropdown-item v-on:click="subitem.action" v-b-modal="subitem.modal" to="#" v-for="subitem in item.subitems" :key="subitem.id" :disabled="!subitem.enabled"><i v-bind:class="subitem.icon" aria-hidden="true"></i> {{subitem.title}}</b-dropdown-item> 
               </b-nav-item-dropdown> 
            </b-nav> 
        </b-collapse> 
    </b-navbar>
    `,

    data: function () {
        return {
            items: [
                {
                    id: 1,
                    title: 'Arquivo',
                    enabled: true,
                    subitems: [
                        {
                            id: 1,
                            title: 'Novo',
                            enabled: true,
                            icon: 'fa fa-file-text',
                            action () {
                                if (drawInterface.shouldAskOnReset()) {
                                    if (confirm('Tem certeza que deseja criar um novo arquivo? As alteraçoes serão perdidas.')) {
                                        drawInterface.resetScene();
                                    }
                                } else {
                                    drawInterface.resetScene();
                                }
                            }
                        },

                        {
                            id: 2,
                            title: 'Abrir',
                            modal: 'open-modal',
                            icon: 'fa fa-folder-open',
                            enabled: true,
                            action () {
                                return null;
                            }
                        },
                        {
                            id: 3,
                            title: 'Salvar',
                            modal: 'save-modal',
                            enabled: true,
                            icon: 'fa fa-save',
                            action () {
                                return null;
                            }
                        },
                        {
                            id: 4,
                            title: 'Exportar...',
                            modal: 'export-modal',
                            enabled: true,
                            icon: 'fa fa-cog',
                            action () {
                                return null;
                            }
                        }
                    ]
                }
                ,
                {
                    id: 2,
                    title: 'Ferramentas',
                    enabled: true,
                    subitems: [
                        {
                            id: 1,
                            title: 'Selecionar',
                            enabled: true,
                            icon: 'fa fa-mouse-pointer',
                            action () {
                                expectSelection();
                            }
                        },
                        {
                            id: 2,
                            title: 'Mão Livre',
                            enabled: true,
                            icon: 'fa fa-hand-pointer-o',
                            action () {
                                expectFreehand();
                            }
                        },
                        {
                            id: 3,
                            title: 'Polígono Regular',
                            modal: 'regular-polygon-modal',
                            enabled: true,
                            icon: 'fa fa-square-o',
                            action () {
                                return null;
                            }
                        }
                    ]
                },
                {
                    id: 3,
                    title: 'Editar',
                    enabled: true,
                    subitems: [ 
                        {
                            id: 1,
                            title: 'Rotacionar',
                            enabled: true,
                            icon: 'fa fa-circle-o-notch',
                            action () {
                                expectRotation();
                            }
                        },
                        {
                            id: 2,
                            title: 'Transladar',
                            enabled: true,
                            icon: 'fa fa-arrows',
                            action () {
                                expectTranslate();
                            }
                        },
                        {
                            id: 3,
                            title: 'Escalar',
                            enabled: true,
                            icon: 'fa fa-compress',
                            action () {
                                expectScale();
                            }
                        },
                        {
                            id: 4,
                            title: 'Cisalhar Horizontalmente',
                            enabled: true,
                            icon: 'fa fa-arrows-h',
                            action () {
                                expectShear('x');
                            }
                        },
                        {
                            id: 5,
                            title: 'Cisalhar Verticalmente',
                            enabled: true,
                            icon: 'fa fa-arrows-v',
                            action () {
                                expectShear('y');
                            }
                        },
                        {
                            id: 6,
                            title: 'Duplicar',
                            enabled: true,
                            icon: 'fa fa-files-o',
                            action () {
                                duplicateSelected();
                            }
                        },
                        {
                            id: 7,
                            title: 'Excluir',
                            enabled: true,
                            icon: 'fa fa-trash-o',
                            action () {
                                deletePolygon();
                            }
                        },
                        {
                            id: 8,
                            title: 'Trazer nível à frente',
                            enabled: true,
                            icon: 'fa fa-level-up',
                            action () {
                                bringForward();
                            }
                        },
                        {
                            id: 9,
                            title: 'Levar nível à trás',
                            enabled: true,
                            icon: 'fa fa-level-down',
                            action () {
                                bringBackward();
                            }
                        },
                        {
                            id: 10,
                            title: 'Propriedades do objeto...',
                            enabled: true,
                            icon: 'fa fa-info',
                            action () {
                                openPropertiesModal();
                            }
                        }
                    ]
                },
                {
                    id: 4,
                    title: 'Ajuda',
                    enabled: true,
                    subitems: [
                        {
                            id: 1,
                            title: 'Sobre o RCBDraw',
                            modal: 'about-modal',
                            enabled: true,
                            icon: 'fa fa-info-circle',
                            action () {
                                return null;
                            }
                        },
                        {
                            id: 2,
                            title: 'Ajuda',
                            enabled: false,
                            icon: 'fa fa-question-circle',
                            action () {
                                return null;
                            }
                        }
                    ]
                }
            ]
        };
    }
});