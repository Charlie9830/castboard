import GetUID from '../utilties/GetUID';

let CastMemberFactory = (name, billing, groupId) => {
    return {
        name: name,
        billing: billing,
        groupId: groupId,
        uid: GetUID(),
    }
}

export default CastMemberFactory;