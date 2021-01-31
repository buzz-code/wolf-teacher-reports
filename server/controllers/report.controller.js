import Report from '../models/report.model';
import ReportType from '../models/reportType.model';
import Student from '../models/student.model';
import Teacher from '../models/teacher.model';
import genericController from './generic.controller';

export const { findAll, findById, store, update, destroy } = genericController(Report);

/**
 * Get edit data
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function getEditData(req, res) {
    const [reportTypes, students, teachers] = await Promise.all([
        getListFromTable(ReportType, req.currentUser.id),
        getListFromTable(Student, req.currentUser.id),
        getListFromTable(Teacher, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { reportTypes, students, teachers }
    });
}

function getListFromTable(table, user_id) {
    return new table({ user_id })
        .query({ select: ['id', 'name'] })
        .fetchAll()
        .then(result => result.toJSON());
}