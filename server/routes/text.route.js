import express from 'express';
import * as textCtrl from '../controllers/text.controller';
import isAuthenticated from '../middlewares/authenticate';
import validate from '../config/joi.validate';
import schema from '../utils/validator';

const router = express.Router();

router.use(isAuthenticated);

router.route('/')
    .post(validate(schema.storeReport), (req, res) => {
        textCtrl.store(req, res);
    })
    .get((req, res) => {
        textCtrl.findAll(req, res);
    });

router.route('/:id')
    .get((req, res) => {
        textCtrl.findById(req, res);
    })
    .put((req, res) => {
        textCtrl.update(req, res);
    })
    .delete((req, res) => {
        textCtrl.destroy(req, res);
    });

export default router;