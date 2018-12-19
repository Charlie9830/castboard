import React from 'react';
import { Grid, FormControlLabel, TextField, Checkbox, Paper, Popover, IconButton } from '@material-ui/core';
import '../assets/css/FontStylePicker.css';
import EditIcon from '@material-ui/icons/Create';
import ColorPicker from './ColorPicker';


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

class FontStylePicker extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.buttonRef = React.createRef();
        this.nativeColorInputRef = React.createRef();

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
        let fontFamily = this.props.fontStyle !== undefined ? this.props.fontStyle.fontFamily : "Comic Sans MT";
        let fontSize = this.props.fontStyle !== undefined  ? this.props.fontStyle.fontSize : 12;
        let isBold = this.props.fontStyle !== undefined ? this.props.fontStyle.bold : false;
        let isItalics =  this.props.fontStyle !== undefined ? this.props.fontStyle.italics : false;
        let color = this.props.fontStyle !== undefined ? this.props.fontStyle.color : "#000000";

        return (
            <React.Fragment>
                <IconButton buttonRef={this.buttonRef} hidden={this.state.open} onClick={this.openPopover}>
                    <EditIcon/>
                </IconButton>

                <Popover open={this.state.open} anchorEl={this.buttonRef.current} onBackdropClick={this.closePopover}
                onClose={this.closePopover}>
                    <Grid item style={{padding: '16px'}}>
                        <div className="FontStylePickerGrid">
                            <div className="FontStylePickerFontFamily">
                                <FontSelector onBlur={this.handleFontFamilyChange} defaultValue={fontFamily} />
                            </div>

                            <div className="FontStylePickerFontSize">
                                <FontSizeField onChange={this.handleFontSizeChange} defaultValue={fontSize} />
                            </div>

                            <div className="FontStylePickerBold">
                                <BoldCheckbox onChange={this.handleBoldChange} checked={isBold} />
                            </div>

                            <div className="FontStylePickerColor">
                                <ColorPicker defaultValue={color} onChange={this.handleColorChange}/>
                            </div>

                            <div className="FontStylePickerItalic">
                                <ItalicsCheckbox onChange={this.handleItalicsChange} checked={isItalics} />
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

    handleColorChange(newValue) {

        let newFontStyle = {...this.props.fontStyle};
        newFontStyle.color = newValue;

        this.props.onChange(newFontStyle);
    }

    handleFontFamilyChange(e) {
        let newValue = e.target.value;

        let newFontStyle = {...this.props.fontStyle};
        newFontStyle.fontFamily = newValue;

        this.props.onChange(newFontStyle);
    }

    handleFontSizeChange(e) {
        let newValue = e.target.value;

        let newFontStyle = {...this.props.fontStyle};
        newFontStyle.fontSize = newValue;

        this.props.onChange(newFontStyle);
    }

    handleBoldChange(e) {
        let newValue = e.target.checked;

        let newFontStyle = {...this.props.fontStyle};
        newFontStyle.bold = newValue;

        this.props.onChange(newFontStyle);
    }

    handleItalicsChange(e) {
        let newValue = e.target.checked;

        let newFontStyle = {...this.props.fontStyle};
        newFontStyle.italics = newValue;

        this.props.onChange(newFontStyle);
    }
}

export default FontStylePicker;
