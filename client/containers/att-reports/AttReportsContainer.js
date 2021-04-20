import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { ATT_REPORTS as entity } from '../../constants/entity';
import { ATT_REPORTS as title } from '../../constants/entity-title';

const getColumns = () => [
  { field: 'student_id', title: 'תלמידה' },
  { field: 'teacher_id', title: 'מורה' },
  { field: 'lesson_id', title: 'שיעור' },
  { field: 'lesson_time_id', title: 'זמן השיעור' },
  { field: 'att_type_id', title: 'סוג דיווח' },
  { field: 'enter_time', title: 'שעת כניסה' },
];

const AttReportsContainer = () => {
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default AttReportsContainer;
