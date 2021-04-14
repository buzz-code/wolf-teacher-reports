import express from 'express';
import isAuthenticated from '../middlewares/authenticate';
import validate from '../config/joi.validate';
import schema from '../utils/validator';

export default (ctrl) => {
    const router = express.Router();

    router.use(isAuthenticated);

    router.route('/')
        .post(validate(schema.storeReport), (req, res) => {
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

    return router;
};