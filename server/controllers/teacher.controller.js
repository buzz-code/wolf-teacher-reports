import HttpStatus from 'http-status-codes';
import Teacher from '../models/teacher.model';

/**
 * Find all the teachers
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findAll(req, res) {
    new Teacher({ user_id: req.currentUser.id })
        .fetchAll()
        .then(teacher => res.json({
            error: null,
            data: teacher.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 *  Find teacher by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findById(req, res) {
    new Teacher({ id: req.params.id, user_id: req.currentUser.id })
        .fetch()
        .then(teacher => {
            if (!teacher) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: 'לא נמצא'
                });
            }
            else {
                res.json({
                    error: null,
                    data: teacher.toJSON()
                });
            }
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 * Store new teacher
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function store(req, res) {
    const item = req.body;
    new Teacher({ ...item, user_id: req.currentUser.id })
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
 * Update teacher by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function update(req, res) {
    const item = req.body;
    new Teacher({ id: req.params.id, user_id: req.currentUser.get('id') })
        .fetch({ require: true })
        .then(teacher => teacher.save({
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
 * Destroy teacher by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function destroy(req, res) {
    new Teacher({ id: req.params.id, user_id: req.currentUser.id })
        .fetch({ require: true })
        .then(teacher => teacher.destroy())
        .then(() => res.json({
            error: null,
            data: { message: 'הרשומה נמחקה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}
