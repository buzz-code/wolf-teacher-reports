import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ teacherTypes, teacherSalaryTypes, questions }) => [
  { field: 'tz', title: 'תעודת זהות', columnOrder: 'teachers.tz' },
  { field: 'name', title: 'שם', columnOrder: 'teachers.name' },
  { field: 'phone', title: 'מספר טלפון' },
  { field: 'email', title: 'כתובת מייל' },
  { field: 'school', title: 'בית ספר' },
  {
    field: 'teacher_type_id',
    title: 'סוג המורה',
    ...getPropsForAutoComplete('teacher_type_id', teacherTypes, 'key'),
  },
  {
    field: 'teacher_salary_type_id',
    title: 'סוג שכר',
    ...getPropsForAutoComplete('teacher_salary_type_id', teacherSalaryTypes),
  },
  { field: 'price', title: 'שכר שעתי למורה' },
  { field: 'training_teacher', title: 'מורה מנחה' },
  {
    field: 'special_question',
    title: 'שאלה מיוחדת',
    ...getPropsForAutoComplete('special_question', questions),
  },
];
const getFilters = () => [
  { field: 'teachers.tz', label: 'תעודת זהות', type: 'text', operator: 'like' },
  { field: 'teachers.name', label: 'שם', type: 'text', operator: 'like' },
  { field: 'phone', label: 'מספר טלפון', type: 'text', operator: 'like' },
  { field: 'school', label: 'בית ספר', type: 'text', operator: 'like' },
  { field: 'teacher_types.name', label: 'סוג המורה', type: 'text', operator: 'like' },
  { field: 'teacher_salary_types.name', label: 'סוג שכר', type: 'text', operator: 'like' },
  { field: 'price', label: 'שכר שעתי למורה', type: 'text', operator: 'like' },
  { field: 'training_teacher', label: 'מורה מנחה', type: 'text', operator: 'like' },
];

const TeachersContainer = ({ entity, title }) => {
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

export default TeachersContainer;
