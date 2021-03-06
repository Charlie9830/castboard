import React from 'react';
import App from '../components/App';
import Dexie from 'dexie';
import jetpack from 'fs-jetpack';
import TryShiftItemForward from '../utilties/TryShiftItemForward';
import TryShiftItemBackward from '../utilties/TryShiftItemBackward';
import { AppContext, AppContextDefaultValue } from '../contexts/AppContext';
const { remote, ipcRenderer } = require('electron');
const { dialog } = remote;
const log = require('electron-log');
import os from 'os';
import path from 'path';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PrimaryColor from '@material-ui/core/colors/blue';
import SecondaryColor from '@material-ui/core/colors/deepPurple';

import CastMemberFactory from '../factories/CastMemberFactory';
import RoleFactory from '../factories/RoleFactory';
import SlideFactory from '../factories/SlideFactory';
import ThemeFactory from '../factories/ThemeFactory';
import CastRowFactory from '../factories/CastRowFactory';
import CastGroupFactory from '../factories/CastGroupFactory';
import RoleGroupFactory from '../factories/RoleGroupFactory';
import CastChangeEntryFactory from '../factories/CastChangeEntryFactory';
import OrchestraMemberFactory from '../factories/OrchestraMemberFactory';
import OrchestraRoleFactory from '../factories/OrchestraRoleFactory';
import OrchestraRowFactory from '../factories/OrchestraRowFactory';
import CreateThumbnailAsync from '../utilties/CreateThumbnailAsync';
import FontObjectFactory from '../factories/FontObjectFactory';
import ShowfileInfoFactory from '../factories/ShowfileInfoFactory';


const mainDB = new Dexie('castboardMainDB');
// DB Version 1
mainDB.version(1).stores({
    showfileInfo: 'uid',
    castMembers: 'uid, name, groupId',
    castGroups: 'uid',
    roles: 'uid, name, groupId',
    roleGroups: 'uid',
    castChangeMap: 'uid',
    orchestraChangeMap: 'uid',
    slides: 'uid, number',
    theme: 'uid',
    orchestraMembers: 'uid',
    orchestraRoles: 'uid',
    fonts: 'uid',
});

// DB Version 2
mainDB.version(2).stores({
    showfileInfo: 'uid',
    castMembers: 'uid, name, groupId',
    castGroups: 'uid',
    roles: 'uid, name, groupId, billing',
    roleGroups: 'uid',
    castChangeMap: 'uid',
    orchestraChangeMap: 'uid',
    slides: 'uid, number',
    theme: 'uid',
    orchestraMembers: 'uid, name', // Added name index.
    orchestraRoles: 'uid, name, billing', // Added name, billing, indexes.
    fonts: 'uid',
});

// DB Version 3
mainDB.version(3).stores({
    showfileInfo: 'uid',
    castMembers: 'uid, name, groupId',
    castGroups: 'uid',
    roles: 'uid, name, groupId, billing',
    roleGroups: 'uid',
    castChangeMap: 'uid',
    orchestraChangeMap: 'uid',
    slides: 'uid, number',
    theme: 'uid',
    orchestraMembers: 'uid, name',
    orchestraRoles: 'uid, name, billing',
    fonts: 'uid',
    presets: 'uid', // Added Presets Table.
});

mainDB.on('populate', () => {
    populateDatabase();
})

const populateDatabase = () => {
    mainDB.theme.put(ThemeFactory());
}

const castChangeId = "0";
const themeId = "0";
const orchestraChangeId = "0";
const showfileInfoId = "0";
const initialShowfileName = "show1";

const muiTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: PrimaryColor,
        secondary: SecondaryColor,
        background: {
            paper: 'rgb(42,42,42)',
            default: 'rgb(27,27,27)',
            
        }
    }
})


