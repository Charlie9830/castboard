import React from 'react';
import { Grid, FormControlLabel, TextField, Checkbox, Paper, Popover, IconButton, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Create';
import FontStyleControl from './FontStyleControl';

class HeadshotFontStylePicker extends React.Component {
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
                        <Typography variant="subheading" style={{marginBottom: '8px '}}> Actor Name </Typography>
                        <FontStyleControl
                        fontStyle={this.props.actorFontStyle}
                        onChange={(newValue) => {this.props.onChange(newValue, "actor")} }/>

                        <div style={{width: '100%', height: '1px', background: 'gray', margin: '16px 0px'}}/>

                        {/* Role  */} 
                        <Typography variant="subheading" style={{marginBottom: '8px '}}> Role Name </Typography>
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

    handleColorChange(newValue, control) {
        let propName = control === "actor" ? "actorFontStyle" : "roleFontStyle";
        let newFontStyle = {...this.props[propName]};

        newFontStyle.color = newValue;

        this.props.onChange(newFontStyle, control);
    }

    handleFontFamilyChange(e, control) {
        let newValue = e.target.value;
        let propName = control === "actor" ? "actorFontStyle" : "roleFontStyle";
        let newFontStyle = {...this.props[propName]};

        newFontStyle.fontFamily = newValue;

        this.props.onChange(newFontStyle, control);
    }

    handleFontSizeChange(e, control) {
        let newValue = e.target.value;
        let propName = control === "actor" ? "actorFontStyle" : "roleFontStyle";
        let newFontStyle = {...this.props[propName]};
        
        newFontStyle.fontSize = newValue;

        this.props.onChange(newFontStyle, control);
    }

    handleBoldChange(e, control) {
        let newValue = e.target.checked;
        let propName = control === "actor" ? "actorFontStyle" : "roleFontStyle";
        let newFontStyle = {...this.props[propName]};

        newFontStyle.bold = newValue;

        this.props.onChange(newFontStyle, control);
    }

    handleItalicsChange(e, control) {
        let newValue = e.target.checked;
        let propName = control === "actor" ? "actorFontStyle" : "roleFontStyle";
        let newFontStyle = {...this.props[propName]};

        newFontStyle.italics = newValue;

        this.props.onChange(newFontStyle, control);
    }
}

export default HeadshotFontStylePicker;
