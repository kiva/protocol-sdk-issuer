import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import PhoneInput from 'react-phone-input-2';
import _, { forEach } from "lodash";

import {flowController} from "../KernelContainer";
import {CONSTANTS} from '../../constants/constants';
import {CredentialKeyMap} from '../interfaces/ConfirmationProps';

import "../css/RegistrationForm.css";
import 'react-phone-input-2/lib/high-res.css';

interface Props {
  setCredentialCreationData(credentialCreationData: any): void,
  credentialCreationData: any
}

interface State {
}

const CredentialKeys: CredentialKeyMap = CONSTANTS.credentialKeyMap;

export default class RegistrationForm extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {

        };
    }

    handleInputChange(inputField: any) {
        var data: any = {};
        data[inputField.currentTarget.id] = inputField.currentTarget.dataset.value || inputField.currentTarget.value;
        this.props.setCredentialCreationData(data);
    }

  handleStringInput = (input: string, key: string, prefix?: string) => {
      const data: any = {};
      data[key] = `${prefix || ""}${input}`;
      this.props.setCredentialCreationData(data);
  }

  onPopulateForm() {
      // var generatedId = (Math.random() * 9 + 1) * Math.pow(10, 8 - 1);
      // generatedId = parseInt(generatedId.toString(), 10);
      var dataToInput = {
          "firstName": "First Name",
          "lastName": "Last Name",
          "companyEmail": "testEmail@kiva.org",
          "phoneNumber": "+12345678909",
          "currentTitle": "Current Title",
          "team": "Team",
          "hireDate": "1990-01-17",
          "officeLocation": "Office Location",
          "type": "Intern",
          "endDate": "1990-01-17"
      }
      this.props.setCredentialCreationData(dataToInput);
  }

  componentWillUnmount() {
  }

  componentWillMount() {
      const initialCreationDataState: any = {};
      forEach(_.keys(CredentialKeys), (key) => {
          initialCreationDataState[key] = this.props.credentialCreationData[key] || "";
      });
      // name, value
      this.props.setCredentialCreationData(initialCreationDataState);
  }

  handleSubmit(event:any) {
      event.preventDefault();
      flowController.goTo('NEXT');
  }

  render() {
      return (
          <ValidatorForm
              ref="form"
              onSubmit={this.handleSubmit}
          >
              <div data-cy="registration-form" className="registrationForm">
                  <Grid
                      style={{
                          paddingTop: "30px"
                      }}
                      container
                      direction="row"
                      justify="space-around">
                      <Grid
                          container
                          justify="space-around">
                          <Typography component="h4" variant="h6">
                Enter Credential Details
                          </Typography>
                      </Grid>
                      <Grid
                          container
                          justify="space-around">
                Details on this page will be issued to the employee in a credential.
                      </Grid>
                      <Grid
                          item
                          xs={6}
                      >
                          <Grid
                              container
                              direction="row"
                              justify="space-between">
                              {_.keys(this.props.credentialCreationData).map(
                                  (field: any, idx: any) => {
                                      if (CredentialKeys[field] && CredentialKeys[field].dataType && CredentialKeys[field].dataType !== "image/jpeg;base64") {
                                          return (
                                              <RegistrationInputField
                                                  dataType={CredentialKeys[field].dataType}
                                                  key={idx}
                                                  setCredentialCreationData={this.props.setCredentialCreationData}
                                                  handleInputChange={this.handleInputChange.bind(this)}
                                                  handleStringInput={this.handleStringInput}
                                                  inputField={field}
                                                  credentialCreationData={this.props.credentialCreationData}
                                              />
                                          );
                                      } else {
                                          return "";
                                      }
                                  }
                              )}
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
  handleStringInput(input: string, key: string, prefix?: string): void,
  inputField: string,
  setCredentialCreationData(data: any): void,
  credentialCreationData: any,
  dataType: string | any
}

class RegistrationInputField extends React.Component<InputProps> {
    render() {
        if (this.props.dataType === "selection") {
            return (
                <Grid item
                    xs={6}
                    md={5}
                    style={{
                        paddingTop: "30px"
                    }}
                >
                    <label htmlFor={this.props.inputField}>{ CredentialKeys[this.props.inputField].name }</label>
                    <TextValidator
                        name={this.props.inputField}
                        key={this.props.inputField}
                        value={this.props.credentialCreationData[this.props.inputField]}
                        fullWidth
                        onChange={(inputField: any) => this.props.handleInputChange(inputField)}
                        id={`container-${this.props.inputField}`}
                        inputProps={{
                          id: this.props.inputField
                        }} select>
                        {_.map(CredentialKeys[this.props.inputField].options, (option: any, idx: any) => {
                            return (
                                <MenuItem key={this.props.inputField} value={option} id={this.props.inputField}>{option}</MenuItem>
                            )
                        })}
                    </TextValidator>
                </Grid>
            );
        } else if (this.props.dataType === "phoneNumber") {
            return (
                <Grid item
                    xs={6}
                    md={5}
                    style={{
                        paddingTop: "30px"
                    }}
                >
                    <label htmlFor={this.props.inputField} id="phone-label">{ CredentialKeys[this.props.inputField].name }</label>
                    <PhoneInput
                        onlyCountries={CONSTANTS.phoneIntls!.only ? CONSTANTS.phoneIntls!.countries : undefined}
                        preferredCountries={CONSTANTS.phoneIntls!.only ? undefined : CONSTANTS.phoneIntls!.countries}
                        country={CONSTANTS.phoneIntls!.countries[0]}
                        inputClass="phone-number-input"
                        value={this.props.credentialCreationData[this.props.inputField]}
                        inputProps={{
                            name: this.props.inputField,
                            id: this.props.inputField,
                            required: true
                        }}
                        onChange={(input: any) => this.props.handleStringInput(input, this.props.inputField, "+")}
                    />
                </Grid>
            );
        } else {
            return (
                <Grid item
                    xs={6}
                    md={5}
                    style={{
                        paddingTop: "30px"
                    }}
                >
                    <label htmlFor={this.props.inputField}>{ CredentialKeys[this.props.inputField].name }</label>
                    <TextValidator
                        type={this.props.dataType}
                        fullWidth
                        onChange={(inputField: any) => this.props.handleInputChange(inputField)}
                        name={this.props.inputField}
                        id={this.props.inputField}
                        value={this.props.credentialCreationData[this.props.inputField]}
                        validators={['required']}
                        errorMessages={['this field is required']}
                    />
                </Grid>
            );
        }
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
                                data-cy="populate-form"
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
