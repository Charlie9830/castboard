let FontStyleFactory = (fontFamily, fontSize, bold, italics, color, uppercase) => {
    return {
        fontFamily: fontFamily,
        fontSize: fontSize,
        bold: bold,
        italics: italics,
        color: color,
        uppercase: uppercase,
    }
}

export default FontStyleFactory;