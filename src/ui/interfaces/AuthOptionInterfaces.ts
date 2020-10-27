export interface AuthOption {
    id: string,
    title: string,
    description: string,
    guardian: boolean,
    sequence: string[]
}

export interface MenuOptionProps {
    key: string,
    id: string,
    title: string,
    description: string,
    selected: boolean,
    setAuthType(option: number): void,
    recommended: boolean,
    option_index: number
}

export interface AuthOptionProps {
    verification_opts: AuthOption[],
    setNewAuthType: (index: number) => void,
    authIndex: number
}

export interface AuthOptionState {
    optionSelected: number
}