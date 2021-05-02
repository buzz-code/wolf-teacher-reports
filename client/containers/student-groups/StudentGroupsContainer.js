import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import Table from '../../components/table/Table';
import * as crudAction from '../../actions/crudAction';

const getPropsForAutoComplete = (field, list) => ({
  render: (rowData) => <span>{list.find((item) => item.id == rowData[field]).name}</span>,
  editComponent: (props) => (
    <Autocomplete
      size="small"
      options={list}
      getOptionLabel={(option) => option.name || list.find((item) => item.id == props.value).name}
      getOptionSelected={(option, value) => option.id == value}
      value={props.value}
      renderInput={(params) => {
        return <TextField {...params} fullWidth />;
      }}
      onChange={(e, value) => props.onChange(value && value.id)}
    />
  ),
});

const getColumns = ({ students, groups }) => [
  { field: 'student_id', title: 'תלמידה', ...getPropsForAutoComplete('student_id', students) },
  { field: 'group_id', title: 'קבוצה', ...getPropsForAutoComplete('group_id', groups) },
];
const getFilters = () => [
  // { field: 'student_id', label: 'תלמידה', type: 'text', operator: 'like' },
  // { field: 'group_id', label: 'קבוצה', type: 'text', operator: 'like' },
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
