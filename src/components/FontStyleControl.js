import React from 'react';
import ColorPicker from './ColorPicker';
import '../assets/css/FontStyleControl.css';
import { Grid, FormControlLabel, TextField, Checkbox, Paper, Popover, IconButton, Typography, Button, SvgIcon, MenuItem } from '@material-ui/core';
import AppContext from '../contexts/AppContext';

let PasteContentIcon = (props) => {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" width="24" height="24">
            <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>
        </SvgIcon>
    )
}

let CopyContentIcon = (props) => {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" width="24" height="24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
        </SvgIcon>
    )
    
}

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

let CasingCheckbox = (props) => {
    return (
        <FormControlLabel label="Uppercase" 
        control={<Checkbox checked={props.checked} onChange={props.onChange}/>}
        />
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

class FontStyleControl extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.buttonRef = React.createRef();
        this.nativeColorInputRef = React.createRef();

        // Method Bindings.
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this);
        this.handleFontSizeChange = this.handleFontSizeChange.bind(this);
        this.handleBoldChange = this.handleBoldChange.bind(this);
        this.handleItalicsChange = this.handleItalicsChange.bind(this);
        this.handleCopyFontStyleButtonClick = this.handleCopyFontStyleButtonClick.bind(this);
        this.handlePasteFontStyleButtonClick = this.handlePasteFontStyleButtonClick.bind(this);
        this.handleCasingChange = this.handleCasingChange.bind(this);
    }

    render() {
        let { fontStyleClipboard } = this.context;

        let fontFamily = this.props.fontStyle !== undefined ? this.props.fontStyle.fontFamily : "Comic Sans MT";
        let fontSize = this.props.fontStyle !== undefined  ? this.props.fontStyle.fontSize : 12;
        let isBold = this.props.fontStyle !== undefined ? this.props.fontStyle.bold : false;
        let isItalics =  this.props.fontStyle !== undefined ? this.props.fontStyle.italics : false;
        let isUppercase = this.props.fontStyle !== undefined ? this.props.fontStyle.uppercase : false;
        let color = this.props.fontStyle !== undefined ? this.props.fontStyle.color : "#000000";

        return (
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
                        <ColorPicker defaultValue={color} onChange={this.handleColorChange} />
                    </div>

                    <div className="FontStylePickerCasing">
                        <CasingCheckbox checked={isUppercase} onChange={this.handleCasingChange}/>
                    </div>

                    <div className="FontStylePickerItalic">
                        <ItalicsCheckbox onChange={this.handleItalicsChange} checked={isItalics} />
                    </div>

                    <div className="FontStylePickerCopyStyle">
                        <IconButton onClick={this.handleCopyFontStyleButtonClick}>
                            <CopyContentIcon/>
                        </IconButton>
                    </div>

                    <div className="FontStylePickerPasteStyle">
                        <IconButton disabled={fontStyleClipboard === null} onClick={this.handlePasteFontStyleButtonClick}>
                            <PasteContentIcon/>
                        </IconButton>
                    </div>
                </div>
        )
    }

    handleCasingChange(e) {
        let value = e.target.checked;

        let newFontStyle = {...this.props.fontStyle};
        newFontStyle.uppercase = value;

        this.props.onChange(newFontStyle);
    }

    handleCopyFontStyleButtonClick() {
        let { setFontStyleClipboard } = this.context;
        setFontStyleClipboard({...this.props.fontStyle});
    }

    handlePasteFontStyleButtonClick() {
        let { fontStyleClipboard } = this.context;
        if (fontStyleClipboard !== null) {
            this.props.onChange(fontStyleClipboard);
        }
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


FontStyleControl.contextType = AppContext;
export default FontStyleControl;