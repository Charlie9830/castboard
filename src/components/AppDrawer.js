import React from 'react';
import SingleFontStylePicker from './SingleFontStylePicker';
import HeadshotFontStylePicker from './HeadshotFontStylePicker';
import OrchestraFontStylePicker from './OrchestraFontStylePicker';
import CastGroup from './CastGroup';
import CastMemberSelect from './CastMemberSelect';
import OrchestraMemberSelect from './OrchestraMemberSelect';
import CastGroupChooser from './CastGroupChooser';
import EditableListItem from './EditableListItem';

import GetRoleFromState from '../utilties/GetRoleFromState';

import { Drawer, AppBar, Toolbar, Typography, Grid, Tabs, Tab, List, Button, ListItem,
     ListItemText, FormControlLabel, TextField, Select, ListItemSecondaryAction, IconButton,
      Paper, ListItemIcon, Avatar, MenuItem, Checkbox, ListSubheader, Divider } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import AddPersonIcon from '@material-ui/icons/PersonAdd';
import AddGroupIcon from '@material-ui/icons/GroupAdd';
import ScriptIcon from '@material-ui/icons/Book';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import OpenIcon from '@material-ui/icons/FolderOpen';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import EditIcon from '@material-ui/icons/Edit';


import GetCastIdFromMap from '../utilties/GetCastIdFromMap';
import ColorPicker from './ColorPicker';
import RoleGroupFactory from '../factories/RoleGroupFactory';
import RoleGroup from './RoleGroup';
import GetOrchestraIdFromMap from '../utilties/GetOrchestraIdFromMap';
import ToTitleCase from '../utilties/ToTitleCase';

let DisplayedName = (props) => {
    if (props.name !== props.displayedName) {
        return (
            <Grid container style={{ width: '50%' }}
                direction="row"
                justify="flex-start"
                alignItems="center">
                <Typography color="textSecondary" style={{marginRight: '8px'}}> Displayed name </Typography>
                <Typography> {props.displayedName} </Typography>
            </Grid>
        )
    }

    return null;
    
}

let CastMemberClosed = (props) => {
    return (
        <React.Fragment>
        <HeadshotListItemIcon uid={props.uid} headshotUrl={props.headshot} billing={props.billing} />
        <Typography> {props.name} </Typography>
    </React.Fragment>
    )
}

let CastMemberOpen = (props) => {
    return (
        <React.Fragment>
            <TextField autoFocus style={{ marginLeft: '16px' }}
                placeholder="Enter cast name..." defaultValue={props.name}
                onChange={props.onChange}
                />

            <IconButton onClick={props.onAddHeadshotButtonClick}>
                <InsertPhotoIcon />
            </IconButton>
        </React.Fragment>
    )
}

let RoleOpen = (props) => {
    return (
        <React.Fragment>
                    <TextField autoFocus style={{ width: '192px' }}
                        label="Internal Role Name"
                        defaultValue={props.name}
                        onChange={props.onNameChange}/>

                    <TextField style={{ width: '192px', marginLeft: '8px' }}
                        value={props.displayedName}
                        label="Display Name"
                        onChange={props.onDisplayedNameChange} />

                    <BillingSelect value={props.billing} onChange={props.onBillingChange} />
                </React.Fragment>
    )
}

let HeadshotListItemIcon = (props) => {
    if (props.headshotUrl === undefined || props.headshotUrl === "") {
        return (
            <ListItemIcon>
                <PersonIcon/>
            </ListItemIcon>
        )
    }

    else {
        return (
            <ListItemIcon>
                <Avatar src={props.headshotUrl}/>
            </ListItemIcon>
            
        )
    }
}


let SlideTypeSelect = (props) => {
    return (
        <Select onChange={props.onChange} value={props.value}>
            <MenuItem value="title"> Title </MenuItem>
            <MenuItem value="cast"> Cast </MenuItem>
            <MenuItem value="orchestra"> Orchestra </MenuItem>
            <MenuItem value="info"> Information </MenuItem>
        </Select>
    )
}



let BillingSelect = (props) => {
    return (
        <Select style={{marginLeft: '8px', marginRight: '8px'}} onChange={props.onChange} value={props.value} name="Billing">
            <MenuItem value="principle"> Principle </MenuItem>
            <MenuItem value="lead"> Lead </MenuItem>
            <MenuItem value="ensemble"> Ensemble </MenuItem>
        </Select>
    )
}

let OrchestraBillingSelect = (props) => {
    return (
        <Select style={{marginLeft: '8px', marginRight: '8px'}} onChange={props.onChange} value={props.value}>
            <MenuItem value="conductor"> Conductor </MenuItem>
            <MenuItem value="associate"> Associate </MenuItem>
            <MenuItem value="musician"> Musician </MenuItem>
        </Select>
    )
}

