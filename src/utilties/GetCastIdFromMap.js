let GetCastIdFromMap = (castChangeMap, roleId) => {
    let entry = castChangeMap[roleId];

    if (entry === undefined) {
        return -1
    }

    else {
        return entry.castId;
    }
}

export default GetCastIdFromMap;