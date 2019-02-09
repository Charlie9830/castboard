import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

class ConfirmationDialog extends Component {
    render() {
        return (
            <Dialog open={this.props.open}>
                <DialogTitle> {this.props.title} </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button
                        onClick={this.props.onNegative}>
                        No
                    </Button>

                    <Button
                        color="secondary"
                        onClick={this.props.onAffirmative}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ConfirmationDialog;