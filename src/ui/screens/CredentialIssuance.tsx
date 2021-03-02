import * as React from 'react';
import KivaAgent from '../agents/KivaAgent';
import {CONSTANTS} from "../../constants/constants";
import I18n from '../utils/I18n';
import Grid from '@material-ui/core/Grid';
import {notify} from "react-notify-toast";
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import {v4 as uuid4} from "uuid";
import ErrorIcon from '@material-ui/icons/Error';
import QRCode from 'qrcode';
import "../css/QRScreen.css";
import {IAgent} from "../interfaces/AgentInterfaces";
import {QRScreenButtons} from './QRScreenButtons';
import AuthService from "../utils/AuthService";

const pollInterval: number = 200;

let agent: KivaAgent;
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
  credentialData: object,
}

export default class CredentialIssuance extends React.Component<Props, State> {

  public readonly agent: IAgent;

  constructor(props: Props) {
    super(props);
    const credentialData : any = props.credentialCreationData;
    credentialData["photo~attach"] = JSON.stringify(credentialData["photo~attach"]);
    this.state = {
      retrievingInviteUrl: true,
      inviteUrl: "",
      connectionError: "",
      offered: false,
      issued: false,
      credentialData,
    };
    this.agent = this.determineCloudAgent();
  }

  componentWillUnmount() {
    cancelConnectionPolling = true;
    cancelCredentialPolling = true;
  }

  componentDidMount() {
    this.startProcess();
  }


  determineCloudAgent = (): KivaAgent => {
    const token: string = AuthService.getToken() || CONSTANTS.token;
    switch (CONSTANTS.cloudAgent) {
      case "kiva":
      default:
        return KivaAgent.init(token);
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
        const url: string = await this.agent.establishConnection(connectionId);
        this.props.setConnectionId(connectionId);
        this.setInviteUrl(url);
        this.pollConnection(connectionId);
      } catch (e) {
        console.log(e);
        this.setConnectionError(e);
      }
  }

  pollConnection = async (connectionId: string) => {
    try {
      let connectionStatus: any = await this.agent.getConnection(connectionId);
      if (this.agent.isConnected(connectionStatus)) {
          this.props.verifyConnection(true);
          cancelConnectionPolling = true;
          this.startCredentialCreation();
      } else if (!cancelConnectionPolling) {
          setTimeout(() => {
              this.pollConnection(connectionId);
          }, pollInterval);
      }
    } catch (e) {
      console.log(e);
      this.setConnectionError(e);
    }
  }

  pollCredentialStatus = async (credentialId: string) => {
    try {
      let credentialStatus: any = await this.agent.checkCredentialStatus(credentialId);
      console.log(credentialStatus);
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
        setTimeout(() => {
          this.pollConnection(credentialId);
        }, pollInterval);
      }
    } catch (e) {
      console.log(e);
      this.setConnectionError(I18n.getKey("UNKNOWN_ERROR"))
    }
  }

  startCredentialCreation = () => {
    if (this.state.offered || !this.props.connected) {
      notify.show(I18n.getKey('QR_NO_CONNECTION_NOTIFY'), 'error', 3000);
    } else {
      this.createCredential();
    }
  }

  createCredential = async () => {
    try {
      const credential: any = await this.agent.createCredential(this.state.credentialData);
      this.pollCredentialStatus(credential.credentialId);
    } catch (e) {
      console.log(e);
      this.setConnectionError(I18n.getKey("UNKNOWN_ERROR"));
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
          onClickBack={()=>{
            window.opener.location.href="https://pro-cluster-kiva.web.app/";
            window.close();
          }}
        />
      </div>
    );
  }
}

