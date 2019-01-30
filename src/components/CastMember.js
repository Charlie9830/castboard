import React from 'react';
import GetStyleFromFontStyle from '../utilties/GetStyleFromFontStyle';

let CastMember = (props) => {
    let containerStyle = {
        placeSelf: 'center stretch',
        flexShrink: '1',
        flexGrow: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyItems: 'flex-start',
        alignItems: 'center',
        marginLeft: getContainerMargin(props.billing),
        marginRight: getContainerMargin(props.billing),
        minWidth: '200px',
    }

    let headshotStyle = {
        flexShrink: '1',
        objectFit: 'cover',
        filter: 'blur(0.25px)',
        width: getHeadshotDimensions(props.billing).width,
        height: getHeadshotDimensions(props.billing).height,
        borderColor: props.theme.headshotBorderColor,
        borderWidth: `${props.theme.headshotBorderStrokeWidth}px`,
        borderStyle: 'solid',
    }

    let nameStyle = {
        ...getNameFontStyle(props.billing, props.theme),
        marginTop: getNameMarginTop(props.billing),
        textAlign: 'center',
    }

    let roleStyle = {
        ...getRoleFontStyle(props.billing, props.theme),
        textAlign: 'center',
    }

    return (
        <div style={containerStyle}>
            <img style={headshotStyle} alt="Head not Found" src={'data:image/jpg;base64,' + props.headshot}
            onError={(e) => {onImageError(e, props.name)}}/>
            <div style={nameStyle}> {props.name} </div>
            <div style={roleStyle}> {props.character} </div>
        </div>
    )
}

let onImageError = (error, name) => {
    const log = require('electron-log');
    log.error(`Failed to load ${name}'s Headshot`);
}

let getHeadshotDimensions = (billing) => {
    let aspectRatio = 1.3333;

    switch(billing) {
        case "principle":
            let principleWidth = 460;
            let principleHeight = Math.floor(principleWidth * aspectRatio);
            return { height: principleHeight + 'px', width: principleWidth + 'px' };

        case "lead":
            let leadWidth = 400;
            let leadHeight = Math.floor(leadWidth * aspectRatio);

            return { height: leadHeight + 'px', width: leadWidth + 'px' };

        case "ensemble":
            let ensembleWidth = 215;
            let ensembleHeight = Math.floor(ensembleWidth * aspectRatio);

            return { height: ensembleHeight + 'px', width: ensembleWidth + 'px' };

        default:
            return null;
    }
}

let getNameFontStyle = (billing, theme) => {
    let propertyName = `${billing}ActorFontStyle`;

    return GetStyleFromFontStyle(theme[propertyName]);
}

let getRoleFontStyle = (billing, theme) => {
    let propertyName = `${billing}RoleFontStyle`;

    return GetStyleFromFontStyle(theme[propertyName]);
}


let getNameMarginTop = (billing) => {
    switch(billing) {
        case "principle":
            return '32px';

        case "lead":
            return '16px';


        case "ensemble":
            return '8px';

        default:
        return '8px';
    }
}

let getContainerMargin = (billing) => {
    switch(billing) {
        case "principle":
            return '32px';

        case "lead":
            return '32px';

        case "ensemble":
            return '24px';

        default:
            return '32px';
    }
}

export default CastMember;