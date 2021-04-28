import React, { useMemo } from 'react';

import Table from '../../components/table/Table';

const getColumns = () => [
  { field: 'student_id', title: 'תלמידה' },
  { field: 'teacher_id', title: 'מורה' },
  { field: 'lesson_id', title: 'שיעור' },
  { field: 'lesson_time_id', title: 'זמן השיעור' },
  { field: 'att_type_id', title: 'סוג דיווח' },
  { field: 'enter_time', title: 'שעת כניסה' },
];
const getFilters = () => [];

const AttReportsContainer = ({ entity, title }) => {
  const columns = useMemo(() => getColumns(), []);
  const filters = useMemo(() => getFilters(), []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default AttReportsContainer;
