import express, { Router } from 'express';
import { loginUser, logutUser, myProfile, refreshToken, registerUser, verifyOtp, verifyUser } from '../controllers/user.controller.js';
import { isAuth } from '../middlewares/isAuth.js';

const userRouter = Router();

userRouter.post('/register',registerUser);
userRouter.post('/verify/:token',verifyUser);
userRouter.post('/login',loginUser);
userRouter.post('/verify',verifyOtp);
userRouter.get('/me',isAuth, myProfile);
userRouter.post('/refresh',refreshToken);
userRouter.post('/logout', isAuth, logutUser);


export default userRouter;
