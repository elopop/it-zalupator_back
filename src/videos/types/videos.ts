export enum Resolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160',
}

export interface Video {
    /** integer($int32) */
    id: number;
    title: string;                     // maxLength: 40
    author: string;                    // maxLength: 20
    canBeDownloaded: boolean;          // default: false
    /** 1..18, null = no restriction */
    minAgeRestriction: number | null;  // default: null
    /** ISO string */
    createdAt: string;                 // date-time
    /** ISO string; default: createdAt + 1 day */
    publicationDate: string;           // date-time
    availableResolutions: Resolutions[];
}