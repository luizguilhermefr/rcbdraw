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
                   <b-dropdown-item v-on:click="subitem.action" v-b-modal="subitem.modal" to="#" v-for="subitem in item.subitems" :key="subitem.id" :disabled="!subitem.enabled">{{subitem.title}}</b-dropdown-item> 
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
                            action () {
                                expectSelection();
                            }
                        },
                        {
                            id: 2,
                            title: 'Excluir',
                            enabled: true,
                            action () {
                                drawInterface.deletePolygon();
                            }
                        },
                        {
                            id: 3,
                            title: 'Mão Livre',
                            enabled: true,
                            action () {
                                expectFreehand();
                            }
                        },
                        {
                            id: 4,
                            title: 'Polígono Regular',
                            modal: 'regular-polygon-modal',
                            enabled: true,
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
                            action () {
                                return null;
                            }
                        },
                        {
                            id: 2,
                            title: 'Transladar',
                            enabled: true,
                            action () {
                                expectTranslate();
                            }
                        },
                        {
                            id: 3,
                            title: 'Escalar',
                            enabled: true,
                            action () {
                                expectScale();
                            }
                        },
                        {
                            id: 4,
                            title: 'Cisalhar Horizontalmente',
                            enabled: true,
                            action () {
                                expectShear('x');
                            }
                        },
                        {
                            id: 5,
                            title: 'Cisalhar Verticalmente',
                            enabled: true,
                            action () {
                                expectShear('y');
                            }
                        },
                        {
                            id: 6,
                            title: 'Propriedades do objeto...',
                            enabled: true,
                            action () {
                                openPropertiesModal();
                            }
                        },
                        {
                            id: 7,
                            title: 'Duplicar',
                            enabled: true,
                            action () {
                                duplicateSelected();
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
                            action () {
                                return null;
                            }
                        },
                        {
                            id: 2,
                            title: 'Ajuda',
                            enabled: false,
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