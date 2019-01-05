import GetUID from '../utilities/GetUID';

let PresetFactory = (name, details = "", castChangeMap = {}, orchestraChangeMap = {}) => {
    return {
        uid: GetUID(),
        name: name,
        details: details,
        castChangeMap: castChangeMap,
        orchestraChangeMap: orchestraChangeMap,
    }
}

export default PresetFactory;