import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { getUsers, getUser } from '../controllers/user.controller.js';
const userRouter = Router();


//get all users
//get /users/i
userRouter.get('/',getUsers);
userRouter.get('/:id',authorize, getUser);
userRouter.post('/', (req, res) => res.send({ body:{title : 'CREATE New user'}  }));
userRouter.put('/:id', (req, res) => res.send({ body:{title : 'Update user'}  }));
userRouter.delete('/:id', (req, res) => res.send({ body:{title : 'Delete user'}  }));

export default userRouter;