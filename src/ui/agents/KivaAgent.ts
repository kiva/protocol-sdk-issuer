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
    private _credentialId?: string;

    static init(token: string, callback: any): KivaAgent {
        return new KivaAgent(token, callback);
    }

    constructor(token: string, callback: any) {
        const axiosConfig: AxiosRequestConfig = {
            baseURL: "https://sandbox-gateway.protocol-prod.kiva.org/v2/kiva/api/",
            headers: {
                Authorization: 'Bearer ' + token,
            }
        };
        this.token = token;
        this.setError = callback;
        this.axiosInstance = axios.create(axiosConfig);
    }

    isConnected(response: any): boolean {
        const state: string = response.state;
        return state === "response" || state === "active";

    }

    isOffered(response: any): boolean {
        if (response.state === "offer_sent") {
            return true;
        }
        return false;
    }

    isIssued(response: any): boolean {
        if (response.state === "credential_issued") {
            return true;
        }
        return false;
    }

    async establishConnection(ignore: string) {
        try {
            let connection: any = await this.axiosInstance.post('connection', {});
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
            let connection: any = await this.axiosInstance.get('connection/' + this._connectionId);

            return Promise.resolve(connection.data);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(`Couldn't find record of connection { ${this._connectionId} }`);
        }
    }

    async checkCredentialStatus(ignore: string) {
        try {
            const credential: any = await this.axiosInstance.get('issue/' + this._credentialId);

            return Promise.resolve(credential.data);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    async createCredential(credentialData: object) {
        try {
            const credential: any = await this.axiosInstance.post('issue', {
                profile: "employee.cred.def.json",
                connectionId: this._connectionId,
                entityData: credentialData
            });
            this._credentialId = credential.data.credential_exchange_id;
            return Promise.resolve(credential.data);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    captureAndSendError(error: any, message: string) {
        const errorDetails = ` (${error.response.data.code}: ${error.response.data.message})`;
        const msg: string = I18n.getKey(message) + errorDetails;
        this.setError(msg);
    }
}

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
