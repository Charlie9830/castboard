let FontStyleFactory = (fontFamily, fontSize, bold, italics, color) => {
    return {
        fontFamily: fontFamily,
        fontSize: fontSize,
        bold: bold,
        italics: italics,
        color: color,
    }
}

export default FontStyleFactory;