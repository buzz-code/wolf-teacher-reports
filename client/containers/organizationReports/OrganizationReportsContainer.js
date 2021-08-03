import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';
import { ORGANIATION_REPORTS as entity } from '../../constants/entity';
import { ORGANIATION_REPORTS as title } from '../../constants/entity-title';

const getColumns = () => [
  { field: 'teacher_full_phone', title: 'טלפון מורה' },
  { field: 'teacher_name', title: 'שם' },
  { field: 'report_date', title: 'תאריך' },
  { field: 'students', title: 'תלמידות' },
];

const OrganizationReportsContainer = () => {
  const columns = useMemo(() => getColumns(), []);

  return (
    <Table
      entity={entity}
      title={title}
      columns={columns}
      disableAdd={true}
      disableUpdate={true}
      disableDelete={true}
    />
  );
};

export default OrganizationReportsContainer;
