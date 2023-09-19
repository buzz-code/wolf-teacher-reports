import {Teacher,TeacherType, Question} from '../models';
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
    const [teacherTypes, questions] = await Promise.all([
        getListFromTable(TeacherType, req.currentUser.id, 'key'),
        getListFromTable(Question, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { teacherTypes, questions }
    });
}
