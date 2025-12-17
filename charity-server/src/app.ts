import express, { Request, Response } from 'express';
import {
    fetchFundrisingEventDetails,
    fetchLastOpinion,
    fetchTopOpinions,
    FundraisingOpinion,
    FundrisingEventDetails
} from "./request";
import { Server } from 'socket.io';
import { createServer } from "node:http";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 23023;
const EVENT = process.env.EVENT || null;
const REFRESH_INTERVAL = process.env.REFRESH_INTERVAL || "2500";

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.emit('welcome',{
        message: 'v1.0',
        socket: socket.id
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

interface DonationEvent {
    sequence_number: number;
    amount_in_cents: number | undefined;
    donor_display_name: string | undefined;
}

interface WebhookEvent {
    event_name: string | undefined;
    donation: DonationEvent | undefined;
}

// Webhook endpoint
app.post('/webhook', (req: Request, res: Response) => {
    try {
        let objectData = req.body;
        if (typeof req.body === 'string') {
            // this workaround is required as betterplace uses mime-type text/plain for JSON.
            try {
                console.warn('Do betterplace.org workaround.');
                objectData = JSON.parse(objectData);
            } catch (err) {
                console.error('received invalid data via webhook', err);
            }
        }

        const webhookEvent = objectData as WebhookEvent;
        console.log('Received webhook data:', webhookEvent);

        const donationEvent = webhookEvent.donation;
        if (!donationEvent) {
            throw new Error('Donation not found');
        }

        console.log(`Broadcast event to ${io.engine.clientsCount} clients: ${donationEvent.amount_in_cents} cents donation by ${donationEvent.donor_display_name}`);
        io.emit('event', donationEvent);
    } catch (err) {
        console.error(err);
    }

    // make sure to always send 200 back.
    res.status(200).send("");
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('RUNNING');
});

// Start the server
httpServer.listen(PORT, () => {
    refresh().catch((err: Error) => { console.log(err); });
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
    console.log(`Socket.IO endpoint: ws://localhost:${PORT}/`);
});

export interface EventStatusData {
    eventDetails: FundrisingEventDetails;
    lastOpinion: FundraisingOpinion | null;
    topOpinions: FundraisingOpinion[];
}

async function refresh() {
    if (!EVENT) return;
    const eventId = parseInt(EVENT);
    const refreshInterval = parseInt(REFRESH_INTERVAL);

    while (true) {
        try {
            const eventDetails = await fetchFundrisingEventDetails(eventId);
            const lastOpinion = await fetchLastOpinion(eventId);
            const topOpinions = await fetchTopOpinions(eventId);

            const statusData: EventStatusData = {
                eventDetails: eventDetails,
                lastOpinion: lastOpinion,
                topOpinions: topOpinions
            }

            console.log(`Broadcast status to ${io.engine.clientsCount} clients.`);
            io.emit('status', statusData);
        } catch (err) {
            console.error(`failed to fetch update for ${eventId}`, err);
        }
        await new Promise(resolve => setTimeout(resolve, refreshInterval));
    }
}

