import * as React from 'react';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import {flowController} from "../KernelContainer";
import _, { forEach } from "lodash";
import {CONSTANTS} from '../../constants/constants';
import {PIImap} from '../interfaces/ConfirmationProps';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

interface Props {
  setCredentialCreationData(credentialCreationData: any): void,
  credentialCreationData: any
}

interface State {
}

const PII: PIImap = CONSTANTS.pii_map;

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

  onPopulateForm() {
    var generatedId = (Math.random() * 9 + 1) * Math.pow(10, 8 - 1);
    generatedId = parseInt(generatedId.toString(), 10);
    var dataToInput = {
      "firstName": "First Name",
      "lastName": "Last Name",
      "companyEmail": "Company Email",
      "currentTitle": "Current Title",
      "team": "Team",
      "hireDate": "01-17-1990",
      "officeLocation": "Office Location",
      "type": "Intern",
      "endDate": "01-17-1990",
      "phoneNumber": "Phone Number"
    }
    this.props.setCredentialCreationData(dataToInput);
  }

  componentWillUnmount() {
  }

  componentWillMount() {
    const initialCreationDataState: any = {};
    forEach(_.keys(PII), (key) => {
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
                direction="row"
                justify="space-between">
                {_.keys(this.props.credentialCreationData).map(
                  (field: any, idx: any) => {
                    if (PII[field] && PII[field].dataType && PII[field].dataType !== "image/jpeg;base64") {
                      return (
                        <RegistrationInputField
                          dataType={PII[field].dataType}
                          key={idx}
                          setCredentialCreationData={this.props.setCredentialCreationData}
                          handleInputChange={this.handleInputChange.bind(this)}
                          inputField={field}
                          credentialCreationData={this.props.credentialCreationData}
                        />
                      )
                    } else {
                      return;
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
          <label>{ PII[this.props.inputField].name }</label>
          <TextValidator
            name={this.props.inputField}
            key={this.props.inputField}
            value={this.props.credentialCreationData[this.props.inputField]}
            fullWidth
            onChange={(inputField: any) => this.props.handleInputChange(inputField)}
            id={this.props.inputField} select>
            {_.map(PII[this.props.inputField].options, (option: any, idx: any) => {
              return (
                <MenuItem value={option} id={this.props.inputField}>{option}</MenuItem>
              )
            })}
          </TextValidator>
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
          <label>{ PII[this.props.inputField].name }</label>
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
