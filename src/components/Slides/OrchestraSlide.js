import React from 'react';
import SlideBase from './SlideBase';
import GetStyleFromFontStyle from '../../utilties/GetStyleFromFontStyle';
import OrchestraRow from '../OrchestraRow';
import OrchestraMember from '../OrchestraMember';

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
        gridAutoRows: '1fr',
        justifyItems: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    }

    return (
        <SlideBase theme={props.theme}>
            <div style={containerStyle}>

                <div style={childrenContainerStyle}>
                    {getSlideContentsJSX(props.slide, props.orchestraMembers, props.orchestraChangeMap, props.theme)}
                </div>

            </div>
        </SlideBase>
    )
}

let getSlideContentsJSX = (slide, orchestraMembers, orchestraChangeMap, theme) => {
    let jsx = slide.orchestraRows.map( item => {
        let membersJSX = item.roles.map( role => {
            let orchestraMember = getOrchestraMember(role.uid, orchestraMembers, orchestraChangeMap)

            if (orchestraMember !== undefined) {
                return (
                    <OrchestraMember key={role.uid} name={orchestraMember.name} billing={role.billing}
                     seat={role.name} theme={theme}/>
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