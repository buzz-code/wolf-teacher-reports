import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';

const getColumns = () => [
  { field: 'teacher_name', title: 'שם המורה', columnOrder: 'teachers.name' },
  { field: 'teacher_tz', title: 'תז', columnOrder: 'teachers.tz' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  { field: 'update_date', title: 'תאריך עדכון', type: 'date' },
  { field: 'four_last_digits_of_teacher_phone', title: '4 ספרות אחרונות' },
  { field: 'teacher_to_report_for_name', title: 'שם המורה המאמנת' },
  { field: 'how_many_watched_lessons', title: 'שיעורי צפיה' },
  { field: 'how_many_students_teached', title: 'שיעורי מסירה' },
  { field: 'how_many_yalkut_lessons', title: 'שיעור ילקוט' },
  { field: 'how_many_students_help_teached', title: 'עזרה במרתון' },
  { field: 'how_many_discussing_lessons', title: 'דיון' },
  { field: 'total_pay', title: 'שכר למורה' },
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
