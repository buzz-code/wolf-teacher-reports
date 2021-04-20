import Teacher from '../models/teacher.model';
import genericController from './generic.controller';

export const { findAll, findById, store, update, destroy, uploadMultiple } = genericController(Teacher);