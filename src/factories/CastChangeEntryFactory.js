let CastChangeEntryFactory = (type, castId, groupId) => {
    return {
        type: type,
        castId: castId,
        groupId: groupId,
    }
}

export default CastChangeEntryFactory;