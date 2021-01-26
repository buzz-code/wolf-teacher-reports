import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import yemotRoutes from './yemot.route';

const router = express.Router();

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount user routes at /users
router.use('/users', userRoutes);

// mount user routes at /users
router.use('/yemot', yemotRoutes);

export default router;