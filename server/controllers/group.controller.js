import Group from '../models/group.model';
import genericController from '../../common-modules/server/generic.controller';

export const { findAll, findById, store, update, destroy, uploadMultiple } = genericController(Group);