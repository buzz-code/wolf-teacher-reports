import React, { useMemo } from 'react';

import Table from '../../components/table/Table';

const getColumns = () => [
  { field: 'student_id', title: 'תלמידה' },
  { field: 'group_id', title: 'קבוצה' },
];

const StudentGroupsContainer = ({ entity, title }) => {
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default StudentGroupsContainer;
