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
        conductorNameFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        conductorRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        associateNameFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        associateRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        musicianNameFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        musicianRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000"),
        holdTime: 7,
    }
}

export default ThemeFactory;