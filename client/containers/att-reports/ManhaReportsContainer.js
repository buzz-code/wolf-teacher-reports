import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';

const getColumns = () => [
  { field: 'teacher_name', title: 'שם המורה', columnOrder: 'teachers.name' },
  { field: 'teacher_tz', title: 'תז', columnOrder: 'teachers.tz' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  { field: 'update_date', title: 'תאריך עדכון', type: 'date' },
  { field: 'how_many_methodic', title: 'כמה שיעורים היו לך היום' },
];
const getFilters = () => [
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
  { field: 'teachers.tz', label: 'תז', type: 'text', operator: 'like' },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
  { field: 'update_date', label: 'מתאריך עדכון', type: 'date', operator: 'date-before' },
  { field: 'update_date', label: 'עד תאריך עדכון', type: 'date', operator: 'date-after' },
];

const ManhaReportsContainer = ({ entity, title }) => {
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

export default ManhaReportsContainer;
