import * as React from 'react';

import {ScreenContainerProps, ScreenContainerState, ScreenProps, ScreenState} from "../interfaces/ScreenDictionaryInterfaces";

import CredentialIssuance from "./CredentialIssuance";
import RegistrationForm from "./RegistrationForm";
import WebcamCaptureTool from "./WebcamCaptureTool";
import OneTimePassword from "./OneTimePassword";

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
                token={"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJrTXpRVEEyUkRrMVJqSTBOVEUyTlVZNU1rTkJRekF6TWtGRU4wSTROalk1T0RreVFqVkJNZyJ9.eyJpc3MiOiJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVlNDQ0OGJmZWQ0NmM0MGU3ZjkxMWQwMCIsImF1ZCI6WyJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYxMDQ3MTEyNSwiZXhwIjoxNjEwNTU3NTI1LCJhenAiOiI3TkhwVHl5SDZ5UlBQdTZ2T0NFZE5SU213T1BGS2tsRCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgYWRkcmVzcyBwaG9uZSByZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIGRlbGV0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgY3JlYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBjcmVhdGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyBkZWxldGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyB1cGRhdGU6Y3VycmVudF91c2VyX2lkZW50aXRpZXMiLCJndHkiOiJwYXNzd29yZCJ9.VIOF_WE2p0wPey10iYZXznYz4lvD2IhkZBWq32-6vtKOhtA-Mo5QOflmmaiBLsM3ARx4zRrmmPSkmAJWRxzlD66W8SzyVwcNlLXiQExM8rPpIHRZv8lolyEJRwWAEo_BXONNEDoxmo774l264-SX2rHMn9L81AfmJ7BlddsaYidKb0ciJWMMj-4f6RpnYGXcnL47HwCH6qh5ja0R9ITnStNLb8uVILr_6zqqs35MMm_91ZKhkv7fo7i7X_NeXH-NRVB886vTAo1ltt5MrL-HcfMKhPIC4mgGMnDwGqQ2Pg7UB0W4PxWH8haCDWs8uubdjaA624Qma_0JM4ZJ7YR4XQ"}
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

    renderOneTimePassword() {
        return (
            <OneTimePassword
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
            case "otp":
                return this.renderOneTimePassword();
            default:
                return "";
        }
    }

    render() {
        return this.renderByName();
    }
}
