import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import EditIcon from '@material-ui/icons/Edit';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

import { defaultYear, yearsList } from '../../services/yearService';

const getColumns = (handleEditComment, { teachers, attTypes, teacherTypes, salaryReports }) => [
  { field: 'teacher_name', title: 'שם המורה', columnOrder: 'teachers.name' },
  { field: 'teacher_tz', title: 'תז', columnOrder: 'teachers.tz' },
  { field: 'report_teacher_name', title: 'שם המורה המדווחת', columnOrder: 'report_teachers.name' },
  {
    field: 'teacher_type_id',
    title: 'סוג המורה',
    ...getPropsForAutoComplete('teacher_type_id', teacherTypes, 'key'),
  },
  { field: 'report_month', title: 'חודש הדיווח', type: 'date' },
  // { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  // { field: 'update_date', title: 'תאריך עדכון', type: 'date' },
  // { field: 'how_many_students', title: 'כמה תלמידות?' },
  // { field: 'was_students_good', title: 'האם התנהגו כראוי?' },
  // { field: 'was_students_enter_on_time', title: 'האם נכנסו בזמן?', type: 'boolean' },
  // { field: 'was_students_exit_on_time', title: 'האם יצאו בזמן?', type: 'boolean' },
  // { field: 'was_discussing', title: 'האם היה דיון?', type: 'boolean' },
  { field: 'is_confirmed', title: 'דיווח שאושר', type: 'boolean' },
  { field: 'total_pay', title: 'שכר למורה' },
  { field: 'salary_report_name', title: 'דוח שכר' },
  // {
  //   field: 'salary_month',
  //   title: 'חודש שכר',
  //   type: 'date',
  //   render: ({ salary_month }) => (salary_month ? moment(salary_month).format('MM-yyyy') : ''),
  // },
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
const getFilters = ({ teachers, attTypes, teacherTypes, salaryReports }) => [
  { field: 'teachers.name', label: 'שם מורה', type: 'text', operator: 'like' },
  {
    field: 'teachers.id',
    label: 'מורה',
    type: 'list',
    list: teachers,
    operator: 'eq',
    idField: 'id',
  },
  {
    field: 'report_teachers.id',
    label: 'מורה מדווחת',
    type: 'list',
    list: teachers,
    operator: 'eq',
    idField: 'id',
  },
  {
    field: 'teachers.teacher_type_id',
    label: 'סוג מורה',
    type: 'list',
    list: teacherTypes,
    operator: 'eq',
    idField: 'key',
  },
  {
    field: 'att_reports.salaryReport',
    label: 'דוח שכר',
    type: 'list',
    list: salaryReports,
    operator: 'eq',
  },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
  {
    field: 'year',
    label: 'שנה',
    type: 'list',
    operator: 'eq',
    list: yearsList,
    defaultValue: defaultYear,
  },
];
const getActions = (handleCreateSalaryReport) => [
  {
    icon: 'fact_check',
    tooltip: 'העבר לשכר',
    onClick: handleCreateSalaryReport,
  },
];

const TotalMonthlyReportsContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    data,
    GET: { '../get-edit-data': editData },
    POST: { '../createSalaryReport': createSalaryReport },
  } = useSelector((state) => state[entity]);

  const [refreshButton, setRefreshButton] = useState(null);
  const [conditions, setConditions] = useState({});

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', '../get-edit-data'));
  }, []);

  useEffect(() => {
    if (createSalaryReport && refreshButton) {
      refreshButton.click();
    }
  }, [createSalaryReport]);

  const handleCreateSalaryReport = useCallback(
    (e, selectedRows) => {
      const refreshButton = e.currentTarget.previousElementSibling;
      setRefreshButton(refreshButton);

      const ids = selectedRows.map((item) => item.id).join(',');

      dispatch(crudAction.customHttpRequest(entity, 'POST', '../createSalaryReport', { ids }));
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

  const columns = useMemo(() => editData && getColumns(handleEditComment, editData), [
    handleEditComment,
    editData,
  ]);
  const filters = useMemo(() => editData && getFilters(editData), [editData]);
  const actions = useMemo(() => getActions(handleCreateSalaryReport), [handleCreateSalaryReport]);

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
      isBulkDelete={true}
    />
  );
};

export default TotalMonthlyReportsContainer;
