import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import heLocale from 'date-fns/locale/he';

import { REPORTS } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { useDispatch, useSelector } from 'react-redux';

const columns = [
  { field: 'student_id', title: 'תלמידה' },
  { field: 'enter_hour', title: 'שעת כניסה' },
  { field: 'exit_hour', title: 'שעת יציאה' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  { field: 'teacher_id', title: 'מורה' },
  { field: 'teacher_tz', title: 'תז מורה' },
  { field: 'lesson_number', title: 'מספר שיעור' },
  { field: 'other_students', title: 'תלמידות נוספות' },
  { field: 'report_type_id', title: 'סוג דיווח' },
];

const Reports = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.reports.data);
  console.log(data);

  useEffect(() => {
    dispatch(crudAction.fetchAll(REPORTS));
  }, []);

  const getSaveItem = (rowData) => ({
    ...rowData,
    report_date:
      rowData.report_date instanceof Date
        ? rowData.report_date.toISOString().substr(0, 10)
        : rowData.report_date.substr(0, 10),
    tableData: undefined,
  });
  const onRowAdd = (rowData) => dispatch(crudAction.storeItem(REPORTS, getSaveItem(rowData)));
  const onRowUpdate = (newData, oldData) =>
    dispatch(crudAction.updateItem(REPORTS, getSaveItem(newData), newData.id));
  const onRowDelete = (rowData) => dispatch(crudAction.destroyItem(REPORTS, rowData.id));

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>צפיות</h2>

      {data && (
        <MaterialTable
          title="נתונים"
          columns={columns}
          data={data}
          editable={{ onRowAdd, onRowUpdate, onRowDelete }}
          options={{ actionsColumnIndex: -1 }}
          localization={{
            body: {
              dateTimePickerLocalization: heLocale,
            },
          }}
        />
      )}
    </div>
  );
};

export default Reports;
