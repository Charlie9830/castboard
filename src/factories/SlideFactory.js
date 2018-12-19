import GetUID from '../utilties/GetUID';
import FontStyleFactory from './FontStyleFactory';
import CastRowFactory from './CastRowFactory';

let defaultFont = FontStyleFactory('Sans Serif', 12, false, false);

let SlideFactory = (number) => {
    return {
        uid: GetUID(),
        name: '',
        type: 'title',
        number: number,
        informationText: "",
        informationTextFontStyle: defaultFont,
        castRows: [ CastRowFactory(0) ], // Assert 1 Cast Row.
        title: "",
        titleFontStyle: defaultFont,
    }
}

export default SlideFactory;