import HttpStatus from 'http-status-codes';

export default (model) => ({
    /**
     * Find all the items
     *
     * @param {object} req
     * @param {object} res
     * @returns {*}
     */
    findAll: function (req, res) {
        new model({ user_id: req.currentUser.id })
            .fetchAll()
            .then(item => res.json({
                error: null,
                data: item.toJSON()
            }))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err.message
            }));
    },

    /**
     *  Find item by id
     *
     * @param {object} req
     * @param {object} res
     * @returns {*}
     */
    findById: function (req, res) {
        new model({ id: req.params.id, user_id: req.currentUser.id })
            .fetch()
            .then(item => {
                if (!item) {
                    res.status(HttpStatus.NOT_FOUND).json({
                        error: 'לא נמצא'
                    });
                }
                else {
                    res.json({
                        error: null,
                        data: item.toJSON()
                    });
                }
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err.message
            }));
    },

    /**
     * Store new item
     *
     * @param {object} req
     * @param {object} res
     * @returns {*}
     */
    store: function (req, res) {
        const itemToSave = req.body;
        new model({ user_id: req.currentUser.id, ...itemToSave })
            .save()
            .then(() => res.json({
                error: null,
                data: { message: 'הרשומה נוספה בהצלחה.' }
            }))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err.message
            }));
    },

    /**
     * Update item by id
     *
     * @param {object} req
     * @param {object} res
     * @returns {*}
     */
    update: function (req, res) {
        const itemToSave = req.body;
        console.log(req.currentUser.id)
        new model({ id: req.params.id, user_id: req.currentUser.id })
            .fetch({ require: true })
            .then(item => item.save({
                ...itemToSave,
            }))
            .then(() => res.json({
                error: null,
                data: { message: 'הרשומה נשמרה בהצלחה.' }
            }))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err.message
            }));
    },

    /**
     * Destroy item by id
     *
     * @param {object} req
     * @param {object} res
     * @returns {*}
     */
    destroy: function (req, res) {
        new model({ id: req.params.id, user_id: req.currentUser.id })
            .fetch({ require: true })
            .then(item => item.destroy())
            .then(() => res.json({
                error: null,
                data: { message: 'הרשומה נמחקה בהצלחה.' }
            }))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err.message
            }));
    }
});