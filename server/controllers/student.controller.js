import HttpStatus from 'http-status-codes';
import Student from '../models/student.model';

/**
 * Find all the students
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findAll(req, res) {
    new Student({ user_id: req.currentUser.id })
        .fetchAll()
        .then(student => res.json({
            error: null,
            data: student.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 *  Find student by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findById(req, res) {
    new Student({ id: req.params.id, user_id: req.currentUser.id })
        .fetch()
        .then(student => {
            if (!student) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: 'לא נמצא'
                });
            }
            else {
                res.json({
                    error: null,
                    data: student.toJSON()
                });
            }
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 * Store new student
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function store(req, res) {
    const item = req.body;
    new Student({ ...item, user_id: req.currentUser.id })
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
 * Update student by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function update(req, res) {
    const item = req.body;
    new Student({ id: req.params.id, user_id: req.currentUser.get('id') })
        .fetch({ require: true })
        .then(student => student.save({
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
 * Destroy student by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function destroy(req, res) {
    new Student({ id: req.params.id, user_id: req.currentUser.id })
        .fetch({ require: true })
        .then(student => student.destroy())
        .then(() => res.json({
            error: null,
            data: { message: 'הרשומה נמחקה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}
