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
            error: false,
            data: teacher.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
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
                    error: true, data: {}
                });
            }
            else {
                res.json({
                    error: false,
                    data: teacher.toJSON()
                });
            }
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
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
            success: true,
            data: { message: 'Teacher added successfully.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
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
            error: false,
            data: { message: 'Teacher updated successfully.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: true,
            data: { message: err.message }
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
            error: false,
            data: { message: 'Teacher deleted successfully.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: true,
            data: { message: err.message }
        }));
}
