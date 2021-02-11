import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Routes} from './Routes';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

// Constants
import {CONSTANTS} from "./constants/constants";
import firebase from "firebase";

const theme = createMuiTheme({

});

let textDirectionClass = 'ltr';

if (CONSTANTS.direction === 'rtl') {
    textDirectionClass = 'rtl';
}

const root = document.getElementById('root');

if (root) {
    root.className = textDirectionClass;
}

var firebaseConfig = {
    apiKey: "AIzaSyD0S_QNKrJrcmXS9B_6C2xlyaUX01K4HsM",
    authDomain: "pro-cluster-kiva.firebaseapp.com",
    databaseURL: "https://pro-cluster-kiva.firebaseio.com",
    projectId: "pro-cluster-kiva",
    storageBucket: "pro-cluster-kiva.appspot.com",
    messagingSenderId: "118533391027",
    appId: "1:118533391027:web:306d5ba3cb4bf0568666c6"
};
export const Kernel = firebase.initializeApp(firebaseConfig);

ReactDOM.render(<MuiThemeProvider theme={theme}>{Routes}</MuiThemeProvider>, document.getElementById('root'));
