import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import I18n from '../utils/I18n';

import {CloudWalletAgentInterface} from '../interfaces/CloudWalletAgentInterface';
import {PIImap} from '../interfaces/ConfirmationProps';
import {CONSTANTS} from '../../constants/constants';

const PII: PIImap = CONSTANTS.pii_map;

export default class CloudWalletAgent implements CloudWalletAgentInterface {
    protected setError: any;
    public token: string;
    public axiosInstance: AxiosInstance;
    static init(token: string, callback: any): CloudWalletAgent {
        return new CloudWalletAgent(token, callback);
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

    async createCredential(credentialData: any) {
        try {
            const credential: any = await this.axiosInstance.post('guardian/onboard', {
                profile: "employee.cred.def.json",
                guardianData:[
                  {
                     pluginType:"SMS_OTP",
                     filters: {
                        "govId1": "company@email.com",
                        "govId2": "company@email.com"
                     },
                     "params": {
                        "phoneNumber": credentialData.phoneNumber
                     }
                  }
               ],
                entityData: credentialData
            });
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