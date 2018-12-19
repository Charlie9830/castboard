import GetUID from '../utilties/GetUID';

let RoleGroupFactory = () => {
    return {
        uid: GetUID(),
        name: "",
    }
}

export default RoleGroupFactory;