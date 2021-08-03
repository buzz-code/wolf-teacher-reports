import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ klasses, teachers, lessons }) => [
  { field: 'klass_id', title: 'כיתה', ...getPropsForAutoComplete('klass_id', klasses) },
  { field: 'teacher_id', title: 'מורה', ...getPropsForAutoComplete('teacher_id', teachers) },
  { field: 'lesson_id', title: 'שיעור', ...getPropsForAutoComplete('lesson_id', lessons) },
];
const getFilters = () => [
  { field: 'klasses.name', label: 'כיתה', type: 'text', operator: 'like' },
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
  { field: 'lessons.name', label: 'שיעור', type: 'text', operator: 'like' },
];
const getActions = (entity) => [
  {
    icon: 'print',
    tooltip: 'הדפס הכל',
    isFreeAction: true,
    onClick: () => alert('TDB: print all'),
  },
  {
    icon: 'print',
    tooltip: 'הדפס יומן',
    onClick: () => alert('TDB: print single'),
  },
];

const GroupsContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    GET: { 'get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => editData && getColumns(editData), [editData]);
  const filters = useMemo(() => getFilters(), []);
  const actions = useMemo(() => getActions(entity), [entity]);

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', 'get-edit-data'));
  }, []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} additionalActions={actions} />;
};

export default GroupsContainer;
