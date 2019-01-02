import React from 'react';
import { Dialog, DialogContent, Grid, TextField, Select, MenuItem, DialogActions, Button } from '@material-ui/core';

let BillingSelect = (props) => {
    return (
        <Select style={{marginLeft: '8px', marginRight: '8px'}} onChange={props.onChange} value={props.value} name="Billing">
            <MenuItem value="principle"> Principle </MenuItem>
            <MenuItem value="lead"> Lead </MenuItem>
            <MenuItem value="ensemble"> Ensemble </MenuItem>
        </Select>
    )
}

class EditRoleDialog extends React.Component {
    render() {
        return (
            <Dialog open={this.props.open}>
                <DialogContent>
                    <Grid container
                        direction="row"
                        justify="flex-start"
                        alignItems="center">
                        <TextField autoFocus style={{ width: '192px' }}
                            label="Internal Role Name"
                            defaultValue={this.props.name}
                            onChange={this.props.onNameChange} />

                        <TextField style={{ width: '192px', marginLeft: '8px' }}
                            value={this.props.displayedName}
                            label="Display Name"
                            onChange={this.props.onDisplayedNameChange} />

                        <BillingSelect value={this.props.billing} onChange={this.props.onBillingChange} />
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.props.onInputClose}> Okay </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default EditRoleDialog;