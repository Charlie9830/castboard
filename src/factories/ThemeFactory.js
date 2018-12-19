import FontStyleFactory from './FontStyleFactory';

let ThemeFactory = () => {
    return {
        uid: "0",
        backgroundImage: "",
        baseFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
    }
}

export default ThemeFactory;