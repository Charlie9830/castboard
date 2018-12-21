import React from 'react';

import TitleSlide from './Slides/TitleSlide';
import InformationSlide from './Slides/InformationSlide';
import CastSlide from './Slides/CastSlide';
import OrchestraSlide from './Slides/OrchestraSlide';
import { Typography } from '@material-ui/core';

let SlideRenderer = (props) => {
    if (props.slide === null) {
        return <Typography variant="subheading"> No Slide Selected </Typography>
    }

    switch (props.slide.type) {
        case "title":
            return <TitleSlide theme={props.theme} slide={props.slide}/>;

        case "info":
            return <InformationSlide theme={props.theme} slide={props.slide}/>;
        
        case "cast": 
            return <CastSlide theme={props.theme} slide={props.slide} 
             castMembers={props.castMembers}
             castChangeMap={props.castChangeMap}/>

        case "orchestra":
            return <OrchestraSlide theme={props.theme} slide={props.slide}
            orchestraMembers={props.orchestraMembers} orchestraChangeMap={props.orchestraChangeMap}/>
            
        default:
        return null;
    }
}

export default SlideRenderer;