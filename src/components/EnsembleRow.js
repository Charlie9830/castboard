import React from 'react';

let EnsembleRow = (props) => {
    let containerStyle = {
        alignSelf: 'center',
        justifySelf: 'stretch',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return (
        <div style={containerStyle}>
            {props.children}
        </div>
    )
}

export default EnsembleRow;