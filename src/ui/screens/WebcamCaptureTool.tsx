import Grid from '@material-ui/core/Grid';
import React from "react";
import Webcam from "react-webcam";

export interface Props {

}

export interface State {
  capturedImage?: string,
  webcamRef?: any;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

class WebcamCapture extends React.Component<any,any> {

  webcamRef: any;

  constructor(props: any) {
    super(props);
    this.webcamRef = React.useRef(null);
  }

  capture = () => {
    if (this.props.onCapture) {
      this.props.onCapture(this.webcamRef.current.getScreenshot())
    }
  };

  render() {
    return (
      <div className="webcam-capture">
        <Webcam
          audio={false}
          height={720}
          ref={this.webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />
        <button onClick={this.capture}>Capture photo</button>
      </div>
    );
  }
};

export default class WebcamCaptureTool extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      capturedImage: undefined,
    };
  }

  componentWillUnmount() {

  }

  componentDidMount() {

  }

  renderBody() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    return <div>
      <WebcamCapture onCapture={(value : any) => {console.log(value)}}/>
    </div>
  }

  render() {
    return (
      <div className="flex-block column">
        <Grid container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={16}>
          {this.renderBody()}
        </Grid>
      </div>
    );
  }
}