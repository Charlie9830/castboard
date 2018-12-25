let GetStyleFromFontStyle = (fontStyle) => {
    let fontWeight = fontStyle.bold ? '700' : '400';
    let cssFontStyle = fontStyle.italics ? 'italic' : 'normal';
    let textTransform = fontStyle.uppercase ? 'uppercase' : 'none';

    return {
        fontFamily: fontStyle.fontFamily,
        fontSize: `${fontStyle.fontSize}pt`,
        fontWeight: fontWeight,
        fontStyle: cssFontStyle,
        color: fontStyle.color,
        textTransform: textTransform,
    }
}

export default GetStyleFromFontStyle;