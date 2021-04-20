import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { STUDENT_GROUPS as entity } from '../../constants/entity';
import { STUDENT_GROUPS as title } from '../../constants/entity-title';

const getColumns = () => [
  { field: 'student_id', title: 'תלמידה' },
  { field: 'group_id', title: 'קבוצה' },
];

const StudentGroupsContainer = () => {
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default StudentGroupsContainer;
