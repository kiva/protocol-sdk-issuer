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
            baseURL: "https://gateway.protocol-dev.kiva.org/v2/kiva/api/",
            headers: {
                Authorization: 'Bearer ' + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5UQTRPRVJGUXpsQ1JVTkdRMEV6TXprNE56TTBOa014UlVSRFJUTkJRakU1UWpGQk5qUkNPUSJ9.eyJpc3MiOiJodHRwczovL2tpdmEtcHJvdG9jb2wtc3RhbmRhbG9uZS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWU3ZGYxOTc4YzNmZmMwY2JlMjIxOGI1IiwiYXVkIjpbImh0dHBzOi8va2l2YS1wcm90b2NvbC1zdGFuZGFsb25lLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9raXZhLXByb3RvY29sLXN0YW5kYWxvbmUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYwNjgzNzI5MiwiZXhwIjoxNjA5NDI5MjkyLCJhenAiOiI5dTJZV09COUZQRWE2MjBDSHFBbVEwTEhqY1U5UlFnNiIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgYWRkcmVzcyBwaG9uZSByZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIGRlbGV0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgY3JlYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBjcmVhdGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyBkZWxldGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyB1cGRhdGU6Y3VycmVudF91c2VyX2lkZW50aXRpZXMiLCJndHkiOiJwYXNzd29yZCJ9.Y8kPe17yeym2obP1b4VselHZYTLUXIA4cYjn2IADSwDaSvX5RT5ubNeB-p69eU88pS0ZzU692KuAr1OvIOSzYnMQ3iXMLdt_bdojJknpBrPbLqzgzO_NnjbeMl91jr3XysiJDCufQVKxerEP4eAwNLoSytyNsmaeJc8ZTccUy-HQCNIhvqsQMPfAx_oB2R04cpE13nP-Wd7u8GO9q_ydVJL_TxhacgeG4cLfTvBTwbu718hCZNw4jcU0TN_cpbIhrN7zxwV7jgBzwuBO8lUspAuwNO5gFD4Wumsehz6qjrS5_kZ5Au9vY9uyFZik2sYa7LAtJqpwlMqeyHWlmWPgrw"
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
        const msg: string = I18n.getKey(message);
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
