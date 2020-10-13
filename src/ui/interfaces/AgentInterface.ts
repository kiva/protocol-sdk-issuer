export interface Agent {
    checkVerification(verificationId: string): Promise<any>,
    sendVerification(connectionId: string): Promise<any>
    establishConnection(connectionId: string): Promise<any>,
    getConnection(connectionId: string): Promise<any>,
    captureAndSendError: (error: any, message: string) => void,
    isConnected(response: any): boolean,
    isVerified(response: any): boolean,
    getProof(response: any): any,
    formatProof(response: any): any
}