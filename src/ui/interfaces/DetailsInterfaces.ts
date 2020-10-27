export interface DetailsProps {
    personalInfo: any,
    actionButtonCaption: string,
    exportAction(): void,
    printButtonCaption: string
}

export interface DetailsState {
    personalInfo: any,
    selectedDetailsView: string
}