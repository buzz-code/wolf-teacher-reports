import express from 'express';
import isAuthenticated from '../middlewares/authenticate';
import validate from '../config/joi.validate';
import schema from '../utils/validator';

export default (ctrl, callback) => {
    const router = express.Router();

    router.use(isAuthenticated);

    if (callback) {
        callback(router);
    }

    router.route('/')
        .post(validate(schema.any), (req, res) => {
            ctrl.store(req, res);
        })
        .get((req, res) => {
            ctrl.findAll(req, res);
        });

    router.route('/:id')
        .get((req, res) => {
            ctrl.findById(req, res);
        })
        .put((req, res) => {
            ctrl.update(req, res);
        })
        .delete((req, res) => {
            ctrl.destroy(req, res);
        });

    router.route('/upload-multiple')
        .post((req, res) => {
            ctrl.uploadMultiple(req, res);
        });

    return router;
};