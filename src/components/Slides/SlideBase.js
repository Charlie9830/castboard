import React from 'react';

let SlideBase = (props) => {
    let style = {
        width: '100%',
        height: '100%',
        position: 'relative',
    }

    let backgroundStyle = {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            filter: 'blur(0.75px)',
            backgroundImage: `url(data:image/jpg;base64,${props.theme.backgroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
        }

    return (
        <div style={style}>
            <div style={backgroundStyle}/>
            {props.children}
        </div>
    )
}

export default SlideBase;