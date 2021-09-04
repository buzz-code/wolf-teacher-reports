import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';

const getColumns = () => [
  { field: 'teacher_name', title: 'שם המורה', columnOrder: 'teachers.name' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  { field: 'pds_type_name_1', title: 'שיעור 1' },
  { field: 'pds_type_name_2', title: 'שיעור 2' },
  { field: 'pds_type_name_3', title: 'שיעור 3' },
  { field: 'pds_type_name_4', title: 'שיעור 4' },
];
const getFilters = () => [
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
  { field: 'att_types_1.name', label: 'שיעור 1', type: 'text', operator: 'like' },
  { field: 'att_types_2.name', label: 'שיעור 2', type: 'text', operator: 'like' },
  { field: 'att_types_3.name', label: 'שיעור 3', type: 'text', operator: 'like' },
  { field: 'att_types_4.name', label: 'שיעור 4', type: 'text', operator: 'like' },
];

const PdsReportsContainer = ({ entity, title }) => {
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

export default PdsReportsContainer;
