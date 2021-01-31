import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { TEXTS } from '../../constants/entity';

const getColumns = () => [
  { field: 'name', title: 'שם' },
  { field: 'description', title: 'תיאור' },
  { field: 'value', title: 'ערך' },
];

const TextsContainer = () => {
  const title = 'הודעות';
  const entity = TEXTS;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default TextsContainer;
