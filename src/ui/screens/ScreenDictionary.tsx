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
                token={"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5UQTRPRVJGUXpsQ1JVTkdRMEV6TXprNE56TTBOa014UlVSRFJUTkJRakU1UWpGQk5qUkNPUSJ9.eyJpc3MiOiJodHRwczovL2tpdmEtcHJvdG9jb2wtc3RhbmRhbG9uZS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWU3ZGYxOTc4YzNmZmMwY2JlMjIxOGI1IiwiYXVkIjpbImh0dHBzOi8va2l2YS1wcm90b2NvbC1zdGFuZGFsb25lLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9raXZhLXByb3RvY29sLXN0YW5kYWxvbmUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYwNjk0MjcxNCwiZXhwIjoxNjA5NTM0NzE0LCJhenAiOiI5dTJZV09COUZQRWE2MjBDSHFBbVEwTEhqY1U5UlFnNiIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgYWRkcmVzcyBwaG9uZSByZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIGRlbGV0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgY3JlYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBjcmVhdGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyBkZWxldGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyB1cGRhdGU6Y3VycmVudF91c2VyX2lkZW50aXRpZXMiLCJndHkiOiJwYXNzd29yZCJ9.DDAeJF0ZxaJZLVg3olTcFLCuV7aNPjn5D_fx_CpZxYS_Iyw7WugN_eHY8iQqV8nI2d3OxBkrEVTb4K8LlG52Xnw2T601MG3MURAxQkjGNyZNSra7WtLvxrlSrz-JIrxvnGKno3OgaRcKTSubUcL99-LNLbv99hFkYfIylUdaDVJdCGZFCx9EftFrw0HKeatki6fQ5PV9XfZ6V2xjoOtwISu0GhXdWy_5fjs1kJvRNFS5h5urfeQ2q_6N99bK7roLAXMAz1jVd5bTK7EC2IsPoMisBnTYqcDyhNaWLXmJafotgHfGyz7UXqH-SnORRdK4LG0Y1QwidjaajlZUYt3r3A"}
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
