import * as teacherCtrl from '../controllers/teacher.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(teacherCtrl, router => {
    router.route('/get-edit-data')
        .get((req, res) => {
            teacherCtrl.getEditData(req, res);
        });
});

export default router;