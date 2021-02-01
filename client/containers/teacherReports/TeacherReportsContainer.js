import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { TEACHER_REPORTS } from '../../constants/entity';

const getColumns = () => [
  { field: 'teacher_tz', title: 'תעודת זהות' },
  { field: 'teacher_name', title: 'שם' },
  { field: 'report_date', title: 'תאריך' },
  { field: 'lesson_number', title: 'מספר שיעור' },
  { field: 'count', title: 'מספר צופות' },
];

const TeacherReportsContainer = () => {
  const title = 'דו"ח למורה';
  const entity = TEACHER_REPORTS;
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

export default TeacherReportsContainer;
