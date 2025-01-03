import HttpStatus from 'http-status-codes';
import { AttReport, AttType, SalaryReportWithName, Teacher, TeacherType } from '../models';
import { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';
import { getTotalPay, getTotalPayForAllTeachers, getAnswersPrice } from '../utils/reportHelper';
import { updateSalaryMonthByUserId, updateSalaryCommentByUserId, getPrices, createSalaryReportByUserId } from '../utils/queryHelper';
import bookshelf from '../../common-modules/server/config/bookshelf';

const report_date_weekday = bookshelf.knex.raw("ELT(DAYOFWEEK(report_date), 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש')");

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
            qb.select({
                report_date_weekday,
                teacher_type_name: 'teacher_types.name',
                teacher_training_teacher: 'teachers.training_teacher',
                teacher_school: 'teachers.school',
            })
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
    const [teachers, attTypes, teacherTypes, salaryReports] = await Promise.all([
        getListFromTable(Teacher, req.currentUser.id),
        getListFromTable(AttType, req.currentUser.id),
        getListFromTable(TeacherType, req.currentUser.id, 'key'),
        getListFromTable(SalaryReportWithName, req.currentUser.id, 'id'),
    ]);
    res.json({
        error: null,
        data: { teachers, attTypes, teacherTypes, salaryReports }
    });
}

export async function getSeminarKitaReport(req, res) {
    const prices = await getPrices(req.currentUser.id);
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 1 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('answers_price', 'answers_price.report_id', 'att_reports.id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            id: 'att_reports.id',
            report_date_weekday,
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_school: 'teachers.school',
        })
        qb.select('report_date', 'update_date')
        qb.select('salary_month', 'comment')
        qb.select('how_many_students', 'how_many_watch_or_individual', 'how_many_teached_or_interfering', 'was_kamal', 'how_many_discussing_lessons', 'how_many_lessons_absence')
        qb.select({ 
            regular_pay: bookshelf.knex.raw(getTotalPay(1, prices, false)),
            extra_pay: bookshelf.knex.raw(getAnswersPrice()),
            total_pay: bookshelf.knex.raw(getTotalPay(1, prices, true)),
         })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export function getTrainingReport(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 2 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('answers_price', 'answers_price.report_id', 'att_reports.id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            report_date_weekday,
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_school: 'teachers.school',
        })
        qb.select('report_date', 'update_date', 'how_many_watched', 'how_many_student_teached', 'was_discussing', 'how_many_private_lessons', 'att_reports.training_teacher')
        qb.select({ 
            regular_pay: bookshelf.knex.raw(getTotalPay(2, null, false)),
            extra_pay: bookshelf.knex.raw(getAnswersPrice()),
            total_pay: bookshelf.knex.raw(getTotalPay(2, null, true)),
         })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export async function getManhaReport(req, res) {
    const prices = await getPrices(req.currentUser.id)
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 3 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin({ 'teacher_to_report_for': 'teachers' }, 'teacher_to_report_for.id', 'att_reports.teacher_to_report_for')
            qb.leftJoin('answers_price', 'answers_price.report_id', 'att_reports.id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            id: 'att_reports.id',
            report_date_weekday,
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_to_report_for_name: 'teacher_to_report_for.name',
            teacher_to_report_for_tz: 'teacher_to_report_for.tz',
            teacher_school: 'teachers.school',
        })
        qb.select('report_date', 'update_date')
        qb.select('salary_month', 'comment')
        qb.select('four_last_digits_of_teacher_phone', 'teacher_to_report_for', 'how_many_watched_lessons', 'how_many_students_teached', 'how_many_yalkut_lessons', 'how_many_students_help_teached', 'how_many_discussing_lessons', 'is_taarif_hulia', 'is_taarif_hulia2', 'is_taarif_hulia3')
        qb.select({ 
            regular_pay: bookshelf.knex.raw(getTotalPay(3, prices, false)),
            extra_pay: bookshelf.knex.raw(getAnswersPrice()),
            total_pay: bookshelf.knex.raw(getTotalPay(3, prices, true)),
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
            report_date_weekday,
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            activity_type_name: 'att_types.name',
            teacher_school: 'teachers.school',
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
            qb.leftJoin('answers_price', 'answers_price.report_id', 'att_reports.id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            id: 'att_reports.id',
            report_date_weekday,
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_school: 'teachers.school',
        })
        qb.select('report_date', 'update_date')
        qb.select('salary_month', 'comment')
        qb.select('how_many_watch_or_individual', 'how_many_teached_or_interfering', 'how_many_discussing_lessons')
        qb.select({ 
            regular_pay: bookshelf.knex.raw(getTotalPay(5, prices, false)),
            extra_pay: bookshelf.knex.raw(getAnswersPrice()),
            total_pay: bookshelf.knex.raw(getTotalPay(5, prices, true)),
         })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export async function getSpecialEducationReport(req, res) {
    const prices = await getPrices(req.currentUser.id)
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 7 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('answers_price', 'answers_price.report_id', 'att_reports.id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            id: 'att_reports.id',
            report_date_weekday,
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_school: 'teachers.school',
        })
        qb.select('report_date', 'update_date')
        qb.select('salary_month', 'comment')
        qb.select('how_many_lessons', 'how_many_students_watched', 'how_many_students_teached', 'was_phone_discussing', 'your_training_teacher', 'what_speciality')
        qb.select({ 
            regular_pay: bookshelf.knex.raw(getTotalPay(7, prices, false)),
            extra_pay: bookshelf.knex.raw(getAnswersPrice()),
            total_pay: bookshelf.knex.raw(getTotalPay(7, prices, true)),
         })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export async function getKindergartenReport(req, res) {
    const prices = await getPrices(req.currentUser.id)
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 6 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin('answers_price', 'answers_price.report_id', 'att_reports.id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({
            id: 'att_reports.id',
            report_date_weekday,
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_training_teacher: 'teachers.training_teacher',
            teacher_school: 'teachers.school',
        })
        qb.select('report_date', 'update_date')
        qb.select('salary_month', 'comment')
        qb.select('was_collective_watch', 'how_many_students', 'was_discussing', 'was_students_good', 'was_students_enter_on_time', 'was_students_exit_on_time')
        qb.select({ 
            regular_pay: bookshelf.knex.raw(getTotalPay(6, prices, false)),
            extra_pay: bookshelf.knex.raw(getAnswersPrice()),
            total_pay: bookshelf.knex.raw(getTotalPay(6, prices, true)),
         })
    });
    fetchPage({ dbQuery }, req.query, res);
}


