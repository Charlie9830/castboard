import React from 'react';
import SlideBase from './SlideBase';
import GetStyleFromFontStyle from '../../utilties/GetStyleFromFontStyle';

let InformationSlide = (props) => {

    let containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        paddingLeft: '16px',
        paddingRight: '16px',
    }

    let textStyle = {
        flexShrink: '1',
        width: 'fit-content',
        height: 'fit-content',
        ...GetStyleFromFontStyle(props.slide.informationTextFontStyle)
    }

    return (
        <SlideBase theme={props.theme}>
            <div style={containerStyle}>
                <div style={textStyle}> {props.slide.informationText} </div>
            </div>
        </SlideBase>
    )
}

export default InformationSlide;