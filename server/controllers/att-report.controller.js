import AttReport from '../models/att-report.model';
import genericController from './generic.controller';

export const { findAll, findById, store, update, destroy, uploadMultiple } = genericController(AttReport);