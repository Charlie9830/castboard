let GetRoleFromState = (roleId, roles) => {
    return roles.find(item => {
        return item.uid === roleId;
    })
}

export default GetRoleFromState;