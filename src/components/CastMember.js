import React from 'react';

let CastMember = (props) => {
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

    let headshotStyle = {
        flexShrink: '1',
        objectFit: 'cover',
        width: getHeadshotDimensions(props.billing).width,
        height: getHeadshotDimensions(props.billing).height,
        border: '3px solid rgb(211,169,42)'
    }

    let nameStyle = {
        fontFamily: 'News Gothic Condensed',
        fontSize: getNameFontSize(props.billing),
        fontWeight: '700',
        color: 'rgb(211,169,42)',
        marginTop: getNameMarginTop(props.billing),
    }

    let roleStyle = {
        fontFamily: 'News Gothic Condensed',
        fontSize: getRoleFontSize(props.billing),
        color: 'rgb(211,169,42)',
    }

    return (
        <div style={containerStyle}>
            <img style={headshotStyle} alt="Head not Found" src={'data:image/jpg;base64,' + props.headshot}/>
            <div style={nameStyle}> {props.name} </div>
            <div style={roleStyle}> {props.character} </div>
        </div>
    )
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

let getNameFontSize = (billing) => {
    switch(billing) {
        case "principle":
            return '36pt';

        case "lead":
            return '28pt';


        case "ensemble":
            return '16pt';

        default:
        return '12pt';
    }
}

let getRoleFontSize = (billing) => {
    switch(billing) {
        case "principle":
            return '28pt';

        case "lead":
            return '24pt';


        case "ensemble":
            return '15pt';

        default:
        return '12pt';
    }
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

export default CastMember;