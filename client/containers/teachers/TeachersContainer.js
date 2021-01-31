import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { TEACHERS } from '../../constants/entity';

const getColumns = () => [
  { field: 'tz', title: 'תעודת זהות' },
  { field: 'name', title: 'שם' },
];

const TeachersContainer = () => {
  const title = 'מורות';
  const entity = TEACHERS;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default TeachersContainer;
