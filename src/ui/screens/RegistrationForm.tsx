import * as React from 'react';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {flowController} from "../KernelContainer";

interface Props {
  setCredentialCreationData(credentialCreationData: any): void,
  credentialCreationData: any
}

interface State {
}

export default class RegistrationForm extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {

    };
  }

  next() {
    flowController.goTo('NEXT');
  }

  handleInputChange(inputField: any) {
    var data: any = {};
    data[inputField.currentTarget.id] = inputField.currentTarget.value;
    this.props.setCredentialCreationData(data);
  }

  onPopulateForm() {
    var generatedId = (Math.random() * 9 + 1) * Math.pow(10, 8 - 1);
    generatedId = parseInt(generatedId.toString(), 10);
    var dataToInput = {
      firstName: "[SANDBOX: firstName]",
      lastName: "[SANDBOX: lastName]",
      birthDate: "2020-10-15",
      nationalId: generatedId.toString()
    }
    this.props.setCredentialCreationData(dataToInput);
  }

  componentWillUnmount() {
  }

  componentDidMount() {
  }

  render() {
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
            container
            direction="row"
            xs={6}
            justify="space-between">
            <Grid item
                  xs={6}
                  md={5}>
              <Input
                onChange={inputField => this.handleInputChange(inputField)}
                fullWidth
                value={this.props.credentialCreationData.firstName}
                name="firstName"
                id="firstName"
                placeholder="First Name"
              />
            </Grid>
            <Grid item
                  xs={6}
                  md={5}>
              <Input
                onChange={inputField => this.handleInputChange(inputField)}
                fullWidth
                value={this.props.credentialCreationData.lastName}
                name="lastName"
                id="lastName"
                placeholder="Last Name"
              />
            </Grid>
            <Grid item
                  xs={6}
                  md={5}>
              <Input
                onChange={inputField => this.handleInputChange(inputField)}
                value={this.props.credentialCreationData.birthDate}
                fullWidth
                name="birthDate"
                id="birthDate"
                placeholder="Date of Birth"
              />
            </Grid>
            <Grid item
                  xs={6}
                  md={5}>
              <Input
                onChange={inputField => this.handleInputChange(inputField)}
                value={this.props.credentialCreationData.nationalId}
                fullWidth
                name="nationalId"
                id="nationalId"
                placeholder="National ID"
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
          container
          direction="row"
          justify="space-around"
          xs={6}>
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
    )
  }
}
