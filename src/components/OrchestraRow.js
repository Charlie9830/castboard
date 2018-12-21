import React from 'react';

let OrchestraRow = (props) => {
    let containerStyle = {
        alignSelf: 'center',
        justifySelf: 'stretch',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 'fit-content',
    }

    return (
        <div style={containerStyle}>
            {props.children}
        </div>
    )
}

export default OrchestraRow;