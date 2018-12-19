import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddPersonIcon from '@material-ui/icons/PersonAdd';
import { List, ListItem, ListItemIcon, TextField, Collapse, ListItemSecondaryAction, IconButton, ListSubheader } from '@material-ui/core';


class CastGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
        }

    }

    render() {
        return (
            <React.Fragment>
                <ListSubheader> Group </ListSubheader>
                <ListItem>
                    <ListItemIcon>
                        <PeopleIcon/>
                    </ListItemIcon>
                    
                    <TextField placeholder="Enter Group Name..." defaultValue={this.props.name} 
                    onBlur={(e) => {this.props.onNameChange(e.target.value)}}/>

                    <ListItemSecondaryAction>
                        <IconButton onClick={this.props.onAddCastMemberButtonClick}>
                          <AddPersonIcon/>
                        </IconButton>
                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                        <IconButton onClick={() => {this.setState({open: !this.state.open})}}>
                            {this.state.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={this.state.open}>
                <List>
                    {this.props.children}
                </List>
            </Collapse>
            </React.Fragment>
        )
    }
}

export default CastGroup;