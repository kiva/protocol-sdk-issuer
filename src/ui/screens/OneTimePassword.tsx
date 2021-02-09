import * as React from 'react';

import CloudWalletAgent from '../agents/CloudWalletAgent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {flowController} from "../KernelContainer";
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PhoneInput from 'react-phone-input-2';

import 'react-phone-input-2/lib/high-res.css';

import AuthService from "../utils/AuthService";
import ErrorIcon from '@material-ui/icons/Error';
import {CONSTANTS} from "../../constants/constants";

let agent: CloudWalletAgent;

interface Props {
  setCredentialCreationData(credentialCreationData: any): void,
  credentialCreationData: any,
  token: string
}

interface State {
  credentialIssued: boolean,
  connectionError: string
}

export default class OneTimePassword extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      credentialIssued: false,
      connectionError: ""
    };
  }

  handleSubmit(event: any) {
    event.preventDefault();
    this.createCredential();
  }

  createCredential = async () => {
    try {
      const credential: any = await agent.createCredential(this.props.credentialCreationData);
      console.log(credential);
      this.setState({ credentialIssued: true });
    } catch (e) {
      console.log(e);
      this.setState({ connectionError: `${e.response.data.code}: ${e.response.data.message}` });
    }
  }

  handlePhoneNumberEnter = (event: any): void => {
    if (event.hasOwnProperty("keyCode") && event.keyCode === 13) {
      this.handleSubmit(event);
    }
  };

  handleInputChange(input: string, prefix?: string) {
    var data: any = {};
    data.phoneNumber = `${prefix || ""}${input}`;
    this.props.setCredentialCreationData(data);
  }

  onPopulateForm() {
    var dataToInput = {
      "phoneNumber": "Phone Number"
    }
    this.props.setCredentialCreationData(dataToInput);
  }

  componentWillUnmount() {
  }

  componentWillMount() {
    const token: string = AuthService.getToken() || CONSTANTS.token;
    agent = CloudWalletAgent.init(token, this.setConnectionError);
    this.props.setCredentialCreationData({
      phoneNumber: ""
    });
  }

  setConnectionError = (connectionError: string) => {
    this.setState({
      connectionError
    });
  }

  renderError() {
    return (
      <Grid container justify="center" alignItems="center" direction="column" className="status-report">
        <Grid item>
            <ErrorIcon className="dialog-icon error"/>
        </Grid>
        <Grid item xs={4}>
            <Typography
                id="instructions"
                component="h2"
                align="center"
                className="error-description">
                {this.state.connectionError}
            </Typography>
        </Grid>
      </Grid>
    );
  }

  render() {
    if (this.state.connectionError) {
      return this.renderError();
    } else if (this.state.credentialIssued) {
      return this.renderCredentialIssued();
    } else {
      return this.renderOtp();
    }
  }

  renderCredentialIssued() {
    return (
      <Grid
        style={{
          paddingTop: "30px"
        }}
        container
        direction="row"
        justify="space-around">
        <Grid
          item
          xs={6}
        >
          <Grid
            container
            justify="space-around">
            <Typography component="h4" variant="h4">
            <CheckCircleIcon className="otp-icon" />Cloud Wallet created and credentials issued.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  renderOtp() {
    return (
      <div className="registrationForm">
        <Grid
          style={{
            paddingTop: "30px"
          }}
          container
          direction="row"
          justify="space-around">
          <Grid
            item
            xs={6}
          >
            <Grid
              container
              justify="space-around">
              <Typography component="h4" variant="h6">
                Enter Phone Number
              </Typography>
            </Grid>
            <Grid
              container
              justify="space-around">
                Enter employee's phone #.  This will be used to create and access their Cloud Wallet.
            </Grid>

            <Grid
              container
              direction="row"
              style={{
                paddingTop: "30px"
              }}
              justify="space-around">
                <PhoneInput
                  onlyCountries={CONSTANTS.phoneIntls!.only ? CONSTANTS.phoneIntls!.countries : undefined}
                  preferredCountries={CONSTANTS.phoneIntls!.only ? undefined : CONSTANTS.phoneIntls!.countries}
                  country={CONSTANTS.phoneIntls!.countries[0]}
                  inputClass="phone-number-input"
                  value={this.props.credentialCreationData.phoneNumber}
                  inputProps={{
                      name: 'phoneNoInput',
                      required: true
                  }}
                  onChange={(input: any) => this.handleInputChange(input, "+")}
                  onKeyDown={event => this.handlePhoneNumberEnter(event)}
                />
            </Grid>
          </Grid>
        </Grid>
        <RegistrationFormButtons
          onClickBack={() => flowController.goTo('BACK')}
        ></RegistrationFormButtons>
      </div>
    );
  }
}

interface ButtonProps {
  onClickBack(): void
}

class RegistrationFormButtons extends React.Component<ButtonProps> {
  render() {
    return (
      <Grid
        id="dialog-box"
        container
        style={{
          paddingTop: "45px"
        }}
        direction="row"
        justify="space-around">
        <Grid
          item
          xs={6}
        >
          <Grid
            container
            direction="row"
            justify="space-around"
            >
            <Grid item>
              <Button
                data-cy="qr-back"
                className="back"
                onClick={this.props.onClickBack}>
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                className="next">
                Continue
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
