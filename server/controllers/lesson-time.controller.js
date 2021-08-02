import LessonTime from '../models/lesson-time.model';
import genericController from '../../common-modules/server/generic.controller';

const fromClientToServer = rowData => ({
    ...rowData,
    time_zone: undefined,
    lesson_start: rowData.lesson_start && rowData.lesson_start.replace(/[0-9\-]*T|\..*Z/g, ''),
    lesson_end: rowData.lesson_end && rowData.lesson_end.replace(/[0-9\-]*T|\..*Z/g, ''),
});
const fromServerToClient = rowData => ({
    ...rowData,
    lesson_start: rowData.lesson_start && new Date('1/1/1 ' + rowData.lesson_start + 'Z'),
    lesson_end: rowData.lesson_end && new Date('1/1/1 ' + rowData.lesson_end + 'Z'),
});

export const { findAll, findById, store, update, destroy, uploadMultiple } = genericController(LessonTime, fromClientToServer, fromServerToClient);