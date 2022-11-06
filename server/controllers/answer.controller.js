import {Answer} from '../models';
import genericController, { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';

export const { findById, store, update, destroy, uploadMultiple } = genericController(Answer);

/**
 * Find all the items
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function findAll(req, res) {
    const dbQuery = new Answer().where({ 'answers.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('questions', 'questions.id', 'answers.question_id')
            qb.leftJoin('teachers', 'teachers.id', 'answers.teacher_id')
            qb.select('answers.*')
            qb.select({ question_name: 'questions.name', teacher_name: 'teachers.name' })
        });
    applyFilters(dbQuery, req.query.filters);
    fetchPage({ dbQuery }, req.query, res);
}
