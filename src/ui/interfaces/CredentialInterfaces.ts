import {PIIdefinition} from "./ConfirmationProps";

interface CredentialKey extends PIIdefinition {
    credentialKeys: string[]
}

export interface CredentialMap {
    [index: string]: CredentialKey
}
