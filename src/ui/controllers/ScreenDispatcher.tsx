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

    // TODO: Move all the FP scan jazz into the ScanFingerprint screen, which gets passed to this AuthController
    // TODO: Similarly, create an input screen that captures the phone number, turns it into a number and passes it upwards
    // TOCONSIDER: should initPostBody be auth agnostic? Probably, right? But how?

    render() {
        return this.renderScreens();
    }
}