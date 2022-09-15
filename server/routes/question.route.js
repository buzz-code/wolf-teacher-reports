import * as questionCtrl from '../controllers/question.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(questionCtrl, (router, ctrl) => {
    router.route('/get-edit-data')
        .get((req, res) => {
            ctrl.getEditData(req, res);
        });
});

export default router;