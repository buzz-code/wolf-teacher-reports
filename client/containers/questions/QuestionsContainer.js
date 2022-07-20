import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ questionTypes }) => [
  { field: 'name', title: 'שם', columnOrder: 'questions.name' },
  { field: 'content', title: 'תוכן השאלה' },
  {
    field: 'question_type_id',
    title: 'סוג השאלה',
    ...getPropsForAutoComplete('question_type_id', questionTypes, 'key'),
  },
];
const getFilters = ({ questionTypes }) => [
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

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default QuestionsContainer;
