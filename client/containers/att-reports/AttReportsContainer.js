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
const getFilters = () => [
  { field: 'student_id', label: 'תלמידה', type: 'text', operator: 'like' },
  { field: 'teacher_id', label: 'מורה', type: 'text', operator: 'like' },
  { field: 'lesson_id', label: 'שיעור', type: 'text', operator: 'like' },
  { field: 'lesson_time_id', label: 'זמן השיעור', type: 'text', operator: 'like' },
  { field: 'att_type_id', label: 'סוג דיווח', type: 'text', operator: 'like' },
  { field: 'enter_time', label: 'שעת כניסה', type: 'text', operator: 'like' },
];

const AttReportsContainer = ({ entity, title }) => {
  const columns = useMemo(() => getColumns(), []);
  const filters = useMemo(() => getFilters(), []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default AttReportsContainer;
