import Teacher from '../models/teacher.model';
import TeacherType from '../models/teacher-type.model';
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
            qb.leftJoin({ students1: 'students' }, 'students1.tz', 'teachers.student_tz_1')
            qb.leftJoin({ students2: 'students' }, 'students2.tz', 'teachers.student_tz_2')
            qb.leftJoin({ students3: 'students' }, 'students3.tz', 'teachers.student_tz_3')
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
    const [teacherTypes, students] = await Promise.all([
        getListFromTable(TeacherType, req.currentUser.id),
        getListFromTable(Student, req.currentUser.id, 'tz'),
    ]);
    res.json({
        error: null,
        data: { teacherTypes, students }
    });
}
