import {Teacher,TeacherType,TeacherSalaryType, Question} from '../models';
import { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';

/**
 * Find all the items
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function findAll(req, res) {
    const dbQuery = new Teacher().where({ 'teachers.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('teacher_types', {'teacher_types.key': 'teachers.teacher_type_id', 'teacher_types.user_id': 'teachers.user_id'})
            qb.leftJoin('teacher_salary_types', 'teacher_salary_types.id', 'teachers.teacher_salary_type_id')
            qb.select('teachers.*')
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
    const [teacherTypes, teacherSalaryTypes, questions] = await Promise.all([
        getListFromTable(TeacherType, req.currentUser.id, 'key'),
        getListFromTable(TeacherSalaryType, req.currentUser.id),
        getListFromTable(Question, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { teacherTypes, teacherSalaryTypes, questions }
    });
}
