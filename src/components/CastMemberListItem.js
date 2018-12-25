import React from 'react';
import { ListItem, Grid, ListItemSecondaryAction, ListItemIcon, IconButton, Avatar,
     Popover, Typography, TextField, Zoom, ClickAwayListener } from '@material-ui/core';

import InsertPhotoIcon  from '@material-ui/icons/InsertPhoto';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';

let HeadshotListItemIcon = (props) => {
    if (props.headshot === undefined) {
        return (
            <ListItemIcon>
                <PersonIcon/>
            </ListItemIcon>
        )
    }

    else {
        return (
            <ListItemIcon>
                <Avatar src={'data:image/jpg;base64,' + props.headshot }/>
            </ListItemIcon>
            
        )
    }
}

class CastMemberListItem extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.listItemRef = React.createRef();

        // State.
        this.state = {
            isMouseOver: false,
        }

        // Method Bindings.
        this.handleTextFieldKeyPress = this.handleTextFieldKeyPress.bind(this);
    }

    render() {
        let listItemContents;
        if (this.props.isInputOpen) {
            listItemContents = (
                <ClickAwayListener onClickAway={this.props.onInputClose}>
                        <Grid style={{ width: '100%', height: '100%', padding: '8px' }}
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center">
                            <TextField autoFocus style={{ marginLeft: '16px' }}
                                placeholder="Enter cast name..." defaultValue={this.props.name}
                                onBlur={(e) => { this.props.onNameChange(e.target.value) }}
                                onKeyPress={this.handleTextFieldKeyPress} />

                            <IconButton onClick={this.props.onAddHeadshotButtonClick}>
                                <InsertPhotoIcon />
                            </IconButton>
                        </Grid>
                </ClickAwayListener>
            )
        }

        else {
            let buttonStyle = {
                visibility: this.state.isMouseOver ? "visible" : "hidden",
            }

            listItemContents = (
                <React.Fragment>
                    <HeadshotListItemIcon uid={this.props.uid} headshot={this.props.headshot} billing={this.props.billing} />
                    
                    <Typography> {this.props.name} </Typography>

                    <ListItemSecondaryAction>
                            <IconButton style={buttonStyle} onClick={this.props.onEditButtonClick}>
                                <EditIcon />
                            </IconButton>
                        
                            <IconButton style={buttonStyle} hidden={!this.state.isMouseOver} onClick={this.props.onDeleteButtonClick}>
                                <DeleteIcon />
                            </IconButton>
                    </ListItemSecondaryAction>
                </React.Fragment>
            )
        }
        

        return (
            <div ref={this.listItemRef}>
                <ListItem onMouseOver={() => { this.setState({ isMouseOver: true }) }} onMouseLeave={() => { this.setState({ isMouseOver: false }) }}
                    style={{ paddingLeft: this.props.inset === true ? "64px" : 'inherit' }}>
                    {listItemContents}
                </ListItem>
            </div>
            
        )
    }   

    handleTextFieldKeyPress(e) {
        if (e.key === "Enter") {
            this.props.onNameChange(e.target.value);
            this.props.onInputClose();
        }  
    }
}



export default CastMemberListItem;