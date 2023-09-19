import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import {
  getPropsForAutoComplete,
  getPropsForHebrewDate,
} from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ teachers, attTypes, teacherTypes }) => [
  {
    field: 'teacher_id',
    title: 'שם המורה',
    ...getPropsForAutoComplete('teacher_id', teachers),
    columnOrder: 'teachers.name',
  },
  {
    field: 'teacher_type_name',
    title: 'סוג המורה',
    columnOrder: 'teacher_types.name',
    editable: 'never',
  },
  {
    field: 'teacher_training_teacher',
    title: 'מורה מנחה',
    columnOrder: 'teachers.training_teacher',
    editable: 'never',
  },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  {
    field: 'report_date',
    title: 'תאריך דיווח עברי',
    ...getPropsForHebrewDate('report_date'),
    editable: 'never',
  },
  { field: 'report_date_weekday', title: 'יום בשבוע', editable: 'never' },
  { field: 'update_date', title: 'תאריך עדכון', type: 'date' },
  { field: 'how_many_methodic', title: 'שיעורי מתודיקה', type: 'numeric' },
  { field: 'four_last_digits_of_teacher_phone', title: '4 ספרות' },
  {
    field: 'teacher_to_report_for',
    title: 'שם המורה לדיווח',
    ...getPropsForAutoComplete('teacher_to_report_for', teachers),
  },
  { field: 'is_taarif_hulia', title: 'תעריף חוליה' },
  { field: 'how_many_yalkut_lessons', title: 'שיעורי ילקוט' },
  { field: 'how_many_discussing_lessons', title: 'שיעורי דיון' },
  { field: 'how_many_students_help_teached', title: 'עזרה בשיעורי מרתון' },
  { field: 'how_many_lessons_absence', title: 'העדרות' },
  { field: 'how_many_watched_lessons', title: 'צפיה' },
  { field: 'was_discussing', title: 'האם היה דיון?', type: 'boolean' },
  { field: 'how_many_teached', title: 'כמה מסרו' },
  { field: 'how_many_individual', title: 'כמה אינדיוידואלי' },
  { field: 'was_kamal', title: 'קמל' },
  { field: 'how_many_interfering', title: 'התערבות' },
  { field: 'how_many_watch_or_individual', title: 'צפיה או פרטני' },
  { field: 'how_many_teached_or_interfering', title: 'מסירה או מעורבות' },
  { field: 'how_many_students', title: 'תלמידות' },
  { field: 'was_students_good', title: 'תפקוד הבנות' },
  { field: 'was_students_enter_on_time', title: 'הגעה בזמן' },
  { field: 'was_students_exit_on_time', title: 'יציאה בזמן' },
  { field: 'how_many_lessons', title: 'כמה שיעורים' },
  { field: 'how_many_students_watched', title: 'כמה תלמידות צפו' },
  { field: 'how_many_students_teached', title: 'כמה תלמידות מסרו' },
  { field: 'was_phone_discussing', title: 'דיון טלפוני' },
  { field: 'your_training_teacher', title: 'מורה מנחה' },
  { field: 'what_speciality', title: 'התמחות' },
];
const getFilters = ({ teachers, attTypes, teacherTypes }) => [
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
  { field: 'teachers.training_teacher', label: 'מורה מנחה', type: 'text', operator: 'like' },
  {
    field: 'teacher_types.key',
    label: 'סוג מורה',
    type: 'list',
    list: teacherTypes,
    operator: 'eq',
    idField: 'key',
  },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
  { field: 'update_date', label: 'מתאריך עדכון', type: 'date', operator: 'date-before' },
  { field: 'update_date', label: 'עד תאריך עדכון', type: 'date', operator: 'date-after' },
];

const AttReportsContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    GET: { 'get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => getColumns(editData || {}), [editData]);
  const filters = useMemo(() => getFilters(editData || {}), [editData]);

  const manipulateDataToSave = (dataToSave) => ({
    ...dataToSave,
    report_date: dataToSave.report_date && moment(dataToSave.report_date).format('yyyy-MM-DD'),
    update_date: dataToSave.update_date && moment(dataToSave.update_date).format('yyyy-MM-DD'),
    teacher_type_name: undefined,
    teacher_training_teacher: undefined,
  });

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', 'get-edit-data'));
  }, []);

  return (
    <Table
      entity={entity}
      title={title}
      columns={columns}
      filters={filters}
      manipulateDataToSave={manipulateDataToSave}
    />
  );
};

export default AttReportsContainer;
