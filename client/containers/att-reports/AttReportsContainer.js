import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';
import { lessonsCount, studentsCount } from '../../../server/utils/constantsHelper';

getStudentAttColumns = (attTypes) => {
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
  { field: 'teacher_id', title: 'שם המורה', ...getPropsForAutoComplete('teacher_id', teachers) },
  { field: 'teacher_type_name', title: 'סוג המורה' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
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
