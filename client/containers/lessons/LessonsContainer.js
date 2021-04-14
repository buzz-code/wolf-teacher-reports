import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { LESSONS } from '../../constants/entity';

const getColumns = () => [{ field: 'name', title: 'שם' }];

const LessonsContainer = () => {
  const title = 'שיעורים';
  const entity = LESSONS;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default LessonsContainer;
