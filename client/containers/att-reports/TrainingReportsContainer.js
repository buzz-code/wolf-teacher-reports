import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';
import { getPropsForHebrewDate } from '../../../common-modules/client/utils/formUtil';

import { defaultYear, yearsList } from '../../services/yearService';

const getColumns = () => [
  { field: 'teacher_name', title: 'שם המורה', columnOrder: 'teachers.name' },
  { field: 'teacher_tz', title: 'תז', columnOrder: 'teachers.tz' },
  {
    field: 'teacher_training_teacher',
    title: 'מורה מנחה',
    columnOrder: 'teachers.training_teacher',
  },
  { field: 'teacher_school', title: 'בית ספר', columnOrder: 'teachers.school' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  {
    field: 'report_date',
    title: 'תאריך דיווח עברי',
    ...getPropsForHebrewDate('report_date'),
    editable: 'never',
  },
  { field: 'report_date_weekday', title: 'יום בשבוע', editable: 'never' },
  { field: 'update_date', title: 'תאריך עדכון', type: 'date' },
  { field: 'how_many_watched', title: 'כמה שיעורים צפו אצלך?' },
  { field: 'how_many_student_teached', title: 'כמה שיעורים מסרו אצלך?' },
  { field: 'was_discussing', title: 'האם היה דיון?', type: 'boolean' },
  { field: 'how_many_private_lessons', title: 'כמה שיעורים פרטיים?' },
  { field: 'training_teacher', title: 'מורה מאמנת', columnOrder: 'att_reports.training_teacher' },
  { field: 'regular_pay', title: 'שכר רגיל' },
  { field: 'extra_pay', title: 'שכר מיוחד' },
  { field: 'total_pay', title: 'סה"כ שכר' },
];
const getFilters = () => [
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
  { field: 'teachers.tz', label: 'תז', type: 'text', operator: 'like' },
  { field: 'teachers.training_teacher', label: 'מורה מנחה', type: 'text', operator: 'like' },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
  { field: 'update_date', label: 'מתאריך עדכון', type: 'date', operator: 'date-before' },
  { field: 'update_date', label: 'עד תאריך עדכון', type: 'date', operator: 'date-after' },
  {
    field: 'year',
    label: 'שנה',
    type: 'list',
    operator: 'eq',
    list: yearsList,
    defaultValue: defaultYear,
  },
];

const TrainingReportsContainer = ({ entity, title }) => {
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
      customMaterialOptions={{
        pageSize: 200,
      }}
    />
  );
};

export default TrainingReportsContainer;
