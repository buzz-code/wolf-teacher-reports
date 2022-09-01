import Teacher from '../models/teacher.model';
import TeacherType from '../models/teacher-type.model';
import TeacherSalaryType from '../models/teacher-salary-type.model';
import Student from '../models/student.model';
import genericController, { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';

export const { findById, store, update, destroy, uploadMultiple } = genericController(Teacher);

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
            qb.leftJoin('teacher_types', 'teacher_types.id', 'teachers.teacher_type_id')
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
    const [teacherTypes, teacherSalaryTypes] = await Promise.all([
        getListFromTable(TeacherType, req.currentUser.id),
        getListFromTable(TeacherSalaryType, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { teacherTypes, teacherSalaryTypes }
    });
}
