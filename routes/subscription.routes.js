import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import {
    createSubscription,
    getAllSubscriptions,
    getSubscription,
    getUserSubscriptions,
    updateSubscription,
    cancelSubscription,
    deleteSubscription,
    getUpcomingRenewals
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

// Static routes dulu sebelum parameterized /:id
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.get('/', authorize, getAllSubscriptions);
subscriptionRouter.get('/:id', authorize, getSubscription);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);
subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

export default subscriptionRouter;
