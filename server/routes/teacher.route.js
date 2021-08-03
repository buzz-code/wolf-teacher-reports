import * as teacherCtrl from '../controllers/teacher.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(teacherCtrl);

export default router;