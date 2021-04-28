import React, { useMemo } from 'react';

import Table from '../../components/table/Table';

const getColumns = () => [
  { field: 'student_id', title: 'תלמידה' },
  { field: 'group_id', title: 'קבוצה' },
];
const getFilters = () => [
  { field: 'student_id', label: 'תלמידה', type: 'text', operator: 'like' },
  { field: 'group_id', label: 'קבוצה', type: 'text', operator: 'like' },
];

const StudentGroupsContainer = ({ entity, title }) => {
  const columns = useMemo(() => getColumns(), []);
  const filters = useMemo(() => getFilters(), []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default StudentGroupsContainer;
