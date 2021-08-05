import Group from '../models/group.model';
import Klass from '../models/klass.model';
import Teacher from '../models/teacher.model';
import Lesson from '../models/lesson.model';
import genericController, { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';
import { getDiaryStream } from '../utils/printHelper';
import { getFileName } from '../../common-modules/server/utils/template';

export const { findById, store, update, destroy, uploadMultiple } = genericController(Group);

/**
 * Find all the items
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function findAll(req, res) {
    const dbQuery = new Group({ user_id: req.currentUser.id })
        .query(qb => {
            qb.leftJoin('klasses', 'klasses.id', 'groups.klass_id')
            qb.leftJoin('teachers', 'teachers.id', 'groups.teacher_id')
            qb.leftJoin('lessons', 'lessons.id', 'groups.lesson_id')
            qb.select('groups.*')
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
    const [klasses, teachers, lessons] = await Promise.all([
        getListFromTable(Klass, req.currentUser.id),
        getListFromTable(Teacher, req.currentUser.id),
        getListFromTable(Lesson, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { klasses, teachers, lessons }
    });
}

/**
 * Print One Diary
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function printOneDiary(req, res) {
    // const { body: { id } } = req;
    const pdfStream = await getDiaryStream(1);
    res.attachment(getFileName('יומן נוכחות', 'pdf'));
    res.setHeader('Content-Type', 'application/pdf');
    pdfStream.pipe(res);
    // res.status(500).send('asdf')
}

/**
 * Print All Diaries
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function printAllDiaries(req, res) {
    //todo
}
