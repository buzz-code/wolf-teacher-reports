import ReportType from '../models/reportType.model';
import genericController from './generic.controller';

export const { findAll, findById, store, update, destroy } = genericController(ReportType);