import * as studentKlassCtrl from '../controllers/student-klass.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(studentKlassCtrl, router => {
    router.route('/get-edit-data')
        .get((req, res) => {
            studentKlassCtrl.getEditData(req, res);
        });
});

export default router;