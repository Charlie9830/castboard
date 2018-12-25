import GetUID from '../utilties/GetUID';

let CastMemberFactory = (name, groupId) => {
    return {
        name: name,
        groupId: groupId,
        uid: GetUID(),
        thumbnailUrl: "",
    }
}

export default CastMemberFactory;