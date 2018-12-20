let GetOrchestraIdFromMap = (orchestraChangeMap, roleId) => {
    let entry = orchestraChangeMap[roleId];

    if (entry === undefined) {
        return -1
    }

    else {
        return entry;
    }
}

export default GetOrchestraIdFromMap;