class AppContainer extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.initialState = {
            showfileInfo: ShowfileInfoFactory(initialShowfileName),
            castMembers: [],
            castGroups: [],
            roles: [],
            roleGroups: [],
            castChangeMap: { uid: castChangeId }, // Maps RoleId's to CastMemberId's
            orchestraChangeMap: { uid: orchestraChangeId }, // Maps OrchestraRoleIds to OrchestraMemberIds.
            slides: [],
            presets: [],
            orchestraMembers: [],
            orchestraRoles: [],
            selectedSlideId: -1,
            theme: ThemeFactory(),
            roleSelectDialog: {
                open: false,
                roles: [],
                onChoose: null,
                onCancel: null,
            },
            fontNameDialog: {
                open: false,
                onContinue: null,
                onCancel: null,
            },
            confirmationDialog: {
                open: false,
                title: '',
                message: '',
                onAffirmative: null,
                onNegative: null,
            },
            isFontStyleClipboardSnackbarOpen: false,
            appContext: {...AppContextDefaultValue, setFontStyleClipboard: (newValue) => {this.handleSetFontStyleClipboard(newValue)} },
            isInPresentationMode: false,
            isPlaying: false,
            remoteServerStatusSnackbar: {
                open: false,
                message: "",
            },
            openInputId: -1,
            fonts: [],
            generalSnackbar: { open: false, type: 'info', message: "", onClose: () => {} }
        }

        this.state = this.initialState;

        this.presentationInterval = null;
        this.powerSaveBlockerId = -1;

        // Method Bindings.
        this.handleAddCastMemberButtonClick = this.handleAddCastMemberButtonClick.bind(this);
        this.handleCastMemberNameChange = this.handleCastMemberNameChange.bind(this);
        this.handleRoleBillingChange = this.handleRoleBillingChange.bind(this);
        this.handleCastMemberDeleteButtonClick = this.handleCastMemberDeleteButtonClick.bind(this);
        this.handleAddRoleButtonClick = this.handleAddRoleButtonClick.bind(this);
        this.handleDeleteRoleButtonClick = this.handleDeleteRoleButtonClick.bind(this);
        this.handleRoleNameChange = this.handleRoleNameChange.bind(this);
        this.handleAddHeadshotButtonClick = this.handleAddHeadshotButtonClick.bind(this);
        this.handleCastChange = this.handleCastChange.bind(this);
        this.handleAddSlideButtonClick = this.handleAddSlideButtonClick.bind(this);
        this.handleSlideNameChange = this.handleSlideNameChange.bind(this);
        this.handleSlideTypeChange = this.handleSlideTypeChange.bind(this);
        this.handleDeleteSlideButtonClick = this.handleDeleteSlideButtonClick.bind(this);
        this.handleSlideSelect = this.handleSlideSelect.bind(this);
        this.handleChooseTitleSlideImageButtonClick = this.handleChooseTitleSlideImageButtonClick.bind(this);
        this.handleChooseBackgroundImageButtonClick = this.handleChooseBackgroundImageButtonClick.bind(this);
        this.handleInformationTextChange = this.handleInformationTextChange.bind(this);
        this.handleInformationTextFontStyleChange = this.handleInformationTextFontStyleChange.bind(this);
        this.handleBaseFontStyleChange = this.handleBaseFontStyleChange.bind(this);
        this.handleAddRowToSlideButtonClick = this.handleAddRowToSlideButtonClick.bind(this);
        this.handleAddRoleToCastRowButtonClick = this.handleAddRoleToCastRowButtonClick.bind(this);
        this.handleSlideTitleChange = this.handleSlideTitleChange.bind(this);
        this.handleSlideTitleFontStyleChange = this.handleSlideTitleFontStyleChange.bind(this);
        this.handleCastRowRoleDeleteButtonClick = this.handleCastRowRoleDeleteButtonClick.bind(this);
        this.handleCastRowDeleteButtonClick = this.handleCastRowDeleteButtonClick.bind(this);
        this.handleCastRowRoleShiftUpButtonClick = this.handleCastRowRoleShiftUpButtonClick.bind(this);
        this.handleCastRowRoleShiftDownButtonClick = this.handleCastRowRoleShiftDownButtonClick.bind(this);
        this.handlePrincipleFontStyleChange = this.handlePrincipleFontStyleChange.bind(this);
        this.handleLeadFontStyleChange = this.handleLeadFontStyleChange.bind(this);
        this.handleEnsembleFontStyleChange = this.handleEnsembleFontStyleChange.bind(this);
        this.handleHeadshotBorderStrokeWidthChange = this.handleHeadshotBorderStrokeWidthChange.bind(this);
        this.handleHeadshotBorderColorChange = this.handleHeadshotBorderColorChange.bind(this);
        this.handleAddCastGroupButtonClick = this.handleAddCastGroupButtonClick.bind(this);
        this.handleAddCastMemberToGroupButtonClick = this.handleAddCastMemberToGroupButtonClick.bind(this);
        this.handleCastGroupNameChange = this.handleCastGroupNameChange.bind(this);
        this.handleAddRoleGroupButtonClick = this.handleAddRoleGroupButtonClick.bind(this);
        this.handleAddRoleToGroupButtonClick = this.handleAddRoleToGroupButtonClick.bind(this);
        this.handleRoleGroupNameChange = this.handleRoleGroupNameChange.bind(this);
        this.handleRoleDisplayedNameChange = this.handleRoleDisplayedNameChange.bind(this);
        this.handleRoleGroupDeleteButtonClick = this.handleRoleGroupDeleteButtonClick.bind(this);
        this.handleCastGroupDeleteButtonClick = this.handleCastGroupDeleteButtonClick.bind(this);
        this.handleGroupCastChange = this.handleGroupCastChange.bind(this);
        this.handleAddOrchestraMemberButtonClick = this.handleAddOrchestraMemberButtonClick.bind(this);
        this.handleOrchestraMemberNameChange = this.handleOrchestraMemberNameChange.bind(this);
        this.handleOrchestraMemberDeleteButtonClick = this.handleOrchestraMemberDeleteButtonClick.bind(this);
        this.handleOrchestraRoleNameChange = this.handleOrchestraRoleNameChange.bind(this);
        this.handleOrchestraRoleDeleteButtonClick = this.handleOrchestraRoleDeleteButtonClick.bind(this);
        this.handleOrchestraRoleBillingChange = this.handleOrchestraRoleBillingChange.bind(this);
        this.handleAddOrchestraRoleButtonClick = this.handleAddOrchestraRoleButtonClick.bind(this);
        this.handleOrchestraChange = this.handleOrchestraChange.bind(this);
        this.handleAddRoleToOrchestraRowButtonClick = this.handleAddRoleToOrchestraRowButtonClick.bind(this);
        this.handleOrchestraRowDeleteButtonClick = this.handleOrchestraRowDeleteButtonClick.bind(this);
        this.handleAddOrchestraRowToSlideButtonClick = this.handleAddOrchestraRowToSlideButtonClick.bind(this);
        this.handleSetFontStyleClipboard = this.handleSetFontStyleClipboard.bind(this);
        this.handleFontStyleClipboardSnackbarClose = this.handleFontStyleClipboardSnackbarClose.bind(this);
        this.handleConductorFontStyleChange = this.handleConductorFontStyleChange.bind(this);
        this.handleAssociateFontStyleChange = this.handleAssociateFontStyleChange.bind(this);
        this.handleMusicianFontStyleChange = this.handleMusicianFontStyleChange.bind(this);
        this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
        this.openLocalShowfile = this.openLocalShowfile.bind(this);
        this.openRemoteShowfile = this.openRemoteShowfile.bind(this);
        this.handleOpenButtonClick = this.handleOpenButtonClick.bind(this);
        this.handleReorderSlideButtonClick = this.handleReorderSlideButtonClick.bind(this);
        this.handleHoldTimeChange = this.handleHoldTimeChange.bind(this);
        this.handleTogglePresentationMode = this.handleTogglePresentationMode.bind(this);
        this.packageStateForRemote = this.packageStateForRemote.bind(this);
        this.setRemoteServerStatusSnackbar = this.setRemoteServerStatusSnackbar.bind(this);
        this.handleRemoteServerStatusSnackbarClose = this.handleRemoteServerStatusSnackbarClose.bind(this);
        this.handleEditListItemButtonClick= this.handleEditListItemButtonClick.bind(this);
        this.handleListItemInputClose = this.handleListItemInputClose.bind(this);
        this.handleAttachFontButtonClick = this.handleAttachFontButtonClick.bind(this);
        this.postGeneralSnackbar = this.postGeneralSnackbar.bind(this);
        this.enterPresentationMode = this.enterPresentationMode.bind(this);
        this.leavePresentationMode = this.leavePresentationMode.bind(this);
        this.playNextSlide = this.playNextSlide.bind(this);
        this.handleNewShowButtonClick = this.handleNewShowButtonClick.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    componentDidMount() {
        log.info("AppContainer Mounted");

        /*
            GLOBAL ERROR HANDLERS
        */
        window.addEventListener('unhandledrejection', (error) => {
            log.error(error.reason);
        })

        window.addEventListener('error', (e) => {
            log.error(e.error.message);
            log.error(e.error.stack);
        })


        /*
            PULL DOWN DATABASE
        */
        // Pull down ShowfileInfo
        log.info("Pulling down showfileInfo");
        mainDB.showfileInfo.get(showfileInfoId).then( result => {
            if (result !== undefined) {
                this.setState({ showfileInfo: result });
                log.info("Loaded " + result.name);
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull Down Fonts.
        log.info("Pulling down fonts");
        mainDB.fonts.toArray().then(result => {
            if (result.length > 0) {
                let fonts = [];
                result.forEach( font => {
                    fonts.push(font);
                    this.importFontAsync(font).then( () => {

                    }).catch( error => {
                        this.postGeneralSnackbar('error', `Failed to load ${font.familyName}`);
                        log.error(`Failed to load ${font.familyName}. Reason: ${error}`);
                    })
                })
                this.setState({ fonts: fonts });
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull Down Presets.
        log.info("Pulling down presets");
        mainDB.presets.toArray().then( result => {
            if (result.length > 0) {
                let presets = [];
                result.forEach( item => {
                    presets.push( item );
                })
                this.setState({presets: presets});
            }
        }).catch(error => {
            log.error(error);
        })


        // Pull Down Cast Members.
        log.info("Pulling down Cast members");
        mainDB.castMembers.orderBy('name').toArray().then(result => {
            if (result.length > 0) {
                let castMembers = [];
                result.forEach( item => {
                    castMembers.push( item );
                })

                this.setState({castMembers: castMembers });
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull Down Roles.
        log.info("Pulling down roles");
        mainDB.roles.orderBy('billing').toArray().then(result => {
            if(result.length > 0) {
                let roles = [];
                result.forEach( item => {
                    roles.push( item );
                })

                this.setState({roles: roles});
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull down CastChange.
        log.info("Pulling down castChangeMap");
        mainDB.castChangeMap.get(castChangeId).then(result => {
            if (result !== undefined) {
                this.setState({ castChangeMap: result });
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull down OrchestraChange.
        log.info("Pulling down orchestraChangeMap");
        mainDB.orchestraChangeMap.get(orchestraChangeId).then(result => {
            if (result !== undefined) {
                this.setState({ orchestraChangeMap: result });
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull Down Slides
        log.info("Pulling down slides");
        mainDB.slides.orderBy("number").toArray().then(result => {
            if (result.length > 0) {

                let slides = [];
                result.forEach( item => {
                    slides.push( item );
                })

                this.setState({slides: slides});
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull Down Orchestra Members
        log.info("Pulling down orchestraMembers");
        mainDB.orchestraMembers.orderBy('name').toArray().then(result => {
            if (result.length > 0) {
                let orchestraMembers = [];
                result.forEach(item => {
                    orchestraMembers.push(item);
                })

                this.setState({ orchestraMembers: orchestraMembers });
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull Down Orchestra Roles.
        log.info("Pulling down orchestraRoles");
        mainDB.orchestraRoles.orderBy('billing').toArray().then(result => {
            if (result.length > 0) {
                let orchestraRoles = [];
                result.forEach(item => {
                    orchestraRoles.push(item);
                })

                this.setState({ orchestraRoles: orchestraRoles });
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull Down Theme
        log.info("Pulling down theme");
        mainDB.theme.get(themeId).then( result => {
            if (result !== undefined) {
                this.setState({ theme: result });
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull Down Cast Groups
        log.info("Pulling down castGroups");
        mainDB.castGroups.toArray().then( result => {
            if (result.length > 0) {
                let castGroups = [];
                result.forEach( item => {
                    castGroups.push( item );
                })

                this.setState({castGroups: castGroups});
            }
        }).catch(error => {
            log.error(error);
        })

        // Pull down Role Groups.
        log.info("Pulling down roleGroups");
        mainDB.roleGroups.toArray().then( result => {
            if (result.length > 0) {
                let roleGroups = [];
                result.forEach( item => {
                    roleGroups.push( item );
                })

                this.setState({roleGroups: roleGroups});
            }
        }).catch(error => {
            log.error(error);
        })

        /*
            MAIN PROCESS EVENTS
        */
        log.info("Registering Main process events");
        ipcRenderer.on('get-data', () => {
            ipcRenderer.send('receive-data', this.packageStateForRemote());
            this.setRemoteServerStatusSnackbar("Cast/Orchestra change sent to remote device");
        })

        ipcRenderer.on('receive-data', (event, data) => {
            this.setState({
                castChangeMap: data.castChangeMap,
                orchestraChangeMap: data.orchestraChangeMap,
                presets: data.presets,
            })

            mainDB.castChangeMap.update(castChangeId, data.castChangeMap)
            mainDB.orchestraChangeMap.update(orchestraChangeId, data.orchestraChangeMap);

            mainDB.presets.clear().then( () => {
                mainDB.presets.bulkPut(data.presets);
            }).catch( error => {
                log.error(error);
            })

            this.setRemoteServerStatusSnackbar("New Cast/Orchestra change received");
        })

        ipcRenderer.on('receive-show-file', (event, showfile) => {
            this.openRemoteShowfile(showfile.data);

            this.postGeneralSnackbar("info", "New Showfile Received");
        })

        ipcRenderer.on('playback-action', (event, action) => {
            switch (action) {
                case "play":
                this.setState({ isPlaying: true });
                break;

                case "pause":
                this.setState({ isPlaying: false});
                break;

                case "next": 
                this.setState({
                     selectedSlideId: this.getNextSlideId(this.state.selectedSlideId, this.state.slides)
                    })
                break;

                case "prev":
                this.setState({
                    selectedSlideId: this.getPreviousSlideId(this.state.selectedSlideId, this.state.slides)
                })
                default:
                break;
            }
        })

        // Set Presentation Mode.
        if (os.platform() === 'linux' && this.state.isInPresentationMode === false) {
            // Very likely running on Raspberry Pi. So put us into presentation mode immediately.
            this.enterPresentationMode();
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.isInPresentationMode === true && this.state.theme.holdTime !== nextState.theme.holdTime) {
            // Hold Time has Changed. Reset Interval timer to new hold Time.
            clearInterval(this.presentationInterval);
            this.presentationInterval = setInterval(this.playNextSlide, nextState.theme.holdTime * 1000);
        }
    }

    render() {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <AppContext.Provider value={this.state.appContext}>
                    <App
                        onAddCastMemberButtonClick={this.handleAddCastMemberButtonClick}
                        castMembers={this.state.castMembers}
                        onCastMemberNameChange={this.handleCastMemberNameChange}
                        onRoleBillingChange={this.handleRoleBillingChange}
                        onCastMemberDeleteButtonClick={this.handleCastMemberDeleteButtonClick}
                        onAddRoleButtonClick={this.handleAddRoleButtonClick}
                        roles={this.state.roles}
                        onDeleteRoleButtonClick={this.handleDeleteRoleButtonClick}
                        onRoleNameChange={this.handleRoleNameChange}
                        onAddHeadshotButtonClick={this.handleAddHeadshotButtonClick}
                        onCastChange={this.handleCastChange}
                        castChangeMap={this.state.castChangeMap}
                        onAddSlideButtonClick={this.handleAddSlideButtonClick}
                        slides={this.state.slides}
                        onSlideNameChange={this.handleSlideNameChange}
                        onSlideTypeChange={this.handleSlideTypeChange}
                        onDeleteSlideButtonClick={this.handleDeleteSlideButtonClick}
                        onSlideSelect={this.handleSlideSelect}
                        selectedSlideId={this.state.selectedSlideId}
                        onChooseTitleSlideImageButtonClick={this.handleChooseTitleSlideImageButtonClick}
                        onChooseBackgroundImageButtonClick={this.handleChooseBackgroundImageButtonClick}
                        theme={this.state.theme}
                        onInformationTextChange={this.handleInformationTextChange}
                        onInformationTextFontStyleChange={this.handleInformationTextFontStyleChange}
                        onBaseFontStyleChange={this.handleBaseFontStyleChange}
                        onAddRowToSlideButtonClick={this.handleAddRowToSlideButtonClick}
                        onAddRoleToCastRowButtonClick={this.handleAddRoleToCastRowButtonClick}
                        roleSelectDialog={this.state.roleSelectDialog}
                        onSlideTitleChange={this.handleSlideTitleChange}
                        onSlideTitleFontStyleChange={this.handleSlideTitleFontStyleChange}
                        onCastRowRoleDeleteButtonClick={this.handleCastRowRoleDeleteButtonClick}
                        onCastRowDeleteButtonClick={this.handleCastRowDeleteButtonClick}
                        onCastRowRoleShiftUpButtonClick={this.handleCastRowRoleShiftUpButtonClick}
                        onCastRowRoleShiftDownButtonClick={this.handleCastRowRoleShiftDownButtonClick}
                        onPrincipleFontStyleChange={this.handlePrincipleFontStyleChange}
                        onLeadFontStyleChange={this.handleLeadFontStyleChange}
                        onEnsembleFontStyleChange={this.handleEnsembleFontStyleChange}
                        onHeadshotBorderStrokeWidthChange={this.handleHeadshotBorderStrokeWidthChange}
                        onHeadshotBorderColorChange={this.handleHeadshotBorderColorChange}
                        onAddCastGroupButtonClick={this.handleAddCastGroupButtonClick}
                        castGroups={this.state.castGroups}
                        onAddCastMemberToGroupButtonClick={this.handleAddCastMemberToGroupButtonClick}
                        onCastGroupNameChange={this.handleCastGroupNameChange}
                        onAddRoleGroupButtonClick={this.handleAddRoleGroupButtonClick}
                        roleGroups={this.state.roleGroups}
                        onAddRoleToGroupButtonClick={this.handleAddRoleToGroupButtonClick}
                        onRoleGroupNameChange={this.handleRoleGroupNameChange}
                        onRoleDisplayedNameChange={this.handleRoleDisplayedNameChange}
                        onRoleGroupDeleteButtonClick={this.handleRoleGroupDeleteButtonClick}
                        onCastGroupDeleteButtonClick={this.handleCastGroupDeleteButtonClick}
                        onGroupCastChange={this.handleGroupCastChange}
                        onAddOrchestraMemberButtonClick={this.handleAddOrchestraMemberButtonClick}
                        orchestraMembers={this.state.orchestraMembers}
                        onOrchestraMemberNameChange={this.handleOrchestraMemberNameChange}
                        onOrchestraMemberDeleteButtonClick={this.handleOrchestraMemberDeleteButtonClick}
                        orchestraRoles={this.state.orchestraRoles}
                        onAddOrchestraRoleButtonClick={this.handleAddOrchestraRoleButtonClick}
                        onOrchestraRoleNameChange={this.handleOrchestraRoleNameChange}
                        onOrchestraRoleDeleteButtonClick={this.handleOrchestraRoleDeleteButtonClick}
                        onOrchestraRoleBillingChange={this.handleOrchestraRoleBillingChange}
                        onOrchestraChange={this.handleOrchestraChange}
                        orchestraChangeMap={this.state.orchestraChangeMap}
                        onAddRoleToOrchestraRowButtonClick={this.handleAddRoleToOrchestraRowButtonClick}
                        onOrchestraRowDeleteButtonClick={this.handleOrchestraRowDeleteButtonClick}
                        onAddOrchestraRowToSlideButtonClick={this.handleAddOrchestraRowToSlideButtonClick}
                        onFontStyleClipboardSnackbarClose={this.handleFontStyleClipboardSnackbarClose}
                        isFontStyleClipboardSnackbarOpen={this.state.isFontStyleClipboardSnackbarOpen}
                        onConductorFontStyleChange={this.handleConductorFontStyleChange}
                        onAssociateFontStyleChange={this.handleAssociateFontStyleChange}
                        onMusicianFontStyleChange={this.handleMusicianFontStyleChange}
                        onSaveButtonClick={this.handleSaveButtonClick}
                        onOpenButtonClick={this.handleOpenButtonClick}
                        onReorderSlideButtonClick={this.handleReorderSlideButtonClick} 
                        onHoldTimeChange={this.handleHoldTimeChange}
                        onTogglePresentationMode={this.handleTogglePresentationMode}
                        isInPresentationMode={this.state.isInPresentationMode}
                        onRemoteServerStatusSnackbarClose={this.handleRemoteServerStatusSnackbarClose}
                        remoteServerStatusSnackbar={this.state.remoteServerStatusSnackbar}
                        onEditListItemButtonClick={this.handleEditListItemButtonClick}
                        openInputId={this.state.openInputId}
                        onCastMemberEditInputClose={this.handleCastMemberEditInputClose}
                        onListItemInputClose={this.handleListItemInputClose}
                        onAttachFontButtonClick={this.handleAttachFontButtonClick}
                        fontNameDialog={this.state.fontNameDialog}
                        generalSnackbar={this.state.generalSnackbar}
                        showfileInfo={this.state.showfileInfo}
                        confirmationDialog={this.state.confirmationDialog}
                        onNewShowButtonClick={this.handleNewShowButtonClick}
                        />
                </AppContext.Provider>
            </MuiThemeProvider>
        )
    }

    handleNewShowButtonClick() {
        let onNegative = () => {
            this.setState({
                confirmationDialog: {
                    ...this.state.confirmationDialog,
                    open: false,
                    onAffirmative: null,
                    onNegative: null,
                }
            })
        }

        let onAffirmative = () => {
            this.setState({
                confirmationDialog: {
                    ...this.state.confirmationDialog,
                    open: false,
                    onAffirmative: null,
                    onNegative: null,
                }
            })

            this.wipeDatabase().then( () => {
                this.resetState();

                mainDB.showfileInfo.put(ShowfileInfoFactory(initialShowfileName));
            })   
        }

        this.setState({
            confirmationDialog: {
                open: true,
                title: "Create new Show?",
                message: "Any unsaved changes will be lost, are you sure you want to continue?",
                onAffirmative: onAffirmative,
                onNegative: onNegative,
            }
        })
    }

    handleAttachFontButtonClick() {
        let options = {
            title: "Choose Font File",
            buttonLabel: "Choose",
        }

        dialog.showOpenDialog(options, (filePaths => {
            if (filePaths && filePaths.length > 0) {
                let filePath = filePaths[0];
                
                jetpack.readAsync(filePath, "buffer").then( result => {

                    let handleContinue = (fontName) => {
                        this.setState({ fontNameDialog: { open: false, onContinue: null, onCancel: null } })
                        let fonts = [...this.state.fonts];
                        let newFontObject = FontObjectFactory(this.determineFontType(filePath), fontName, result.toString("base64"));

                        // Add to State.
                        fonts.push(newFontObject);
                        this.setState({ fonts: fonts })

                        // Import to Document
                        this.importFontAsync(newFontObject).then(() => {
                            // Add to Database.
                            mainDB.fonts.add(newFontObject).then(() => {
                                this.postGeneralSnackbar("info", `${newFontObject.familyName} imported successfully.`)
                            }).catch( error => {
                                this.postGeneralSnackbar("error", `Failed to import Font. Reason: ${error}`);
                            })
                        })
                    }

                    let handleCancel = () => {
                        this.setState({ fontNameDialog: { open: false, onContinue: null, onCancel: null }});
                    }

                    // Trigger Font Name Choose Dialog.
                    this.setState({ fontNameDialog: {open: true, onContinue: handleContinue, onCancel: handleCancel}})                    
                })
            }
        }))
    }

    determineFontType(filePath) {
        let fontType = "ttf";
        let loweredFilePath = filePath.toLowerCase();

        if (loweredFilePath.includes(".otf")) { fontType = "otf"};
        if (loweredFilePath.includes(".woff")) { fontType = "woff" };
        if (loweredFilePath.includes(".woff2")) { fontType = "woff2" };

        return fontType;
    }

    handleListItemInputClose(uid, type) {
        this.setState({ openInputId: -1 });
    }

    handleEditListItemButtonClick(uid, type) {
        this.setState({ openInputId: uid });
    }

    handleRemoteServerStatusSnackbarClose() {
        this.setState({
            remoteServerStatusSnackbar: {
                open: false,
                message: this.state.remoteServerStatusSnackbar.message,
            }
        })
    }

    setRemoteServerStatusSnackbar(message) {
        this.setState({
            remoteServerStatusSnackbar: {
                open: true,
                message: message,
            }
        })
    }

    packageStateForRemote() {
        return {
            castMembers: this.stripHeadshots(this.state.castMembers),
            castGroups: [...this.state.castGroups],
            roles: [...this.state.roles],
            roleGroups: [...this.state.roleGroups],
            castChangeMap: {...this.state.castChangeMap},
            orchestraMembers: [...this.state.orchestraMembers],
            orchestraRoles: [...this.state.orchestraRoles],
            orchestraChangeMap: {...this.state.orchestraChangeMap},
            presets: [...this.state.presets],
        }
    }

    stripHeadshots(castMembers) {
        let array = [];
        for (let member of castMembers) {
            let newObject = {};
            for (let propertyName in member) {
                if (propertyName !== "headshot") {
                    newObject[propertyName] = member[propertyName];
                }
            }

            array.push(newObject);
        }

        return array;
    }

    handleTogglePresentationMode() {
        if (this.state.isInPresentationMode === true) {
            // Toggle Out of Presentation Mode.
            this.leavePresentationMode();
        }

        else {
            // Toggle into Presentation Mode.
            if (this.state.slides.length !== 0) {
                this.enterPresentationMode();
            }
        }
    }

    enterPresentationMode() {
        remote.getCurrentWindow().setFullScreen(true);
        this.powerSaveBlockerId = remote.powerSaveBlocker.start("prevent-display-sleep");
        remote.getCurrentWindow().setMenuBarVisibility(false);

        // This function can be called from within ComponentDidMount. state.slides may not be hydrated by the DB yet.
        // So be careful about setting selectedSlideId and choosing the next slide.
        this.setState({
            isInPresentationMode: true,
            isPlaying: true,
            selectedSlideId: this.state.slides[0] !== undefined ? this.state.slides[0].uid : -1,
        })

        this.presentationInterval = setInterval(this.playNextSlide , this.state.theme.holdTime * 1000);
    }

    playNextSlide() {
        if (this.state.isPlaying) {
            this.setState({ selectedSlideId: this.getNextSlideId(this.state.selectedSlideId, this.state.slides) });
        }
    }

    leavePresentationMode() {
        this.setState({ isInPresentationMode: false});
        remote.getCurrentWindow().setFullScreen(false);
        remote.getCurrentWindow().setMenuBarVisibility(true);
        remote.powerSaveBlocker.stop(this.powerSaveBlockerId);
        

        clearInterval(this.presentationInterval);
    }

    getNextSlideId(currentId, slides) {
        if (slides.length === 0) {
            return -1;
        }

        if (currentId === -1) {
            if (slides[0] !== undefined) {
                return slides[0].uid;
            }

            else {
                return -1;
            }
        }

        let slideIndex = slides.findIndex(item => {
            return item.uid === currentId;
        })

        if (slideIndex !== slides.length - 1) {
            return slides[slideIndex + 1].uid;
        }

        else {
            // Wrap around.
            return slides[0].uid;
        }
    }

    getPreviousSlideId(currentId, slides) {
        let slideIndex = slides.findIndex(item => {
            return item.uid === currentId;
        })

        if (slideIndex !== 0) {
            return slides[slideIndex - 1].uid;
        }

        else {
            // Wrap around.
            return slides[slides.length - 1].uid;
        }
    }

    handleHoldTimeChange(newValue) {
        let theme = {...this.state.theme};

        theme.holdTime = newValue;

        this.setState({theme: theme});

        // Update Database
        mainDB.theme.update(themeId, { holdTime: newValue });
    }

    handleReorderSlideButtonClick(slideId, direction) {
        let slides = [...this.state.slides];

        if (slides.length > 0) {
            let slide = slides.find(item => {
                return item.uid === slideId;
            });

            let otherSlideId = "";
            let newSlideNumber;
            let newOtherSlideNumber;
            
            if (direction === "up" && slide.number !== 0) {
                let otherSlide = slides.find(item => {
                    return item.number === slide.number - 1;
                })

                // Swap Slides.
                slide.number--;
                otherSlide.number++;

                // Store Values out of this scope for DB Update Later
                otherSlideId = otherSlide.uid;
                newSlideNumber = slide.number;
                newOtherSlideNumber = otherSlide.number;
            }

            if (direction === "down" && slide.number !== slides.length - 1) {
                let otherSlide = slides.find(item => {
                    return item.number === slide.number + 1;
                })

                // Swap Slides.
                slide.number++;
                otherSlide.number--

                // Store Values out of this scope for DB Update Later
                otherSlideId = otherSlide.uid;
                newSlideNumber = slide.number;
                newOtherSlideNumber = otherSlide.number;
            }
    
            if (otherSlideId !== "") {
                // A change in Order has Occured.
                slides.sort((a,b) => { return a.number - b.number});
                this.setState({slides: slides});

                // Update Database.
                mainDB.slides.update(slideId, {number: newSlideNumber}).then( () => {

                })

                mainDB.slides.update(otherSlideId, {number: newOtherSlideNumber}).then( () => {

                })
            }
        }
    }

    handleOpenButtonClick() {
        let options = {
            title: "Open",
            buttonLabel: "Open",
            filters: [
                { name: 'Javascript Object Notation', extensions: ['json'] },
            ]
        }

        dialog.showOpenDialog(options, (filePaths => {
            if (filePaths && filePaths.length > 0) {
                let filePath = filePaths[0];
                
                jetpack.readAsync(filePath, "json").then( result => {
                    if (result !== undefined) {
                        let showfileName = path.basename(filePath, '.json'); 
                        this.openLocalShowfile(result, showfileName);
                        
                        this.postGeneralSnackbar("info", "Show loaded successfully");
                    }
                })
            }
            
        }))
    }

    handleSaveButtonClick() {
        let options = {
            title: "Save",
            filters: [
                { name: 'Javascript Object Notation', extensions: ['json'] },
            ]
        }

        dialog.showSaveDialog(options, fileName =>  {
            if (fileName !== undefined) {
                let upcomingState = {...this.state};
                let newName = path.basename(fileName, '.json');
                upcomingState.showfileInfo.name = newName;

                jetpack.writeAsync(fileName, this.packageState(upcomingState), {atomic: true}).then( () => {
                    this.setState({showfileInfo: upcomingState.showfileInfo});

                    mainDB.showfileInfo.update(showfileInfoId, {name: newName});

                    this.postGeneralSnackbar("info", `${newName} saved successfully`);
                })
            }
        });
    }
    
    packageState(state) {
        return {
            version: "1",
            showfileInfo: state.showfileInfo,
            castMembers: state.castMembers,
            castGroups: state.castGroups,
            roles: state.roles,
            roleGroups: state.roleGroups,
            castChangeMap: state.castChangeMap,
            orchestraChangeMap: state.orchestraChangeMap,
            slides: state.slides,
            orchestraMembers: state.orchestraMembers,
            orchestraRoles: state.orchestraRoles,
            theme: state.theme,
            fonts: state.fonts,
            presets: state.presets,
        }
    }

    resetState() {
        this.setState(this.initialState);
    }

    wipeDatabase() {
        return new Promise((resolve, reject) => {
            let deleteRequests = [];

            deleteRequests.push(mainDB.castMembers.clear());
            deleteRequests.push(mainDB.castGroups.clear());
            deleteRequests.push(mainDB.roles.clear());
            deleteRequests.push(mainDB.roleGroups.clear());
            deleteRequests.push(mainDB.castChangeMap.clear());
            deleteRequests.push(mainDB.orchestraChangeMap.clear());
            deleteRequests.push(mainDB.slides.clear());
            deleteRequests.push(mainDB.theme.clear());
            deleteRequests.push(mainDB.orchestraMembers.clear());
            deleteRequests.push(mainDB.orchestraRoles.clear());
            deleteRequests.push(mainDB.fonts.clear());
            deleteRequests.push(mainDB.showfileInfo.clear());
            deleteRequests.push(mainDB.presets.clear());

            Promise.all(deleteRequests).then( () => { 
                resolve();
            }).catch(error => {
                reject(error);
            })
        })
    }

    openLocalShowfile(state, showFileName) {
        this.wipeDatabase().then(() => {
            let bulkPutRequests = [];
            let newShowfileInfo = ShowfileInfoFactory(showFileName);

            bulkPutRequests.push(mainDB.castMembers.bulkPut(state.castMembers));
            bulkPutRequests.push(mainDB.castGroups.bulkPut(state.castGroups));
            bulkPutRequests.push(mainDB.roles.bulkPut(state.roles));
            bulkPutRequests.push(mainDB.roleGroups.bulkPut(state.roleGroups));
            bulkPutRequests.push(mainDB.castChangeMap.bulkPut([state.castChangeMap]));
            bulkPutRequests.push(mainDB.orchestraChangeMap.bulkPut([state.orchestraChangeMap]));
            bulkPutRequests.push(mainDB.slides.bulkPut(state.slides));
            bulkPutRequests.push(mainDB.theme.bulkPut([state.theme]));
            bulkPutRequests.push(mainDB.orchestraMembers.bulkPut(state.orchestraMembers));
            bulkPutRequests.push(mainDB.orchestraRoles.bulkPut(state.orchestraRoles));
            bulkPutRequests.push(mainDB.fonts.bulkPut(state.fonts));
            bulkPutRequests.push(mainDB.showfileInfo.bulkPut([newShowfileInfo]));
            bulkPutRequests.push(mainDB.presets.bulkPut(state.presets));

            Promise.all(bulkPutRequests).then( () => {
                this.setState({
                    showfileInfo: newShowfileInfo,
                    castMembers: state.castMembers,
                    castGroups: state.castGroups,
                    roles: state.roles,
                    roleGroups: state.roleGroups,
                    castChangeMap: state.castChangeMap,
                    orchestraChangeMap: state.orchestraChangeMap,
                    slides: state.slides,
                    orchestraMembers: state.orchestraMembers,
                    orchestraRoles: state.orchestraRoles,
                    theme: state.theme,
                    fonts: state.fonts,
                    presets: state.presets,
                });

            }).catch( error => {
                console.error(error);
            })
        })
    }

    openRemoteShowfile(state) {
        let mergeWithPresets = state.showfileInfo.showfileId === this.state.showfileInfo.showfileId;

        this.wipeDatabase().then(() => {
            let bulkPutRequests = [];

            bulkPutRequests.push(mainDB.castMembers.bulkPut(state.castMembers));
            bulkPutRequests.push(mainDB.castGroups.bulkPut(state.castGroups));
            bulkPutRequests.push(mainDB.roles.bulkPut(state.roles));
            bulkPutRequests.push(mainDB.roleGroups.bulkPut(state.roleGroups));
            bulkPutRequests.push(mainDB.castChangeMap.bulkPut([state.castChangeMap]));
            bulkPutRequests.push(mainDB.orchestraChangeMap.bulkPut([state.orchestraChangeMap]));
            bulkPutRequests.push(mainDB.slides.bulkPut(state.slides));
            bulkPutRequests.push(mainDB.theme.bulkPut([state.theme]));
            bulkPutRequests.push(mainDB.orchestraMembers.bulkPut(state.orchestraMembers));
            bulkPutRequests.push(mainDB.orchestraRoles.bulkPut(state.orchestraRoles));
            bulkPutRequests.push(mainDB.fonts.bulkPut(state.fonts));
            bulkPutRequests.push(mainDB.showfileInfo.bulkPut([state.showfileInfo]));

            let newPresets = [];

            if (mergeWithPresets === false) {
                bulkPutRequests.push(mainDB.presets.bulkPut(state.presets));
                newPresets = state.presets;

                log.info("Remote showfileId did not match currently loaded showfileId. Overwriting Presets");
            }
            
            else {
                let incomingPresets = [...state.presets];
                let existingPresets = [...this.state.presets];

                incomingPresets.forEach( preset => {
                    let existingIndex = existingPresets.findIndex( item => { return item.uid === preset.uid });
                    
                    if (existingIndex !== -1) {
                        // Newer preset found.
                        existingPresets[existingIndex] = preset;
                    }

                    else {
                        existingPresets.push(preset);
                    }
                })

                newPresets = existingPresets;
                
                log.info("Remote showfileId matches currently loaded showfileId. Merging presets");
            }

            Promise.all(bulkPutRequests).then( () => {
                this.setState({
                    showfileInfo: state.showfileInfo,
                    castMembers: state.castMembers,
                    castGroups: state.castGroups,
                    roles: state.roles,
                    roleGroups: state.roleGroups,
                    castChangeMap: state.castChangeMap,
                    orchestraChangeMap: state.orchestraChangeMap,
                    slides: state.slides,
                    orchestraMembers: state.orchestraMembers,
                    orchestraRoles: state.orchestraRoles,
                    theme: state.theme,
                    fonts: state.fonts,
                    presets: newPresets,
                });

                log.info("Showfile received from Remote");

            }).catch( error => {
                console.error(error);
            })
        })
    }

    handleConductorFontStyleChange(newFontStyle, controlName) {
        let theme = {...this.state.theme};

        let propertyName = "";
        if (controlName === "name") {
            propertyName = "conductorNameFontStyle";
        }

        else {
            propertyName = "conductorRoleFontStyle";
        }
        
        theme[propertyName] = newFontStyle;

        this.setState({theme: theme});

        let updateObject = {};
        updateObject[propertyName] = newFontStyle;
        mainDB.theme.update(themeId, updateObject).then( () => {

        })
    }

    handleAssociateFontStyleChange(newFontStyle, controlName) {
        let theme = {...this.state.theme};

        let propertyName = "";
        if (controlName === "name") {
            propertyName = "associateNameFontStyle";
        }

        else {
            propertyName = "associateRoleFontStyle";
        }
        
        theme[propertyName] = newFontStyle;

        this.setState({theme: theme});

        let updateObject = {};
        updateObject[propertyName] = newFontStyle;
        mainDB.theme.update(themeId, updateObject).then( () => {

        })
    }

    handleMusicianFontStyleChange(newFontStyle, controlName) {
        let theme = {...this.state.theme};

        let propertyName = "";
        if (controlName === "name") {
            propertyName = "musicianNameFontStyle";
        }

        else {
            propertyName = "musicianRoleFontStyle";
        }
        
        theme[propertyName] = newFontStyle;

        this.setState({theme: theme});

        let updateObject = {};
        updateObject[propertyName] = newFontStyle;
        mainDB.theme.update(themeId, updateObject).then( () => {

        })
    }

    handleFontStyleClipboardSnackbarClose() {
        this.setState({isFontStyleClipboardSnackbarOpen: false});
    }

    handleSetFontStyleClipboard(newValue) {
        let appContext = {...this.state.appContext};
        appContext.fontStyleClipboard = newValue;

        this.setState({
            appContext: appContext,
            isFontStyleClipboardSnackbarOpen: true,
        });
    }

    handleAddOrchestraRowToSlideButtonClick(uid) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === uid;
        })

        let newOrchestraRow = OrchestraRowFactory(slide.orchestraRows.length + 1);

        slide.orchestraRows.push(newOrchestraRow);

        this.setState({ slides: slides });

        // Update Database
        mainDB.slides.update(uid, { orchestraRows: slide.orchestraRows }).then( () => {

        })
    }

    handleOrchestraRowDeleteButtonClick(slideId, rowId) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === slideId;
        })

        let orchestraRowIndex = slide.orchestraRows.findIndex(item => {
            return item.uid === rowId;
        })

        if (orchestraRowIndex !== -1) {
            slide.orchestraRows.splice(orchestraRowIndex, 1);

            this.setState({slides: slides});

            // Update Database.
            mainDB.slides.update(slideId, { orchestraRows: slide.castRows }).then( () => {

            });
        }
    }

    handleAddRoleToOrchestraRowButtonClick(slideId, rowId) {
        let slides = [...this.state.slides];
        let currentSlide = slides.find(item => {
            return item.uid === slideId;
        })

        let orchestraRow = currentSlide.orchestraRows.find( item => {
            return item.uid === rowId;
        })

        let onChoose = (roleId) => {
            this.setState({roleSelectDialog: { open: false, onChoose: null, onCancel: null }});

            orchestraRow.roleIds.push(roleId);

            this.setState({slides: slides});

            // Update Database
            mainDB.slides.update(slideId, { orchestraRows: currentSlide.orchestraRows }).then(() => {

            })
            
        }

        let onCancel = () => {
            this.setState({roleSelectDialog: { open: false, onChoose: null, onCancel: null }});
        }

        // Trigger Role Select Dialog.
        this.setState({roleSelectDialog: { open: true, roles: this.state.orchestraRoles, onChoose: onChoose, onCancel: onCancel}});
    }

    handleOrchestraChange(orchestraRoleId, orchestraMemberId) {
        let orchestraChangeMap = { ...this.state.orchestraChangeMap };

        orchestraChangeMap[orchestraRoleId] = orchestraMemberId;

        this.setState({ orchestraChangeMap: orchestraChangeMap });

        // Add to Database.
        mainDB.orchestraChangeMap.put(orchestraChangeMap).then(result => {

        })
    }

    handleOrchestraRoleBillingChange(uid, newValue) {
        let orchestraRoles = [...this.state.orchestraRoles];
        let orchestraRole = orchestraRoles.find(item => {
            return item.uid === uid;
        })

        orchestraRole.billing = newValue;

        this.setState({orchestraRoles: orchestraRoles});

        // Update DB
        mainDB.orchestraRoles.update(uid, { billing: newValue }).then( result => {

        })
    }

    handleOrchestraRoleNameChange(uid, newValue) {
        let orchestraRoles = [...this.state.orchestraRoles];
        let orchestraMember = orchestraRoles.find(item => {
            return item.uid === uid;
        })

        orchestraMember.name = newValue;

        this.setState({orchestraRoles: orchestraRoles});

        // Update DB.
        mainDB.orchestraRoles.update(uid, { name: newValue }).then( result => {

        })
    }

    handleOrchestraRoleDeleteButtonClick(uid) {
        let orchestraRoles = [...this.state.orchestraRoles];
        let orchestraMemberIndex = orchestraRoles.findIndex(item => {
            return item.uid === uid;
        });

        if (orchestraMemberIndex !== -1) {
            orchestraRoles.splice(orchestraMemberIndex, 1);

            this.setState({orchestraRoles: orchestraRoles});

            // Update DB.
            mainDB.orchestraRoles.delete(uid).then( result => {

            })
        }
    }

    handleAddOrchestraRoleButtonClick() {
        let orchestraRoles = [...this.state.orchestraRoles];
        let newOrchestraRole = OrchestraRoleFactory();

        orchestraRoles.push(newOrchestraRole);

        this.setState({
            orchestraRoles: orchestraRoles,
            openInputId: newOrchestraRole.uid,
        });

        // Handle Database.
        mainDB.orchestraRoles.add(newOrchestraRole).then( () => {

        })
    }

    handleOrchestraMemberDeleteButtonClick(uid) {
        let orchestraMembers = [...this.state.orchestraMembers];
        let orchestraMemberIndex = orchestraMembers.findIndex(item => {
            return item.uid === uid;
        });

        if (orchestraMemberIndex !== -1) {
            orchestraMembers.splice(orchestraMemberIndex, 1);

            this.setState({orchestraMembers: orchestraMembers});

            // Update DB.
            mainDB.orchestraMembers.delete(uid).then( result => {

            })
        }
    }   

    handleOrchestraMemberNameChange(uid, newValue) {
        let orchestraMembers = [...this.state.orchestraMembers];
        let orchestraMember = orchestraMembers.find(item => {
            return item.uid === uid;
        })

        orchestraMember.name = newValue;

        this.setState({orchestraMembers: orchestraMembers});

        // Update DB.
        mainDB.orchestraMembers.update(uid, { name: newValue }).then( result => {

        })
    }

    handleAddOrchestraMemberButtonClick() {
        let orchestraMembers = [...this.state.orchestraMembers];
        let newOrchestraMember = OrchestraMemberFactory();

        orchestraMembers.push(newOrchestraMember);

        this.setState({ orchestraMembers: orchestraMembers });

        // Add to Database.
        mainDB.orchestraMembers.add(newOrchestraMember).then(() => {

        });
        
    }

    handleCastGroupDeleteButtonClick(groupId) {
        let castGroups = [...this.state.castGroups];
        let castGroupIndex = castGroups.findIndex(item => {
            return item.uid === groupId;
        });

        // Extract Cast Members belonging to this group.
        let castMembers = [...this.state.castMembers];
        let childCast = castMembers.filter(item => {
            return item.groupId === groupId;
        })

        if (castGroupIndex !== -1) {
            castGroups.splice(castGroupIndex, 1);

            // Set the roles once belonging to this group to Individual.
            childCast.forEach( childRole => {
                childRole.groupId = "-1";
            })

            this.setState({
                castGroups: castGroups,
                castMembers: castMembers,
            })

            // Update Database.
            mainDB.castGroups.delete(groupId).then(() => {

            })

            mainDB.castMembers.where("groupId").equals(groupId).modify({ groupId: "-1"}).then(() => {

            }).catch( error => {
                console.log(error);
            })
        }
    }

    handleRoleGroupDeleteButtonClick(groupId) {
        let roleGroups = [...this.state.roleGroups];
        let roleGroupIndex = roleGroups.findIndex(item => {
            return item.uid === groupId;
        });

        // Extract Roles belonging to this group.
        let roles = [...this.state.roles];
        let childRoles = roles.filter(item => {
            return item.groupId === groupId;
        })

        if (roleGroupIndex !== -1) {
            roleGroups.splice(roleGroupIndex, 1);

            // Set the roles once belonging to this group to Individual.
            childRoles.forEach( childRole => {
                childRole.groupId = "-1";
            })

            this.setState({
                roleGroups: roleGroups,
                roles: roles,
            })

            // Update Database.
            mainDB.roleGroups.delete(groupId).then(() => {

            })

            mainDB.roles.where("groupId").equals(groupId).modify({ groupId: "-1"}).then(() => {

            }).catch( error => {
                console.log(error);
            })
        }
    }

    handleRoleDisplayedNameChange(roleId, newValue) {
        let roles = [...this.state.roles];
        let role = roles.find(item => {
            return item.uid === roleId;
        })

        role.displayedName = newValue;

        this.setState({ roles: roles });

        // Update DB
        mainDB.roles.update(roleId, { displayedName: newValue }).then( result => {

        })
    }

    handleRoleGroupNameChange(groupId, newValue) {
        let roleGroups = [...this.state.roleGroups];
        let roleGroup = roleGroups.find(item => {
            return item.uid === groupId;
        })

        roleGroup.name = newValue;

        this.setState({ roleGroups: roleGroups });

        // Add to Database.
        mainDB.roleGroups.update(groupId, { name: newValue }).then(() => {

        });
    }

    handleAddRoleToGroupButtonClick(groupId) {
        let roles = [...this.state.roles];
        let newRole = RoleFactory("", groupId);

        roles.push(newRole);

        this.setState({
            roles: roles,
            openInputId: newRole.uid
         });

        // Add to DB
        mainDB.roles.add(newRole).then( () => {

        })
    }

    handleAddRoleGroupButtonClick() {
        let roleGroups = [...this.state.roleGroups];
        let newRoleGroup = RoleGroupFactory();

        roleGroups.push(newRoleGroup);

        this.setState({roleGroups: roleGroups});

        mainDB.roleGroups.add(newRoleGroup).then( () => {

        })
    }

    handleCastGroupNameChange(groupId, newValue) {
        let castGroups = [...this.state.castGroups];
        let castGroup = castGroups.find(item => {
            return item.uid === groupId;
        })

        castGroup.name = newValue;

        this.setState({castGroups: castGroups});

        // Add to Database.
        mainDB.castGroups.update(groupId, {name: newValue}).then( () => {

        }); 
    }

    handleAddCastMemberToGroupButtonClick(groupId) {
        let castMembers = [...this.state.castMembers];
        let newCastMember = CastMemberFactory("", groupId);
        castMembers.push(newCastMember);

        this.setState({
            castMembers: castMembers,
            openInputId: newCastMember.uid
        });

        // Add to DB
        mainDB.castMembers.add(newCastMember);
    }

    handleAddCastGroupButtonClick() {
        let castGroups = [...this.state.castGroups];
        let newCastGroup = CastGroupFactory();

        castGroups.push(newCastGroup);

        this.setState({castGroups: castGroups});

        // Add to Database.
        mainDB.castGroups.add(newCastGroup).then( () => {

        }); 
    }

    handleHeadshotBorderColorChange(newValue) {
        let theme = {...this.state.theme};

        theme.headshotBorderColor = newValue;

        this.setState({theme: theme});

        mainDB.theme.update(themeId, { headshotBorderColor: newValue }).then( () => {

        })
    }

    handleHeadshotBorderStrokeWidthChange(newValue) {
        let theme = {...this.state.theme};

        theme.headshotBorderStrokeWidth = newValue;

        this.setState({theme: theme});

        mainDB.theme.update(themeId, { headshotBorderStrokeWidth: newValue }).then( () => {

        })
    }

    handlePrincipleFontStyleChange(newValue, controlName) {
        let theme = {...this.state.theme};

        let propertyName = "";
        if (controlName === "actor") {
            propertyName = "principleActorFontStyle";
        }

        else {
            propertyName = "principleRoleFontStyle";
        }
        
        theme[propertyName] = newValue;

        this.setState({theme: theme});

        let updateObject = {};
        updateObject[propertyName] = newValue;
        mainDB.theme.update(themeId, updateObject).then( () => {

        })
    }

    handleLeadFontStyleChange(newValue, controlName) {
        let theme = {...this.state.theme};

        let propertyName = "";
        if (controlName === "actor") {
            propertyName = "leadActorFontStyle";
        }

        else {
            propertyName = "leadRoleFontStyle";
        }
        
        theme[propertyName] = newValue;

        this.setState({theme: theme});

        let updateObject = {};
        updateObject[propertyName] = newValue;
        mainDB.theme.update(themeId, updateObject).then( () => {

        })
    }

    handleEnsembleFontStyleChange(newValue, controlName) {
        let theme = {...this.state.theme};

        let propertyName = "";
        if (controlName === "actor") {
            propertyName = "ensembleActorFontStyle";
        }

        else {
            propertyName = "ensembleRoleFontStyle";
        }
        
        theme[propertyName] = newValue;

        this.setState({theme: theme});

        let updateObject = {};
        updateObject[propertyName] = newValue;
        mainDB.theme.update(themeId, updateObject).then( () => {

        })
    }

    handleCastRowRoleShiftDownButtonClick(slideId, castRowId, roleId) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === slideId;
        })

        let castRow = slide.castRows.find(item => {
            return item.uid === castRowId;
        })

        let roleIndex = castRow.roleIds.findIndex(item => {
            return item === roleId;
        })

        if (roleIndex !== -1) {
            castRow.roleIds = TryShiftItemBackward(roleIndex, castRow.roleIds);

            this.setState({ slides: slides});

            // Update Database.
            mainDB.slides.update(slideId, { castRows: slide.castRows }).then( () => {

            });
        }
    }

    handleCastRowRoleShiftUpButtonClick(slideId, castRowId, roleId) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === slideId;
        })

        let castRow = slide.castRows.find(item => {
            return item.uid === castRowId;
        })

        let roleIndex = castRow.roleIds.findIndex(item => {
            return item === roleId;
        })

        if (roleIndex !== -1) {
            castRow.roleIds = TryShiftItemForward(roleIndex, castRow.rolesIds);

            this.setState({ slides: slides});

            // Update Database.
            mainDB.slides.update(slideId, { castRows: slide.castRows }).then( () => {

            });
        }
    }

    handleCastRowDeleteButtonClick(slideId, rowId) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === slideId;
        })

        let castRowIndex = slide.castRows.findIndex(item => {
            return item.uid === rowId;
        })

        if (castRowIndex !== -1) {
            slide.castRows.splice(castRowIndex, 1);

            this.setState({slides: slides});

            // Update Database.
            mainDB.slides.update(slideId, { castRows: slide.castRows }).then( () => {

            });
        }
    }

    handleCastRowRoleDeleteButtonClick(slideId, castRowId, roleId) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === slideId;
        })

        let castRow = slide.castRows.find(item => {
            return item.uid === castRowId;
        })

        let roleIndex = castRow.roleIds.findIndex(item => {
            return item === roleId;
        })

        if (roleIndex !== -1) {
            castRow.roleIds.splice(roleIndex, 1);
            this.setState({ slides: slides });

            // Update Database.
            mainDB.slides.update(slideId, { castRows: slide.castRows }).then(() => {

            });
        }
    }

    handleSlideTitleChange(uid, newValue) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === uid;
        })

        slide.title = newValue;

        this.setState({ slides: slides });

        // Update Database
        mainDB.slides.update(uid, { title: newValue }).then( () => {

        })
    }

    handleSlideTitleFontStyleChange(uid, newValue) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === uid;
        })

        slide.titleFontStyle = newValue;

        this.setState({ slides: slides });

        // Update Database
        mainDB.slides.update(uid, { titleFontStyle: newValue }).then( () => {

        })
    }

    handleAddRoleToCastRowButtonClick(slideId, rowId) {
        let slides = [...this.state.slides];
        let currentSlide = slides.find(item => {
            return item.uid === slideId;
        })

        let castRow = currentSlide.castRows.find( item => {
            return item.uid === rowId;
        })

        let onChoose = (roleId) => {
            this.setState({roleSelectDialog: { open: false, onChoose: null, onCancel: null }});

            castRow.roleIds.push(roleId);

            this.setState({slides: slides});

            // Update Database
            mainDB.slides.update(slideId, { castRows: currentSlide.castRows }).then(() => {

            })
            
        }

        let onCancel = () => {
            this.setState({roleSelectDialog: { open: false, onChoose: null, onCancel: null }});
        }

        // Trigger Role Select Dialog.
        this.setState({roleSelectDialog: { open: true, roles: this.state.roles, onChoose: onChoose, onCancel: onCancel}});
        
    }

    handleAddRowToSlideButtonClick(uid) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === uid;
        })

        let newCastRow = CastRowFactory(slide.castRows.length + 1);

        slide.castRows.push(newCastRow);

        this.setState({ slides: slides });

        // Update Database
        mainDB.slides.update(uid, { castRows: slide.castRows }).then( () => {

        })
    }

    handleBaseFontStyleChange(newValue) {
        let theme = {...this.state.theme};
        theme.baseFontStyle = newValue;

        this.setState({theme: theme});

        mainDB.theme.update(themeId, { baseFontStyle: newValue }).then( () => {

        })
    }

    handleInformationTextFontStyleChange(uid, newValue) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === uid;
        })

        slide.informationTextFontStyle = newValue;

        this.setState({ slides: slides });

        // Update Database
        mainDB.slides.update(uid, { informationTextFontStyle: newValue }).then( () => {

        })
    }

    handleInformationTextChange(uid, newValue) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === uid;
        })

        slide.informationText = newValue;

        this.setState({ slides: slides });

        // Update Database
        mainDB.slides.update(uid, { informationText: newValue }).then( () => {

        })
    }

    handleChooseBackgroundImageButtonClick() {
        let options = {
            title: "Choose Background Image",
            buttonLabel: "Choose",
        }

        dialog.showOpenDialog(options, (filePaths => {
            if (filePaths && filePaths.length > 0) {
                let filePath = filePaths[0];
                
                jetpack.readAsync(filePath, "buffer").then( result => {
                    let base64BackgroundImage = result.toString('base64');
                    mainDB.theme.update(themeId, { backgroundImage: base64BackgroundImage }).then( dbUpdateResult => {

                    })

                    // Update State.
                    let theme = {...this.state.theme};
                    theme.backgroundImage = base64BackgroundImage;

                    this.setState({ theme: theme});
                })
            }
            
        }))
    }

    handleChooseTitleSlideImageButtonClick() {
        let slideId = this.state.selectedSlideId;

        let options = {
            title: "Choose Title Image",
            buttonLabel: "Choose",
        }

        dialog.showOpenDialog(options, (filePaths => {
            if (filePaths && filePaths.length > 0) {
                let filePath = filePaths[0];
                
                jetpack.readAsync(filePath, "buffer").then( result => {
                    let base64TitleImage = result.toString('base64');
                    mainDB.slides.update(slideId, { titleImage: base64TitleImage }).then( dbUpdateResult => {

                    })

                    // Update State.
                    let slides = [...this.state.slides];
                    let slide = slides.find(item => {
                        return item.uid === slideId;
                    })

                    slide.titleImage = base64TitleImage;

                    this.setState({ slides: slides });
                    
                })
            }
            
        }))
    }

    handleSlideSelect(uid) {
        this.setState({ selectedSlideId: uid });
    }

    handleDeleteSlideButtonClick(uid) {
        let slides = [...this.state.slides];
        let slideIndex = slides.findIndex(item => {
            return item.uid === uid;
        })

        if (slideIndex !== -1) {
            slides.splice(slideIndex, 1);
            
            // Repair slide.numbers.
            let numberUpdates = [];
            slides.forEach( (item, index) => {
                item.number = index;

                // Build an update object ready to Bulk Update the DB.
                numberUpdates.push({ uid: item.uid, number: index })
            })

            this.setState({ 
                slides: slides,
                selectedSlideId: -1,
             });

            // Delete from Database
            mainDB.slides.delete(uid).then( () => {
                // Repair Slide Numbers.
                for (let numberUpdate of numberUpdates) {
                    mainDB.slides.update(numberUpdate.uid, {number: numberUpdate.number });
                }
            })
        }
    }

    handleSlideNameChange(uid, newValue) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === uid;
        })

        slide.name = newValue;

        this.setState({ slides: slides });

        // Update Database
        mainDB.slides.update(uid, { name: newValue }).then( () => {

        })
    }

    handleSlideTypeChange(uid, newValue) {
        let slides = [...this.state.slides];
        let slide = slides.find(item => {
            return item.uid === uid;
        })

        slide.type = newValue;

        this.setState({ slides: slides });

        // Update Database
        mainDB.slides.update(uid, { type: newValue }).then( () => {

        })
    }

    handleAddSlideButtonClick() {
        let slides = [...this.state.slides];
        let newSlide = SlideFactory(slides.length);

        slides.push(newSlide);

        this.setState({ slides: slides });

        // Add to Database
        mainDB.slides.add(newSlide).then( () => {

        })
    }

    handleCastChange(roleId, castMemberId) {
        let castChangeMap = {...this.state.castChangeMap};

            castChangeMap[roleId] = CastChangeEntryFactory("individual", castMemberId, "-1");

            this.setState({ castChangeMap: castChangeMap });

            // Add to Database.
            mainDB.castChangeMap.put(castChangeMap).then(result => {

            })
    }

    handleGroupCastChange(roleGroupId, castGroupId) {
        let castMembers = [...this.state.castMembers];
        let castChangeMap = {...this.state.castChangeMap};
        let roles = [...this.state.roles];

        let relatedCastMembers = castMembers.filter( item => {
            return item.groupId === castGroupId;
        })

        let relatedRoles = roles.filter( item => {
            return item.groupId === roleGroupId;
        })

        // Iterate through related Roles and Assign a Cast member from relatedCastMembers if such cast member exists.
        relatedRoles.map( (item, index) => {
            let castMember = relatedCastMembers[index];
            if (castMember !== undefined) {
                castChangeMap[item.uid] = CastChangeEntryFactory("group", castMember.uid, roleGroupId);
            }
        })

        this.setState({ castChangeMap: castChangeMap });

        // Add to Database.
        mainDB.castChangeMap.put(castChangeMap).then(result => {

        })
    }


    handleAddHeadshotButtonClick(uid) {
        let options = {
            title: "Choose Headshot",
            buttonLabel: "Choose",
        }

        dialog.showOpenDialog(options, (filePaths => {
            if (filePaths && filePaths.length > 0) {
                let filePath = filePaths[0];
                
                jetpack.readAsync(filePath, "buffer").then( result => {
                    let base64Headshot = result.toString('base64');

                    CreateThumbnailAsync(base64Headshot).then( thumbnail => {
                        mainDB.castMembers.update(uid, { headshot: base64Headshot, thumbnailUrl: thumbnail }).then( dbUpdateResult => {

                        })
    
                        // Update State.
                        var castMembers = [...this.state.castMembers];
                        var castMember = castMembers.find(item => {
                            return item.uid === uid;
                        })
    
                        castMember.headshot = base64Headshot;
                        castMember.thumbnailUrl = thumbnail;
    
                        this.setState({castMembers: castMembers});
                    })

                    
                })
            }
            
        }))
    }

    handleRoleNameChange(uid, newValue) {
        let roles = [...this.state.roles];
        let role = roles.find((item => {
            return item.uid === uid;
        }));

        role.displayedName = this.guessDisplayedRoleName(newValue);
        role.name = newValue;

        this.setState({ roles: roles });

        // Update DB
        mainDB.roles.update(uid, { name: newValue, displayedName: this.guessDisplayedRoleName(newValue) }).then( result => {

        })
    }

    guessDisplayedRoleName(internalName) {
        if (typeof internalName !== "string") {
            return "";
        }

        if (internalName.toLowerCase().includes("ensemble") === false) {
            return internalName;
        }

        else {
            return "Ensemble";
        }
    }

    handleDeleteRoleButtonClick(uid) {
        let roles = [...this.state.roles];
        let roleIndex = roles.findIndex(item => {
            return item.uid === uid;
        });

        if (roleIndex !== -1) {
            roles.splice(roleIndex, 1);

            this.setState({ roles: roles });

            // Delete from DB
            mainDB.roles.delete(uid).then(result => {

            })
        }
    }

    handleAddRoleButtonClick() {
        let roles = [...this.state.roles];
        let newRole = RoleFactory("", "-1");

        roles.push(newRole);

        this.setState({
            roles: roles,
            openInputId: newRole.uid,
        });

        // Add to DB
        mainDB.roles.add(newRole).then( result => {

        })
    }

    handleCastMemberDeleteButtonClick(uid) {
        let castMembers = [...this.state.castMembers];
        let castMemberIndex = castMembers.findIndex(item => {
            return item.uid === uid;
        });

        if (castMemberIndex !== -1) {
            castMembers.splice(castMemberIndex, 1);

            this.setState({castMembers: castMembers});

            // Update DB.
            mainDB.castMembers.delete(uid).then( result => {

            })
        }
    }

    handleRoleBillingChange(uid, newValue) {
        let roles = [...this.state.roles];
        let role = roles.find(item => {
            return item.uid === uid;
        })

        role.billing = newValue;

        this.setState({roles: roles});

        // Update DB
        mainDB.roles.update(uid, { billing: newValue }).then( result => {

        })
    }

    handleCastMemberNameChange(uid, newValue) {
        let castMembers = [...this.state.castMembers];
        let castMember = castMembers.find(item => {
            return item.uid === uid;
        })

        castMember.name = newValue;

        this.setState({
            castMembers: castMembers,
        });

        // Update DB.
        mainDB.castMembers.update(castMember.uid, { name: newValue }).then( result => {

        })
    }

    handleAddCastMemberButtonClick() {
        let castMembers = [...this.state.castMembers];
        let newCastMember = CastMemberFactory("", "-1");
        castMembers.push(newCastMember);

        this.setState({
            castMembers: castMembers,
            openInputId: newCastMember.uid
         });

        // Add to DB
        mainDB.castMembers.add(newCastMember);
    }

    importFontAsync(fontObject) {
        return new Promise((resolve, reject) => {
            let newFontFace = new FontFace(fontObject.familyName, this.getDataUrl(fontObject));

            newFontFace.load().then(loadedFace => {
                document.fonts.add(loadedFace);
                resolve();
            }).catch( error => {
                reject(error);
            })
        })
    }

    getDataUrl(fontObject) {
        let dataHeader = "";
        let format = "";
        
        switch(fontObject.type) {
            case "woff2":
                dataHeader = 'data:application/font-woff2;charset=utf-8;base64,';
                format = `format('woff2')`;
                break;
            
            case "woff":
                dataHeader = 'data:application/font-woff;charset=utf-8;base64,';
                format = `format('woff)`;
                break;
            
            case "ttf":
                dataHeader = 'data:font/truetype;charset=utf-8;base64,';
                format = `format('truetype')`
                break;

            case "otf":
                dataHeader = 'data:application/x-font-opentype;charset=utf-8;base64,';
                format = `format('opentruetype')`;
                break;
        }

        return `url(${dataHeader}${fontObject.base64})`; // ${format};`;
    }

    postGeneralSnackbar(type, message) {
        let onClose = () => {
            this.setState({ generalSnackbar: { open: false, type: type, message: message, onClose: () => {} }});
        } 

        this.setState({ generalSnackbar: { open: true, type: type, message: message, onClose: onClose}})
    }
}

export default AppContainer;