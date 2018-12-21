import React from 'react';
import { Grid, FormControlLabel, TextField, Checkbox, Paper, Popover, IconButton } from '@material-ui/core';
import FontStyleControl from './FontStyleControl'
import EditIcon from '@material-ui/icons/Create';


class SingleFontStylePicker extends React.Component {
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
                <Grid style={{padding: '16px'}}>
                    <FontStyleControl onChange={this.props.onChange} fontStyle={this.props.fontStyle}/>
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

export default SingleFontStylePicker;
