import React from 'react';
import App from '../components/App';

import CastMemberFactory from '../factories/CastMemberFactory';
import RoleFactory from '../factories/RoleFactory';

class AppContainer extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            currentSlide: 0,
            castMembers: [],
            roles: [],
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
            onRoleNameChange={this.handleRoleNameChange}/>
        )
    }

    handleRoleNameChange(uid, newValue) {
        let roles = [...this.state.roles];
        let role = roles.find(item => {
            return item.uid === uid;
        })

        role.name = newValue;

        this.setState({ roles: roles });
    }

    handleDeleteRoleButtonClick(uid) {
        let roles = [...this.state.roles];
        let roleIndex = roles.findIndex(item => {
            return item.uid === uid;
        });

        if (roleIndex !== -1) {
            roles.splice(roleIndex, 1);

            this.setState({ roles: roles });
        }
    }

    handleAddRoleButtonClick() {
        let roles = [...this.state.roles];

        roles.push(RoleFactory(""));

        this.setState({roles: roles});
    }

    handleCastMemberDeleteButtonClick(uid) {
        let castMembers = [...this.state.castMembers];
        let castMemberIndex = castMembers.findIndex(item => {
            return item.uid === uid;
        });

        if (castMemberIndex !== -1) {
            castMembers.splice(castMemberIndex, 1);

            this.setState({castMembers: castMembers});
        }
    }

    handleCastMemberBillingChange(uid, newValue) {
        let castMembers = [...this.state.castMembers];
        let castMember = castMembers.find(item => {
            return item.uid === uid;
        })

        castMember.billing = newValue;

        this.setState({castMembers: castMembers});
    }

    handleCastMemberNameChange(uid, newValue) {
        let castMembers = [...this.state.castMembers];
        let castMember = castMembers.find(item => {
            return item.uid === uid;
        })

        castMember.name = newValue;

        this.setState({castMembers: castMembers});
    }

    handleAddCastMemberButtonClick() {
        let castMembers = [...this.state.castMembers];
        castMembers.push(CastMemberFactory("", "principle"));

        this.setState({castMembers: castMembers });
    }

    handleNextSlideButtonClick() {
        this.setState({ currentSlide: this.state.currentSlide + 1});
    }

    handlePrevSlideButtonClick() {
        this.setState({ currentSlide: this.state.currentSlide - 1});
    }
}

export default AppContainer;