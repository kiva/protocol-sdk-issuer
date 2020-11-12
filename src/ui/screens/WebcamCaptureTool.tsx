import Grid from '@material-ui/core/Grid';
import React from "react";
import {flowController} from "../KernelContainer";
import Camera from 'react-html5-camera-photo';
import Button from '@material-ui/core/Button';
import 'react-html5-camera-photo/build/css/index.css';

export interface Props {
  setCredentialCreationData(credentialCreationData: any): void,
  credentialCreationData: any
}

export interface State {
  "photo~attach"?: string;
}

export default class WebcamCaptureTool extends React.Component<any,any> {
  constructor(props: any) {
    super(props);
    this.state = {

    };
  }

  saveCredentialCreationData() {
    this.props.setCredentialCreationData({
      "photo~attach": this.state["photo~attach"]
    });
    flowController.goTo('NEXT');
  }

  onReset() {
    this.setState({
      "photo~attach": ""
    })
  }

  handleTakePhoto = (dataUri: string) => {
    const photo = dataUri.replace("data:image/png;base64,","")
    this.setState({
      "photo~attach": photo
    });
  }

  render() {
    return (
      <Grid>
        <Camera
          onTakePhoto = { (dataUri : any) => { this.handleTakePhoto(dataUri); } }
        />
        <WebcamCaptureToolButtons
          onClickBack={() => flowController.goTo('BACK')}
          onSubmit={() => this.saveCredentialCreationData()}
          onReset={() => this.onReset()}
        ></WebcamCaptureToolButtons>
      </Grid>
      
    );
  }
};


interface ButtonProps {
  onSubmit(): void,

  onClickBack(): void,

  onReset(): void
}

class WebcamCaptureToolButtons extends React.Component<ButtonProps> {
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
          justify="space-around">
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
              onClick={this.props.onReset}>
              Reset Image
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
