import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { ATT_REPORTS } from '../../constants/entity';

const getColumns = () => [
  { field: 'student_id', title: 'תלמידה' },
  { field: 'teacher_id', title: 'מורה' },
  { field: 'lesson_id', title: 'שיעור' },
  { field: 'lesson_time_id', title: 'זמן השיעור' },
  { field: 'att_type_id', title: 'סוג דיווח' },
  { field: 'enter_time', title: 'שעת כניסה' },
];

const AttReportsContainer = () => {
  const title = 'דיווחים';
  const entity = ATT_REPORTS;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default AttReportsContainer;
