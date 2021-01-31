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
            error: null,
            data: text.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
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
                    error: 'לא נמצא'
                });
            }
            else {
                res.json({
                    error: null,
                    data: text.toJSON()
                });
            }
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
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
           error: null,
            data: { message: 'הרשומה נוספה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
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
            error: null,
            data: { message: 'הרשומה נשמרה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
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
            error: null,
            data: { message: 'הרשומה נמחקה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}
