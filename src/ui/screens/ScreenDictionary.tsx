import * as React from 'react';

import {ScreenContainerProps, ScreenContainerState, ScreenProps, ScreenState} from "../interfaces/ScreenDictionaryInterfaces";

import AgencyQR from "./AgencyQR";

export default class ScreenContainer extends React.Component<ScreenContainerProps, ScreenContainerState> {

    render() {
        return (
            <Screen
                screen={this.props.screen}
                isSandbox={this.props.isSandbox}
                token={this.props.token}
            />
        );
    }
}

class Screen extends React.Component<ScreenProps, ScreenState> {

    constructor(props: ScreenProps) {
        super(props);
        this.state = {
            screen: props.screen,
            connectionId: "",
            agent_connected: false
        }
    }

    setConnectionId = async (connectionId: string): Promise<void> => {
        this.setState({connectionId});
    };

    verifyConnection = async (agent_connected: boolean): Promise<void> => {
        this.setState({agent_connected});
    };


    renderAgencyQR() {
        return (
            <AgencyQR
                connectionId={this.state.connectionId}
                setConnectionId={this.setConnectionId}
                verifyConnection={this.verifyConnection}
                connected={this.state.agent_connected}
                token={this.props.token}
            />
        );
    }

    renderByName() {
        switch (this.props.screen) {
            case "agency_qr":
                return this.renderAgencyQR();
            default:
                return "";
        }
    }

    render() {
        return this.renderByName();
    }
}
