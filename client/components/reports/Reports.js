import React, { useEffect } from 'react';
import MaterialTable from 'material-table';

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

  const getSaveItem = console.log; // (rowData)=>({ ...rowData, tableData: undefined, report_date: rowData.report_date.toISOString().substr(0, 10) })
  const onRowAdd = (rowData) => dispatch(crudAction.storeItem(REPORTS, getSaveItem(rowData)));
  const onRowUpdate = (oldData, newData) =>
    dispatch(crudAction.updateItem(REPORTS, getSaveItem(newData), newData.id));
  const onRowDelete = (rowData) => dispatch(crudAction.destroyItem(REPORTS, rowData.id));

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>נתוני הבנות</h2>

      {data && (
        <MaterialTable
          title="נתונים"
          columns={columns}
          data={data}
          editable={{ onRowAdd, onRowUpdate, onRowDelete }}
          options={{ actionsColumnIndex: -1 }}
        />
      )}
    </div>
  );
};

export default Reports;
