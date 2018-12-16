import React from 'react';
import { Drawer, AppBar, Toolbar, Typography, Grid, Tabs, Tab, List, Button, ListItem,
     ListItemText, FormControlLabel, TextField, Select, ListItemSecondaryAction, IconButton,
      Paper, ListItemIcon, Avatar, MenuItem } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import ScriptIcon from '@material-ui/icons/Book';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';

import GetCastMemberIdFromMap from '../utilties/GetCastMemberIdFromMap';

let BillingSelect = (props) => {
    return (
        <Select style={{marginLeft: '8px', marginRight: '8px'}} onChange={props.onChange} value={props.value} name="Billing">
            <MenuItem value="principle"> Principle </MenuItem>
            <MenuItem value="lead"> Lead </MenuItem>
            <MenuItem value="ensemble"> Ensemble </MenuItem>
        </Select>
    )
}

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
            <Avatar src={'data:image/jpg;base64,' + props.headshot }/>
        )
    }
}

let CastMemberSelect = (props) => {
    let options = props.castMembers.map( item => {
        return (
            <MenuItem key={item.uid} value={item.uid}> {item.name} </MenuItem>
        )
    });

    options.unshift(<MenuItem key={-1} value={-1}> Track Cut </MenuItem>);

    return (
        <Select onChange={props.onChange} value={props.value}>
            {options}
        </Select>
    )
}

class AppDrawer extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            currentTab: 0,
        }

        // Method Bindings.
        this.getCastTabJSX = this.getCastTabJSX.bind(this);
        this.getCastMembersJSX = this.getCastMembersJSX.bind(this);
        this.getRolesTabJSX = this.getRolesTabJSX.bind(this);
        this.getRolesJSX = this.getRolesJSX.bind(this);
        this.getCastChangeTabJSX = this.getCastChangeTabJSX.bind(this);
        this.getCastChangeListItemsJSX = this.getCastChangeListItemsJSX.bind(this);
    }

    render() {
        return (
            <Grid container
            direction="column"
            justify="flex-start"
            alignItems="flex-start">
                <AppBar position="relative">
                    <Toolbar>
                        <Typography variant="h6" color="textPrimary"> Properties  </Typography>
                        <Grid container
                        direction="row-reverse">
                        <IconButton onClick={this.props.onNextSlideButtonClick}>
                            <ArrowForwardIcon/>
                        </IconButton>
                        <Typography variant="h6" color="textPrimary"> {this.props.currentSlide} </Typography>
                        <IconButton onClick={this.props.onPrevSlideButtonClick}>
                            <ArrowBackIcon/>
                        </IconButton>
                        </Grid>
                    </Toolbar>

                    <Tabs value={this.state.currentTab} onChange={(e, value) => {this.setState({currentTab: value})}}>
                        <Tab label="Cast"/>
                        <Tab label="Roles"/>
                        <Tab label="Cast Change"/>
                        <Tab label="Slides"/>
                    </Tabs>
                </AppBar>

                { this.state.currentTab === 0 && this.getCastTabJSX()}
                { this.state.currentTab === 1 && this.getRolesTabJSX()}
                { this.state.currentTab === 2 && this.getCastChangeTabJSX()}

                
            </Grid>
        )
    }

    getCastChangeTabJSX() {
        return (
            <List style={{width: '100%'}}>
                {this.getCastChangeListItemsJSX()}
            </List>
        )
    }

    getCastChangeListItemsJSX() {
        let jsx = this.props.roles.map( item => {
            return (
                <ListItem key={item.uid}>
                    <ListItemText primary={item.name}/>
                    <ListItemSecondaryAction>
                        <CastMemberSelect castMembers={this.props.castMembers}
                         value={GetCastMemberIdFromMap(this.props.castChangeMap, item.uid)}
                         onChange={(e) => {this.props.onCastChange(item.uid, e.target.value)}}/>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        })

        return jsx;
    }

    getCastTabJSX() {
        return (
            <React.Fragment>
                    <Button variant="contained" onClick={this.props.onAddCastMemberButtonClick}> Add Cast Member </Button>
                    <List style={{ width: '100%' }}>
                        {this.getCastMembersJSX()}
                    </List>                
            </React.Fragment>
            
        )
    }

    getRolesTabJSX() {
        return (
            <React.Fragment>
                <Button variant="contained" onClick={this.props.onAddRoleButtonClick} > Add Role </Button>
                <List style={{ width: '75%'}}>
                    {this.getRolesJSX()}
                </List>
            </React.Fragment>
        )
    }

    getRolesJSX() {
        let jsx = this.props.roles.map( item => {
            return (
                <ListItem key={item.uid}>
                    <ListItemIcon>
                        <ScriptIcon/>
                    </ListItemIcon>

                    <TextField label="Character" defaultValue={item.name} onBlur={(e) => {this.props.onRoleNameChange(item.uid, e.target.value)}}/>

                    <ListItemSecondaryAction>
                        <IconButton onClick={() => {this.props.onDeleteRoleButtonClick(item.uid)}}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        })

        return jsx;
    }

    getCastMembersJSX() {
        let jsx = this.props.castMembers.map( item => {
            return (
                <ListItem key={item.uid}>
                    <HeadshotListItemIcon headshot={item.headshot}/>
                    <Grid container
                    direction="row"
                    justify="flex-start">
                        <TextField label="Name" defaultValue={item.name} onBlur={(e) => {this.props.onCastMemberNameChange(item.uid, e.target.value)}}/>
                        <BillingSelect value={item.billing} onChange={(e) => {this.props.onCastMemberBillingChange(item.uid, e.target.value)}}/>
                    </Grid>
                    

                    <ListItemSecondaryAction>
                        <IconButton onClick={() => { this.props.onAddHeadshotButtonClick(item.uid) }}>
                            <InsertPhotoIcon />
                        </IconButton>
                        <IconButton onClick={() => { this.props.onCastMemberDeleteButtonClick(item.uid) }}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>

                </ListItem>
            )
        })

        return jsx;
    }
}

export default AppDrawer;