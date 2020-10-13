import * as React from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import App from './App';
import {KernelContainer} from './ui';

function hashLinkScroll() {
    setTimeout(() => {
        const element = document.getElementById("header");
        if (element) {
            element.scrollIntoView();
        }
    }, 0);
}

export const Routes = (
    <Router>
        <Redirect exact from={"/"} to={"/app"}/>
        <Route path="/" component={App} />
        <Route exact path="/app" component={KernelContainer} onEnter={hashLinkScroll} />
    </Router>
);

export default Routes;
