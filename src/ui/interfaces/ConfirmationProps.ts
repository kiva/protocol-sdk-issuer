export interface ConfirmationProps {
    integrationName: string
}

export interface CredentialKeyDefinition {
    name: string,
    dataType: string,
    options?: Array<string>
}

/*
 * PII: An acronym for "personally identifiable information"
 *
 * This includes things like name, phone number, date of birth, etc.
 * You can see a larger explanation of the term (and concept) at https://en.wikipedia.org/wiki/Personal_data
 *
 */
export interface CredentialKeyMap {
    [index: string]: CredentialKeyDefinition
}

export interface PIIFieldState {
    columnOne: string[],
    columnTwo: string[]
}
