import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';

const getColumns = () => [
  { field: 'key', title: 'מזהה', type: 'numeric' },
  { field: 'name', title: 'שם' },
];
const getFilters = () => [
  { field: 'key', label: 'מזהה', type: 'text', operator: 'like' },
  { field: 'name', label: 'שם', type: 'text', operator: 'like' },
];

const AttTypesContainer = ({ entity, title }) => {
  const columns = useMemo(() => getColumns(), []);
  const filters = useMemo(() => getFilters(), []);

  return (
    <Table
      entity={entity}
      title={title}
      columns={columns}
      filters={filters}
      disableAdd={true}
      disableUpdate={true}
      disableDelete={true}
      customMaterialOptions={{
        pageSize: 200,
      }}
    />
  );
};

export default AttTypesContainer;
