export interface DonationEvent {
    sequence_number: number;
    amount_in_cents: number | undefined;
    donor_display_name: string | undefined;
}
