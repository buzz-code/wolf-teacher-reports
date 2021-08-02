import StudentKlass from '../models/student-klass.model';
import Student from '../models/student.model';
import Group from '../models/group.model';
import genericController, { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../utils/common';

export const { findById, store, update, destroy, uploadMultiple } = genericController(StudentKlass);

/**
 * Find all the items
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function findAll(req, res) {
    const dbQuery = new StudentKlass({ user_id: req.currentUser.id })
        .query(qb => {
            qb.leftJoin('students', 'students.id', 'student_klasses.student_id')
            qb.leftJoin('groups', 'groups.id', 'student_klasses.group_id')
            qb.select('student_klasses.*')
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
    const [students, groups] = await Promise.all([
        getListFromTable(Student, req.currentUser.id),
        getListFromTable(Group, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { students, groups }
    });
}
