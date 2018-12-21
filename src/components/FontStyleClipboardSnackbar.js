import React from 'react';
import { Snackbar, Typography } from '@material-ui/core';

let FontStyleClipboardSnackbar = (props) => {
    return (
        <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'left' }}
        open={props.open}
        autoHideDuration={4000}
        onClose={props.onClose}
        message={<span style={{fontFamily: 'Tahoma, Lucida Grande', fontSize: '14pt'}}> Text style saved to Clipboard </span>}/>
    )
}

export default FontStyleClipboardSnackbar;