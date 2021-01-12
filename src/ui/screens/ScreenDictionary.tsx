import * as React from 'react';

import {
  ScreenContainerProps,
  ScreenContainerState,
  ScreenProps,
  ScreenState
} from "../interfaces/ScreenDictionaryInterfaces";

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
    this.setState({
      credentialCreationData: {
        ...this.state.credentialCreationData,
        ...credentialCreationData
      }
    });
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
        token={"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJrTXpRVEEyUkRrMVJqSTBOVEUyTlVZNU1rTkJRekF6TWtGRU4wSTROalk1T0RreVFqVkJNZyJ9.eyJpc3MiOiJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVlNDQ0OGJmZWQ0NmM0MGU3ZjkxMWQwMCIsImF1ZCI6WyJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYxMDQ3Mjc3OCwiZXhwIjoxNjEwNTU5MTc4LCJhenAiOiI3TkhwVHl5SDZ5UlBQdTZ2T0NFZE5SU213T1BGS2tsRCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgYWRkcmVzcyBwaG9uZSByZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIGRlbGV0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgY3JlYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBjcmVhdGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyBkZWxldGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyB1cGRhdGU6Y3VycmVudF91c2VyX2lkZW50aXRpZXMiLCJndHkiOiJwYXNzd29yZCJ9.mLMEi2tQ-vrb0wpO5i8xx5gTMKOxEXXi6QL1RdLtuX_vXRiVNLl2oVUUZb-9l3J4hziaKNmXDr0FFUYQ8T8BByhlw_OvuYLrbjkpMLfJEejPobY6iyGBRP3GX-Hj1gnrOVuyiodKLgaEM8SrC09aZ3PjXBQwVvkM0hetQaiUbJRCJABV4zbOk7Gly9RMSnO_6jupho1ZOcc8s6h5Pf94fOLcMnQIHQKPN6-yXjwW0qk1ExlPL0cV_eNMzcuKtpzMaW_WCn93WClQZ10EH7qOoiUFrEX1TpvF0SssdchmImd5QrAOkvkC0LhmgtBfjI1-rd3HoPxbioMTWwIzbxaS2w"}
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
