import GetUID from '../utilties/GetUID';

let CastRowFactory = (rowNumber) => {
    return {
        uid: GetUID(),
        rowNumber: rowNumber,
        roleIds: [],
    }
}

export default CastRowFactory;