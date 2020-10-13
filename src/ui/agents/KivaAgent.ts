import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import I18n from '../utils/I18n';

import {Agent} from '../interfaces/AgentInterface';
import {PIImap} from '../interfaces/ConfirmationProps';

import {CONSTANTS} from '../../constants/constants';

const PII: PIImap = CONSTANTS.pii_map;

export default class KivaAgent implements Agent {
    protected setError: any;
    public token: string;
    public axiosInstance: AxiosInstance;
    private _connectionId?: string;
    private _verificationId?: string;
    private _credentialId?: string;

    static init(token: string, callback: any): KivaAgent {
        return new KivaAgent(token, callback);
    }

    constructor(token: string, callback: any) {
        const axiosConfig: AxiosRequestConfig = {
            baseURL: CONSTANTS.ekycURI,
            headers: {
                Authorization: 'Bearer ' + token
            }
        };

        this.token = token;
        this.setError = callback;
        this.axiosInstance = axios.create(axiosConfig);
    }

    isConnected(response: any): boolean {
        const state: string = response.state;
        if (state === "response" || state === "active") {
            return true;
        }
        return false;
    }

    isVerified(response: any): boolean {
        if (response.state === "verified") {
            return true;
        }
        return false;
    }

    isCredentialCreated(response: any): boolean {
        if (response.state === "created") {
            return true;
        }
        return false;
    }

    formatProof(response: any): void {
        // TODO: Define an actual credential schema structure so that we can know that we're mapping data to actual PII map keys
        const proof: any = {};
        for (let key in response) {
            let k: string = PII[key].alternateKey || key;
            proof[k] = response[key].raw;
        }
        return proof;
    }

    async establishConnection(ignore: string) {
        try {
            let connection: any = await this.axiosInstance.post('/v2/mobile/connection', {});
            this._connectionId = connection.data.connection_id;

            const invitationData = btoa(JSON.stringify(connection.data.invitation));

            return Promise.resolve(invitationData);
        } catch (e) {
            this.captureAndSendError(e, 'QR_CONNECTION_ERROR');
            return Promise.reject('Kiva Agent connection failed');
        }
    }

    async getConnection(ignore: string) {
        try {
            let connection: any = await this.axiosInstance.get('/v2/mobile/connection/' + this._connectionId);

            return Promise.resolve(connection.data);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(`Couldn't find record of connection { ${this._connectionId} }`);
        }
    }

    async checkVerification(ignore: string) {
        try {
            const verification: any = await this.axiosInstance.get('/v2/mobile/verify/' + this._verificationId);

            return Promise.resolve(verification.data);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    async checkCredentialStatus(ignore: string) {
        try {
            const credential: any = await this.axiosInstance.get('/v2/mobile/verify/' + this._credentialId);

            return Promise.resolve(credential.data);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    async sendVerification(connectionId: string) {
        try {
            const verification: any = await this.axiosInstance.post('/v2/mobile/verify', {
                connection_id: this._connectionId,
                proof_profile_path: "unrestricted.proof.request.json"
            });
            this._verificationId = verification.data.presentation_exchange_id;

            return Promise.resolve(verification.data);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    async createCredential(connectionId: string) {
        try {
            const credential: any = await this.axiosInstance.post('/v2/mobile/verify', {
                connection_id: this._connectionId,
            });
            this._credentialId = credential.data.credential_id;

            return Promise.resolve(credential.data);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    getProof(data: any) {
        return this.formatProof(data.presentation.requested_proof.revealed_attrs);
    }

    captureAndSendError(error: any, message: string) {
        const msg: string = I18n.getKey(message);
        this.setError(msg);
    }
}

// TODO: Implement verification interfaces
// TODO: Actually use these
interface ConnectionInviteResponse {
    connection_id: string,
    invitation: ConnectionInvitation,
    invitation_url: string
}

interface ConnectionInvitation {
    "@type": string,
    "@id": string,
    serviceEndpoint: string,
    recipientKeys: string[],
    label: string
}

interface ConnectionStatus {
    connectionId: string,
    routingState: string,
    initiator: string,
    invitation_mode: string,
    updated_at: string,
    state: string,
    invitation_key: string,
    accept: string,
    created_at: string
}