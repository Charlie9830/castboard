import React from 'react';
import { Button, FormControlLabel, Radio, RadioGroup, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

class CastGroupChooser extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            dialogOpen: false,
            value: -1,
        }

        // Method Bindings.
        this.handleChoose = this.handleChoose.bind(this);
    }

    render() {
        let castGroupJSX = this.props.castGroups.map(item => {
            return ( <FormControlLabel key={item.uid} label={item.name} value={item.uid} control={<Radio/>}/> )
        })

        return (
            <React.Fragment>
                <Button variant="outlined" onClick={() => {this.setState({dialogOpen: true })}}> Choose Group</Button>
                <Dialog open={this.state.dialogOpen}>
                    <DialogTitle> Select Cast Group </DialogTitle>
                    <DialogContent>
                        <RadioGroup value={this.state.value} onChange={(e) => { this.setState({ value: e.target.value }) }}>
                            {castGroupJSX}
                        </RadioGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.setState({dialogOpen: false})}}> Cancel </Button>
                        <Button disabled={this.state.value === -1} onClick={this.handleChoose}> Choose </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            
        )
    }

    handleChoose() {
        this.setState({ dialogOpen: false });
        this.props.onChoose(this.state.value);
    }
}

export default CastGroupChooser;