class AppDrawer extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            primaryTab: 0,
            secondaryTab: 0
        }

        // Method Bindings.
        this.getSetupTabJSX = this.getSetupTabJSX.bind(this);
        this.getCastMembersJSX = this.getCastMembersJSX.bind(this);
        this.getRolesTabJSX = this.getRolesTabJSX.bind(this);
        this.getRolesJSX = this.getRolesJSX.bind(this);
        this.getCastChangeTabJSX = this.getCastChangeTabJSX.bind(this);
        this.getCastChangeListItemsJSX = this.getCastChangeListItemsJSX.bind(this);
        this.getSlidesTabJSX = this.getSlidesTabJSX.bind(this);
        this.getSlidesJSX = this.getSlidesJSX.bind(this);
        this.getSlidePropertiesJSX = this.getSlidePropertiesJSX.bind(this);
        this.getTitleSlidePropertiesJSX = this.getTitleSlidePropertiesJSX.bind(this);
        this.getInformationSlidePropertiesJSX = this.getInformationSlidePropertiesJSX.bind(this);
        this.getSelectedSlide = this.getSelectedSlide.bind(this);
        this.getCastSlidePropertiesJSX = this.getCastSlidePropertiesJSX.bind(this);
        this.getCastRowsJSX = this.getCastRowsJSX.bind(this);
        this.getCastTabJSX = this.getCastTabJSX.bind(this);
        this.getOrchestraSetupTabJSX = this.getOrchestraSetupTabJSX.bind(this);
        this.getOrchestraMembersJSX = this.getOrchestraMembersJSX.bind(this);
        this.getOrchestraRolesTabJSX = this.getOrchestraRolesTabJSX.bind(this);
        this.getOrchestraRolesJSX = this.getOrchestraRolesJSX.bind(this);
        this.getOrchestraChangeTabJSX = this.getOrchestraChangeTabJSX.bind(this);
        this.getOrchestraChangeItems = this.getOrchestraChangeItems.bind(this);
        this.getOrchestraSlidePropertiesJSX = this.getOrchestraSlidePropertiesJSX.bind(this);
        this.getOrchestraRowsJSX = this.getOrchestraRowsJSX.bind(this);
    }

    render() {
        return (
            <Grid container
            direction="column"
            justify="flex-start"
            alignItems="flex-start">
                <AppBar position="relative" color="secondary">
                    <Toolbar>
                        <Typography variant="h6" color="textPrimary"> Properties  </Typography>
                        <Grid container
                        direction="row-reverse">
                        <IconButton onClick={this.props.onZoomInButtonClick}>
                            <ZoomInIcon/>
                        </IconButton>
                        <IconButton onClick={this.props.onZoomOutButtonClick}>
                            <ZoomOutIcon/>
                        </IconButton>
                        <IconButton onClick={this.props.onNextSlideButtonClick}>
                            <ArrowForwardIcon/>
                        </IconButton>
                        <Typography variant="h6" color="textPrimary"> {this.props.currentSlide} </Typography>
                        <IconButton onClick={this.props.onPrevSlideButtonClick}>
                            <ArrowBackIcon/>
                        </IconButton>
                        </Grid>
                    </Toolbar>

                    <Tabs fullWidth value={this.state.primaryTab} onChange={(e, value) => {this.setState({primaryTab: value})}}>
                        <Tab label="Setup"/>
                        <Tab label="Cast Change"/>
                        <Tab label="Orchestra Change"/>
                        <Tab label="Slide Builder"/>
                    </Tabs>
                </AppBar>

                    {this.state.primaryTab === 0 && this.getSetupTabJSX()}
                    {this.state.primaryTab === 1 && this.getCastChangeTabJSX()}
                    {this.state.primaryTab === 2 && this.getOrchestraChangeTabJSX()}
                    {this.state.primaryTab === 3 && this.getSlidesTabJSX()}
                    
                
            </Grid>
        )
    }

    getOrchestraChangeTabJSX() {
        return (
            <List style={{width: '100%', paddingLeft: '16px'}}>
                {this.getOrchestraChangeItems()}
            </List>
        )
    }

    getOrchestraChangeItems() {
        let jsx = this.props.orchestraRoles.map( item => {
            return (
                <ListItem key={item.uid} divider={true}>
                    <ListItemText primary={item.name}/>
                    <ListItemSecondaryAction>
                        <OrchestraMemberSelect value={GetOrchestraIdFromMap(this.props.orchestraChangeMap, item.uid)}
                        onChange={(e) =>{this.props.onOrchestraChange(item.uid, e.target.value)}}
                        orchestraMembers={this.props.orchestraMembers}/>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        })

        return jsx;
    }

    getSlidesTabJSX() {
        let containerGrid = {
            display: 'grid',
            gridTemplateRows: '[Slides]auto [SlideProperties]auto [Theme]auto',
            width: '100%',
            padding: '8px'
        }

        let slidesContainer = {
            gridRow: 'Slides'
        }

        let themeContainer = {
            gridRow: 'Theme',
        }

        let propertiesContainer = {
            gridRow: 'SlideProperties',
        }

        return (
            <div style={containerGrid}>
                <div style={slidesContainer}>
                    <Paper style={{ width: '100%', height: '100%', padding: '8px' }}>
                        <Grid container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <Button variant="contained" onClick={this.props.onAddSlideButtonClick}> New Slide </Button>
                        </Grid>

                        <List>
                            {this.getSlidesJSX()}
                        </List>
                    </Paper>

                    <div style={propertiesContainer}>
                        <Paper style={{ width: '100%', height: '100%', padding: '8px', marginTop: '16px' }}>
                            <Typography> Slide Properties </Typography>
                            {this.getSlidePropertiesJSX()}
                        </Paper>

                    </div>

                    <div style={themeContainer}>
                        <Paper style={{ width: '100%', height: '100%', padding: '8px', marginTop: '16px' }}>
                            <Typography> Global Theme Properties </Typography>
                            <Grid container
                                direction="column"
                                justify="flex-start"
                                alignItems="flex-start">
                                <List style={{width: '100%', paddingLeft: '16px'}}>
                                    <ListItem>
                                        <ListItemText primary="Global Background Image" secondary="Used on all Slides except Title Slides" />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={this.props.onChooseBackgroundImageButtonClick}>
                                                <InsertPhotoIcon/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Slide hold time" secondary="How long in seconds will each slide hold for"/>
                                        <ListItemSecondaryAction>
                                            <TextField type="number" defaultValue={this.props.theme.holdTime}
                                             onChange={(e) => {this.props.onHoldTimeChange(e.target.value)}}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <Divider/>
                                    <ListSubheader> Cast Theme </ListSubheader>

                                    <ListItem>
                                        <ListItemText primary="Principle Text Style"/>
                                        <ListItemSecondaryAction>
                                            <HeadshotFontStylePicker 
                                            actorFontStyle={this.props.theme.principleActorFontStyle}
                                            roleFontStyle={this.props.theme.principleRoleFontStyle}
                                            onChange={this.props.onPrincipleFontStyleChange}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Lead Text Style"/>
                                        <ListItemSecondaryAction>
                                            <HeadshotFontStylePicker
                                             actorFontStyle={this.props.theme.leadActorFontStyle}
                                             roleFontStyle={this.props.theme.leadRoleFontStyle}
                                             onChange={this.props.onLeadFontStyleChange}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Ensemble Text Style"/>
                                        <ListItemSecondaryAction>
                                            <HeadshotFontStylePicker 
                                            actorFontStyle={this.props.theme.ensembleActorFontStyle}
                                            roleFontStyle={this.props.theme.ensembleRoleFontStyle}
                                            onChange={this.props.onEnsembleFontStyleChange}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Headshot Border Stroke Width"/>
                                        <ListItemSecondaryAction>
                                            <TextField style={{width: '48px'}} type="number" defaultValue={this.props.theme.headshotBorderStrokeWidth}
                                            onChange={(e) => {this.props.onHeadshotBorderStrokeWidthChange(e.target.value)}}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Headshot Border Stroke Colour"/>
                                        <ListItemSecondaryAction>
                                            <ColorPicker defaultValue={this.props.theme.headshotBorderColor} onChange={this.props.onHeadshotBorderColorChange}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <Divider/>
                                    <ListSubheader> Orchestra Theme </ListSubheader>

                                    <ListItem>
                                        <ListItemText primary="Conductor Text Style"/>
                                        <ListItemSecondaryAction>
                                            <OrchestraFontStylePicker 
                                            nameFontStyle={this.props.theme.conductorNameFontStyle}
                                            roleFontStyle={this.props.theme.conductorRoleFontStyle}
                                            onChange={this.props.onConductorFontStyleChange}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Associate/Assistant Name Style"/>
                                        <ListItemSecondaryAction>
                                            <OrchestraFontStylePicker 
                                            nameFontStyle={this.props.theme.associateNameFontStyle}
                                            roleFontStyle={this.props.theme.associateRoleFontStyle}
                                            onChange={this.props.onAssociateFontStyleChange}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Musician Name Style"/>
                                        <ListItemSecondaryAction>
                                            <OrchestraFontStylePicker 
                                            nameFontStyle={this.props.theme.musicianNameFontStyle}
                                            roleFontStyle={this.props.theme.musicianRoleFontStyle}
                                            onChange={this.props.onMusicianFontStyleChange}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </List>
                            </Grid>
                        </Paper>
                    </div>
                </div>
            </div>
        )
    }

    getSlidePropertiesJSX() {
        let selectedSlideType = this.getSelectedSlideType();

        switch (selectedSlideType) {
            case "title":
                return this.getTitleSlidePropertiesJSX();

            case "cast":
                return this.getCastSlidePropertiesJSX();
            
            case "orchestra":
                return this.getOrchestraSlidePropertiesJSX();
                return
            
            case "info":
                return this.getInformationSlidePropertiesJSX();
        }
    }

    getCastRowsJSX(selectedSlide) {
        if (selectedSlide !== undefined) {
            let jsx = selectedSlide.castRows.map( (item, index) => {

                let rolesJSX = item.roleIds.map( roleId => {
                    let role = GetRoleFromState(roleId, this.props.roles);

                    return (
                        <ListItem style={{marginLeft: '32px'}} key={role.uid}>
                            <ListItemIcon>
                                <ScriptIcon/>
                            </ListItemIcon>
                            <ListItemText inset primary={role.name}/>
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => {this.props.onCastRowRoleShiftUpButtonClick(selectedSlide.uid, item.uid, role.uid)}}>
                                    <ArrowUpIcon/>
                                </IconButton>
                                <IconButton onClick={() => {this.props.onCastRowRoleShiftDownButtonClick(selectedSlide.uid, item.uid, role.uid)}}>
                                    <ArrowDownIcon/>
                                </IconButton>
                                <IconButton 
                                onClick={() => {this.props.onCastRowRoleDeleteButtonClick(selectedSlide.uid, item.uid, role.uid)}}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })

                return (
                    <React.Fragment key={index}>
                        <ListItem key={item.uid} divider={true}>
                            <ListItemText primary={`Row ${item.rowNumber + 1}`}/>
                            <ListItemSecondaryAction>
                                <Button variant="outlined" onClick={() => { this.props.onAddRoleToCastRowButtonClick(selectedSlide.uid, item.uid) }}> Add Role </Button>
                                <IconButton onClick={() => {this.props.onCastRowDeleteButtonClick(selectedSlide.uid, item.uid)}}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {rolesJSX}
                    </React.Fragment>
                )
            })

            return jsx;
        }
    }

    getOrchestraRowsJSX(selectedSlide) {
        if (selectedSlide !== undefined) {
            let jsx = selectedSlide.orchestraRows.map( (item, index) => {

                let rolesJSX = item.roleIds.map( roleId => {
                    let role = GetRoleFromState(roleId, this.props.orchestraRoles);

                    return (
                        <ListItem style={{marginLeft: '32px'}} key={role.uid}>
                            <ListItemIcon>
                                <ScriptIcon/>
                            </ListItemIcon>
                            <ListItemText inset primary={role.name}/>
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => {this.props.onOrchestraRowRoleShiftUpButtonClick(selectedSlide.uid, item.uid, role.uid)}}>
                                    <ArrowUpIcon/>
                                </IconButton>
                                <IconButton onClick={() => {this.props.onOrchestraRowRoleShiftDownButtonClick(selectedSlide.uid, item.uid, role.uid)}}>
                                    <ArrowDownIcon/>
                                </IconButton>
                                <IconButton 
                                onClick={() => {this.props.onOrchestraRowRoleDeleteButtonClick(selectedSlide.uid, item.uid, role.uid)}}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })

                return (
                    <React.Fragment key={index}>
                        <ListItem key={item.uid} divider={true}>
                            <ListItemText primary={`Row ${item.rowNumber + 1}`}/>
                            <ListItemSecondaryAction>
                                <Button variant="outlined" onClick={() => { this.props.onAddRoleToOrchestraRowButtonClick(selectedSlide.uid, item.uid) }}> Add Role </Button>
                                <IconButton onClick={() => {this.props.onOrchestraRowDeleteButtonClick(selectedSlide.uid, item.uid)}}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {rolesJSX}
                    </React.Fragment>
                )
            })

            return jsx;
        }
    }
    
    getInformationSlidePropertiesJSX() {
        let selectedSlide = this.getSelectedSlide();
        if (selectedSlide !== undefined) {
            let informationText = selectedSlide.informationText;

            return (
                <List>
                    <ListItem>
                        <ListItemText primary="Text" />
                    </ListItem>
                    <ListItemSecondaryAction>
                        <Grid container
                            direction="row"
                            justify="flex-end"
                            alignItems="center">
                            <TextField style={{ width: '75%' }} multiline defaultValue={informationText}
                                onChange={(e) => { this.props.onInformationTextChange(selectedSlide.uid, e.target.value) }} />
                            <SingleFontStylePicker fontStyle={selectedSlide.informationTextFontStyle}
                                onChange={(fontStyle) => { this.props.onInformationTextFontStyleChange(selectedSlide.uid, fontStyle) }} />
                        </Grid>
                    </ListItemSecondaryAction>
                </List> 
            )
        }
    }

    getCastSlidePropertiesJSX() {
        let selectedSlide = this.getSelectedSlide();

        return (
            <Grid container
            direction="column"
            justify="flex-start"
            alignItems="flex-start">
                
                <List style={{width: '90%', paddingLeft: '16px'}}>
                    <ListItem divider={true}>
                        <ListItemText primary="Slide Title" />
                        <ListItemSecondaryAction>
                            <TextField placeholder="Enter a Title for this Slide"
                             defaultValue={selectedSlide.title} 
                             onChange={(e) => {this.props.onSlideTitleChange(selectedSlide.uid, e.target.value)}}/>
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem divider={true}>
                        <ListItemText primary="Slide Title Style"/>
                        <ListItemSecondaryAction>
                            <SingleFontStylePicker fontStyle={selectedSlide.titleFontStyle}
                            onChange={ fontStyle => {this.props.onSlideTitleFontStyleChange(selectedSlide.uid, fontStyle)}}/>
                        </ListItemSecondaryAction>
                    </ListItem>

                    
                    <Paper style={{padding: '8px', marginTop: '24px'}}>
                        <Typography variant="subheading"> Headshot Rows </Typography>
                        <Button variant="contained" style={{marginTop: '8px'}}
                            onClick={() => { this.props.onAddRowToSlideButtonClick(this.props.selectedSlideId) }}> Add Row </Button>
                        <List style={{ width: '90%', paddingLeft: '16px' }}>
                            {this.getCastRowsJSX(this.getSelectedSlide())}
                        </List>
                    </Paper>
                    
                </List>

            </Grid>
        )
    }

    getOrchestraSlidePropertiesJSX() {
        let selectedSlide = this.getSelectedSlide();

        return (
            <Grid container
            direction="column"
            justify="flex-start"
            alignItems="flex-start">
                
                <List style={{width: '90%', paddingLeft: '16px'}}>
                    <Paper style={{padding: '8px', marginTop: '24px'}}>
                        <Typography variant="subheading"> Orchestra Member Rows </Typography>
                        <Button variant="contained" style={{marginTop: '8px'}}
                            onClick={() => { this.props.onAddOrchestraRowToSlideButtonClick(this.props.selectedSlideId) }}> Add Row </Button>
                        <List style={{ width: '90%', paddingLeft: '16px' }}>
                            {this.getOrchestraRowsJSX(this.getSelectedSlide())}
                        </List>
                    </Paper>
                    
                </List>

            </Grid>
        )
    }

    getTitleSlidePropertiesJSX() {
        return (
            <Button variant="contained" onClick={this.props.onChooseTitleSlideImageButtonClick}> Choose Title Image </Button>
        )
    }

    getSelectedSlide() {
        if (this.props.selectedSlideId !== -1) {
            return this.props.slides.find(item => {
                return item.uid === this.props.selectedSlideId;
            })
        }
    }

    getSelectedSlideType() {
        if (this.props.selectedSlideId !== -1) {
            return this.getSelectedSlide().type;
        }
    }

    getSlidesJSX() {
        let sortedSlides = this.props.slides.sort((a,b) => { return a.number - b.number})

        let slidesJSX = sortedSlides.map( item => {
            let selected = item.uid === this.props.selectedSlideId;

            return (
                    <ListItem key={item.uid} selected={selected} onClick={() => { this.props.onSlideSelect(item.uid) }}>
                        <ListItemIcon>
                            <Typography> {item.number + 1} </Typography>
                        </ListItemIcon>
                        <TextField label="Name" defaultValue={item.name} onBlur={(e) => { this.props.onSlideNameChange(item.uid, e.target.value) }} />
                        <ListItemSecondaryAction>
                            <SlideTypeSelect value={item.type} onChange={(e) => { this.props.onSlideTypeChange(item.uid, e.target.value) }} />
                            <IconButton onClick={() => { this.props.onReorderSlideButtonClick(item.uid, "up") }}>
                                <ArrowUpIcon />
                            </IconButton>
                            <IconButton onClick={() => { this.props.onReorderSlideButtonClick(item.uid, "down") }}>
                                <ArrowDownIcon />
                            </IconButton>
                            <IconButton onClick={() => { this.props.onDeleteSlideButtonClick(item.uid) }}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
            )
        })

        return slidesJSX;
    }

    getCastChangeTabJSX() {
        return (
            <List style={{width: '100%', paddingLeft: '16px'}}>
                {this.getCastChangeListItemsJSX()}
            </List>
        )
    }

    getCastChangeListItemsJSX() {
        let individualRolesSubheadingJSX = [(<ListSubheader key="individualrolessubheader"> Individual Roles </ListSubheader>)];

        let individualRoles = this.props.roles.filter( item => {
            return item.groupId === "-1";
        })

        let individualRolesJSX = individualRoles.map( item => {
            return (
                <ListItem key={item.uid} divider={true}>
                    <ListItemText primary={item.name}/>
                    <ListItemSecondaryAction>
                        <CastMemberSelect castMembers={this.props.castMembers}
                         value={GetCastIdFromMap(this.props.castChangeMap, item.uid)}
                         onChange={(e) => {this.props.onCastChange(item.uid, e.target.value)}}/>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        })

        let roleGroupSubheadingJSX = [(<ListSubheader key="rolegroupssubheader"> Role Groups </ListSubheader>)];

        let roleGroupJSX = this.props.roleGroups.map ( item => {
            let castId = GetCastIdFromMap(this.props.castChangeMap, item.uid);
            let relatedRoles = this.props.roles.filter( role => {
                return role.groupId === item.uid;
            })

            let relatedRolesJSX = relatedRoles.map( (role, index) => {
                return (
                    <ListItem key={role.uid} style={{ paddingLeft: '64px' }}>
                        <ListItemText primary={role.name} />
                        <ListItemSecondaryAction>
                            <CastMemberSelect castMembers={this.props.castMembers}
                            value={GetCastIdFromMap(this.props.castChangeMap, role.uid)} />
                        </ListItemSecondaryAction>
                    </ListItem>
                )  
            })

            return (
                <React.Fragment key={item.uid}>
                    <ListItem>
                        <ListItemText primary={item.name}/>
                        <ListItemSecondaryAction>
                            <CastGroupChooser castGroups={this.props.castGroups}
                                onChoose={(groupId) => { this.props.onGroupCastChange(item.uid, groupId) }} />
                        </ListItemSecondaryAction>
                    </ListItem>
                    {relatedRolesJSX}
                </React.Fragment>
            )
        })

        return [...individualRolesSubheadingJSX, ...individualRolesJSX, ...roleGroupSubheadingJSX, ...roleGroupJSX];
    }

    getSetupTabJSX() {
        return (
            <React.Fragment>
                <AppBar position="relative" color="secondary">
                    <Toolbar>
                        <Tabs fullWidth value={this.state.secondaryTab} onChange={ (e, value) => { this.setState({ secondaryTab: value})}}>
                            <Tab label="Cast" />
                            <Tab label="Roles" />
                            <Tab label="Orchestra"/>
                            <Tab label="Orchestra Roles"/>
                        </Tabs>
                    </Toolbar>
                </AppBar>
                    
                    { this.state.secondaryTab === 0 && this.getCastTabJSX() }
                    { this.state.secondaryTab === 1 && this.getRolesTabJSX() }
                    { this.state.secondaryTab === 2 && this.getOrchestraSetupTabJSX()}
                    { this.state.secondaryTab === 3 && this.getOrchestraRolesTabJSX()}
            </React.Fragment>
            
        )
    }

    getOrchestraRolesTabJSX() {
        return (
            <React.Fragment>
                <Grid container
                    direction="row">
                    <Button variant="contained" onClick={this.props.onAddOrchestraRoleButtonClick}> Add Orchestra Role </Button>
                </Grid>
                <List style={{width: '100%', paddingLeft: '16px'}}>
                    {this.getOrchestraRolesJSX()}
                </List>
            </React.Fragment>
        )
    }

    getOrchestraRolesJSX() {
        let jsx = this.props.orchestraRoles.map( item => {
            let openComponent = (
                <React.Fragment>
                    <TextField autoFocus defaultValue={item.name}
                        onChange={(e) => { this.props.onOrchestraRoleNameChange(item.uid, e.target.value) }} />
                    <OrchestraBillingSelect value={item.billing}
                        onChange={(e) => { this.props.onOrchestraRoleBillingChange(item.uid, e.target.value) }} />
                </React.Fragment>
            )

            let closedComponentSecondaryActions = (
                <React.Fragment>
                        <IconButton onClick={() => { this.props.onEditListItemButtonClick(item.uid, "orchestraRole")}}>
                            <EditIcon/>
                        </IconButton>

                        <IconButton onClick={() => { this.props.onOrchestraRoleDeleteButtonClick(item.uid)}}>
                            <DeleteIcon />
                        </IconButton>
                </React.Fragment>
            )

            let closedComponent = (
                <React.Fragment>
                    <ListItemIcon>
                        <ScriptIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.name} secondary={ToTitleCase(item.billing)} />
                </React.Fragment>
            )

            let isOpen = item.uid === this.props.openInputId;

            return (
                <EditableListItem key={item.uid} isInputOpen={isOpen} onInputClose={() => { this.props.onListItemInputClose(item.uid, "orchestraRole")}}
                openComponent={openComponent}
                closedComponentSecondaryActions={closedComponentSecondaryActions}
                closedComponent={closedComponent}/>
            )
        })

        return jsx;
    }

    getOrchestraSetupTabJSX() {
        return (
            <React.Fragment>
                <Grid container
                    direction="row">
                    <IconButton onClick={this.props.onAddOrchestraMemberButtonClick}>
                        <AddPersonIcon/>
                    </IconButton>
                </Grid>

                <List style={{width: '100%', paddingLeft: '16px'}}>
                    {this.getOrchestraMembersJSX()}
                </List>
            </React.Fragment>
        )
    }

    getOrchestraMembersJSX() {
        let jsx = this.props.orchestraMembers.map( item => {

            let isInputOpen = item.uid === this.props.openInputId;

            let closedComponent = (
                <React.Fragment>
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>

                    <ListItemText primary={item.name} />
                </React.Fragment>

            )

            let closedComponentSecondaryActions = (
                <React.Fragment>
                    <IconButton onClick={() => { this.props.onEditListItemButtonClick(item.uid, "orchestraMember") }}>
                        <EditIcon />
                    </IconButton>

                    <IconButton onClick={() => { this.props.onOrchestraMemberDeleteButtonClick(item.uid) }}>
                        <DeleteIcon />
                    </IconButton>
                </React.Fragment>
            )

            
            let openComponent = (
                <TextField autoFocus defaultValue={item.name} label="Name"
                    onChange={(e) => {this.props.onOrchestraMemberNameChange(item.uid, e.target.value)}}/>
            )

            return (
                <EditableListItem key={item.uid} onInputClose={() => { this.props.onListItemInputClose(item.uid, "orchestraMember")}}
                isInputOpen={isInputOpen}
                openComponent={openComponent}
                closedComponent={closedComponent}
                closedComponentSecondaryActions={closedComponentSecondaryActions}
                />
            )
        })

        return jsx;
    }

    getCastTabJSX() {
        return (
            <React.Fragment>
                <Grid container
                    direction="row">
                    <IconButton  onClick={this.props.onAddCastMemberButtonClick}>
                        <AddPersonIcon/>
                    </IconButton>
                    
                    <IconButton onClick={this.props.onAddCastGroupButtonClick}> 
                        <AddGroupIcon/>
                    </IconButton>
                </Grid>
               
                <List style={{ width: '100%', paddingLeft: '16px' }}>
                    { this.getCastMembersJSX() }
                </List>
            </React.Fragment>
        )
    }

    getRolesTabJSX() {
        return (
            <React.Fragment>
                <Grid container
                    direction="row">
                    <Button variant="contained" onClick={this.props.onAddRoleButtonClick} > Add Role </Button>
                    <Button variant="contained" onClick={this.props.onAddRoleGroupButtonClick}> Add Role Group </Button>
                </Grid>
                

                <List style={{ width: '100%', paddingLeft: '16px'}}>
                    {this.getRolesJSX()}
                </List>
            </React.Fragment>
        )
    }

    getRolesJSX() {
        let individualRoles = [];
        let groupedRoles = [];

        this.props.roles.forEach( item => {
            if (item.groupId === "-1") {
                individualRoles.push(item);
            }

            else {
                groupedRoles.push(item);
            }
        })

        let individualRolesJSX = individualRoles.map( item => {
            let openComponent = (
                <RoleOpen key={item.uid} name={item.name} displayedName={item.displayedName} billing={item.billing}
                onNameChange={(e) => { this.props.onRoleNameChange(item.uid, e.target.value) }}
                onDisplayedNameChange={(e) => { this.props.onRoleDisplayedNameChange(item.uid, e.target.value) }}
                onBillingChange={(e) => { this.props.onRoleBillingChange(item.uid, e.target.value) }}
                />
            )

            let closedComponentSecondaryActions = (
                <React.Fragment>
                        <IconButton onClick={() => { this.props.onEditListItemButtonClick(item.uid, "role")}}>
                            <EditIcon/>
                        </IconButton>

                        <IconButton onClick={() => { this.props.onDeleteRoleButtonClick(item.uid)}}>
                            <DeleteIcon />
                        </IconButton>
                </React.Fragment>
            )

            let closedComponent = (
                <React.Fragment>
                    <ListItemIcon>
                        <ScriptIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.name} secondary={ToTitleCase(item.billing)} />
                    <DisplayedName name={item.name} displayedName={item.displayedName}/>
                </React.Fragment>
            )

            let isOpen = item.uid === this.props.openInputId;

            return (
                <EditableListItem key={item.uid} isInputOpen={isOpen} onInputClose={() => { this.props.onListItemInputClose(item.uid, "role")}}
                openComponent={openComponent}
                closedComponentSecondaryActions={closedComponentSecondaryActions}
                closedComponent={closedComponent}/>
            )
        })

        let roleGroupsJSX = this.props.roleGroups.map( item => {
            let groupedRolesJSX = groupedRoles.map( role => {
                if (role.groupId !== item.uid) {
                    return null;
                }

                else {
                    let openComponent = (
                        <RoleOpen key={role.uid} name={role.name} displayedName={role.displayedName} billing={role.billing}
                        onNameChange={(e) => { this.props.onRoleNameChange(role.uid, e.target.value) }}
                        onDisplayedNameChange={(e) => { this.props.onRoleDisplayedNameChange(role.uid, e.target.value) }}
                        onBillingChange={(e) => { this.props.onRoleBillingChange(role.uid, e.target.value) }}
                        />
                    )
        
                    let closedComponentSecondaryActions = (
                        <React.Fragment>
                                <IconButton onClick={() => { this.props.onEditListItemButtonClick(role.uid, "role")}}>
                                    <EditIcon/>
                                </IconButton>
        
                                <IconButton onClick={() => { this.props.onDeleteRoleButtonClick(role.uid)}}>
                                    <DeleteIcon />
                                </IconButton>
                        </React.Fragment>
                    )
        
                    let closedComponent = (
                        <React.Fragment>
                            <ListItemIcon>
                                <ScriptIcon />
                            </ListItemIcon>
                            <ListItemText primary={role.name} secondary={ToTitleCase(role.billing)} />
                            <DisplayedName name={role.name} displayedName={role.displayedName}/>
                        </React.Fragment>
                    )
        
                    let isOpen = role.uid === this.props.openInputId;
        
                    return (
                        <EditableListItem inset={true} key={role.uid} isInputOpen={isOpen} onInputClose={() => { this.props.onListItemInputClose(role.uid, "role")}}
                        openComponent={openComponent}
                        closedComponentSecondaryActions={closedComponentSecondaryActions}
                        closedComponent={closedComponent}/>
                    )
                }
            })

            return (
                <RoleGroup key={item.uid} name={item.name}
                    onDeleteRoleGroupButtonClick={() => {this.props.onRoleGroupDeleteButtonClick(item.uid)}}
                    onAddRoleButtonClick={() => { this.props.onAddRoleToGroupButtonClick(item.uid) }}
                    onNameChange={(newValue) => { this.props.onRoleGroupNameChange(item.uid, newValue)}}>
                    {groupedRolesJSX}
                </RoleGroup>
            )
            
        })

        return [
            ...[(<ListSubheader key="individualroles"> Individual Roles </ListSubheader>)],
            ...individualRolesJSX,
            ...[(<ListSubheader key="rolegroups"> Role Groups </ListSubheader>)],
            ...roleGroupsJSX,
        ];
    }

    getCastMembersJSX() {
        let ungroupedCast = this.props.castMembers.filter(item => {
            return item.groupId === "-1";
        })

        let ungroupedCastJSX = ungroupedCast.map( item => {
            let isInputOpen = item.uid === this.props.openInputId;

            let closedComponent = <CastMemberClosed uid={item.uid} headshot={item.thumbnailUrl} billing={item.billing} name={item.name}/>

            let closedComponentSecondaryActions = (
                <React.Fragment>
                    <IconButton onClick={() => { this.props.onEditListItemButtonClick(item.uid, "castMember") }}>
                        <EditIcon />
                    </IconButton>

                    <IconButton onClick={() => { this.props.onCastMemberDeleteButtonClick(item.uid) }}>
                        <DeleteIcon />
                    </IconButton>
                </React.Fragment>
            )

            
            let openComponent = (
                <CastMemberOpen name={item.name}
                    onChange={(e) => { this.props.onCastMemberNameChange(item.uid, e.target.value) }}
                    onAddHeadshotButtonClick={() => { this.props.onAddHeadshotButtonClick(item.uid) }} />
            )

            return (
                <EditableListItem key={item.uid} onInputClose={() => { this.props.onListItemInputClose(item.uid, "castMember")}}
                isInputOpen={isInputOpen}
                openComponent={openComponent}
                closedComponent={closedComponent}
                closedComponentSecondaryActions={closedComponentSecondaryActions}
                />
            )
        })

        let groupedCast = this.props.castMembers.filter(item => {
            return item.groupId !== "-1";
        })

        let groupJSX = this.props.castGroups.map( item => {
            let castMembersJSX = groupedCast.map( castMember => {
                let isInputOpen = castMember.uid === this.props.openInputId;

                if (castMember.groupId !== item.uid) {
                    return null;
                }

                let openComponent = (
                    <CastMemberOpen name={castMember.name}
                    onChange={(e) => { this.props.onCastMemberNameChange(castMember.uid, e.target.value) }}
                    onKeyPress={(e) => { this.handleTextFieldKeyPress(e, this.props.onCastMemberNameChange, castMember.uid) }}
                    onAddHeadshotButtonClick={() => { this.props.onAddHeadshotButtonClick(castMember.uid) }} />
                )

                let closedComponent = (
                    <CastMemberClosed uid={castMember.uid} headshot={castMember.headshot}
                     billing={castMember.billing} name={castMember.name}/>
                )

                let closedComponentSecondaryActions = (
                    <React.Fragment>
                    <IconButton onClick={() => { this.props.onEditListItemButtonClick(castMember.uid, "castMember") }}>
                        <EditIcon />
                    </IconButton>

                    <IconButton onClick={() => { this.props.onCastMemberDeleteButtonClick(castMember.uid) }}>
                        <DeleteIcon />
                    </IconButton>
                </React.Fragment>
                )

                return (
                    <EditableListItem key={castMember.uid} onInputClose={() => { this.props.onListItemInputClose(castMember.uid, "castMember")}}
                    isInputOpen={isInputOpen}
                    openComponent={openComponent}
                    closedComponent={closedComponent}
                    closedComponentSecondaryActions={closedComponentSecondaryActions}
                    
                    />
                )
            })

            return (
                <CastGroup key={item.uid}
                onAddCastMemberButtonClick={(e) => {this.props.onAddCastMemberToGroupButtonClick(item.uid)}}
                name={item.name} onNameChange={(newValue) => {this.props.onCastGroupNameChange(item.uid, newValue)}}
                onDeleteCastGroupButtonClick={() => {this.props.onCastGroupDeleteButtonClick(item.uid)}} >
                    {castMembersJSX}
                </CastGroup>
            )
        })

        return [
            ...[(<ListSubheader key="individualcast" disableSticky> Individual Cast</ListSubheader>)],
            ...ungroupedCastJSX,
            ...[(<ListSubheader key="castgroups" disableSticky> Cast Groups </ListSubheader>)],
            ...groupJSX
            ];
    }

    handleTextFieldKeyPress(e, callback, targetUid) {
        if (e.key === "Enter") {
            callback(targetUid, e.target.value);
        }
    }
}

export default AppDrawer;