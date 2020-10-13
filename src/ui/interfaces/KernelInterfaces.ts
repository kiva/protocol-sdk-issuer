export interface KernelProps {

}

export interface KernelState {
    [index: string]: any,
    step: string,
    did: string,
    flowControllerStepOverride: string,
    header: string,
    footer: string,
    isLoading: boolean,
    token: string,
    personalInfo: any,
    isSandbox: boolean,
    isStandalone: boolean,
    sessionId: any,
    authIndex: number
}