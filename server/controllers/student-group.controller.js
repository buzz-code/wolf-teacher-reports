import StudentGroup from '../models/student-group.model';
import Student from '../models/student.model';
import Group from '../models/group.model';
import genericController from './generic.controller';

export const { findAll, findById, store, update, destroy, uploadMultiple } = genericController(StudentGroup);

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

function getListFromTable(table, user_id) {
    return new table().where({ user_id })
        .query({ select: ['id', 'name'] })
        .fetchAll()
        .then(result => result.toJSON());
}