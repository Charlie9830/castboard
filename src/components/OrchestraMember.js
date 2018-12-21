import React from 'react';
import GetStyleFromFontStyle from '../utilties/GetStyleFromFontStyle';

let OrchestraMember = (props) => {
    let containerStyle = {
        placeSelf: 'center stretch',
        flexShrink: '1',
        flexGrow: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyItems: 'flex-start',
        alignItems: 'center',
        marginLeft: '24px',
        marginRight: '24px',
        minWidth: '200px',
    }

    let nameStyle = {
        ...getNameFontStyle(props.billing, props.theme),
    }

    let roleStyle = {
        ...getRoleFontStyle(props.billing, props.theme),
    }

    if (props.billing === "conductor") {
        return (
            <div style={containerStyle}>
                <div style={roleStyle}> CONDUCTING THIS PERFORMANCE </div>
                <div style={nameStyle}> {props.name} </div>
            </div>
        )
    }

    return (
        <div style={containerStyle}>
            <div style={nameStyle}> {props.name} </div>
            <div style={roleStyle}> {props.seat} </div>
        </div>
    )
}

let getNameFontStyle = (billing, theme) => {
    let propertyName = `${billing}NameFontStyle`;

    return GetStyleFromFontStyle(theme[propertyName]);
}

let getRoleFontStyle = (billing, theme) => {
    
    let propertyName = `${billing}RoleFontStyle`;

    return GetStyleFromFontStyle(theme[propertyName]);
}

export default OrchestraMember;