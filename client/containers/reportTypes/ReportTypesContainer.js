import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { REPORT_TYPES } from '../../constants/entity';

const getColumns = () => [{ field: 'name', title: 'סוג צפיה' }];

const ReportTypesContainer = () => {
  const title = 'סוגי צפיה';
  const entity = REPORT_TYPES;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default ReportTypesContainer;
