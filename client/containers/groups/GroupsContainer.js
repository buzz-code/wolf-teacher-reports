import React, { useMemo } from 'react';

import Table from '../../components/table/Table';

const getColumns = () => [
  { field: 'key', title: 'מזהה' },
  { field: 'name', title: 'שם' },
  { field: 'is_klass', title: 'כיתה?', type: 'boolean' },
];
const getFilters = () => [];

const GroupsContainer = ({ entity, title }) => {
  const columns = useMemo(() => getColumns(), []);
  const filters = useMemo(() => getFilters(), []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default GroupsContainer;
