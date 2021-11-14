import React from 'react';

const ApplicationContext = React.createContext({
    name: "",
    version: 0,
});

const themes = {
    light: {
        foreground: '#000000',
        background: '#eeeeee',
    },
    dark: {
        foreground: '#ffffff',
        background: '#222222',
    },
};

const ThemeContext = React.createContext(
    themes.dark // default value
);


export { ApplicationContext, ThemeContext }