export interface QRProps {
    setConnectionId(id: string): Promise<void>,
    verifyConnection(established: boolean): Promise<void>,
    connectionId: string,
    connected: boolean,
    token: string
}

export interface QRState {
    inviteUrl: string | undefined,
    connectionError: string,
    retrievingInviteUrl: boolean,
    verifying: boolean
}

export interface QRButtonProps {
    onSubmit(): void,
    onClickBack(): void,
    onReset(): void
}