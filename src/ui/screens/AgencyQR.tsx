import * as React from 'react';
import {notify} from "react-notify-toast";
import { v4 as uuid4 } from "uuid";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import QRCode from 'qrcode';
import classNames from 'classnames';
import axios from 'axios';

import {QRProps, QRState, QRButtonProps} from "../interfaces/QRInterfaces";
import {Agent} from "../interfaces/AgentInterface";

import {flowController} from "../KernelContainer";
import {CONSTANTS} from "../../constants/constants";

import I18n from '../utils/I18n';
import LocalAgent from '../agents/LocalAgent';
import KivaAgent from '../agents/KivaAgent';
import TrinsicAgent from '../agents/TrinsicAgent';

import "../css/Common.css";
import "../css/QRScreen.css";

const localAgentUri: string = "http://localhost:" + CONSTANTS.agent_port;
let agent: Agent;
let cancel: boolean;

export default class AgencyQR extends React.Component<QRProps, QRState> {

    constructor(props: QRProps) {
        super(props);
        this.state = {
            retrievingInviteUrl: true,
            inviteUrl: "",
            connectionError: "",
            verifying: false
        };
    }

    componentWillUnmount() {
        cancel = true;
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    componentDidMount() {
        axios.get(localAgentUri + "/Status/IsAlive")
        .then(response => {
            agent = LocalAgent.init(this.setConnectionError);
        })
        .catch(e => {
            console.log("Local agent not configured. Using cloud verification...");
            agent = this.determineCloudAgent();
        })
        .finally(() => {
            cancel = false;
            this.startProcess();
        });
    }

    determineCloudAgent = (): Agent => {
        debugger;
        switch (CONSTANTS.cloudAgent) {
            case "trinsic":
                return TrinsicAgent.init(this.setConnectionError);
            case "kiva":      
            default:
                return KivaAgent.init(this.props.token, this.setConnectionError);
        }
    }

    startProcess = (reset?: boolean) => {
        if (!this.props.connectionId || reset) {
            console.log("Attempting to get a connection");
            this.startConnection();
        } else if (this.props.connected) {
            console.log("Starting a verification");
            this.startVerification();
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
            console.log(e);
            this.setConnectionError(I18n.getKey('UNKNOWN_ERROR'));
        }
    }

    pollConnection = async (connectionId: string) => {
        let connectionStatus: any = await agent.getConnection(connectionId);

        if (agent.isConnected(connectionStatus)) {
            this.props.verifyConnection(true);
        } else if (!cancel) {
            this.pollConnection(connectionId);
        }
    }

    pollVerification = async (verificationId: string) => {
        let verificationStatus: any = await agent.checkVerification(verificationId);

        if (agent.isVerified(verificationStatus)) {
            this.acceptProof(agent.getProof(verificationStatus));
        } else if (!cancel) {
            this.pollVerification(verificationId);
        }
    }

    startVerification = () => {
        if (this.state.verifying || !this.props.connected) {
            notify.show(I18n.getKey('QR_NO_CONNECTION_NOTIFY'), 'error', 3000);
        } else {
            this.setState({
                verifying: true
            }, () => {
                this.verify();
            });
        }
    }

    settleConnectionId = (connectionId?: string): string => {
        const id: string = connectionId || this.props.connectionId;
        return id;
    }

    acceptProof(verificationData: any) {
        flowController.goTo('NEXT', {
            personalInfo: verificationData
        });
    }

    verify = async () => {
        try {
            const id: string = this.settleConnectionId();
            const verification: any = await agent.sendVerification(id);

            this.pollVerification(verification.verificationId);
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
                width: 300
            });
        } catch {
            console.error('The QR code failed to write to the canvas');
        }
    }

    setConnectionError = (connectionError: string) => {
        cancel = true;
        this.setState({
            retrievingInviteUrl: false,
            verifying: false,
            connectionError
        });
    }

    resetFlow = (): void => {
        this.props.setConnectionId('');
        this.props.verifyConnection(false);
        this.setState({
            verifying: false
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

    renderVerifying() {
        return (
            <div data-cy="verify-qr">
                <CircularProgress className="dialog-icon verifying"/>
                <Typography component="h2" variant="h4" gutterBottom className="status-text">
                    {I18n.getKey('VERIFYING')}
                </Typography>
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
        } else if (this.state.verifying) {
            return this.renderRetrieving(I18n.getKey('VERIFYING'));
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
                    alignItems="center"
                    spacing={16}>
                        {this.renderBody()}
                </Grid>
                <QRScreenButtons
                    onClickBack={() => flowController.goTo('BACK')}
                    onSubmit={() => this.startVerification()}
                    onReset={() => this.resetFlow()}
                />
            </div>
        );
    }
}

class QRScreenButtons extends React.Component<QRButtonProps> {
    render() {
        return (
            <Grid container
                className="qrButtons buttonListNew row"
                direction="row"
                justify="center"
                alignItems="center">
                <Grid item>
                    <Button
                        data-cy="qr-back"
                        className="back secondary"
                        onClick={this.props.onClickBack}>
                        {I18n.getKey('BACK')}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        data-cy="reset-flow"
                        className="qr-reset"
                        onClick={this.props.onReset}>
                        {I18n.getKey('RESET_FLOW')}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        type="submit"
                        data-cy="qr-scan-next"
                        className="next"
                        onSubmit={this.props.onSubmit}
                        onClick={this.props.onSubmit}>
                        {I18n.getKey('VERIFY')}
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
