import { CredentialsServiceClient, Credentials } from "@trinsic/service-clients";
import I18n from '../utils/I18n';

import {Agent} from '../interfaces/AgentInterface';

import {CONSTANTS} from '../../constants/constants';

let photo: string;

import("../../assets/images/kiva").then(res => {
    photo = res.default;
});

export default class TrinsicAgent implements Agent {

    protected readonly _client: CredentialsServiceClient;
    protected setError: any;

    static init(callback: any): TrinsicAgent {
        return new TrinsicAgent(callback);
    }

    constructor(callback: any) {
        this._client = new CredentialsServiceClient(new Credentials(
            CONSTANTS.agencyInfo.accessToken
        ), { noRetryPolicy: true });
        this.setError = callback;
    }

    isConnected(response: ConnectionStatus): boolean {
        if (this.checkForStatus(response, "Connected")) {
            return true;
        }
        return false;
    }

    isVerified(response: VerificationStatus): boolean {
        if (this.checkForStatus(response, "Accepted")) {
            return true;
        }
        return false;
    }

    checkForStatus(response: any, key: string): boolean {
        if (response.hasOwnProperty('state') && response.state === key) {
            return true;
        }
        return false;
    }

    formatProof(response: any): any {
        const proofMap: any = {
            dateOfBirth: "birthDate"
        }

        const proof: any = {
            "photo~attach": photo
        };

        for (let key in response) {
            let data: any = response[key].attributes,
                dataKey: string = response[key].name,
                k: string = dataKey;

            if (proofMap.hasOwnProperty(dataKey)) {
                k = proofMap[dataKey];
            }

            proof[k] = data[dataKey];
        }

        return proof;
    }

    async checkVerification(verificationId: string) {
        try {
            const verification: any = await this._client.getVerification(verificationId);

            return Promise.resolve(verification);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    async sendVerification(connectionId: string) {
        try {
            const verification: any = await this._client.sendVerificationFromPolicy(connectionId, CONSTANTS.agencyInfo.policyId);

            return Promise.resolve(verification);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    async getConnection(connectionId: string) {
        try {
            const connection = await this._client.getConnection(connectionId);

            return Promise.resolve(connection);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    async establishConnection(connectionId: string) {
        try {
            const connection = await this._client.createConnection({
                connectionId,
                multiParty: false
            });

            return connection.invitationUrl;
        } catch (e) {
            this.captureAndSendError(e, 'QR_CONNECTION_ERROR');
            return Promise.reject('Agent connection failed');
        }
    }

    getProof(data: VerificationStatus) {
        return this.formatProof(data.proof);
    }

    captureAndSendError(error: any, message: string) {
        const msg: string = I18n.getKey(message);
        this.setError(msg);
    }
}

interface ConnectionStatus {
    [index: string]: any,
    state: string,
    connectionId: string,
    invitationUrl: string
}

interface VerificationStatus {
    [index: string]: any,
    verificationId: string,
    connectionId: string,
    state: string,
    proof?: any
}