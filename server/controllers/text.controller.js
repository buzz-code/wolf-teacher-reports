import HttpStatus from 'http-status-codes';
import Text from '../models/text.model';

/**
 * Find all the texts
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findAll(req, res) {
    new Text({ user_id: req.currentUser.id })
        .fetchAll()
        .then(text => res.json({
            error: false,
            data: text.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

/**
 *  Find text by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findById(req, res) {
    new Text({ id: req.params.id, user_id: req.currentUser.id })
        .fetch()
        .then(text => {
            if (!text) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: true, data: {}
                });
            }
            else {
                res.json({
                    error: false,
                    data: text.toJSON()
                });
            }
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

/**
 * Store new text
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function store(req, res) {
    const item = req.body;
    new Text({ ...item, user_id: req.currentUser.id })
        .save()
        .then(() => res.json({
            success: true,
            data: { message: 'Text added successfully.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

/**
 * Update text by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function update(req, res) {
    const item = req.body;
    new Text({ id: req.params.id, user_id: req.currentUser.get('id') })
        .fetch({ require: true })
        .then(text => text.save({
            ...item,
        }))
        .then(() => res.json({
            error: false,
            data: { message: 'Text updated successfully.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: true,
            data: { message: err.message }
        }));
}

/**
 * Destroy text by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function destroy(req, res) {
    new Text({ id: req.params.id, user_id: req.currentUser.id })
        .fetch({ require: true })
        .then(text => text.destroy())
        .then(() => res.json({
            error: false,
            data: { message: 'Text deleted successfully.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: true,
            data: { message: err.message }
        }));
}
