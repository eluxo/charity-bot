import React, {useEffect} from 'react';
import './Banner.css';
import {EventStatusData} from "../../types/EventStatusData";
import {FundraisingOpinion} from "../../types/FundraisingOpinion";
import {centsToEuro} from "../../types/Conversion";

export interface BannerProps {
    status: EventStatusData | null;
}

export default function Banner(props: BannerProps) {
    const [index, setIndex] = React.useState<number>(0);

    useEffect(() => {
        var i = 0;

        const interval = setInterval(() => {
            ++i;
            setIndex(i);
        }, 7000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    const status = props.status;
    if (status === null) {
        return (<div className="Banner"></div>);
    }

    const lastOpinion = status.lastOpinion;
    const topOpinions = status.topOpinions;
    const eventDetails = status.eventDetails;

    function viewTop() {

        let author = 'Anonymous';
        let amount = '-';

        if (topOpinions && topOpinions.length > 0) {
            const length = topOpinions.length;
            const topOpinion = topOpinions[index % Math.min(length, 5)];
            amount = centsToEuro(topOpinion.donated_amount_in_cents);
            author = topOpinion.author?.name || 'Anonymous';
        }

        return (<div>
            <h1>Top Spenden</h1>
            <p>{author}</p>
            <p>{amount}</p>
        </div>);
    }

    function viewTotal() {
        let raised: string = centsToEuro(eventDetails?.donated_amount_in_cents);
        return (<div>
            <h1>Spendenstand</h1>
            <p className="RaisedFund">{raised}</p>
        </div>);
    }

    function viewLast() {
        let author = lastOpinion?.author?.name || 'Anonymous';
        let amount = centsToEuro(lastOpinion?.donated_amount_in_cents);
        return (<div>
            <h1>Letzte Spende</h1>
            <p>{author}</p>
            <p>{amount}</p>
        </div>);
    }

    return (
        <div className="Banner">
            <div className="BannerBox BannerLeft">
                {viewTop()}
            </div>
            <div className="BannerBox BannerCenter">
                {viewTotal()}
            </div>
            <div className="BannerBox BannerRight">
                {viewLast()}
            </div>
        </div>
    );
}

