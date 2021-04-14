import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { GROUPS } from '../../constants/entity';

const getColumns = () => [
  { field: 'name', title: 'שם' },
  { field: 'is_klass', title: 'כיתה?', type: 'boolean' },
];

const GroupsContainer = () => {
  const title = 'קבוצות';
  const entity = GROUPS;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default GroupsContainer;
