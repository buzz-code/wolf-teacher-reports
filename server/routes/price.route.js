import * as priceCtrl from '../controllers/price.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(priceCtrl);

export default router;