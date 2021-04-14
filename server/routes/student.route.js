import * as studentCtrl from '../controllers/student.controller';
import genericRoute from './generic.route';

const router = genericRoute(studentCtrl);

export default router;