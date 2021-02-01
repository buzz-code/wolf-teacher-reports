import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { STUDENT_REPORTS } from '../../constants/entity';

const getColumns = () => [
  { field: 'student_tz', title: 'תעודת זהות' },
  { field: 'student_name', title: 'שם' },
  { field: 'report_date', title: 'תאריך' },
  { field: 'enter_hour', title: 'שעת כניסה' },
  { field: 'exit_hour', title: 'שעת יציאה' },
  { field: 'count', title: 'מספר שיעורים' },
];

const StudentReportsContainer = () => {
  const title = 'דו"ח לתלמידה';
  const entity = STUDENT_REPORTS;
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
