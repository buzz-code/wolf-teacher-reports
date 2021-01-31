import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { ORGANIATION_REPORTS } from '../../constants/entity';

const getColumns = () => [
  { field: 'teacher_tz', title: 'תעודת זהות' },
  { field: 'teacher_name', title: 'שם' },
  { field: 'report_date', title: 'תאריך' },
  { field: 'students', title: 'תלמידות' },
];

const OrganizationReportsContainer = () => {
  const title = 'דו"ח לארגון צפיה';
  const entity = ORGANIATION_REPORTS;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} readOnly={true} />;
};

export default OrganizationReportsContainer;
