import GetUID from '../utilties/GetUID';

let CastChangeMap = (name, notes) => {
    return {
        name: name,
        notes: notes,
        uid: GetUID(),
    }
}

export default CastMemberFactory;