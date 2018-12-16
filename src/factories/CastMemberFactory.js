import GetUID from '../utilties/GetUID';

let CastMemberFactory = (name, billing) => {
    return {
        name: name,
        billing: billing,
        uid: GetUID(),
    }
}

export default CastMemberFactory;