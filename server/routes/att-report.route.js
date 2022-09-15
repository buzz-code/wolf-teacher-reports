import * as attReportCtrl from '../controllers/att-report.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';
import { exportPdf } from '../../common-modules/server/utils/template';

const router = genericRoute(attReportCtrl, (router, ctrl) => {
    router.route('/get-edit-data')
        .get((req, res) => {
            ctrl.getEditData(req, res);
        });

    router.route('/getSeminarKitaReport')
        .get((req, res) => {
            ctrl.getSeminarKitaReport(req, res);
        });

    router.route('/getTrainingReport')
        .get((req, res) => {
            ctrl.getTrainingReport(req, res);
        });

    router.route('/getManhaReport')
        .get((req, res) => {
            ctrl.getManhaReport(req, res);
        });

    router.route('/getResponsibleReport')
        .get((req, res) => {
            ctrl.getResponsibleReport(req, res);
        });

    router.route('/getPdsReport')
        .get((req, res) => {
            ctrl.getPdsReport(req, res);
        });

    router.route('/:report/export-pdf')
        .post((req, res) => {
            exportPdf(req, res);
        });

    router.route('/updateSalaryMonth')
        .post((req, res) => {
            ctrl.updateSalaryMonth(req, res);
        });

    router.route('/updateSalaryComment')
        .post((req, res) => {
            ctrl.updateSalaryComment(req, res);
        });

});

export default router;