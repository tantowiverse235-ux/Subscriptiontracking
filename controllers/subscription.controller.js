import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id
            },
            headers: {
                'Content-Type': 'application/json'
            },
            retries: 0
        });

        // Simpan workflowRunId agar bisa di-cancel nanti
        subscription.workflowRunId = workflowRunId;
        await subscription.save();

        res.status(201).json({
            success: true,
            data: subscription
        });
    } catch (e) {
        next(e);
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find().populate('user', 'name email');
        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (e) {
        next(e);
    }
}

export const getSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id).populate('user', 'name email');

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        // Hanya pemilik subscription yang boleh melihat detail
        if (subscription.user._id.toString() !== req.user.id) {
            const error = new Error('You are not authorized to access this subscription');
            error.statusCode = 403;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: subscription
        });
    } catch (e) {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not authorized to access this account');
            error.statusCode = 403;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (e) {
        next(e);
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not authorized to update this subscription');
            error.statusCode = 403;
            throw error;
        }

        // Jangan biarkan user field di-overwrite lewat body
        const { user, workflowRunId, ...updateData } = req.body;

        const updated = await Subscription.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updated
        });
    } catch (e) {
        next(e);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not authorized to cancel this subscription');
            error.statusCode = 403;
            throw error;
        }

        if (subscription.status === 'canceled') {
            const error = new Error('Subscription is already canceled');
            error.statusCode = 400;
            throw error;
        }

        // Hentikan workflow reminder yang sedang berjalan
        if (subscription.workflowRunId) {
            try {
                await workflowClient.cancel(subscription.workflowRunId);
            } catch (workflowError) {
                // Workflow mungkin sudah selesai, log saja dan lanjutkan
                console.warn(`Could not cancel workflow ${subscription.workflowRunId}:`, workflowError.message);
            }
        }

        subscription.status = 'canceled';
        await subscription.save();

        res.status(200).json({
            success: true,
            data: subscription
        });
    } catch (e) {
        next(e);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not authorized to delete this subscription');
            error.statusCode = 403;
            throw error;
        }

        // Hentikan workflow reminder sebelum hapus
        if (subscription.workflowRunId) {
            try {
                await workflowClient.cancel(subscription.workflowRunId);
            } catch (workflowError) {
                console.warn(`Could not cancel workflow ${subscription.workflowRunId}:`, workflowError.message);
            }
        }

        await Subscription.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Subscription deleted successfully'
        });
    } catch (e) {
        next(e);
    }
}

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const today = new Date();
        const in7Days = new Date();
        in7Days.setDate(today.getDate() + 7);

        const subscriptions = await Subscription.find({
            user: req.user._id,
            status: 'active',
            renewalDate: {
                $gte: today,
                $lte: in7Days
            }
        }).sort({ renewalDate: 1 });

        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (e) {
        next(e);
    }
}
