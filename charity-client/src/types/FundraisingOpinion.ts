export interface FundraisingOpinion {
    id: number;
    created_at: string;
    updated_at: string;
    donated_amount_in_cents: number | null;
    matched_amount_in_cents: number | null;
    matched: boolean;
    author: {
        name: string;
        id: number;
    } | null;
}
