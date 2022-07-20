import Question from '../models/question.model';
import QuestionType from '../models/question-type.model';
import genericController, { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';

export const { findById, store, update, destroy, uploadMultiple } = genericController(Question);

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
    const [questionTypes] = await Promise.all([
        getListFromTable(QuestionType, req.currentUser.id, 'key'),
    ]);
    res.json({
        error: null,
        data: { questionTypes }
    });
}
