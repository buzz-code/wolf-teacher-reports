import * as studentCtrl from '../controllers/student.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(studentCtrl);

export default router;