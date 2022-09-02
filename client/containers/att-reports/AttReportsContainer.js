import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';
import { lessonsCount, studentsCount } from '../../../server/utils/constantsHelper';

const getStudentAttColumns = (attTypes) => {
  return new Array(studentsCount).fill(0).flatMap((a, studentIndex) =>
    new Array(lessonsCount).fill(0).map((b, lessonIndex) => ({
      field: `student_${studentIndex + 1}_${lessonIndex + 1}_att_type`,
      title: `תלמידה ${studentIndex + 1} שיעור ${lessonIndex + 1}`,
      ...getPropsForAutoComplete(
        `student_${studentIndex + 1}_${lessonIndex + 1}_att_type`,
        attTypes
      ),
    }))
  );
};

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
  { field: 'update_date', title: 'תאריך עדכון', type: 'date' },
  { field: 'first_conference', title: 'השתתפות במפגש פתיחה', type: 'numeric' },
  { field: 'second_conference', title: 'השתתפות במפגש חנוכה', type: 'numeric' },
  { field: 'how_many_methodic', title: 'שיעורי מתודיקה', type: 'numeric' },
  { field: 'how_many_watched', title: 'שיעורי צפיה', type: 'numeric' },
  { field: 'how_many_student_teached', title: 'שיעורי מסירה', type: 'numeric' },
  { field: 'was_discussing', title: 'האם היה דיון?', type: 'boolean' },
  { field: 'how_many_private_lessons', title: 'כמה שיעורים פרטיים?' },
  { field: 'training_teacher', title: 'מורה מאמנת' },
  {
    field: 'activity_type',
    title: 'סוג פעילות',
    ...getPropsForAutoComplete('activity_type', attTypes),
  },
  ...getStudentAttColumns(attTypes),
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