export async function getTotalPayMonthlyReport(req, res) {
    const prices = await getPrices(req.currentUser.id)
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin({ 'report_teachers': 'teachers' }, 'report_teachers.id', 'att_reports.teacher_to_report_for')
            qb.leftJoin('salary_reports_view', 'salary_reports_view.id', 'att_reports.salaryReport')
            qb.leftJoin('answers_price', 'answers_price.report_id', 'att_reports.id')
        })
    applyFilters(dbQuery, req.query.filters);

    const groupByColumns = ['teachers.id', 'report_teachers.id',
        'teachers.teacher_type_id', bookshelf.knex.raw('MONTHNAME(report_date)'), 'att_reports.salaryReport'];

    const countQuery = dbQuery.clone().query()
        .countDistinct({ count: groupByColumns.map(c => typeof c === 'string' ? bookshelf.knex.raw(`COALESCE(${c}, 0)`) : c) })
        .then(res => res[0].count);

    dbQuery.query(qb => {
        qb.groupBy(groupByColumns)
        qb.select({
            id: bookshelf.knex.raw('GROUP_CONCAT(att_reports.id)'),
            teacher_name: 'teachers.name',
            teacher_tz: 'teachers.tz',
            teacher_school: 'teachers.school',
            report_teacher_name: 'report_teachers.name',
            teacher_type_id: 'teachers.teacher_type_id',
            report_month: bookshelf.knex.raw('MONTHNAME(report_date)'),
            salary_report_name: 'salary_reports_view.name',
            comment: bookshelf.knex.raw('GROUP_CONCAT(distinct comment)'),
            is_confirmed: bookshelf.knex.raw('MIN(COALESCE(is_confirmed, 0))'),
        })
        // qb.select('report_date', 'update_date')
        // qb.select('salary_month', 'comment')
        qb.sum({
            regular_pay: getTotalPayForAllTeachers(prices, false),
            extra_pay: bookshelf.knex.raw(getAnswersPrice()),
            total_pay: getTotalPayForAllTeachers(prices, true),
        })
    });
    fetchPage({ dbQuery, countQuery }, req.query, res);
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
        data: { message: 'הנתונים נשמרו בהצלחה.' }
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
        data: { message: 'הנתונים נשמרו בהצלחה.' }
    });
}

export async function createSalaryReport(req, res) {
    const { body: { ids } } = req;

    try {
        await createSalaryReportByUserId(req.currentUser.id, ids);
    } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: e.message,
        });
    }

    res.json({
        error: null,
        data: { message: 'הנתונים נשמרו בהצלחה.' }
    });
}
