import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import I18n from '../utils/I18n';
import {CONSTANTS} from '../../constants/constants';

import {CloudWalletAgentInterface} from '../interfaces/CloudWalletAgentInterface';

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
                profile: CONSTANTS.credentialDefinition,
                guardianData:[
                    {
                        pluginType:"SMS_OTP",
                        filters: {
                            "externalIds": {
                                "companyEmail": credentialData.companyEmail
                            }
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