import React from 'react';
import ColorPicker from './ColorPicker';
import { Grid, FormControlLabel, TextField, Checkbox, Paper, Popover, IconButton, Typography } from '@material-ui/core';
import '../assets/css/FontStylePicker.css';
import EditIcon from '@material-ui/icons/Create';


let FontSizeField = (props) => {
    return (
        <TextField style={{width: '92px'}} label="Font Size" type="number" defaultValue={props.defaultValue} onChange={props.onChange}/>
    )
}

let FontSelector = (props) => {
    return (
        <TextField label="Font" defaultValue={props.defaultValue} onBlur={props.onBlur}/>
    )
}

let BoldCheckbox = (props) => {
    return (
        <FormControlLabel label="Bold" 
        control={<Checkbox checked={props.checked} onChange={props.onChange}/>}
        />
    )
}

let ItalicsCheckbox = (props) => {
    return (
        <FormControlLabel label="Italics" 
        control={<Checkbox checked={props.checked} onChange={props.onChange}/>}
        />
    )
}

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
        this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this);
        this.handleFontSizeChange = this.handleFontSizeChange.bind(this);
        this.handleBoldChange = this.handleBoldChange.bind(this);
        this.handleItalicsChange = this.handleItalicsChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.openPopover = this.openPopover.bind(this);
        this.closePopover = this.closePopover.bind(this);
    }


    render() {
        let actorFontFamily = this.props.actorFontStyle !== undefined ? this.props.actorFontStyle.fontFamily : "Comic Sans MT";
        let actorFontSize = this.props.actorFontStyle !== undefined  ? this.props.actorFontStyle.fontSize : 12;
        let actorIsBold = this.props.actorFontStyle !== undefined ? this.props.actorFontStyle.bold : false;
        let actorIsItalics =  this.props.actorFontStyle !== undefined ? this.props.actorFontStyle.italics : false;
        let actorColor = this.props.actorFontStyle !== undefined ? this.props.actorFontStyle.color : "#000000";

        let roleFontFamily = this.props.roleFontStyle !== undefined ? this.props.roleFontStyle.fontFamily : "Comic Sans MT";
        let roleFontSize = this.props.roleFontStyle !== undefined ? this.props.roleFontStyle.fontSize : 12;
        let roleIsBold = this.props.roleFontStyle !== undefined ? this.props.roleFontStyle.bold : false;
        let roleIsItalics = this.props.roleFontStyle !== undefined ? this.props.roleFontStyle.italics : false;
        let roleColor = this.props.roleFontStyle !== undefined ? this.props.roleFontStyle.color : "#000000";

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
                        <div className="FontStylePickerGrid">
                            <div className="FontStylePickerFontFamily">
                                <FontSelector onBlur={(e) => {this.handleFontFamilyChange(e, "actor")}} defaultValue={actorFontFamily} />
                            </div>

                            <div className="FontStylePickerFontSize">
                                <FontSizeField onChange={(e) => {this.handleFontSizeChange(e, "actor")}} defaultValue={actorFontSize} />
                            </div>

                            <div className="FontStylePickerBold">
                                <BoldCheckbox onChange={(e) => {this.handleBoldChange(e, "actor")}} checked={actorIsBold} />
                            </div>

                            <div className="FontStylePickerColor">
                                <ColorPicker defaultValue={actorColor} onChange={(e) => {this.handleColorChange(e, "actor")}}/>
                            </div>

                            <div className="FontStylePickerItalic">
                                <ItalicsCheckbox onChange={(e) => {this.handleItalicsChange(e, "actor")}} checked={actorIsItalics} />
                            </div>
                        </div>

                        <div className="FontStylePickerDivider"/>

                        {/* Role  */} 
                        <Typography variant="subheading" style={{marginBottom: '8px '}}> Role Name </Typography>
                        <div className="FontStylePickerGrid">
                            <div className="FontStylePickerFontFamily">
                                <FontSelector onBlur={(e) => {this.handleFontFamilyChange(e, "role")}} defaultValue={roleFontFamily} />
                            </div>

                            <div className="FontStylePickerFontSize">
                                <FontSizeField onChange={(e) => {this.handleFontSizeChange(e, "role")}} defaultValue={roleFontSize} />
                            </div>

                            <div className="FontStylePickerBold">
                                <BoldCheckbox onChange={(e) => {this.handleBoldChange(e, "role")}} checked={roleIsBold} />
                            </div>

                            <div className="FontStylePickerColor">
                                <ColorPicker defaultValue={roleColor} onChange={(e) => {this.handleColorChange(e, "role")}}/>
                            </div>

                            <div className="FontStylePickerItalic">
                                <ItalicsCheckbox onChange={(e) => {this.handleItalicsChange(e, "role")}} checked={roleIsItalics} />
                            </div>
                        </div>

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
