import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { STUDENTS } from '../../constants/entity';

const getColumns = () => [
  { field: 'tz', title: 'תעודת זהות' },
  { field: 'name', title: 'שם' },
  { field: 'phone_number', title: 'מספר טלפון' },
];

const StudentsContainer = () => {
  const title = 'תלמידות';
  const entity = STUDENTS;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default StudentsContainer;
