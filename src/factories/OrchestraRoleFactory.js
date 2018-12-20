import GetUID from '../utilties/GetUID';

let OrchestraRoleFactory = () => {
    return {
        uid: GetUID(),
        name: "",
        billing: "musician",
    }
}

export default OrchestraRoleFactory;