import {PIImap} from "./ConfirmationProps";
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
    ekycURI: string,
    verification_options: AuthOption[],
    permittedOrigins: string,
    permittedIframeHosts: string[],
    permittedOriginPatterns?: string,
    pii_map: PIImap,
    isProd?: boolean,
    direction: string,
    agencyInfo: AgencyInfo,
    agent_port: string,
    cloudAgent: string,
    headerImage: string
}

export interface MessageMap {
    [index: string]: string
}

interface AgencyInfo {
    accessToken: string,
    policyId: string
}
