import {FundrisingEventDetails} from "./FundrisingEventDetails";
import {FundraisingOpinion} from "./FundraisingOpinion";

export interface EventStatusData {
    eventDetails: FundrisingEventDetails;
    lastOpinion: FundraisingOpinion | null;
    topOpinions: FundraisingOpinion[];
}
