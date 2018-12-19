import GetUID from '../utilties/GetUID';
import FontStyleFactory from './FontStyleFactory';

let defaultFont = FontStyleFactory('Sans Serif', 12, false, false);

let SlideFactory = (number) => {
    return {
        uid: GetUID(),
        name: '',
        type: 'title',
        number: number,
        informationText: "",
        informationTextFontStyle: defaultFont,
        castRows: [],
        title: "",
        titleFontStyle: defaultFont,
    }
}

export default SlideFactory;