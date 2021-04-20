import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { STUDENTS as entity } from '../../constants/entity';
import { STUDENTS as title } from '../../constants/entity-title';

const getColumns = () => [
  { field: 'tz', title: 'תעודת זהות' },
  { field: 'name', title: 'שם' },
];

const StudentsContainer = () => {
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default StudentsContainer;
