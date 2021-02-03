import * as React from 'react';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {flowController} from "../KernelContainer";
import _, { forEach } from "lodash";
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import PhoneInput from 'react-phone-input-2';

import {CONSTANTS} from '../../constants/constants';

import 'react-phone-input-2/lib/high-res.css';

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

  handleSubmit(event: any) {
    event.preventDefault();
    // make api call for otp here using this.props.credentialCreationData, and complete the flow.
    // on success, set credentialIssued = true;
    this.setState({ credentialIssued: true });
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
