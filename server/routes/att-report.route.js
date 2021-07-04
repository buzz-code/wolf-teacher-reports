import * as attReportCtrl from '../controllers/att-report.controller';
import genericRoute from './generic.route';

const router = genericRoute(attReportCtrl, router => {
    router.route('/get-edit-data')
        .get((req, res) => {
            attReportCtrl.getEditData(req, res);
        });
});

export default router;