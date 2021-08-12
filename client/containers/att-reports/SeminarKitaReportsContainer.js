import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';

const getColumns = () => [
  { field: 'teacher_name', title: 'שם המורה' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  { field: 'lesson_1', title: 'כמה שיעורי צפיה או פרטני' },
  { field: 'lesson_2', title: 'כמה שיעור צפיה או מעורבות' },
  { field: 'lesson_3', title: 'כמה שיעורי דיון' },
  { field: 'lesson_4', title: 'כמה שיעורים התלמידה חסרה' },
];
const getFilters = () => [
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
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
