import React from 'react';
import { ListItem, Grid, ListItemSecondaryAction, ClickAwayListener } from '@material-ui/core';

class EditableListItem extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            isMouseOver: false,
        }

        // Method Bindings.
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    render() {
        let listItemContents;
        if (this.props.isInputOpen) {
            listItemContents = (
                <ClickAwayListener onClickAway={this.props.onInputClose}>
                        <Grid style={{ width: '100%', height: '100%', padding: '8px' }} onKeyPress={this.handleKeyPress}
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center">
                                {this.props.openComponent}
                        </Grid>
                </ClickAwayListener>
            )
        }

        else {
            let secondaryActionStyle = {
                visibility: this.state.isMouseOver ? "visible" : "hidden",
            }

            listItemContents = (
                <React.Fragment>
                    {this.props.closedComponent}

                    <ListItemSecondaryAction style={secondaryActionStyle}>
                        {this.props.closedComponentSecondaryActions}
                    </ListItemSecondaryAction>
                </React.Fragment>
            )
        }
        

        return (
                <ListItem onMouseOver={() => { this.setState({ isMouseOver: true }) }} onMouseLeave={() => { this.setState({ isMouseOver: false }) }}
                    style={{ paddingLeft: this.props.inset === true ? "64px" : 'inherit' }}>
                    {listItemContents}
                </ListItem>            
        )
    } 

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.props.onInputClose();
        }
    }
}



export default EditableListItem;