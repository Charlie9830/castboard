import React from 'react';
import SlideBase from './SlideBase';

let TitleSlide = (props) => {
    let imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    }

    return (
        <SlideBase theme={props.theme}>
            <img style={imgStyle} src={'data:image/jpg;base64,' + props.slide.titleImage }/>
        </SlideBase>
    )
}

export default TitleSlide;