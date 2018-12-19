import FontStyleFactory from './FontStyleFactory';

let ThemeFactory = () => {
    return {
        uid: "0",
        backgroundImage: "",
        baseFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        principleActorFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        principleRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        leadActorFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        leadRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        ensembleActorFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        ensembleRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),

    }
}

export default ThemeFactory;