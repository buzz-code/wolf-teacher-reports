import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ questionTypes, teacherTypes }) => [
  { field: 'name', title: 'שם', columnOrder: 'questions.name' },
  { field: 'content', title: 'תוכן השאלה' },
  {
    field: 'question_type_id',
    title: 'סוג השאלה',
    ...getPropsForAutoComplete('question_type_id', questionTypes, 'key'),
  },
  {
    field: 'teacher_type_id',
    title: 'סוג המורה',
    ...getPropsForAutoComplete('teacher_type_id', teacherTypes, 'key'),
  },
  { field: 'allowed_digits', title: 'תשובה אפשרית' },
  { field: 'price', title: 'תעריף', type: 'numeric' },
  { field: 'is_mul_price', title: 'האם להכפיל מחיר', type: 'boolean' },
  { field: 'is_standalone', title: 'האם שאלה עצמאית', type: 'boolean' },
  { field: 'start_date', title: 'תאריך התחלה', type: 'date' },
  { field: 'end_date', title: 'תאריך סיום', type: 'date' },
];
const getFilters = ({ questionTypes, teacherTypes }) => [
  { field: 'questions.name', label: 'שם', type: 'text', operator: 'like' },
  { field: 'content', label: 'תוכן השאלה', type: 'text', operator: 'like' },
  {
    field: 'question_types.id',
    label: 'סוג השאלה',
    type: 'list',
    list: questionTypes,
    operator: 'eq',
    idField: 'key',
  },
  {
    field: 'teacher_types.id',
    label: 'סוג המורה',
    type: 'list',
    list: teacherTypes,
    operator: 'eq',
    idField: 'key',
  },
];

const QuestionsContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    GET: { 'get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => editData && getColumns(editData), [editData]);
  const filters = useMemo(() => editData && getFilters(editData), [editData]);

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', 'get-edit-data'));
  }, []);

  const manipulateDataToSave = useCallback(
    (dataToSave) => ({
      ...dataToSave,
      start_date: dataToSave.start_date && moment(dataToSave.start_date).format('yyyy-MM-DD'),
      end_date: dataToSave.end_date && moment(dataToSave.end_date).format('yyyy-MM-DD'),
    }),
    []
  );

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

export default QuestionsContainer;
