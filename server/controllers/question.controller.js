import {Question,QuestionType,TeacherType} from '../models';
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
    const dbQuery = new Question().where({ 'questions.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('question_types', 'question_types.key', 'questions.question_type_id')
            qb.select('questions.*')
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
    const [questionTypes, teacherTypes] = await Promise.all([
        getListFromTable(QuestionType, req.currentUser.id, 'key'),
        getListFromTable(TeacherType, req.currentUser.id, 'key'),
    ]);
    res.json({
        error: null,
        data: { questionTypes, teacherTypes }
    });
}
