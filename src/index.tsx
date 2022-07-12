import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createTheme, CssBaseline, ThemeProvider} from "@material-ui/core";

const theme = createTheme({
    palette: {
        primary: {
            light: '#69d2f9',
            main: '#27a1c6',
            dark: '#007295',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ffffae',
            main: '#ffde7d',
            dark: '#caac4e',
            contrastText: '#000',
        },
        type: "dark"
    }
})

ReactDOM.render(<ThemeProvider theme={theme}>
    <CssBaseline/>
    <App/>
</ThemeProvider>,  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
