import GetUID from '../utilties/GetUID';

let FontObjectFactory = (type, familyName, base64,) => {
    return {
        uid: GetUID(),
        type: type,
        familyName: familyName,
        base64: base64,
    }
}

export default FontObjectFactory;