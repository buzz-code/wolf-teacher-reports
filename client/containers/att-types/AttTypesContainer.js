import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';

const getColumns = () => [
  { field: 'key', title: 'מזהה', type: 'numeric' },
  { field: 'name', title: 'שם' },
  // { field: 'is_active', title: 'פעיל', type: 'boolean' },
  // { field: 'is_for_teacher', title: 'השמעה למורה', type: 'boolean' },
  // { field: 'is_full_day', title: 'יום שלם', type: 'boolean' },
];
const getFilters = () => [
  { field: 'key', label: 'מזהה', type: 'text', operator: 'like' },
  { field: 'name', label: 'שם', type: 'text', operator: 'like' },
];

const AttTypesContainer = ({ entity, title }) => {
  const columns = useMemo(() => getColumns(), []);
  const filters = useMemo(() => getFilters(), []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default AttTypesContainer;
