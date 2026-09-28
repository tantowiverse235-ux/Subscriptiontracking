import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } from './env.js';

export const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: Number(EMAIL_PORT) === 465, // true untuk port 465 (SSL), false untuk 587 (STARTTLS)
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});
