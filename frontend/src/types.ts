export enum ConsentType {
    NEWSLETTER = 'newsletter',
    TARGETED_ADS = 'targeted-ads',
    VISIT_STATS = 'visit-stats',
}

export const CONSENT_TYPES: Array<ConsentType> = [
    ConsentType.NEWSLETTER,
    ConsentType.TARGETED_ADS,
    ConsentType.VISIT_STATS,
];

export const CONSENT_TYPE_LABEL: { [key in ConsentType]: string } = {
    [ConsentType.NEWSLETTER]: "Receive newsletter",
    [ConsentType.TARGETED_ADS]: "Be shown targeted ads",
    [ConsentType.VISIT_STATS]: "Contribute to anonymous visitor statistics",
}

export interface Consent {
    name: string;
    email: string;
    consents: Array<ConsentType>
}