import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { TEXTS } from '../../constants/entity';

const getColumns = () => [
  { field: 'name', title: 'שם', editable: 'onAdd' },
  { field: 'description', title: 'תיאור', editable: 'onAdd' },
  { field: 'value', title: 'ערך' },
];

const TextsContainer = () => {
  const title = 'הודעות';
  const entity = TEXTS;
  const columns = useMemo(() => getColumns(), []);

  return (
    <Table entity={entity} title={title} columns={columns} disableAdd={true} disableDelete={true} />
  );
};

export default TextsContainer;
