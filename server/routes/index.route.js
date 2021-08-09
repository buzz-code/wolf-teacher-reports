import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import yemotRoutes from './yemot.route';
import teacherRoutes from './teacher.route';
import studentRoutes from './student.route';
import attTypeRoutes from './att-type.route';
import teacherTypeRoutes from './teacher-type.route';
import priceRoutes from './price.route';
import textRoutes from './text.route';
import dashboardRoutes from './dashboard.route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/yemot', yemotRoutes);
router.use('/teachers', teacherRoutes);
router.use('/students', studentRoutes);
router.use('/att-types', attTypeRoutes);
router.use('/teacher-types', teacherTypeRoutes);
router.use('/prices', priceRoutes);
router.use('/texts', textRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;