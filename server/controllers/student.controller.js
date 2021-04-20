import Student from '../models/student.model';
import genericController from './generic.controller';

export const { findAll, findById, store, update, destroy, uploadMultiple } = genericController(Student);