import GetUid from "../utilties/GetUID";

let ShowfileInfoFactory = (name) => {
    return {
        uid: '0',
        showfileId: GetUid(),
        name: name,
    }
}

export default ShowfileInfoFactory;