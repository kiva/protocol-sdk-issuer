import * as React from 'react';

import {ScreenContainerProps, ScreenContainerState, ScreenProps, ScreenState} from "../interfaces/ScreenDictionaryInterfaces";

import CredentialIssuance from "./CredentialIssuance";
import RegistrationForm from "./RegistrationForm";
import WebcamCaptureTool from "./WebcamCaptureTool";

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
            credentialCreationData: {},
            screen: props.screen,
            connectionId: "",
            agent_connected: false,
            credential_offered: false,
            credential_issued: false
        }
    }

    setCredentialCreationData = (credentialCreationData: any): void => {
        this.setState({credentialCreationData: {
            ...this.state.credentialCreationData,
            ...credentialCreationData
        }});
    };

    setConnectionId = async (connectionId: string): Promise<void> => {
        this.setState({connectionId});
    };

    verifyConnection = async (agent_connected: boolean): Promise<void> => {
        this.setState({agent_connected});
    };

    verifyOffered = async (credential_offered: boolean): Promise<void> => {
        this.setState({credential_offered});
    };

    verifyIssuance = async (credential_issued: boolean): Promise<void> => {
        this.setState({credential_issued});
    };

    renderIssuance() {
        return (
            <CredentialIssuance
                credentialCreationData={this.state.credentialCreationData}
                connectionId={this.state.connectionId}
                setConnectionId={this.setConnectionId}
                verifyConnection={this.verifyConnection}
                verifyOffered={this.verifyOffered}
                verifyIssuance={this.verifyIssuance}
                connected={this.state.agent_connected}
                offered={this.state.credential_offered}
                issued={this.state.credential_issued}
                token={this.props.token}
            />
        )
    }

    renderRegistrationForm() {
        return (
            <RegistrationForm
                setCredentialCreationData={this.setCredentialCreationData}
                credentialCreationData={this.state.credentialCreationData}
            />
        )
    }

    renderWebcamCaptureTool() {
        return (
            <WebcamCaptureTool
                setCredentialCreationData={this.setCredentialCreationData}
                credentialCreationData={this.state.credentialCreationData}
            />
        )
    }

    renderByName() {
        switch (this.props.screen) {
            case "issuance":
                return this.renderIssuance();
            case "registrationForm":
                return this.renderRegistrationForm();
            case "webcam":
                return this.renderWebcamCaptureTool();
            default:
                return "";
        }
    }

    render() {
        return this.renderByName();
    }
}
