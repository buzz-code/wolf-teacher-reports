import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { TEACHERS as entity } from '../../constants/entity';
import { TEACHERS as title } from '../../constants/entity-title';

const getColumns = () => [
  { field: 'tz', title: 'תעודת זהות' },
  { field: 'name', title: 'שם' },
  { field: 'phone', title: 'מספר טלפון' },
];

const TeachersContainer = () => {
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default TeachersContainer;
