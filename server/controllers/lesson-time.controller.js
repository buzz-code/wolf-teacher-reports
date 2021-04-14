import LessonTime from '../models/lesson-time.model';
import genericController from './generic.controller';

export const { findAll, findById, store, update, destroy } = genericController(LessonTime);