import React, { Component } from 'react';
import AppDrawer from './AppDrawer';
import SlideRenderer from './SlideRenderer';
import SlideSizer from './SlideSizer';
import SelectRoleDialog from './SelectRoleDialog';
import FontStyleClipboardSnackbar from './FontStyleClipboardSnackbar';
import RemoteServerStatusSnackbar from './RemoteServerStatusSnackbar';
import '../assets/css/App.css';

import { CssBaseline, AppBar, Toolbar, Typography, Button, Grid } from '@material-ui/core';
import FontNameDialog from './FontNameDialog';
import GeneralSnackbar from './GeneralSnackbar';

class App extends Component {
  constructor(props) {
    super(props)

    // Method Bindings.
    this.getPresentationModeLayout = this.getPresentationModeLayout.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "F5") {
        this.props.onTogglePresentationMode();
      }
    })
  }

  render() {
    if (this.props.isInPresentationMode) {
      return this.getPresentationModeLayout();
    }

    return (
      <div className="App">
        <CssBaseline/>

        <GeneralSnackbar open={this.props.generalSnackbar.open} message={this.props.generalSnackbar.message}
        onClose={this.props.generalSnackbar.onClose}/>

        <FontStyleClipboardSnackbar open={this.props.isFontStyleClipboardSnackbarOpen}
         onClose={this.props.onFontStyleClipboardSnackbarClose}/>

        <SelectRoleDialog 
        open={this.props.roleSelectDialog.open} 
        onChoose={this.props.roleSelectDialog.onChoose}
        onCancel={this.props.roleSelectDialog.onCancel}
        roles={this.props.roleSelectDialog.roles}/>

        <FontNameDialog
        open={this.props.fontNameDialog.open}
        onContinue={this.props.fontNameDialog.onContinue}
        onCancel={this.props.fontNameDialog.onCancel}
        />

        <div className="AppBarContainer">
          <AppBar position="relative">
            <Toolbar>
              <Typography variant="h6"> Castboard </Typography>
              <Grid container
              direction="row-reverse"
              justify="flex-start">
                <Button onClick={this.props.onSaveButtonClick}> Save </Button>
                <Button onClick={this.props.onOpenButtonClick}> Open </Button>
                <Typography style={{paddingRight: '32px'}} variant="h6" color="textSecondary" > {this.props.showfileInfo.name} </Typography>
              </Grid>
              
            </Toolbar>
          </AppBar>
        </div>

        <div className="AppDrawerContainer">
          <AppDrawer 
          onAddCastMemberButtonClick={this.props.onAddCastMemberButtonClick}
          castMembers={this.props.castMembers}
          onCastMemberNameChange={this.props.onCastMemberNameChange}
          onRoleBillingChange={this.props.onRoleBillingChange}
          onCastMemberDeleteButtonClick={this.props.onCastMemberDeleteButtonClick}
          onAddRoleButtonClick={this.props.onAddRoleButtonClick}
          roles={this.props.roles}
          onDeleteRoleButtonClick={this.props.onDeleteRoleButtonClick}
          onRoleNameChange={this.props.onRoleNameChange}
          onNextSlideButtonClick={this.props.onNextSlideButtonClick}
          onPrevSlideButtonClick={this.props.onPrevSlideButtonClick}
          onAddHeadshotButtonClick={this.props.onAddHeadshotButtonClick}
          onCastChange={this.props.onCastChange}
          castChangeMap={this.props.castChangeMap}
          onAddSlideButtonClick={this.props.onAddSlideButtonClick}
          slides={this.props.slides}
          onSlideNameChange={this.props.onSlideNameChange}
          onSlideTypeChange={this.props.onSlideTypeChange}
          onDeleteSlideButtonClick={this.props.onDeleteSlideButtonClick}
          onSlideSelect={this.props.onSlideSelect}
          selectedSlideId={this.props.selectedSlideId}
          onChooseTitleSlideImageButtonClick={this.props.onChooseTitleSlideImageButtonClick}
          onChooseBackgroundImageButtonClick={this.props.onChooseBackgroundImageButtonClick}
          onInformationTextChange={this.props.onInformationTextChange}
          onInformationTextFontStyleChange={this.props.onInformationTextFontStyleChange}
          theme={this.props.theme}
          onBaseFontStyleChange={this.props.onBaseFontStyleChange}
          onAddRowToSlideButtonClick={this.props.onAddRowToSlideButtonClick}
          onAddRoleToCastRowButtonClick={this.props.onAddRoleToCastRowButtonClick}
          onSlideTitleChange={this.props.onSlideTitleChange}
          onSlideTitleFontStyleChange={this.props.onSlideTitleFontStyleChange}
          onCastRowRoleDeleteButtonClick={this.props.onCastRowRoleDeleteButtonClick}
          onCastRowDeleteButtonClick={this.props.onCastRowDeleteButtonClick}
          onCastRowRoleShiftUpButtonClick={this.props.onCastRowRoleShiftUpButtonClick}
          onCastRowRoleShiftDownButtonClick={this.props.onCastRowRoleShiftDownButtonClick}
          onPrincipleFontStyleChange={this.props.onPrincipleFontStyleChange}
          onLeadFontStyleChange={this.props.onLeadFontStyleChange}
          onEnsembleFontStyleChange={this.props.onEnsembleFontStyleChange}
          onHeadshotBorderStrokeWidthChange={this.props.onHeadshotBorderStrokeWidthChange}
          onHeadshotBorderColorChange={this.props.onHeadshotBorderColorChange}
          onAddCastGroupButtonClick={this.props.onAddCastGroupButtonClick}
          castGroups={this.props.castGroups}
          onAddCastMemberToGroupButtonClick={this.props.onAddCastMemberToGroupButtonClick}
          onCastGroupNameChange={this.props.onCastGroupNameChange}
          onAddRoleGroupButtonClick={this.props.onAddRoleGroupButtonClick}
          onAddRoleToGroupButtonClick={this.props.onAddRoleToGroupButtonClick}
          roleGroups={this.props.roleGroups}
          onRoleGroupNameChange={this.props.onRoleGroupNameChange}
          onRoleDisplayedNameChange={this.props.onRoleDisplayedNameChange}
          onRoleGroupDeleteButtonClick={this.props.onRoleGroupDeleteButtonClick}
          onCastGroupDeleteButtonClick={this.props.onCastGroupDeleteButtonClick}
          onGroupCastChange={this.props.onGroupCastChange}
          onAddOrchestraMemberButtonClick={this.props.onAddOrchestraMemberButtonClick}
          orchestraMembers={this.props.orchestraMembers}
          onOrchestraMemberNameChange={this.props.onOrchestraMemberNameChange}
          onOrchestraMemberDeleteButtonClick={this.props.onOrchestraMemberDeleteButtonClick}
          orchestraRoles={this.props.orchestraRoles}
          onAddOrchestraRoleButtonClick={this.props.onAddOrchestraRoleButtonClick}
          onOrchestraRoleNameChange={this.props.onOrchestraRoleNameChange}
          onOrchestraRoleDeleteButtonClick={this.props.onOrchestraRoleDeleteButtonClick}
          onOrchestraRoleBillingChange={this.props.onOrchestraRoleBillingChange}
          onOrchestraChange={this.props.onOrchestraChange}
          orchestraChangeMap={this.props.orchestraChangeMap}
          onAddRoleToOrchestraRowButtonClick={this.props.onAddRoleToOrchestraRowButtonClick}
          onOrchestraRowDeleteButtonClick={this.props.onOrchestraRowDeleteButtonClick}
          onAddOrchestraRowToSlideButtonClick={this.props.onAddOrchestraRowToSlideButtonClick}
          onConductorFontStyleChange={this.props.onConductorFontStyleChange}
          onAssociateFontStyleChange={this.props.onAssociateFontStyleChange}
          onMusicianFontStyleChange={this.props.onMusicianFontStyleChange}
          onReorderSlideButtonClick={this.props.onReorderSlideButtonClick}
          onHoldTimeChange={this.props.onHoldTimeChange}
          onEditListItemButtonClick={this.props.onEditListItemButtonClick}
          openInputId={this.props.openInputId}
          onListItemInputClose={this.props.onListItemInputClose}
          onRoleEditButtonClick={this.props.onRoleEditButtonClick}
          onAttachFontButtonClick={this.props.onAttachFontButtonClick}/>
        </div>

        <div className="SlidePreviewContainer" >

          {this.props.selectedSlideId === -1 && <Typography variant="subheading"> No Slide Selected </Typography>}
          
          <SlideSizer>
            {/* Any Changes to Props for SlideRenderer should be Reflected in the other Instance of SlideRenderer.  */}
            <SlideRenderer theme={this.props.theme} slide={this.getCurrentSlide(this.props.slides, this.props.selectedSlideId)}
              castMembers={this.props.castMembers} castChangeMap={this.props.castChangeMap}
              orchestraMembers={this.props.orchestraMembers} orchestraChangeMap={this.props.orchestraChangeMap}
              roles={this.props.roles} orchestraRoles={this.props.orchestraRoles} />
          </SlideSizer>
          
        </div>
      </div>
    );
  }

  getPresentationModeLayout() {
    return (
      <div className="AppPresentationMode">
        <RemoteServerStatusSnackbar open={this.props.remoteServerStatusSnackbar.open}
          message={this.props.remoteServerStatusSnackbar.message}
          onClose={this.props.onRemoteServerStatusSnackbarClose} />

        <SlideRenderer theme={this.props.theme} slide={this.getCurrentSlide(this.props.slides, this.props.selectedSlideId)}
          castMembers={this.props.castMembers} castChangeMap={this.props.castChangeMap}
          orchestraMembers={this.props.orchestraMembers} orchestraChangeMap={this.props.orchestraChangeMap}
          roles={this.props.roles} orchestraRoles={this.props.orchestraRoles} />
      </div>
    )
  }

  getCurrentSlide(slides, slideId) {
    if (slideId === -1) {
      return null;
    }

    return slides.find(item => {
      return item.uid === slideId;
    })
  }
}

export default App;
