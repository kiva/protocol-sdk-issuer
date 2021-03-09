import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import I18n from '../utils/I18n';
import BaseAgent from './BaseAgent';

import {IAgent} from '../interfaces/AgentInterfaces';

import {CONSTANTS} from '../../constants/constants';

export default class KivaAgent extends BaseAgent implements IAgent {
    protected setError: any;
    public token: string;
    public axiosInstance: AxiosInstance;
    private _connectionId?: string;
    private _credentialId?: string;

    static init(token: string): KivaAgent {
        return new KivaAgent(token);
    }

    constructor(token: string) {
        super();
        const axiosConfig: AxiosRequestConfig = {
            baseURL: CONSTANTS.controllerUrlBase + "/v2/kiva/api/",
            headers: {
                Authorization: 'Bearer ' + token,
            }
        };
        this.token = token;
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

    getData(axiosData: any) {
        return axiosData.data;
    }

    async establishConnection(ignore: string) {
        return super.establish(
            this.axiosInstance.post("connection", {},),
            (connection: any) => {
                this._connectionId = connection.data.connection_id;
                return btoa(JSON.stringify(connection.data.invitation));
            },
            I18n.getKey("QR_CONNECTION_ERROR")
        );
    }

    async getConnection(ignore: string) {
        return super.establish(
            this.axiosInstance.get("connection/" + this._connectionId, {},),
            this.getData,
            I18n.computeKey({
                connectionId: this._connectionId
            }, 'QR_NOT_FOUND')
        );
    }

    async createCredential(entityData: object) {
        return super.offer(
            this.axiosInstance.post('issue', {
                profile: CONSTANTS.credentialDefinition,
                connectionId: this._connectionId,
                entityData
            }),
            (credentialData: any) => {
                this._credentialId = credentialData.data.credential_exchange_id;
                return credentialData.data;
            },
            I18n.getKey("UNKNOWN_ERROR")
        );
    }

    async checkCredentialStatus(ignore: string) {
        return super.issue(
            this.axiosInstance.get('issue/' + this._credentialId),
            this.getData,
            I18n.getKey("UNKNOWN_ERROR")
        );
    }
}
