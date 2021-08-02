import AttType from '../models/att-type.model';
import genericController from '../../common-modules/server/generic.controller';

export const { findAll, findById, store, update, destroy, uploadMultiple } = genericController(AttType);