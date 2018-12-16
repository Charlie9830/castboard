const uuidv1 = require('uuid/v1');

let GetUid = () => {
    return uuidv1();
}

export default GetUid;