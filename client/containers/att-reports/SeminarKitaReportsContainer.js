import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';

const getColumns = () => [
  { field: 'teacher_name', title: 'שם המורה', columnOrder: 'teachers.name' },
  { field: 'teacher_tz', title: 'תז', columnOrder: 'teachers.tz' },
  {
    field: 'teacher_training_teacher',
    title: 'מורה מנחה',
    columnOrder: 'teachers.training_teacher',
  },
  { field: 'teacher_salary_type', title: 'סוג שכר', columnOrder: 'teacher_salary_types.name' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  { field: 'update_date', title: 'תאריך עדכון', type: 'date' },
  { field: 'first_conference', title: 'השתתפות במפגש פתיחה', type: 'numeric' },
  { field: 'second_conference', title: 'השתתפות במפגש חנוכה', type: 'numeric' },
  { field: 'lesson_1', title: 'כמה שיעורי צפיה או פרטני' },
  { field: 'lesson_2', title: 'כמה שיעור צפיה או מעורבות' },
  { field: 'lesson_3', title: 'כמה שיעורי דיון' },
  { field: 'lesson_4', title: 'כמה שיעורים התלמידה חסרה' },
  { field: 'total_pay', title: 'סה"כ לתשלום' },
];
const getFilters = () => [
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
  { field: 'teachers.tz', label: 'תז', type: 'text', operator: 'like' },
  { field: 'teachers.training_teacher', label: 'מורה מנחה', type: 'text', operator: 'like' },
  { field: 'teacher_salary_types.name', label: 'סוג שכר', type: 'text', operator: 'like' },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
];

const SeminarKitaReportsContainer = ({ entity, title }) => {
  const columns = useMemo(() => getColumns(), []);
  const filters = useMemo(() => getFilters(), []);

  return (
    <Table
      entity={entity}
      title={title}
      columns={columns}
      filters={filters}
      disableAdd={true}
      disableUpdate={true}
      disableDelete={true}
    />
  );
};

export default SeminarKitaReportsContainer;
