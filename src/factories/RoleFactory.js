import GetUID from '../utilties/GetUID';

let RoleFactory= (name) => {
    return {
        name: name,
        uid: GetUID(),
    }
}

export default RoleFactory;