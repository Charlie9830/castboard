import React from 'react';

export const AppContextDefaultValue = {
    fontStyleClipboard: null,
    setFontStyleClipboard: () => {},
}

export const AppContext = React.createContext(AppContextDefaultValue);

export default AppContext;
