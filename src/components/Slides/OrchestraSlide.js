import React from 'react';
import SlideBase from './SlideBase';
import GetStyleFromFontStyle from '../../utilties/GetStyleFromFontStyle';
import OrchestraRow from '../OrchestraRow';
import OrchestraMember from '../OrchestraMember';
import GetRoleFromState from '../../utilties/GetRoleFromState';

let OrchestraSlide = (props) => {
    let containerStyle = {
        display: 'grid',
        gridTemplateRows: '[Content]auto',
        width: '100%',
        height: '100%',
        margin: '0px',
        padding: '0px',
    }

    let childrenContainerStyle = {
        gridRow: 'Content',
        placeSelf: 'center',
        display: 'grid',
        gridAutoRows: 'auto',
        justifyItems: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    }

    return (
        <SlideBase theme={props.theme}>
            <div style={containerStyle}>

                <div style={childrenContainerStyle}>
                    {getSlideContentsJSX(props.slide, props.orchestraMembers,
                         props.orchestraChangeMap, props.orchestraRoles, props.theme)}
                </div>

            </div>
        </SlideBase>
    )
}

let getSlideContentsJSX = (slide, orchestraMembers, orchestraChangeMap, orchestraRoles, theme) => {
    let jsx = slide.orchestraRows.map( (item, rowIndex) => {
        let roleWidth = getRolesWidth(item.roleIds.length);

        let membersJSX = item.roleIds.map( (roleId, roleIndex) => {
            let role = GetRoleFromState(roleId, orchestraRoles);
            let orchestraMember = getOrchestraMember(role.uid, orchestraMembers, orchestraChangeMap)

            if (orchestraMember !== undefined) {
                return (
                    <OrchestraMember key={rowIndex + roleIndex + role.uid} name={orchestraMember.name} billing={role.billing}
                     seat={role.name} theme={theme} width={roleWidth}/>
                )
            }
            
        })

        return (
            <OrchestraRow key={item.uid}>
                {membersJSX}
            </OrchestraRow>
        )
    })

    return jsx;
}

let getRolesWidth = (roleCount) => {
    if (roleCount === 0) {
        // Dont divide by Zero.
        return '100%';
    }

    return `${100 / roleCount}%`;
}

let getOrchestraMember = (roleId, orchestraMembers, orchestraChangeMap) => {
    let memberId = orchestraChangeMap[roleId];

    if (memberId === undefined) {
        return undefined;
    }

    return orchestraMembers.find(item => {
        return item.uid === memberId;
    })
}

export default OrchestraSlide;