import React, { Component } from 'react';
import AppDrawer from './AppDrawer';
import SlideRenderer from './SlideRenderer';
import SelectRoleDialog from './SelectRoleDialog';
import '../assets/css/App.css';
import BackgroundImageSrc from '../assets/media/Background.jpg';

import TinaArena from '../assets/media/TinaArena.jpg';
import PauloSzot from '../assets/media/PauloSzot.jpeg';
import KurtKansley from '../assets/media/KurtKansley.jpeg';
import MichaelFalzon from '../assets/media/MichaelFalzon.jpeg';
import AlexisVanMaanen from '../assets/media/AlexisVanMaanen.jpeg';
import OliviaCarniato from '../assets/media/OliviaCarniato.jpeg';
import AlieCoste from '../assets/media/AlieCoste.jpeg';
import SamanthaDodemaide from '../assets/media/SamanthaDodemaide.jpeg';
import LauraField from '../assets/media/LauraField.jpeg';
import AshleighGurnett from '../assets/media/AshleighGurnett.jpeg';
import KateMareeHoolihan from '../assets/media/KateMareeHoolihan.jpeg';
import GeorginaHopson from '../assets/media/GeorginaHopson.jpeg';
import RachelWard from '../assets/media/RachelWard.jpeg';
import KathleenMoore from '../assets/media/KathleenMoore.jpeg';

import { CssBaseline, AppBar, Toolbar, Typography } from '@material-ui/core';
import { purple } from '@material-ui/core/colors';

class App extends Component {
  constructor(props) {
    super(props)

    // State.
    this.state = {
      zoomLevel: 1,
    }

    // Method Bindings.
    this.handleZoomInButtonClick = this.handleZoomInButtonClick.bind(this);
    this.handleZoomOutButtonClick = this.handleZoomOutButtonClick.bind(this);
  }


  render() {
    return (
      <div className="App">
        <CssBaseline/>

        <SelectRoleDialog 
        open={this.props.roleSelectDialog.open} 
        onChoose={this.props.roleSelectDialog.onChoose}
        onCancel={this.props.roleSelectDialog.onCancel}
        roles={this.props.roles}/>

        <div className="AppBarContainer">
          <AppBar position="relative">
            <Toolbar>
              <Typography variant="h6"> Castboard </Typography>
            </Toolbar>
          </AppBar>
        </div>

        <div className="AppDrawerContainer">
          <AppDrawer 
          onAddCastMemberButtonClick={this.props.onAddCastMemberButtonClick}
          castMembers={this.props.castMembers}
          onCastMemberNameChange={this.props.onCastMemberNameChange}
          onCastMemberBillingChange={this.props.onCastMemberBillingChange}
          onCastMemberDeleteButtonClick={this.props.onCastMemberDeleteButtonClick}
          onAddRoleButtonClick={this.props.onAddRoleButtonClick}
          roles={this.props.roles}
          onDeleteRoleButtonClick={this.props.onDeleteRoleButtonClick}
          onRoleNameChange={this.props.onRoleNameChange}
          onNextSlideButtonClick={this.props.onNextSlideButtonClick}
          onPrevSlideButtonClick={this.props.onPrevSlideButtonClick}
          currentSlide={this.props.currentSlide}
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
          onZoomInButtonClick={this.handleZoomInButtonClick}
          onZoomOutButtonClick={this.handleZoomOutButtonClick}
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
          onRoleDisplayedNameChange={this.props.onRoleDisplayedNameChange}/>
        </div>

        <div className="SlidePreviewContainer" style={{transform: `scale(${this.state.zoomLevel})`}}>
          <SlideRenderer theme={this.props.theme} slide={this.getCurrentSlide(this.props.slides, this.props.selectedSlideId)}
          castMembers={this.props.castMembers} castChangeMap={this.props.castChangeMap} />
        </div>
        
      </div>
    );
  }

  handleZoomInButtonClick() {
    this.setState({zoomLevel: this.state.zoomLevel + 0.1});
  }

  handleZoomOutButtonClick() {
    this.setState({zoomLevel: this.state.zoomLevel - 0.1});
  }

  getCurrentSlide(slides, slideId) {
    if (slideId === -1) {
      return null;
    }

    return slides.find(item => {
      return item.uid === slideId;
    })
  }

  // getSlide(slideNumber) {
  //     // Keep all Slides loaded in the Dom and use the "visible" prop to display each slide by itself. This Keeps the headshots
  //     // loaded in the DOM.
  //     return (
  //       <React.Fragment>
  //         <Slide visible={slideNumber === 0} title="AT THIS PERFORMANCE" backgroundImageSrc={BackgroundImageSrc}>
  //           <CastMember headshotSrc={TinaArena} name="Tina Arena" character="Eva Peron" billing="principle" />
  //         </Slide>
// 
  //         <Slide visible={slideNumber === 1}  title="AT THIS PERFORMANCE" backgroundImageSrc={BackgroundImageSrc}>
  //           <EnsembleRow>
  //             <CastMember headshotSrc={PauloSzot} name="Paulo Szot" character="Peron" billing="lead" />
  //             <CastMember headshotSrc={KurtKansley} name="Kurt Kansley" character="Che" billing="lead" />
  //             <CastMember headshotSrc={MichaelFalzon} name="Michael Falzon" character="Magaldi" billing="lead" />
  //             <CastMember headshotSrc={AlexisVanMaanen} name="Alexis Van Maanen" character="Mistress" billing="lead" />
  //           </EnsembleRow>
  //         </Slide>

  //         <Slide visible={slideNumber === 2}  title="AT THIS PERFORMANCE" backgroundImageSrc={BackgroundImageSrc}>
  //           <EnsembleRow>
  //             <CastMember headshotSrc={OliviaCarniato} name="Olivia Carniato" character="Ensemble" billing="ensemble" />
  //             <CastMember headshotSrc={AlieCoste} name="Alie Coste" character="Ensemble" billing="ensemble" />
  //             <CastMember headshotSrc={SamanthaDodemaide} name="Samantha Dodemaide" character="Ensemble" billing="ensemble" />
  //             <CastMember headshotSrc={LauraField} name="Laura Field" character="Ensemble" billing="ensemble" />
  //             <CastMember headshotSrc={AshleighGurnett} name="Ashleigh Gurnett" character="Ensemble" billing="ensemble" />
  //           </EnsembleRow>

  //           <EnsembleRow>
  //             <CastMember headshotSrc={KateMareeHoolihan} name="Kate Maree Hoolihan" character="Ensemble" billing="ensemble" />
  //             <CastMember headshotSrc={GeorginaHopson} name="Georgina Hopson" character="Ensemble" billing="ensemble" />
  //             <CastMember headshotSrc={RachelWard} name="Rachel Ward" character="Ensemble" billing="ensemble" />
  //             <CastMember headshotSrc={KathleenMoore} name="Kathleen Moore" character="Ensemble" billing="ensemble" />
  //           </EnsembleRow>
  //         </Slide>
  //       </React.Fragment>
  //     )
  // }
}

export default App;
