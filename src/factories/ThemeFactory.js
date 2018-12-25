import FontStyleFactory from './FontStyleFactory';

let ThemeFactory = () => {
    return {
        uid: "0",
        backgroundImage: "",
        baseFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        principleActorFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        principleRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        leadActorFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        leadRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        ensembleActorFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        ensembleRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        conductorNameFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        conductorRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        associateNameFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        associateRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        musicianNameFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        musicianRoleFontStyle: FontStyleFactory('Sans Serif', 12, false, false, "#000", false),
        holdTime: 7,
    }
}

export default ThemeFactory;