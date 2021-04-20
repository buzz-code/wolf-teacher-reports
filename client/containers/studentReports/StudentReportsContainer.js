import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { STUDENT_REPORTS as entity } from '../../constants/entity';
import { STUDENT_REPORTS as title } from '../../constants/entity-title';

const getColumns = () => [
  { field: 'student_tz', title: 'תעודת זהות' },
  { field: 'student_name', title: 'שם' },
  { field: 'report_date', title: 'תאריך' },
  { field: 'enter_hour', title: 'שעת כניסה' },
  { field: 'exit_hour', title: 'שעת יציאה' },
  { field: 'count', title: 'מספר שיעורים' },
];

const StudentReportsContainer = () => {
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

export default StudentReportsContainer;
