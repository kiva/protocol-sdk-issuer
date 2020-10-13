import axios from 'axios';
import I18n from '../utils/I18n';

import {Agent} from '../interfaces/AgentInterface';

import {CONSTANTS} from '../../constants/constants';

let photo: string;

import("../../assets/images/kiva").then(res => {
    photo = res.default;
});

export default class LocalAgent implements Agent {

    protected setError: any;
    public localAgentUri = "http://localhost:" + CONSTANTS.agent_port;

    static init(callback: any): LocalAgent {
        return new LocalAgent(callback);
    }

    constructor(callback: any) {
        this.setError = callback;
    }

    isConnected(response: ConnectionStatus): boolean {
        if (response.status === "Connected") {
            return true;
        }
        return false;
    }

    isVerified(response: VerificationStatus): boolean {
        if (response.verified) {
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
            let verificationStatus: any = await axios.post(this.localAgentUri + "/Verification/Check", {verificationId});
            return Promise.resolve(verificationStatus.data);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    async sendVerification(connectionId: string) {
        try {
            let verification: any = await axios.post(this.localAgentUri + "/Verification/Send", {connectionId});
            
            return Promise.resolve(verification.data);
        } catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    async getConnection(connectionId: string) {
        try {
            const connection = await axios.post(this.localAgentUri + "/Connections/Status", {connectionId});
            
            return Promise.resolve(connection.data);
        }  catch (e) {
            this.captureAndSendError(e, 'UNKNOWN_ERROR');
            return Promise.reject(e);
        }
    }

    async establishConnection(connectionId: string) {
        try {
            const response = await axios.post(this.localAgentUri + "/Connections/Invite", {connectionId});
            const data = response.data;

            return data.url;
        } catch (e) {
            this.captureAndSendError(e, 'QR_CONNECTION_ERROR');
            return Promise.reject('Local agent connection failed');
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
    connectionId: string,
    status: string
}

interface VerificationStatus {
    verificationId: string,
    verified: boolean,
    // For now there's a discrepancy between the credential issued from the admin tool and the backend response
    // TODO: Use a PII map for this type at some point
    proof?: any
}