import GetUID from '../utilties/GetUID';

let CastGroupFactory = () => {
    return {
        uid: GetUID(),
        name: "",
    }
}

export default CastGroupFactory;