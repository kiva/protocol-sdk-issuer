export interface CloudWalletAgentInterface {
    captureAndSendError: (error: any, message: string) => void,
    createCredential(credentialData: object): Promise<any>,
}