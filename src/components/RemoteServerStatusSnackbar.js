import React from 'react';
import { Snackbar} from '@material-ui/core';

let RemoteServerStatusSnackbar = (props) => {
    return (
        <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'left' }}
        open={props.open}
        autoHideDuration={4000}
        onClose={props.onClose}
        message={<span style={{fontFamily: 'Tahoma, Lucida Grande', fontSize: '14pt'}}> {props.message} </span>}/>
    )
}

export default RemoteServerStatusSnackbar;