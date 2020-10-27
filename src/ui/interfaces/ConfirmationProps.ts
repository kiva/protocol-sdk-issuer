export interface ConfirmationProps {
    integrationName: string
}

interface PIIdefinition {
    name: string,
    rendered?: boolean,
    wide?: boolean,
    alternateKey?: string,
    alternateName?: string
}

/*
 * PII: An acronym for "personally identifiable information"
 *
 * This includes things like name, phone number, date of birth, etc.
 * You can see a larger explanation of the term (and concept) at https://en.wikipedia.org/wiki/Personal_data
 *
 */
export interface PIImap {
    [index: string]: PIIdefinition
}

export interface PIIFieldsProps {
    fields: PIImap
}

export interface PIIFieldState {
    columnOne: string[],
    columnTwo: string[]
}