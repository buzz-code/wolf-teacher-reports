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
import attReportRoutes from './att-report.route';
import dashboardRoutes from './dashboard.route';
import questionRoutes from './question.route';
import answerRoutes from './answer.route';
import workingDateRoutes from './working-date.route';

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
router.use('/att-reports', attReportRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/questions', questionRoutes);
router.use('/answers', answerRoutes);
router.use('/working-dates', workingDateRoutes);

export default router;