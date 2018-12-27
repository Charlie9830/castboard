import React from 'react';
import { Dialog, DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, DialogActions, Button, DialogContentText, TextField } from '@material-ui/core';

class FontNameDialog extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            value: "",
        }
    }

    render() {
        return (
            <Dialog open={this.props.open}>
                <DialogTitle> Enter Font Name </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Type the name for the Font below. This will be used to reference it later.
                    </DialogContentText>
                    <TextField autoFocus placeholder="...Font Name" onChange={(e) => {this.setState({value: e.target.value})}}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {this.props.onCancel()}}> Cancel </Button>
                    <Button disabled={this.state.value === ""} onClick={() => { this.props.onContinue(this.state.value)}}> Continue </Button>
                </DialogActions>
            </Dialog>
        )   
    }
}

export default FontNameDialog;