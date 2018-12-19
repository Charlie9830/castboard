import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import AddPersonIcon from '@material-ui/icons/PersonAdd';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { List, ListItem, ListItemIcon, TextField, ListItemSecondaryAction, IconButton } from '@material-ui/core';

let RoleGroup = (props) => {
    return (
        <React.Fragment>
            <ListItem>
                <ListItemIcon>
                    <PeopleIcon/>
                </ListItemIcon>
                
                <TextField placeholder="Enter Group Name..." defaultValue={props.name} 
                onBlur={(e) => {props.onNameChange(e.target.value)}}/>

                <ListItemSecondaryAction>
                    <IconButton onClick={props.onAddRoleButtonClick}>
                        <AddPersonIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <List>
                {props.children}
            </List>
        </React.Fragment>
    )
}

export default RoleGroup;