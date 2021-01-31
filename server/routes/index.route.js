import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import yemotRoutes from './yemot.route';
import reportRoutes from './report.route';
import reportTypeRoutes from './reportType.route';
import studentRoutes from './student.route';
import teacherRoutes from './teacher.route';
import textRoutes from './text.route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/yemot', yemotRoutes);
router.use('/reports', reportRoutes);
router.use('/report-types', reportTypeRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/texts', textRoutes);

export default router;