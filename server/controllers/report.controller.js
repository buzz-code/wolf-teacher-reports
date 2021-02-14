import HttpStatus from 'http-status-codes';
import bookshelf from '../config/bookshelf';
import Report from '../models/report.model';
import ReportType from '../models/reportType.model';
import Student from '../models/student.model';
import Teacher from '../models/teacher.model';
import genericController from './generic.controller';

export const { findAll, findById, store, update, destroy } = genericController(Report);

/**
 * Get edit data
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function getEditData(req, res) {
    const [reportTypes, students, teachers] = await Promise.all([
        getListFromTable(ReportType, req.currentUser.id),
        getListFromTable(Student, req.currentUser.id),
        getListFromTable(Teacher, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { reportTypes, students, teachers }
    });
}

function getListFromTable(table, user_id) {
    return new table({ user_id })
        .query({ select: ['id', 'name'] })
        .fetchAll()
        .then(result => result.toJSON());
}

/**
 * Get student report
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function getStudentReport(req, res) {
    new Report({ user_id: req.currentUser.id })
        .query(qb => {
            qb.innerJoin('students', 'students.id', 'reports.student_id')
            qb.groupBy('student_id', 'report_date', 'enter_hour', 'exit_hour')
            qb.select('students.tz as student_tz', 'students.name as student_name', 'report_date', 'enter_hour', 'exit_hour')
            qb.count({ count: 'reports.id' })
        })
        .fetchAll()
        .then(item => res.json({
            error: null,
            data: item.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 * Get teacher report
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function getTeacherReport(req, res) {
    new Report({ user_id: req.currentUser.id })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'reports.teacher_id')
            qb.groupBy('teacher_full_phone', 'teacher_name', 'report_date', 'lesson_number')
            qb.select('reports.teacher_full_phone as teacher_full_phone', 'teachers.name as teacher_name', 'report_date', 'lesson_number')
            qb.count({ count: 'reports.id' })
            qb.avg({ avg: 'other_students' })
        })
        .fetchAll()
        .then(item => res.json({
            error: null,
            data: item.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 * Get organization report
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function getOrganizationReport(req, res) {
    new Report({ user_id: req.currentUser.id })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'reports.teacher_id')
            qb.leftJoin('students', 'students.id', 'reports.student_id')
            qb.groupBy('teacher_full_phone', 'teacher_name', 'report_date')
            qb.select('reports.teacher_full_phone as teacher_full_phone', 'teachers.name as teacher_name', 'report_date',
                bookshelf.knex.raw('GROUP_CONCAT(distinct students.name SEPARATOR ", ") as students'))
        })
        .fetchAll()
        .then(item => res.json({
            error: null,
            data: item.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}
