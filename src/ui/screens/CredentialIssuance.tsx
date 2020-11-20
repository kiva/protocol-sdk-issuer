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
import { v4 as uuid4 } from "uuid";
import ErrorIcon from '@material-ui/icons/Error';
import QRCode from 'qrcode';
import "../css/QRScreen.css";
import { QRScreenButtons } from './QRScreenButtons';

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
          token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJrTXpRVEEyUkRrMVJqSTBOVEUyTlVZNU1rTkJRekF6TWtGRU4wSTROalk1T0RreVFqVkJNZyJ9.eyJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZmlyc3ROYW1lIjoiSG9yYWNpbyIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9sYXN0TmFtZSI6Ik51bmV6IiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2JyYW5jaExvY2F0aW9uIjoiS0lWQS1IUSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9pbnN0aXR1dGlvbiI6IktpdmEgRW5naW5lZXJpbmcgQ29ycHMiLCJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZnNwSWQiOiJVbm0yZ2k5ZFF1Znc2VUo4aEZCemFaIiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2VreWNDaGFpbiI6IlVubTJnaTlkUXVmdzZVSjhoRkJ6YVoiLCJodHRwczovL2VreWMuc2wua2l2YS5vcmcvcm9sZXMiOiJvcGVyYXRvci1tYW5hZ2VtZW50LHNhbmRib3gtaGVscGVycywgc2FuZGJveC1tYW5hZ2VtZW50LCBjcmVkaXQtcmVwb3J0aW5nIiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL3JlY29yZFNlc3Npb24iOmZhbHNlLCJuaWNrbmFtZSI6ImhvcmFjaW8ubnVuZXoiLCJuYW1lIjoiaG9yYWNpby5udW5lekBraXZhLm9yZyIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9mNjc2Njk1NDZlMTdiNDJkNmEzNDg1OGFkMmY3N2Q3Mz9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRmhvLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIwLTExLTIwVDAxOjU3OjMzLjM3MloiLCJlbWFpbCI6ImhvcmFjaW8ubnVuZXpAa2l2YS5vcmciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9raXZhLXByb3RvY29sLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZTQ0NDhiZmVkNDZjNDBlN2Y5MTFkMDAiLCJhdWQiOiI3TkhwVHl5SDZ5UlBQdTZ2T0NFZE5SU213T1BGS2tsRCIsImlhdCI6MTYwNTgzNzQ1MywiZXhwIjoxNjA1ODczNDUzfQ.oT8i1zClRk1BGBYpqm5n7NXXnN8finoP1McICcV4CXuzR-Vmxl143Dw5AuWzgD9k2sthq1ogYEnqmT46jj0Iv2i2PHnqjJevuBZrlqIoGPHYun-kbGse_fnjYx6r_dedMXWYp4dezbgdlCoB5cEnZjhPkD97jt-pgn9Y2pHGHH5TjhToXX-N-K9Fa1t0NuY5_HJ7NazigwTr4tbKImhi9y7og1-ZEuIjvPjgEe25pOgZGRPBNt7X7UWJgCAJgAJfCp2IUbWgXKakYmli34nQ9oeYNg-m8XgKbfNLZBDRtlk7EyOu10mF6VGzNAP-QVY0EZ-uUuccpkAzRCthxvws4w",
        };
    }

    componentWillUnmount() {
        cancelConnectionPolling = true;
        cancelCredentialPolling = true;
    }

    componentDidMount() {
      agent = this.determineCloudAgent();
      this.startProcess();
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
        if (agent.isOffered(credentialStatus)){
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
                <Typography component="h2" variant="h6" gutterBottom className="qr-loading-title">
                    {this.props.connected ? I18n.getKey('CONNECTION_ESTABLISHED') : I18n.getKey('SCAN_QR')}
                </Typography>
                <div id="qr-box">
                    <canvas id="qr-code" className="inspectlet-sensitive"></canvas>
                    <CheckCircleIcon className={classNames({
                        'qr-icon': true,
                        'dialog-icon': true,
                        verified: true,
                        hidden: !this.props.connected
                    })} />
                </div>
            </div>
        );
    }

    renderCredentialOffered(text?: string) {
        const header: string = text || "Citizen should see the National ID card in their mobile Wallet.";
        return (
            <div className="centered-flex-content">
                <Typography component="h2" variant="h6" gutterBottom className="qr-loading-title">
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
                            })} />
                    </Grid>
                </Grid>
            </div>
        );
    }

    renderCredentialIssued(text?: string) {
        const header: string = text || "Citizen’s National ID has been issued.";
        return (
            <div className="centered-flex-content">
                <Typography component="h2" variant="h6" gutterBottom className="qr-loading-title">
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
                                })} />
                            <CheckCircleIcon className={classNames({
                                'qr-icon': true,
                                'dialog-icon': true,
                                verified: true
                            })} />
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
                <Typography component="h2" variant="h6" gutterBottom className="qr-loading-title">
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
                <Typography id="instructions" component="h2" align="center" className="error-description">
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
        }else {
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

