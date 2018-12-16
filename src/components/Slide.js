import React from 'react'

let Slide = (props) => {
    let containerStyle = {
        display: props.visible === true ? "grid" : "none",
        gridTemplateRows: '[Title] 164px [Content]auto',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${props.backgroundImageSrc})`,
        backgroundRepeat: 'no-repeat',
        margin: '0px',
        padding: '0px',
    }

    let slideTitleContainerStyle = {
        gridRow: 'Title',
        placeSelf: 'center',
        fontFamily: 'News Gothic Condensed',
        fontSize: '36pt',
        fontWeight: '700',
        color: 'rgb(211,169,42)',
    }

    let childrenContainerStyle = {
        gridRow: 'Content',
        placeSelf: 'center',
        display: 'grid',
        gridAutoRows: '1fr',
        justifyItems: 'center',
        alignItems: 'center',
        height: '100%',
    }

    return (
        <div style={containerStyle}>
            <div style={slideTitleContainerStyle}> {props.title} </div>
            <div style={childrenContainerStyle}>
                {props.children}
            </div>
        </div>
    )
}

export default Slide;