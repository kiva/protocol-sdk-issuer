import * as React from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import App from './App';
import {KernelContainer} from './ui';

export const Routes = (
    <Router>
        <Redirect exact from={"/"} to={"/app"}/>
        <Route path="/" component={App} />
        <Route exact path="/app" component={KernelContainer} />
    </Router>
);
