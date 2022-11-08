import { genericRouteWithController } from '../../common-modules/server/controllers/loader';

const router = genericRouteWithController('working-date', 'WorkingDate', (router, ctrl) => {
    router.route('/get-edit-data')
        .get((req, res) => {
            ctrl.getEditData(req, res);
        });
});

export default router;