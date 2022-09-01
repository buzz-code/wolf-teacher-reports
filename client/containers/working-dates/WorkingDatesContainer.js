import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ teacherTypes }) => [
  {
    field: 'teacher_type_id',
    title: 'סוג המורה',
    ...getPropsForAutoComplete('teacher_type_id', teacherTypes),
  },
  { field: 'working_date', title: 'תאריך', type: 'date' },
];
const getFilters = ({ teacherTypes }) => [
  {
    field: 'teacher_types.id',
    label: 'סוג מורה',
    type: 'list',
    list: teacherTypes,
    operator: 'eq',
    idField: 'id',
  },
];

const WorkingDatesContainer = ({ entity, title }) => {
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

export default WorkingDatesContainer;
