import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Routes} from './Routes';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

// Constants
import {CONSTANTS} from "./constants/constants";

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

ReactDOM.render(<MuiThemeProvider theme={theme}>{Routes}</MuiThemeProvider>, document.getElementById('root'));
