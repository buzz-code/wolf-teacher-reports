import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { ATT_TYPES } from '../../constants/entity';

const getColumns = () => [{ field: 'name', title: 'שם' }];

const AttTypesContainer = () => {
  const title = 'סוגי דיווח';
  const entity = ATT_TYPES;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default AttTypesContainer;
