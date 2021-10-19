import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ teachers, attTypes, teacherTypes }) => [
  { field: 'teacher_id', title: 'שם המורה', ...getPropsForAutoComplete('teacher_id', teachers) },
  { field: 'teacher_type_name', title: 'סוג המורה' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  { field: 'how_many_methodic', title: 'שיעורי מתודיקה', type: 'numeric' },
  { field: 'how_many_watched', title: 'שיעורי צפיה', type: 'numeric' },
  { field: 'how_many_student_teached', title: 'שיעורי מסירה', type: 'numeric' },
  { field: 'was_discussing', title: 'האם היה דיון?', type: 'boolean' },
  { field: 'how_many_private_lessons', title: 'כמה שיעורים פרטיים?' },
  {
    field: 'activity_type',
    title: 'סוג פעילות',
    ...getPropsForAutoComplete('activity_type', attTypes),
  },
  {
    field: 'student_1_1_att_type',
    title: 'תלמידה 1 שיעור 1',
    ...getPropsForAutoComplete('student_1_1_att_type', attTypes),
  },
  {
    field: 'student_1_2_att_type',
    title: 'תלמידה 1 שיעור 2',
    ...getPropsForAutoComplete('student_1_2_att_type', attTypes),
  },
  {
    field: 'student_1_3_att_type',
    title: 'תלמידה 1 שיעור 3',
    ...getPropsForAutoComplete('student_1_3_att_type', attTypes),
  },
  {
    field: 'student_1_4_att_type',
    title: 'תלמידה 1 שיעור 4',
    ...getPropsForAutoComplete('student_1_4_att_type', attTypes),
  },
  {
    field: 'student_1_5_att_type',
    title: 'תלמידה 1 שיעור 5',
    ...getPropsForAutoComplete('student_1_5_att_type', attTypes),
  },
  {
    field: 'student_2_1_att_type',
    title: 'תלמידה 2 שיעור 1',
    ...getPropsForAutoComplete('student_2_1_att_type', attTypes),
  },
  {
    field: 'student_2_2_att_type',
    title: 'תלמידה 2 שיעור 2',
    ...getPropsForAutoComplete('student_2_2_att_type', attTypes),
  },
  {
    field: 'student_2_3_att_type',
    title: 'תלמידה 2 שיעור 3',
    ...getPropsForAutoComplete('student_2_3_att_type', attTypes),
  },
  {
    field: 'student_2_4_att_type',
    title: 'תלמידה 2 שיעור 4',
    ...getPropsForAutoComplete('student_2_4_att_type', attTypes),
  },
  {
    field: 'student_2_5_att_type',
    title: 'תלמידה 2 שיעור 5',
    ...getPropsForAutoComplete('student_2_5_att_type', attTypes),
  },
  {
    field: 'student_3_1_att_type',
    title: 'תלמידה 3 שיעור 1',
    ...getPropsForAutoComplete('student_3_1_att_type', attTypes),
  },
  {
    field: 'student_3_2_att_type',
    title: 'תלמידה 3 שיעור 2',
    ...getPropsForAutoComplete('student_3_2_att_type', attTypes),
  },
  {
    field: 'student_3_3_att_type',
    title: 'תלמידה 3 שיעור 3',
    ...getPropsForAutoComplete('student_3_3_att_type', attTypes),
  },
  {
    field: 'student_3_4_att_type',
    title: 'תלמידה 3 שיעור 4',
    ...getPropsForAutoComplete('student_3_4_att_type', attTypes),
  },
  {
    field: 'student_3_5_att_type',
    title: 'תלמידה 3 שיעור 5',
    ...getPropsForAutoComplete('student_3_5_att_type', attTypes),
  },
];
const getFilters = ({ teachers, attTypes, teacherTypes }) => [
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
  {
    field: 'teacher_types.name',
    label: 'סוג מורה',
    type: 'list',
    list: teacherTypes,
    operator: 'eq',
  },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
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
    report_date:
      dataToSave.report_date instanceof Date
        ? dataToSave.report_date.toISOString().substr(0, 10)
        : dataToSave.report_date.substr(0, 10),
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
