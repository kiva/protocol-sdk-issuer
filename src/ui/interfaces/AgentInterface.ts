export interface Agent {
    establishConnection(connectionId: string): Promise<any>,
    getConnection(connectionId: string): Promise<any>,
    captureAndSendError: (error: any, message: string) => void,
    isConnected(response: any): boolean,
    isIssued(response: any): boolean,
    isOffered(response: any): boolean,
    checkCredentialStatus(credentialId: string): Promise<any>,
    createCredential(credentialData: object): Promise<any>,
}