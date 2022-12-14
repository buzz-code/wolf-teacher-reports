import HttpStatus from 'http-status-codes';
import { AttReport, AttType, Teacher, TeacherType } from '../models';
import { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';
import { getCoalesceAndPrice, getPdsTeacherSalary, getSeminarKitaLessonCount, getSeminarKitaTotalPay, getTrainingTeacherSalary } from '../utils/reportHelper';
import { updateSalaryMonthByUserId, updateSalaryCommentByUserId, getPrices } from '../utils/queryHelper';
import bookshelf from '../../common-modules/server/config/bookshelf';

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
            qb.leftJoin('teacher_types', { 'teacher_types.key': 'teachers.teacher_type_id', 'teacher_types.user_id': 'teachers.user_id' })
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
        getListFromTable(TeacherType, req.currentUser.id, 'key'),
    ]);
    res.json({
        error: null,
        data: { teachers, attTypes, teacherTypes }
    });
}

export async function getSeminarKitaReport(req, res) {
    const prices = await getPrices(req.currentUser.id);
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 1 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('teacher_salary_types', 'teacher_salary_types.id', 'teachers.teacher_salary_type_id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            id: 'att_reports.id',
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_salary_type: 'teacher_salary_types.name'
        })
        qb.select('report_date', 'update_date')
        qb.select('salary_month', 'comment')
        qb.select('how_many_watch_or_individual', 'how_many_teached_or_interfering', 'was_kamal', 'how_many_discussing_lessons', 'how_many_lessons_absence')
        qb.select({
            total_pay: bookshelf.knex.raw([
                getCoalesceAndPrice('how_many_watch_or_individual', prices[11]),
                getCoalesceAndPrice('how_many_teached_or_interfering', prices[12]),
                getCoalesceAndPrice('how_many_discussing_lessons', prices[13]),
                getCoalesceAndPrice('was_kamal', prices[14]),
                getCoalesceAndPrice('how_many_lessons_absence', prices[15]),
            ].join(' + '))
        })
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
        qb.select({ teacher_salary: getTrainingTeacherSalary() })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export async function getManhaReport(req, res) {
    const prices = await getPrices(req.currentUser.id)
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 3 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin({ 'teacher_to_report_for': 'teachers' }, 'teacher_to_report_for.id', 'att_reports.teacher_to_report_for')
            qb.leftJoin('teacher_salary_types', 'teacher_salary_types.id', 'teachers.teacher_salary_type_id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            id: 'att_reports.id',
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_salary_type: 'teacher_salary_types.name',
            teacher_to_report_for_name: 'teacher_to_report_for.name',
            teacher_to_report_for_tz: 'teacher_to_report_for.tz',
        })
        qb.select('report_date', 'update_date')
        qb.select('salary_month', 'comment')
        qb.select('four_last_digits_of_teacher_phone', 'teacher_to_report_for', 'how_many_watched_lessons', 'how_many_students_teached', 'how_many_yalkut_lessons', 'how_many_students_help_teached', 'how_many_discussing_lessons')
        qb.select({
            total_pay: bookshelf.knex.raw([
                getCoalesceAndPrice('how_many_watched_lessons', prices[51]),
                getCoalesceAndPrice('how_many_students_teached', prices[52]),
                getCoalesceAndPrice('how_many_yalkut_lessons', prices[53]),
                getCoalesceAndPrice('how_many_discussing_lessons', prices[54]),
                getCoalesceAndPrice('how_many_students_help_teached', prices[55]),
            ].join(' + '))
        })
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

export async function getPdsReport(req, res) {
    const prices = await getPrices(req.currentUser.id)
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 5 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('teacher_salary_types', 'teacher_salary_types.id', 'teachers.teacher_salary_type_id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            id: 'att_reports.id',
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_salary_type: 'teacher_salary_types.name'
        })
        qb.select('report_date', 'update_date')
        qb.select('salary_month', 'comment')
        qb.select('how_many_watch_or_individual', 'how_many_teached_or_interfering', 'how_many_discussing_lessons')
        qb.select({
            total_pay: bookshelf.knex.raw([
                getCoalesceAndPrice('how_many_watch_or_individual', prices[40]),
                getCoalesceAndPrice('how_many_teached_or_interfering', prices[42]),
                getCoalesceAndPrice('how_many_discussing_lessons', prices[41]),
            ].join(' + '))
        })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export async function getSpecialEducationReport(req, res) {
    const prices = await getPrices(req.currentUser.id)
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 7 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('teacher_salary_types', 'teacher_salary_types.id', 'teachers.teacher_salary_type_id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            id: 'att_reports.id',
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_salary_type: 'teacher_salary_types.name'
        })
        qb.select('report_date', 'update_date')
        qb.select('salary_month', 'comment')
        qb.select('how_many_lessons', 'how_many_students_watched', 'how_many_students_teached', 'was_phone_discussing', 'your_training_teacher', 'what_speciality')
        qb.select({
            total_pay: bookshelf.knex.raw([
                getCoalesceAndPrice('how_many_lessons', 1) + '*' + getCoalesceAndPrice('how_many_students_watched', 1) + '*' + prices[26],
                getCoalesceAndPrice('how_many_students_teached', prices[27]),
                getCoalesceAndPrice('was_phone_discussing', prices[28]),
            ].join(' + '))
        })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export async function getKindergartenReport(req, res) {
    const prices = await getPrices(req.currentUser.id)
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 6 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('teacher_salary_types', 'teacher_salary_types.id', 'teachers.teacher_salary_type_id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            id: 'att_reports.id',
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_salary_type: 'teacher_salary_types.name'
        })
        qb.select('report_date', 'update_date')
        qb.select('salary_month', 'comment')
        qb.select('how_many_students', 'was_discussing', 'was_students_good', 'was_students_enter_on_time', 'was_students_exit_on_time')
        qb.select({
            total_pay: bookshelf.knex.raw([
                getCoalesceAndPrice('how_many_students', prices[24]),
                getCoalesceAndPrice('was_discussing', prices[25]),
            ].join(' + '))
        })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export async function updateSalaryMonth(req, res) {
    const { body: { ids, salaryMonth } } = req;

    try {
        await updateSalaryMonthByUserId(req.currentUser.id, ids, salaryMonth);
    } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: e.message,
        });
    }

    res.json({
        error: null,
        data: { message: '?????????????? ?????????? ????????????.' }
    });
}

export async function updateSalaryComment(req, res) {
    const { body: { id, comment } } = req;

    try {
        await updateSalaryCommentByUserId(req.currentUser.id, id, comment);
    } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: e.message,
        });
    }

    res.json({
        error: null,
        data: { message: '?????????????? ?????????? ????????????.' }
    });
}
