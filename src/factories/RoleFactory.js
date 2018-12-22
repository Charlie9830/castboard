import GetUID from '../utilties/GetUID';

let RoleFactory = (name, groupId) => {
    return {
        name: name,
        displayedName: "",
        uid: GetUID(),
        billing: "ensemble",
        groupId: groupId,
    }
}

export default RoleFactory;