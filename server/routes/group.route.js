import * as groupCtrl from '../controllers/group.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(groupCtrl, router => {
    router.route('/get-edit-data')
        .get((req, res) => {
            groupCtrl.getEditData(req, res);
        });

    router.route('/print-one-diary')
        .post((req, res) => {
            groupCtrl.printOneDiary(req, res);
        });

    router.route('/print-all-diaries')
        .post((req, res) => {
            groupCtrl.printAllDiaries(req, res);
        });

});

export default router;