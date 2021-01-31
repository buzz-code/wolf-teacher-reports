import express from 'express';
import * as reportTypeCtrl from '../controllers/reportType.controller';
import isAuthenticated from '../middlewares/authenticate';
import validate from '../config/joi.validate';
import schema from '../utils/validator';

const router = express.Router();

router.use(isAuthenticated);

router.route('/')
    .post(validate(schema.storeReportType), (req, res) => {
        reportTypeCtrl.store(req, res);
    })
    .get((req, res) => {
        reportTypeCtrl.findAll(req, res);
    });

router.route('/:id')
    .get((req, res) => {
        reportTypeCtrl.findById(req, res);
    })
    .put((req, res) => {
        reportTypeCtrl.update(req, res);
    })
    .delete((req, res) => {
        reportTypeCtrl.destroy(req, res);
    });

export default router;