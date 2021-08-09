import * as teacherTypeCtrl from '../controllers/teacher-type.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(teacherTypeCtrl);

export default router;