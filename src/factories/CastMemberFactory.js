import GetUID from '../utilties/GetUID';

let CastMemberFactory = (name, groupId) => {
    return {
        name: name,
        groupId: groupId,
        uid: GetUID(),
    }
}

export default CastMemberFactory;