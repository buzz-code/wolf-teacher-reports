import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { LESSONS as entity } from '../../constants/entity';
import { LESSONS as title } from '../../constants/entity-title';

const getColumns = () => [{ field: 'name', title: 'שם' }];

const LessonsContainer = () => {
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default LessonsContainer;
