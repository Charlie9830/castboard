import React from 'react';
import { Dialog, DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, DialogActions, Button } from '@material-ui/core';

class SelectRoleDialog extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            value: -1
        }
    }

    render() {
        let rolesJSX = this.props.roles.map(item => {
            return ( <FormControlLabel key={item.uid} label={item.name} value={item.uid} control={<Radio/>}/> )
        })

        return (
            <Dialog open={this.props.open}>
                <DialogTitle> Select Role </DialogTitle>
                <DialogContent>
                    <RadioGroup value={this.state.value} onChange={(e) => { this.setState({ value: e.target.value})}}>
                        {rolesJSX}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {this.props.onCancel()}}> Cancel </Button>
                    <Button disabled={this.state.value === -1} onClick={() => { this.props.onChoose(this.state.value)}}> Choose </Button>

                </DialogActions>
            </Dialog>
        )   
    }
}

export default SelectRoleDialog;