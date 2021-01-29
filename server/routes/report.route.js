import express from 'express';
import * as reportCtrl from '../controllers/report.controller';
import isAuthenticated from '../middlewares/authenticate';
import validate from '../config/joi.validate';
import schema from '../utils/validator';

const router = express.Router();

router.use(isAuthenticated);

router.route('/')
    .post(validate(schema.storeReport), (req, res) => {
        reportCtrl.store(req, res);
    })
    .get((req, res) => {
        reportCtrl.findAll(req, res);
    });

router.route('/getEditData')
    .get((req, res) => {
        reportCtrl.getEditData(req, res);
    });

router.route('/:id')
    .get((req, res) => {
        reportCtrl.findById(req, res);
    })
    .put((req, res) => {
        reportCtrl.update(req, res);
    })
    .delete((req, res) => {
        reportCtrl.destroy(req, res);
    });

export default router;