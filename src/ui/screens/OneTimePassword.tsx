import * as React from 'react';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {flowController} from "../KernelContainer";
import _, { forEach } from "lodash";
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

interface Props {
  setCredentialCreationData(credentialCreationData: any): void,
  credentialCreationData: any
}

interface State {
  credentialIssued: boolean
}

export default class RegistrationForm extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      credentialIssued: false
    };
  }

  next() {
    // make api call for otp here using this.props.credentialCreationData, and complete the flow.
    // on success, set credentialIssued = true;
    this.setState({ credentialIssued: true });
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
    this.props.setCredentialCreationData({
      phoneNumber: ""
    });
  }

  render() {
    if (this.state.credentialIssued === false) {
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
            onSubmit={() => this.next()}
            onPopulateForm={() => this.onPopulateForm()}
          ></RegistrationFormButtons>
        </div>
      );
    } else {
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
        <Input
          onChange={inputField => this.props.handleInputChange(inputField)}
          fullWidth
          name={this.props.inputField}
          id={this.props.inputField}
          placeholder="Enter phone number"
          value={this.props.credentialCreationData[this.props.inputField]}
        />
      </Grid>
    );
  }
}

interface ButtonProps {
  onSubmit(): void,

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
                data-cy="qr-scan-next"
                className="next"
                onSubmit={this.props.onSubmit}
                onClick={this.props.onSubmit}>
                Continue
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
