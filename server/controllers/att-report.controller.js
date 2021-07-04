import AttReport from '../models/att-report.model';
import AttType from '../models/att-type.model';
import LessonTime from '../models/lesson-time.model';
import Lesson from '../models/lesson.model';
import Student from '../models/student.model';
import Teacher from '../models/teacher.model';
import { getListFromTable } from '../utils/common';
import genericController, { applyFilters, fetchPage } from './generic.controller';

export const { findById, store, update, destroy, uploadMultiple } = genericController(AttReport);

/**
 * Find all the items
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function findAll(req, res) {
    const dbQuery = new AttReport({ user_id: req.currentUser.id })
        .query(qb => {
            qb.leftJoin('students', 'students.id', 'att_reports.student_id')
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('lessons', 'lessons.id', 'att_reports.lesson_id')
            qb.leftJoin('lesson_times', 'lesson_times.id', 'att_reports.lesson_time_id')
            qb.leftJoin('att_types', 'att_types.id', 'att_reports.att_type_id')
            qb.select('att_reports.*')
        });
    applyFilters(dbQuery, req.query.filters);
    fetchPage({ dbQuery }, req.query, res);
}

/**
 * Get edit data
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function getEditData(req, res) {
    const [students, teachers, lessons, lessonTimes, attTypes] = await Promise.all([
        getListFromTable(Student, req.currentUser.id),
        getListFromTable(Teacher, req.currentUser.id),
        getListFromTable(Lesson, req.currentUser.id),
        getListFromTable(LessonTime, req.currentUser.id),
        getListFromTable(AttType, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { students, teachers, lessons, lessonTimes, attTypes }
    });
}
