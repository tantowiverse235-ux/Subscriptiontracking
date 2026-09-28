import {Router} from 'express'; 
import  authorize  from '../middlewares/auth.middleware.js';
import { createSubscription } from '../controllers/subscription.controller.js';
import { getUserSubscriptions } from '../controllers/subscription.controller.js';
const subscriptionRouter = Router();

// Static routes must be defined before parameterized /:id routes
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'Get all upcoming renewals' }));
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.get('/', (req, res) => res.send({ title: 'Get all subscriptions' }));
subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'Get details subscription' }));

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'Cancel subscription' }));
subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'Update subscription' }));

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'Delete subscription' }));

export default subscriptionRouter;