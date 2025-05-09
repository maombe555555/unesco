import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection } from 'mongodb';

// Environment Variables
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Utility function to connect to MongoDB
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        cachedClient = client;
        const db = client.db(MONGODB_DB);
        cachedDb = db;
        return { client, db };
    } catch (error) {
        await client.close();
        throw error;
    }
}

// Utility function to send emails (using Nodemailer)
async function sendEmail(to: string, subject: string, text: string): Promise<void> {
    if (!EMAIL_USER || !EMAIL_PASS) {
        console.warn('Email sending is disabled. Provide EMAIL_USER and EMAIL_PASS to send emails');
        return;
    }
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        host: EMAIL_SERVICE,
        port: 587,
        secure: false,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: 'maseemmy200@gmail.com',
        to: to,
        subject: subject,
        text: text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${info.messageId}`);
    } catch (error: any) {
        console.error('Error sending email:', error);
        throw error;
    }
}

/**
 * API Route: /api/applicants
 * Method: GET
 * Description: Fetches all applicants from the database.
 */
export async function getApplicants(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { db } = await connectToDatabase();
        const collection: Collection<Applicant> = db.collection('projectApplicants');

        const applicants = await collection.find({}, { projection: { _id: 1, email: 1, name: 1 } }).toArray();
        res.status(200).json(applicants);
    } catch (error: any) {
        console.error('Error fetching applicants:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch applicants' });
    }
}

/**
 * API Route: /api/notifications
 * Method: POST
 * Description: Sends notifications to selected applicants.
 */
export async function sendNotifications(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { emails, message } = req.body;

    if (!emails || !message) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
        const { db } = await connectToDatabase();
        const collection: Collection<Applicant> = db.collection('projectApplicants');

        const foundApplicants = await collection.find({ email: { $in: emails } }).toArray();

        if (!foundApplicants || foundApplicants.length !== emails.length) {
            return res.status(400).json({ message: 'One or more emails not found in database' });
        }

        for (const applicant of foundApplicants) {
            try {
                await sendEmail(applicant.email, 'Notification', message);
            } catch (emailError: any) {
                console.error(`Failed to send email to ${applicant.email}:`, emailError);
            }
        }

        res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error: any) {
        console.error('Error sending notifications:', error);
        res.status(500).json({ message: error.message || 'Failed to send notifications' });
    }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            await getApplicants(req, res);
            break;
        case 'POST':
            await sendNotifications(req, res);
            break;
        default:
            res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export type Applicant = {
    _id: string;
    email: string;
    name: string;
};