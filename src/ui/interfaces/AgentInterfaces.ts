type TBaseAgentFunction = (request: Promise<any>, callback: (data: any) => any, error?: string) => Promise<any>;

export interface IBaseAgent {
    establish: TBaseAgentFunction,
    check: TBaseAgentFunction,
    offer: TBaseAgentFunction,
    issue: TBaseAgentFunction
}

export interface IAgent {
    establishConnection(connectionId: string): Promise<any>,
    getConnection(connectionId: string): Promise<any>,
    isConnected(response: any): boolean,
    isIssued(response: any): boolean,
    isOffered(response: any): boolean,
    checkCredentialStatus(credentialId: string): Promise<any>,
    createCredential(credentialData: object): Promise<any>,
}
