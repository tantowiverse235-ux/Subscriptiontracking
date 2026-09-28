import dayjs from 'dayjs';
import { createRequire } from 'module';
import Subscription from '../models/subscription.model.js';
import { transporter } from '../config/email.js';
import { EMAIL_FROM } from '../config/env.js';
import { generateReminderEmail } from '../utils/email-templates.js';

const REMINDERS = [7, 5, 2, 1]; // hari sebelum renewal

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;

    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    for (const dayBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(dayBefore, 'day');

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${dayBefore} days before`, reminderDate);
            await triggerReminder(context, `Reminder ${dayBefore} days before`, subscription, dayBefore);
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    });
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription, daysLeft) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder for subscription ${subscription._id}`);

        const { subject, html } = generateReminderEmail({
            userName: subscription.user.name,
            subscriptionName: subscription.name,
            daysLeft,
            renewalDate: subscription.renewalDate,
            price: subscription.price,
            currency: subscription.currency,
            frequency: subscription.frequency,
        });

        await transporter.sendMail({
            from: EMAIL_FROM || `"SubsTrack" <${process.env.EMAIL_USER}>`,
            to: subscription.user.email,
            subject,
            html,
        });

        console.log(`Reminder email sent to ${subscription.user.email} for "${subscription.name}" (${daysLeft} days before renewal)`);
    });
};
