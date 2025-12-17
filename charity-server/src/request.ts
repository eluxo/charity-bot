import fetch from "node-fetch";

export interface FundrisingEventDetails {
    id: number;
    donations_count: number;
    donor_count: number;
    donated_amount_in_cents: number;
    requested_amount_in_cents: number;
    process_percentage: number;
}

/**
 * Requests the fundrising event status.
 */
export async function fetchFundrisingEventDetails(fundraising_event: number): Promise<FundrisingEventDetails> {
    const response = await fetch(`https://api.betterplace.org/de/api_v4/fundraising_events/${fundraising_event}.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as FundrisingEventDetails;
    //console.log('Remote API data:', data);
    return data;
}

export interface PaginationData<T> {
    current_page: number;
    offset: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
    data: T[];
}

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

export async function fetchLastOpinion(fundraising_event: number): Promise<FundraisingOpinion | null> {
    const response = await fetch(`https://api.betterplace.org/de/api_v4/fundraising_events/${fundraising_event}/opinions.json?order=updated_at:DESC`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payload = await response.json() as PaginationData<FundraisingOpinion>;
    if (payload.data && payload.data.length > 0 && payload.data[0]) {
        const data = payload.data[0];
        //console.log('Remote API data:', data);
        return data;
    }
    return null;
}

export async function fetchTopOpinions(fundraising_event: number): Promise<FundraisingOpinion[]> {
    const response = await fetch(`https://api.betterplace.org/de/api_v4/fundraising_events/${fundraising_event}/opinions.json?order=amount_in_cents:DESC`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payload = await response.json() as PaginationData<FundraisingOpinion>;
    if (payload.data) {
        const data = payload.data;
        //console.log('Remote API data:', data);
        return data;
    }
    return [];
}

