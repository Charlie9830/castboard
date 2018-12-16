let GetCastMemberIdFromMap = (castChangeMap, roleId) => {
    let castMemberId = castChangeMap[roleId];
    if (castMemberId === undefined) {
        return -1
    }

    else {
        return castMemberId;
    }
}

export default GetCastMemberIdFromMap;