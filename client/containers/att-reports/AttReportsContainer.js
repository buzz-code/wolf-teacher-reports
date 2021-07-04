import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../components/table/Table';
import * as crudAction from '../../actions/crudAction';
import { getPropsForAutoComplete } from '../../utils/formUtil';

const getColumns = ({ students, teachers, lessons, lessonTimes, attTypes }) => [
  { field: 'student_id', title: 'תלמידה', ...getPropsForAutoComplete('student_id', students) },
  { field: 'teacher_id', title: 'מורה', ...getPropsForAutoComplete('teacher_id', teachers) },
  { field: 'lesson_id', title: 'שיעור', ...getPropsForAutoComplete('lesson_id', lessons) },
  {
    field: 'lesson_time_id',
    title: 'זמן השיעור',
    ...getPropsForAutoComplete('lesson_time_id', lessonTimes),
  },
  { field: 'att_type_id', title: 'סוג דיווח', ...getPropsForAutoComplete('att_type_id', attTypes) },
  { field: 'enter_time', title: 'שעת כניסה' },
];
const getFilters = () => [
  { field: 'students.name', label: 'תלמידה', type: 'text', operator: 'like' },
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
  { field: 'lessons.name', label: 'שיעור', type: 'text', operator: 'like' },
  { field: 'lesson_times.name', label: 'זמן השיעור', type: 'text', operator: 'like' },
  { field: 'att_types.name', label: 'סוג דיווח', type: 'text', operator: 'like' },
  { field: 'enter_time', label: 'שעת כניסה', type: 'text', operator: 'like' },
];

const AttReportsContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    GET: { 'get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => editData && getColumns(editData), [editData]);
  const filters = useMemo(() => getFilters(), []);

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', 'get-edit-data'));
  }, []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default AttReportsContainer;
