let GetStyleFromFontStyle = (fontStyle) => {
    let fontWeight = fontStyle.bold ? '700' : '400';
    let cssFontStyle = fontStyle.italics ? 'italic' : 'normal';

    return {
        fontFamily: fontStyle.fontFamily,
        fontSize: `${fontStyle.fontSize}pt`,
        fontWeight: fontWeight,
        fontStyle: cssFontStyle,
        color: fontStyle.color,
    }
}

export default GetStyleFromFontStyle;