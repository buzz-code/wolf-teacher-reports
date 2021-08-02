import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import yemotRoutes from './yemot.route';
import studentRoutes from './student.route';
import teacherRoutes from './teacher.route';
import groupRoutes from './group.route';
import studentKlassRoutes from './student-klass.route';
import lessonRoutes from './lesson.route';
import lessonTimeRoutes from './lesson-time.route';
import attTypeRoutes from './att-type.route';
import attReportRoutes from './att-report.route';
import reportEditRoutes from './report-edit.route';
import dashboardRoutes from './dashboard.route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/yemot', yemotRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/groups', groupRoutes);
router.use('/student-klasses', studentKlassRoutes);
router.use('/lessons', lessonRoutes);
router.use('/lesson-times', lessonTimeRoutes);
router.use('/att-types', attTypeRoutes);
router.use('/att-reports', attReportRoutes);
router.use('/report-edit', reportEditRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;