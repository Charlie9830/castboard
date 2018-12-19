import React from 'react';

import TitleSlide from './Slides/TitleSlide';
import InformationSlide from './Slides/InformationSlide';
import CastSlide from './Slides/CastSlide';

let SlideRenderer = (props) => {
    if (props.slide === null) {
        return <div> No Slide Selected </div>
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
        default:
        return null;
    }
}

export default SlideRenderer;