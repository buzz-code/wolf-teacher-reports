import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { ATT_TYPES as entity } from '../../constants/entity';
import { ATT_TYPES as title } from '../../constants/entity-title';

const getColumns = () => [{ field: 'name', title: 'שם' }];

const AttTypesContainer = () => {
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default AttTypesContainer;
