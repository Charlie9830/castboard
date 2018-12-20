import GetUID from '../utilties/GetUID';

let OrchestraMemberFactory = () => {
    return {
        uid: GetUID(),
        name: "",
    }
}

export default OrchestraMemberFactory;