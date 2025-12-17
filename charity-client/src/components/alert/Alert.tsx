import {FundraisingOpinion} from "../../types/FundraisingOpinion";
import "./Alert.css";
import {useEffect} from "react";
import {centsToEuro} from "../../types/Conversion";
import {DonationEvent} from "../../types/DonationEvent";

export interface AlertProps {
    donationEvent: DonationEvent | null;
    setDonationEvent: any;
}

export default function Alert(props: AlertProps) {
    const author = props.donationEvent?.donor_display_name || 'Anonymous';
    const amount = centsToEuro(props.donationEvent?.amount_in_cents);

    useEffect(() => {
        const newAudio = new Audio('sound.mp3');
        try {
            newAudio.loop = false;
            newAudio.play().catch((err) => {
                console.warn(err);
            });
            newAudio.onended = (ev) => {
                console.log("ended");
            }
        } catch (err) {
            console.log(err);
        }

        const timeout = setTimeout(() => {
            props.setDonationEvent(null);
        }, 10000);
        return () => {
            newAudio.pause();
            clearTimeout(timeout);
        };
    }, []);

    return (<div className="Alert">
        <img src="/logo.png" alt="logo" />
        <p><b>{author}</b></p>
        <p><b>{amount}</b></p>
    </div>);
}
