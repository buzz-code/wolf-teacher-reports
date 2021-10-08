import AttReport from '../models/att-report.model';
import AttType from '../models/att-type.model';
import Teacher from '../models/teacher.model';
import genericController, { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';
import { getPdsType, getSeminarKitaLessonCount, getSeminarKitaTotalPay } from '../utils/reportHelper';
import bookshelf from '../../common-modules/server/config/bookshelf';

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
    const [teachers, attTypes] = await Promise.all([
        getListFromTable(Teacher, req.currentUser.id),
        getListFromTable(AttType, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { teachers, attTypes }
    });
}

export function getSeminarKitaReport(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 1 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({ teacher_name: 'teachers.name' }, 'report_date', getSeminarKitaLessonCount(4), { total_pay: getSeminarKitaTotalPay(4) })
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
        qb.select({ teacher_name: 'teachers.name' }, 'report_date', 'how_many_watched', 'how_many_student_teached', 'was_discussing', 'how_many_private_lessons')
        qb.select({ teacher_salary: bookshelf.knex.raw('(how_many_watched * 60 + how_many_student_teached * 50 + IF(was_discussing, was_discussing, 0) * 70 + IF(how_many_private_lessons, how_many_private_lessons, 0) * 50)') })
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
        qb.select({ teacher_name: 'teachers.name' }, 'report_date', 'how_many_methodic')
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
        qb.select({ teacher_name: 'teachers.name' }, 'report_date', { activity_type_name: 'att_types.name' })
    });
    fetchPage({ dbQuery }, req.query, res);
}

export function getPdsReport(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id, 'teachers.teacher_type_id': 5 })
        .query(qb => {
            qb.leftJoin('teachers', 'teachers.id', 'att_reports.teacher_id')
            qb.leftJoin({ att_types_1: 'att_types' }, 'att_types_1.id', 'att_reports.pds_type_1')
            qb.leftJoin({ att_types_2: 'att_types' }, 'att_types_2.id', 'att_reports.pds_type_2')
            qb.leftJoin({ att_types_3: 'att_types' }, 'att_types_3.id', 'att_reports.pds_type_3')
            qb.leftJoin({ att_types_4: 'att_types' }, 'att_types_4.id', 'att_reports.pds_type_4')
        })
    applyFilters(dbQuery, req.query.filters);
    dbQuery.query(qb => {
        qb.select({ teacher_name: 'teachers.name' }, 'report_date', getPdsType(4))
    });
    fetchPage({ dbQuery }, req.query, res);
}
