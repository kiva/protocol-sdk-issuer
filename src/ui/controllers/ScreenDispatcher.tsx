import * as React from 'react';

import {ScreenDispatcherProps} from "../interfaces/ScreenDispatcherInterfaces";

import ScreenContainer from "../screens/ScreenDictionary";

export class ScreenDispatcher extends React.Component<ScreenDispatcherProps> {

    renderScreens() {
        return (
            <ScreenContainer
                screen={this.props.screen}
                isSandbox={this.props.isSandbox}
                token={this.props.token}
            />
        );
    }

    render() {
        return this.renderScreens();
    }
}