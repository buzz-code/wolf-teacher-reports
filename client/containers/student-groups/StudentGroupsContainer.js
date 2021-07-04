import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../components/table/Table';
import * as crudAction from '../../actions/crudAction';
import { getPropsForAutoComplete } from '../../utils/formUtil';

const getColumns = ({ students, groups }) => [
  { field: 'student_id', title: 'תלמידה', ...getPropsForAutoComplete('student_id', students) },
  { field: 'group_id', title: 'קבוצה', ...getPropsForAutoComplete('group_id', groups) },
];
const getFilters = () => [
  { field: 'students.name', label: 'תלמידה', type: 'text', operator: 'like' },
  { field: 'groups.name', label: 'קבוצה', type: 'text', operator: 'like' },
];

const StudentGroupsContainer = ({ entity, title }) => {
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

export default StudentGroupsContainer;
