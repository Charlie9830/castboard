import React from 'react';
import App from '../components/App';
import Dexie from 'dexie';
import jetpack from 'fs-jetpack';
const { dialog } = require('electron').remote;

import CastMemberFactory from '../factories/CastMemberFactory';
import RoleFactory from '../factories/RoleFactory';

const mainDB = new Dexie('castboardMainDB');
mainDB.version(1).stores({
    castMembers: 'uid, name',
    roles: 'uid, name',
    castChangeMap: 'uid',
});

const castChangeId = "0";

class AppContainer extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            currentSlide: 0,
            castMembers: [],
            roles: [],
            castChangeMap: {uid: castChangeId},
        }

        // Method Bindings.
        this.handleNextSlideButtonClick = this.handleNextSlideButtonClick.bind(this);
        this.handlePrevSlideButtonClick = this.handlePrevSlideButtonClick.bind(this);
        this.handleAddCastMemberButtonClick = this.handleAddCastMemberButtonClick.bind(this);
        this.handleCastMemberNameChange = this.handleCastMemberNameChange.bind(this);
        this.handleCastMemberBillingChange = this.handleCastMemberBillingChange.bind(this);
        this.handleCastMemberDeleteButtonClick = this.handleCastMemberDeleteButtonClick.bind(this);
        this.handleAddRoleButtonClick = this.handleAddRoleButtonClick.bind(this);
        this.handleDeleteRoleButtonClick = this.handleDeleteRoleButtonClick.bind(this);
        this.handleRoleNameChange = this.handleRoleNameChange.bind(this);
        this.handleAddHeadshotButtonClick = this.handleAddHeadshotButtonClick.bind(this);
        this.handleCastChange = this.handleCastChange.bind(this);
    }

    componentDidMount() {
        // Pull Down Cast Members.
        mainDB.castMembers.toArray( (result) => {
            if (result.length > 0) {
                let castMembers = [];
                result.forEach( item => {
                    castMembers.push( item );
                })

                this.setState({castMembers: castMembers });
            }
        })

        // Pull Down Roles.
        mainDB.roles.toArray( (result) => {
            if(result.length > 0) {
                let roles = [];
                result.forEach( item => {
                    roles.push( item );
                })

                this.setState({roles: roles});
            }
        })

        // Pull down CastChange.
        mainDB.castChangeMap.get(castChangeId).then( result => {
            if (result !== undefined) {
                this.setState({ castChangeMap: result });
            }
        })
    }

    render() {
        return (
            <App currentSlide={this.state.currentSlide}
            onNextSlideButtonClick={this.handleNextSlideButtonClick}
            onPrevSlideButtonClick={this.handlePrevSlideButtonClick}
            onAddCastMemberButtonClick={this.handleAddCastMemberButtonClick}
            castMembers={this.state.castMembers}
            onCastMemberNameChange={this.handleCastMemberNameChange}
            onCastMemberBillingChange={this.handleCastMemberBillingChange}
            onCastMemberDeleteButtonClick={this.handleCastMemberDeleteButtonClick}
            onAddRoleButtonClick={this.handleAddRoleButtonClick}
            roles={this.state.roles}
            onDeleteRoleButtonClick={this.handleDeleteRoleButtonClick}
            onRoleNameChange={this.handleRoleNameChange}
            onAddHeadshotButtonClick={this.handleAddHeadshotButtonClick}
            onCastChange={this.handleCastChange}
            castChangeMap={this.state.castChangeMap}/>
        )
    }

    handleCastChange(roleId, castMemberId) {
        let castChangeMap = {...this.state.castChangeMap};

        castChangeMap[roleId] = castMemberId;

        this.setState({castChangeMap: castChangeMap});

        // Add to Database.
        mainDB.castChangeMap.put(castChangeMap).then( result => {

        })
    }

    handleAddHeadshotButtonClick(uid) {
        let options = {
            title: "Choose Headshot",
            buttonLabel: "Choose",
        }

        dialog.showOpenDialog(options, (filePaths => {
            if (filePaths && filePaths.length > 0) {
                let filePath = filePaths[0];
                
                jetpack.readAsync(filePath, "buffer").then( result => {
                    let base64Headshot = result.toString('base64');
                    mainDB.castMembers.update(uid, { headshot: base64Headshot }).then( dbUpdateResult => {

                    })

                    // Update State.
                    var castMembers = [...this.state.castMembers];
                    var castMember = castMembers.find(item => {
                        return item.uid === uid;
                    })

                    castMember.headshot = base64Headshot;

                    this.setState({castMembers: castMembers});
                })
            }
            
        }))
    }

    handleRoleNameChange(uid, newValue) {
        let roles = [...this.state.roles];
        let role = roles.find(item => {
            return item.uid === uid;
        })

        role.name = newValue;

        this.setState({ roles: roles });

        // Update DB
        mainDB.roles.update(uid, { name: newValue }).then( result => {

        })
    }

    handleDeleteRoleButtonClick(uid) {
        let roles = [...this.state.roles];
        let roleIndex = roles.findIndex(item => {
            return item.uid === uid;
        });

        if (roleIndex !== -1) {
            roles.splice(roleIndex, 1);

            this.setState({ roles: roles });

            // Delete from DB
            mainDB.roles.delete(uid).then(result => {

            })
        }
    }

    handleAddRoleButtonClick() {
        let roles = [...this.state.roles];
        let newRole = RoleFactory("");

        roles.push(newRole);

        this.setState({roles: roles});

        // Add to DB
        mainDB.roles.add(newRole).then( result => {

        })
    }

    handleCastMemberDeleteButtonClick(uid) {
        let castMembers = [...this.state.castMembers];
        let castMemberIndex = castMembers.findIndex(item => {
            return item.uid === uid;
        });

        if (castMemberIndex !== -1) {
            castMembers.splice(castMemberIndex, 1);

            this.setState({castMembers: castMembers});

            // Update DB.
            mainDB.castMembers.delete(uid).then( result => {

            })
        }
    }

    handleCastMemberBillingChange(uid, newValue) {
        let castMembers = [...this.state.castMembers];
        let castMember = castMembers.find(item => {
            return item.uid === uid;
        })

        castMember.billing = newValue;

        this.setState({castMembers: castMembers});

        // Update DB
        mainDB.castMembers.update(castMember.uid, { billing: newValue }).then( result => {

        })
    }

    handleCastMemberNameChange(uid, newValue) {
        let castMembers = [...this.state.castMembers];
        let castMember = castMembers.find(item => {
            return item.uid === uid;
        })

        castMember.name = newValue;

        this.setState({castMembers: castMembers});

        // Update DB.
        mainDB.castMembers.update(castMember.uid, { name: newValue }).then( result => {

        })
    }

    handleAddCastMemberButtonClick() {
        let castMembers = [...this.state.castMembers];
        let newCastMember = CastMemberFactory("", "ensemble");
        castMembers.push(newCastMember);

        this.setState({castMembers: castMembers });

        // Add to DB
        mainDB.castMembers.add(newCastMember);
    }

    handleNextSlideButtonClick() {
        this.setState({ currentSlide: this.state.currentSlide + 1});
    }

    handlePrevSlideButtonClick() {
        this.setState({ currentSlide: this.state.currentSlide - 1});
    }
}

export default AppContainer;