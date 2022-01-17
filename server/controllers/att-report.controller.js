import AttReport from '../models/att-report.model';
import AttType from '../models/att-type.model';
import Teacher from '../models/teacher.model';
import TeacherType from '../models/teacher-type.model';
import genericController, { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';
import { getSeminarKitaLessonCount, getSeminarKitaTotalPay } from '../utils/reportHelper';
import bookshelf from '../../common-modules/server/config/bookshelf';
import { pdsPrices, trainingPrices } from '../utils/pricesHelper';

export const { findById, store, update, destroy, uploadMultiple } = genericController(AttReport);

/**
 * Find all the items
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function findAll(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('teacher_types', 'teacher_types.id', 'teachers.teacher_type_id')
            qb.select('att_reports.*')
            qb.select({ teacher_type_name: 'teacher_types.name', teacher_training_teacher: 'teachers.training_teacher' })
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
    const [teachers, attTypes, teacherTypes] = await Promise.all([
        getListFromTable(Teacher, req.currentUser.id),
        getListFromTable(AttType, req.currentUser.id),
        getListFromTable(TeacherType, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { teachers, attTypes, teacherTypes }
    });
}

export function getSeminarKitaReport(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 1 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('teacher_salary_types', 'teacher_salary_types.id', 'teachers.teacher_salary_type_id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_salary_type: 'teacher_salary_types.name'
        })
        qb.select('report_date', 'update_date', 'first_conference', 'second_conference', getSeminarKitaLessonCount(4), { total_pay: getSeminarKitaTotalPay(4) })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export function getTrainingReport(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 2 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher'
        })
        qb.select('report_date', 'update_date', 'how_many_watched', 'how_many_student_teached', 'was_discussing', 'how_many_private_lessons', 'att_reports.training_teacher')
        qb.select({
            teacher_salary: bookshelf.knex.raw('(how_many_watched * ' + trainingPrices.watch + ' + ' +
                'how_many_student_teached * ' + trainingPrices.teach + ' + ' +
                'IF(was_discussing, was_discussing, 0) * ' + trainingPrices.discuss + ' + ' +
                'IF(how_many_private_lessons, how_many_private_lessons, 0) * ' + trainingPrices.privateLesson + ')')
        })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export function getManhaReport(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 3 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz'
        })
        qb.select('report_date', 'update_date', 'how_many_methodic')
    });
    fetchPage({ dbQuery }, req.query, res);
}

export function getResponsibleReport(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 4 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('att_types', 'att_types.id', 'att_reports.activity_type')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            activity_type_name: 'att_types.name'
        })
        qb.select('report_date', 'update_date')
    });
    fetchPage({ dbQuery }, req.query, res);
}

export function getPdsReport(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 5 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('teacher_salary_types', 'teacher_salary_types.id', 'teachers.teacher_salary_type_id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_salary_type: 'teacher_salary_types.name'
        })
        qb.select('report_date', 'update_date', 'first_conference', 'second_conference', 'how_many_watched', 'how_many_student_teached', 'was_discussing')
        qb.select({
            teacher_salary: bookshelf.knex.raw('(how_many_watched * ' + pdsPrices.watch + ' + ' +
                'how_many_student_teached * ' + pdsPrices.teach + ' + ' +
                'IF(was_discussing, was_discussing, 0) * ' + pdsPrices.discuss + ')')
        })
    });
    fetchPage({ dbQuery }, req.query, res);
}
