import React from 'react';

let SlideBase = (props) => {
    let style = {
        width: '100%',
        height: '100%',
    }

    if (props.theme.backgroundImage !== "") {
        style = { 
            ...style,
            backgroundImage: `url(data:image/jpg;base64,${props.theme.backgroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
        }
    }

    return (
        <div style={style}>
            {props.children}
        </div>
    )
}

export default SlideBase;