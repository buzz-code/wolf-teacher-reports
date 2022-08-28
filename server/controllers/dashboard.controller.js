import Student from '../models/student.model';
import Teacher from '../models/teacher.model';

import { getCountFromTable } from '../../common-modules/server/utils/query';

/**
 * Get stats
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function getStats(req, res) {
    const [students, teachers] = await Promise.all([
        getCountFromTable(Student, req.currentUser.id),
        getCountFromTable(Teacher, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { students, teachers }
    });
}
