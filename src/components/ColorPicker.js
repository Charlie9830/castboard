import React from 'react';
import { IconButton } from '@material-ui/core';
import ColorIcon from '@material-ui/icons/ColorLens';

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.nativeColorInputRef = React.createRef();
    }

    render() {
        return (
            <React.Fragment>
                <input ref={this.nativeColorInputRef} style={{ visibility: 'hidden' }} type="color"
                 defaultValue={this.props.defaultValue} onChange={(e) => {this.props.onChange(e.target.value)}} />
                <IconButton onClick={() => { this.nativeColorInputRef.current.click() }}>
                    <ColorIcon />
                </IconButton>
            </React.Fragment>
        )
    }
}

export default ColorPicker;