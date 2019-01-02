import React from 'react';
import SlideBase from './SlideBase';


let TitleSlide = (props) => {
    let imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    }

    return (
        <SlideBase theme={props.theme}>
            <img style={imgStyle} src={'data:image/jpg;base64,' + props.slide.titleImage } onError={(e) => {onImageError(e)}}/>
        </SlideBase>
    )
}

let onImageError = (error) => {
    const log = require('electron-log');
    log.error("Failed to load Title Slide Image");
}

export default TitleSlide;