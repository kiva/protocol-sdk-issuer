import * as React from 'react';
import KivaAgent from '../agents/KivaAgent';
import {CONSTANTS} from "../../constants/constants";
import {Agent} from "../interfaces/AgentInterface";
import I18n from '../utils/I18n';
import Grid from '@material-ui/core/Grid';
import {notify} from "react-notify-toast";
import {flowController} from "../KernelContainer";
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import {v4 as uuid4} from "uuid";
import ErrorIcon from '@material-ui/icons/Error';
import QRCode from 'qrcode';
import "../css/QRScreen.css";
import {QRScreenButtons} from './QRScreenButtons';
import firebase from "firebase";

let agent: Agent;
let cancelConnectionPolling: boolean;
let cancelCredentialPolling: boolean;

export interface Props {
  setConnectionId(id: string): Promise<void>,

  verifyConnection(established: boolean): Promise<void>,

  verifyOffered(established: boolean): Promise<void>,

  verifyIssuance(established: boolean): Promise<void>,

  connectionId: string,
  connected: boolean,
  offered: boolean,
  issued: boolean,
  token: string,
  credentialCreationData: object
}

export interface State {
  inviteUrl: string | undefined,
  connectionError: string,
  retrievingInviteUrl: boolean,
  offered: boolean,
  issued: boolean,
  token: string
}

