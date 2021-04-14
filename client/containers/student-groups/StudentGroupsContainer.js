import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { STUDENT_GROUPS } from '../../constants/entity';

const getColumns = () => [
  { field: 'student_id', title: 'תלמידה' },
  { field: 'group_id', title: 'קבוצה' },
];

const StudentGroupsContainer = () => {
  const title = 'שיוך תלמידות לקבוצות';
  const entity = STUDENT_GROUPS;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default StudentGroupsContainer;
