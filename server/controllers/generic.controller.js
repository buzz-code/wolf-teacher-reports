import HttpStatus from 'http-status-codes';
import moment from 'moment';

export const fetchPage = async ({ dbQuery, countQuery }, { page, pageSize, orderBy, orderDirection, filters }, res, fromServerToClient) => {
    if (orderBy) {
        dbQuery = dbQuery.query('orderBy', orderBy, orderDirection);
    }

    if (filters) {
        const filtersObj = JSON.parse(filters);
        for (const filter of Object.values(filtersObj)) {
            switch (filter.operator) {
                case 'like':
                    dbQuery = dbQuery.where(filter.field, 'like', '%' + filter.value + '%');
                    break;
                case 'in':
                    dbQuery = dbQuery.where(filter.field, 'in', filter.value);
                    break;
                case 'date-eq':
                    dbQuery = dbQuery.where(filter.field, '=', moment(filter.value).format('YYYY-MM-DD'));
                    break;
                default:
                    break;
            }
        }
    }

    if (!countQuery) {
        countQuery = dbQuery.clone().count();
    }

    dbQuery.query(qb => qb.offset(Number(pageSize) * Number(page)).limit(Number(pageSize)));
    try {
        const [count, result] = await Promise.all([countQuery, dbQuery.fetchAll()])
        const resultToSend = fromServerToClient ? result.toJSON().map(fromServerToClient) : result.toJSON();
        res.json({
            error: null,
            data: resultToSend,
            page: +page,
            total: count,
        });
    }
    catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        });
    }
};

export default (model, fromClientToServer, fromServerToClient) => ({
    /**
     * Find all the items
     *
     * @param {object} req
     * @param {object} res
     * @returns {*}
     */
    findAll: function (req, res) {
        const dbQuery = new model({ user_id: req.currentUser.id });
        fetchPage({ dbQuery }, req.query, res, fromServerToClient);
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
                let itemToReturn = fromServerToClient ? fromServerToClient(item.toJSON()) : item.toJSON();
                if (!item) {
                    res.status(HttpStatus.NOT_FOUND).json({
                        error: 'לא נמצא'
                    });
                }
                else {
                    res.json({
                        error: null,
                        data: itemToReturn
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
        const itemToSave = fromClientToServer ? fromClientToServer(req.body) : req.body;
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
        const itemToSave = fromClientToServer ? fromClientToServer(req.body) : req.body;
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
    },

    /**
    * Upload multiple new item
    *
    * @param {object} req
    * @param {object} res
    * @returns {*}
    */
    uploadMultiple: function (req, res) {
        const itemsToSave = req.body.map(fromClientToServer ? fromClientToServer : item => item);
        itemsToSave.forEach(item => item.user_id = req.currentUser.id);
        model.collection(itemsToSave)
            .invokeThen("save", null, { method: "insert" })
            .then(() => res.json({
                data: { variant: 'success', message: 'הרשומות נוספו בהצלחה.' }
            }))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                data: { variant: 'error', message: err.message }
            }));
    }
});