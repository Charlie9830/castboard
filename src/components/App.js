import React, { Component } from 'react';
import Slide from './Slide';
import CastMember from './CastMember';
import EnsembleRow from './EnsembleRow';
import AppDrawer from './AppDrawer';
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

let cast =
  [
    { name: "Tina Arena", headshotSrc: TinaArena },
    { name: "Paulo Szot", headshotSrc: PauloSzot },
    { name: "Kurt Kansley", headshotSrc: KurtKansley },
    { name: "Michael Falzon", headshotSrc: MichaelFalzon },
    { name: "AlexisVanMaanen", headshotSrc: AlexisVanMaanen },
  ]

class App extends Component {
  render() {
    var slideJSX = this.getSlide(this.props.currentSlide);

    return (
      <div className="App">
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
          />
        </div>

        <div className="AppContentContainer">
          {slideJSX}
        </div>
        
      </div>
    );
  }

  getSlide(slideNumber) {
      // Keep all Slides loaded in the Dom and use the "visible" prop to display each slide by itself. This Keeps the headshots
      // loaded in the DOM.
      return (
        <React.Fragment>
          <Slide visible={slideNumber === 0} title="AT THIS PERFORMANCE" backgroundImageSrc={BackgroundImageSrc}>
            <CastMember headshotSrc={TinaArena} name="Tina Arena" character="Eva Peron" billing="principle" />
          </Slide>

          <Slide visible={slideNumber === 1}  title="AT THIS PERFORMANCE" backgroundImageSrc={BackgroundImageSrc}>
            <EnsembleRow>
              <CastMember headshotSrc={PauloSzot} name="Paulo Szot" character="Peron" billing="lead" />
              <CastMember headshotSrc={KurtKansley} name="Kurt Kansley" character="Che" billing="lead" />
              <CastMember headshotSrc={MichaelFalzon} name="Michael Falzon" character="Magaldi" billing="lead" />
              <CastMember headshotSrc={AlexisVanMaanen} name="Alexis Van Maanen" character="Mistress" billing="lead" />
            </EnsembleRow>
          </Slide>

          <Slide visible={slideNumber === 2}  title="AT THIS PERFORMANCE" backgroundImageSrc={BackgroundImageSrc}>
            <EnsembleRow>
              <CastMember headshotSrc={OliviaCarniato} name="Olivia Carniato" character="Ensemble" billing="ensemble" />
              <CastMember headshotSrc={AlieCoste} name="Alie Coste" character="Ensemble" billing="ensemble" />
              <CastMember headshotSrc={SamanthaDodemaide} name="Samantha Dodemaide" character="Ensemble" billing="ensemble" />
              <CastMember headshotSrc={LauraField} name="Laura Field" character="Ensemble" billing="ensemble" />
              <CastMember headshotSrc={AshleighGurnett} name="Ashleigh Gurnett" character="Ensemble" billing="ensemble" />
            </EnsembleRow>

            <EnsembleRow>
              <CastMember headshotSrc={KateMareeHoolihan} name="Kate Maree Hoolihan" character="Ensemble" billing="ensemble" />
              <CastMember headshotSrc={GeorginaHopson} name="Georgina Hopson" character="Ensemble" billing="ensemble" />
              <CastMember headshotSrc={RachelWard} name="Rachel Ward" character="Ensemble" billing="ensemble" />
              <CastMember headshotSrc={KathleenMoore} name="Kathleen Moore" character="Ensemble" billing="ensemble" />
            </EnsembleRow>
          </Slide>
        </React.Fragment>
      )
  }
}

export default App;
