Vue.component('rcb-navbar', {

    template: `
    <b-navbar id="navbar" toggleable fixed="top" type="inverse" variant="inverse"> 
        <b-nav-toggle target="nav_collapse"></b-nav-toggle> 
        <b-link class="navbar-brand" to="#"> 
            <span>RCBDraw 3D</span> 
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
                    title: 'File',
                    enabled: true,
                    subitems: [
                        {
                            id: 1,
                            title: 'New',
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
                            title: 'Open',
                            modal: 'open-modal',
                            icon: 'fa fa-folder-open',
                            enabled: true,
                            action () {
                                return null;
                            }
                        },
                        {
                            id: 3,
                            title: 'Save',
                            modal: 'save-modal',
                            enabled: true,
                            icon: 'fa fa-save',
                            action () {
                                return null;
                            }
                        }
                    ]
                }
                ,
                {
                    id: 2,
                    title: 'Tools',
                    enabled: true,
                    subitems: [
                        {
                            id: 1,
                            title: 'Select',
                            enabled: true,
                            icon: 'fa fa-mouse-pointer',
                            action () {
                                expectSelection();
                            }
                        },
                        {
                            id: 2,
                            title: 'Freehand',
                            enabled: true,
                            icon: 'fa fa-hand-pointer-o',
                            action () {
                                expectFreehand();
                            }
                        },
                        {
                            id: 3,
                            title: 'Regular Polygon',
                            modal: 'regular-polygon-modal',
                            enabled: true,
                            icon: 'fa fa-square-o',
                            action () {
                                return null;
                            }
                        },
                        {
                            id: 4,
                            title: 'Light Source',
                            modal: 'light-source-modal',
                            icon: 'fa fa-lightbulb-o',
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
                            title: 'Rotate',
                            enabled: true,
                            icon: 'fa fa-repeat',
                            action () {
                                expectRotation();
                            }
                        },
                        {
                            id: 2,
                            title: 'Move',
                            enabled: true,
                            icon: 'fa fa-arrows',
                            action () {
                                expectTranslate();
                            }
                        },
                        {
                            id: 3,
                            title: 'Scale',
                            enabled: true,
                            icon: 'fa fa-compress',
                            action () {
                                expectScale();
                            }
                        },
                        {
                            id: 10,
                            title: 'Revolution',
                            enabled: true,
                            icon: 'fa fa-circle-o-notch',
                            action () {
                                openRevolutionModal();
                            }
                        },
                        {
                            id: 11,
                            title: 'Extrusion',
                            enabled: true,
                            icon: 'fa fa-cube',
                            action () {
                                openExtrusionModal();
                            }
                        },
                        {
                            id: 7,
                            title: 'Delete',
                            enabled: true,
                            icon: 'fa fa-trash-o',
                            action () {
                                deleteSolid();
                            }
                        },
                        {
                            id: 11,
                            title: 'Object properties...',
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
                    title: 'Help',
                    enabled: true,
                    subitems: [
                        {
                            id: 1,
                            title: 'About',
                            modal: 'about-modal',
                            enabled: true,
                            icon: 'fa fa-info-circle',
                            action () {
                                return null;
                            }
                        },
                        {
                            id: 2,
                            title: 'Help',
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