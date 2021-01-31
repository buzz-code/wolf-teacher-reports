import HttpStatus from 'http-status-codes';
import Report from '../models/report.model';
import ReportType from '../models/reportType.model';
import Student from '../models/student.model';
import Teacher from '../models/teacher.model';

/**
 * Find all the reports
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findAll(req, res) {
    new Report({ user_id: req.currentUser.id })
        .fetchAll()
        .then(report => res.json({
            error: null,
            data: report.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 *  Find report by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findById(req, res) {
    new Report({ id: req.params.id, user_id: req.currentUser.id })
        .fetch()
        .then(report => {
            if (!report) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: 'לא נמצא'
                });
            }
            else {
                res.json({
                    error: null,
                    data: report.toJSON()
                });
            }
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 * Store new report
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function store(req, res) {
    const item = req.body;
    new Report({ ...item, user_id: req.currentUser.id })
        .save()
        .then(() => res.json({
            error: null,
            data: { message: 'הרשומה נוספה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 * Update report by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function update(req, res) {
    const item = req.body;
    new Report({ id: req.params.id, user_id: req.currentUser.get('id') })
        .fetch({ require: true })
        .then(report => report.save({
            ...item,
        }))
        .then(() => res.json({
            error: null,
            data: { message: 'הרשומה נשמרה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 * Destroy report by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function destroy(req, res) {
    new Report({ id: req.params.id, user_id: req.currentUser.id })
        .fetch({ require: true })
        .then(report => report.destroy())
        .then(() => res.json({
            error: null,
            data: { message: 'הרשומה נמחקה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

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