import React from 'react';
import { ListItem, Grid, ListItemSecondaryAction, ClickAwayListener, IconButton } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';


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
            listItemContents = this.props.openComponent;
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
        
        let openSecondaryActions = this.props.isInputOpen ? ( 
            <ListItemSecondaryAction> <IconButton onClick={() => { this.props.onInputClose()}}> <DoneIcon/> </IconButton> </ListItemSecondaryAction>
        ) : null;

        return (
                <ListItem 
                onKeyPress={this.handleKeyPress} 
                onMouseOver={() => { this.setState({ isMouseOver: true }) }} 
                onMouseLeave={() => { this.setState({ isMouseOver: false }) }}
                onClick={() => { this.props.onClick()}}
                    style={{ paddingLeft: this.props.inset === true ? "64px" : 'inherit'}}>
                    {listItemContents}

                    {openSecondaryActions}
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