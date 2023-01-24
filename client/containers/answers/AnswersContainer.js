import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';

const getColumns = () => [
  { field: 'question_name', title: 'שאלה' },
  { field: 'teacher_name', title: 'שם המורה', columnOrder: 'teachers.name' },
  { field: 'teacher_tz', title: 'תז המורה', columnOrder: 'teachers.tz' },
  { field: 'answer_date', title: 'תאריך' },
  { field: 'answer', title: 'תשובה' },
];
const getFilters = () => [
  { field: 'questions.name', label: 'שאלה', type: 'text', operator: 'like' },
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
  { field: 'answer_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'answer_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
  { field: 'answer', label: 'תשובה', type: 'text', operator: 'like' },
];

const AnswersContainer = ({ entity, title }) => {
  const columns = useMemo(() => getColumns(), []);
  const filters = useMemo(() => getFilters(), []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default AnswersContainer;
