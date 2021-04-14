import StudentGroup from '../models/student-group.model';
import genericController from './generic.controller';

export const { findAll, findById, store, update, destroy } = genericController(StudentGroup);