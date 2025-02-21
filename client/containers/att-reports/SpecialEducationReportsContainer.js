import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import EditIcon from '@material-ui/icons/Edit';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForHebrewDate } from '../../../common-modules/client/utils/formUtil';

import { defaultYear, yearsList } from '../../services/yearService';

const getColumns = (handleEditComment) => [
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
  { field: 'how_many_lessons', title: 'כמה שיעורים צפו אצלך?' },
  { field: 'how_many_students_watched', title: 'כמה תלמידות צפו אצלך?' },
  { field: 'how_many_students_teached', title: 'כמה שיעורים מסרו אצלך?' },
  { field: 'was_phone_discussing', title: 'האם היה דיון טלפוני?', type: 'boolean' },
  { field: 'your_training_teacher', title: 'מורה מנחה' },
  { field: 'what_speciality', title: 'התמחות' },
  { field: 'regular_pay', title: 'שכר רגיל' },
  { field: 'extra_pay', title: 'שכר מיוחד' },
  { field: 'total_pay', title: 'סה"כ שכר' },
  {
    field: 'salary_month',
    title: 'חודש שכר',
    type: 'date',
    render: ({ salary_month }) => (salary_month ? moment(salary_month).format('MM-yyyy') : ''),
  },
  {
    field: 'comment',
    title: 'הערה לשכר',
    render: (rowData) => (
      <>
        <EditIcon onClick={() => handleEditComment(rowData)} />
        {rowData.comment}
      </>
    ),
  },
];
const getFilters = () => [
  { field: 'teachers.name', label: 'מורה', type: 'text', operator: 'like' },
  { field: 'teachers.tz', label: 'תז', type: 'text', operator: 'like' },
  { field: 'teachers.training_teacher', label: 'מורה מנחה', type: 'text', operator: 'like' },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
  { field: 'salary_month', label: 'חודש שכר', type: 'date', operator: null },
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
const getActions = (handleUpdateSalaryMonth) => [
  {
    icon: 'fact_check',
    tooltip: 'עדכן חודש שכר',
    isFreeAction: true,
    onClick: handleUpdateSalaryMonth,
  },
];

const SpecialEducationReportsContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    data,
    POST: { '../updateSalaryMonth': updateSalaryMonth },
  } = useSelector((state) => state[entity]);

  const [refreshButton, setRefreshButton] = useState(null);
  const [conditions, setConditions] = useState({});

  useEffect(() => {
    if (updateSalaryMonth && refreshButton) {
      refreshButton.click();
    }
  }, [updateSalaryMonth]);

  const handleUpdateSalaryMonth = useCallback(
    (e) => {
      const refreshButton = e.currentTarget.previousElementSibling;
      setRefreshButton(refreshButton);

      const ids = data ? data.map((item) => item.id) : [];
      const salaryMonth = conditions[6]?.value;

      if (!ids.length || !salaryMonth) {
        alert('לא ניתן לעדכן חודש שכר אם אין נתונים או לא נבחר חודש');
        return;
      }

      dispatch(
        crudAction.customHttpRequest(entity, 'POST', '../updateSalaryMonth', { ids, salaryMonth })
      );
    },
    [entity, data, conditions]
  );
  const handleEditComment = useCallback(
    (rowData) => {
      const comment = prompt('הקלידי הערה', rowData.comment || '');
      if (comment === null) {
        return;
      }

      rowData.comment = comment;
      dispatch(
        crudAction.customHttpRequest(entity, 'POST', '../updateSalaryComment', {
          id: rowData.id,
          comment,
        })
      );
    },
    [entity]
  );

  const columns = useMemo(() => getColumns(handleEditComment), [handleEditComment]);
  const filters = useMemo(() => getFilters(), []);
  const actions = useMemo(() => getActions(handleUpdateSalaryMonth), [handleUpdateSalaryMonth]);

  return (
    <Table
      entity={entity}
      title={title}
      columns={columns}
      filters={filters}
      additionalActions={actions}
      disableAdd={true}
      disableUpdate={true}
      disableDelete={true}
      onConditionUpdate={setConditions}
      customMaterialOptions={{
        pageSize: 200,
      }}
    />
  );
};

export default SpecialEducationReportsContainer;
