import * as lessonCtrl from '../controllers/lesson.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(lessonCtrl);

export default router;