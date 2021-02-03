import * as React from 'react';
import CloudWalletAgent from '../agents/CloudWalletAgent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {flowController} from "../KernelContainer";
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
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

  handleSubmit(event:any) {
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

  handleInputChange(inputField: any) {
    var data: any = {};
    data[inputField.currentTarget.id] = inputField.currentTarget.value;
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
      <ValidatorForm
        ref="form"
        onSubmit={this.handleSubmit.bind(this)}
      >
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
                  <RegistrationInputField
                    setCredentialCreationData={this.props.setCredentialCreationData}
                    handleInputChange={this.handleInputChange.bind(this)}
                    inputField="phoneNumber"
                    credentialCreationData={this.props.credentialCreationData}
                  />
              </Grid>
            </Grid>
          </Grid>
          <RegistrationFormButtons
            onClickBack={() => flowController.goTo('BACK')}
            onPopulateForm={() => this.onPopulateForm()}
          ></RegistrationFormButtons>
        </div>
      </ValidatorForm>
    );
  }
}


interface InputProps {
  handleInputChange(inputField: any): void,
  inputField: string,
  setCredentialCreationData(data: any): void,
  credentialCreationData: any
}

class RegistrationInputField extends React.Component<InputProps> {

  render() {
    return (
      <Grid item
        xs={6}
        md={5}>
        <TextValidator
          onChange={inputField => this.props.handleInputChange(inputField)}
          fullWidth
          name={this.props.inputField}
          id={this.props.inputField}
          placeholder="Enter phone number"
          value={this.props.credentialCreationData[this.props.inputField]}
          validators={['required']}
          errorMessages={['this field is required']}
        />
      </Grid>
    );
  }
}

interface ButtonProps {
  onClickBack(): void,

  onPopulateForm(): void
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
                data-cy="reset-flow"
                className="back"
                onClick={this.props.onPopulateForm}>
                Populate Form
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
