import Text from '../models/text.model';
import genericController from './generic.controller';

export const { findAll, findById, store, update, destroy } = genericController(Text);