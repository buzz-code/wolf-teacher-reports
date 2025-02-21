import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';

const getColumns = () => [
  { field: 'question_name', title: 'שאלה', editable: 'never' },
  { field: 'teacher_name', title: 'שם המורה', columnOrder: 'teachers.name', editable: 'never' },
  { field: 'teacher_tz', title: 'תז המורה', columnOrder: 'teachers.tz', editable: 'never' },
  { field: 'answer_date', title: 'תאריך', type: 'date', editable: 'never' },
  { field: 'answer', title: 'תשובה' },
  { field: 'report_id', title: 'האם מחובר לדיווח?', type: 'boolean', editable: 'never' },
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

  const manipulateDataToSave = (dataToSave) => ({
    ...dataToSave,
    question_name: undefined,
    teacher_name: undefined,
    teacher_tz: undefined,
    answer_date: undefined,
  });

  return (
    <Table
      entity={entity}
      title={title}
      columns={columns}
      filters={filters}
      manipulateDataToSave={manipulateDataToSave}
      disableAdd={true}
      customMaterialOptions={{
        pageSize: 200,
      }}
    />
  );
};

export default AnswersContainer;
