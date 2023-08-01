export enum Frequency {
    YEARLY,
    HALF_YEARLY,
    QUARTERLY,
    MONTHLY,
    CUSTOM
}

export default function frequencyToLocalizationKey(frequency: number) {
    switch (frequency) {
        case 12:
            return "frequency.yearly"
        case 6: 
            return "frequency.halfYearly"
        case 4:
            return "frequency.quarterly"
        case 1:
            return "frequency.monthly"
        default:
            return "frequency.custom"
    }
}