export default class CredentialIssuance extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      retrievingInviteUrl: true,
      inviteUrl: "",
      connectionError: "",
      offered: false,
      issued: false,
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJrTXpRVEEyUkRrMVJqSTBOVEUyTlVZNU1rTkJRekF6TWtGRU4wSTROalk1T0RreVFqVkJNZyJ9.eyJpc3MiOiJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVlNDQ0OGJmZWQ0NmM0MGU3ZjkxMWQwMCIsImF1ZCI6WyJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYwNjgyOTYxNSwiZXhwIjoxNjA2OTE2MDE1LCJhenAiOiI3TkhwVHl5SDZ5UlBQdTZ2T0NFZE5SU213T1BGS2tsRCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgYWRkcmVzcyBwaG9uZSByZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIGRlbGV0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgY3JlYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBjcmVhdGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyBkZWxldGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyB1cGRhdGU6Y3VycmVudF91c2VyX2lkZW50aXRpZXMiLCJndHkiOiJwYXNzd29yZCJ9.TE7SeHcFyi1oKJ8qQXyAeus-O6IHQQwOskMskp2YUhn2RMSCUHBhJvxUwLFJ-UsbF3XL0SgWZhmSeCK3TRj38g3zpOVfo1idwSFBmyhP2LkHA50yvkrzfirYaaJ1QgIpUtMfNQcUR2hajUbCKb5JkhcQlyzv0CupmwUDf34edNWQZlkeSgD_8QFogr32wlX0eM-oJfxdFXX4P2y-WOKaKuSmntBtWr__zrhkJf-A8nw95I8TioVr-nZYYLvHtyNTPt1z7GR8Tmb0LSj6cRYn8YvLjPPQbQUAlqmxP11kbZnrdOFD0M-XtVc7PoURB951pxqJxf1S1_Svs30H9RaqFA",
    };
    this.writeNewPost(props.credentialCreationData);
  }

  componentWillUnmount() {
    cancelConnectionPolling = true;
    cancelCredentialPolling = true;
  }

  componentDidMount() {
    agent = this.determineCloudAgent();
    this.startProcess();
  }

  writeNewPost(data: any ) {
    var postData = {
      ... data,
      created_at: new Date(),
    };
    var newPostKey = firebase.database().ref().child('entries').push().key;
    var updates : any = {};
    updates[`/entries/${newPostKey}`] = postData;
    return firebase.database().ref().update(updates);
  }

  determineCloudAgent = (): Agent => {
    switch (CONSTANTS.cloudAgent) {
      case "kiva":
      default:
        return KivaAgent.init(this.props.token, this.setConnectionError);
    }
  }

  startProcess = (reset?: boolean) => {
    if (!this.props.connectionId || reset) {
      console.log("Attempting to get a connection");
      this.startConnection();
    }
  }

  startConnection = () => {
    this.setState({
      retrievingInviteUrl: true,
      connectionError: ""
    }, () => this.getInviteUrl());
  }

  getInviteUrl = async () => {
    try {
      const connectionId: string = uuid4();
      const url: string = await agent.establishConnection(connectionId);
      this.props.setConnectionId(connectionId);
      this.setInviteUrl(url);
      this.pollConnection(connectionId);
    } catch (e) {
      this.setConnectionError(I18n.getKey('UNKNOWN_ERROR'));
    }
  }

  pollConnection = async (connectionId: string) => {
    let connectionStatus: any = await agent.getConnection(connectionId);
    if (agent.isConnected(connectionStatus)) {
      this.props.verifyConnection(true);
      cancelConnectionPolling = true;
      this.startCredentialCreation();
    }
    if (!cancelConnectionPolling) {
      this.pollConnection(connectionId);
    }
  }

  pollCredentialStatus = async (credentialId: string) => {
    let credentialStatus: any = await agent.checkCredentialStatus(credentialId);
    if (agent.isOffered(credentialStatus)) {
      // show offered state
      this.setState({
        offered: true
      });
      this.props.verifyOffered(true);
    } else if (agent.isIssued(credentialStatus)) {
      // show issued state
      this.props.verifyIssuance(true);
      this.setState({
        issued: true
      });
      cancelCredentialPolling = true;
    }
    if (!cancelCredentialPolling) {
      this.pollCredentialStatus(credentialId);
    }
  }

  startCredentialCreation = () => {
    if (this.state.offered || !this.props.connected) {
      notify.show(I18n.getKey('QR_NO_CONNECTION_NOTIFY'), 'error', 3000);
    } else {
      this.createCredential();
    }
  }

  settleConnectionId = (connectionId?: string): string => {
    const id: string = connectionId || this.props.connectionId;
    return id;
  }

  createCredential = async () => {
    try {
      const id: string = this.settleConnectionId();
      const credential: any = await agent.createCredential(this.props.credentialCreationData);
      this.pollCredentialStatus(credential.credentialId);
    } catch (e) {
      console.log(e);
    }
  }

  setInviteUrl = (inviteUrl: string | undefined): void => {
    const updatedState: any = {
      retrievingInviteUrl: false
    };

    if (inviteUrl) {
      updatedState.inviteUrl = inviteUrl;
    } else {
      updatedState.connectionError = I18n.getKey('NO_INVITE_URL');
    }

    this.setState(updatedState, this.writeQRtoCanvas);
  }

  writeQRtoCanvas() {
    try {
      QRCode.toCanvas(document.getElementById('qr-code'), this.state.inviteUrl || "", {
        width: 400
      });
    } catch {
      console.error('The QR code failed to write to the canvas');
    }
  }

  setConnectionError = (connectionError: string) => {
    this.setState({
      retrievingInviteUrl: false,
      offered: false,
      connectionError
    });
  }

  resetFlow = (): void => {
    this.props.setConnectionId('');
    this.props.verifyConnection(false);
    this.props.verifyIssuance(false);
    this.setState({
      offered: false
    }, () => this.startProcess(true));
  }

  renderQRInvite() {
    return (
      <div>
        <Typography component="h2"
                    variant="h6"
                    gutterBottom
                    className="qr-loading-title">
          {this.props.connected ? I18n.getKey('CONNECTION_ESTABLISHED') : I18n.getKey('SCAN_QR')}
        </Typography>
        <div id="qr-box">
          <canvas id="qr-code"
                  className="inspectlet-sensitive"></canvas>
          <CheckCircleIcon className={classNames({
            'qr-icon': true,
            'dialog-icon': true,
            verified: true,
            hidden: !this.props.connected
          })}/>
        </div>
      </div>
    );
  }

  renderCredentialOffered(text?: string) {
    const header: string = text || "Citizen should see the National ID card in their mobile Wallet.";
    return (
      <div className="centered-flex-content">
        <Typography component="h2"
                    variant="h6"
                    gutterBottom
                    className="qr-loading-title">
          {header}
        </Typography>
        <Grid container
              justify="space-around">
          <Grid item>
            <CreditCardIcon
              style={{
                margin: "0 auto",
                fontSize: 190,
                color: '#AAA'
              }}
              className={classNames({
                'credential-icon': true,
                verified: true,
                hidden: !this.props.connected
              })}/>
          </Grid>
        </Grid>
      </div>
    );
  }

  renderCredentialIssued(text?: string) {
    const header: string = text || "Citizen’s National ID has been issued.";
    return (
      <div className="centered-flex-content">
        <Typography component="h2"
                    variant="h6"
                    gutterBottom
                    className="qr-loading-title">
          {header}
        </Typography>
        <Grid container
              justify="space-around">
          <Grid item>
            <div id="credential-box">
              <CreditCardIcon
                style={{
                  margin: "0 auto",
                  fontSize: 190,
                  color: '#AAA'
                }}
                className={classNames({
                  'credential-icon': true,
                  verified: true
                })}/>
              <CheckCircleIcon className={classNames({
                'qr-icon': true,
                'dialog-icon': true,
                verified: true
              })}/>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  renderRetrieving(text?: string) {
    const header: string = text || I18n.getKey('RETRIEVING_QR');
    return (
      <div className="centered-flex-content">
        <Typography component="h2"
                    variant="h6"
                    gutterBottom
                    className="qr-loading-title">
          {header}
        </Typography>
        <div id="qr-loader">
          <CircularProgress className="dialog-icon verifying"/>
        </div>
      </div>
    );
  }

  renderError() {
    return (
      <div className="centered status-report">
        <ErrorIcon className="dialog-icon error"/>
        <Typography id="instructions"
                    component="h2"
                    align="center"
                    className="error-description">
          {this.state.connectionError}
        </Typography>
      </div>
    );
  }

  renderBody() {
    if (this.state.connectionError) {
      return this.renderError();
    } else if (this.state.issued) {
      return this.renderCredentialIssued();
    } else if (this.state.offered) {
      return this.renderCredentialOffered();
    } else if (this.state.inviteUrl && !this.state.retrievingInviteUrl) {
      return this.renderQRInvite();
    } else {
      return this.renderRetrieving();
    }
  }

  render() {
    return (
      <div className="flex-block column">
        <Grid container
              direction="column"
              justify="center"
              alignItems="center">
          {this.renderBody()}
        </Grid>
        <QRScreenButtons
          onClickBack={() => flowController.goTo('BACK')}
        />
      </div>
    );
  }
}

