import GetUID from '../utilties/GetUID';

let OrchestraRowFactory = (rowNumber) => {
    return {
        uid: GetUID(),
        rowNumber: rowNumber,
        roleIds: [],
    }
}

export default OrchestraRowFactory;