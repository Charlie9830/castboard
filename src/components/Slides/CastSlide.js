import React from 'react';
import SlideBase from './SlideBase';
import GetStyleFromFontStyle from '../../utilties/GetStyleFromFontStyle';
import CastRow from '../CastRow';
import CastMember from '../CastMember';
import GetCastIdFromMap from '../../utilties/GetCastIdFromMap';
import GetRoleFromState from '../../utilties/GetRoleFromState';

let CastSlide = (props) => {
    let containerStyle = {
        display: 'grid',
        gridTemplateRows: '[Title] 160px [Content]auto',
        width: '100%',
        height: '100%',
        margin: '0px',
        padding: '0px',
    }

    let slideTitleContainerStyle = {
        gridRow: 'Title',
        placeSelf: 'center',
    }

    let slideTitleStyle = {
        ...GetStyleFromFontStyle(props.slide.titleFontStyle),
    }

    let childrenContainerStyle = {
        gridRow: 'Content',
        placeSelf: 'center',
        display: 'grid',
        gridAutoRows: 'auto',
        justifyItems: 'center',
        alignItems: 'center',
        height: '100%',
    }

    return (
        <SlideBase theme={props.theme}>
            <div style={containerStyle}>

                <div style={slideTitleContainerStyle}>
                    <div style={slideTitleStyle}>
                        {props.slide.title}
                    </div>
                </div>

                <div style={childrenContainerStyle}>
                    {getSlideContentsJSX(props.slide, props.castMembers, props.castChangeMap, props.roles, props.theme)}
                </div>

            </div>
        </SlideBase>
    )
}

let getSlideContentsJSX = (slide, castMembers, castChangeMap, roles, theme) => {
    let jsx = slide.castRows.map( (row, rowIndex) => {
        let rolesJSX = row.roleIds.map( (roleId, roleIndex) => {
            let role = GetRoleFromState(roleId, roles);
            let castId = GetCastIdFromMap(castChangeMap, roleId );

            if (castId === undefined || castId === -1) {
                // Track Cut
                return null;
            }

            let castMember = castMembers.find(item => {
                return item.uid === castId;
            })

            if (castMember === undefined ) {
                // Cast Member can't be found.
                return (<div> Cast Member not Found </div>);
            }

            return (
                <CastMember key={rowIndex + roleIndex + castId} name={castMember.name} character={role.displayedName} billing={role.billing}
                theme={theme} headshot={castMember.headshot}/>
            )
        })

        return (
            <CastRow key={row.uid}>
                {rolesJSX}
            </CastRow>
        )
    })

    return jsx;
}

export default CastSlide;