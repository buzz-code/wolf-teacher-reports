import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { GROUPS as entity } from '../../constants/entity';
import { GROUPS as title } from '../../constants/entity-title';

const getColumns = () => [
  { field: 'key', title: 'מזהה' },
  { field: 'name', title: 'שם' },
  { field: 'is_klass', title: 'כיתה?', type: 'boolean' },
];

const GroupsContainer = () => {
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default GroupsContainer;
