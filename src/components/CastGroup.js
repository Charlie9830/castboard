import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import DeleteIcon from '@material-ui/icons/Delete';
import AddPersonIcon from '@material-ui/icons/PersonAdd';
import { List, ListItem, ListItemIcon, TextField, ListItemSecondaryAction, IconButton } from '@material-ui/core';

let CastGroup = (props) => {
    return (
        <React.Fragment>
            <ListItem>
                <ListItemIcon>
                    <PeopleIcon/>
                </ListItemIcon>
                
                <TextField placeholder="Enter Group Name..." defaultValue={props.name} 
                onBlur={(e) => {props.onNameChange(e.target.value)}}/>

                <ListItemSecondaryAction>
                    <IconButton onClick={props.onAddCastMemberButtonClick}>
                      <AddPersonIcon/>
                    </IconButton>
                    <IconButton onClick={props.onDeleteCastGroupButtonClick}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <List>
                {props.children}
            </List>
        </React.Fragment>
    )
}

export default CastGroup;