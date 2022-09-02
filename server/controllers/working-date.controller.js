import WorkingDate from '../models/working-date.model';
import TeacherType from '../models/teacher-type.model';
import genericController, { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';

export const { findById, store, update, destroy, uploadMultiple } = genericController(WorkingDate);

/**
 * Find all the items
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function findAll(req, res) {
    const dbQuery = new WorkingDate().where({ 'working_dates.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('teacher_types', { 'teacher_types.key': 'working_dates.teacher_type_id', 'teacher_types.user_id': 'working_dates.user_id' })
            qb.select('working_dates.*')
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
    const [teacherTypes] = await Promise.all([
        getListFromTable(TeacherType, req.currentUser.id, 'key'),
    ]);
    res.json({
        error: null,
        data: { teacherTypes }
    });
}
