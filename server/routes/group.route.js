import * as groupCtrl from '../controllers/group.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(groupCtrl, router => {
    router.route('/get-edit-data')
        .get((req, res) => {
            groupCtrl.getEditData(req, res);
        });
});

export default router;