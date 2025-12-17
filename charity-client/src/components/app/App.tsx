import React, {useEffect, useState} from 'react';
import './App.css';
import Banner from "../banner/Banner";
import { io, Socket } from 'socket.io-client';
import {FundrisingEventDetails} from "../../types/FundrisingEventDetails";
import {EventStatusData} from "../../types/EventStatusData";
import {FundraisingOpinion} from "../../types/FundraisingOpinion";
import Alert from "../alert/Alert";
import {DonationEvent} from "../../types/DonationEvent";

function App() {
    const [socket, setSocket] = useState<Socket>();
    const [isConnected, setIsConnected] = React.useState(false);
    const [eventStatus, setEventStatus] = React.useState<EventStatusData | null>(null);
    const [donationEvent, setDonationEvent] = React.useState<DonationEvent | null>(null);

    useEffect(() => {
        const newSocket = io('/', {
            autoConnect: false
        });
        setSocket(newSocket);
        newSocket.connect();

        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onWelcome(message: any) {
            console.log(message);
        }

        function onStatus(status: EventStatusData) {
            console.log(status);
            setEventStatus(status);
        }

        function onEvent(event: DonationEvent) {
            console.log(event);
            setDonationEvent(event);
        }

        newSocket.on('connect', onConnect);
        newSocket.on('disconnect', onDisconnect);
        newSocket.on('welcome', onWelcome);
        newSocket.on('status', onStatus);
        newSocket.on('event', onEvent);

        return () => {
            newSocket.off('connect', onConnect);
            newSocket.off('disconnect', onDisconnect);
            newSocket.off('welcome', onWelcome);
            newSocket.off('status', onStatus);
            newSocket.off('event', onEvent);
            newSocket.disconnect();
        }
    }, []);

    return (
        <div className="App" >
            <Banner status={eventStatus} />
            {donationEvent ? <Alert donationEvent={donationEvent} setDonationEvent={setDonationEvent} /> : null }
        </div>
    );
}

export default App;
