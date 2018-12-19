import React from 'react';
import App from '../components/App';
import Dexie from 'dexie';
import jetpack from 'fs-jetpack';
import TryShiftItemForward from '../utilties/TryShiftItemForward';
import TryShiftItemBackward from '../utilties/TryShiftItemBackward';
const { dialog } = require('electron').remote;

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PrimaryColor from '@material-ui/core/colors/blue';
import SecondaryColor from '@material-ui/core/colors/deepPurple';

import CastMemberFactory from '../factories/CastMemberFactory';
import RoleFactory from '../factories/RoleFactory';
import SlideFactory from '../factories/SlideFactory';
import ThemeFactory from '../factories/ThemeFactory';
import CastRowFactory from '../factories/CastRowFactory';

const mainDB = new Dexie('castboardMainDB');
mainDB.version(1).stores({
    castMembers: 'uid, name',
    roles: 'uid, name',
    castChangeMap: 'uid',
    slides: 'uid',
    theme: 'uid',
});

mainDB.on('populate', () => {
    mainDB.theme.put(ThemeFactory());
})

const castChangeId = "0";
const themeId = "0";

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
        this.state = {
            currentSlide: 0,
            castMembers: [],
            roles: [],
            castChangeMap: { uid: castChangeId }, // Maps RoleId's to CastMemberId's
            slides: [],
            selectedSlideId: -1,
            theme: ThemeFactory(),
            roleSelectDialog: {
                open: false,
                onChoose: null,
                onCancel: null,
            }
        }

        // Method Bindings.
        this.handleNextSlideButtonClick = this.handleNextSlideButtonClick.bind(this);
        this.handlePrevSlideButtonClick = this.handlePrevSlideButtonClick.bind(this);
        this.handleAddCastMemberButtonClick = this.handleAddCastMemberButtonClick.bind(this);
        this.handleCastMemberNameChange = this.handleCastMemberNameChange.bind(this);
        this.handleCastMemberBillingChange = this.handleCastMemberBillingChange.bind(this);
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
    }

    componentDidMount() {
        // Pull Down Cast Members.
        mainDB.castMembers.toArray( (result) => {
            if (result.length > 0) {
                let castMembers = [];
                result.forEach( item => {
                    castMembers.push( item );
                })

                this.setState({castMembers: castMembers });
            }
        })

        // Pull Down Roles.
        mainDB.roles.toArray( (result) => {
            if(result.length > 0) {
                let roles = [];
                result.forEach( item => {
                    roles.push( item );
                })

                this.setState({roles: roles});
            }
        })

        // Pull down CastChange.
        mainDB.castChangeMap.get(castChangeId).then( result => {
            if (result !== undefined) {
                this.setState({ castChangeMap: result });
            }
        })

        // Pull Down Slides
        mainDB.slides.toArray( (result) => {
            if (result.length > 0) {
                let slides = [];
                result.forEach( item => {
                    slides.push( item );
                })

                this.setState({slides: slides});
            }
        })

        // Pull Down Theme
        mainDB.theme.get(themeId).then( result => {
            if (result !== undefined) {
                this.setState({ theme: result });
            }
        })
    }

    render() {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <App currentSlide={this.state.currentSlide}
                    onNextSlideButtonClick={this.handleNextSlideButtonClick}
                    onPrevSlideButtonClick={this.handlePrevSlideButtonClick}
                    onAddCastMemberButtonClick={this.handleAddCastMemberButtonClick}
                    castMembers={this.state.castMembers}
                    onCastMemberNameChange={this.handleCastMemberNameChange}
                    onCastMemberBillingChange={this.handleCastMemberBillingChange}
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
                    onHeadshotBorderColorChange={this.handleHeadshotBorderColorChange} />
            </MuiThemeProvider>
            
        )
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

        let roleIndex = castRow.roles.findIndex(item => {
            return item.uid === roleId;
        })

        if (roleIndex !== -1) {
            castRow.roles = TryShiftItemBackward(roleIndex, castRow.roles);

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

        let roleIndex = castRow.roles.findIndex(item => {
            return item.uid === roleId;
        })

        if (roleIndex !== -1) {
            castRow.roles = TryShiftItemForward(roleIndex, castRow.roles);

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

        let roleIndex = castRow.roles.find(item => {
            return item.uid === roleId;
        })

        if (roleIndex !== -1) {
            castRow.roles.splice(roleIndex, 1);

            this.setState({ slides: slides });
        }

        // Update Database.
        mainDB.slides.update(slideId, { castRows: slide.castRows }).then( () => {

        });
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

            let role = this.getRole(this.state.roles, roleId);
            castRow.roles.push(role);

            this.setState({slides: slides});

            // Update Database
            mainDB.slides.update(slideId, { castRows: currentSlide.castRows }).then(() => {

            })
            
        }

        let onCancel = () => {
            this.setState({roleSelectDialog: { open: false, onChoose: null, onCancel: null }});
        }

        // Trigger Role Select Dialog.
        this.setState({roleSelectDialog: { open: true, onChoose: onChoose, onCancel: onCancel}});
        
    }

    getRole(roles, roleId) {
        return roles.find(item => {
            return item.uid === roleId;
        })
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
            
            this.setState({ 
                slides: slides,
                selectedSlideId: -1,
             });

            // Delete from Database
            mainDB.slides.delete(uid).then( () => {

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

        castChangeMap[roleId] = castMemberId;

        this.setState({castChangeMap: castChangeMap});

        // Add to Database.
        mainDB.castChangeMap.put(castChangeMap).then( result => {

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
                    mainDB.castMembers.update(uid, { headshot: base64Headshot }).then( dbUpdateResult => {

                    })

                    // Update State.
                    var castMembers = [...this.state.castMembers];
                    var castMember = castMembers.find(item => {
                        return item.uid === uid;
                    })

                    castMember.headshot = base64Headshot;

                    this.setState({castMembers: castMembers});
                })
            }
            
        }))
    }

    handleRoleNameChange(uid, newValue) {
        let roles = [...this.state.roles];
        let role = roles.find(item => {
            return item.uid === uid;
        })

        role.name = newValue;

        this.setState({ roles: roles });

        // Update DB
        mainDB.roles.update(uid, { name: newValue }).then( result => {

        })
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
        let newRole = RoleFactory("");

        roles.push(newRole);

        this.setState({roles: roles});

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

    handleCastMemberBillingChange(uid, newValue) {
        let castMembers = [...this.state.castMembers];
        let castMember = castMembers.find(item => {
            return item.uid === uid;
        })

        castMember.billing = newValue;

        this.setState({castMembers: castMembers});

        // Update DB
        mainDB.castMembers.update(castMember.uid, { billing: newValue }).then( result => {

        })
    }

    handleCastMemberNameChange(uid, newValue) {
        let castMembers = [...this.state.castMembers];
        let castMember = castMembers.find(item => {
            return item.uid === uid;
        })

        castMember.name = newValue;

        this.setState({castMembers: castMembers});

        // Update DB.
        mainDB.castMembers.update(castMember.uid, { name: newValue }).then( result => {

        })
    }

    handleAddCastMemberButtonClick() {
        let castMembers = [...this.state.castMembers];
        let newCastMember = CastMemberFactory("", "ensemble", "");
        castMembers.push(newCastMember);

        this.setState({castMembers: castMembers });

        // Add to DB
        mainDB.castMembers.add(newCastMember);
    }

    handleNextSlideButtonClick() {
        this.setState({ currentSlide: this.state.currentSlide + 1});
    }

    handlePrevSlideButtonClick() {
        this.setState({ currentSlide: this.state.currentSlide - 1});
    }
}

export default AppContainer;