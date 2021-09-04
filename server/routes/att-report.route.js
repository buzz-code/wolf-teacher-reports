import * as attReportCtrl from '../controllers/att-report.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';
import { exportPdf } from '../../common-modules/server/utils/template';

const router = genericRoute(attReportCtrl, router => {
    router.route('/get-edit-data')
        .get((req, res) => {
            attReportCtrl.getEditData(req, res);
        });

    router.route('/getSeminarKitaReport')
        .get((req, res) => {
            attReportCtrl.getSeminarKitaReport(req, res);
        });

    router.route('/getTrainingReport')
        .get((req, res) => {
            attReportCtrl.getTrainingReport(req, res);
        });

    router.route('/getManhaReport')
        .get((req, res) => {
            attReportCtrl.getManhaReport(req, res);
        });

    router.route('/getResponsibleReport')
        .get((req, res) => {
            attReportCtrl.getResponsibleReport(req, res);
        });

    router.route('/getPdsReport')
        .get((req, res) => {
            attReportCtrl.getPdsReport(req, res);
        });

    router.route('/:report/export-pdf')
        .post((req, res) => {
            exportPdf(req, res);
        });

});

export default router;