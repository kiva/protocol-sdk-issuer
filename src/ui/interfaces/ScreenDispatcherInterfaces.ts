import {AuthOption} from "./AuthOptionInterfaces";

export interface ScreenDispatcherProps {
    screen: string,
    token: string,
    sessionId: string,
    isSandbox: boolean,
    authMethod: AuthOption
}