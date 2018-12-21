import React from 'react';
import { Grid, FormControlLabel, TextField, Checkbox, Paper, Popover, IconButton, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Create';
import FontStyleControl from './FontStyleControl';

class OrchestraFontStylePicker extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.buttonRef = React.createRef();

        // State.
        this.state = {
            open: false,
        }

        // Method Bindings.
        this.openPopover = this.openPopover.bind(this);
        this.closePopover = this.closePopover.bind(this);
    }


    render() {
        return (
            <React.Fragment>
                <IconButton buttonRef={this.buttonRef} hidden={this.state.open} onClick={this.openPopover}>
                    <EditIcon/>
                </IconButton>

                <Popover open={this.state.open} anchorEl={this.buttonRef.current} onBackdropClick={this.closePopover}
                onClose={this.closePopover}>
                    <Grid item style={{padding: '16px'}}>

                        {/* Actor  */} 
                        <Typography variant="subheading" style={{marginBottom: '8px '}}> Name </Typography>
                        <FontStyleControl
                        fontStyle={this.props.nameFontStyle}
                        onChange={(newValue) => {this.props.onChange(newValue, "name")} }/>

                        <div style={{width: '100%', height: '1px', background: 'gray', margin: '16px 0px'}}/>

                        {/* Role  */} 
                        <Typography variant="subheading" style={{marginBottom: '8px '}}> Role </Typography>
                        <FontStyleControl 
                        fontStyle={this.props.roleFontStyle}
                        onChange={(newValue) => {this.props.onChange(newValue, "role")} }/>
                    </Grid>
                </Popover>
            </React.Fragment>
        )
    }

    openPopover() {
        this.setState({ open: true });
    }

    closePopover() {
        this.setState( {open: false });
    }
}

export default OrchestraFontStylePicker;
