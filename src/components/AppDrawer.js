import React from 'react';
import FontStylePicker from './FontStylePicker';
import HeadshotFontStylePicker from './HeadshotFontStylePicker';
import { Drawer, AppBar, Toolbar, Typography, Grid, Tabs, Tab, List, Button, ListItem,
     ListItemText, FormControlLabel, TextField, Select, ListItemSecondaryAction, IconButton,
      Paper, ListItemIcon, Avatar, MenuItem, Checkbox } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
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

import GetCastMemberIdFromMap from '../utilties/GetCastMemberIdFromMap';
import ColorPicker from './ColorPicker';

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
            primaryTab: 2,
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
    }

    render() {
        return (
            <Grid container
            direction="column"
            justify="flex-start"
            alignItems="flex-start">
                <AppBar position="sticky" color="secondary">
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

                    <Tabs value={this.state.primaryTab} onChange={(e, value) => {this.setState({primaryTab: value})}}>
                        <Tab label="Setup"/>
                        <Tab label="Cast Change"/>
                        <Tab label="Slide Builder"/>
                    </Tabs>
                </AppBar>

                    {this.state.primaryTab === 0 && this.getSetupTabJSX()}
                    {this.state.primaryTab === 1 && this.getCastChangeTabJSX()}
                    {this.state.primaryTab === 2 && this.getSlidesTabJSX()}
                
            </Grid>
        )
    }

    getSlidesTabJSX() {
        let containerGrid = {
            display: 'grid',
            gridTemplateRows: '[Slides]320px [SlideProperties]auto [Theme]auto',
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
                    <Paper style={{ width: '100%', height: '100%', padding: '8px', overflowY: 'auto' }}>
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
                                <List style={{width: '75%'}}>
                                    <ListItem>
                                        <ListItemText primary="Global Background Image" secondary="Used on all Slides except Title Slides" />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={this.props.onChooseBackgroundImageButtonClick}>
                                                <InsertPhotoIcon/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Principle Name Style"/>
                                        <ListItemSecondaryAction>
                                            <HeadshotFontStylePicker 
                                            actorFontStyle={this.props.theme.principleActorFontStyle}
                                            roleFontStyle={this.props.theme.principleRoleFontStyle}
                                            onChange={this.props.onPrincipleFontStyleChange}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Lead Name Style"/>
                                        <ListItemSecondaryAction>
                                            <HeadshotFontStylePicker
                                             actorFontStyle={this.props.theme.leadActorFontStyle}
                                             roleFontStyle={this.props.theme.leadRoleFontStyle}
                                             onChange={this.props.onLeadFontStyleChange}/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Ensemble Name Style"/>
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
                return
            
            case "info":
                return this.getInformationSlidePropertiesJSX();
        }
    }

    getCastRowsJSX(selectedSlide) {
        if (selectedSlide !== undefined) {
            let jsx = selectedSlide.castRows.map( (item, index) => {

                let rolesJSX = item.roles.map( role => {
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
                            <FontStylePicker fontStyle={selectedSlide.informationTextFontStyle}
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
                
                <List style={{width: '90%'}}>
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
                            <FontStylePicker fontStyle={selectedSlide.titleFontStyle}
                            onChange={ fontStyle => {this.props.onSlideTitleFontStyleChange(selectedSlide.uid, fontStyle)}}/>
                        </ListItemSecondaryAction>
                    </ListItem>

                    
                    <Paper style={{padding: '8px', marginTop: '24px'}}>
                        <Typography variant="subheading"> Headshot Rows </Typography>
                        <Button variant="contained" style={{marginTop: '8px'}}
                            onClick={() => { this.props.onAddRowToSlideButtonClick(this.props.selectedSlideId) }}> Add Row </Button>
                        <List style={{ width: '90%' }}>
                            {this.getCastRowsJSX(this.getSelectedSlide())}
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
        let slidesJSX = this.props.slides.map( item => {
            let selected = item.uid === this.props.selectedSlideId;

            return (
                <ListItem key={item.uid} selected={selected} onClick={ () => {this.props.onSlideSelect(item.uid)}}>
                    <ListItemIcon>
                        <Typography> {item.number} </Typography>
                    </ListItemIcon>
                    <TextField label="Name" defaultValue={item.name} onBlur={ (e) => { this.props.onSlideNameChange(item.uid, e.target.value)}}/>
                    <ListItemSecondaryAction>
                        <SlideTypeSelect value={item.type} onChange={(e) => { this.props.onSlideTypeChange(item.uid, e.target.value)}}/>
                        <IconButton onClick={() => {this.props.onDeleteSlideButtonClick(item.uid)}}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        })

        return slidesJSX;
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
                <ListItem key={item.uid} divider={true}>
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

    getSetupTabJSX() {
        return (
            <React.Fragment>
                <AppBar position="relative" color="secondary">
                    <Toolbar>
                        <Tabs value={this.state.secondaryTab} onChange={ (e, value) => { this.setState({ secondaryTab: value})}}>
                            <Tab label="Cast" />
                            <Tab label="Roles" />
                        </Tabs>
                    </Toolbar>
                </AppBar>
                    
                    
                    { this.state.secondaryTab === 0 && this.getCastTabJSX() }
                    { this.state.secondaryTab === 1 && this.getRolesTabJSX() }
            </React.Fragment>
            
        )
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