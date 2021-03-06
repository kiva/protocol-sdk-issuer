import {CredentialKeyMap} from "./ConfirmationProps";
import {AuthOption} from "./AuthOptionInterfaces";

export interface ReqAttributes {
    [index: string]: boolean | undefined,
    Fingerprint?: boolean,
    SMS?: boolean
}

interface CountryCodeConfig {
    only: boolean,
    countries: string[];
}

export interface Constants {
    controllerUrlBase: string,
    verification_options: AuthOption[],
    permittedOrigins: string,
    permittedIframeHosts: string[],
    permittedOriginPatterns?: string,
    permittedOpenerOrigins: string[],
    credentialKeyMap: CredentialKeyMap,
    isProd?: boolean,
    direction: string,
    agencyInfo: AgencyInfo,
    agent_port: string,
    cloudAgent: string,
    headerImage: string,
    token: string,
    phoneIntls?: CountryCodeConfig,
    // Ultimately this should be "string | CredentialDefinition", but figuring out the CredentialDefinition type is TBD
    credentialDefinition: any
}

export interface MessageMap {
    [index: string]: string
}

interface AgencyInfo {
    accessToken: string,
    policyId: string
}
