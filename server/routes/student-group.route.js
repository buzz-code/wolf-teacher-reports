import * as studentGroupCtrl from '../controllers/student-group.controller';
import genericRoute from './generic.route';

const router = genericRoute(studentGroupCtrl, router => {
    router.route('/get-edit-data')
        .get((req, res) => {
            studentGroupCtrl.getEditData(req, res);
        });
});

export default router;