import Grid from '@material-ui/core/Grid';
import React from "react";
import {flowController} from "../KernelContainer";
import Camera from 'react-html5-camera-photo';
import Button from '@material-ui/core/Button';
import 'react-html5-camera-photo/build/css/index.css';
import ImageUpload from './ImageUpload';
import _ from "lodash";
import Typography from '@material-ui/core/Typography';

const PHOTO_WIDTH = 250;
const PHOTO_HEIGHT = 180;

export interface Props {
  setCredentialCreationData(credentialCreationData: any): void,
  credentialCreationData: any
}

interface PhotoAttach {
  data: string,
  type: string,
  encoding: string
}

export interface State {
  "photo~attach"?: PhotoAttach,
  showValidations: boolean
}

export default class WebcamCaptureTool extends React.Component<any,any> {
    constructor(props: any) {
        super(props);
        this.state = {
            "photo~attach": this.props.credentialCreationData["photo~attach"] || null,
            showValidations: false
        };
    }

    photoIncluded() {
        return !_.isEmpty(this.state["photo~attach"]);
    }

    saveCredentialCreationData() {
        this.setState({ showValidations: true });
        if (this.photoIncluded()) {
            this.props.setCredentialCreationData({
                "photo~attach": JSON.stringify(this.state["photo~attach"])
            });
            flowController.goTo('NEXT');
        }
    }

    onReset() {
        this.setState({
            "photo~attach": ""
        })
    }

    determinePhotoType(dataUri: any): PhotoAttach {
        const parts: string[] = dataUri.split(",", 2);
        const type: string = parts[0].split(":")[1].split(";")[0];
        return {
            data: parts[1],
            type,
            encoding: 'base64'
        };
    }

    // Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
    resizeDataURL = async (datas: PhotoAttach) => {
        return new Promise(async (resolve, reject) => {
            var img = document.createElement('img');
            img.onload = function()
            {
                var canvas = document.createElement('canvas');
                var ctx: any = canvas.getContext('2d');
                canvas.width = PHOTO_WIDTH;
                canvas.height = PHOTO_HEIGHT;
                try {
                    ctx.drawImage(this, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);
                    var dataURI = canvas.toDataURL();
                    resolve(dataURI);
                } catch {
                    reject();
                }

            };
            img.src = `data:${datas.type};${datas.encoding},${datas.data}`
        })
    }

  savePhoto = async (dataUri: string) => {
    let photo: PhotoAttach = {
        data: dataUri,
        encoding: 'base64',
        type: 'image/png'
    };

    try {
        photo = this.determinePhotoType(dataUri);
    } catch (e) {
        console.error("Couldn't parse the dataUri string to determine encoding type. Moving forward with the assumption that it is a PNG base64 string...")
    } finally {
        const resizedPhoto = await this.resizeDataURL(photo);
        this.setState({
            "photo~attach": this.determinePhotoType(resizedPhoto)
        });
    }
  }

  renderPageButtons() {
      return (
          <WebcamCaptureToolButtons
              onClickBack={() => flowController.goTo('BACK')}
              onSubmit={() => this.saveCredentialCreationData()}
              onReset={() => this.onReset()}
          ></WebcamCaptureToolButtons>
      )
  }

  renderError() {
      if (!this.photoIncluded() && this.state.showValidations) {
          return (
              <Typography
                  component="h2"
                  variant="h6"
                  data-cy="image-capture-error-message"
                  style={{
                      color: 'red',
                      marginTop: '20px'
                  }}>
          You need to add a photo before proceeding to the next step.
              </Typography>
          )
      } else {
          return;
      }
  }

  render() {
      // This condition will rely on base64 encoding for the image
      const imageData = this.state["photo~attach"];
      if (imageData) {
        return (
              <Grid container justify="center"
                  alignItems="center" direction="column">
                  <img id="credential-image" src={`data:${imageData.type};${imageData.encoding},${imageData.data}`} alt="This will be included with your issued credential"></img>
                  { this.renderPageButtons() }
              </Grid>
          )
        } else {
            return (
                <Grid container direction="row" justify="space-around" data-cy="image-selection">
                    <Grid
                        item
                        xs={8}>
                        <Grid container direction="row" justify="space-around" data-cy="image-upload">
                            <Grid
                                item
                                xs={6}
                                md={5}>
                                <ImageUpload
                                    handleUploadPhoto={this.savePhoto}></ImageUpload>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                md={5}
                            >
                                <div className="camera-container">
                                    Or take a photo
                                    <Camera
                                        isFullscreen = { false }
                                        onTakePhoto = { (dataUri : any) => { this.savePhoto(dataUri); } }
                                    />
                                </div>
                            </Grid>
                            { this.renderError() }
                            { this.renderPageButtons() }
                        </Grid>
                    </Grid>
                </Grid>
            );
        }
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
                            data-cy="image-select-back"
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
                            data-cy="image-select-continue"
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
