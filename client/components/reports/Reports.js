import React, { useCallback, useEffect, useMemo } from 'react';
import MaterialTable from 'material-table';

import { REPORTS } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { useDispatch, useSelector } from 'react-redux';
import { materialTableOptions, materialTableLocalizations } from '../../config/config';

const getColumns = (lookups) => [
  { field: 'student_id', title: 'תלמידה', lookup: lookups.students },
  { field: 'enter_hour', title: 'שעת כניסה' },
  { field: 'exit_hour', title: 'שעת יציאה' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  { field: 'teacher_id', title: 'מורה', lookup: lookups.teachers },
  { field: 'teacher_tz', title: 'תז מורה' },
  { field: 'lesson_number', title: 'מספר שיעור' },
  { field: 'other_students', title: 'תלמידות נוספות' },
  { field: 'report_type_id', title: 'סוג דיווח', lookup: lookups.reportTypes },
];

const getEditLookup = (data) =>
  data ? Object.fromEntries(data.map(({ id, name }) => [id, name])) : {};

const Reports = () => {
  const dispatch = useDispatch();
  const { data, editData } = useSelector((state) => state[REPORTS]);

  useEffect(() => {
    dispatch(crudAction.fetchAll(REPORTS));
    dispatch(crudAction.getEditData(REPORTS));
  }, []);

  const editDataLists = useMemo(
    () => ({
      students: getEditLookup(editData && editData.students),
      teachers: getEditLookup(editData && editData.teachers),
      reportTypes: getEditLookup(editData && editData.reportTypes),
    }),
    [editData]
  );
  const columns = useMemo(() => getColumns(editDataLists), [editData]);

  const getSaveItem = (rowData) => {
    const dataToSave = {
      ...rowData,
      report_date:
        rowData.report_date instanceof Date
          ? rowData.report_date.toISOString().substr(0, 10)
          : rowData.report_date.substr(0, 10),
      tableData: undefined,
    };
    return dispatch(crudAction.submitForm(REPORTS, dataToSave, dataToSave.id));
  };
  const onRowAdd = useCallback(getSaveItem);
  const onRowUpdate = useCallback(getSaveItem);
  const onRowDelete = useCallback((rowData) =>
    dispatch(crudAction.destroyItem(REPORTS, rowData.id))
  );

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>צפיות</h2>

      <MaterialTable
        title="נתונים"
        columns={columns}
        data={data || []}
        isLoading={!data}
        editable={{ onRowAdd, onRowUpdate, onRowDelete }}
        options={materialTableOptions}
        localization={materialTableLocalizations}
      />
    </div>
  );
};

export default Reports;
